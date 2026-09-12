// GET /api/admin/sources/queue — source items that cleared triage and are
// waiting for someone to say yes. Admin session only.
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { suggestedDocuments } from '@/lib/knowledge/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req).catch(() => null);
  if (!session?.username) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ documents: await suggestedDocuments() });
}
