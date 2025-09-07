const router = require("express").Router();
const { query } = require("../db/pool");
const { authRequired } = require("../utils/middleware");

// Tulevat tapahtumat
router.get("/", authRequired, async (req, res, next) => {
  try {
    const rows = await query(
      "SELECT id, joukkue_id, tyyppi, paikka, aika, kuvaus FROM tapahtumat WHERE joukkue_id = ? AND aika >= NOW() ORDER BY aika ASC",
      [req.user.joukkue_id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Menneet tapahtumat
router.get("/menneet", authRequired, async (req, res, next) => {
  try {
    const rows = await query(
      "SELECT id, joukkue_id, tyyppi, paikka, aika, kuvaus FROM tapahtumat WHERE joukkue_id = ? AND aika < NOW() ORDER BY aika DESC",
      [req.user.joukkue_id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Osallistuminen tapahtumaan id perusteella
router.post("/:id/osallistuminen", authRequired, async (req, res, next) => {
  try {
    const { status } = req.body;
    const tapahtumaId = Number(req.params.id);
    const kayttajaId = req.user.id;

    if (!["osallistun", "en_osallistu"].includes(status)) {
      return res.status(400).json({ error: "Virheellinen status" });
    }

    await query(
      `INSERT INTO osallistumiset (tapahtuma_id, kayttaja_id, status)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status), paivitetty = CURRENT_TIMESTAMP`,
      [tapahtumaId, kayttajaId, status]
    );

    res.json({ ok: true, status });
  } catch (err) {
    next(err);
  }
});

// Käyttäjän oma osallistuminen tapahtumaan
router.get("/:id/osallistuminen", authRequired, async (req, res, next) => {
  try {
    const rows = await query(
      "SELECT status FROM osallistumiset WHERE tapahtuma_id = ? AND kayttaja_id = ?",
      [req.params.id, req.user.id]
    );

    if (rows.length === 0) {
      return res.json({ status: null });
    }

    res.json({ status: rows[0].status });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
