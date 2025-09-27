const app = require("./app");
const { ping } = require("./db/pool");

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  const now = await ping().catch(() => null);
  console.log(
    `Server running on port ${PORT}${now ? ` | DB OK @ ${now}` : ""}`
  );
});
