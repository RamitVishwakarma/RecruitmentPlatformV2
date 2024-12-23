import questionsRoutes from "../routes/questionsRoutes";
import optionsRoutes from "../routes/optionsRoutes";
import userRoutes from "./userRoutes.js";
import aptitudeRoutes from "./aptitudeRoutes.js";
import userAptitudeDetailsRoutes from "./userAptitudeDetailsRoutes.js";
import express from "express";

const router = express.Router();
router.use("/", questionsRoutes);
router.use("/", optionsRoutes);
router.use("/", aptitudeRoutes);
router.use("/", userRoutes);
router.use("/", userAptitudeDetailsRoutes);

export {
  userRoutes,
  aptitudeRoutes,
  userAptitudeDetailsRoutes,
  questionsRoutes,
  optionsRoutes,
  userRoutes,
};
