/*
  Warnings:

  - You are about to drop the `TestCase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_problemId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "contestScore" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "TestCase";

-- CreateTable
CREATE TABLE "ContestSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contestProblemId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ContestSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContestSubmission_userId_idx" ON "ContestSubmission"("userId");

-- CreateIndex
CREATE INDEX "ContestSubmission_contestProblemId_idx" ON "ContestSubmission"("contestProblemId");

-- CreateIndex
CREATE INDEX "ContestSubmission_language_idx" ON "ContestSubmission"("language");

-- CreateIndex
CREATE INDEX "ContestSubmission_status_idx" ON "ContestSubmission"("status");

-- CreateIndex
CREATE INDEX "ContestSubmission_createdAt_idx" ON "ContestSubmission"("createdAt");

-- CreateIndex
CREATE INDEX "Answer_questionId_idx" ON "Answer"("questionId");

-- CreateIndex
CREATE INDEX "Answer_userId_idx" ON "Answer"("userId");

-- CreateIndex
CREATE INDEX "BlackListToken_token_idx" ON "BlackListToken"("token");

-- CreateIndex
CREATE INDEX "CodingQuestion_difficulty_idx" ON "CodingQuestion"("difficulty");

-- CreateIndex
CREATE INDEX "CodingQuestion_title_idx" ON "CodingQuestion"("title");

-- CreateIndex
CREATE INDEX "Contest_startDate_idx" ON "Contest"("startDate");

-- CreateIndex
CREATE INDEX "Contest_endDate_idx" ON "Contest"("endDate");

-- CreateIndex
CREATE INDEX "ContestProblem_codingQuestionId_idx" ON "ContestProblem"("codingQuestionId");

-- CreateIndex
CREATE INDEX "ContestProblem_contestId_idx" ON "ContestProblem"("contestId");

-- CreateIndex
CREATE INDEX "ContestProblem_year_idx" ON "ContestProblem"("year");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Otp_email_idx" ON "Otp"("email");

-- CreateIndex
CREATE INDEX "Question_year_idx" ON "Question"("year");

-- CreateIndex
CREATE INDEX "Question_quizTitle_idx" ON "Question"("quizTitle");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "SocialLink_userId_idx" ON "SocialLink"("userId");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_domain_idx" ON "User"("domain");

-- CreateIndex
CREATE INDEX "User_year_idx" ON "User"("year");

-- CreateIndex
CREATE INDEX "VerificationToken_userId_idx" ON "VerificationToken"("userId");

-- CreateIndex
CREATE INDEX "VerificationToken_token_idx" ON "VerificationToken"("token");

-- AddForeignKey
ALTER TABLE "ContestSubmission" ADD CONSTRAINT "ContestSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestSubmission" ADD CONSTRAINT "ContestSubmission_contestProblemId_fkey" FOREIGN KEY ("contestProblemId") REFERENCES "ContestProblem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
