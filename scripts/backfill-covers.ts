// ============================================================================
// scripts/backfill-covers.ts
// Fill in the covers of published articles that have none.
//
// Locally (dev.db, the Prisma client this checkout generated):
//   npx tsx scripts/backfill-covers.ts --dry-run          # what it would do
//   npx tsx scripts/backfill-covers.ts --limit 5
//   npx tsx scripts/backfill-covers.ts --slug some-article
//
// Against production — do NOT point DATABASE_URL at the production Postgres
// from here; this checkout's Prisma client is built for SQLite, and the
// media bucket credentials live on Cloud Run, not on this Mac. Drive the
// deployed endpoint instead, which has the database, the keys and the
// bucket in one place:
//   npx tsx scripts/backfill-covers.ts --remote --dry-run
//   npx tsx scripts/backfill-covers.ts --remote --limit 5
//
// To replace one cover that came out wrong (--force needs --slug, so it can
// never re-buy the whole blog):
//   npx tsx scripts/backfill-covers.ts --remote --force --slug some-article
//
// In-article photographs instead of the cover, and redoing covers after the
// art direction itself changed:
//   npx tsx scripts/backfill-covers.ts --remote --inline --limit 3
//   npx tsx scripts/backfill-covers.ts --remote --force-all --limit 12
// CRON_SECRET comes from .env; --url overrides https://visaroads.com.
// ============================================================================
import fs from 'node:fs';

// Load .env.local / .env the way Next does, without adding a dependency.
for (const f of ['.env.local', '.env']) {
  if (!fs.existsSync(f)) continue;
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const argv = process.argv.slice(2);
const flag = (name: string) => argv.includes(`--${name}`);
const value = (name: string) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};

const opts = {
  limit: Number(value('limit') ?? 5),
  locale: value('locale') as 'en' | 'fa' | undefined,
  slug: value('slug'),
  dryRun: flag('dry-run'),
  force: flag('force'),
  forceAll: flag('force-all'),
  mode: flag('inline') ? 'inline' : undefined,
};

async function remote() {
  const base = (value('url') ?? 'https://visaroads.com').replace(/\/$/, '');
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error('CRON_SECRET missing — needed to call the deployed endpoint');

  const url = new URL(`${base}/api/cron/backfill-covers`);
  url.searchParams.set('limit', String(opts.limit));
  if (opts.locale) url.searchParams.set('locale', opts.locale);
  if (opts.slug) url.searchParams.set('slug', opts.slug);
  if (opts.force) url.searchParams.set('force', '1');
  if (opts.forceAll) url.searchParams.set('forceAll', '1');
  if (opts.mode) url.searchParams.set('mode', opts.mode);

  console.log(`${opts.dryRun ? 'GET' : 'POST'} ${url.toString()}`);
  const res = await fetch(url, {
    method: opts.dryRun ? 'GET' : 'POST',
    headers: { Authorization: `Bearer ${secret}` },
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`${res.status}: ${body.slice(0, 300)}`);
  return JSON.parse(body);
}

async function local() {
  // Imported lazily so --remote never touches Prisma or the image providers.
  const { backfillCovers, backfillInlinePhotos } = await import('../lib/covers');
  return opts.mode === 'inline' ? backfillInlinePhotos(opts) : backfillCovers(opts);
}

async function main() {
  const result = await (flag('remote') ? remote() : local());

  if (result.blocked) {
    console.error(`\nBlocked: ${result.blocked}`);
    process.exit(1);
  }
  console.log(`\nconsidered ${result.considered} · done ${result.done.length} · failed ${result.failed.length}`);
  for (const d of result.done) console.log(`  ✓ ${d.slug}${d.coverImage ? ` → ${d.coverImage}` : ''}\n      ${d.scene}`);
  for (const f of result.failed) console.log(`  ✗ ${f.slug} — ${f.reason}`);
  if (opts.dryRun) console.log('\n(dry run — nothing generated, nothing written)');
  if (result.failed.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
