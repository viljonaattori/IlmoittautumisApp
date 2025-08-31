const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { query } = require("../db/pool");
const { JWT } = require("../utils/config");
const { errorHandler } = require("../utils/middleware");

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, nimi } = req.body;

    // Validointi
    if (!email || !password || !nimi) {
      return res
        .status(400)
        .json({ error: "sähköposti, salasana ja nimi vaaditaan" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "salasanan pituus vähintään 6 merkkiä" });
    }

    // Tarkastetaan onko käyttäjä olemassa
    const existing = await query("SELECT id FROM `käyttäjät` WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Sähköposti on jo käytössä" });
    }

    // Salasanan Hash
    const salasana_hash = await bcrypt.hash(password, 10);

    // Insert
    const result = await query(
      "INSERT INTO `käyttäjät` (email, salasana_hash, nimi) VALUES (?, ?, ?)",
      [email, salasana_hash, nimi]
    );

    const id = Number(result.insertId);
    const user = { id, email, nimi };

    // Luo JWT
    const token = jwt.sign(user, JWT.secret, {
      expiresIn: JWT.expiresIn || "7d",
    });
    return res.status(201).json({ user, token });
  } catch (err) {
    // MariaDB:n duplikaatti varmistus
    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "sähköposti on jo käytössä" });
    }
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validointi
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Sähköposti ja salasana vaaditaan" });
    }

    // Haetaan käyttäjä
    const rows = await query("SELECT * FROM `käyttäjät` WHERE email = ?", [
      email,
    ]);
    const user = rows[0];
    if (!user) {
      return res
        .status(401)
        .json({ error: "Virheellinen sähköposti tai salasana" });
    }

    // Salasanan vertaus
    const ok = await bcrypt.compare(password, user.salasana_hash);
    if (!ok) {
      return res.status(401).json({ error: "Virheellinen salasana" });
    }

    // Mariadb palauttaa id: big intinä niin muunnetaan se tavallliseksi numeroksi
    const payload = { id: Number(user.id), email: user.email, nimi: user.nimi };

    // Luodaan tokeni
    const token = jwt.sign(payload, JWT.secret, {
      expiresIn: JWT.expiresIn || "7d",
    });

    return res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
