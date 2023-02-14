// Import d'express
const express = require("express");
// Import pour le téléchargement de fichier
// Utilisation de cloudinary
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
// Import du middlewares
const isAuthenticated = require("../middlewares/isAuthenticated");

const Offer = require("../models/Offer");

const router = express.Router();

// Fonction qui permet de transformer nos fichiers que l'on reçoit sous forme de buffer en base64 afin de pouvoir les upload sur cloudinary
const convertToBase64 = require("../utils/convertToBase64");
const { route } = require("./user");

// Ma fonction post prend deux middlewares en argument avant la fonction qui contient la route, IsAuthenticated permet de s'assurer que l'utilisateur qu fait la requête est bien connecté, fileupload permet de réceptionner des formadata
// Construction de la route pour publier :
//  Route = en post , trajet = /offer/publish, ira recupérer les fichiers, s'authentifiera, appliquera les requêtes et retournera les réponses.

router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      // // Dans cette route on crée un élément "offer", remplir toutes les clés, uploader l'image reçue sur cloudinary
      // console.log(req.body);
      // console.log(req.files);
      // console.log(req.user);
      // Destructuring
      const { title, description, price, condition, city, brand, size, color } =
        req.body;

      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,
        product_details: [
          {
            MARQUE: brand,
          },
          {
            TAILLE: size,
          },
          {
            COULEUR: color,
          },
          {
            ÉTAT: condition,
          },
          {
            EMPLACEMENT: city,
          },
        ],
        // product_image: [result],
        owner: req.user,
      });
      console.log(newOffer);
      const picture = req.files.picture;

      const result = await cloudinary.uploader.upload(convertToBase64(picture));

      newOffer.product_image = result;
      await newOffer.save();

      res.json(newOffer);
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
);

router.get("/offers", async (req, res) => {
  try {
    const { title, priceMin, priceMax, sort, page } = req.query;
    const filters = {};

    if (title) {
      filters.product_name = new RegExp(title, "i");
    }

    if (priceMin) {
      filters.product_price = {
        $gte: Number(priceMin),
      };
    }

    if (priceMax) {
      if (filters.product_price) {
        filters.product_price.$lte = Number(priceMax);
      } else {
        filters.product.price = {
          $lge: Number(priceMax),
        };
      }
    }
    const sortFilter = {};
    if (sort === "price_desc") {
      sortFilter.product_price = -1;
    } else if (sort === "price_asc") {
      sortFilter.porduct_price = 1;
    }

    let limit = 5;
    if (req.query.limit) {
      limit = req.query.limit;
    }
    let pageRequire = 1;
    if (req.query.page) {
      pageRequire = req.query.page;
    }
    const skip = (page - 1) * limit;

    const offers = await Offer.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("owner", "account");
    const count = await Offer.countDocuments(filters);

    const response = { count: count, offers: offers };

    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/offer/:id", async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id).populate(
      "owner",
      "account"
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/upload/muliple", fileUpload(), async (req, res) => {
  try {
    const picturesToUpload = req.files.pictures;
    if (req.files.pictures) {
      offer.product_image = req.files.pictures;
    }
    const result = await cloudinary.uploader.upload(convertToBase64(picture));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
