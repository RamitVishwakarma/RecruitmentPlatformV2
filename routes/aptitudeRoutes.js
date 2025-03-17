import { Router } from "express";
import {
  createAptitude,
  getAllAptitudes,
  getAptitudesById,
  updateAptitude,
  deleteAptitude,
} from "../controllers/aptitudeController.js";
const router = Router();

/**
 * @swagger
 * /admin/aptitude/create-aptitude:
 *   post:
 *     summary: Create a new aptitude with questions and options
 *     description: Creates an aptitude including multiple questions and options in one go.
 *     tags: [Admin - Aptitude]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               aptitudeTitle:
 *                 type: string
 *                 example: "Logical Reasoning Test"
 *               aptitudeDomain:
 *                 type: string
 *                 example: "Logical Reasoning"
 *               aptitudeYear:
 *                 type: integer
 *                 example: 2024
 *               aptitudeDuration:
 *                 type: integer
 *                 example: 60
 *               beginsAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-01T00:00:00Z"
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59Z"
 *               questions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionShortDesc:
 *                       type: string
 *                       example: "What comes next in the series? 2, 4, 8, 16, ?"
 *                     options:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           optionText:
 *                             type: string
 *                             example: "32"
 *                           isCorrect:
 *                             type: boolean
 *                             example: true
 *     responses:
 *       201:
 *         description: Aptitude created successfully
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
 *                   example: "Aptitude created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     aptitudeTitle:
 *                       type: string
 *                       example: "Logical Reasoning Test"
 *                     aptitudeQuestions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             example: "223e4567-e89b-12d3-a456-426614174000"
 *                           questionShortDesc:
 *                             type: string
 *                             example: "What comes next in the series? 2, 4, 8, 16, ?"
 *                           options:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                   format: uuid
 *                                   example: "323e4567-e89b-12d3-a456-426614174000"
 *                                 optionText:
 *                                   type: string
 *                                   example: "32"
 *                                 isCorrect:
 *                                   type: boolean
 *                                   example: true
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
 *                   example: "All required fields (title, domain, year, duration, questions) must be provided"
 */

router.route("/create-aptitude").post(createAptitude);

/**
 * @swagger
 * /admin/aptitude/get-all-aptitudes:
 *   get:
 *     summary: Get all aptitudes with optional filters
 *     description: Fetches all aptitudes. Supports filtering by domain and year.
 *     tags: [Admin - Aptitude]
 *     parameters:
 *       - in: query
 *         name: aptitudeDomain
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by aptitude domain
 *         example: "Logical Reasoning"
 *       - in: query
 *         name: aptitudeYear
 *         schema:
 *           type: integer
 *         required: false
 *         description: Filter by aptitude year
 *         example: 2024
 *     responses:
 *       200:
 *         description: List of aptitudes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       aptitudeTitle:
 *                         type: string
 *                         example: "Logical Reasoning Test"
 *                       aptitudeDomain:
 *                         type: string
 *                         example: "Logical Reasoning"
 *                       aptitudeYear:
 *                         type: integer
 *                         example: 2024
 *                       aptitudeDuration:
 *                         type: integer
 *                         example: 60
 *       400:
 *         description: Invalid query parameters
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
 *                   example: "Invalid query parameters"
 */

router.route("/get-all-aptitudes").get(getAllAptitudes);

/**
 * @swagger
 * /admin/aptitude/{id}:
 *   get:
 *     summary: Get a specific aptitude test by ID
 *     tags: [Admin - Aptitude]
 *     description: Retrieve details of a specific aptitude test using its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the aptitude test.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Details of the aptitude test.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 aptitudeTitle:
 *                   type: string
 *                 aptitudeShortDesc:
 *                   type: string
 *                 aptitudeDomain:
 *                   type: string
 *                 aptitudeYear:
 *                   type: integer
 *                 aptitudeDuration:
 *                   type: integer
 *                 aptitudeQuestions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       questionText:
 *                         type: string
 *       404:
 *         description: Aptitude test not found.
 */
router.route("/:id").get(getAptitudesById);

/**
 * @swagger
 * /admin/aptitude/update-aptitude/{id}:
 *   put:
 *     summary: Update an aptitude test
 *     tags: [Admin - Aptitude]
 *     description: Update the details of an existing aptitude test using its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the aptitude test to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - shortDescription
 *               - domain
 *               - year
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               longDescription:
 *                 type: string
 *               domain:
 *                 type: string
 *               year:
 *                 type: integer
 *               duration:
 *                 type: integer
 *               beginsAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-01T00:00:00Z"
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-31T23:59:59Z"
 *     responses:
 *       200:
 *         description: Aptitude test updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedAptitude:
 *                   type: object
 *       404:
 *         description: Aptitude test not found.
 */
router.route("/update-aptitude/:id").put(updateAptitude);

/**
 * @swagger
 * /admin/aptitude/delete-aptitude/{id}:
 *   put:
 *     summary: Delete an aptitude test
 *     tags: [Admin - Aptitude]
 *     description: Soft delete an aptitude test using its ID by marking it as deleted.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the aptitude test to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aptitude test deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Aptitude test not found.
 */
router.route("/delete-aptitude/:id").put(deleteAptitude);

export default router;
