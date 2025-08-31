const router = require("express").Router();
// Lisää myöhemmin CRUD (listaa, lisää, päivitä, poista)
router.get("/", (_req, res) => {
  res.json(["Joukkueet tulossa.."]);
});
module.exports = router;
