-- The pre-phase-3 ledger of harvested news items, superseded by
-- SourceDocument. Dropped on Farjad's approval, 14 Sep 2026, after production
-- confirmed the condition written into the schema: the first watch tick
-- carried all 75 rows into SourceDocument and the second reported 0 new and
-- 75 already present. The record of which items were written from now lives
-- on SourceDocument, so nothing is lost.
DROP TABLE IF EXISTS "SourceArticle";
