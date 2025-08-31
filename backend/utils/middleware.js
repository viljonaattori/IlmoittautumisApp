const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const { JWT } = require("./config");

// Request logger
const requestLogger = morgan("dev");

// Token extractor (Bearer ...)
const tokenExtractor = (req, _res, next) => {
  const auth = req.get("authorization");
  req.token =
    auth && auth.toLowerCase().startsWith("bearer ") ? auth.substring(7) : null;
  next();
};

// ehkä myöhemmin
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
  console.error(err);
  res.status(500).json({ error: "internal server error" });
};

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
};
