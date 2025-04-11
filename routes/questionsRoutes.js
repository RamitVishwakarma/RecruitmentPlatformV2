import { Router } from "express";
import {
  getQuestionById,
  getRandomQuestions,
  deleteQuestion,
  getPaginatedQuestions,
} from "../controllers/questionsController.js";
import { paginationMiddleware } from "../middlewares/paginationMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js";

const router = Router();

// /**
//  * @swagger
//  * /admin/questions/create-question:
//  *   post:
//  *     summary: Create a new question
//  *     tags: [Admin - Questions]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               questionShortDesc:
//  *                 type: string
//  *               questionLongDesc:
//  *                 type: string
//  *               aptitudeId:
//  *                 type: string
//  *             required:
//  *               - questionShortDesc
//  *               - questionLongDesc
//  *               - aptitudeId
//  *     responses:
//  *       201:
//  *         description: Successfully created question
//  *       400:
//  *         description: Missing required fields
//  */

router.use(authMiddleware);

router.route("/random-question").get(getRandomQuestions);

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
// router.route("/question-aptitude/:aptitudeId").get(getQuestionsByAptitude);

/**
 * @swagger
 * /admin/questions/update-question/{id}:
 *   patch:
 *     summary: Update a question with new options
 *     tags: [Admin - Questions]
 *     description: Replaces an existing question with new data including options.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Question ID to update
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionShortDesc:
 *                 type: string
 *                 example: "What is 2 + 2?"
 *               questionLongDesc:
 *                 type: string
 *                 example: "A basic addition question"
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     optionText:
 *                       type: string
 *                       example: "4"
 *                     isCorrect:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       200:
 *         description: Question updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Question updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     questionShortDesc:
 *                       type: string
 *                       example: "What is 2 + 2?"
 *                     questionLongDesc:
 *                       type: string
 *                       example: "A basic addition question"
 *                     options:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: "223e4567-e89b-12d3-a456-426614174000"
 *                           optionText:
 *                             type: string
 *                             example: "4"
 *                           isCorrect:
 *                             type: boolean
 *                             example: true
 *       400:
 *         description: Bad request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Question short description and at least one option are required"
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Question not found"
 */
// router.route("/update-question/:id").patch(updateQuestion);

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
