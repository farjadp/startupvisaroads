// ============================================================================
// Express Entry rounds for the app: parsing of IRCC's rounds JSON into the
// shape GET /api/app/draws returns. Pure functions, no I/O.
//
// IRCC publishes every round since 2015 as strings ("1,000", "489"). A round
// whose date, cut-off or size cannot be read is dropped rather than guessed —
// the app shows figures with a source, never an invented one.
// ============================================================================

export const IRCC_ROUNDS_URL = 'https://www.canada.ca/content/dam/ircc/documents/json/ee_rounds_123_en.json';
export const IRCC_ROUNDS_PAGE =
  'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/mandate/policies-operational-instructions-agreements/ministerial-instructions/express-entry-rounds.html';

export const DRAWS_LIMIT = 10;

export type DrawRound = {
  drawNumber: number;
  /** ISO yyyy-mm-dd */
  date: string;
  /** IRCC's round name, e.g. "Provincial Nominee Program", "Canadian Experience Class", "Transport Occupations, 2026-Version 2". */
  roundType: string;
  /** Programs the round invited from, e.g. "Federal Skilled Worker Program, Canadian Experience Class and Federal Skilled Trades Program". */
  program: string;
  crsCutoff: number;
  invitations: number;
};

export type DrawsResponse = {
  source: string;
  fetchedAt: string;
  rounds: DrawRound[];
};

/** "1,000" → 1000, "489" → 489, "" / "n/a" / undefined → null. */
export function parseIrccNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const cleaned = value.trim().replace(/,/g, '');
  if (!/^\d+$/.test(cleaned)) return null;
  return Number(cleaned);
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function toRound(raw: unknown): DrawRound | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const date = text(r.drawDate);
  const drawNumber = parseIrccNumber(r.drawNumber);
  const crsCutoff = parseIrccNumber(r.drawCRS);
  const invitations = parseIrccNumber(r.drawSize);
  if (!ISO_DATE.test(date) || drawNumber === null || crsCutoff === null || invitations === null) return null;
  return {
    drawNumber,
    date,
    roundType: text(r.drawName),
    program: text(r.drawText2),
    crsCutoff,
    invitations,
  };
}

/**
 * The newest `limit` rounds from IRCC's payload, newest first (by date, then
 * draw number). Throws when the payload is not the expected `{ rounds: [] }`
 * so the route answers 502 instead of an empty list.
 */
export function parseIrccRounds(payload: unknown, limit: number = DRAWS_LIMIT): DrawRound[] {
  if (!payload || typeof payload !== 'object' || !Array.isArray((payload as { rounds?: unknown }).rounds)) {
    throw new Error('IRCC rounds payload has no `rounds` array');
  }
  const rounds = (payload as { rounds: unknown[] }).rounds
    .map(toRound)
    .filter((r): r is DrawRound => r !== null)
    .sort((a, b) => (a.date === b.date ? b.drawNumber - a.drawNumber : b.date.localeCompare(a.date)));
  return rounds.slice(0, limit);
}
