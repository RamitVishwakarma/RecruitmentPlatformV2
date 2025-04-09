import { Router } from "express";
import upload from "../utils/upload.js";
import {
  uploadPhoto,
  uploadResume,
  submitTaskLink,
} from "../controllers/uploadController.js";

const router = Router();
/**
 * @swagger
 * /upload/photo:
 *   post:
 *     summary: Upload photo
 *     description: Uploads a photo file.
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: The photo to upload
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 *       400:
 *         description: Bad request
 */
router.post("/photo", upload.single("photo"), uploadPhoto);

/**
 * @swagger
 * /upload/resume:
 *   post:
 *     summary: Upload resume
 *     description: Uploads a resume file.
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: The resume to upload
 *     responses:
 *       200:
 *         description: Resume uploaded successfully
 *       400:
 *         description: Bad request
 */
router.post("/resume", upload.single("resume"), uploadResume);

router.route("/:id/task-link").put(submitTaskLink);

export default router;
