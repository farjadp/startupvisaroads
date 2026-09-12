-- Knowledge sources: what the admin registers for the writer to draw
-- evidence from. See docs/knowledge-sources-architecture.md.

CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "cadence" TEXT NOT NULL DEFAULT 'once',
    "url" TEXT,
    "storagePath" TEXT,
    "title" TEXT,
    "trust" TEXT NOT NULL DEFAULT 'press',
    "locale" TEXT,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "topics" TEXT NOT NULL DEFAULT '[]',
    "watchEvery" INTEGER,
    "watchMode" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "lastCheckedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Source_url_key" ON "Source"("url");
CREATE INDEX "Source_cadence_enabled_idx" ON "Source"("cadence", "enabled");

CREATE TABLE "SourceDocument" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "url" TEXT,
    "title" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contentHash" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "charCount" INTEGER NOT NULL DEFAULT 0,
    "language" TEXT,
    "digest" TEXT,
    "relevance" INTEGER,
    "matchedTopics" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'new',
    "reason" TEXT,
    "articleIds" TEXT NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SourceDocument_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "SourceDocument_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "SourceDocument_url_key" ON "SourceDocument"("url");
CREATE INDEX "SourceDocument_sourceId_status_publishedAt_idx" ON "SourceDocument"("sourceId", "status", "publishedAt");

CREATE TABLE "SourceChunk" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "ord" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "locator" TEXT,
    "embedding" BYTEA,
    "tokenCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SourceChunk_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "SourceChunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "SourceDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "SourceChunk_documentId_ord_idx" ON "SourceChunk"("documentId", "ord");

CREATE TABLE "IngestJob" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "documentId" TEXT,
    "step" TEXT NOT NULL DEFAULT 'fetch',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "runAfter" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "IngestJob_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "IngestJob_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "IngestJob_status_runAfter_idx" ON "IngestJob"("status", "runAfter");
