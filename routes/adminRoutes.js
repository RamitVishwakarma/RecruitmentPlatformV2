import { Router } from "express";

import userRoutes from "./userRoutes.js";

import optionsRoutes from "./optionsRoutes.js";
import aptitudeRoutes from "./aptitudeRoutes.js";
import userAptitudeDetailsRoutes from "./userAptitudeDetailsRoutes.js";
import contestProblemRoutes from "./contestProblemRoutes.js";
import contestRoutes from "./contestRoutes.js";
import codingQuestionsRoutes from "./codingQuestionsRoutes.js";
import adminAuthRoutes from "./adminAuthRoutes.js";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js";
import { createQuestion } from "../controllers/questionsController.js";
import { sendNotification } from "../controllers/notificationController.js";

const router = Router();

router.use("/auth", adminAuthRoutes);

router.use(adminAuthMiddleware);

router.route("/questions/create-question").post(createQuestion);
router.route("/notification/send-notification").post(sendNotification);
router.use("/users", userRoutes);
// router.use("/questions", questionRoutes);
router.use("/options", optionsRoutes);
router.use("/aptitude", aptitudeRoutes);
router.use("/users", userAptitudeDetailsRoutes);
router.use("/contest", contestProblemRoutes);
router.use("/contest", contestRoutes);
router.use("/problems", codingQuestionsRoutes);

export default router;
