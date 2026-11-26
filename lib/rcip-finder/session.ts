// ============================================================================
// lib/rcip-finder/session.ts
// Passwordless sign-in for the RCIP finder: an emailed link carries a
// short-lived signed token; following it sets a session cookie.
//
// Both are HS256 JWTs signed with a key derived from JWT_SECRET plus a
// finder-only suffix, so neither can pass the admin check (which also needs a
// `username` claim) and an admin token cannot pass as a finder one. A link
// can be used more than once within its 30 minutes; that is the trade for
// keeping no token table.
// ============================================================================
import type { NextRequest } from 'next/server';
import { getJwtSecret, signJWT, verifyJWT } from '@/lib/auth';

export const SESSION_COOKIE = 'finder_session';
export const SESSION_DAYS = 90;
const LINK_MINUTES = 30;

const key = () => `${getJwtSecret()}:rcip-finder:v1`;
const now = () => Math.floor(Date.now() / 1000);

export const normaliseEmail = (raw: unknown): string | null => {
  if (typeof raw !== 'string') return null;
  const e = raw.trim().toLowerCase();
  return e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) ? e : null;
};

export async function signLoginToken(email: string, locale: 'en' | 'fa'): Promise<string> {
  return signJWT({ kind: 'finder-login', email, locale, exp: now() + LINK_MINUTES * 60 }, key());
}

export async function readLoginToken(token: string): Promise<{ email: string; locale: 'en' | 'fa' } | null> {
  const p = await verifyJWT(token, key());
  if (!p || p.kind !== 'finder-login' || !normaliseEmail(p.email)) return null;
  return { email: p.email, locale: p.locale === 'fa' ? 'fa' : 'en' };
}

export async function signSession(userId: string): Promise<string> {
  return signJWT({ kind: 'finder-session', sub: userId, exp: now() + SESSION_DAYS * 86_400 }, key());
}

/** The signed-in finder user id, or null. */
export async function sessionUserId(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const p = await verifyJWT(token, key());
  return p?.kind === 'finder-session' && typeof p.sub === 'string' ? p.sub : null;
}

export const sessionCookie = (value: string, maxAge = SESSION_DAYS * 86_400) => ({
  name: SESSION_COOKIE,
  value,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge,
});
