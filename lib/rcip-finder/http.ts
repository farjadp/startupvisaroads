// Small helpers shared by the finder API routes.
import { NextResponse, type NextRequest } from 'next/server';
import { getClientIp, rateLimit } from '@/lib/rateLimit';

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex', ...headers } });

/** Fixed-window limit per client IP (and an optional extra key). null = allowed. */
export function limited(req: NextRequest, name: string, limit: number, windowMs: number, extra = '') {
  const r = rateLimit(`finder:${name}:${getClientIp(req)}${extra ? `:${extra}` : ''}`, limit, windowMs);
  return r.ok ? null : json({ error: 'rate_limited', retryAfter: r.retryAfter }, 429, { 'Retry-After': String(r.retryAfter) });
}

export async function readJson(req: NextRequest, max = 20_000): Promise<Record<string, unknown> | null> {
  const raw = await req.text();
  if (raw.length > max) return null;
  try {
    const v = JSON.parse(raw);
    return v && typeof v === 'object' && !Array.isArray(v) ? v : null;
  } catch {
    return null;
  }
}
