import axios from "axios";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const prisma = new PrismaClient();

// Judge0 API configuration
const JUDGE0_API_URL = process.env.JUDGE0_API_URL;
// const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || ""; // Not needed for local deployment
// const JUDGE0_API_HOST = process.env.JUDGE0_API_HOST || "localhost:2358";
const TEST_CASES_DIR = process.env.TEST_CASES_DIR || "./testcases";

// Contest configuration
const CONTEST_START_DATE = new Date("2025-04-16T14:00:00Z"); // April 16, 2025, 2:00 PM

const CONTEST_DURATION_MINUTES = 90; // 1.5 hours
const CONTEST_END_DATE = new Date(
  CONTEST_START_DATE.getTime() + CONTEST_DURATION_MINUTES * 60 * 1000,
);

// Default time limit in seconds if not specified
const DEFAULT_TIME_LIMIT = 2;

// Question scoring configuration
const QUESTION_SCORES = {
  // Default score for all questions
  defaultScore: 100,
  // Default time limit for all questions (in seconds)
  defaultTimeLimit: 2,
  // Custom scores and time limits for specific questions
  questionScores: {
    1: { score: 100, timeLimit: 1 },
    2: { score: 100, timeLimit: 1 },
    3: { score: 150, timeLimit: 2 },
    4: { score: 200, timeLimit: 2 },
    5: { score: 200, timeLimit: 1 },
    6: { score: 100, timeLimit: 2 },
    7: { score: 100, timeLimit: 2 },
    8: { score: 150, timeLimit: 1 },
    9: { score: 150, timeLimit: 1 },
    10: { score: 200, timeLimit: 3 },
  },
};

/**
 * Get test cases for a question from local files
 * @param {string} questionId - Question ID (1-10)
 * @returns {Promise<Array>} Array of test cases with input and expected output
 */
const getTestCasesFromFiles = async (questionId) => {
  try {
    // Create the directory path for this question's test cases
    const questionDir = path.join(TEST_CASES_DIR, questionId.toString());

    // Check if directory exists
    if (!fs.existsSync(questionDir)) {
      throw new Error(
        `Test cases directory for question ${questionId} not found`,
      );
    }

    // Read all files in the directory
    const files = await readdir(questionDir);

    // Filter input files - handle both "input0" and "input0.txt" formats
    const inputFiles = files.filter(
      (file) =>
        file.startsWith("input") &&
        (file.endsWith(".txt") || !path.extname(file)),
    );

    const testCases = [];

    // Process each input file and find corresponding output file
    for (const inputFile of inputFiles) {
      // Extract index from either "input0" or "input0.txt"
      const match = inputFile.match(/input(\d+)(?:\.txt)?$/);
      if (!match) continue;

      const index = match[1];

      // Check for both output0 and output0.txt
      const possibleOutputFiles = [`output${index}`, `output${index}.txt`];

      const matchingOutputFile = possibleOutputFiles.find((file) =>
        files.includes(file),
      );

      if (matchingOutputFile) {
        const inputPath = path.join(questionDir, inputFile);
        const outputPath = path.join(questionDir, matchingOutputFile);

        // Read input and output files
        const input = await readFile(inputPath, "utf8");
        const expectedOutput = await readFile(outputPath, "utf8");

        testCases.push({
          input,
          expectedOutput,
        });
      }
    }

    if (testCases.length === 0) {
      throw new Error(`No valid test cases found for question ${questionId}`);
    }

    return testCases;
  } catch (error) {
    console.error(
      `Error reading test cases for question ${questionId}:`,
      error,
    );
    throw new Error(`Failed to read test cases: ${error.message}`);
  }
};

/**
 * Submit batch of codes to Judge0 for evaluation
 * @param {string} sourceCode - The source code to evaluate
 * @param {number} languageId - Judge0 language ID
 * @param {Array} testCases - Array of test cases
 * @param {number} timeLimit - Time limit in seconds
 * @returns {Promise<Array>} Array of submission tokens
 */
