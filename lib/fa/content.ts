// ============================================================================
// lib/fa/content.ts
// The shape every Persian page module exports.
//
// UI chrome (nav, footer, buttons, form labels) lives in messages/fa.json.
// Page copy lives here, in typed modules under content/fa/, because a 600-line
// marketing page is FAQ arrays and repeated section shapes — that reads as
// TypeScript and does not survive as deep JSON keys.
// ============================================================================

export type FaFaq = { q: string; a: string };

export type FaSection = {
  heading: string;
  /** Paragraphs, in order. Plain text — no HTML. */
  body: string[];
  /** Optional bullet list rendered after the paragraphs. */
  bullets?: string[];
  /** Optional emphasised callout rendered after the bullets — a warning, a rule of thumb. */
  callout?: string;
};

/** A programme-status notice rendered under the hero: closed, paused, or changed. */
export type FaStatus = {
  tone: 'closed' | 'paused' | 'changed';
  title: string;
  body: string;
  cta?: FaCta;
};

export type FaCta = {
  label: string;
  /** Locale-agnostic internal path (must be in FA_PATHS) or an absolute URL. */
  href: string;
};

export type FaPage = {
  /** Locale-agnostic path, must be a member of FA_PATHS. */
  path: string;
  /** <title>, brandless — buildMetadata appends the brand. */
  title: string;
  description: string;
  /** The Persian queries this page is written for. Documentation, not output. */
  keywords: string[];
  hero: { eyebrow: string; headline: string; sub: string; cta: FaCta };
  /** Optional programme-status notice, shown directly under the hero. */
  status?: FaStatus;
  /** ISO date of the last substantive review, shown as Jalali and emitted as dateModified. */
  updated: string;
  sections: FaSection[];
  /** All FAQs on the page, flat — this is what FAQPage JSON-LD is built from. */
  faqs: FaFaq[];
  /**
   * Optional grouping for rendering only. When present, the layout renders
   * these groups instead of the flat list; `faqs` must still contain every
   * question so the structured data stays complete.
   */
  faqGroups?: { heading: string; faqs: FaFaq[] }[];
  closing: FaCta[];
  /** YouTube ids from content/fa/videos.ts to show as a rail after the FAQ. */
  videos?: string[];
};

/** Breadcrumb structured data for a Persian page under the site root. */
export function breadcrumbJsonLd(siteUrl: string, trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${siteUrl}/fa${t.path}`,
    })),
  };
}

/** Persian FAQPage structured data — the AEO/GEO surface for this page. */
export function faqJsonLd(faqs: FaFaq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'fa-IR',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
