import { Router } from "express";
import {
  createTestCase,
  getAllTestCasesForProblem,
  updateTestCase,
  deleteTestCase,
} from "../controllers/testcaseController.js";
const router = Router();

/**
 * @swagger
 * /contest/create-testcase:
 *   post:
 *     summary: Create a new test case for a problem
 *     tags: [Contest]
 *     description: Add a new test case for a contest problem with input and expected output.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               problemId:
 *                 type: string
 *                 description: The ID of the contest problem the test case belongs to.
 *               input:
 *                 type: string
 *                 description: The input for the test case.
 *               expectedOutput:
 *                 type: string
 *                 description: The expected output for the test case.
 *     responses:
 *       201:
 *         description: Test case created successfully.
 *       400:
 *         description: Missing required fields.
 */
router.route("/create-testcase").post(createTestCase);

/**
 * @swagger
 * /contest/all/{contestProblemId}:
 *   get:
 *     summary: Get all test cases for a specific problem
 *     tags: [Contest]
 *     description: Retrieve all test cases associated with a specific contest problem.
 *     parameters:
 *       - in: path
 *         name: contestProblemId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the contest problem to retrieve test cases for.
 *     responses:
 *       200:
 *         description: List of test cases retrieved successfully.
 *       404:
 *         description: No test cases found for the given problem.
 */
router.route("/all/:contestProblemId").get(getAllTestCasesForProblem);

/**
 * @swagger
 * /contest/update-testcase/{id}:
 *   put:
 *     summary: Update a test case
 *     tags: [Contest]
 *     description: Update the input and/or expected output for a specific test case.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the test case to update.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               input:
 *                 type: string
 *                 description: The updated input for the test case.
 *               expectedOutput:
 *                 type: string
 *                 description: The updated expected output for the test case.
 *     responses:
 *       200:
 *         description: Test case updated successfully.
 *       400:
 *         description: No valid fields provided for update.
 *       404:
 *         description: Test case not found.
 */
router.route("/update-testcase/:id").put(updateTestCase);

/**
 * @swagger
 * /contest/delete-testcase/{id}:
 *   put:
 *     summary: Delete a test case
 *     tags: [Contest]
 *     description: Soft-delete a test case by marking it as deleted.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the test case to delete.
 *     responses:
 *       200:
 *         description: Test case deleted successfully.
 *       400:
 *         description: Test case not found or already deleted.
 */
router.route("/delete-testcase/:id").put(deleteTestCase);

export default router;
