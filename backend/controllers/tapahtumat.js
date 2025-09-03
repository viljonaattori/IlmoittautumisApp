const router = require("express").Router();

router.get("/", (_req, res) => {
  res.json(["Tapahtumat tulossa.."]);
});
module.exports = router;
