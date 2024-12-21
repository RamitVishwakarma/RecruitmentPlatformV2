import express from "express";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import questionsRoutes from "./routes/questionsRoutes.js";
import optionsRoutes from "./routes/optionsRoutes.js";
import {
  userRoutes,
  aptitudeRoutes,
  userAptitudeDetailsRoutes,
} from "./routes/index.js";

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
app.use("/questions", questionsRoutes);
app.use("/options", optionsRoutes);
app.use("/", routes);
app.use("/users", userRoutes);
app.use("/aptitude", aptitudeRoutes);
app.use("/users", userAptitudeDetailsRoutes);
export default app;
