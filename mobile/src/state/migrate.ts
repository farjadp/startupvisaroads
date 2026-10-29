// Stored-state migrations. Pure (no React Native), so node:test runs it.
// v1 → v2 (27 Oct 2026): the nine v1 roads retire; followed roads and opened
// sources move to their v2 route keys (lib/routes-v2). Everything else is kept
// as stored, including the v1 pathfinder answers, so no user data is lost.

/** Each v1 road and the v2 route it became (checked against lib/routes-v2 and its STABLE list in routes-v2.test.ts). */
export const V1_TO_V2: Record<string, string> = {
  'nova-scotia': 'ca-pnp-nova-scotia',
  'new-brunswick': 'ca-pnp-new-brunswick',
  denmark: 'dk-startup',
  finland: 'fi-startup',
  estonia: 'ee-startup',
  netherlands: 'nl-startup',
  italy: 'it-startup',
  turkey: 'tr-tech-visa',
  eb2niw: 'us-eb2-niw',
};

/** A v1 key becomes its v2 key; anything else (already v2) passes through. Duplicates collapse, order kept. */
export function toV2Keys(keys: unknown): string[] {
  if (!Array.isArray(keys)) return [];
  const out: string[] = [];
  for (const k of keys) {
    if (typeof k !== 'string') continue;
    const v2 = V1_TO_V2[k] ?? k;
    if (!out.includes(v2)) out.push(v2);
  }
  return out;
}

export type StoredVersion = 1 | 2;

/** Brings a parsed blob up to v2; null when it is not ours. Never drops a field it does not know. */
export function migrate<S extends { v: StoredVersion; following: string[]; sourcesOpened: string[] }>(parsed: unknown): S | null {
  if (!parsed || typeof parsed !== 'object') return null;
  const p = parsed as Record<string, unknown>;
  if (p.v === 2) return p as S;
  if (p.v !== 1) return null;
  return { ...p, v: 2, following: toV2Keys(p.following), sourcesOpened: toV2Keys(p.sourcesOpened) } as unknown as S;
}
