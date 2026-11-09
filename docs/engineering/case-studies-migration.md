# Case studies migration and rollback

Migration: `prisma/migrations/20261109210000_case_studies/migration.sql`
Spec: `docs/product/case-studies-spec.md` §4, §6, §7

## What it does

Additive only. It creates two new tables and touches no existing table, so live tables take no locks and there is nothing to backfill.

- `ConsentRecord`: the client's written consent behind a `CLIENT_CASE`. `clientRef` is an internal reference, never a name. `documentUri` points to private storage only.
- `CaseStudy`: one row per locale; `groupKey` pairs the en and fa rows.
  - Unique `(locale, slug)` and `(groupKey, locale)`.
  - Indexes `(locale, status, publishedAt)` for the public lists, `(status, publishAt)` for the 15-minute release cron, and `(consentRecordId)` for "withdraw every case linked to this consent".
  - FK `consentRecordId → ConsentRecord.id`, `ON DELETE RESTRICT`: a consent record can't be deleted while a case points at it. Revoke it (`revokedAt`) instead.
  - JSON fields (`issues`, `lessons`, `claims`, `faq`, `redLines`, `ConsentRecord.scope`) are stored as TEXT, the same as in both schemas elsewhere.
  - `sample` marks seeded sample rows; public queries must exclude `sample = true` in production.
  - `supersededById` is a plain string with no self-relation.

Both `prisma/schema.prisma` (SQLite, dev) and `prisma/schema.production.prisma` (Postgres, prod) carry identical model definitions.

## Deploy

Ships with the app. `docker-entrypoint.sh` runs `prisma migrate deploy --schema=prisma/schema.production.prisma` at boot. Order: merge as one deploy. The new code only reads the new tables, and the old code ignores them, so the order doesn't matter in either direction.

**db-f1-micro:** the instance runs out of connection slots during deploys. When that happens, migrate deploy fails at boot and the server starts anyway. After the deploy, look for `All migrations have been successfully applied.` (with `20261109210000_case_studies` above it) in the Cloud Run boot logs for the new revision. If you don't see it, re-run the migrate job described in DEPLOY.md.

## Rollback (down SQL)

Drop the child table first: `CaseStudy` holds the FK, and dropping it removes its indexes and the FK as well. Then drop `ConsentRecord`, then remove the migration row so a later `migrate deploy` can re-apply it.

```sql
BEGIN;
DROP TABLE IF EXISTS "CaseStudy";
DROP TABLE IF EXISTS "ConsentRecord";
DELETE FROM "_prisma_migrations" WHERE "migration_name" = '20261109210000_case_studies';
COMMIT;
```

This destroys any case studies and consent records in the tables. Export them first if any are real, and roll back the app code before you drop the tables. Farjad runs this against prod; agents never do.

## Verification run (9 Nov 2026, throwaway Postgres 16)

```
$ docker run --rm -d --name cs-pg -e POSTGRES_PASSWORD=pg -p 55432:5432 postgres:16-alpine

$ DATABASE_URL="postgresql://postgres:pg@localhost:55432/postgres?schema=public" \
    npx prisma migrate deploy --schema=prisma/schema.production.prisma
...
Applying migration `20261105200000_agent_report`
Applying migration `20261109210000_case_studies`
All migrations have been successfully applied.

$ DATABASE_URL="postgresql://postgres:pg@localhost:55432/postgres?schema=public" \
    npx prisma migrate diff \
      --from-url "postgresql://postgres:pg@localhost:55432/postgres?schema=public" \
      --to-schema-datamodel prisma/schema.production.prisma --exit-code
No difference detected.          # exit 0

# FK check: insert a consent + a linked case, then delete the consent
ERROR:  update or delete on table "ConsentRecord" violates foreign key constraint
        "CaseStudy_consentRecordId_fkey" on table "CaseStudy"

# rollback SQL above
BEGIN / DROP TABLE / DROP TABLE / DELETE 1 / COMMIT
\dt "Case*"     -> Did not find any relation
\dt "Consent*"  -> Did not find any relation

# re-apply
Applying migration `20261109210000_case_studies`
All migrations have been successfully applied.
migrate diff --exit-code -> No difference detected.   # exit 0

$ docker stop cs-pg      # --rm removed it
```

Dev (SQLite): `npx prisma db push --schema=prisma/schema.prisma` → "Your database is now in sync", Prisma Client regenerated (`prisma.caseStudy`, `prisma.consentRecord`). `prisma/dev.db` is git-ignored (`*.db`).
