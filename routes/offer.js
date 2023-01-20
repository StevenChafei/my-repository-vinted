const express = require("express");

const router = express.Router();

const fileUpload = require("express-fileupload");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { find } = require("../models/Offer");

const cloudinary = require("cloudinary").v2;

const Offer = require("../models/Offer");

// Données à remplacer avec les vôtres :
cloudinary.config({
  cloud_name: "dsoydeobc",
  api_key: "336911827334496",
  api_secret: "P6Ra-NnE7h8o4xZXhPozcqQjY2I",
});

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

// convertToBase64(req.files.pictures[0]);

router.post(
  "/offer/publish",
  fileUpload(),
  isAuthenticated,
  async (req, res) => {
    try {
      const { title, description, price, condition, city, brand, size, color } =
        req.body;

      const pictureToUpload = req.files.picture;

      const result = await cloudinary.uploader.upload(
        convertToBase64(pictureToUpload),
        {
          folder: "/Vinted",
        }
      );
      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          { ETAT: condition },
          { EMPLACEMENT: city },
          { MARQUE: brand },
          { TAILLE: size },
          { COULEUR: color },
        ],
        product_image: result,
        owner: req.user,
      });

      await newOffer.save();

      const newOfferToShow = await Offer.findOne({ owner: req.user }).populate(
        "owner"
      );
      res.json(newOfferToShow);
      // res.status(200).json({
      // //   message: `Offer successfully created !`,
      // //   newOffer,
      // // });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.get("/offers", async (req, res) => {
  try {
    const { title, priceMin, priceMax } = req.query;

    const filters = {};
    if (title) {
      filters.product_name = new RegExp(title, "i");
    }

    if (priceMin) {
      filters.product_price = { $gte: Number(priceMin) };
    }

    console.log(filters);

    if (priceMax) {
      if (filters.product_price) {
        filters.product_price.$lte = Number(priceMax);
      } else {
        filters.product_price = { $lte: Number(priceMax) };
      }
    }
    console.log(filters);

    const sortFilter = {};

    const offers = await Offer.find(filters)
      .sort(sortFilter)
      .select("product_price product_name");
    res.json(offers);

    // const offers = await Offer.find().select("product_name product_price -_id");
    // res.json(offers);
    // const regExp = /nike/i;

    // const regExp = new RegExp("blanc");
    // const results = await Offer.find({ product_description: regExp }).select(
    //   "product_name product_description product_price -_id"
    // );

    // const results = await Offer.find({ product_price: { $gt: 4 } })
    //   .select("product_name product_price -_id")
    //   .sort({ product_price: "desc" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

// router.get("/offers", async (req, res) => {
// FIND
//   const regExp = /chaussettes/i;
//   const regExp = new RegExp("e", "i");
//   const results = await Offer.find({ product_name: regExp }).select(
//     "product_name product_price"
//   );

//   FIND AVEC FOURCHETTES DE PRIX
//   $gte =  greater than or equal >=
//   $lte = lower than or equal <=
//   $lt = lower than <
//   $gt = greater than >
//   const results = await Offer.find({
//     product_price: {
//       $gte: 55,
//       $lte: 200,
//     },
//   }).select("product_name product_price");

//   SORT
//   "asc" === "ascending" === 1
//   "desc" === "descending" === -1
//   const results = await Offer.find()
//     .sort({ product_price: -1 })
//     .select("product_name product_price");

//   ON PEUT TOUT CHAINER
// const results = await Offer.find({
//   product_name: /vert/i,
//   product_price: { $gte: 20, $lte: 200 },
// })
//   .sort({ product_price: -1 })
//   .select("product_name product_price");

//   SKIP ET LIMIT
//   const results = await Offer.find()
//     .skip(10)
//     .limit(5)
//     .select("product_name product_price");

//     res.json(results);
//   });
