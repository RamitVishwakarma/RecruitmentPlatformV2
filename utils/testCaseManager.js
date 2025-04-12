import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const access = promisify(fs.access);

const TEST_CASES_DIR = process.env.TEST_CASES_DIR || "./testcases";

/**
 * Initialize test cases directory if it doesn't exist
 */
const initTestCasesDir = async () => {
  try {
    await access(TEST_CASES_DIR);
  } catch (error) {
    console.error(`Test cases directory not found: ${TEST_CASES_DIR}`);
    throw new Error(`Test cases directory not found: ${TEST_CASES_DIR}`);
  }
};

/**
 * Get all test cases for a question
 * @param {string} questionId - Question ID
 * @returns {Promise<Array>} Array of test case objects
 */
const getTestCases = async (questionId) => {
  const questionDir = path.join(TEST_CASES_DIR, questionId);
  try {
    await access(questionDir);
  } catch (error) {
    console.error(`Question directory ${questionId} not found`);
    return [];
  }

  const files = await readdir(questionDir);

  // Match both "input0" and "input0.txt" formats
  const inputFiles = files.filter(
    (file) =>
      file.startsWith("input") &&
      (file.endsWith(".txt") || !path.extname(file)),
  );

  const testCases = [];

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

      try {
        const input = await readFile(inputPath, "utf8");
        const expectedOutput = await readFile(outputPath, "utf8");

        testCases.push({
          index: parseInt(index, 10),
          input,
          expectedOutput,
        });
      } catch (error) {
        console.error(`Error reading test case ${index}:`, error);
      }
    }
  }

  return testCases.sort((a, b) => a.index - b.index);
};

export { getTestCases, initTestCasesDir };
