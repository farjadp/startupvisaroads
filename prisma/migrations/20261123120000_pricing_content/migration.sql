-- The /pricing page's editable content (one JSON document, row id "main").
-- Additive only: one new table, no change to any existing table or row.
-- No row is inserted: until the first save in /en/admin/pricing the page
-- renders the defaults in lib/pricing/defaults.ts, where every unknown is TBD.

CREATE TABLE "PricingContent" (
  "id" TEXT NOT NULL,
  "data" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "updatedBy" TEXT,
  CONSTRAINT "PricingContent_pkey" PRIMARY KEY ("id")
);
