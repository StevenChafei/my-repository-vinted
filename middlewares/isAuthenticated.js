const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    console.log(token);
    // console.log(token);
    const user = await User.findOne({ token: token });

    // console.log(user);

    // Si je n'en trouve pas ====> erreur
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Si J'en trouve un, je le stocke dans req.user pour le garder sous la main et pouvoir le réutiliser dans ma route
    req.user = user;
    // Je passe au middleware suivant
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = isAuthenticated;
