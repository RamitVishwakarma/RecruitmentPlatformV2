import { Router } from "express";
import {
  createQuestion,
  getQuestionById,
  getQuestionsByAptitude,
  updateQuestion,
  deleteQuestion,
  getPaginatedQuestions,
} from "../controllers/questionsController.js";
import { paginationMiddleware } from "../middlewares/paginationMiddleware.js";

const router = Router();

router.route("/create-question").post(createQuestion);
router.route("/").get(paginationMiddleware, getPaginatedQuestions);
router.route("/:id").get(getQuestionById);
router.route("/question-aptitude/:aptitudeId").get(getQuestionsByAptitude);
router.route("/update-question/:id").patch(updateQuestion);
router.route("/delete-question/:id").put(deleteQuestion);

export default router;
