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

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use(requestLogger);
app.use(tokenExtractor);
app.use(userExtractor);

// Reitit
app.use("/api/auth", authRouter);
app.use("/api/joukkueet", joukkueetRouter);
app.use("/api/tapahtumat", tapahtumatRouter);
app.use("/api/invite", inviteRoutes);
app.use("/api/users", userRoutes);

app.get("/", (_req, res) => res.send("API ok"));

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
