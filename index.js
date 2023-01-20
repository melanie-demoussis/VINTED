const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
require("dotenv").config(); //Permet d'activer les variables d'environnement qui se trouvent dans le fichier '.env'
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);

// Je me connecte à cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// J'importe les routes à utiliser
const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");
// je dis à mon serveur de les utiliser
app.use(userRoutes);
app.use(offerRoutes);

// Création d'une route sécuriser en cas de défaut

app.all("*", (req, res) => {
  res.status(400).json({ message: "THis route doesn't exist" });
});
// Je lance mon serveur
app.listen(process.env.PORT, () => {
  console.log("Server started");
});
