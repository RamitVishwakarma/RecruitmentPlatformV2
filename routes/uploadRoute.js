import { Router } from "express";
import upload from "../utils/upload.js";
import { uploadFiles } from "../controllers/uploadController.js";

const router = Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload photo and resume
 *     description: Uploads a photo and a resume file.
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
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: The resume to upload
 *     responses:
 *       200:
 *         description: Files uploaded successfully
 *       400:
 *         description: Bad request
 */
router.post(
  "/upload",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  uploadFiles,
);

export default router;
