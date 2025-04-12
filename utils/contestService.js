import axios from "axios";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const prisma = new PrismaClient();

const JUDGE0_API_URL =
  process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_API_HOST =
  process.env.JUDGE0_API_HOST || "judge0-ce.p.rapidapi.com";
const TEST_CASES_DIR = process.env.TEST_CASES_DIR || "./testcases";

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
 * @returns {Promise<Array>} Array of submission tokens
 */
const submitBatchToJudge0 = async (sourceCode, languageId, testCases) => {
  try {
    // Prepare batch submission
    const submissions = testCases.map((testCase) => ({
      source_code: sourceCode,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.expectedOutput,
    }));

    // Make batch submission
    const response = await axios.post(
      `${JUDGE0_API_URL}/submissions/batch`,
      {
        submissions,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": JUDGE0_API_KEY,
          "X-RapidAPI-Host": JUDGE0_API_HOST,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error submitting batch to Judge0:", error);
    throw new Error("Failed to submit code for evaluation");
  }
};

/**
 * Get batch submission results from Judge0
 * @param {Array} tokens - Array of Judge0 submission tokens
 * @returns {Promise<Array>} Array of submission results
 */
const getBatchSubmissionResults = async (tokens) => {
  try {
    const tokensList = tokens.join(",");
    const response = await axios.get(
      `${JUDGE0_API_URL}/submissions/batch?tokens=${tokensList}`,
      {
        headers: {
          "X-RapidAPI-Key": JUDGE0_API_KEY,
          "X-RapidAPI-Host": JUDGE0_API_HOST,
        },
        params: {
          base64_encoded: "false",
          fields: "status,stdout,stderr,time,memory,expected_output",
        },
      },
    );

    return response.data.submissions;
  } catch (error) {
    console.error("Error getting batch submission results:", error);
    throw new Error("Failed to get batch submission results");
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
    const results = await getBatchSubmissionResults(tokens);

    // Check if all submissions are finished
    const allFinished = results.every(
      (result) =>
        // Status ID 1 and 2 mean "In Queue" and "Processing"
        result.status.id !== 1 && result.status.id !== 2,
    );

    if (allFinished) {
      return results;
    }

    // Wait before the next poll
    await new Promise((resolve) => setTimeout(resolve, pollingInterval));
  }

  throw new Error("Batch submission timed out");
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
  year,
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
    );
    const tokens = batchResponse.map((sub) => sub.token);

    // Poll for batch results
    const batchResults = await pollBatchSubmissionResults(tokens);

    // Process results
    const testResults = [];
    let allTestsPassed = true;

    for (let i = 0; i < batchResults.length; i++) {
      const result = batchResults[i];
      const testCase = testCases[i];

      // Check if output matches expected output (status.id 3 means Accepted)
      const testPassed =
        result.status.id === 3 &&
        result.stdout.trim() === testCase.expectedOutput.trim();

      testResults.push({
        testIndex: i,
        passed: testPassed,
        output: result.stdout,
        execution_time: result.time,
        memory_used: result.memory,
        status: result.status,
      });

      if (!testPassed) {
        allTestsPassed = false;
      }
    }

    // Update submission status
    const updatedSubmission = await prisma.contestSubmission.update({
      where: { id: submission.id },
      data: {
        status: allTestsPassed ? "ACCEPTED" : "REJECTED",
      },
    });

    // If submission is accepted, update user's contest score
    if (allTestsPassed) {
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
        await prisma.user.update({
          where: { id: userId },
          data: {
            contestScore: {
              increment: 1,
            },
          },
        });
      }
    }

    return {
      submission: updatedSubmission,
      testResults,
      allTestsPassed,
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
 * @returns {Promise<Object>} Submission result
 */
const submitSingleToJudge0 = async (sourceCode, languageId, testCase) => {
  try {
    // Create a single submission to Judge0
    const response = await axios.post(
      `${JUDGE0_API_URL}/submissions`,
      {
        source_code: sourceCode,
        language_id: languageId,
        stdin: testCase.input,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": JUDGE0_API_KEY,
          "X-RapidAPI-Host": JUDGE0_API_HOST,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error submitting to Judge0:", error);
    throw new Error("Failed to submit code for evaluation");
  }
};

/**
 * Poll for a single submission result from Judge0
 * @param {string} token - Judge0 submission token
 * @returns {Promise<Object>} Final submission result
 */
const pollSingleSubmissionResult = async (token) => {
  const maxAttempts = 20;
  const pollingInterval = 1000; // 1 second

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await axios.get(
        `${JUDGE0_API_URL}/submissions/${token}`,
        {
          headers: {
            "X-RapidAPI-Key": JUDGE0_API_KEY,
            "X-RapidAPI-Host": JUDGE0_API_HOST,
          },
          params: {
            base64_encoded: "false",
            fields: "status,stdout,stderr,time,memory",
          },
        },
      );

      const result = response.data;

      // If submission is finished (not in queue or processing)
      if (result.status.id !== 1 && result.status.id !== 2) {
        return result;
      }

      // Wait before the next poll
      await new Promise((resolve) => setTimeout(resolve, pollingInterval));
    } catch (error) {
      console.error("Error polling submission result:", error);
      throw new Error("Failed to get submission result");
    }
  }

  throw new Error("Submission timed out");
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

    // Just use the first test case (typically input0)
    const firstTestCase = testCases[0];

    // Submit to Judge0
    const submissionData = await submitSingleToJudge0(
      code,
      languageId,
      firstTestCase,
    );

    // Poll for result
    const result = await pollSingleSubmissionResult(submissionData.token);

    // Process and return result
    return {
      output: result.stdout || null,
      error: result.stderr || null,
      executionTime: result.time,
      memory: result.memory,
      status: result.status,
      passed:
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
