// ============================================================================
// GET /api/cron/autopilot-source?n=2&locale=en&publish=1[&dry=1][&mode=any][&document=<id>]
//
// The source-driven writer on a schedule: harvest today's immigration news,
// read each item into a fact sheet, write an original article, run the
// originality gate, publish. This writer refuses more than it writes — on a
// thin news day it delivers fewer than n, and that is the gate working, not
// a fault to pad around.
//
// A scheduled run takes only what may be written unasked: an official
// source whose item scored 5 out of 5 in triage. `mode=any` widens that to
// everything that cleared triage, and `document=<id>` writes from one named
// item — both are how the admin's "write from this" button reaches here, and
// the act of clicking is the approval.
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
  const mode = q.get('mode') === 'any' ? 'any' : 'auto';
  const documentId = q.get('document') || undefined;

  const started = Date.now();
  const result = await runFromSources(documentId ? 1 : n, locale, { publish, dryRun, mode, documentId });
  return NextResponse.json({ ok: true, requested: documentId ? 1 : n, locale, publish, dryRun, mode, documentId: documentId ?? null, seconds: Math.round((Date.now() - started) / 1000), ...result });
}
