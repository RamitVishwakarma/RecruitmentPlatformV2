/*
  Warnings:

  - You are about to drop the column `aptitudeId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `questionLongDesc` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `questionShortDesc` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `aptitudeId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `aptitudeScore` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Aptitude` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Option` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAptitudeDetails` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `questionText` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quizTitle` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_aptitudeId_fkey";

-- DropForeignKey
ALTER TABLE "UserAptitudeDetails" DROP CONSTRAINT "UserAptitudeDetails_userId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "aptitudeId",
DROP COLUMN "questionLongDesc",
DROP COLUMN "questionShortDesc",
ADD COLUMN     "questionText" TEXT NOT NULL,
ADD COLUMN     "quizTitle" TEXT NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "aptitudeId",
DROP COLUMN "aptitudeScore",
ADD COLUMN     "taskLink" TEXT;

-- DropTable
DROP TABLE "Aptitude";

-- DropTable
DROP TABLE "Option";

-- DropTable
DROP TABLE "UserAptitudeDetails";

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Answer_questionId_userId_key" ON "Answer"("questionId", "userId");

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
