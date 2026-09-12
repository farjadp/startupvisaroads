-- Articles whose source has changed since they were written. See
-- docs/knowledge-sources-architecture.md, phase 4.

CREATE TABLE "ArticleReview" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "documentId" TEXT,
    "reason" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "resolvedBy" TEXT,
    CONSTRAINT "ArticleReview_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ArticleReview_articleId_documentId_key" ON "ArticleReview"("articleId", "documentId");
CREATE INDEX "ArticleReview_resolvedAt_createdAt_idx" ON "ArticleReview"("resolvedAt", "createdAt");
