// The route page's chosen segment, per route, across sessions (spec 2026-11-09
// amendment 3). Kept apart from the main store under its own AsyncStorage key
// so it never touches the versioned state blob.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { parseStored, type RouteTab } from './routeTabParse';

export const ROUTE_TAB_KEY = 'vr.routeTab.v1';

let cache: Record<string, RouteTab> = {};
let loaded = false;
let loading: Promise<void> | null = null;

/** Reads the stored map once per launch. A read error counts as nothing stored. Choices made meanwhile win. */
export function loadRouteTabs(): Promise<void> {
  loading ??= AsyncStorage.getItem(ROUTE_TAB_KEY)
    .then((raw) => parseStored(raw))
    .catch(() => ({}))
    .then((map) => {
      cache = { ...map, ...cache };
      loaded = true;
    });
  return loading;
}

/** The stored tab for a route once the map is read (null: none stored); undefined while still reading. */
export function cachedRouteTab(routeKey: string): RouteTab | null | undefined {
  return loaded ? (cache[routeKey] ?? null) : undefined;
}

/** Remembers the tab; written after the read so nothing stored is overwritten. Best effort: a failed write only loses the memory. */
export function saveRouteTab(routeKey: string, tab: RouteTab): void {
  cache = { ...cache, [routeKey]: tab };
  void loadRouteTabs().then(() => AsyncStorage.setItem(ROUTE_TAB_KEY, JSON.stringify(cache)).catch(() => {}));
}

// Start reading at import so the map is usually there before the first route page opens.
void loadRouteTabs();
