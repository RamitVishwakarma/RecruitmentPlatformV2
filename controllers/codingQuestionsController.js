import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCodingQuestion = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    constraints,
    inputFormat,
    outputFormat,
    sampleInput,
    sampleOutput,
    timeLimit,
    memoryLimit,
  } = req.body;

  const question = await prisma.codingQuestion.create({
    data: {
      title,
      description,
      difficulty,
      constraints,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput,
      timeLimit,
      memoryLimit,
    },
  });

  return res.status(201).json(question);
});

const getAllCodingQuestions = asyncHandler(async (req, res) => {
  const questions = await prisma.codingQuestion.findMany({
    where: { isDeleted: false },
  });

  if (questions.length === 0) {
    return res.status(404).json({ error: "No coding questions found" });
  }

  return res.status(200).json(questions);
});

const getCodingQuestionsByContest = asyncHandler(async (req, res) => {
  const { contestId } = req.params;

  const problems = await prisma.contestProblem.findMany({
    where: { contestId, isDeleted: false },
    include: {
      codingQuestion: true,
      testCases: true,
    },
  });

  if (problems.length === 0) {
    return res
      .status(404)
      .json({ error: "No problems found for this contest" });
  }

  return res.status(200).json(problems);
});

const updateCodingQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    constraints,
    inputFormat,
    outputFormat,
    sampleInput,
    sampleOutput,
    timeLimit,
    memoryLimit,
  } = req.body;

  const updateData = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (difficulty) updateData.difficulty = difficulty;
  if (constraints) updateData.constraints = constraints;
  if (inputFormat) updateData.inputFormat = inputFormat;
  if (outputFormat) updateData.outputFormat = outputFormat;
  if (sampleInput) updateData.sampleInput = sampleInput;
  if (sampleOutput) updateData.sampleOutput = sampleOutput;
  if (timeLimit) updateData.timeLimit = timeLimit;
  if (memoryLimit) updateData.memoryLimit = memoryLimit;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: "No fields provided for update." });
  }

  const updatedQuestion = await prisma.codingQuestion.update({
    where: { id },
    data: updateData,
  });

  res.status(200).json(updatedQuestion);
});

const deleteCodingQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  const codingQuestion = await prisma.codingQuestion.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!codingQuestion) {
    return res.status(400).json({ error: "Coding Question does not exist" });
  }
  const deleteCodingQuestion = await prisma.codingQuestion.update({
    where: { id },
    data: { isDeleted: true },
  });

  return res.status(200).json({
    message: "Coding Question deleted successfully",
    data: deleteCodingQuestion,
  });
});

export {
  createCodingQuestion,
  getAllCodingQuestions,
  getCodingQuestionsByContest,
  updateCodingQuestion,
  deleteCodingQuestion,
};
