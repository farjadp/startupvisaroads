// Shared bits for the /api/admin/case-studies/** route handlers.
import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import type { Failure } from '@/lib/case-studies/workflow';

/** The signed-in admin's username, or null. Every admin handler calls this first. */
export async function adminUser(req: NextRequest): Promise<string | null> {
  const session: unknown = await getSessionFromRequest(req).catch(() => null);
  if (typeof session !== 'object' || session === null) return null;
  const username = (session as { username?: unknown }).username;
  return typeof username === 'string' && username ? username : null;
}

export const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

export const failure = (f: Failure) => NextResponse.json({ error: f.error, reasons: f.reasons }, { status: f.status });

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/** The host the request was addressed to (Cloud Run keeps Host; a proxy may set x-forwarded-host). */
function requestHost(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  return (fwd || req.headers.get('host') || req.nextUrl.host).toLowerCase();
}

/**
 * CSRF guard for mutating admin requests (security review L1): the body must be
 * declared `application/json` (a cross-site form cannot send that without a
 * preflight), and an `Origin` header, when present, must name this host.
 * Returns the rejection response, or null when the request may proceed.
 */
export function rejectUnsafeMutation(req: NextRequest): NextResponse | null {
  if (SAFE_METHODS.has(req.method.toUpperCase())) return null;
  const origin = req.headers.get('origin');
  if (origin !== null) {
    let originHost = '';
    try {
      originHost = new URL(origin).host.toLowerCase();
    } catch {
      originHost = '';
    }
    if (!originHost || originHost !== requestHost(req)) {
      return NextResponse.json({ error: 'Cross-origin request refused', reasons: [] }, { status: 403 });
    }
  }
  const type = (req.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase();
  if (type !== 'application/json') {
    return NextResponse.json({ error: 'Content-Type must be application/json', reasons: [] }, { status: 415 });
  }
  return null;
}

export type JsonBody = { ok: true; body: Record<string, unknown> | null } | { ok: false; response: NextResponse };

/**
 * Guard the request, then parse a JSON object body. `ok: false` carries a 403/415
 * to return as is; `body` is null when the JSON is missing, malformed or not an object.
 */
export async function readJsonObject(req: NextRequest, max = 20_000): Promise<JsonBody> {
  const rejected = rejectUnsafeMutation(req);
  if (rejected) return { ok: false, response: rejected };
  const raw = await req.text().catch(() => '');
  if (!raw || raw.length > max) return { ok: true, body: null };
  try {
    const v: unknown = JSON.parse(raw);
    return { ok: true, body: typeof v === 'object' && v !== null && !Array.isArray(v) ? (v as Record<string, unknown>) : null };
  } catch {
    return { ok: true, body: null };
  }
}
