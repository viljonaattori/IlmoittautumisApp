const router = require("express").Router();
const { query } = require("../db/pool");
const { authRequired } = require("../utils/middleware");
const bcrypt = require("bcrypt");
const emailValidator = require("../utils/emailValidator");

// Nimen muokkaus
router.put("/me/name", authRequired, async (req, res, next) => {
  try {
    const { nimi } = req.body;
    if (!nimi) return res.status(400).json({ error: "Nimi on pakollinen" });

    const result = await query("UPDATE `käyttäjät` SET nimi = ? WHERE id = ?", [
      nimi,
      req.user.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Käyttäjää ei löydy" });
    }

    res.json({ ok: true, message: "Nimi päivitetty" });
  } catch (err) {
    next(err);
  }
});

// Sähköpostin muutos
router.put("/me/email", authRequired, async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Sähköposti on pakollinen" });
    }

    if (!emailValidator(email)) {
      return res
        .status(400)
        .json({ error: "Sähköpostiosoite ei saa sisältää ääkkösiä" });
    }

    // Tarkista, ettei email ole jo käytössä
    const exists = await query("SELECT id FROM `käyttäjät` WHERE email = ?", [
      email,
    ]);
    if (exists.length > 0) {
      return res.status(409).json({ error: "Sähköposti on jo käytössä" });
    }

    const result = await query(
      "UPDATE `käyttäjät` SET email = ? WHERE id = ?",
      [email, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Käyttäjää ei löydy" });
    }

    res.json({ ok: true, message: "Sähköposti päivitetty" });
  } catch (err) {
    next(err);
  }
});

// Salasanan vaihto
router.put("/me/password", authRequired, async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Vanha ja uusi salasana vaaditaan" });
    }

    // Vahvuustarkistus kuten rekisteröinnissä
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Uuden salasanan on oltava vähintään 6 merkkiä" });
    }

    // Tarkista vanha salasana
    const [user] = await query(
      "SELECT salasana_hash FROM `käyttäjät` WHERE id = ?",
      [req.user.id]
    );
    if (!user) {
      return res.status(404).json({ error: "Käyttäjää ei löydy" });
    }

    const ok = await bcrypt.compare(oldPassword, user.salasana_hash);
    if (!ok) {
      return res.status(400).json({ error: "Vanha salasana on väärä" });
    }

    // Hashaa ja tallenna uusi salasana
    const hashed = await bcrypt.hash(newPassword, 10);
    await query("UPDATE `käyttäjät` SET salasana_hash = ? WHERE id = ?", [
      hashed,
      req.user.id,
    ]);

    res.json({ ok: true, message: "Salasana vaihdettu" });
  } catch (err) {
    next(err);
  }
});

// Tilin poistaminen
router.delete("/me", authRequired, async (req, res, next) => {
  try {
    const result = await query("DELETE FROM `käyttäjät` WHERE id = ?", [
      req.user.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Käyttäjää ei löydy" });

    res.json({ ok: true, message: "Käyttäjätili poistettu" });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
