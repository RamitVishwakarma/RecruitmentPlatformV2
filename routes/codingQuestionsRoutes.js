import { Router } from "express";
import {
  createCodingQuestion,
  getAllCodingQuestions,
  getCodingQuestionsByContest,
  updateCodingQuestion,
  deleteCodingQuestion,
} from "../controllers/codingQuestionsController.js";
const router = Router();

/**
 * @swagger
 * /problems/create/coding-question:
 *   post:
 *     summary: Create a new coding question
 *     tags: [Coding-Problems]
 *     description: Add a new coding question to the database with various attributes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the coding question.
 *               description:
 *                 type: string
 *                 description: Detailed description of the coding question.
 *               difficulty:
 *                 type: string
 *                 description: Difficulty level of the question (easy, medium, hard).
 *               constraints:
 *                 type: string
 *                 description: Constraints for solving the question.
 *               inputFormat:
 *                 type: string
 *                 description: Format of the input.
 *               outputFormat:
 *                 type: string
 *                 description: Format of the output.
 *               sampleInput:
 *                 type: string
 *                 description: Example input for the question.
 *               sampleOutput:
 *                 type: string
 *                 description: Example output for the question.
 *               timeLimit:
 *                 type: integer
 *                 description: Maximum execution time allowed for the question (in milliseconds).
 *               memoryLimit:
 *                 type: integer
 *                 description: Maximum memory allowed for the question (in MB).
 *     responses:
 *       201:
 *         description: Coding question created successfully.
 *       400:
 *         description: Missing required fields.
 */
router.route("/create/coding-question").post(createCodingQuestion);

/**
 * @swagger
 * /problems/:
 *   get:
 *     summary: Get all coding questions
 *     tags: [Coding-Problems]
 *     description: Retrieve all coding questions that are not marked as deleted.
 *     responses:
 *       200:
 *         description: List of all coding questions.
 *       404:
 *         description: No coding questions found.
 */

router.route("/").get(getAllCodingQuestions);

/**
 * @swagger
 * /problems/{contestId}:
 *   get:
 *     summary: Get all coding questions for a specific contest
 *     tags: [Coding-Problems]
 *     description: Retrieve coding questions associated with a given contest ID.
 *     parameters:
 *       - in: path
 *         name: contestId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the contest.
 *     responses:
 *       200:
 *         description: List of coding questions retrieved successfully.
 *       404:
 *         description: No coding questions found for the given contest.
 */
router.route("/:contestId").get(getCodingQuestionsByContest);

/**
 * @swagger
 * /problems/update/coding-question/{id}:
 *   put:
 *     summary: Update a coding question
 *     tags: [Coding-Problems]
 *     description: Update the details of a specific coding question.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the coding question to update.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the question.
 *               description:
 *                 type: string
 *                 description: Updated description of the question.
 *               difficulty:
 *                 type: string
 *                 description: Updated difficulty level.
 *               constraints:
 *                 type: string
 *                 description: Updated constraints.
 *               inputFormat:
 *                 type: string
 *                 description: Updated input format.
 *               outputFormat:
 *                 type: string
 *                 description: Updated output format.
 *               sampleInput:
 *                 type: string
 *                 description: Updated example input.
 *               sampleOutput:
 *                 type: string
 *                 description: Updated example output.
 *               timeLimit:
 *                 type: integer
 *                 description: Updated maximum execution time (in milliseconds).
 *               memoryLimit:
 *                 type: integer
 *                 description: Updated maximum memory usage (in MB).
 *     responses:
 *       200:
 *         description: Coding question updated successfully.
 *       404:
 *         description: Coding question not found.
 *       400:
 *         description: No valid fields provided for update.
 */
router.route("/update/coding-question/:id").put(updateCodingQuestion);

/**
 * @swagger
 * /problems/delete/coding-question/{id}:
 *   put:
 *     summary: Delete a coding question
 *     tags: [Coding-Problems]
 *     description: Soft-delete a coding question by marking it as deleted.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the coding question to delete.
 *     responses:
 *       200:
 *         description: Coding question deleted successfully.
 *       400:
 *         description: Coding question not found or already deleted.
 */
router.route("/delete/coding-question/:id").put(deleteCodingQuestion);

export default router;
