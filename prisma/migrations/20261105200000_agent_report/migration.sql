-- Reports from the local Claude agents, shown in /admin/reports and sent to
-- the admin Telegram chat. See lib/agent-reports.

CREATE TABLE "AgentReport" (
    "id" TEXT NOT NULL,
    "agent" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'fa',
    "summary" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "telegramStatus" TEXT NOT NULL DEFAULT 'pending',
    "telegramError" TEXT,
    CONSTRAINT "AgentReport_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "AgentReport_agent_createdAt_idx" ON "AgentReport"("agent", "createdAt");
CREATE INDEX "AgentReport_createdAt_idx" ON "AgentReport"("createdAt");
