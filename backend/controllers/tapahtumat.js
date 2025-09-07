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
module.exports = router;
