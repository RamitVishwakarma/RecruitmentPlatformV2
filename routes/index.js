import questionRoutes from "./questionsRoutes.js";
import optionsRoutes from "./optionsRoutes.js";
import userRoutes from "./userRoutes.js";
import aptitudeRoutes from "./aptitudeRoutes.js";
import userAptitudeDetailsRoutes from "./userAptitudeDetailsRoutes.js";
import userSocialLinksRoutes from "./userSocialLinksRoutes.js";
import express from "express";

const router = express.Router();
router.use("/", questionRoutes);
router.use("/", optionsRoutes);
router.use("/", aptitudeRoutes);
router.use("/", userRoutes);
router.use("/", userAptitudeDetailsRoutes);
router.use("/", userSocialLinksRoutes);

export {
  userRoutes,
  aptitudeRoutes,
  userAptitudeDetailsRoutes,
  optionsRoutes,
  questionRoutes,
  userSocialLinksRoutes,
};
