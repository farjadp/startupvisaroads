-- Editing a campaign part-way through, and per-link click counts.
-- Additive only: no status changes, nothing becomes eligible to send.
-- CampaignLog.contentVersion stays NULL on existing rows, read as version 1.

ALTER TABLE "Campaign" ADD COLUMN "contentVersion" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "CampaignLog" ADD COLUMN "contentVersion" INTEGER;

CREATE TABLE "CampaignContentVersion" (
  "id" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "version" INTEGER NOT NULL,
  "subject" TEXT,
  "body" TEXT NOT NULL,
  "smsBody" TEXT,
  "replacedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CampaignContentVersion_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CampaignContentVersion_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "CampaignContentVersion_campaignId_version_key" ON "CampaignContentVersion"("campaignId", "version");

CREATE TABLE "CampaignLinkClick" (
  "id" TEXT NOT NULL,
  "campaignId" TEXT NOT NULL,
  "logId" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CampaignLinkClick_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CampaignLinkClick_logId_fkey" FOREIGN KEY ("logId") REFERENCES "CampaignLog"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "CampaignLinkClick_campaignId_idx" ON "CampaignLinkClick"("campaignId");
CREATE INDEX "CampaignLinkClick_logId_idx" ON "CampaignLinkClick"("logId");
