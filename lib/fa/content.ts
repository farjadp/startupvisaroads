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

/**
 * One quotable fact about the programme this page covers. Rendered as a
 * comparison panel and emitted as schema.org PropertyValue, so an answer
 * engine asked "what does the Finland startup permit require" finds a
 * labelled value instead of having to parse prose.
 */
export type FaFact = { label: string; value: string; note?: string };

/** The real-world thing a page is about, for schema.org `about`. */
export type FaEntity = {
  name: string;
  /** The body that evaluates or grants it, e.g. Business Finland. */
  provider?: string;
  /** English country name, for areaServed. */
  country?: string;
  /** GovernmentService for a state programme (default), Service for our own. */
  type?: 'GovernmentService' | 'Service';
};

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
  /** Key of public/fa/img/<key>.webp used in the hero, the mid-page band and OG. */
  image?: string;
  /** Quotable programme facts — shown as a panel, emitted as PropertyValue. */
  facts?: FaFact[];
  /** The programme this page is about, for schema.org `about`. */
  entity?: FaEntity;
  /** Destination keys (lib/fa/geo DESTINATIONS) the roads globe draws to. */
  roads?: string[];
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

import { SITE_URL, SITE_NAME, ASHAVID } from '@/lib/seo';

/** Absolute URL of a page's brand image, for OG and structured data. */
export function faImageUrl(image?: string): string | null {
  return image ? `${SITE_URL}/fa/img/${image}.webp` : null;
}

/**
 * The buildMetadata input for a Persian page. Centralised so every page gets
 * its own OG image — before this, all thirteen shared one generic card.
 */
export function faMeta(page: FaPage, locale: string) {
  return {
    locale,
    path: page.path,
    title: page.title,
    description: page.description,
    modifiedTime: page.updated,
    image: faImageUrl(page.image),
  };
}

/** The Persian service itself: what this business sells, as an entity. */
export function faServiceJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/fa#service`,
    name: 'منتورشیپ استارتاپ ویزا — Startup Visa Roads',
    alternateName: SITE_NAME,
    url: `${SITE_URL}/fa`,
    inLanguage: 'fa-IR',
    description:
      'برنامه‌ی منتورشیپ برای تیم‌های استارتاپی که از مسیر استارتاپ ویزا یا برنامه‌های مهاجرت کارآفرینی مهاجرت می‌کنند: انتخاب مسیر، بیزینس‌پلن، مدل مالی، پیچ‌دک و تمرین مصاحبه. خدمات حقوقی مهاجرت ارائه نمی‌شود.',
    serviceType: 'Startup visa and entrepreneur immigration mentorship',
    provider: { '@type': 'Organization', name: ASHAVID.name, url: ASHAVID.url },
    areaServed: { '@type': 'Country', name: 'Iran' },
    availableLanguage: [{ '@type': 'Language', name: 'Persian', alternateName: 'fa' }],
    knowsAbout: [
      'Startup visa',
      'Finland Startup Permit',
      'Start-up Denmark',
      'Estonia Startup Visa',
      'New Brunswick Business Immigration Stream',
      'Nova Scotia Nominee Program Entrepreneur stream',
      'Canada Start-up Visa',
      'EB-2 National Interest Waiver',
      'Business plan',
      'Financial model',
      'Pitch deck',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'مسیرهایی که برایشان آماده می‌کنیم',
      itemListElement: [
        { path: '/europe/finland', name: 'آماده‌سازی برای ویزای استارتاپ فنلاند' },
        { path: '/europe/denmark', name: 'آماده‌سازی برای Start-up Denmark' },
        { path: '/europe/estonia', name: 'آماده‌سازی برای ویزای استارتاپ استونی' },
        { path: '/pnp/new-brunswick', name: 'آماده‌سازی برای مسیر کارآفرینی نیوبرانزویک' },
        { path: '/pnp/nova-scotia', name: 'آماده‌سازی برای مسیر کارآفرینی نوااسکوشیا' },
        { path: '/usa-eb2-niw', name: 'آماده‌سازی پرونده‌ی EB-2 NIW آمریکا' },
      ].map((o) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: o.name, url: `${SITE_URL}/fa${o.path}` },
      })),
    },
  };
}

/** The routes as an ordered list — helps both rich results and extraction. */
export function faRoutesJsonLd(routes: { name: string; path: string; description: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'مسیرهای استارتاپ ویزا و مهاجرت کارآفرینی',
    inLanguage: 'fa-IR',
    itemListElement: routes.map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: r.name,
      description: r.description,
      url: `${SITE_URL}/fa${r.path}`,
    })),
  };
}

/**
 * WebPage + the programme it is about, with the key facts as PropertyValue.
 * This is the page-level entity record an answer engine reads.
 */
export function faWebPageJsonLd(page: FaPage) {
  const url = `${SITE_URL}/fa${page.path}`;
  const img = faImageUrl(page.image);
  const about = page.entity && {
    '@type': page.entity.type ?? 'GovernmentService',
    name: page.entity.name,
    serviceType: page.entity.type === 'Service' ? 'Startup visa mentorship' : 'Immigration programme',
    ...(page.entity.provider ? { provider: { '@type': 'GovernmentOrganization', name: page.entity.provider } } : {}),
    ...(page.entity.country ? { areaServed: { '@type': 'Country', name: page.entity.country } } : {}),
    ...(page.facts && page.facts.length
      ? {
          additionalProperty: page.facts.map((f) => ({
            '@type': 'PropertyValue',
            name: f.label,
            value: f.value,
            ...(f.note ? { description: f.note } : {}),
          })),
        }
      : {}),
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    name: page.title,
    description: page.description,
    inLanguage: 'fa-IR',
    dateModified: page.updated,
    isPartOf: { '@type': 'WebSite', '@id': `${SITE_URL}#website`, name: SITE_NAME },
    ...(img ? { primaryImageOfPage: { '@type': 'ImageObject', url: img } } : {}),
    ...(about ? { about } : {}),
    provider: { '@type': 'ProfessionalService', '@id': `${SITE_URL}/fa#service` },
  };
}
