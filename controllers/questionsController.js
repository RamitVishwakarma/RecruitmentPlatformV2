import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//Questions
const createQuestion = asyncHandler(async (req, res) => {
  const { questionShortDesc, questionLongDesc, aptitudeId, options } = req.body;

  if (!questionShortDesc || !questionLongDesc || !aptitudeId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newQuestion = await prisma.question.create({
    data: {
      questionShortDesc: questionShortDesc,
      questionLongDesc,
      aptitudeId: aptitudeId,
      options: {
        create: options,
      },
    },
    include: {
      options: true,
      aptitude: true,
    },
  });
  return res
    .status(201)
    .json({ data: newQuestion, message: "Question created successfully" });
});

const getQuestionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  const question = await prisma.question.findUnique({
    where: {
      id: id,
      isDeleted: false,
    },
    include: {
      options: true,
    },
  });

  if (!question) {
    return res.status(400).json({ error: "Unable to get question" });
  }
  return res
    .status(200)
    .json({ message: "Question retrieved successfully", data: question });
});

const getQuestionsByAptitude = asyncHandler(async (req, res) => {
  const { aptitudeId } = req.params;
  if (!aptitudeId) {
    return res.status(400).json({ error: "Aptitude id is required" });
  }

  const questions = await prisma.question.findMany({
    where: {
      aptitudeId,
      isDeleted: false,
    },
    include: {
      options: true,
    },
  });
  if (questions.length === 0) {
    return res
      .status(400)
      .json({ message: "Unable to get question", error: error.message });
  }
  return res
    .status(200)
    .json({ message: "Questions retrieved successfully", data: questions });
});

const deleteQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }
  const question = await prisma.question.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!question) {
    return res.status(400).json({ error: "Question does not exist" });
  }
  const deletedQuestion = await prisma.question.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });
  if (!deletedQuestion) {
    return res.status(400).json({ error: "Unable to delete question" });
  }
  return res.status(200).json({ message: "Successfully  deleted question" });
});

const updateQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { questionLongDesc, questionShortDesc, aptitudeId } = req.body;
  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  const question = await prisma.question.findUnique({
    where: {
      id,
    },
  });

  if (!question) {
    return res.status(400).json({ error: "Question does not exist" });
  }

  const updatedQuestion = await prisma.question.update({
    where: { id, isDeleted: false },
    data: {
      questionLongDesc,
      questionShortDesc,
      aptitudeId,
    },
  });

  if (!updatedQuestion) {
    return res
      .status(400)
      .json({ error: "Unable to update question", data: updatedQuestion });
  }
  return res.status(201).json({ message: "Updated successfully" });
});

const getPaginatedQuestions = asyncHandler(async (req, res, next) => {
  const { skip, take, page, perPage } = req.pagination;

  const question = await prisma.question.findMany({
    where: { isDeleted: false },
    skip: skip,
    take: take,
    include: { options: true },
  });
  if (question.length === 0) {
    return res.status(400).json({ error: "Unable to get question" });
  }

  const totalQuestionCount = await prisma.question.count({
    where: { isDeleted: false },
  });

  const totalPages = Math.ceil(totalQuestionCount / perPage);

  return res.status(200).json({
    currentPageNo: page,
    perPage: perPage,
    totalQuestions: totalQuestionCount,
    totalPages: totalPages,
    question: question,
  });
});

export {
  createQuestion,
  getQuestionById,
  getQuestionsByAptitude,
  updateQuestion,
  deleteQuestion,
  getPaginatedQuestions,
};
