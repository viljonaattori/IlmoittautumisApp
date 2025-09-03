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

// Haetan jäsenet ja YP
router.get("/members", async (req, res, next) => {
  try {
    if (!req.user?.joukkue_id) {
      return res.status(400).json({ error: "Käyttäjältä puuttuu joukkue" });
    }

    // Haetaan joukkueen ylläpitäjä id
    const teamLeader = await query(
      "SELECT id, ylläpitäjä_id FROM `joukkueet` WHERE id = ?",
      [req.user.joukkue_id]
    );

    // Error jos ei löydy yhtään
    if (teamLeader.length === 0) {
      return res.status(404).json({ error: "joukkuetta ei löydy" });
    }

    const adminId = Number(teamLeader[0].ylläpitäjä_id);

    // Haetaan kaikki joukkueeseen kuuluvat
    const rows = await query(
      "SELECT id, nimi, email FROM `käyttäjät` WHERE joukkue_id = ? ORDER BY nimi ASC",
      [req.user.joukkue_id]
    );

    const members = rows.map((r) => ({
      id: Number(r.id),
      nimi: r.nimi,
      email: r.email,
      is_admin: Number(r.id) === adminId,
    }));

    res.json({ joukkue_id: Number(req.user.joukkue_id), members });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
