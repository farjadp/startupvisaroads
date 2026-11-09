// Pure helpers for the route page's segments (spec 2026-11-09 §3, amendment 3):
// which tab a deep link asks for, what was stored, and which one to show when
// the asked-for tab is not on this route (a closed route has no Do).

export const ROUTE_TABS = ['do', 'rules', 'money', 'after'] as const;
export type RouteTab = (typeof ROUTE_TABS)[number];

/** A tab id from a search param (expo-router may hand an array) or stored JSON; anything else is null. */
export function parseTab(v: unknown): RouteTab | null {
  const s = Array.isArray(v) ? v[0] : v;
  if (typeof s !== 'string') return null;
  const id = s.trim().toLowerCase();
  return (ROUTE_TABS as readonly string[]).includes(id) ? (id as RouteTab) : null;
}

/** The stored map, keeping only valid route keys and tab ids; broken or foreign JSON reads as empty. */
export function parseStored(raw: string | null): Record<string, RouteTab> {
  if (!raw) return {};
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
  const out: Record<string, RouteTab> = {};
  for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
    const tab = parseTab(v);
    if (k && tab) out[k] = tab;
  }
  return out;
}

/** Deep link first, then the tab last chosen on this route, then the first tab the route has. */
export function pickTab({ link, stored, available }: { link: RouteTab | null; stored: RouteTab | null | undefined; available: readonly RouteTab[] }): RouteTab {
  if (link && available.includes(link)) return link;
  if (stored && available.includes(stored)) return stored;
  return available[0] ?? 'rules';
}
