import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";

import { getAptitudes } from "../controllers/userAptitudeController.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /users/aptitude:
 *   get:
 *     summary: Fetch all aptitudes with optional filters
 *     description: Retrieve a list of aptitudes based on year and domain filters.
 *     tags:
 *       - [Users - Aptitude]
 *     parameters:
 *       - in: query
 *         name: aptitudeYear
 *         required: false
 *         description: Filter aptitudes by year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: aptitudeDomain
 *         required: false
 *         description: Filter aptitudes by domain
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched aptitudes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       aptitudeTitle:
 *                         type: string
 *                       aptitudeShortDesc:
 *                         type: string
 *                       aptitudeDomain:
 *                         type: string
 *                       aptitudeYear:
 *                         type: integer
 *                       aptitudeDuration:
 *                         type: integer
 *                       aptitudeQuestions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             questionShortDesc:
 *                               type: string
 *                             options:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                     format: uuid
 *                                   optionText:
 *                                     type: string
 *                                   isCorrect:
 *                                     type: boolean
 *       404:
 *         description: No aptitudes found
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
 *                   example: "No aptitudes found"
 */

router.get("/aptitude", getAptitudes);

export default router;
