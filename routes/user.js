const express = require("express");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-Base64");
const router = express.Router();
const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  try {
    // console.log(req.body);
    // destructuring
    const { username, email, password, newsletter } = req.body;
    // Si il manque des paramètres pour créer un nouvel utilisateur
    if (!username || !email || !password || typeof newsletter !== "boolean") {
      return res.status(400).json({
        message: "Missing parameters",
      });
    }
    // Si l'email est déjà utilisé par quelqu'un d'autre, on renvoie une erreur
    const emailAlreadyUsed = await User.findOne({ email: email });
    // console.log(emailAlreadyUsed)
    if (emailAlreadyUsed) {
      return res.status(409).json({ message: "This email is already exist" });
    }

    const token = uid2(64);
    // console.log("token: ", token);
    const salt = uid2(16);
    // console.log("salt : ", salt);
    const hash = SHA256(salt + password).toString(encBase64);
    // console.log("hash:", hash);

    const newUser = new User({
      email,
      account: {
        username,
      },
      newsletter,
      token,
      hash,
      salt,
    });
    await newUser.save();
    const response = {
      _id: newUser._id,
      token: newUser.token,
      account: newUser.account,
    };
    // console.log(newOffer);
    res.json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    // console.log(req.body)

    const { email, password } = req.body;
    // aller chercher le user
    const user = await User.findOne({ email: email });

    // Si on en trouve pas on envoie une erreur

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Si il en trouve un on continu
    // Il faut recréer un hash à partir du salt du user trouvé et du MDP reçu
    // console.log(user)
    const newHash = SHA256(user.salt + password).toString(encbase64);
    console.log(newHash);

    // Si les Hash sont différents on envoie une erreur
    if (newHash !== user.hash) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Si ce Hash est le même que le hash en BDD on autorise la connexion
    res.json({
      _id: user._id,
      account: user.account,
      token: user.token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// J'exporte la route vers index.js
module.exports = router;
