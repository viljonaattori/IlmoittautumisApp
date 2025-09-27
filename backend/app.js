const express = require("express");
const cors = require("cors");
const {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
} = require("./utils/middleware");

const authRouter = require("./controllers/auth");
const joukkueetRouter = require("./controllers/joukkueet");
const tapahtumatRouter = require("./controllers/tapahtumat");
const inviteRoutes = require("./controllers/invite");
const userRoutes = require("./controllers/users");
const path = require("path");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(requestLogger);
app.use(tokenExtractor);
app.use(userExtractor);

// Staattiset kuvatiedostot
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Reitit
app.use("/api/auth", authRouter);
app.use("/api/joukkueet", joukkueetRouter);
app.use("/api/tapahtumat", tapahtumatRouter);
app.use("/api/invite", inviteRoutes);
app.use("/api/users", userRoutes);

app.get("/", (_req, res) => res.send("API ok"));

// Palvellaan frontendin build
app.use(express.static(path.join(__dirname, "dist")));

// Jos mikään reitti ei matchaa, palautetaan index.html
app.get("(.*)", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
