const router = require("express").Router();
const { query } = require("../db/pool");
const { authRequired, requireTeamAdmin } = require("../utils/middleware");
const { v4: uuidv4 } = require("uuid");

// Liittymislinkki joka vanhenee 7 päivän kuluessa
router.post(
  "/:teamId",
  authRequired,
  requireTeamAdmin,
  async (req, res, next) => {
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
  }
);

module.exports = router;
