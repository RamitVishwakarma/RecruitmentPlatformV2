import { Router } from "express";
import {
  createUserAptitudeDetails,
  getUserAptitudeDetails,
  updateUserAptitudeDetails,
  deleteUserAptitudeDetails,
} from "../controllers/userAptitudeDetailsController.js";
const router = Router();

/**
 * @swagger
 * /admin/users/create-details:
 *   post:
 *     summary: Create user aptitude details
 *     tags: [Aptitude-Details]
 *     description: Create new aptitude details for a user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - aptitudeScore
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The unique ID of the user.
 *               aptitudeScore:
 *                 type: number
 *                 description: The aptitude score of the user.
 *     responses:
 *       201:
 *         description: User aptitude details created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 newDetails:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     aptitudeScore:
 *                       type: number
 *       400:
 *         description: Bad request if data is invalid.
 */
router.route("/create-details").post(createUserAptitudeDetails);

/**
 * @swagger
 * /admin/users/get-details/{userId}:
 *   get:
 *     summary: Get user aptitude details
 *     tags: [Aptitude-Details]
 *     description: Retrieve the aptitude details for a specific user using the user ID.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User aptitude details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 details:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     aptitudeScore:
 *                       type: number
 *       404:
 *         description: User aptitude details not found.
 */
router.route("/get-details/:userId").get(getUserAptitudeDetails);

/**
 * @swagger
 * /admin/users/update-details/{userId}:
 *   put:
 *     summary: Update user aptitude details
 *     tags: [Aptitude-Details]
 *     description: Update the aptitude details of a user using the user ID.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - aptitudeScore
 *             properties:
 *               aptitudeScore:
 *                 type: number
 *                 description: The updated aptitude score.
 *     responses:
 *       200:
 *         description: User aptitude details updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedDetails:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     aptitudeScore:
 *                       type: number
 *       404:
 *         description: User aptitude details not found.
 */
router.route("/update-details/:userId").put(updateUserAptitudeDetails);

/**
 * @swagger
 * /admin/users/delete-details/{userId}:
 *   put:
 *     summary: Delete user aptitude details
 *     tags: [Aptitude-Details]
 *     description: Soft delete the aptitude details of a user using the user ID.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User aptitude details deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User aptitude details not found.
 */
router.route("/delete-details/:userId").put(deleteUserAptitudeDetails);

export default router;
