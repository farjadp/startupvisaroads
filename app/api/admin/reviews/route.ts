// GET   /api/admin/reviews — articles whose source has changed since they
//                            were written, newest first.
// PATCH /api/admin/reviews  {id} — mark one handled.
// Admin session only.
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { openReviews, resolveReview } from '@/lib/knowledge/review';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req).catch(() => null);
  if (!session?.username) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ reviews: await openReviews() });
}

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromRequest(req).catch(() => null);
  if (!session?.username) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { id?: string };
  if (!body.id) return NextResponse.json({ error: 'Which review?' }, { status: 400 });
  try {
    await resolveReview(body.id, session.username);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Failed' }, { status: 400 });
  }
}
