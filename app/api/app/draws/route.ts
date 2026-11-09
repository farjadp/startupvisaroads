// ============================================================================
// GET /api/app/draws
//
// The newest 10 Express Entry rounds for the mobile app, read server-side
// from IRCC's own rounds JSON and cached 6 h. Public, CORS `*`. On upstream
// failure answers 502 with { error } — never stale or invented figures.
//
// Shape: { source, fetchedAt, rounds: [{ drawNumber, date, roundType,
//          program, crsCutoff, invitations }] }   (lib/app-api/draws.ts)
// ============================================================================
import { NextResponse } from 'next/server';
import { IRCC_ROUNDS_PAGE, IRCC_ROUNDS_URL, parseIrccRounds, type DrawsResponse } from '@/lib/app-api/draws';

export const revalidate = 21600;

const UPSTREAM_TIMEOUT_MS = 15_000;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Accept, If-None-Match',
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: { ...CORS_HEADERS, 'Access-Control-Max-Age': '86400' } });
}

export async function GET() {
  try {
    const res = await fetch(IRCC_ROUNDS_URL, {
      headers: { Accept: 'application/json' },
      next: { revalidate },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`IRCC answered HTTP ${res.status}`);

    const body: DrawsResponse = {
      source: IRCC_ROUNDS_PAGE,
      fetchedAt: new Date().toISOString(),
      rounds: parseIrccRounds(await res.json()),
    };
    if (body.rounds.length === 0) throw new Error('IRCC payload had no readable rounds');

    return NextResponse.json(body, {
      headers: { ...CORS_HEADERS, 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`app/draws: upstream failure — ${message}`);
    return NextResponse.json(
      { error: 'Express Entry rounds are unavailable from IRCC right now' },
      { status: 502, headers: { ...CORS_HEADERS, 'Cache-Control': 'no-store' } },
    );
  }
}
