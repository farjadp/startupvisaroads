import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionFromRequest } from '@/lib/auth';

async function checkAuth(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  return !!session?.username;
}

const MARKETING_KEYS = [
  'marketing_resend_api_key',
  'marketing_twilio_sid',
  'marketing_twilio_token',
  'marketing_twilio_from',
  'marketing_max_emails_per_day',
  'marketing_max_sms_per_day',
  'marketing_unsubscribe_url',
  'marketing_sender_name',
  'marketing_sender_email',
];

export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const settings = await prisma.setting.findMany({
    where: { key: { in: MARKETING_KEYS } },
  });

  const map: Record<string, string> = {};
  for (const s of settings) map[s.key] = s.value;

  return NextResponse.json({ settings: map });
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json() as Record<string, string>;
  const updates = Object.entries(body).filter(([key]) => MARKETING_KEYS.includes(key));

  await Promise.all(
    updates.map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    ),
  );

  return NextResponse.json({ saved: updates.length });
}
