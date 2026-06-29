-- Marketing Module: Contacts, Groups, Campaigns, Logs
-- Migration: 20260629000000_add_marketing_module

-- CreateTable MarketingGroup
CREATE TABLE "MarketingGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#CCFF00',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketingGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable MarketingContact
CREATE TABLE "MarketingContact" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "name" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "groupId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketingContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable Campaign
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'EMAIL',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "subject" TEXT,
    "body" TEXT NOT NULL DEFAULT '',
    "smsBody" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable CampaignGroup
CREATE TABLE "CampaignGroup" (
    "campaignId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "CampaignGroup_pkey" PRIMARY KEY ("campaignId","groupId")
);

-- CreateTable CampaignLog
CREATE TABLE "CampaignLog" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MarketingContact_email_idx" ON "MarketingContact"("email");
CREATE INDEX "MarketingContact_groupId_idx" ON "MarketingContact"("groupId");
CREATE INDEX "CampaignLog_campaignId_idx" ON "CampaignLog"("campaignId");
CREATE INDEX "CampaignLog_campaignId_status_idx" ON "CampaignLog"("campaignId", "status");

-- AddForeignKey
ALTER TABLE "MarketingContact" ADD CONSTRAINT "MarketingContact_groupId_fkey"
    FOREIGN KEY ("groupId") REFERENCES "MarketingGroup"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CampaignGroup" ADD CONSTRAINT "CampaignGroup_campaignId_fkey"
    FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CampaignGroup" ADD CONSTRAINT "CampaignGroup_groupId_fkey"
    FOREIGN KEY ("groupId") REFERENCES "MarketingGroup"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CampaignLog" ADD CONSTRAINT "CampaignLog_campaignId_fkey"
    FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
