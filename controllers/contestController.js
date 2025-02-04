import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";

const createContest = asyncHandler(async (req, res) => {
  const { title, description, startDate, endDate, problems } = req.body;

  const contest = await prisma.contest.create({
    data: {
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      problems: {
        create: problems,
      },
    },
    include: {
      problems: true,
    },
  });

  res.status(statusCode.Created201).json(contest);
});

const getAllContests = asyncHandler(async (req, res) => {
  const contests = await prisma.contest.findMany({
    where: { isDeleted: false },
    include: {
      problems: {
        where: { isDeleted: false },
        include: {
          codingQuestion: true,
          testCases: true,
        },
      },
    },
  });

  if (contests.length === 0) {
    return res
      .status(statusCode.NotFount404)
      .json({ error: "No contests found" });
  }

  res.status(statusCode.Ok200).json(contests);
});

const getContestById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contest = await prisma.contest.findUnique({
    where: { id },
    include: {
      problems: {
        where: { isDeleted: false },
        include: {
          codingQuestion: true,
          testCases: true,
        },
      },
    },
  });

  if (!contest) {
    return res
      .status(statusCode.NotFount404)
      .json({ error: "Contest not found" });
  }

  res.status(statusCode.Ok200).json(contest);
});

const updateContest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate } = req.body;

  const updateData = {};

  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (startDate) updateData.startDate = new Date(startDate);
  if (endDate) updateData.endDate = new Date(endDate);

  const updatedContest = await prisma.contest.update({
    where: { id },
    data: updateData,
  });

  res.status(statusCode.Ok200).json(updatedContest);
});

const deleteContest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(statusCode.NotFount404).json({ error: "id is required" });
  }

  const contest = await prisma.contest.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!contest) {
    return res
      .status(statusCode.NotFount404)
      .json({ error: "Contest does not exist" });
  }
  const deletedContest = await prisma.contest.update({
    where: { id },
    data: { isDeleted: true },
  });

  return res
    .status(statusCode.NoContent204)
    .json({ message: "Contest deleted successfully", data: deletedContest });
});

export {
  createContest,
  getAllContests,
  getContestById,
  updateContest,
  deleteContest,
};
