import express from "express";
import {
  createOrUpdateSocialLinks,
  getSocialLinksByUserId,
  deleteSocialLink,
} from "../controllers/socialLinkController.js";

const router = express.Router();

/**
 * @swagger
 * /social/{userId}:
 *   post:
 *     summary: Create or update multiple social links for a user
 *     tags: [User - Social]
 *     description: Adds new social links for a specific user or updates existing ones based on their userId.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - socialLinks
 *             properties:
 *               socialLinks:
 *                 type: array
 *                 description: Array of social links to add or update.
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - link
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the social platform.
 *                     link:
 *                       type: string
 *                       description: The URL of the social link.
 *     responses:
 *       201:
 *         description: Social links created or updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedLinks:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid input or missing fields.
 *       409:
 *         description: Conflict, all provided links already exist.
 */
router.post("/:userId", createOrUpdateSocialLinks);

/**
 * @swagger
 * /social/{userId}:
 *   get:
 *     summary: Get all social links for a user
 *     tags: [User - Social]
 *     description: Retrieve all social links for a specific user by their userId.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of social links for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   link:
 *                     type: string
 *       404:
 *         description: No social links found for the user.
 */
router.get("/:userId", getSocialLinksByUserId);

/**
 * @swagger
 * /social/{id}/delete:
 *   put:
 *     summary: Delete a social link
 *     tags: [User - Social]
 *     description: Soft delete a social link by marking it as deleted.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the social link.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Social link deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Social link not found.
 */
router.put("/:id/delete", deleteSocialLink);

export default router;
