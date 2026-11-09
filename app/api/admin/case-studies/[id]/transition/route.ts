// POST /api/admin/case-studies/[id]/transition
//   { action: 'submit'|'approve'|'schedule'|'publish'|'reopen'|'withdraw', publishAt?, reason? }
// 200 { ok: true, item } or 4xx { error, reasons }. The rules are in lib/case-studies/workflow.ts.
import { NextRequest, NextResponse } from 'next/server';
import { adminUser, failure, readJsonObject, unauthorized } from '@/lib/case-studies/admin-http';
import { TRANSITIONS, transitionCaseStudy, type TransitionAction } from '@/lib/case-studies/workflow';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const username = await adminUser(req);
  if (!username) return unauthorized();
  const { id } = await params;
  const parsedBody = await readJsonObject(req);
  if (!parsedBody.ok) return parsedBody.response;
  const body = parsedBody.body;
  const action = body?.action;
  if (!body || typeof action !== 'string' || !(TRANSITIONS as readonly string[]).includes(action)) {
    return NextResponse.json({ error: `action must be one of ${TRANSITIONS.join(', ')}`, reasons: [] }, { status: 400 });
  }
  let publishAt: Date | undefined;
  if (body.publishAt !== undefined) {
    if (typeof body.publishAt !== 'string' || Number.isNaN(new Date(body.publishAt).getTime())) {
      return NextResponse.json({ error: 'publishAt must be an ISO date', reasons: [] }, { status: 400 });
    }
    publishAt = new Date(body.publishAt);
  }
  if (body.reason !== undefined && typeof body.reason !== 'string') {
    return NextResponse.json({ error: 'reason must be a string', reasons: [] }, { status: 400 });
  }
  try {
    const result = await transitionCaseStudy(id, action as TransitionAction, {
      username,
      publishAt,
      reason: typeof body.reason === 'string' ? body.reason : undefined,
    });
    if (!result.ok) return failure(result);
    return NextResponse.json(result);
  } catch (e) {
    console.error('[admin/case-studies] transition failed', id, action, e);
    return NextResponse.json({ error: 'Could not change the status', reasons: [] }, { status: 500 });
  }
}
