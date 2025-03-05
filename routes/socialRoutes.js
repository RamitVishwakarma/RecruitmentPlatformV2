import express from "express";
import {
  createSocialLink,
  getSocialLinksByUserId,
  updateSocialLink,
  deleteSocialLink,
} from "../controllers/socialLinkController.js";

const router = express.Router();

/**
 * @swagger
 * /social/{userId}:
 *   post:
 *     summary: Create a social link for a user
 *     tags: [User - Social]
 *     description: Adds a new social link for a specific user based on their userId.
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
 *               - name
 *               - link
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the social platform.
 *               link:
 *                 type: string
 *                 description: The URL of the social link.
 *     responses:
 *       201:
 *         description: Social link created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 socialLink:
 *                   type: object
 *       400:
 *         description: Required fields are missing or the link already exists.
 */
router.post("/:userId", createSocialLink);

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
 * /social/{id}:
 *   put:
 *     summary: Update a social link
 *     tags: [User - Social]
 *     description: Update the URL of an existing social link.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the social link.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - link
 *             properties:
 *               link:
 *                 type: string
 *                 description: The new URL for the social link.
 *     responses:
 *       200:
 *         description: Social link updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedLink:
 *                   type: object
 *       400:
 *         description: Required fields are missing or the link already exists.
 *       404:
 *         description: Social link not found.
 */
router.put("/:id", updateSocialLink);

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
