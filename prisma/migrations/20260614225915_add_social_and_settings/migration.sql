-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "sharedToLinkedin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sharedToTwitter" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sharedToFacebook" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("key")
);
