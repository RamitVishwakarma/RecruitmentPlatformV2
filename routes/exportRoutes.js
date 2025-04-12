import { Router } from "express";
import { exportData } from "../controllers/exportController.js";

const router = Router();

/**
 * @swagger
 * /admin/excel/export:
 *   get:
 *     summary: Export all user data to an Excel file
 *     tags: [Admin-Upload]
 *     description: Retrieves all users along with their social links and answers, flattens the data, and exports it as an Excel file.
 *     responses:
 *       200:
 *         description: Successfully generated and returned the Excel file.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Internal server error while generating Excel file.
 */
router.route("/export").get(exportData);

export default router;
