const router = require("express").Router();
const { query } = require("../db/pool");
const { authRequired, requireTeamAdmin } = require("../utils/middleware");

// Tulevat tapahtumat + osallistujatilastot
router.get("/", authRequired, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT 
         t.id, t.joukkue_id, t.tyyppi, t.paikka, t.aika, t.kuvaus,
         SUM(o.status = 'osallistun') AS osallistujat,
         SUM(o.status = 'en_osallistu') AS ei_osallistujat,
         (SELECT status 
            FROM osallistumiset 
           WHERE tapahtuma_id = t.id AND kayttaja_id = ?
           LIMIT 1) AS oma_status
       FROM tapahtumat t
       LEFT JOIN osallistumiset o ON o.tapahtuma_id = t.id
       WHERE t.joukkue_id = ? AND t.aika >= NOW()
       GROUP BY t.id
       ORDER BY t.aika ASC`,
      [req.user.id, req.user.joukkue_id]
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

// Tapahtuman kaikki osallistujat
router.get("/:id/osallistujat", authRequired, async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT k.id, k.nimi, k.email, o.status
       FROM osallistumiset o
       JOIN käyttäjät k ON o.kayttaja_id = k.id
       WHERE o.tapahtuma_id = ?`,
      [req.params.id]
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.delete(
  "/:id",
  authRequired,
  requireTeamAdmin,
  async (req, res, next) => {
    try {
      const tapahtumaId = Number(req.params.id);

      // Poistetaan vain omasta joukkueesta
      const result = await query(
        "DELETE FROM `tapahtumat` WHERE id = ? AND joukkue_id = ?",
        [tapahtumaId, req.user.joukkue_id]
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Tapahtumaa ei löydy tältä joukkueelta" });
      }

      res.json({ ok: true, deleted: result.affectedRows });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
