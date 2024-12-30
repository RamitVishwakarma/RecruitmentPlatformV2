-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_aptitudeId_fkey";

-- CreateTable
CREATE TABLE "BlackListToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlackListToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlackListToken_token_key" ON "BlackListToken"("token");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_aptitudeId_fkey" FOREIGN KEY ("aptitudeId") REFERENCES "Aptitude"("id") ON DELETE CASCADE ON UPDATE CASCADE;
