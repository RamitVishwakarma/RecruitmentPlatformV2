import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";

const createAnswer = asyncHandler(async (req, res) => {
  const { answers, userId } = req.body;

  if (!answers || !Array.isArray(answers) || answers.length === 0 || !userId) {
    return res
      .status(statusCode.BadRequest400)
      .json({ error: "answers (array) and userId are required" });
  }

  for (const { questionId, answer } of answers) {
    if (!questionId || !answer) continue;

    await prisma.answer.upsert({
      where: {
        questionId_userId: {
          questionId,
          userId,
        },
      },
      update: {
        answer,
        isDeleted: false,
      },
      create: {
        answer,
        questionId,
        userId,
      },
    });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { aptitudeStatus: true },
  });

  return res
    .status(statusCode.Created201)
    .json({ message: "All answers submitted successfully" });
});

export { createAnswer };

// const createAnswer = asyncHandler(async (req, res) => {
//   const { questionId } = req.params;
//   const { answer, userId } = req.body;

//   if (!answer || !questionId || !userId) {
//     return res
//       .status(statusCode.NotFount404)
//       .json({ error: "answer, questionId, and userId are required" });
//   }

//   const savedAnswer = await prisma.answer.upsert({
//     where: {
//       questionId_userId: {
//         questionId,
//         userId,
//       },
//     },
//     update: {
//       answer,
//       isDeleted: false,
//     },
//     create: {
//       answer,
//       questionId,
//       userId,
//     },
//   });

//   return res
//     .status(statusCode.Created201)
//     .json({ message: "Answer submitted successfully" });
// });
