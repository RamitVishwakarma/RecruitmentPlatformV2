/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `otp` on the `Otp` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "otp",
ADD COLUMN     "otp" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Otp_email_key" ON "Otp"("email");
