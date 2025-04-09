import express from "express";
import authRoutes from "./authRoutes.js";
import socialRoutes from "./socialRoutes.js";
import oauthRoutes from "./oauthRoutes.js";
import adminRoutes from "./adminRoutes.js";
import userDetailsUpdateRoutes from "./userDetailsUpdateRoutes.js";
import uploadRoutes from "./uploadRoute.js";
import userAptitudeRoutes from "./userAptitudeRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import answerRoutes from "./answerRoutes.js";
import questionRoutes from "./questionsRoutes.js";

const router = express.Router();

router.use("/", authRoutes);
router.use("/", oauthRoutes);
router.use("/", socialRoutes);
router.use("/", adminRoutes);
router.use("/", userDetailsUpdateRoutes);
router.use("/", uploadRoutes);
router.use("/", userAptitudeRoutes);
router.use("/", notificationRoutes);
router.use("/", questionRoutes);
router.use("/", answerRoutes);

export {
  authRoutes,
  socialRoutes,
  oauthRoutes,
  adminRoutes,
  userDetailsUpdateRoutes,
  uploadRoutes,
  userAptitudeRoutes,
  notificationRoutes,
  questionRoutes,
  answerRoutes,
};
