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

/** Parse a JSON object body; null when it is missing, malformed or not an object. */
export async function readJsonObject(req: NextRequest, max = 20_000): Promise<Record<string, unknown> | null> {
  const raw = await req.text().catch(() => '');
  if (!raw || raw.length > max) return null;
  try {
    const v: unknown = JSON.parse(raw);
    return typeof v === 'object' && v !== null && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
