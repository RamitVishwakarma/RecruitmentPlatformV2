import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { statusCode } from "../utils/statusCodes.js";

const createTestCase = asyncHandler(async (req, res) => {
  const { problemId, input, expectedOutput } = req.body;

  const testCase = await prisma.testCase.create({
    data: {
      problemId,
      input,
      expectedOutput,
    },
  });

  res.status(statusCode.Created201).json(testCase);
});

const getAllTestCasesForProblem = asyncHandler(async (req, res) => {
  const { contestProblemId } = req.params;

  const testCases = await prisma.testCase.findMany({
    where: { problemId: contestProblemId, isDeleted: false },
  });

  if (testCases.length === 0) {
    return res
      .status(statusCode.NotFount404)
      .json({ error: "No test cases found for this problem" });
  }

  res.status(statusCode.Ok200).json(testCases);
});

const updateTestCase = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { input, expectedOutput } = req.body;

  const updatedData = {};

  if (input) {
    updatedData.input = input;
  }
  if (expectedOutput) {
    updatedData.expectedOutput = expectedOutput;
  }
  if (Object.keys(updatedData).length === 0) {
    return res
      .status(statusCode.NotFount404)
      .json({ error: "No valid fields provided for update" });
  }

  const updatedTestCase = await prisma.testCase.update({
    where: { id, isDeleted: false },
    data: updatedData,
  });

  res.status(statusCode.Ok200).json(updatedTestCase);
});

const deleteTestCase = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(statusCode.NotFount404).json({ error: "id is required" });
  }

  const testcase = await prisma.testCase.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!testcase) {
    return res
      .status(statusCode.NotFount404)
      .json({ error: "Testcase does not exist" });
  }
  const deletedTestCase = await prisma.testCase.update({
    where: { id },
    data: { isDeleted: true },
  });

  res
    .status(statusCode.NoContent204)
    .json({ message: "Testcase deleted successfully", data: deletedTestCase });
});

export {
  createTestCase,
  getAllTestCasesForProblem,
  updateTestCase,
  deleteTestCase,
};
