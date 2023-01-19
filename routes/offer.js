const express = require("express");

const router = express.Router();

const fileUpload = require("express-fileupload");
const isAuthenticated = require("../middlewares/isAuthenticated");

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
      // const newObjectId = "63c828972f389f5f0af80d9d";
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

module.exports = router;
