import express from "express";
import questionRoutes from "./questionsRoutes.js";
import optionsRoutes from "./optionsRoutes.js";
import userRoutes from "./userRoutes.js";
import aptitudeRoutes from "./aptitudeRoutes.js";
import userAptitudeDetailsRoutes from "./userAptitudeDetailsRoutes.js";
import authRoutes from "./authRoutes.js";
import socialRoutes from "./socialRoutes.js";
import oauthRoutes from "./oauthRoutes.js";
import contestRoutes from "./contestRoutes.js";
import contestProblemRoutes from "./contestProblemRoutes.js";
import codingQuestionsRoutes from "./codingQuestionsRoutes.js";
import testcaseRoutes from "./testcaseRoutes.js";

const router = express.Router();

router.use("/", questionRoutes);
router.use("/", optionsRoutes);
router.use("/", aptitudeRoutes);
router.use("/", userRoutes);
router.use("/", userAptitudeDetailsRoutes);
router.use("/", authRoutes);
router.use("/", oauthRoutes);
router.use("/", socialRoutes);
router.use("/", contestProblemRoutes);
router.use("/", contestRoutes);
router.use("/", codingQuestionsRoutes);
router.use("/", testcaseRoutes);

export {
  userRoutes,
  aptitudeRoutes,
  userAptitudeDetailsRoutes,
  optionsRoutes,
  questionRoutes,
  authRoutes,
  socialRoutes,
  oauthRoutes,
  contestRoutes,
  contestProblemRoutes,
  codingQuestionsRoutes,
  testcaseRoutes,
};
