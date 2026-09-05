-- Article: answer-engine fields written by the autopilot (nullable for hand-written rows)
ALTER TABLE "Article" ADD COLUMN "keyTakeaway" TEXT;
ALTER TABLE "Article" ADD COLUMN "summaryEn" TEXT;
ALTER TABLE "Article" ADD COLUMN "faq" TEXT;
ALTER TABLE "Article" ADD COLUMN "aiModel" TEXT;
ALTER TABLE "Article" ADD COLUMN "topicSeed" TEXT;
ALTER TABLE "Article" ADD COLUMN "internalLinks" TEXT NOT NULL DEFAULT '[]';

-- One row per autopilot invocation
CREATE TABLE "AutopilotRun" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "locale" TEXT NOT NULL DEFAULT 'en',
    "mode" TEXT NOT NULL DEFAULT 'planned',
    "requested" INTEGER NOT NULL,
    "created" INTEGER NOT NULL DEFAULT 0,
    "errors" TEXT,
    "skipped" TEXT,
    "notes" TEXT,
    CONSTRAINT "AutopilotRun_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AutopilotRun_startedAt_idx" ON "AutopilotRun"("startedAt");
