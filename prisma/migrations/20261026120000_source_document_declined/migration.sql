-- Give back to the evidence store the documents the source writer took out.
--
-- Until 26 Oct 2026 the writer marked every item it read and did not write
-- from as `ignored` (or `failed` when it crashed mid-write), and retrieval read
-- only `ready`. So reading an item removed it from evidence. Those rows are
-- now `declined`: out of the writing queue, back in retrieval.
--
-- Only rows the writer can have touched: it reads nothing below relevance 4
-- (WRITE_THRESHOLD) and nothing without a digest, and a row it wrote from is
-- `used`, not one of these. Triage, watch and ingest rejections keep their
-- own reasons and stay `ignored`.
UPDATE "SourceDocument"
SET "status" = 'declined'
WHERE "status" IN ('ignored', 'failed')
  AND "relevance" >= 4
  AND "digest" IS NOT NULL
  AND "articleIds" = '[]'
  AND COALESCE("reason", '') NOT LIKE 'scored %'
  AND COALESCE("reason", '') NOT LIKE 'older than %'
  AND COALESCE("reason", '') NOT LIKE 'nothing worth reading%';
