import { Router } from "express";
import {
  createOption,
  getOptionById,
  getOptionsByQuestion,
  updateOption,
  deleteOption,
} from "../controllers/optionsController.js";
const router = Router();

/**
 * @swagger
 * /options/create-option:
 *   post:
 *     summary: Create a new option
 *     tags: [Options]
 *     description: Adds a new option for a specific question.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - optionText
 *               - isCorrect
 *               - questionId
 *             properties:
 *               optionText:
 *                 type: string
 *                 description: The text of the option.
 *               isCorrect:
 *                 type: boolean
 *                 description: Indicates whether the option is correct.
 *               questionId:
 *                 type: string
 *                 description: The ID of the question this option belongs to.
 *     responses:
 *       201:
 *         description: Option created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Required fields are missing or the option could not be created.
 */
router.route("/create-option").post(createOption);

/**
 * @swagger
 * /options/option-question/{questionId}:
 *   get:
 *     summary: Get all options for a question
 *     tags: [Options]
 *     description: Retrieve all options for a specific question using the questionId.
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *         description: The ID of the question.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of options for the question.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 message:
 *                   type: string
 *       400:
 *         description: Question ID is missing or options could not be retrieved.
 */
router.route("/option-question/:questionId").get(getOptionsByQuestion);

/**
 * @swagger
 * /options/{id}:
 *   get:
 *     summary: Get an option by ID
 *     tags: [Options]
 *     description: Retrieve a specific option using its unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the option.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The option details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *       400:
 *         description: Option ID is missing or the option could not be retrieved.
 */
router.route("/:id").get(getOptionById);

/**
 * @swagger
 * /options/update-option/{id}:
 *   patch:
 *     summary: Update an option
 *     tags: [Options]
 *     description: Modify the text or correctness of an option.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the option.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - optionText
 *               - isCorrect
 *             properties:
 *               optionText:
 *                 type: string
 *                 description: The updated text of the option.
 *               isCorrect:
 *                 type: boolean
 *                 description: Indicates whether the option is correct.
 *     responses:
 *       201:
 *         description: Option updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *       400:
 *         description: Option ID is missing, or the option could not be updated.
 */
router.route("/update-option/:id").patch(updateOption);

/**
 * @swagger
 * /options/delete-option/{id}:
 *   put:
 *     summary: Delete an option
 *     tags: [Options]
 *     description: Soft delete an option by marking it as deleted.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the option.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Option deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Option ID is missing, or the option could not be deleted.
 */
router.route("/delete-option/:id").put(deleteOption);

export default router;
