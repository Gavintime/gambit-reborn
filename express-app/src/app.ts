import express from "express";
import logger from "morgan";
import compression from "compression";

import userRouter from "./routes/user.js";
import gameRouter from "./routes/game.js";

const app = express();

// global middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());

// routers
app.use("/user", userRouter);
app.use("/game", gameRouter);

app.use((req, res) => {
  res.status(404).json("Endpoint not found");
});

export default app;
