import { Router } from "express";
import { createAnswer } from "../controllers/answerController.js";

const router = Router();

router.route("/create-ans/:questionId").post(createAnswer);
export default router;
