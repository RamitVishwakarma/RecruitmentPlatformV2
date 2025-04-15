-- DropIndex
DROP INDEX "ContestSubmission_createdAt_idx";

-- DropIndex
DROP INDEX "ContestSubmission_language_idx";

-- DropIndex
DROP INDEX "ContestSubmission_status_idx";

-- AlterTable
ALTER TABLE "ContestSubmission" ADD COLUMN     "timeElapsed" INTEGER NOT NULL DEFAULT 0;
