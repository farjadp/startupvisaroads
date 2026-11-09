import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { normaliseEmail, verifyUnsubscribeToken } from '@/lib/signed-links';
import { markUnsubscribed, maskEmail, UNSUBSCRIBE_GRACE_UNTIL } from '@/lib/marketing';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

// Removes a marketing contact. The caller must present the token from the
// unsubscribe link in their email (HMAC of the address, see
// lib/signed-links.ts); without it anyone could delete any contact, and the
// old deletedCount reply told them whether an address was on the list.

// CASL grace path: see UNSUBSCRIBE_GRACE_UNTIL in lib/marketing.ts. A request
// with NO token is accepted until that cutoff and only tags the contact.
// Remove the grace branch below after 2027-01-08.

const GRACE_LIMIT = 5;
const GRACE_WINDOW_MS = 10 * 60 * 1000;

const OK = () => NextResponse.json({ success: true, message: 'Unsubscribed successfully' });
const REFUSED = () =>
  NextResponse.json(
    {
      error:
        'This unsubscribe link is invalid or incomplete. Use the unsubscribe link in the email you received, or contact us and we will remove you.',
    },
    { status: 403 },
  );

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email = body?.email;
    const token = body?.token;

    if (typeof email !== 'string' || !email.trim() || email.length > 320) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const cleanEmail = normaliseEmail(email);

    const tokenless = token === undefined || token === null || token === '';

    if (!tokenless) {
      if (!verifyUnsubscribeToken(cleanEmail, token)) return REFUSED();
      await prisma.marketingContact.deleteMany({ where: { email: cleanEmail } });
      return OK();
    }

    if (Date.now() >= UNSUBSCRIBE_GRACE_UNTIL) return REFUSED();

    const limit = rateLimit(`unsubscribe-grace:${getClientIp(req)}`, GRACE_LIMIT, GRACE_WINDOW_MS);
    if (!limit.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
      );
    }

    await markUnsubscribed(cleanEmail);
    console.info(`[unsubscribe] CASL grace path used for ${maskEmail(cleanEmail)}`);
    // Same reply whether or not the address was on the list.
    return OK();
  } catch (error) {
    console.error('Error in unsubscribe API:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
