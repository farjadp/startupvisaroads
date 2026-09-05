-- Ledger of external source articles seen by the autopilot
CREATE TABLE "SourceArticle" (
    "id" TEXT NOT NULL,
    "sourceSlug" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "text" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "reason" TEXT,
    "articleId" TEXT,
    "harvestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SourceArticle_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SourceArticle_url_key" ON "SourceArticle"("url");
CREATE INDEX "SourceArticle_sourceSlug_status_publishedAt_idx" ON "SourceArticle"("sourceSlug", "status", "publishedAt");
