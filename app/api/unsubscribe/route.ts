import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { normaliseEmail, verifyUnsubscribeToken } from '@/lib/signed-links';

// Removes a marketing contact. The caller must present the token from the
// unsubscribe link in their email (HMAC of the address, see
// lib/signed-links.ts); without it anyone could delete any contact, and the
// old deletedCount reply told them whether an address was on the list.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const email = body?.email;
    const token = body?.token;

    if (typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!verifyUnsubscribeToken(email, token)) {
      return NextResponse.json(
        {
          error:
            'This unsubscribe link is invalid or incomplete. Use the unsubscribe link in the email you received, or contact us and we will remove you.',
        },
        { status: 403 },
      );
    }

    await prisma.marketingContact.deleteMany({
      where: { email: normaliseEmail(email) },
    });

    return NextResponse.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Error in unsubscribe API:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
