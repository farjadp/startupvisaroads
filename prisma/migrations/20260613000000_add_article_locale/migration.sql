-- AlterTable
ALTER TABLE "Article" ADD COLUMN "locale" TEXT NOT NULL DEFAULT 'en';

-- CreateIndex
CREATE INDEX "Article_locale_status_createdAt_idx" ON "Article"("locale", "status", "createdAt");