const submitBatchToJudge0 = async (
  sourceCode,
  languageId,
  testCases,
  timeLimit = DEFAULT_TIME_LIMIT,
) => {
  try {
    // Prepare batch submission
    const submissions = testCases.map((testCase) => ({
      source_code: sourceCode,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.expectedOutput,
      cpu_time_limit: timeLimit, // Set time limit in seconds
    }));

    console.log(
      `Submitting batch to Judge0 with ${submissions.length} test cases`,
    );

    // Make batch submission
    const response = await axios.post(
      `${JUDGE0_API_URL}/submissions/batch`,
      {
        submissions,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 10000, // 10 seconds timeout
      },
    );

    // Check if response data is null or undefined
    if (!response.data) {
      throw new Error("Empty response from Judge0");
    }

    // Handle both response formats:
    // 1. { submissions: [{ token: '...' }, ...] }
    // 2. [{ token: '...' }, ...]
    let submissionTokens;

    if (Array.isArray(response.data)) {
      // Format 2: Direct array of tokens
      submissionTokens = response.data;
      console.log("Received direct array of tokens from Judge0");
    } else if (
      response.data.submissions &&
      Array.isArray(response.data.submissions)
    ) {
      // Format 1: Object with submissions array
      submissionTokens = response.data.submissions;
      console.log("Received submissions array from Judge0");
    } else {
      console.error("Invalid response from Judge0:", response.data);
      throw new Error("Invalid response from Judge0: Unexpected format");
    }

    // Check if all submissions have tokens
    const validSubmissions = submissionTokens.filter((sub) => sub && sub.token);
    if (validSubmissions.length !== submissions.length) {
      console.error("Some submissions are missing tokens:", submissionTokens);
      throw new Error(
        "Invalid response from Judge0: Some submissions are missing tokens",
      );
    }

    return submissionTokens;
  } catch (error) {
    console.error("Error submitting batch to Judge0:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(`Failed to submit code for evaluation: ${error.message}`);
  }
};

/**
 * Get batch submission results from Judge0
 * @param {Array} tokens - Array of Judge0 submission tokens
 * @returns {Promise<Array>} Array of submission results
 */
const getBatchSubmissionResults = async (tokens) => {
  try {
    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      throw new Error(
        "Invalid tokens array provided to getBatchSubmissionResults",
      );
    }

    const tokensList = tokens.join(",");
    const response = await axios.get(
      `${JUDGE0_API_URL}/submissions/batch?tokens=${tokensList}`,
      {
        params: {
          base64_encoded: "false",
          fields: "status,stdout,stderr,time,memory,expected_output",
        },
        headers: {
          Accept: "application/json",
        },
        timeout: 5000, // 5 seconds timeout
      },
    );

    // Check if response data is null or undefined
    if (!response.data) {
      throw new Error("Empty response from Judge0");
    }

    // Handle both response formats:
    // 1. { submissions: [{ status: {...}, ... }, ...] }
    // 2. [{ status: {...}, ... }, ...]
    let submissionResults;

    if (Array.isArray(response.data)) {
      // Format 2: Direct array of results
      submissionResults = response.data;
      console.log("Received direct array of results from Judge0");
    } else if (
      response.data.submissions &&
      Array.isArray(response.data.submissions)
    ) {
      // Format 1: Object with submissions array
      submissionResults = response.data.submissions;
      console.log("Received submissions array from Judge0");
    } else {
      console.error("Invalid response from Judge0:", response.data);
      throw new Error("Invalid response from Judge0: Unexpected format");
    }

    return submissionResults;
  } catch (error) {
    console.error("Error getting batch submission results:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(`Failed to get batch submission results: ${error.message}`);
  }
};

/**
 * Poll for batch submission results until they're all ready
 * @param {Array} tokens - Array of Judge0 submission tokens
 * @returns {Promise<Array>} Array of final submission results
 */
const pollBatchSubmissionResults = async (tokens) => {
  const maxAttempts = 20;
  const pollingInterval = 2000; // 2 seconds

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      console.log(
        `Polling batch results attempt ${attempt + 1} for ${tokens.length} tokens`,
      );

      const results = await getBatchSubmissionResults(tokens);

      // Check if results array is empty
      if (!results || results.length === 0) {
        console.error("Empty results array received from Judge0");
        if (attempt === maxAttempts - 1) {
          throw new Error("Empty results array received from Judge0");
        }
        await new Promise((resolve) => setTimeout(resolve, pollingInterval));
        continue;
      }

      // Check if all submissions are finished
      const allFinished = results.every(
        (result) =>
          result &&
          result.status &&
          // Status ID 1 and 2 mean "In Queue" and "Processing"
          result.status.id !== 1 &&
          result.status.id !== 2,
      );

      if (allFinished) {
        return results;
      }

      // Wait before the next poll
      await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    } catch (error) {
      console.error(`Error polling batch results (attempt ${attempt + 1}):`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // If we've reached max attempts, throw error
      if (attempt === maxAttempts - 1) {
        throw new Error(
          `Failed to get batch submission results after ${maxAttempts} attempts: ${error.message}`,
        );
      }

      // Otherwise continue to next attempt
      await new Promise((resolve) => setTimeout(resolve, pollingInterval));
      continue;
    }
  }

  throw new Error("Batch submission polling timed out");
};

