-- Case studies (Federal Court decisions and consented client cases) and the
-- consent records behind client cases. See docs/product/case-studies-spec.md
-- §7 and docs/engineering/case-studies-migration.md (rollback).
-- Additive only: two new tables, their indexes and one FK. No existing table
-- is touched, so there is no lock on live tables.

CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL,
    "groupKey" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "keyTakeaway" TEXT,
    "summaryEn" TEXT,
    "court" TEXT,
    "citation" TEXT,
    "decisionDate" TIMESTAMP(3),
    "judge" TEXT,
    "route" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'canada',
    "outcome" TEXT,
    "officialUrl" TEXT,
    "issues" TEXT NOT NULL DEFAULT '[]',
    "lessons" TEXT NOT NULL DEFAULT '[]',
    "claims" TEXT NOT NULL DEFAULT '[]',
    "faq" TEXT NOT NULL DEFAULT '[]',
    "redLines" TEXT NOT NULL DEFAULT '[]',
    "sourceSha256" TEXT,
    "fetchedAt" TIMESTAMP(3),
    "certifiedQuestion" TEXT,
    "consentRecordId" TEXT,
    "aiModel" TEXT,
    "sample" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "publishAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "withdrawnReason" TEXT,
    "supersededById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ConsentRecord" (
    "id" TEXT NOT NULL,
    "clientRef" TEXT NOT NULL,
    "scope" TEXT NOT NULL DEFAULT '{}',
    "signedAt" TIMESTAMP(3) NOT NULL,
    "documentUri" TEXT,
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,
    "recordedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ConsentRecord_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CaseStudy_locale_status_publishedAt_idx" ON "CaseStudy"("locale", "status", "publishedAt");
CREATE INDEX "CaseStudy_status_publishAt_idx" ON "CaseStudy"("status", "publishAt");
CREATE INDEX "CaseStudy_consentRecordId_idx" ON "CaseStudy"("consentRecordId");
CREATE UNIQUE INDEX "CaseStudy_locale_slug_key" ON "CaseStudy"("locale", "slug");
CREATE UNIQUE INDEX "CaseStudy_groupKey_locale_key" ON "CaseStudy"("groupKey", "locale");

ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_consentRecordId_fkey" FOREIGN KEY ("consentRecordId") REFERENCES "ConsentRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
