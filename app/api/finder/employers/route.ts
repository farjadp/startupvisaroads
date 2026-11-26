// GET /api/finder/employers?noc=72106&province=ON&page=1&clb=5&exp=3plus
// One page (20) of listed employers ranked by closeness to the occupation.
// Contacts appear only on rows the signed-in visitor has revealed.
import type { NextRequest } from 'next/server';
import { MAX_PAGES, isClb, isExperience, isNoc, profileCheck } from '@/lib/rcip-finder/core';
import { listEmployers } from '@/lib/rcip-finder/service';
import { sessionUserId } from '@/lib/rcip-finder/session';
import { json, limited } from '@/lib/rcip-finder/http';

export const dynamic = 'force-dynamic';
const PROVINCES = new Set(['ON', 'BC', 'SK', 'MB', 'NS', 'AB']);

export async function GET(req: NextRequest) {
  const block = limited(req, 'list', 40, 60_000);
  if (block) return block;
  const sp = req.nextUrl.searchParams;
  const noc = sp.get('noc');
  if (!isNoc(noc)) return json({ error: 'noc must be a five-digit NOC 2021 code' }, 400);
  const province = sp.get('province');
  const page = Math.min(MAX_PAGES, Math.max(1, Number(sp.get('page')) || 1));
  const clbRaw = Number(sp.get('clb'));
  const exp = sp.get('exp');
  try {
    const userId = await sessionUserId(req);
    const result = await listEmployers({ noc, province: province && PROVINCES.has(province) ? province : null, page, userId });
    return json({ check: profileCheck(noc, isClb(clbRaw) ? clbRaw : null, isExperience(exp) ? exp : null), ...result });
  } catch (e) {
    console.error('[finder] employers', e);
    return json({ error: 'unavailable' }, 503);
  }
}
