// ============================================================================
// lib/cron-auth.ts
// One authorisation rule for every cron endpoint: a Cloud Scheduler bearer
// token, or a signed-in admin calling it by hand.
//
// It was copied verbatim into each cron route. Three identical copies of an
// auth check is three places to fix when the rule changes and two places to
// forget, so it lives here now and the routes import it.
// ============================================================================
import type { NextRequest } from 'next/server';
import { getSessionFromRequest, safeCompare } from '@/lib/auth';

export async function authorisedCron(req: NextRequest): Promise<boolean> {
  const secret = process.env.CRON_SECRET;
  const header = req.headers.get('authorization') ?? '';
  // safeCompare, not ===, so the comparison does not leak the secret by timing.
  if (secret && header.startsWith('Bearer ') && safeCompare(header.slice(7), secret)) return true;
  const session = await getSessionFromRequest(req).catch(() => null);
  return !!session?.username;
}
