import prisma from './prisma';

// ─── Settings Helpers ────────────────────────────────────────────────────────

export async function getMarketingSetting(key: string): Promise<string | null> {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value ?? null;
}

export async function getMarketingSettings() {
  const keys = [
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
  const settings = await prisma.setting.findMany({
    where: { key: { in: keys } },
  });
  const map: Record<string, string> = {};
  for (const s of settings) map[s.key] = s.value;
  return map;
}

// ─── Send Email via Resend ───────────────────────────────────────────────────

export async function sendEmail({
  to,
  subject,
  html,
  fromName,
  fromEmail,
  apiKey,
}: {
  to: string;
  subject: string;
  html: string;
  fromName: string;
  fromEmail: string;
  apiKey: string;
}) {
  const { Resend } = await import('resend');
  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to,
    subject,
    html,
  });
  return result;
}

// ─── Send SMS via Twilio ─────────────────────────────────────────────────────

export async function sendSms({
  to,
  body,
  accountSid,
  authToken,
  from,
}: {
  to: string;
  body: string;
  accountSid: string;
  authToken: string;
  from: string;
}) {
  const twilio = await import('twilio');
  const client = twilio.default(accountSid, authToken);
  const message = await client.messages.create({ body, from, to });
  return message;
}

// ─── Rate Limit Check ────────────────────────────────────────────────────────

export async function getTodaySentCount(channel: 'EMAIL' | 'SMS') {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  return prisma.campaignLog.count({
    where: {
      channel,
      status: 'SENT',
      sentAt: { gte: startOfDay },
    },
  });
}
