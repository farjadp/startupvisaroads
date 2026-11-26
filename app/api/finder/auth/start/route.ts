// POST /api/finder/auth/start {email, locale, consent: true, marketingOptIn?}
// Creates the account if needed and emails a sign-in link. Always answers the
// same way whether or not the address already has an account.
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { normaliseEmail, signLoginToken } from '@/lib/rcip-finder/session';
import { sendLoginEmail } from '@/lib/rcip-finder/email';
import { json, limited, readJson } from '@/lib/rcip-finder/http';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const block = limited(req, 'auth', 5, 15 * 60_000);
  if (block) return block;
  const body = await readJson(req, 2000);
  const email = normaliseEmail(body?.email);
  if (!email) return json({ error: 'email' }, 400);
  if (body?.consent !== true) return json({ error: 'consent' }, 400);
  const perEmail = limited(req, 'auth-email', 3, 15 * 60_000, email);
  if (perEmail) return perEmail;
  const locale = body?.locale === 'fa' ? 'fa' : 'en';
  try {
    await prisma.finderUser.upsert({
      where: { email },
      update: body?.marketingOptIn === true ? { marketingOptIn: true } : {},
      create: { email, consentAt: new Date(), marketingOptIn: body?.marketingOptIn === true },
    });
    const sent = await sendLoginEmail(email, await signLoginToken(email, locale), locale);
    if (sent === 'unavailable') return json({ error: 'email_unavailable' }, 503);
    return json({ ok: true });
  } catch (e) {
    console.error('[finder] auth start', e);
    return json({ error: 'unavailable' }, 503);
  }
}
