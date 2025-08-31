const router = require("express").Router();
// Lisää myöhemmin CRUD (listaa, lisää, päivitä, poista)
router.get("/", (_req, res) => {
  res.json(["Tapahtumat tulossa.."]);
});
module.exports = router;
