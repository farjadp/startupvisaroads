// Route depth (steps, documents, funds, realities, timeline, quiz, media) and
// country profiles, one file per country (spec 2026-10-27). Research notes and
// every conflict with the notebooks: docs/research/app-v3/<cc>.md.
import type { CountryProfile, RouteExtras } from '../extras-types';
import type { V2Country } from '../types';
import { EXTRAS_AE, PROFILE_AE } from './ae';
import { EXTRAS_AT, PROFILE_AT } from './at';
import { EXTRAS_AU, PROFILE_AU } from './au';
import { EXTRAS_CA, PROFILE_CA } from './ca';
import { EXTRAS_DK, PROFILE_DK } from './dk';
import { EXTRAS_EE, PROFILE_EE } from './ee';
import { EXTRAS_FI, PROFILE_FI } from './fi';
import { EXTRAS_IE, PROFILE_IE } from './ie';
import { EXTRAS_IL, PROFILE_IL } from './il';
import { EXTRAS_IT, PROFILE_IT } from './it';
import { EXTRAS_NL, PROFILE_NL } from './nl';
import { EXTRAS_NO, PROFILE_NO } from './no';
import { EXTRAS_SE, PROFILE_SE } from './se';
import { EXTRAS_TR, PROFILE_TR } from './tr';
import { EXTRAS_US, PROFILE_US } from './us';

export type { CountryProfile, RouteExtras } from '../extras-types';

const EXTRAS: Record<string, RouteExtras> = {
  ...EXTRAS_CA,
  ...EXTRAS_US,
  ...EXTRAS_DK,
  ...EXTRAS_FI,
  ...EXTRAS_EE,
  ...EXTRAS_NL,
  ...EXTRAS_IT,
  ...EXTRAS_TR,
  ...EXTRAS_IL,
  ...EXTRAS_AE,
  ...EXTRAS_AU,
  ...EXTRAS_AT,
  ...EXTRAS_NO,
  ...EXTRAS_IE,
  ...EXTRAS_SE,
};

export const PROFILES: Record<V2Country, CountryProfile> = {
  CA: PROFILE_CA,
  US: PROFILE_US,
  DK: PROFILE_DK,
  FI: PROFILE_FI,
  EE: PROFILE_EE,
  NL: PROFILE_NL,
  IT: PROFILE_IT,
  TR: PROFILE_TR,
  IL: PROFILE_IL,
  AE: PROFILE_AE,
  AU: PROFILE_AU,
  AT: PROFILE_AT,
  NO: PROFILE_NO,
  IE: PROFILE_IE,
  SE: PROFILE_SE,
};

export const extrasOf = (routeKey: string): RouteExtras | undefined => EXTRAS[routeKey];

/** Every route key that has extras, for content tests. */
export const EXTRAS_KEYS = Object.keys(EXTRAS);
