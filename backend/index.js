const app = require("./app");
const { PORT } = require("./utils/config");
const { ping } = require("./db/pool");

app.listen(PORT, async () => {
  const now = await ping().catch(() => null);
  console.log(
    `Server running on port ${PORT}${now ? ` | DB OK @ ${now}` : ""}`
  );
});
