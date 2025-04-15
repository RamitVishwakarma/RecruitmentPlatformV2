import { asyncHandler } from "../utils/asyncHandler.js";
import {
  submitContestProblem,
  getUserSubmissions,
  getProblemSubmissions,
  runSingleTestCase,
} from "../utils/contestService.js";
import { statusCode } from "../utils/statusCodes.js";

/**
 * @desc    Submit a solution for a contest problem
 * @route   POST /api/contest/submit
 * @access  Private
 * @param   {number|string} questionId - Question ID (1-10) based on year
 * @param   {string} code - Source code to evaluate
 * @param   {number} languageId - Judge0 language ID (e.g., 93 for JavaScript, 92 for Python)
 * @param   {number} year - User's year (1=questions 1-5, 2=questions 6-10)
 */
const submitSolution = asyncHandler(async (req, res) => {
  const { questionId, code, languageId, year } = req.body;
  const userId = req.user.userId;

  if (!questionId || !code || !languageId) {
    return res.status(statusCode.BadRequest400).json({
      success: false,
      message:
        "Please provide all required fields: questionId, code, and languageId",
    });
  }
  // Check if user has programmer domain access
  // console.log(req.user);
  // if (req.user.domain !== "programmer") {
  //   return res.status(statusCode.Forbidden403).json({
  //     success: false,
  //     message: "Only users with programmer domain access can submit solutions",
  //   });
  // }

  // Default to year 1 if not provided
  const userYear = year || 1;

  try {
    const result = await submitContestProblem(
      userId,
      questionId,
      code,
      languageId,
      userYear,
    );

    return res.status(statusCode.Created201).json({
      success: true,
      message: result.allTestsPassed
        ? "Submission accepted"
        : result.passedTestCount > 0
          ? `Partially correct (${result.passedTestCount}/${result.totalTests} test cases passed)`
          : "Submission rejected",
      data: result,
    });
  } catch (error) {
    return res.status(statusCode.BadRequest400).json({
      success: false,
      message: error.message || "Failed to submit solution",
    });
  }
});

/**
 * @desc    Run code against first test case only (doesn't save submission)
 * @route   POST /api/contest/run
 * @access  Private
 */
const runCode = asyncHandler(async (req, res) => {
  const { questionId, code, languageId, year } = req.body;

  if (!questionId || !code || !languageId) {
    return res.status(statusCode.BadRequest400).json({
      success: false,
      message:
        "Please provide all required fields: questionId, code, and languageId",
    });
  }
  // console.log(req.user);

  // if (req.user.domain !== "programmer") {
  //   return res.status(statusCode.Forbidden403).json({
  //     success: false,
  //     message: "Only users with programmer domain can run code",
  //   });
  // }

  // Default to year 1 if not provided
  const userYear = year || 1;

  try {
    const result = await runSingleTestCase(
      questionId,
      code,
      languageId,
      userYear,
    );

    return res.status(statusCode.Ok200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(statusCode.BadRequest400).json({
      success: false,
      message: error.message || "Failed to run code",
    });
  }
});

/**
 * @desc    Get all submissions for the current user
 * @route   GET /api/contest/submissions
 * @access  Private
 */
const getAllSubmissions = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const submissions = await getUserSubmissions(userId);

  return res.status(statusCode.Ok200).json({
    success: true,
    count: submissions.length,
    data: submissions,
  });
});

/**
 * @desc    Get submissions for a specific problem
 * @route   GET /api/contest/submissions/:problemId
 * @access  Private
 */
const getProblemSubmissionsList = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { problemId } = req.params;

  if (!problemId) {
    return res.status(statusCode.BadRequest400).json({
      success: false,
      message: "Problem ID is required",
    });
  }

  const submissions = await getProblemSubmissions(userId, problemId);

  return res.status(statusCode.Ok200).json({
    success: true,
    count: submissions.length,
    data: submissions,
  });
});

export {
  submitSolution,
  runCode,
  getAllSubmissions,
  getProblemSubmissionsList,
};
