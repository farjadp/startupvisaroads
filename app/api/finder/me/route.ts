// GET /api/finder/me — the signed-in visitor's profile, steps and quota.
// DELETE /api/finder/me — deletes the account, its steps and reveals.
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getMe } from '@/lib/rcip-finder/service';
import { sessionCookie, sessionUserId } from '@/lib/rcip-finder/session';
import { json } from '@/lib/rcip-finder/http';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const userId = await sessionUserId(req);
  if (!userId) return json({ me: null });
  const me = await getMe(userId).catch(() => null);
  if (me) await prisma.finderUser.update({ where: { id: userId }, data: { lastSeenAt: new Date() } }).catch(() => null);
  return json({ me });
}

export async function DELETE(req: NextRequest) {
  const userId = await sessionUserId(req);
  if (!userId) return json({ error: 'signed_out' }, 401);
  await prisma.finderUser.delete({ where: { id: userId } }).catch(() => null);
  const res = json({ ok: true });
  res.cookies.set(sessionCookie('', 0));
  return res;
}
