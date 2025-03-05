import { Router } from "express";

import userRoutes from "./userRoutes.js";
import questionRoutes from "./questionsRoutes.js";
import optionsRoutes from "./optionsRoutes.js";
import aptitudeRoutes from "./aptitudeRoutes.js";
import userAptitudeDetailsRoutes from "./userAptitudeDetailsRoutes.js";
import contestProblemRoutes from "./contestProblemRoutes.js";
import contestRoutes from "./contestRoutes.js";
import testcaseRoutes from "./testcaseRoutes.js";
import codingQuestionsRoutes from "./codingQuestionsRoutes.js";
import adminAuthRoutes from "./adminAuthRoutes.js";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js";

const router = Router();

router.use("/auth", adminAuthRoutes);

router.use(adminAuthMiddleware);

router.use("/users", userRoutes);
router.use("/questions", questionRoutes);
router.use("/options", optionsRoutes);
router.use("/aptitude", aptitudeRoutes);
router.use("/users", userAptitudeDetailsRoutes);
router.use("/contest", contestProblemRoutes);
router.use("/contest", contestRoutes);
router.use("/contest", testcaseRoutes);
router.use("/problems", codingQuestionsRoutes);

export default router;