/**
 * Validate that the question ID is appropriate for the user's year
 * Year 1: Questions 1-5
 * Year 2: Questions 6-10
 * @param {number} questionId - Question ID (1-10)
 * @param {number} year - User's year (1 or 2)
 * @returns {boolean} Whether the question is valid for this year
 */
const validateQuestionForYear = (questionId, year) => {
  const qId = parseInt(questionId, 10);

  if (year === 1 && qId >= 1 && qId <= 5) {
    return true;
  }

  if (year === 2 && qId >= 6 && qId <= 10) {
    return true;
  }

  return false;
};

/**
 * ?Submit code for evaluation for a coding question
 * @param {string} userId - User ID
 * @param {number|string} questionId - Question ID (1-10)
 * @param {string} code - Source code
 * @param {number} languageId - Judge0 language ID
 * @param {number} year - User's year (1 or 2)
 * @returns {Promise<Object>} Submission result with status
 */
const submitContestProblem = async (
  userId,
  questionId,
  code,
  languageId,
  year = 1,
) => {
  let submission;
  // Convert questionId to number if it's a string
  const qId = parseInt(questionId, 10);

  try {
    // Validate if the question is appropriate for the user's year
    if (!validateQuestionForYear(qId, year)) {
      throw new Error(
        `Question ${qId} is not available for year ${year} students`,
      );
    }

    // Check if test cases exist for this question ID
    const testCases = await getTestCasesFromFiles(qId);

    // Get the question's maximum score and time limit from configuration
    const questionConfig = QUESTION_SCORES.questionScores[qId] || {};
    const maxScore = questionConfig.score || QUESTION_SCORES.defaultScore;
    const timeLimit =
      questionConfig.timeLimit || QUESTION_SCORES.defaultTimeLimit;

    // Create submission record directly with the numeric question ID
    submission = await prisma.contestSubmission.create({
      data: {
        userId,
        contestProblemId: qId.toString(), // Store the question ID directly
        code,
        language: languageId.toString(),
        status: "PENDING",
      },
    });

    // Make batch submission to Judge0
    const batchResponse = await submitBatchToJudge0(
      code,
      languageId,
      testCases,
      timeLimit,
    );

    // Check if batchResponse is valid
    if (
      !batchResponse ||
      !Array.isArray(batchResponse) ||
      batchResponse.length === 0
    ) {
      throw new Error("Invalid batch response from Judge0");
    }

    const tokens = batchResponse.map((sub) => {
      if (!sub || !sub.token) {
        throw new Error("Invalid submission token in batch response");
      }
      return sub.token;
    });

    // Poll for batch results
    const batchResults = await pollBatchSubmissionResults(tokens);

    // Check if batchResults is valid
    if (
      !batchResults ||
      !Array.isArray(batchResults) ||
      batchResults.length === 0
    ) {
      throw new Error("Invalid batch results from Judge0");
    }

    // Process results
    const testResults = [];
    let allTestsPassed = true;
    let passedTestCount = 0;

    for (let i = 0; i < batchResults.length; i++) {
      const result = batchResults[i];
      const testCase = testCases[i];

      // Skip invalid results
      if (!result || !result.status) {
        console.error(`Invalid result at index ${i}:`, result);
        testResults.push({
          testIndex: i,
          passed: false,
          output: null,
          execution_time: null,
          memory_used: null,
          status: { id: 13, description: "Internal Error" },
        });
        allTestsPassed = false;
        continue;
      }

      const passed = result.status.id === 3; // 3 = Accepted
      if (!passed) {
        allTestsPassed = false;
      } else {
        passedTestCount++;
      }

      testResults.push({
        testIndex: i,
        passed: passed,
        output: result.stdout || null,
        execution_time: result.time || null,
        memory_used: result.memory || null,
        status: result.status,
      });
    }

    // Calculate score based on passed test cases
    const totalTests = testCases.length;
    const score = Math.floor((passedTestCount / totalTests) * maxScore);

    // Calculate time elapsed since contest start (in minutes)
    const now = new Date();
    const timeElapsed =
      now >= CONTEST_START_DATE
        ? Math.floor((now - CONTEST_START_DATE) / (1000 * 60))
        : 0;

    // Update submission status
    const updatedSubmission = await prisma.contestSubmission.update({
      where: { id: submission.id },
      data: {
        status: allTestsPassed
          ? "ACCEPTED"
          : passedTestCount > 0
            ? "PARTIAL"
            : "REJECTED",
        score: score,
        timeElapsed: timeElapsed,
      },
    });

    // If submission is accepted or partial, update user's contest score
    if (allTestsPassed || passedTestCount > 0) {
      // Check if user already has a correct submission for this problem
      const existingCorrectSubmission =
        await prisma.contestSubmission.findFirst({
          where: {
            userId,
            contestProblemId: qId.toString(),
            status: "ACCEPTED",
            id: { not: submission.id },
          },
        });

      // Only update score if this is the first correct submission for this problem
      if (!existingCorrectSubmission) {
        // Update user's contest score
        await prisma.user.update({
          where: { id: userId },
          data: {
            contestScore: {
              increment: score,
            },
          },
        });
      }
    }

    return {
      submission: updatedSubmission,
      testResults,
      allTestsPassed,
      score: score,
      maxScore: maxScore,
      passedTestCount,
      totalTests,
      timeElapsed,
      contestEndTime: CONTEST_END_DATE,
    };
  } catch (error) {
    console.error("Error in contest submission:", error);

    // Update submission status to ERROR if it was created
    if (submission?.id) {
      await prisma.contestSubmission.update({
        where: { id: submission.id },
        data: { status: "ERROR" },
      });
    }

    throw error;
  }
};

