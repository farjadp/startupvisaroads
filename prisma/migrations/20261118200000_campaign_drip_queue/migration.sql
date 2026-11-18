-- Drip queue for marketing campaigns. See lib/campaign-queue/.
--
-- Additive: new nullable columns and indexes. No Campaign row is changed, so
-- no campaign status moves and nothing becomes eligible to send. The worker
-- only reads status = 'QUEUED', a value that no existing row has.
--
-- CampaignLog may already hold duplicates (the old sender could run twice), so
-- a plain UNIQUE (campaignId, contactId, channel) could fail and block every
-- later migration. Instead each log gets nullable keys: the earliest row of
-- each set takes the key, later duplicates keep NULL and stay untouched.
-- NULLs do not collide, and DISTINCT ON guarantees the keys are unique.

ALTER TABLE "Campaign"
  ADD COLUMN "dailyLimit" INTEGER,
  ADD COLUMN "sendStartAt" TIMESTAMP(3),
  ADD COLUMN "sendDays" TEXT,
  ADD COLUMN "sendWindowStart" INTEGER,
  ADD COLUMN "sendWindowEnd" INTEGER,
  ADD COLUMN "queuedAt" TIMESTAMP(3),
  ADD COLUMN "pausedReason" TEXT,
  ADD COLUMN "leaseId" TEXT,
  ADD COLUMN "leaseUntil" TIMESTAMP(3);

CREATE TABLE "MarketingSuppression" (
  "key" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MarketingSuppression_pkey" PRIMARY KEY ("key")
);

ALTER TABLE "CampaignLog"
  ADD COLUMN "sendKey" TEXT,
  ADD COLUMN "addressKey" TEXT;

UPDATE "CampaignLog" AS log
SET "sendKey" = log."campaignId" || ':' || log."channel" || ':' || log."contactId"
FROM (
  SELECT DISTINCT ON ("campaignId", "channel", "contactId") "id"
  FROM "CampaignLog"
  ORDER BY "campaignId", "channel", "contactId", "sentAt", "id"
) AS earliest
WHERE log."id" = earliest."id";

-- Same normalisation and hash as lib/campaign-queue/address.ts. Logs whose contact
-- has since been deleted have no address to key on and stay NULL.
UPDATE "CampaignLog" AS log
SET "addressKey" = log."campaignId" || ':' || log."channel" || ':' || encode(sha256(convert_to(earliest."address", 'UTF8')), 'hex')
FROM (
  SELECT DISTINCT ON (l."campaignId", l."channel", a."address") l."id", a."address"
  FROM "CampaignLog" AS l
  JOIN "MarketingContact" AS c ON c."id" = l."contactId"
  CROSS JOIN LATERAL (
    SELECT CASE
      WHEN l."channel" = 'EMAIL' THEN lower(btrim(c."email"))
      ELSE regexp_replace(c."phone", '[^0-9+]', '', 'g')
    END AS "address"
  ) AS a
  WHERE a."address" IS NOT NULL AND a."address" <> ''
  ORDER BY l."campaignId", l."channel", a."address", l."sentAt", l."id"
) AS earliest
WHERE log."id" = earliest."id";

CREATE UNIQUE INDEX "CampaignLog_sendKey_key" ON "CampaignLog"("sendKey");
CREATE UNIQUE INDEX "CampaignLog_addressKey_key" ON "CampaignLog"("addressKey");
CREATE INDEX "CampaignLog_channel_sentAt_idx" ON "CampaignLog"("channel", "sentAt");
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");
