// ============================================================================
// app/api/cron/backfill-covers/route.ts
// Give published articles that have no cover one, from production, where the
// database, the image keys and the media bucket all live. Same authorisation
// as every other cron route: a Cloud Scheduler bearer token or a signed-in
// admin.
//
//   curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
//     "https://visaroads.com/api/cron/backfill-covers?limit=5"
//
// ?mode=inline does the in-article photographs instead of the cover.
//
// It is a POST because it spends money and writes rows; GET is allowed only
// with ?dryRun=1, so a look is always free.
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';
import { authorisedCron } from '@/lib/cron-auth';
import { backfillCovers, backfillInlinePhotos, type BackfillOptions } from '@/lib/covers';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

/** covers (default) fills article covers; inline fills in-article photos. */
function mode(req: NextRequest): 'covers' | 'inline' {
  return req.nextUrl.searchParams.get('mode') === 'inline' ? 'inline' : 'covers';
}

function run(req: NextRequest, opts: BackfillOptions) {
  return mode(req) === 'inline' ? backfillInlinePhotos(opts) : backfillCovers(opts);
}

function options(req: NextRequest): BackfillOptions {
  const q = req.nextUrl.searchParams;
  const locale = q.get('locale');
  return {
    limit: Number(q.get('limit') ?? 5),
    locale: locale === 'en' || locale === 'fa' ? locale : undefined,
    slug: q.get('slug') ?? undefined,
    force: q.get('force') === '1',
    forceAll: q.get('forceAll') === '1',
  };
}

export async function POST(req: NextRequest) {
  if (!(await authorisedCron(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const result = await run(req, options(req));
  return NextResponse.json(result);
}

/** Read-only: which articles would be done, and with what scene. */
export async function GET(req: NextRequest) {
  if (!(await authorisedCron(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const result = await run(req, { ...options(req), dryRun: true });
  return NextResponse.json(result);
}
