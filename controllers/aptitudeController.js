import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";

const createAptitude = asyncHandler(async (req, res) => {
  const {
    aptitudeTitle,
    aptitudeDomain,
    aptitudeYear,
    aptitudeDuration,
    beginsAt,
    expiresAt,
    questions,
  } = req.body;

  if (
    !aptitudeTitle ||
    !aptitudeDomain ||
    !aptitudeYear ||
    !aptitudeDuration ||
    !questions?.length
  ) {
    return res.status(statusCode.BadRequest400).json({
      success: false,
      message:
        "All required fields (title, domain, year, duration, questions) must be provided",
    });
  }

  const aptitude = await prisma.$transaction(async (tx) => {
    const createdAptitude = await tx.aptitude.create({
      data: {
        aptitudeTitle,
        aptitudeDomain,
        aptitudeYear,
        aptitudeDuration,
        beginsAt:
          beginsAt && !isNaN(Date.parse(beginsAt)) ? new Date(beginsAt) : null,
        expiresAt:
          expiresAt && !isNaN(Date.parse(expiresAt))
            ? new Date(expiresAt)
            : null,
        aptitudeQuestions: {
          create: questions.map((question) => ({
            questionShortDesc: question.questionShortDesc,
            options: {
              create: question.options.map((option) => ({
                optionText: option.optionText,
                isCorrect: option.isCorrect,
              })),
            },
          })),
        },
      },
      include: {
        aptitudeQuestions: {
          include: {
            options: true,
          },
        },
      },
    });

    return createdAptitude;
  });

  return res.status(statusCode.Created201).json({
    success: true,
    message: "Aptitude created successfully",
    data: aptitude,
  });
});

const getAllAptitudes = asyncHandler(async (req, res) => {
  const { aptitudeDomain, aptitudeYear } = req.query;

  const filters = {};
  if (aptitudeDomain) filters.aptitudeDomain = aptitudeDomain;
  if (aptitudeYear) filters.aptitudeYear = parseInt(aptitudeYear);
  filters.isDeleted = false;

  const aptitudes = await prisma.aptitude.findMany({
    where: filters,
    // include: {
    //   aptitudeQuestions: {
    //     include: {
    //       options: true,
    //     },
    //   },
    // },
  });

  if (!aptitudes.length) {
    return res.status(statusCode.NotFount404).json({
      success: false,
      message: "No aptitudes found",
    });
  }

  return res.status(statusCode.Ok200).json({
    success: true,
    data: aptitudes,
  });
});

const getAptitudesById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const aptitude = await prisma.aptitude.findUnique({
    where: { id: id, isDeleted: false },
    include: { aptitudeQuestions: true },
  });

  if (!aptitude) {
    return res
      .status(statusCode.NotFount404)
      .json({ error: "Aptitude not found" });
  }

  res.status(statusCode.Ok200).json(aptitude);
});

const updateAptitude = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    shortDescription,
    longDescription,
    domain,
    year,
    duration,
    beginsAt,
    expiresAt,
  } = req.body;

  const updatedAptitude = await prisma.aptitude.update({
    where: { id: id, isDeleted: false },
    data: {
      aptitudeTitle: title,
      aptitudeShortDesc: shortDescription,
      aptitudeLongDesc: longDescription ?? null,
      aptitudeDomain: domain,
      aptitudeYear: year,
      aptitudeDuration: duration,
      beginsAt: beginsAt === null ? null : new Date(beginsAt),
      expiresAt: expiresAt === null ? null : new Date(expiresAt),
    },
  });
  res
    .status(statusCode.Ok200)
    .json({ message: "Aptitude updated successfully", updatedAptitude });
});

const deleteAptitude = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.aptitude.update({
    where: { id: id, isDeleted: false },
    data: { isDeleted: true },
  });
  res
    .status(statusCode.NoContent204)
    .json({ message: "Aptitude deleted successfully" });
});
export {
  createAptitude,
  getAptitudesById,
  getAllAptitudes,
  updateAptitude,
  deleteAptitude,
};
