import express from "express";
import cors from "cors";
import { userRoutes, aptitudeRoutes, userAptitudeDetailsRoutes } from "./routes/index.js";

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
app.use("/aptitude", aptitudeRoutes)
app.use("/users", userAptitudeDetailsRoutes)
export default app;
