/*
  Warnings:

  - You are about to drop the `CodingQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContestProblem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContestProblem" DROP CONSTRAINT "ContestProblem_codingQuestionId_fkey";

-- DropForeignKey
ALTER TABLE "ContestProblem" DROP CONSTRAINT "ContestProblem_contestId_fkey";

-- DropForeignKey
ALTER TABLE "ContestSubmission" DROP CONSTRAINT "ContestSubmission_contestProblemId_fkey";

-- DropTable
DROP TABLE "CodingQuestion";

-- DropTable
DROP TABLE "Contest";

-- DropTable
DROP TABLE "ContestProblem";
