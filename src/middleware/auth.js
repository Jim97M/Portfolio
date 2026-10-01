const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");

async function authenticate(req, res, next) {
  const [scheme, token] = (req.get("authorization") || "").split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authentication required." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.sub, {
      include: [{ model: Role, as: "roles", attributes: ["name"], through: { attributes: [] } }],
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Authentication required." });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid or expired token." });
    }
    return next(error);
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRoles = req.user?.roles.map((role) => role.name) || [];
    if (!allowedRoles.some((role) => userRoles.includes(role))) {
      return res.status(403).json({ error: "You do not have permission to do that." });
    }
    return next();
  };
}

module.exports = { authenticate, authorizeRoles };