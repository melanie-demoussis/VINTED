const User = require("../models/User");
const isAuthenticated = async (req, res, next) => {
  try {
    // console.log("Je rentre dans mon middlewares");
    // console.log(req.headers.authorization);

    // Je vais chercher dans ma BDD un utilisateur dont le token correspond à celui reçu
    //  Sij'en trouve pas , il y a erreur alors c'est pas authorisé
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = req.headers.authorization.replace("Bearer ", "");
    // console.log(token);

    // Si j'en trouve un:
    const user = await User.findOne({ token: token }).select("account");
    // console.log(user);

    // Si j'en trouve un je le stocke dans req.user pour le garder sous la main et pouvoir le réutiliser dans ma route
    req.user = user;

    // Passons au middlewares suivvant avec next
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = isAuthenticated;
