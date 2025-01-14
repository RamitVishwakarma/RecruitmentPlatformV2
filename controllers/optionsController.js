import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Options
/**
 * @swagger
 * /options:
 *   get:
 *     summary: Get options for a question
 *     description: Retrieve all options for a specific question.
 *     parameters:
 *       - name: questionId
 *         in: query
 *         description: The ID of the question for which options are to be fetched.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of options
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   optionId:
 *                     type: integer
 *                   optionText:
 *                     type: string
 *                   isCorrect:
 *                     type: boolean
 */
const createOption = asyncHandler(async (req, res) => {
  const { optionText, isCorrect, questionId } = req.body;
  if (!optionText || isCorrect.length === 0 || !questionId) {
    return res.status(400).json({
      error: "OptionText,isCorrect and questionId fields are required",
    });
  }

  const newOption = await prisma.option.create({
    data: {
      optionText,
      isCorrect,
      questionId,
    },
    include: {
      question: true,
    },
  });

  if (!newOption) {
    res.status(400).json({ error: "Could not create option" });
  }
  res.status(201).json({ message: "Option created", data: newOption });
});

/**
 * @swagger
 * /options:
 *   get:
 *     summary: Get options for a question
 *     description: Retrieve all options for a specific question.
 *     parameters:
 *       - name: questionId
 *         in: query
 *         description: The ID of the question for which options are to be fetched.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of options
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   optionId:
 *                     type: integer
 *                   optionText:
 *                     type: string
 *                   isCorrect:
 *                     type: boolean
 */
const getOptionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  const option = await prisma.option.findUnique({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  if (!option) {
    return res.status(400).json({ error: "unable to get option" });
  }
  return res
    .status(200)
    .json({ data: option, message: "option retrieved successfully" });
});

/**
 * @swagger
 * /options:
 *   get:
 *     summary: Get options for a question
 *     description: Retrieve all options for a specific question.
 *     parameters:
 *       - name: questionId
 *         in: query
 *         description: The ID of the question for which options are to be fetched.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of options
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   optionId:
 *                     type: integer
 *                   optionText:
 *                     type: string
 *                   isCorrect:
 *                     type: boolean
 */
const getOptionsByQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  if (!questionId) {
    return res.status(400).json({ error: "question id is required" });
  }

  const options = await prisma.option.findMany({
    where: {
      questionId,
      isDeleted: false,
    },
  });
  if (options.length === 0) {
    return res.status(400).json({ error: "unable to get options" });
  }
  return res
    .status(200)
    .json({ data: options, message: "options fetched successfully" });
});

/**
 * @swagger
 * /options:
 *   get:
 *     summary: Get options for a question
 *     description: Retrieve all options for a specific question.
 *     parameters:
 *       - name: questionId
 *         in: query
 *         description: The ID of the question for which options are to be fetched.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of options
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   optionId:
 *                     type: integer
 *                   optionText:
 *                     type: string
 *                   isCorrect:
 *                     type: boolean
 */
const updateOption = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { optionText, isCorrect } = req.body;
  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  const option = await prisma.option.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!option) {
    return res.status(400).json({ error: "option not found" });
  }

  const updatedOption = await prisma.option.update({
    where: {
      id,
      isDeleted: false,
    },
    data: {
      optionText,
      isCorrect,
    },
  });
  if (!updatedOption) {
    return res.status(400).json({ error: "unable to update option" });
  }
  return res
    .status(201)
    .json({ data: updatedOption, message: "option updated" });
});

/**
 * @swagger
 * /options:
 *   get:
 *     summary: Get options for a question
 *     description: Retrieve all options for a specific question.
 *     parameters:
 *       - name: questionId
 *         in: query
 *         description: The ID of the question for which options are to be fetched.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of options
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   optionId:
 *                     type: integer
 *                   optionText:
 *                     type: string
 *                   isCorrect:
 *                     type: boolean
 */
const deleteOption = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  const option = await prisma.option.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!option) {
    return res.status(400).json({ error: "option does not exist" });
  }
  await prisma.option.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });
  return res.status(200).json({ message: "option deleted successfully" });
});

export {
  createOption,
  getOptionById,
  getOptionsByQuestion,
  deleteOption,
  updateOption,
};
