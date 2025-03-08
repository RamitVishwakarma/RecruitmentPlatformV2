import Router from "express";
import { updateUserProfile } from "../controllers/updateUserDetailsController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * @swagger
 * /users/update-profile:
 *   patch:
 *     summary: Update user profile
 *     description: Allows an authenticated user to update their profile details, including name, photo, year, resume, admission number, domain, photoUrl, and resumeUrl.
 *     tags:
 *       - [User - Profile]
 *     security:
 *       - cookieAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name (optional)
 *               year:
 *                 type: integer
 *                 description: Academic year (optional)
 *               admissionNumber:
 *                 type: string
 *                 description: User's admission number (optional)
 *               domain:
 *                 type: string
 *                 description: User's domain (optional)
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file (optional)
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Resume file (optional)
 *               photoUrl:
 *                 type: string
 *                 description: URL of the profile picture (optional)
 *               resumeUrl:
 *                 type: string
 *                 description: URL of the resume (optional)
 *
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 user:
 *                   type: object
 *                   description: Updated user details
 *       400:
 *         description: Bad request (e.g., file upload failed)
 *       401:
 *         description: Unauthorized (user is not authenticated)
 *       404:
 *         description: User not found
 */

router.patch("/update-profile", authMiddleware, updateUserProfile);

export default router;
