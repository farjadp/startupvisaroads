// POST /api/admin/case-studies/consents/[id]/revoke {reason}
// Revokes the consent and withdraws every linked case in one transaction.
// 200 { ok: true, withdrawn }; 404 unknown; 409 already revoked.
import { NextRequest, NextResponse } from 'next/server';
import { adminUser, failure, readJsonObject, unauthorized } from '@/lib/case-studies/admin-http';
import { revokeConsent } from '@/lib/case-studies/workflow';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const username = await adminUser(req);
  if (!username) return unauthorized();
  const { id } = await params;
  const parsedBody = await readJsonObject(req);
  if (!parsedBody.ok) return parsedBody.response;
  const body = parsedBody.body;
  const reason = typeof body?.reason === 'string' ? body.reason.trim() : '';
  if (!reason || reason.length > 1000) {
    return NextResponse.json({ error: 'reason is required (at most 1000 characters)', reasons: [] }, { status: 400 });
  }
  try {
    const result = await revokeConsent(id, reason, username);
    if (!result.ok) return failure(result);
    return NextResponse.json(result);
  } catch (e) {
    console.error('[admin/case-studies] consent revoke failed', id, e);
    return NextResponse.json({ error: 'Could not revoke the consent', reasons: [] }, { status: 500 });
  }
}
