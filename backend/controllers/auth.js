const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { query } = require("../db/pool");
const { JWT } = require("../utils/config");
const { errorHandler } = require("../utils/middleware");
const emailValidator = require("../utils/emailValidator");
const {
  validateUserInput,
  ensureEmailUnique,
  ensureTeamExists,
  createTeamIfNeeded,
  createUser,
  setTeamAdminIfNeeded,
  createJwt,
} = require("./authFunctions");

// Rekisteröinti
router.post("/register", async (req, res, next) => {
  try {
    const {
      email,
      password,
      nimi,
      joukkue_id,
      new_team_name,
      new_team_kuvaus,
      mode,
    } = req.body;
    const actualMode = mode || "join";

    await validateUserInput({ email, password, nimi });
    await ensureEmailUnique(email);

    if (actualMode === "join") {
      if (!joukkue_id)
        return res.status(400).json({ error: "Joukkue on valittava" });
      await ensureTeamExists(joukkue_id);
    }

    let teamId = joukkue_id;
    if (actualMode === "create") {
      // HUOM! createTeamIfNeeded täytyy päivittää ottamaan kuvaus mukaan
      teamId = await createTeamIfNeeded(
        actualMode,
        new_team_name,
        new_team_kuvaus
      );
    }

    const userId = await createUser({ email, password, nimi, teamId });
    await setTeamAdminIfNeeded(actualMode, userId, teamId);

    const user = { id: userId, email, nimi, joukkue_id: Number(teamId) };
    const token = createJwt(user);

    res.status(201).json({ user, token });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ error: "Sähköposti on jo käytössä" });
    next(err);
  }
});

// Kirjautuminen
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
