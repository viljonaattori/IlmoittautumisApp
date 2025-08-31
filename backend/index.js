const express = require("express");
const app = express();
const PORT = 3001;

// testireitti
app.get("/api/hello", (req, res) => {
  res.json({ message: "Backend toimii!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
