-- AlterTable CampaignLog: Add tracking fields
ALTER TABLE "CampaignLog" ADD COLUMN "openCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CampaignLog" ADD COLUMN "openedAt" TIMESTAMP(3);
ALTER TABLE "CampaignLog" ADD COLUMN "clickCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CampaignLog" ADD COLUMN "clickedAt" TIMESTAMP(3);
ALTER TABLE "CampaignLog" ADD COLUMN "clickedUrls" TEXT NOT NULL DEFAULT '[]';
