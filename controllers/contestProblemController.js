import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createContestProblem = asyncHandler(async (req, res) => {
  const { contestId, codingQuestionId, year, testCases } = req.body;

  if (!contestId || !codingQuestionId || !year) {
    return res.status(400).json({
      error: "Contest ID, Coding Question ID, and Year are required.",
    });
  }

  const contestProblem = await prisma.contestProblem.create({
    data: {
      contestId,
      codingQuestionId,
      year: parseInt(year, 10),
      testCases: {
        create: testCases,
      },
    },
    include: {
      codingQuestion: true,
      testCases: true,
    },
  });

  return res.status(201).json(contestProblem);
});

const getAllContestProblems = asyncHandler(async (req, res) => {
  const { contestId } = req.params;

  const problems = await prisma.contestProblem.findMany({
    where: { contestId, isDeleted: false },
    include: {
      codingQuestion: true,
      testCases: {
        where: { isDeleted: false },
      },
    },
  });

  if (problems.length === 0) {
    return res
      .status(404)
      .json({ error: "No problems found for this contest" });
  }

  return res.status(200).json(problems);
});

const getContestProblemsByYear = asyncHandler(async (req, res) => {
  const { contestId, year } = req.query;

  const problems = await prisma.contestProblem.findMany({
    where: {
      contestId,
      year: parseInt(year),
      // year: parseInt(year, 10),
      isDeleted: false,
    },
    include: {
      codingQuestion: true,
      testCases: true,
    },
  });

  if (problems.length === 0) {
    return res
      .status(404)
      .json({ error: "No problems found for the specified year" });
  }

  return res.status(200).json(problems);
});

const updateContestProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { year } = req.body;

  const contestProblem = await prisma.contestProblem.findUnique({
    where: { id, isDeleted: false },
  });

  if (!contestProblem) {
    return res.status(404).json({ error: "Contest problem not found" });
  }

  const updatedData = {};

  if (year) {
    updatedData.year = year;
  }
  if (Object.keys(updatedData).length === 0) {
    return res
      .status(400)
      .json({ error: "No valid fields provided for update" });
  }

  const updatedProblem = await prisma.contestProblem.update({
    where: { id },
    data: updatedData,
  });

  return res.status(200).json(updatedProblem);
});

const deleteContestProblem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  const contestProblem = await prisma.contestProblem.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!contestProblem) {
    return res.status(400).json({ error: "Contest Problem does not exist" });
  }
  const deletedContestProblem = await prisma.contestProblem.update({
    where: { id },
    data: { isDeleted: true },
  });

  return res.status(200).json({
    message: "Contest Problem deleted successfully",
    data: deletedContestProblem,
  });
});

export {
  createContestProblem,
  getAllContestProblems,
  getContestProblemsByYear,
  updateContestProblem,
  deleteContestProblem,
};
