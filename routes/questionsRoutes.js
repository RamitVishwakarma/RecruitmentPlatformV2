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

/**
 * @swagger
 * /admin/questions/create-question:
 *   post:
 *     summary: Create a new question
 *     tags: [Admin - Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionShortDesc:
 *                 type: string
 *               questionLongDesc:
 *                 type: string
 *               aptitudeId:
 *                 type: string
 *             required:
 *               - questionShortDesc
 *               - questionLongDesc
 *               - aptitudeId
 *     responses:
 *       201:
 *         description: Successfully created question
 *       400:
 *         description: Missing required fields
 */
router.route("/create-question").post(createQuestion);

/**
 * @swagger
 * /admin/questions/:
 *   get:
 *     summary: Get paginated questions
 *     tags: [Admin - Questions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of questions per page
 *     responses:
 *       200:
 *         description: Successfully retrieved paginated questions
 *       400:
 *         description: Unable to get questions
 */
router.route("/").get(paginationMiddleware, getPaginatedQuestions);

/**
 * @swagger
 * /admin/questions/{id}:
 *   get:
 *     summary: Get question by ID
 *     tags: [Admin - Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Successfully retrieved question
 *       400:
 *         description: ID is required or question not found
 */
router.route("/:id").get(getQuestionById);

/**
 * @swagger
 * /admin/questions/question-aptitude/{aptitudeId}:
 *   get:
 *     summary: Get questions by aptitude ID
 *     tags: [Admin - Questions]
 *     parameters:
 *       - in: path
 *         name: aptitudeId
 *         schema:
 *           type: string
 *         required: true
 *         description: Aptitude ID
 *     responses:
 *       200:
 *         description: Successfully retrieved questions
 *       400:
 *         description: Unable to get questions or aptitude ID is missing
 */
router.route("/question-aptitude/:aptitudeId").get(getQuestionsByAptitude);

/**
 * @swagger
 * /admin/questions/update-question/{id}:
 *   patch:
 *     summary: Update a question by ID
 *     tags: [Admin - Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionShortDesc:
 *                 type: string
 *               questionLongDesc:
 *                 type: string
 *               aptitudeId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully updated question
 *       400:
 *         description: Unable to update question or ID not found
 */
router.route("/update-question/:id").patch(updateQuestion);

/**
 * @swagger
 * /admin/questions/delete-question/{id}:
 *   put:
 *     summary: Soft delete a question by ID
 *     tags: [Admin - Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Successfully deleted question
 *       400:
 *         description: Unable to delete question or ID not found
 */
router.route("/delete-question/:id").put(deleteQuestion);

export default router;
