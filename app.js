import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import {
  userRoutes,
  aptitudeRoutes,
  userAptitudeDetailsRoutes,
  questionRoutes,
  optionsRoutes,
  authRoutes
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
app.use(express.static("public"))
app.use(cookieParser())

app.use("/users", userRoutes);
app.use("/questions", questionRoutes);
app.use("/options", optionsRoutes);
app.use("/aptitude", aptitudeRoutes);
app.use("/users", userAptitudeDetailsRoutes);
app.use("/users", authRoutes)
export default app;
