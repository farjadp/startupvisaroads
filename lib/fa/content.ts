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
  hero: { headline: string; sub: string; cta: FaCta };
  sections: FaSection[];
  faqs: FaFaq[];
  closing: FaCta[];
};

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
