// Indicative conversion to US dollars for the app's Funds tool (Farjad,
// 15 Oct 2026). Official figures stay in their own currency; this only adds
// an "about USD" line under them. Rates are the European Central Bank's euro
// reference rates for one day, fixed here rather than fetched live: a live
// rate would be a new third-party request from the app. Refresh by editing
// FX and shipping an over-the-air update.
export type FxCurrency = 'EUR' | 'USD' | 'CAD' | 'DKK' | 'TRY' | 'ILS' | 'AED' | 'GBP' | 'CNY' | 'INR';

export const FX = {
  /** The ECB reference date these rates are from. */
  date: '2026-10-15',
  source: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html',
  /** Units of each currency per 1 EUR, as published by the ECB. */
  // AED is not an ECB currency: the UAE dirham is pegged at 3.6725 per USD (Central Bank of the UAE).
  perEur: { EUR: 1, USD: 1.1208, CAD: 1.5923, DKK: 7.475, TRY: 55.3873, ILS: 3.4769, AED: 1.1208 * 3.6725, GBP: 0.8461, CNY: 7.4993, INR: 106.5408 } as Record<FxCurrency, number>,
};

/** From US dollars to another currency (the assessment shows its USD bands in the home currency). */
export function fromUsd(usd: number, currency: FxCurrency): number {
  return (usd / FX.perEur.USD) * FX.perEur[currency];
}

/** An exact conversion to US dollars, for comparing a profile against a threshold (never shown). */
export function toUsdExact(amount: number, currency: FxCurrency): number {
  return (amount / FX.perEur[currency]) * FX.perEur.USD;
}

/** An amount in US dollars, rounded to the nearest 10 so it never reads as exact. */
export function toUsd(amount: number, currency: FxCurrency): number {
  const usd = (amount / FX.perEur[currency]) * FX.perEur.USD;
  return Math.round(usd / 10) * 10;
}