/**
 * Get all submissions for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of submissions
 */
const getUserSubmissions = async (userId) => {
  return await prisma.contestSubmission.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Get submissions for a specific problem
 * @param {string} userId - User ID
 * @param {string} contestProblemId - Contest problem ID
 * @returns {Promise<Array>} List of submissions
 */
const getProblemSubmissions = async (userId, contestProblemId) => {
  return await prisma.contestSubmission.findMany({
    where: {
      userId,
      contestProblemId,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Submit a single test case to Judge0 (for "Run" functionality)
 * @param {string} sourceCode - The source code to evaluate
 * @param {number} languageId - Judge0 language ID
 * @param {object} testCase - Single test case with input and expected output
 * @param {number} timeLimit - Time limit in seconds
 * @returns {Promise<Object>} Submission result
 */
const submitSingleToJudge0 = async (
  sourceCode,
  languageId,
  testCase,
  timeLimit = DEFAULT_TIME_LIMIT,
) => {
  try {
    // Ensure source code ends with a newline
    const formattedSourceCode = sourceCode.trim() + "\n";

    // Log the request payload for debugging
    const payload = {
      source_code: formattedSourceCode,
      language_id: languageId,
      stdin: testCase.input,
      cpu_time_limit: timeLimit,
      expected_output: testCase.expectedOutput,
      // Add additional parameters that might help
      wait: false, // Don't wait for the submission to finish
      base64_encoded: false, // Ensure input/output isn't base64 encoded
      // Add file extension based on language
    };

    console.log("Submitting to Judge0 with payload:", {
      ...payload,
      source_code: "[source code omitted]", // Don't log the full source code
    });

    // Create a single submission to Judge0
    const response = await axios.post(
      `${JUDGE0_API_URL}/submissions`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // Add timeout to prevent hanging
        timeout: 10000, // 10 seconds timeout
      },
    );

    // Log the response for debugging
    console.log("Judge0 response:", response.data);

    // Check if response data is null or undefined
    if (!response.data) {
      throw new Error("Empty response from Judge0");
    }

    // Check if token is missing
    if (!response.data.token) {
      console.error("Invalid response from Judge0:", response.data);
      throw new Error("Invalid response from Judge0: No token received");
    }

    return response.data;
  } catch (error) {
    console.error("Error submitting to Judge0:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Throw a more detailed error
    throw new Error(`Failed to submit code for evaluation: ${error.message}`);
  }
};

/**
 * Poll for a single submission result from Judge0
 * @param {string} token - Judge0 submission token
 * @returns {Promise<Object>} Final submission result
 */
const pollSingleSubmissionResult = async (token) => {
  const maxAttempts = 50;
  const pollingInterval = 1000; // 1 second

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      console.log(`Polling attempt ${attempt + 1} for token ${token}`);

      const response = await axios.get(
        `${JUDGE0_API_URL}/submissions/${token}`,
        {
          headers: {
            Accept: "application/json",
          },
          params: {
            base64_encoded: false,
            fields: "*", // Request all fields for debugging
          },
          timeout: 5000, // 5 seconds timeout
        },
      );

      // Check if response data is null or undefined
      if (!response.data) {
        console.error(`Empty response from Judge0 for token ${token}`);
        if (attempt === maxAttempts - 1) {
          throw new Error("Empty response from Judge0");
        }
        await new Promise((resolve) => setTimeout(resolve, pollingInterval));
        continue;
      }

      const result = response.data;
      console.log(`Poll result for attempt ${attempt + 1}:`, result);

      // If submission is finished (not in queue or processing)
      if (
        result &&
        result.status &&
        result.status.id !== 1 &&
        result.status.id !== 2
      ) {
        // Add additional validation
        if (result.status.id === 13) {
          console.error("Judge0 internal error detected:", result);
          throw new Error("Judge0 internal error occurred");
        }
        return result;
      }

      // Wait before the next poll
      await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    } catch (error) {
      console.error(
        `Error polling submission result (attempt ${attempt + 1}):`,
        {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        },
      );

      // If we've reached max attempts, throw error
      if (attempt === maxAttempts - 1) {
        throw new Error(
          `Failed to get submission result after ${maxAttempts} attempts`,
        );
      }

      // Otherwise continue to next attempt
      continue;
    }
  }

  throw new Error("Submission polling timed out");
};

/**
 * Run code against just the first test case (input0)
 * @param {string} questionId - Question ID (1-10)
 * @param {string} code - Source code
 * @param {number} languageId - Judge0 language ID
 * @param {number} year - User's year (1 or 2)
 * @returns {Promise<Object>} Result of running the code
 */
const runSingleTestCase = async (questionId, code, languageId, year) => {
  // Convert questionId to number if it's a string
  const qId = parseInt(questionId, 10);

  try {
    // Validate if the question is appropriate for the user's year
    if (!validateQuestionForYear(qId, year)) {
      throw new Error(
        `Question ${qId} is not available for year ${year} students`,
      );
    }

    // Get test cases from local files
    const testCases = await getTestCasesFromFiles(qId);

    if (testCases.length === 0) {
      throw new Error(`No test cases found for question ${qId}`);
    }

    // Get the question's time limit from configuration
    const questionConfig = QUESTION_SCORES.questionScores[qId] || {};
    const timeLimit =
      questionConfig.timeLimit || QUESTION_SCORES.defaultTimeLimit;

    // Just use the first test case (typically input0)
    const firstTestCase = testCases[0];

    console.log(firstTestCase);

    // Submit to Judge0
    const submissionData = await submitSingleToJudge0(
      code,
      languageId,
      firstTestCase,
      timeLimit,
    );

    console.log(submissionData);

    // Poll for result
    const result = await pollSingleSubmissionResult(submissionData.token);

    // Add null checks for result and result.status
    if (!result) {
      throw new Error("No result received from Judge0");
    }

    // Process and return result
    return {
      output: result.stdout || null,
      error: result.stderr || null,
      executionTime: result.time || null,
      memory: result.memory || null,
      status: result.status || { id: 13, description: "Internal Error" },
      passed:
        result.status &&
        result.status.id === 3 &&
        result.stdout?.trim() === firstTestCase.expectedOutput?.trim(),
      expected: firstTestCase.expectedOutput,
    };
  } catch (error) {
    console.error("Error running test case:", error);
    throw error;
  }
};

export {
  submitContestProblem,
  getUserSubmissions,
  getProblemSubmissions,
  runSingleTestCase,
};
