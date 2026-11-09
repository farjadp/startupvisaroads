// ============================================================================
// lib/admin-guard.ts
// Authorisation for server actions.
//
// Server actions are reachable by anyone: their IDs ship in the client bundle
// and the middleware matcher does not cover a POST with a `Next-Action`
// header to an arbitrary path. Every admin-only action must therefore check
// the session itself, as its first statement, with `await requireAdmin()`.
//
// The check mirrors `getAdminPayload` in middleware.ts exactly: the
// `admin_session` cookie must verify against JWT_SECRET and carry a
// `username`. It fails closed: a missing cookie, a bad signature, an expired
// token, a missing or weak secret, or any unexpected error all reject.
// ============================================================================

import { cookies } from 'next/headers';
import { getJwtSecret, verifyJWT } from '@/lib/auth';

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
  }
}

export type AdminSession = { username: string; [key: string]: unknown };

/** Returns the verified admin session, or throws UnauthorizedError. */
export async function requireAdmin(): Promise<AdminSession> {
  let payload: unknown = null;
  try {
    const token = (await cookies()).get('admin_session')?.value;
    if (token) {
      payload = await verifyJWT(token, getJwtSecret());
    }
  } catch {
    payload = null;
  }
  if (
    !payload ||
    typeof payload !== 'object' ||
    typeof (payload as { username?: unknown }).username !== 'string' ||
    !(payload as { username: string }).username
  ) {
    throw new UnauthorizedError();
  }
  return payload as AdminSession;
}
