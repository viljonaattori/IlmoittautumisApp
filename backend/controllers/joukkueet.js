const router = require("express").Router();
const { query } = require("../db/pool");
const { authRequired, requireTeamAdmin } = require("../utils/middleware");
const multer = require("multer");
const path = require("path");

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
router.get("/members", authRequired, async (req, res, next) => {
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
      "SELECT id, nimi, email, joukkue_id FROM `käyttäjät` WHERE joukkue_id = ? ORDER BY nimi ASC",
      [req.user.joukkue_id]
    );

    const members = rows.map((r) => ({
      id: Number(r.id),
      nimi: r.nimi,
      email: r.email,
      joukkue_id: Number(r.joukkue_id),
      is_admin: Number(r.id) === adminId,
    }));

    res.json({ joukkue_id: Number(req.user.joukkue_id), members });
  } catch (err) {
    next(err);
  }
});

// Joukkueen poisto ID perusteella
router.delete(
  "/:id",
  authRequired,
  requireTeamAdmin,
  async (req, res, next) => {
    try {
      const joukkueId = Number(req.params.id);

      await query("DELETE FROM `joukkueet` WHERE id = ?", [joukkueId]);

      res.json({ message: "Joukkue poistettu onnistuneesti" });
    } catch (err) {
      next(err);
    }
  }
);

// yksittäisen pelaajan poisto
router.delete(
  "/members/:id",
  authRequired,
  requireTeamAdmin,
  async (req, res, next) => {
    try {
      const memberId = Number(req.params.id);

      // varmistetaan että pelaaja kuuluu samaan joukkueeseen
      const rows = await query(
        "SELECT id FROM `käyttäjät` WHERE id = ? AND joukkue_id = ?",
        [memberId, req.user.joukkue_id]
      );

      if (rows.length === 0) {
        return res
          .status(400)
          .json({ error: "Jäsentä ei löydy tästä joukkueesta" });
      }

      await query("DELETE FROM `käyttäjät` WHERE id = ?", [memberId]);

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

// Hakee joukkueen id, nimen ja kuvauksen ID perusteella
router.get("/:id", authRequired, requireTeamAdmin, async (req, res, next) => {
  try {
    const joukkueId = Number(req.params.id);

    const rows = await query(
      "SELECT id, nimi, kuvaus FROM `joukkueet` WHERE id = ?",
      [joukkueId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Joukkuetta ei löydy" });
    }

    // Nimi id ja kuvaus
    const joukkue = rows[0];
    res.json({
      id: Number(joukkue.id),
      nimi: joukkue.nimi,
      kuvaus: joukkue.kuvaus || "",
    });
  } catch (err) {
    next(err);
  }
});

// Joukkueen, nimen ja/tai kuvauksen muokkaus ID perusteella
// Päivitä joukkueen nimi ja kuvaus
router.put("/:id", authRequired, requireTeamAdmin, async (req, res, next) => {
  try {
    const joukkueId = Number(req.params.id);
    const { nimi, kuvaus } = req.body;

    // Varmistetaan että nimi on annettu
    if (!nimi || nimi.trim() === "") {
      return res.status(400).json({ error: "Joukkueen nimi on pakollinen" });
    }

    const result = await query(
      `UPDATE \`joukkueet\`
       SET nimi = ?, kuvaus = ?
       WHERE id = ?`,
      [nimi.trim(), kuvaus || null, joukkueId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Joukkuetta ei löydy" });
    }

    res.json({
      ok: true,
      id: joukkueId,
      nimi: nimi.trim(),
      kuvaus: kuvaus || "",
    });
  } catch (err) {
    next(err);
  }
});

// Määritellään tallennuspaikka ja tiedostonimi
const storage = multer.diskStorage({
  destination: "uploads/teams/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Kuvan asettaminen
router.put(
  "/:id/kuva",
  authRequired,
  requireTeamAdmin,
  upload.single("kuva"),
  async (req, res, next) => {
    try {
      const joukkueId = Number(req.params.id);
      if (!req.file)
        return res.status(400).json({ error: "Kuva on pakollinen" });

      await query("UPDATE `joukkueet` SET kuva = ? WHERE id = ?", [
        `/uploads/teams/${req.file.filename}`,
        joukkueId,
      ]);

      res.json({ ok: true, path: `/uploads/teams/${req.file.filename}` });
    } catch (err) {
      next(err);
    }
  }
);

// Kuvan poisto
router.delete(
  "/:id/kuva",
  authRequired,
  requireTeamAdmin,
  async (req, res, next) => {
    try {
      const joukkueId = Number(req.params.id);
      await query("UPDATE `joukkueet` SET kuva = NULL WHERE id = ?", [
        joukkueId,
      ]);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
