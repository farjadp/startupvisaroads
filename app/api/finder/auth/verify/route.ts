// GET /api/finder/auth/verify?token=… — the emailed link. Marks the address
// verified, completes the "account" step, sets the session cookie and returns
// the visitor to the finder.
import { NextResponse, type NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { readLoginToken, sessionCookie, signSession } from '@/lib/rcip-finder/session';
import { completeStep } from '@/lib/rcip-finder/service';
import { limited } from '@/lib/rcip-finder/http';

export const dynamic = 'force-dynamic';
const FINDER = (l: string) => `/${l}/data-reports/rcip-employers`;

export async function GET(req: NextRequest) {
  const block = limited(req, 'verify', 20, 15 * 60_000);
  if (block) return block;
  const login = await readLoginToken(req.nextUrl.searchParams.get('token') ?? '');
  if (!login) return NextResponse.redirect(new URL(`${FINDER('en')}?signin=expired`, req.url), 303);
  const user = await prisma.finderUser.update({
    where: { email: login.email },
    data: { verifiedAt: new Date(), lastSeenAt: new Date() },
  }).catch(() => null);
  if (!user) return NextResponse.redirect(new URL(`${FINDER(login.locale)}?signin=expired`, req.url), 303);
  await completeStep(user.id, 'account');
  const res = NextResponse.redirect(new URL(`${FINDER(login.locale)}?signin=ok`, req.url), 303);
  res.cookies.set(sessionCookie(await signSession(user.id)));
  return res;
}
