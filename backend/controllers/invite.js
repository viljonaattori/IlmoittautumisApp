const router = require("express").Router();
const { query } = require("../db/pool");
const { authRequired, requireTeamAdmin } = require("../utils/middleware");
const { v4: uuidv4 } = require("uuid");

// Liittymislinkki joka vanhenee 7 päivän kuluessa
router.post("/:teamId", authRequired, async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const token = uuidv4();

    await query(
      "INSERT INTO invite (team_id, token, expires_at) VALUES (?,?, DATE_ADD(NOW(), INTERVAL 7 DAY))",
      [teamId, token]
    );

    res.json({
      invitelink: `${process.env.FRONTEND_URL}/join/${token}`,
      expiresInDays: 7,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/bytoken/:token", async (req, res, next) => {
  try {
    const { token } = req.params;
    console.log("bytoken kutsu, token:", token);

    const rows = await query(
      `SELECT i.id AS invite_id,
              j.id AS joukkue_id,
              j.nimi AS joukkue_nimi
       FROM invite i
       JOIN joukkueet j ON i.team_id = j.id
       WHERE i.token = ? AND i.used = FALSE AND i.expires_at > NOW()`,
      [token]
    );

    console.log("rows tulos:", rows);

    // Jos ei löytynyt yhtään riviä
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Kutsu ei ole voimassa" });
    }

    // Ota ensimmäinen rivi
    const row = rows[0];

    res.json({
      joukkue: {
        id: row.joukkue_id,
        nimi: row.joukkue_nimi,
      },
    });
  } catch (err) {
    console.error("invite/bytoken virhe:", err);
    next(err);
  }
});

module.exports = router;
