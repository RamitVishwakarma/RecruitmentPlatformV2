import { Router } from "express";
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  getQuestionsByAptitude,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionsController.js";

const router = Router();

router.route("/create-question").post(createQuestion);
router.route("/").get(getAllQuestions);
router.route("/:id").get(getQuestionById);
router.route("/get-question-by-aptitude/:aptitudeId").get(getQuestionsByAptitude);
router.route("/update-question/:id").patch(updateQuestion);
router.route("/delete-question/:id").delete(deleteQuestion);

export default router;
