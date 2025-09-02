const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { query } = require("../db/pool");
const { JWT } = require("../utils/config");
const { errorHandler } = require("../utils/middleware");

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, nimi, joukkue_id } = req.body;

    // Validointi
    if (!email || !password || !nimi || !joukkue_id) {
      return res
        .status(400)
        .json({ error: "sähköposti, salasana, nimi ja joukkue vaaditaan" });
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

    // Tarkastetaan löytyykö joukkuetta
    const team = await query("SELECT id FROM `joukkueet` WHERE id = ?", [
      joukkue_id,
    ]);
    if (team.length === 0) {
      return res.status(400).json({ error: "virheellinen joukkue_id" });
    }

    // Salasanan Hash
    const salasana_hash = await bcrypt.hash(password, 10);

    // Insert
    const result = await query(
      "INSERT INTO `käyttäjät` (email, salasana_hash, nimi, joukkue_id) VALUES (?, ?, ?, ?)",
      [email, salasana_hash, nimi, joukkue_id]
    );

    const id = Number(result.insertId);
    const user = { id, email, nimi, joukkue_id: Number(joukkue_id) };

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

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Sähköposti ja salasana vaaditaan" });
    }

    // Haetaan käyttäjä + joukkueen nimi JOINilla
    const rows = await query(
      `SELECT k.id, k.email, k.nimi, k.salasana_hash, k.joukkue_id, j.nimi AS joukkue_nimi
       FROM käyttäjät k
       LEFT JOIN joukkueet j ON k.joukkue_id = j.id
       WHERE k.email = ?`,
      [email]
    );

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

    // Palautetaan myös käyttäjän joukkue
    const payload = {
      id: Number(user.id),
      email: user.email,
      nimi: user.nimi,
      joukkue_id: Number(user.joukkue_id),
      joukkue_nimi: user.joukkue_nimi,
    };

    const token = jwt.sign(payload, JWT.secret, {
      expiresIn: JWT.expiresIn || "7d",
    });

    return res.json({ token, user: payload });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
