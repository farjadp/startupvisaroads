// GET /api/admin/autopilot/runs — the last 30 autopilot runs, for the admin
// console to poll while a manual run is in flight. Admin session only.
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req).catch(() => null);
  if (!session?.username) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const runs = await prisma.autopilotRun.findMany({ orderBy: { startedAt: 'desc' }, take: 30 });
  return NextResponse.json({ runs });
}
