// ============================================================================
// OpenAI Ads (ChatGPT ads) — server-side Conversions API.
// Every lead form's server action calls reportLead() after the lead is
// delivered. The browser pixel fires the same event with the same id (see
// trackLead in lib/analytics.ts); OpenAI dedupes on pixel id + event type + id and keeps
// the first it receives, which is this richer server copy.
//
// Env: NEXT_PUBLIC_OPENAI_PIXEL_ID (shared with the pixel) and
// OPENAI_ADS_CAPI_KEY (runtime secret). Missing key → no-op. Never throws:
// tracking must not fail a lead.
// Docs: https://developers.openai.com/ads/conversions-api
// ============================================================================
import { createHash, randomUUID } from 'crypto';
import { cookies, headers } from 'next/headers';

const sha256 = (v: string) => createHash('sha256').update(v, 'utf8').digest('hex');

// Normalisation rules are OpenAI's: email trimmed + lowercased; phone digits
// only, no leading + or zeros, 8–15 digits; names lowercased, no whitespace
// or ASCII punctuation.
const hashEmail = (e?: string) => {
  const n = (e || '').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(n) ? [sha256(n)] : undefined;
};
const hashPhone = (p?: string) => {
  const n = (p || '').replace(/\D/g, '').replace(/^0+/, '');
  return n.length >= 8 && n.length <= 15 ? [sha256(n)] : undefined;
};
const hashName = (s?: string) => {
  const n = (s || '').toLowerCase().replace(/[\s!-/:-@[-`{-~]/g, '');
  return n ? [sha256(n)] : undefined;
};

export type LeadInput = { email?: string; phone?: string; name?: string };

/** Sends lead_created server-side. Returns the event id for the browser pixel. */
export async function reportLead(input: LeadInput): Promise<string> {
  const eventId = randomUUID();
  const pixelId = process.env.NEXT_PUBLIC_OPENAI_PIXEL_ID;
  const apiKey = process.env.OPENAI_ADS_CAPI_KEY;
  if (!pixelId || !apiKey) return eventId;

  try {
    const h = await headers();
    const c = await cookies();
    const [first, ...rest] = (input.name || '').trim().split(/\s+/);
    const ip = (h.get('x-forwarded-for') || '').split(',')[0].trim() || undefined;
    const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://visaroads.com';
    const sourceUrl = h.get('referer') || site;

    const event = {
      id: eventId,
      type: 'lead_created',
      timestamp_ms: Date.now(),
      source_url: sourceUrl,
      action_source: 'web',
      oppref: c.get('__oppref')?.value || undefined,
      user: {
        emails_sha256: hashEmail(input.email),
        phone_numbers_sha256: hashPhone(input.phone),
        first_names_sha256: hashName(first),
        last_names_sha256: hashName(rest.join('')),
        obref: c.get('__obref')?.value || undefined,
        ip_address: ip,
        user_agent: h.get('user-agent') || undefined,
      },
      data: { type: 'customer_action' },
    };

    const res = await fetch(`https://bzr.openai.com/v1/events?pid=${encodeURIComponent(pixelId)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ integration_source: 'visaroads-web', events: [event] }),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) console.error('openai-ads: CAPI error', res.status, await res.text());
  } catch (err) {
    console.error('openai-ads: CAPI request failed', err);
  }
  return eventId;
}
