import { Router } from "express";
import {
  createContest,
  getAllContests,
  getContestById,
  updateContest,
  deleteContest,
} from "../controllers/contestController.js";
const router = Router();

/**
 * @swagger
 * /contest/create-contest:
 *   post:
 *     summary: Create a new contest
 *     tags: [Contest]
 *     description: Create a new contest with details such as title, description, start date, end date, and problems.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the contest.
 *               description:
 *                 type: string
 *                 description: Description of the contest.
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Start date of the contest (ISO format).
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: End date of the contest (ISO format).
 *     responses:
 *       201:
 *         description: Contest created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the created contest.
 *                 title:
 *                   type: string
 *                   description: Title of the contest.
 *                 problems:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid request body.
 */
router.route("/create-contest").post(createContest);

/**
 * @swagger
 * /contest:
 *   get:
 *     summary: Get all contests
 *     tags: [Contest]
 *     description: Retrieve a list of all contests that are not marked as deleted.
 *     responses:
 *       200:
 *         description: List of contests retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique ID of the contest.
 *                   title:
 *                     type: string
 *                     description: Title of the contest.
 *                   problems:
 *                     type: array
 *                     items:
 *                       type: object
 *       404:
 *         description: No contests found.
 */
router.route("/").get(getAllContests);

/**
 * @swagger
 * /contest/get/{id}:
 *   get:
 *     summary: Get contest by ID
 *     tags: [Contest]
 *     description: Retrieve details of a specific contest by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the contest.
 *     responses:
 *       200:
 *         description: Contest retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique ID of the contest.
 *                 title:
 *                   type: string
 *                   description: Title of the contest.
 *       404:
 *         description: Contest not found.
 */
router.route("/get/:id").get(getContestById);

/**
 * @swagger
 * /contest/update-contest/{id}:
 *   put:
 *     summary: Update a contest
 *     tags: [Contest]
 *     description: Update contest details such as title, description, start date, and end date.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the contest to be updated.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: New title of the contest.
 *               description:
 *                 type: string
 *                 description: New description of the contest.
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: New start date of the contest.
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: New end date of the contest.
 *     responses:
 *       200:
 *         description: Contest updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique ID of the contest.
 *                 title:
 *                   type: string
 *                   description: Updated title of the contest.
 *       404:
 *         description: Contest not found.
 */
router.route("/update-contest/:id").put(updateContest);

/**
 * @swagger
 * /contest/delete-contest/{id}:
 *   put:
 *     summary: Delete a contest
 *     tags: [Contest]
 *     description: Soft-delete a contest by marking it as deleted.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Unique ID of the contest to be deleted.
 *     responses:
 *       200:
 *         description: Contest deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contest deleted successfully.
 *       400:
 *         description: Contest not found or already deleted.
 */
router.route("/delete-contest/:id").put(deleteContest);

export default router;
