/*
  Warnings:

  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User"
ALTER COLUMN "password" SET DEFAULT '$2a$10$RVfiV7EI3Fc3yq3SKPXrJ.vzNr4WpVZMXd8bCIuK3QluvlFXoupOK';

UPDATE "User"
SET "password" = '$2a$10$RVfiV7EI3Fc3yq3SKPXrJ.vzNr4WpVZMXd8bCIuK3QluvlFXoupOK'
WHERE "password" IS NULL;

ALTER TABLE "User"
ALTER COLUMN "password" DROP DEFAULT;

