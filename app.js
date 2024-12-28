import express from "express";
import cors from "cors";
import {
  userRoutes,
  aptitudeRoutes,
  userAptitudeDetailsRoutes,
  questionRoutes,
  optionsRoutes,
  socialRoutes,
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
app.use("/users", userRoutes);
app.use("/questions", questionRoutes);
app.use("/options", optionsRoutes);
app.use("/aptitude", aptitudeRoutes);
app.use("/users", userAptitudeDetailsRoutes);
app.use("/social", socialRoutes);
export default app;
