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

// ─── Unsubscribe tag ─────────────────────────────────────────────────────────
// A reversible "do not send" marker, used by the CASL grace path in
// /api/unsubscribe (tokenless links from emails sent before signed tokens).
// The schema has no unsubscribed column, and `tags` differs by database:
// a JSON string ("[]") in the SQLite dev schema, a native String[] in the
// Postgres production schema. These helpers accept either and write back in
// the same shape they read. Malformed JSON reads as no tags.

export const UNSUBSCRIBED_TAG = 'unsubscribed';

// CASL grace path — TEMPORARY, remove after the cutoff.
// Emails sent before signed tokens shipped (~9 Nov 2026) carry unsubscribe
// links with no token, and CASL requires an unsubscribe mechanism to keep
// working for 60 days after a message is sent. Until this fixed date,
// a request with NO token is accepted, but only tags the contact
// "unsubscribed" (reversible; the campaign sender skips tagged contacts) and
// never deletes. A token that is present but invalid is always refused.
// 9 Nov 2026 + 60 days = 8 Jan 2027; set to the end of that day to absorb
// merge/deploy delay. After it, tokenless requests get the normal 403.
// Delete this constant and the grace branch after 2027-01-08.
export const UNSUBSCRIBE_GRACE_UNTIL = Date.parse('2027-01-08T23:59:59Z');

export function parseTags(tags: unknown): string[] {
  let raw: unknown = tags;
  if (typeof tags === 'string') {
    try {
      raw = JSON.parse(tags);
    } catch {
      return [];
    }
  }
  return Array.isArray(raw) ? raw.filter((t): t is string => typeof t === 'string') : [];
}

export const isUnsubscribed = (tags: unknown): boolean => parseTags(tags).includes(UNSUBSCRIBED_TAG);

/** The tags with UNSUBSCRIBED_TAG added, in the same representation as the input. */
export function withUnsubscribedTag(tags: unknown): string[] | string {
  const next = parseTags(tags);
  if (!next.includes(UNSUBSCRIBED_TAG)) next.push(UNSUBSCRIBED_TAG);
  return Array.isArray(tags) ? next : JSON.stringify(next);
}

/** For logs: first character, ***, and the domain. Never the full address. */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf('@');
  if (at < 1) return '***';
  return `${email[0]}***${email.slice(at)}`;
}

/** Tags every contact with this exact (already normalised) email. Deletes nothing. */
export async function markUnsubscribed(email: string): Promise<number> {
  const contacts = await prisma.marketingContact.findMany({
    where: { email },
    select: { id: true, tags: true },
  });
  let tagged = 0;
  for (const c of contacts) {
    if (isUnsubscribed(c.tags)) continue;
    await prisma.marketingContact.update({
      where: { id: c.id },
      // The generated type is string (dev) or string[] (prod); the helper
      // returns whichever shape it was given.
      data: { tags: withUnsubscribedTag(c.tags) as never },
    });
    tagged++;
  }
  return tagged;
}

/**
 * Unique contacts across the campaign's groups, minus anyone tagged
 * unsubscribed (the CASL grace path in /api/unsubscribe). Skipped for every
 * channel: an unsubscribe covers email and SMS alike.
 */
export function selectRecipients(
  groups: { group: { contacts: { id: string; email: string | null; phone: string | null; tags?: unknown }[] } }[],
): { id: string; email: string | null; phone: string | null }[] {
  const contactMap = new Map<string, { id: string; email: string | null; phone: string | null }>();
  for (const cg of groups) {
    for (const contact of cg.group.contacts) {
      if (isUnsubscribed(contact.tags)) continue;
      contactMap.set(contact.id, contact);
    }
  }
  return Array.from(contactMap.values());
}
