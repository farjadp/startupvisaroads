// ============================================================================
// GET /api/cron/sources-watch?limit=10[&source=<id>][&ingest=1]
//
// Ask every watch source what it has published since we last looked, ledger
// the new item URLs, and queue an ingest job for each fresh one. The reading
// itself is /api/cron/sources' job; pass ingest=1 to run a slice of it here
// so a manual trigger from the admin shows results without waiting for the
// next quarter-hour tick.
//
// The three feeds the autopilot used to read from a constant in the code are
// installed as rows on the first call, so this needs no setup step.
//
// Auth and timing as for the other cron routes: Bearer CRON_SECRET or an
// admin session; call the Cloud Run URL directly, not through Cloudflare.
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import { authorisedCron } from '@/lib/cron-auth';
import { ensureDefaultWatchSources, runWatch } from '@/lib/knowledge/watch';
import { runPendingJobs } from '@/lib/knowledge/ingest';
import { backfillSourceArticles } from '@/lib/knowledge/backfill';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  if (!(await authorisedCron(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const q = req.nextUrl.searchParams;
  const limit = Math.min(20, Math.max(1, Number(q.get('limit') ?? 10) || 10));
  const sourceId = q.get('source') || undefined;
  const started = Date.now();

  const installed = await ensureDefaultWatchSources();
  // Idempotent, and it has to run before discovery: without the old URLs in
  // the ledger the first watch pass rediscovers everything the previous
  // harvester already wrote from.
  const backfilled = await backfillSourceArticles();
  const watch = await runWatch({ limit, sourceId });
  const ingest = q.get('ingest') === '1' ? await runPendingJobs({ limit: 5, budgetMs: 180_000, sourceId }) : null;

  return NextResponse.json({
    ok: true,
    seconds: Math.round((Date.now() - started) / 1000),
    installed,
    backfilled,
    ...watch,
    ingest,
  });
}
