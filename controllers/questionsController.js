import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";

//Questions

const createQuestion = asyncHandler(async (req, res) => {
  const { questionText, year, quizTitle } = req.body;

  if (!questionText || !year || !quizTitle) {
    return res
      .status(statusCode.NotFount404)
      .json({ error: "All fields are required" });
  }
  const question = await prisma.question.create({
    data: {
      questionText,
      year,
      quizTitle,
    },
  });

  return res
    .status(statusCode.Created201)
    .json({ message: "Question created successfully" });
});

const getQuestionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(statusCode.NotFount404).json({ error: "ID is required" });
  }

  const question = await prisma.question.findUnique({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  if (!question) {
    return res
      .status(statusCode.NotFount404)
      .json({ error: "Unable to get question" });
  }
  return res
    .status(statusCode.Ok200)
    .json({ message: "Question retrieved successfully", data: question });
});

const deleteQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(statusCode.NotFount404).json({ error: "ID is required" });
  }
  const question = await prisma.question.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!question) {
    return res
      .status(statusCode.NotFount404)
      .json({ error: "Question does not exist" });
  }
  const deletedQuestion = await prisma.question.update({
    where: { id },
    data: {
      isDeleted: true,
    },
  });
  if (!deletedQuestion) {
    return res
      .status(statusCode.BadRequest400)
      .json({ error: "Unable to delete question" });
  }
  return res
    .status(statusCode.NoContent204)
    .json({ message: "Successfully  deleted question" });
});

const getPaginatedQuestions = asyncHandler(async (req, res, next) => {
  const { skip, take, page, perPage } = req.pagination;

  const question = await prisma.question.findMany({
    where: { isDeleted: false },
    skip: skip,
    take: take,
  });
  if (question.length === 0) {
    return res
      .status(statusCode.NotFount404)
      .json({ error: "Unable to get question" });
  }

  const totalQuestionCount = await prisma.question.count({
    where: { isDeleted: false },
  });

  const totalPages = Math.ceil(totalQuestionCount / perPage);

  return res.status(statusCode.Ok200).json({
    currentPageNo: page,
    perPage: perPage,
    totalQuestions: totalQuestionCount,
    totalPages: totalPages,
    question: question,
  });
});

const getRandomQuestions = asyncHandler(async (req, res) => {
  const allQuestions = await prisma.question.findMany({
    where: {
      isDeleted: false,
    },
  });

  function fisherYatesShuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  const shuffled = fisherYatesShuffle(allQuestions);
  const selected = shuffled.slice(0, 10);

  return res.status(statusCode.Ok200).json({ questions: selected });
});

export {
  createQuestion,
  getQuestionById,
  deleteQuestion,
  getPaginatedQuestions,
  getRandomQuestions,
};

// const createQuestion = asyncHandler(async (req, res) => {
//   const { questionShortDesc, questionLongDesc, aptitudeId, options } = req.body;

//   if (!questionShortDesc || !questionLongDesc || !aptitudeId) {
//     return res
//       .status(statusCode.NotFount404)
//       .json({ error: "All fields are required" });
//   }

//   const newQuestion = await prisma.question.create({
//     data: {
//       questionShortDesc: questionShortDesc,
//       questionLongDesc,
//       aptitudeId: aptitudeId,
//       options: {
//         create: options,
//       },
//     },
//     include: {
//       options: true,
//       aptitude: true,
//     },
//   });
//   return res
//     .status(statusCode.Created201)
//     .json({ data: newQuestion, message: "Question created successfully" });
// });

// const getQuestionById = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   if (!id) {
//     return res.status(statusCode.NotFount404).json({ error: "ID is required" });
//   }

//   const question = await prisma.question.findUnique({
//     where: {
//       id: id,
//       isDeleted: false,
//     },
//     include: {
//       options: true,
//     },
//   });

//   if (!question) {
//     return res
//       .status(statusCode.NotFount404)
//       .json({ error: "Unable to get question" });
//   }
//   return res
//     .status(statusCode.Ok200)
//     .json({ message: "Question retrieved successfully", data: question });
// });

// const getQuestionsByAptitude = asyncHandler(async (req, res) => {
//   const { aptitudeId } = req.params;
//   if (!aptitudeId) {
//     return res
//       .status(statusCode.NotFount404)
//       .json({ error: "Aptitude id is required" });
//   }

//   const questions = await prisma.question.findMany({
//     where: {
//       aptitudeId,
//       isDeleted: false,
//     },
//     include: {
//       options: true,
//     },
//   });
//   if (questions.length === 0) {
//     return res
//       .status(statusCode.NotFount404)
//       .json({ message: "Unable to get question", error: error.message });
//   }
//   return res
//     .status(statusCode.Ok200)
//     .json({ message: "Questions retrieved successfully", data: questions });
// });

// const deleteQuestion = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   if (!id) {
//     return res.status(statusCode.NotFount404).json({ error: "ID is required" });
//   }
//   const question = await prisma.question.findUnique({
//     where: {
//       id,
//       isDeleted: false,
//     },
//   });

//   if (!question) {
//     return res
//       .status(statusCode.NotFount404)
//       .json({ error: "Question does not exist" });
//   }
//   const deletedQuestion = await prisma.question.update({
//     where: { id },
//     data: {
//       isDeleted: true,
//     },
//   });
//   if (!deletedQuestion) {
//     return res
//       .status(statusCode.BadRequest400)
//       .json({ error: "Unable to delete question" });
//   }
//   return res
//     .status(statusCode.NoContent204)
//     .json({ message: "Successfully  deleted question" });
// });

// const updateQuestion = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { questionShortDesc, options } = req.body;

//   if (!questionShortDesc || !options || !options.length) {
//     return res.status(statusCode.BadRequest400).json({
//       success: false,
//       message:
//         "Question short description and at least one option are required",
//     });
//   }

//   const question = await prisma.question.findUnique({
//     where: { id },
//     include: { options: true },
//   });

//   if (!question) {
//     return res.status(statusCode.NotFount404).json({
//       success: false,
//       message: "Question not found",
//     });
//   }

//   const updatedQuestion = await prisma.$transaction(async (tx) => {
//     await tx.option.deleteMany({ where: { questionId: id } });

//     return await tx.question.update({
//       where: { id },
//       data: {
//         questionShortDesc,
//         options: {
//           create: options.map((option) => ({
//             optionText: option.optionText,
//             isCorrect: option.isCorrect,
//           })),
//         },
//       },
//       include: { options: true },
//     });
//   });

//   return res.status(statusCode.Ok200).json({
//     success: true,
//     message: "Question updated successfully",
//     data: updatedQuestion,
//   });
// });
