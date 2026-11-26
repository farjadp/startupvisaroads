// GET /api/finder/occupations?q=weld — occupations matching the query (curated
// names in both languages first, then NOC names and codes from Job Bank).
import type { NextRequest } from 'next/server';
import { TABLES } from '@/lib/rcip-finder/core';
import { searchOccupations } from '@/lib/rcip-finder/occupations';
import { json, limited } from '@/lib/rcip-finder/http';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const block = limited(req, 'occ', 120, 60_000);
  if (block) return block;
  const q = (req.nextUrl.searchParams.get('q') ?? '').slice(0, 60);
  return json({ items: searchOccupations(q, TABLES.nocs) });
}
