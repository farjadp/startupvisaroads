// Every v2 route, in one list (spec 2026-10-15 §8). Each region lives in its
// own file, written from the official-source research of 15 Oct 2026.
import { ROUTES_CANADA_US } from './canada-us';
import { ROUTES_EUROPE } from './europe';
import { ROUTES_TR_IL_AE } from './tr-il-ae';
import { ROUTES_AU } from './au';
import { ROUTES_AT } from './at';
import { ROUTES_NO } from './no';
import { ROUTES_IE } from './ie';
import { ROUTES_SE } from './se';
import type { RouteV2, V2Country, V2Family } from './types';

export type { RouteV2, V2Country, V2Family } from './types';

export const ROUTES_V2: RouteV2[] = [
  ...ROUTES_CANADA_US,
  ...ROUTES_EUROPE,
  ...ROUTES_TR_IL_AE,
  // Added 27 Oct 2026 (spec 2026-10-27-app-content-v3).
  ...ROUTES_AU,
  ...ROUTES_AT,
  ...ROUTES_NO,
  ...ROUTES_IE,
  ...ROUTES_SE,
];

const BY_KEY = new Map(ROUTES_V2.map((r) => [r.key, r]));

export const routeV2 = (key: string): RouteV2 | undefined => BY_KEY.get(key);

export const routesOf = (country: V2Country, family?: V2Family): RouteV2[] =>
  ROUTES_V2.filter((r) => r.country === country && (!family || r.family === family));
