const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { query } = require("../db/pool");
const { JWT } = require("../utils/config");

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, nimi } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await query(
      "INSERT INTO käyttäjät (email, salasana_hash, nimi) VALUES (?,?,?)",
      [email, hash, nimi]
    );
    res.status(201).json({ message: "ok" });
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const rows = await query("SELECT * FROM käyttäjät WHERE email = ?", [
      email,
    ]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "invalid credentials" });

    const ok = await bcrypt.compare(password, user.salasana_hash);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    const payload = { id: user.id, email: user.email, nimi: user.nimi };
    const token = jwt.sign(payload, JWT.secret, { expiresIn: JWT.expiresIn });
    res.json({ token, user: payload });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
