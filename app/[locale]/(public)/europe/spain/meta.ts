// English <title> and meta description for /en/europe/spain. Kept here (not in
// lib/pageMeta.ts) until the lead wires the page into pageMeta; page.tsx and
// SpainEn.tsx both read these so the metadata and the WebPage node agree.
// Title is brandless (buildMetadata appends the brand only when it fits).
export const SPAIN_EN = {
  path: '/europe/spain',
  title: 'Spain Startup Visa 2026: ENISA, UGE and Real Funds',
  description:
    "Spain's 3-year entrepreneur permit under Law 14/2013: an ENISA report, a UGE decision in 20 days or approval by silence, no minimum investment, family included.",
  image: '/fa/img/spain.webp',
} as const;
