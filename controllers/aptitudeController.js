import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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
    res.status(500).json({ error: "All Fields are required" });
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

  res.status(201).json({ message: "Aptitude created successfully", aptitude });
});

const getAllAptitudes = asyncHandler(async (req, res) => {
  const aptitudes = await prisma.aptitude.findMany({
    where: { isDeleted: false },
  });
  res.status(201).json(aptitudes);
});

const getAptitudesById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const aptitude = await prisma.aptitude.findUnique({
    where: { id: id, isDeleted: false },
    include: { aptitudeQuestions: true },
  });

  if (!aptitude) {
    return res.status(404).json({ error: "Aptitude not found" });
  }

  res.status(201).json(aptitude);
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
    .status(201)
    .json({ message: "Aptitude updated successfully", updatedAptitude });
});

const deleteAptitude = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.aptitude.update({
    where: { id: id, isDeleted: false },
    data: { isDeleted: true },
  });
  res.status(201).json({ message: "Aptitude deleted successfully" });
});
export {
  createAptitude,
  getAptitudesById,
  getAllAptitudes,
  updateAptitude,
  deleteAptitude,
};
