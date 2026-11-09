// ============================================================================
// lib/signed-links.ts
// HMAC-signed values for links we put in marketing email, and the redirect
// allowlist for the click tracker.
//
// Two problems this closes:
//  - /api/unsubscribe deleted any contact by email with no proof the caller
//    owns the address. Links now carry token = HMAC(email); the route refuses
//    a request without a valid one.
//  - /api/marketing/track/click redirected to any `url`, an open redirect on
//    visaroads.com. It now goes only to our own hosts, or to a URL the sender
//    signed when it rewrote a campaign link (sig = HMAC(url)).
//
// Key: LINK_SIGNING_SECRET if set, otherwise JWT_SECRET (always set in prod,
// the admin login cannot work without it). Each use is domain-separated by a
// purpose prefix, so a value signed for one purpose never verifies for
// another, and neither can be mistaken for a JWT signature. Rotating the key
// invalidates every unsubscribe and external click link already sent.
// Fails closed: no usable key means signing throws and verifying is false.
// ============================================================================

import { createHmac, timingSafeEqual } from 'crypto';
import { SITE_URL } from '@/lib/seo';

type Purpose = 'unsubscribe' | 'click';

function signingKey(): string {
  const key = process.env.LINK_SIGNING_SECRET || process.env.JWT_SECRET;
  if (!key || key.length < 16) {
    throw new Error('LINK_SIGNING_SECRET / JWT_SECRET is not set or is too weak (minimum 16 characters).');
  }
  return key;
}

function sign(purpose: Purpose, value: string): string {
  return createHmac('sha256', signingKey()).update(`visaroads:${purpose}:v1:${value}`).digest('base64url');
}

function verify(purpose: Purpose, value: string, given: unknown): boolean {
  if (typeof given !== 'string' || !given) return false;
  try {
    const expected = Buffer.from(sign(purpose, value));
    const actual = Buffer.from(given);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

/** Throws if links cannot be signed — call before sending a campaign. */
export function assertLinkSigningConfigured(): void {
  signingKey();
}

export const normaliseEmail = (email: string): string => email.trim().toLowerCase();

export const unsubscribeToken = (email: string): string => sign('unsubscribe', normaliseEmail(email));

export const verifyUnsubscribeToken = (email: string, token: unknown): boolean =>
  verify('unsubscribe', normaliseEmail(email), token);

/** The unsubscribe link for one recipient: base + email + token. */
export function buildUnsubscribeUrl(base: string, email: string): string {
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}email=${encodeURIComponent(email)}&token=${encodeURIComponent(unsubscribeToken(email))}`;
}

export const clickSignature = (url: string): string => sign('click', url);

const siteOrigin = (): URL => new URL(SITE_URL);

/** visaroads.com, any subdomain of it, and the configured SITE_URL host. */
export function isOwnHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  return host === 'visaroads.com' || host.endsWith('.visaroads.com') || host === siteOrigin().hostname.toLowerCase();
}

/**
 * Where the click tracker may send the browser. Relative paths resolve
 * against SITE_URL (not the request URL, which carries Cloud Run's internal
 * host). Allowed: http(s) on our own hosts, or any http(s) URL carrying a
 * valid signature. Anything else returns null.
 */
export function resolveClickTarget(raw: string, sig: unknown): URL | null {
  let target: URL;
  try {
    target = new URL(raw, siteOrigin());
  } catch {
    return null;
  }
  if (target.protocol !== 'https:' && target.protocol !== 'http:') return null;
  if (isOwnHost(target.hostname)) return target;
  return verify('click', raw, sig) ? target : null;
}

export const siteHome = (): URL => new URL('/', siteOrigin());
