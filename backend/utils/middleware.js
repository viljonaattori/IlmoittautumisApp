const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const { JWT } = require("./config");

// Request logger
const requestLogger = morgan("dev");

// Tarkistaa tokenin jokaisesta pyynnöstä
const tokenExtractor = (req, _res, next) => {
  const auth = req.get("authorization");
  req.token =
    auth && auth.toLowerCase().startsWith("bearer ") ? auth.substring(7) : null;
  next();
};

const authRequired = (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: "Token puuttuu" });
  }
  try {
    req.user = jwt.verify(req.token, JWT.secret);
    return next();
  } catch (e) {
    return res
      .status(403)
      .json({ error: "Virheellinen tai vanhentunut token" });
  }
};

const userExtractor = (req, _res, next) => {
  if (!req.token) return next();
  try {
    req.user = jwt.verify(req.token, JWT.secret);
  } catch (_) {
    req.user = null;
  }
  next();
};

const unknownEndpoint = (_req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
};

const errorHandler = (err, _req, res, _next) => {
  console.error("ERROR:", err);
  res.status(500).json({ error: "internal server error" });
};

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  authRequired,
  unknownEndpoint,
  errorHandler,
};
