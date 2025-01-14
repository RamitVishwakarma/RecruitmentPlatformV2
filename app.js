import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import {
  userRoutes,
  aptitudeRoutes,
  userAptitudeDetailsRoutes,
  questionRoutes,
  optionsRoutes,
  authRoutes,
  socialRoutes,
} from "./routes/index.js";
import swaggerSpecs from "./utils/swaggerconfig.js";
import swaggerUi from "swagger-ui-express";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use((err, req, res, next) => {
  console.error(err.stack);
  return res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use("/users", userRoutes);
app.use("/questions", questionRoutes);
app.use("/options", optionsRoutes);
app.use("/aptitude", aptitudeRoutes);
app.use("/users", userAptitudeDetailsRoutes);
app.use("/users", authRoutes);
app.use("/social", socialRoutes);
export default app;
