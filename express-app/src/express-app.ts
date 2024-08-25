import express, { type ErrorRequestHandler } from "express";
import logger from "morgan";
import compression from "compression";
import Debug from "debug";

// handle async errors as if they were sync, calls next() when an async error happens
// this prevents needing an async wrapper, or try catch boiler plate
// !!!must be before router imports!!!
import "express-async-errors";

import userRouter from "./routes/UserRouter.js";
import gameRouter from "./routes/GameRouter.js";
import inviteCodeRouter from "./routes/InviteCodeRouter.js";

const debug = Debug("gambit:express-app");

const app = express();

// global middleware
app.use(logger("dev"));
// TODO: handle invalid json in request, rn is sends a stacktrace to the user...
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());


// routers
app.use("/user", userRouter);
app.use("/invite-code", inviteCodeRouter);
app.use("/game", gameRouter);


// default error handlers
app.use((req, res) => {
  res.status(404).json("Endpoint not found");
});

// we don't inline so that we can manually say it's an ErrorRequestHandler
// *typescript* won't understand types correctly otherwise
// !!!the unused next param is load bearing!!!
// *express* doesn't know this is the error handler without it
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // TODO: better logging
  debug(err);
  res.status(500).json("Internal Error");
};

app.use(errorHandler);


export default app;
