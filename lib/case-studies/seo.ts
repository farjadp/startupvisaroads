// ============================================================================
// lib/case-studies/seo.ts
// Canonical, hreflang and JSON-LD for the Case Studies pages (spec §9).
//
// - hreflang en/fa/x-default only when both rows of a group are published;
//   a lone case is canonical-only, so it never advertises a twin that 301s.
// - JSON-LD is `Article` (schema.org has no LegalCase) whose `about` is the
//   decision as a CreativeWork: name = neutral citation, url = official copy.
// - Builders take an explicit, narrow input. They never spread a database
//   row, so a party name cannot reach structured data even if a row carried
//   one (the unit test feeds one in to prove it).
// ============================================================================
import type { Metadata } from 'next';
import { ORGANIZATION_ID, SITE_URL, WEBSITE_ID, breadcrumbJsonLd, isReviewed, reviewedPageJsonLd, schemaLanguage, stripHtml } from '@/lib/seo';

export type CaseLocale = 'en' | 'fa';

export const CASE_INDEX_PATH = '/case-studies';

export const caseIndexUrl = (locale: CaseLocale) => `${SITE_URL}/${locale}${CASE_INDEX_PATH}`;
export const caseUrl = (locale: CaseLocale, slug: string) => `${SITE_URL}/${locale}${CASE_INDEX_PATH}/${slug}`;

/** One published row of a group, as returned by getPair(). */
export type PairRow = { locale: CaseLocale; slug: string };

/** hreflang languages for a group, or null unless both locales are published. */
export function pairLanguages(pair: PairRow[]): Record<string, string> | null {
  const en = pair.find((p) => p.locale === 'en');
  const fa = pair.find((p) => p.locale === 'fa');
  if (!en || !fa) return null;
  const enUrl = caseUrl('en', en.slug);
  return { en: enUrl, fa: caseUrl('fa', fa.slug), 'x-default': enUrl };
}

/** Canonical + alternates for a case page. */
export function caseAlternates(locale: CaseLocale, slug: string, pair: PairRow[]): NonNullable<Metadata['alternates']> {
  const canonical = caseUrl(locale, slug);
  const languages = pairLanguages(pair);
  return languages ? { canonical, languages } : { canonical };
}

/**
 * Canonical + alternates for the index. Filtered views pass through here too:
 * their canonical is the unfiltered index (the page sets noindex).
 */
export function indexAlternates(locale: CaseLocale, publishedLocales: CaseLocale[]): NonNullable<Metadata['alternates']> {
  const canonical = caseIndexUrl(locale);
  if (!publishedLocales.includes('en') || !publishedLocales.includes('fa')) return { canonical };
  return {
    canonical,
    languages: { en: caseIndexUrl('en'), fa: caseIndexUrl('fa'), 'x-default': caseIndexUrl('en') },
  };
}

export type CaseJsonLdInput = {
  locale: CaseLocale;
  slug: string;
  title: string;
  description: string;
  citation: string | null;
  officialUrl: string | null;
  decisionDate: Date | null;
  court: string | null;
  publishedAt: Date;
  updatedAt: Date;
};

/** Pick only the fields structured data may carry. Accepts a wider object on purpose. */
export function jsonLdInputFrom(row: CaseJsonLdInput & Record<string, unknown>): CaseJsonLdInput {
  return {
    locale: row.locale,
    slug: row.slug,
    title: row.title,
    description: row.description,
    citation: row.citation,
    officialUrl: row.officialUrl,
    decisionDate: row.decisionDate,
    court: row.court,
    publishedAt: row.publishedAt,
    updatedAt: row.updatedAt,
  };
}

const iso = (d: Date) => d.toISOString();
const isoDay = (d: Date) => d.toISOString().slice(0, 10);

export function caseArticleJsonLd(input: CaseJsonLdInput) {
  const a = jsonLdInputFrom(input as CaseJsonLdInput & Record<string, unknown>);
  const url = caseUrl(a.locale, a.slug);
  const about = a.citation
    ? {
        '@type': 'CreativeWork',
        name: a.citation,
        ...(a.officialUrl ? { url: a.officialUrl } : {}),
        ...(a.decisionDate ? { dateCreated: isoDay(a.decisionDate) } : {}),
        ...(a.court ? { creator: { '@type': 'GovernmentOrganization', name: a.court } } : {}),
      }
    : null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: a.title,
    description: stripHtml(a.description),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${url}#webpage` },
    inLanguage: schemaLanguage(a.locale),
    datePublished: iso(a.publishedAt),
    dateModified: iso(a.updatedAt),
    ...(about ? { about } : {}),
    ...(a.officialUrl ? { citation: a.officialUrl } : {}),
    isPartOf: { '@id': WEBSITE_ID },
    author: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#editorial-team-${a.locale}`,
      name: a.locale === 'fa' ? 'تیم تحریریه ویزا رودز' : 'VisaRoads Editorial Team',
      url: caseIndexUrl(a.locale),
    },
    publisher: { '@id': ORGANIZATION_ID },
  };
}

/** The WebPage node carrying `reviewedBy`, once the review lag has passed (as lib/seo.ts does for articles). */
export function caseReviewedPageJsonLd(locale: CaseLocale, slug: string, publishedAt: Date, now: Date = new Date()) {
  return isReviewed(publishedAt, now) ? reviewedPageJsonLd(caseUrl(locale, slug), locale) : null;
}

export function caseBreadcrumbJsonLd(locale: CaseLocale, slug: string | null, title: string | null) {
  const items = [
    { name: locale === 'fa' ? 'خانه' : 'Home', url: `${SITE_URL}/${locale}` },
    { name: locale === 'fa' ? 'پرونده‌ها' : 'Case studies', url: caseIndexUrl(locale) },
  ];
  if (slug && title) items.push({ name: title, url: caseUrl(locale, slug) });
  return breadcrumbJsonLd(items);
}
