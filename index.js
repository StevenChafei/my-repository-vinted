const express = require("express");
const mongoose = require("mongoose");

const fileUpload = require("express-fileupload");

const isAuthenticated = require("./middlewares/isAuthenticated");

const cloudinary = require("cloudinary").v2;

const app = express();
app.use(express.json());

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/andromeda-vinted");

// Données à remplacer avec les vôtres :
cloudinary.config({
  cloud_name: "dsoydeobc",
  api_key: "336911827334496",
  api_secret: "P6Ra-NnE7h8o4xZXhPozcqQjY2I",
  secure: true,
});
//

const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");

app.use(userRoutes);
app.use(offerRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ message: "This routes doesn't exist" });
});

app.listen(3000, () => {
  console.log("Server started 🧦");
});
