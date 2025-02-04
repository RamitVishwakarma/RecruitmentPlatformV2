/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Otp_otp_key";

-- CreateIndex
CREATE UNIQUE INDEX "Otp_email_key" ON "Otp"("email");
