const jwt = require("jsonwebtoken");
const User = require("../../models/user.Model");

const protect = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Non autorisé, aucun token fourni" });
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Non autorisé, utilisateur introuvable" });
    }

    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Non autorisé, token invalide ou expiré" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res
    .status(403)
    .json({ message: "Accès refusé : droits administrateur requis" });
};

module.exports = { protect, adminOnly };
