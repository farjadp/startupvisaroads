// ============================================================================
// GET /api/cron/autopilot?n=2&locale=en&publish=1[&dry=1]
//
// The daily planned writer. Cloud Scheduler calls it with
// `Authorization: Bearer $CRON_SECRET`; an admin session can call it by hand.
// The query string is the schedule: n articles, in one locale, eligible for
// PUBLISHED when publish=1 and an official citation survives (otherwise DRAFT). dry=1 plans and drafts but
// spends nothing on images and inserts nothing.
//
// Call the Cloud Run URL directly (run.app), not the Cloudflare-proxied
// domain: a batch takes minutes and Cloudflare cuts at 100 s (524).
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import { runPlanned } from '@/lib/autopilot/writer';
import { authorisedCron } from '@/lib/cron-auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const MAX_PER_RUN = 5;

export async function GET(req: NextRequest) {
  if (!(await authorisedCron(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const q = req.nextUrl.searchParams;
  const n = Math.min(MAX_PER_RUN, Math.max(1, Number(q.get('n') ?? 1) || 1));
  const locale = q.get('locale') === 'fa' ? 'fa' : 'en';
  const publish = q.get('publish') === '1';
  const dryRun = q.get('dry') === '1';

  const started = Date.now();
  const result = await runPlanned(n, locale, { publish, dryRun });
  return NextResponse.json({ ok: true, requested: n, locale, publish, dryRun, seconds: Math.round((Date.now() - started) / 1000), ...result });
}
