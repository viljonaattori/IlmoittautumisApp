const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const { JWT } = require("./config");
const { query } = require("../db/pool");

// Request logger
const requestLogger = morgan("dev");

// Tarkistaa tokenin jokaisesta pyynnöstä
const tokenExtractor = (req, _res, next) => {
  const auth = req.get("authorization");
  req.token =
    auth && auth.toLowerCase().startsWith("bearer ") ? auth.substring(7) : null;
  next();
};

// Vaatii voimassa olevan tokenin
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

// voidaan käytttää toiminnoissa missä käyttäjän on oltava ylläpitäjä esim, tapahtumien poisto
const requireTeamAdmin = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // käytetään reitillä annettua id:tä
    const joukkueId = Number(req.params.id || req.user.joukkue_id);

    const rows = await query(
      "SELECT `ylläpitäjä_id` FROM `joukkueet` WHERE id = ?",
      [joukkueId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Joukkuetta ei löydy" });
    }

    const adminId = Number(rows[0].ylläpitäjä_id);
    if (Number(req.user.id) !== adminId) {
      return res
        .status(403)
        .json({
          error: "Vain joukkueen ylläpitäjä voi suorittaa tämän toimen.",
        });
    }

    next();
  } catch (err) {
    next(err);
  }
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
  requireTeamAdmin,
};
