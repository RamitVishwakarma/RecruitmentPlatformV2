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
 *     summary: Create a new aptitude test
 *     tags: [Admin - Aptitude]
 *     description: Create a new aptitude test with its details and associated questions.
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
 *                 description: The title of the aptitude test.
 *               shortDescription:
 *                 type: string
 *                 description: A short description of the test.
 *               longDescription:
 *                 type: string
 *                 description: A long description of the test (optional).
 *               domain:
 *                 type: string
 *                 description: The domain of the aptitude test.
 *               year:
 *                 type: integer
 *                 description: The year of the aptitude test.
 *               duration:
 *                 type: integer
 *                 description: The duration of the aptitude test in minutes.
 *     responses:
 *       201:
 *         description: Aptitude test created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 aptitude:
 *                   type: object
 *       400:
 *         description: Missing required fields.
 */
router.route("/create-aptitude").post(createAptitude);

/**
 * @swagger
 * /admin/aptitude/:
 *   get:
 *     summary: Get all aptitude tests
 *     tags: [Admin - Aptitude]
 *     description: Retrieve all aptitude tests that are not marked as deleted.
 *     responses:
 *       200:
 *         description: A list of all aptitude tests.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   aptitudeTitle:
 *                     type: string
 *                   aptitudeShortDesc:
 *                     type: string
 *                   aptitudeDomain:
 *                     type: string
 *                   aptitudeYear:
 *                     type: integer
 *                   aptitudeDuration:
 *                     type: integer
 *       500:
 *         description: Server error.
 */
router.route("/").get(getAllAptitudes);

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
