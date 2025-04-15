import express from "express";
import {
  submitSolution,
  runCode,
  getAllSubmissions,
  getProblemSubmissionsList,
} from "../controllers/contestSubmissionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes are protected and require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/contest/submit:
 *   post:
 *     summary: Submit code for evaluation
 *     tags: [Contest]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *               - code
 *               - languageId
 *             properties:
 *               questionId:
 *                 type: string
 *                 description: ID of the coding question (1-10, based on year)
 *                 example: "1"
 *               code:
 *                 type: string
 *                 description: Source code to be evaluated
 *               languageId:
 *                 type: number
 *                 description: Judge0 language ID (e.g., 93 for JavaScript, 92 for Python)
 *                 example: 93
 *               year:
 *                 type: integer
 *                 description: Student's year (year 1 can access questions 1-5, year 2 can access 6-10)
 *                 enum: [1, 2]
 *                 default: 1
 *     responses:
 *       200:
 *         description: Submission evaluated successfully
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
 *                   example: Submission accepted
 *                 data:
 *                   type: object
 *                   properties:
 *                     submission:
 *                       $ref: '#/components/schemas/ContestSubmission'
 *                     testResults:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           testIndex:
 *                             type: integer
 *                             example: 0
 *                           passed:
 *                             type: boolean
 *                             example: true
 *                           output:
 *                             type: string
 *                             example: "15"
 *                           execution_time:
 *                             type: number
 *                             example: 0.056
 *                           memory_used:
 *                             type: number
 *                             example: 8560
 *                           status:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 3
 *                               description:
 *                                 type: string
 *                                 example: Accepted
 *                     allTestsPassed:
 *                       type: boolean
 *                       example: true
 *                     score:
 *                       type: integer
 *                       description: Percentage of test cases passed (0-100)
 *                       example: 100
 *                     passedTestCount:
 *                       type: integer
 *                       description: Number of test cases passed
 *                       example: 5
 *                     totalTests:
 *                       type: integer
 *                       description: Total number of test cases
 *                       example: 5
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/submit", submitSolution);

/**
 * @swagger
 * /api/contest/run:
 *   post:
 *     summary: Run code against the first test case only
 *     tags: [Contest]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *               - code
 *               - languageId
 *             properties:
 *               questionId:
 *                 type: string
 *                 description: ID of the coding question (1-10, based on year)
 *                 example: "1"
 *               code:
 *                 type: string
 *                 description: Source code to be evaluated
 *               languageId:
 *                 type: number
 *                 description: Judge0 language ID (e.g., 93 for JavaScript, 92 for Python)
 *                 example: 93
 *               year:
 *                 type: integer
 *                 description: Student's year (year 1 can access questions 1-5, year 2 can access 6-10)
 *                 enum: [1, 2]
 *                 default: 1
 *     responses:
 *       200:
 *         description: Code run successfully against the first test case
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     output:
 *                       type: string
 *                       example: "15"
 *                     error:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     executionTime:
 *                       type: number
 *                       example: 0.045
 *                     memory:
 *                       type: number
 *                       example: 8452
 *                     status:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 3
 *                         description:
 *                           type: string
 *                           example: "Accepted"
 *                     passed:
 *                       type: boolean
 *                       example: true
 *                     expected:
 *                       type: string
 *                       example: "15"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/run", runCode);

/**
 * @swagger
 * /api/contest/submissions:
 *   get:
 *     summary: Get all submissions for the current user
 *     tags: [Contest]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContestSubmission'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/submissions", getAllSubmissions);

/**
 * @swagger
 * /api/contest/submissions/{problemId}:
 *   get:
 *     summary: Get submissions for a specific problem
 *     tags: [Contest]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: problemId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the problem (1-10)
 *         example: "1"
 *     responses:
 *       200:
 *         description: List of submissions for the specified problem
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContestSubmission'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/submissions/:problemId", getProblemSubmissionsList);

/**
 * @swagger
 * components:
 *   schemas:
 *     ContestSubmission:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         userId:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174001
 *         contestProblemId:
 *           type: string
 *           description: Problem ID (1-10)
 *           example: "1"
 *         code:
 *           type: string
 *           example: "function sum(a, b) { return a + b; }"
 *         language:
 *           type: string
 *           description: Judge0 language ID
 *           example: "93"
 *         status:
 *           type: string
 *           enum: [PENDING, ACCEPTED, REJECTED, ERROR, PARTIAL]
 *           example: ACCEPTED
 *         score:
 *           type: integer
 *           description: Percentage of test cases passed (0-100)
 *           example: 100
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-04-12T10:30:00Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-04-12T10:30:15Z
 *         isDeleted:
 *           type: boolean
 *           example: false
 */

export default router;
