// ============================================================================
// GET /api/cron/autopilot-source?n=2&locale=en&publish=1[&dry=1]
//
// The source-driven writer on a schedule: harvest today's immigration news,
// read each item into a fact sheet, write an original article, run the
// originality gate, publish. This writer refuses more than it writes — on a
// thin news day it delivers fewer than n, and that is the gate working, not
// a fault to pad around.
//
// Auth and timing as for /api/cron/autopilot: Bearer CRON_SECRET or admin
// session; call the Cloud Run URL directly, not through Cloudflare.
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import { runFromSources } from '@/lib/autopilot/source-writer';
import { authorisedCron } from '@/lib/cron-auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const MAX_PER_RUN = 4;

export async function GET(req: NextRequest) {
  if (!(await authorisedCron(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const q = req.nextUrl.searchParams;
  const n = Math.min(MAX_PER_RUN, Math.max(1, Number(q.get('n') ?? 1) || 1));
  const locale = q.get('locale') === 'fa' ? 'fa' : 'en';
  const publish = q.get('publish') === '1';
  const dryRun = q.get('dry') === '1';

  const started = Date.now();
  const result = await runFromSources(n, locale, { publish, dryRun });
  return NextResponse.json({ ok: true, requested: n, locale, publish, dryRun, seconds: Math.round((Date.now() - started) / 1000), ...result });
}
