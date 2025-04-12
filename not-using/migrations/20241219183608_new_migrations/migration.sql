-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAptitudeDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "aptitudeScore" INTEGER NOT NULL,

    CONSTRAINT "UserAptitudeDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "admissionNumber" TEXT NOT NULL,
    "photo" TEXT,
    "year" INTEGER,
    "resume" TEXT,
    "aptitudeScore" INTEGER,
    "aptitudeId" TEXT,
    "domain" TEXT,
    "socialLinkId" TEXT,
    "aptitudeStatus" BOOLEAN NOT NULL DEFAULT false,
    "projectStatus" BOOLEAN NOT NULL DEFAULT false,
    "reviewStatus" BOOLEAN NOT NULL DEFAULT false,
    "shortlistStatus" BOOLEAN NOT NULL DEFAULT false,
    "interviewStatus" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "questionShortDesc" TEXT NOT NULL,
    "questionLongDesc" TEXT,
    "aptitudeId" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "optionText" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aptitude" (
    "id" TEXT NOT NULL,
    "aptitudeTitle" TEXT NOT NULL,
    "aptitudeShortDesc" TEXT NOT NULL,
    "aptitudeLongDesc" TEXT,
    "aptitudeDomain" TEXT NOT NULL,
    "aptitudeYear" INTEGER NOT NULL,
    "aptitudeDuration" INTEGER NOT NULL,

    CONSTRAINT "Aptitude_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAptitudeDetails_userId_key" ON "UserAptitudeDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAptitudeDetails" ADD CONSTRAINT "UserAptitudeDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_aptitudeId_fkey" FOREIGN KEY ("aptitudeId") REFERENCES "Aptitude"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
