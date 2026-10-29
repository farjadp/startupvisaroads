// ============================================================================
// English metadata and structured-data facts for /en/europe/bulgaria, shared
// by page.tsx (generateMetadata), layout.tsx (WebPage + BreadcrumbList) and
// BulgariaEn.tsx (byline, sources list). Kept here rather than in
// lib/pageMeta.ts until the English page is wired into the shared tables.
// Keep UPDATED in step with `updated` in content/fa/europe-bulgaria.ts.
// ============================================================================

export const PATH = '/europe/bulgaria';

export const EN_META = {
  // 56 characters, brandless (buildMetadata adds the brand only if it fits).
  title: 'Bulgaria Startup Visa 2026: 8 of 14 Points, €1,860 Funds',
  // 149 characters.
  description:
    'Bulgaria startup visa 2026: six criteria, 8 of 14 points to pass, €1,860.60 in funds, a free 30-day review, then the D visa and the 50% company rule.',
  image: '/fa/img/bulgaria.webp',
};

export const UPDATED = { iso: '2026-10-29', label: '29 Oct 2026' };

/**
 * The official pages the figures were checked against: the ones named in the
 * header of content/fa/europe-bulgaria.ts (the Ordinance, the Foreigners Act,
 * MIG's NIMS guidelines, the 2026 minimum wage), with the URLs MIG itself links
 * to. Each URL returned 200 on 29 Oct 2026.
 */
export const SOURCES = [
  {
    name: 'MIG — Issuance of a certificate for a high-tech and/or innovative project (Startup Visa), service 3263',
    href: 'https://www.mig.government.bg/3263-issuance-of-a-sertificate-for-a-high-tech-and-or-innovative-project-startup-visa/?lang=en',
    what: 'The service itself: 30 days, free of charge, one-year certificate, filed through NIMS, startupvisa@mig.gov.bg.',
  },
  {
    name: 'MIG — The Ministry of Innovation and Growth will issue Startup Visa for high-tech and innovative projects',
    href: 'https://www.mig.government.bg/upcoming-events/the-ministry-of-innovation-and-growth-will-issue-startup-visa-for-high-tech-and-innovative-projects/?lang=en',
    what: 'The six criteria and their points, 8 of 14 to pass, the two-year extension, and that the certificate alone does not allow relocation.',
  },
  {
    name: 'Ordinance on the terms and conditions for issuing, extending and revoking a Startup Visa certificate (Council of Ministers Decree No. 318 of 7 Oct 2022), English text',
    href: 'https://www.mig.government.bg/wp-content/uploads/2022/11/ordinance-on-the-terms-and-conditions-for-issuing.docx',
    what: 'Articles 4, 6, 7, 9, 10, 12, 13, 14 and 15, and the definition of an innovative project.',
  },
  {
    name: 'Foreigners in the Republic of Bulgaria Act, English text published by MIG',
    href: 'https://www.mig.government.bg/wp-content/uploads/2022/11/foreigners_in_the_republic_of_bulgaria_act.pdf',
    what: 'Article 24p (D visa, certificate, then at least 50% of a Bulgarian company) and Article 25 (permanent residence after five years).',
  },
  {
    name: 'MIG — Guidelines on how to complete the online application form',
    href: 'https://www.mig.government.bg/wp-content/uploads/2022/11/guidelines-on-how-to-complete-the-online-application-form-2.docx',
    what: 'The qualified electronic signature as a detached .p7s file, the 0.00 budget, the 12-month period and the list of attachments.',
  },
  {
    name: 'NIMS (ISUN 2020) — the application portal',
    href: 'https://enims.egov.bg/en',
    what: 'Where the application is filed.',
  },
  {
    name: 'BTA — Cabinet raises minimum wage by 12.6% to EUR 620.20 from January 1, 2026',
    href: 'https://www.bta.bg/en/news/bulgaria/1007805',
    what: 'The 2026 monthly minimum wage behind the €1,860.60 proof of funds.',
  },
];

export const FACTS = {
  dateModified: UPDATED.iso,
  citation: SOURCES.map((s) => s.href),
};
