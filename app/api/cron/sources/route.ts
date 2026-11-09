// ============================================================================
// GET /api/cron/sources?limit=5[&source=<id>]
//
// Work through pending knowledge-source ingest jobs: fetch, chunk, embed,
// digest. Each job saves its step, so a run that hits the budget resumes
// next tick. Cloud Scheduler calls this every 15 minutes; the admin console
// also calls it right after registering a source so the wait is seconds,
// not a quarter hour.
//
// Auth as for the other cron routes: Bearer CRON_SECRET or an admin session.
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import { runPendingJobs } from '@/lib/knowledge/ingest';
import { authorisedCron } from '@/lib/cron-auth';
import { releaseScheduled } from '@/lib/agent-articles';
import { releaseDueCaseStudies } from '@/lib/case-studies/workflow';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  if (!(await authorisedCron(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const q = req.nextUrl.searchParams;
  const limit = Math.min(20, Math.max(1, Number(q.get('limit') ?? 5) || 5));
  const sourceId = q.get('source') || undefined;
  const started = Date.now();
  // Held agent articles ride on this 15-minute tick (lib/agent-articles.ts).
  // A failure here must never stop the ingest.
  const released = await releaseScheduled().catch((e) => {
    console.error('[sources] releaseScheduled', e);
    return [] as string[];
  });
  // Held case studies too (lib/case-studies/workflow.ts); the gate is re-checked at release.
  let caseStudies: string[] = [];
  try {
    const cs = await releaseDueCaseStudies();
    caseStudies = cs.released;
    if (cs.released.length || cs.held.length) {
      console.info(`[sources] case studies released ${cs.released.length}, held ${cs.held.length}`, cs.held);
    }
  } catch (e) {
    console.error('[sources] releaseDueCaseStudies', e);
  }
  const result = await runPendingJobs({ limit, sourceId, budgetMs: 200_000 });
  return NextResponse.json({ ok: true, seconds: Math.round((Date.now() - started) / 1000), released, caseStudies, ...result });
}
