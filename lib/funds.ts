// Personal funds by country: the one place every figure in the app's Funds
// tool comes from, each with its official source and the date it was
// checked. lib/fa/programmes.ts repeats two of them for the site's
// calculator; mobile/src/content/funds.test.ts fails if they ever disagree.
// Canada's table, source and date stay in lib/canada-suv.ts.
//
// Rules for this file (Brand Book, trust): official government sources only;
// "about" figures stay marked approximate; a figure we could not read on the
// official page ships as unverified, and the app then shows the source link
// instead of the number. Labels are keys, translated in the app.
//
// Checked 15 Oct 2026. Research notes: side-session note
// funds-by-country-2026-10.md (not in the repo).
import type { Currency } from './fa/programmes';

export type FundsCountry = 'CA' | 'DK' | 'FI' | 'EE' | 'NL' | 'IT' | 'TR' | 'US';

/** How a figure is counted. Every line says one of these; nothing is left to read into. */
export type FundsBasis = 'year' | 'month' | 'once' | 'prevYearIncome';

export type FundsLine = {
  /** Label key (funds.lines.<key> in the app). */
  key: string;
  amount: number;
  currency: Currency;
  basis: FundsBasis;
  /** The official page itself says "about". */
  approx?: boolean;
};

export type FundsEntry = {
  /** 'canadaTable': IRCC's settlement funds by family size (lib/canada-suv.ts), plus any lines. */
  kind: 'lines' | 'canadaTable' | 'none';
  lines?: FundsLine[];
  /** What the money must show (funds.show.<key>). */
  show?: string;
  /** One more thing the reader must know (funds.note.<key>). */
  note?: string;
  /** False when the official page could not be read: the app shows the source, not the figure. */
  verified: boolean;
  /** Absent for Canada, whose date and source live with its table in lib/canada-suv.ts. */
  checked?: string;
  sources: string[];
};

export const FUNDS: Record<FundsCountry, FundsEntry> = {
  CA: {
    // IRCC's start-up visa settlement funds by family size, from lib/canada-suv.ts.
    // Provincial net worth (NS, NB) is a different test, checked by a verifier, and
    // stays on those roads' pages: next to settlement funds it would read as one bar.
    kind: 'canadaTable',
    show: 'caUnencumbered',
    verified: true,
    sources: [],
  },
  DK: {
    kind: 'lines',
    // SIRI labels these the "2025 level" on a page updated 29 Jun 2026; re-check in January.
    lines: [
      { key: 'single', amount: 153_240, currency: 'DKK', basis: 'year' },
      { key: 'withSpouse', amount: 306_480, currency: 'DKK', basis: 'year' },
      { key: 'withSpouseChildren', amount: 356_904, currency: 'DKK', basis: 'year' },
      { key: 'withChildrenNoSpouse', amount: 203_664, currency: 'DKK', basis: 'year' },
    ],
    show: 'bankStatement',
    note: 'dkLevel',
    verified: true,
    checked: '2026-10-15',
    sources: ['https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Start-up-Denmark'],
  },
  FI: {
    kind: 'lines',
    // Read only through search results: migri.fi's bot check blocked the page itself.
    // Until someone reads it in a browser, the app shows the source instead of these.
    lines: [
      { key: 'helsinki', amount: 1_210, currency: 'EUR', basis: 'month' },
      { key: 'largeCity', amount: 1_090, currency: 'EUR', basis: 'month' },
      { key: 'otherCity', amount: 1_030, currency: 'EUR', basis: 'month' },
    ],
    show: 'ownAccount',
    note: 'fiYear',
    verified: false,
    checked: '2026-10-15',
    sources: ['https://migri.fi/en/start-up-entrepreneur', 'https://migri.fi/en/working-in-finland/income-requirement'],
  },
  EE: {
    kind: 'lines',
    // Four times the subsistence level, EUR 220 in the 2026 State Budget Act.
    lines: [{ key: 'perPerson', amount: 880, currency: 'EUR', basis: 'month' }],
    show: 'legalIncome',
    note: 'eeSubsistence',
    verified: true,
    checked: '2026-10-15',
    sources: ['https://www.politsei.ee/en/instructions/residence-permit-for-business/for-start-up-entrepreneurs', 'https://www.riigiteataja.ee/akt/118122025022'],
  },
  NL: {
    kind: 'lines',
    // Valid 1 Jul to 31 Dec 2026; IND changes it every 1 January and 1 July.
    lines: [{ key: 'grossPerMonth', amount: 1_766.77, currency: 'EUR', basis: 'month' }],
    show: 'dutchAccount',
    note: 'nlChanges',
    verified: true,
    checked: '2026-10-15',
    sources: ['https://ind.nl/en/required-amounts-income-requirements', 'https://ind.nl/en/residence-permits/work/start-up'],
  },
  IT: {
    kind: 'lines',
    lines: [
      // An income test on the previous year, not savings.
      { key: 'prevYearIncome', amount: 8_500, currency: 'EUR', basis: 'prevYearIncome', approx: true },
      // Project funds for the whole team; the guidelines call it indicative.
      { key: 'projectFunds', amount: 50_000, currency: 'EUR', basis: 'once' },
    ],
    show: 'itIncome',
    verified: true,
    checked: '2026-10-15',
    sources: ['https://italiastartupvisa.mise.gov.it/'],
  },
  TR: {
    kind: 'none',
    note: 'trNone',
    verified: true,
    checked: '2026-10-15',
    sources: ['https://www.turkiyetechvisa.gov.tr/en/start-up'],
  },
  US: {
    kind: 'none',
    note: 'usNone',
    verified: true,
    checked: '2026-10-15',
    sources: ['https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-second-preference-eb-2'],
  },
};

/** A line by key, for the modules that print one figure (lib/fa/programmes.ts). */
export function fundsLine(country: FundsCountry, key: string): FundsLine {
  const line = FUNDS[country].lines?.find((l) => l.key === key);
  if (!line) throw new Error(`No funds line ${country}.${key}`);
  return line;
}
