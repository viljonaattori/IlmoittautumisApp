const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { query } = require("../db/pool");
const { JWT } = require("../utils/config");
const { errorHandler } = require("../utils/middleware");
const emailValidator = require("../utils/emailValidator");
const { sendEmail } = require("../utils/sendEmail.js");
const crypto = require("crypto");

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

// Luodaan linkki ja lähetetään se sähköpostiin
router.post("/passwordReset", async (req, res, next) => {
  try {
    const { email } = req.body;

    const [user] = await query("SELECT id FROM käyttäjät WHERE email = ?", [
      email,
    ]);

    // Palautetaan sama vastaus, vaikka email ei löytyisi
    if (!user) {
      return res.status(200).json({
        message:
          "Jos sähköposti on olemassa, lähetetään linkki salasanan vaihtoon.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600 * 1000); // 1 tunti voimassa

    await query(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, token, expires]
    );

    const resetLink = `https://yourfrontendurl/reset?token=${token}`;

    // Lähetä sähköposti
    await sendEmail(
      email,
      "Salasanan palautus",
      `Avaa tämä linkki: ${resetLink}`
    );

    res.json({
      message: "Jos sähköposti on olemassa, lähetetään linkki.",
    });
  } catch (err) {
    next(err); // välitetään virhe Expressin virheenkäsittelijälle
  }
});

// Salasanan vaihto
router.post("/changePassword", async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    // Tarkista token ja sen voimassaolo
    const [row] = await query(
      "SELECT user_id FROM password_resets WHERE token = ? AND expires_at > NOW()",
      [token]
    );

    if (!row) {
      return res
        .status(400)
        .json({ error: "Virheellinen tai vanhentunut linkki." });
    }

    // Hashaa uusi salasana
    const hashed = await bcrypt.hash(newPassword, 12);

    // Päivitä käyttäjän salasana
    await query("UPDATE käyttäjät SET salasana_hash = ? WHERE id = ?", [
      hashed,
      row.user_id,
    ]);

    // Poista token ettei sitä voi käyttää uudelleen
    await query("DELETE FROM password_resets WHERE token = ?", [token]);

    res.json({ message: "Salasana vaihdettu onnistuneesti." });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
