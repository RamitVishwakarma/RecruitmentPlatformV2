import express from "express";
import cors from "cors";
import userRouter from "./routes/userRouter.js";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);

export default app;
