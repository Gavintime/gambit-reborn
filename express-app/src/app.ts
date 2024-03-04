import express from "express";
import logger from "morgan";
import compression from "compression";

// import indexRouter from './routes/index.js'
import userRouter from "./routes/user.js";

const app = express();

// global middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());

// routers
app.use("/user", userRouter);

export default app;
