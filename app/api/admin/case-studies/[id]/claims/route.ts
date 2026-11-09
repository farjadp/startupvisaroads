// PATCH /api/admin/case-studies/[id]/claims {claimId, verified} — tick or untick
// one claim. Only while IN_REVIEW (409 otherwise); 404 for an unknown claim.
import { NextRequest, NextResponse } from 'next/server';
import { adminUser, failure, readJsonObject, unauthorized } from '@/lib/case-studies/admin-http';
import { setClaimVerified } from '@/lib/case-studies/workflow';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const username = await adminUser(req);
  if (!username) return unauthorized();
  const { id } = await params;
  const body = await readJsonObject(req);
  if (!body || typeof body.claimId !== 'string' || !body.claimId || typeof body.verified !== 'boolean') {
    return NextResponse.json({ error: 'Body must be { claimId: string, verified: boolean }' }, { status: 400 });
  }
  try {
    const result = await setClaimVerified(id, body.claimId, body.verified);
    if (!result.ok) return failure(result);
    return NextResponse.json(result);
  } catch (e) {
    console.error('[admin/case-studies] claim tick failed', id, e);
    return NextResponse.json({ error: 'Could not save the tick' }, { status: 500 });
  }
}
