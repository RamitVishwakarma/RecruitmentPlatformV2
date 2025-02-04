import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";

const createAptitude = asyncHandler(async (req, res) => {
  const {
    title,
    shortDescription,
    longDescription,
    questions,
    domain,
    year,
    duration,
  } = req.body;
  if (!title || !shortDescription || !domain || !year || !duration) {
    return res
      .status(statusCode.NotFount404)
      .json({ error: "All Fields are required" });
  }

  const aptitude = await prisma.aptitude.create({
    data: {
      aptitudeTitle: title,
      aptitudeShortDesc: shortDescription,
      aptitudeLongDesc: longDescription ?? null,
      aptitudeDomain: domain,
      aptitudeYear: year,
      aptitudeDuration: duration,
      aptitudeQuestions: {
        create: questions,
      },
    },
    include: {
      aptitudeQuestions: true,
    },
  });

  res
    .status(statusCode.Created201)
    .json({ message: "Aptitude created successfully", aptitude });
});

const getAllAptitudes = asyncHandler(async (req, res) => {
  const aptitudes = await prisma.aptitude.findMany({
    where: { isDeleted: false },
  });
  res.status(statusCode.Ok200).json(aptitudes);
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
  const { title, shortDescription, longDescription, domain, year, duration } =
    req.body;

  const updatedAptitude = await prisma.aptitude.update({
    where: { id: id, isDeleted: false },
    data: {
      aptitudeTitle: title,
      aptitudeShortDesc: shortDescription,
      aptitudeLongDesc: longDescription ?? null,
      aptitudeDomain: domain,
      aptitudeYear: year,
      aptitudeDuration: duration,
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
