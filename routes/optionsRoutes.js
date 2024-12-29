import { Router } from "express";
import {
  createOption,
  getOptionById,
  getOptionsByQuestion,
  updateOption,
  deleteOption,
} from "../controllers/optionsController.js";
const router = Router();

router.route("/create-option").post(createOption);
router.route("/get-option-by-question/:questionId").get(getOptionsByQuestion);
router.route("/:id").get(getOptionById);
router.route("/update-option/:id").patch(updateOption);
router.route("/delete-option/:id").delete(deleteOption);

export default router;
