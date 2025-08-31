const router = require("express").Router();
const { query } = require("../db/pool");

// GET /api/joukkueet
router.get("/", async (_req, res, next) => {
  try {
    const rows = await query(
      "SELECT id, nimi FROM `joukkueet` ORDER BY nimi ASC"
    );
    // varmuuden vuoksi käännetään id numeroksi
    const data = rows.map((r) => ({ id: Number(r.id), nimi: r.nimi }));
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
