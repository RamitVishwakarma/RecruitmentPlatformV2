-- AlterTable
ALTER TABLE "Aptitude" ADD COLUMN     "beginsAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3);
