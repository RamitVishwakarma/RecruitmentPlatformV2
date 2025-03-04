import { Router } from "express";
import {
  createContestProblem,
  getAllContestProblems,
  getContestProblemsByYear,
  updateContestProblem,
  deleteContestProblem,
} from "../controllers/contestProblemController.js";
const router = Router();

/**
 * @swagger
 * /admin/contest/create/problem:
 *   post:
 *     summary: Create a new contest problem
 *     tags: [Contest]
 *     description: Add a new problem to a contest, including test cases and year information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contestId:
 *                 type: string
 *                 description: ID of the contest.
 *               codingQuestionId:
 *                 type: string
 *                 description: ID of the coding question.
 *               year:
 *                 type: integer
 *                 description: Year of the contest problem.
 *     responses:
 *       201:
 *         description: Contest problem created successfully.
 *       400:
 *         description: Missing required fields.
 */
router.route("/create/problem").post(createContestProblem);

/**
 * @swagger
 * /admin/contest/problems:
 *   get:
 *     summary: Get contest problems by year
 *     tags: [Contest]
 *     description: Retrieve contest problems based on the year and contest ID.
 *     parameters:
 *       - in: query
 *         name: contestId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the contest.
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         required: true
 *         description: Year of the contest problems.
 *     responses:
 *       200:
 *         description: Contest problems retrieved successfully.
 *       404:
 *         description: No problems found for the specified year.
 */
router.route("/problems").get(getContestProblemsByYear);

/**
 * @swagger
 * /admin/contest/get/{contestId}:
 *   get:
 *     summary: Get all problems for a contest
 *     tags: [Contest]
 *     description: Retrieve all problems associated with a specific contest.
 *     parameters:
 *       - in: path
 *         name: contestId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the contest.
 *     responses:
 *       200:
 *         description: Problems retrieved successfully.
 *       404:
 *         description: No problems found for the contest.
 */

router.route("/get/:contestId").get(getAllContestProblems);

/**
 * @swagger
 * /admin/contest/update/{id}:
 *   put:
 *     summary: Update a contest problem
 *     tags: [Contest]
 *     description: Update the year or other fields of a contest problem.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the contest problem to be updated.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: integer
 *                 description: New year for the contest problem.
 *     responses:
 *       200:
 *         description: Contest problem updated successfully.
 *       404:
 *         description: Contest problem not found.
 *       400:
 *         description: No valid fields provided for update.
 */
router.route("/update/:id").put(updateContestProblem);

/**
 * @swagger
 * /admin/contest/delete/{id}:
 *   put:
 *     summary: Delete a contest problem
 *     tags: [Contest]
 *     description: Soft-delete a contest problem by marking it as deleted.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the contest problem to be deleted.
 *     responses:
 *       200:
 *         description: Contest problem deleted successfully.
 *       400:
 *         description: Contest problem not found or already deleted.
 */
router.route("/delete/:id").put(deleteContestProblem);

export default router;
