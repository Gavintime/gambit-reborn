import express from "express";
import logger from "morgan";
import compression from "compression";

import userRouter from "./routes/UserRouter.js";
import gameRouter from "./routes/GameRouter.js";
import inviteCodeRouter from "./routes/InviteCodeRouter.js"

const app = express();

// global middleware
app.use(logger("dev"));
// TODO: handle invalid json in request, rn is sends a stacktrace to the user... 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());

// routers
app.use("/user", userRouter);
app.use("/invite-code", inviteCodeRouter)
app.use("/game", gameRouter);

app.use((req, res) => {
  res.status(404).json("Endpoint not found");
});

export default app;
