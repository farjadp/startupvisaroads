// ============================================================================
// Central SEO / AEO / GEO configuration & helpers
// One source of truth for canonical URLs, hreflang alternates, Open Graph,
// Twitter cards and JSON-LD structured data used across the whole site.
// ============================================================================

import type { Metadata } from 'next';
import { FA_PAIRED, EN_TO_FA, isFaPath, type FaPath } from '@/lib/fa/paths';

// Resolution order:
//  1. SITE_URL              — server runtime env (override dynamic routes on
//                             Cloud Run without rebuilding: sitemap, article canonicals)
//  2. NEXT_PUBLIC_SITE_URL  — baked at build (used by statically generated pages)
//  3. brand default
// All consumers of SITE_URL are server-side, so the runtime value is honoured.
export const SITE_URL = (
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'https://visaroads.com'
).replace(/\/$/, '');
export const SITE_NAME = 'Startup Visa Roads';
export const TWITTER_HANDLE = '@ashavidgroup';

// VisaRoads is a product of Ashavid Inc. — these are the official company
// profiles (used for sameAs / knowledge-graph entity linking).
export const ASHAVID = {
  name: 'Ashavid',
  url: 'https://www.ashavid.ca',
  sameAs: [
    'https://www.linkedin.com/company/ashavid/',
    'https://www.instagram.com/ashavidgroup/',
    'https://www.youtube.com/@ashavidgroup',
    'https://x.com/ashavidgroup',
    'https://www.facebook.com/ashavid',
    'https://www.tiktok.com/@ashavidgroup',
  ],
};

export const LOCALES = ['en', 'fa'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export function ogLocale(locale: string): string {
  return locale === 'fa' ? 'fa_IR' : 'en_US';
}

export function schemaLanguage(locale: string): string {
  return locale === 'fa' ? 'fa-IR' : 'en-US';
}

// Dynamically generated branded image (app/[locale]/opengraph-image.tsx).
// Always resolves to a real PNG, so it is safe to reference in OG tags & JSON-LD.
export function defaultOgImage(locale: string): string {
  return `${SITE_URL}/${locale === 'fa' ? 'fa' : DEFAULT_LOCALE}/opengraph-image`;
}

export const DEFAULT_OG_IMAGE = defaultOgImage(DEFAULT_LOCALE);
export const LOGO_URL = `${SITE_URL}/img/VisaRoads-Logo13.png`;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOGO_ID = `${SITE_URL}/#logo`;

export function stripHtml(value: string): string {
  return value
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isDataImageUrl(value: string | null | undefined): boolean {
  return typeof value === 'string' && /^data:image\//i.test(value.trim());
}

export function normalizeSeoImageUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  const image = value.trim();
  if (!image || isDataImageUrl(image) || image.startsWith('//')) return null;
  if (image.startsWith('/')) return `${SITE_URL}${image}`;

  try {
    const url = new URL(image);
    const site = new URL(SITE_URL);
    return url.origin === site.origin || url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

/** Strip the leading locale segment and return a clean path beginning with `/`. */
function normalizePath(path: string): string {
  if (!path || path === '/') return '';
  let p = path.startsWith('/') ? path : `/${path}`;
  p = p.replace(/^\/(en|fa)(?=\/|$)/, '');
  return p === '/' ? '' : p;
}

/**
 * Build canonical + hreflang alternates.
 *
 * `/fa` is not a mirror of `/en`, so an alternate is emitted only when the
 * page genuinely exists in that locale. Advertising a twin that 301s (or
 * 404s) is worse than advertising nothing.
 */
export function selfLocalizedAlternates(path: string, locale: string): Metadata['alternates'] {
  const clean = normalizePath(path);
  const url = `${SITE_URL}/${locale}${clean}`;
  return { canonical: url, languages: { [locale]: url, 'x-default': url } };
}

export function localizedArchiveAlternates(path: string, locale: string, availableLocales: string[]): Metadata['alternates'] {
  const clean = normalizePath(path);
  const canonical = `${SITE_URL}/${locale}${clean}`;
  const locales = Array.from(new Set(availableLocales.filter((item) => LOCALES.includes(item as Locale))));
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((item) => [item, `${SITE_URL}/${item}${clean}`]),
  );
  languages['x-default'] = languages.en ?? languages.fa ?? canonical;
  return { canonical, languages };
}

export function buildAlternates(path: string, locale: string): Metadata['alternates'] {
  const clean = normalizePath(path);
  const isFa = locale === 'fa';

  const faPath = isFa ? (isFaPath(clean) ? clean : null) : (EN_TO_FA.get(clean) ?? null);
  const enPath = isFa ? (FA_PAIRED[clean as FaPath] ?? null) : clean;

  const canonical = `${SITE_URL}/${locale}${clean}`;
  const languages: Record<string, string> = {};
  if (enPath !== null) languages.en = `${SITE_URL}/en${enPath}`;
  if (faPath !== null) languages.fa = `${SITE_URL}/fa${faPath}`;
  if (!languages.en && !languages.fa) languages[locale] = canonical;
  languages['x-default'] = languages.en ?? languages.fa ?? canonical;

  return { canonical, languages };
}

interface PageMetaInput {
  title: string;
  description: string;
  /** Locale-agnostic path, e.g. "/blog/foo" or "/" */
  path: string;
  locale: string;
  image?: string | null;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

/** Build a complete, SEO-rich Metadata object for a page. */
export function buildMetadata(input: PageMetaInput): Metadata {
  const { title, description, path, locale, image, type = 'website', publishedTime, modifiedTime, tags, noindex, nofollow = noindex } = input;
  const clean = normalizePath(path);
  const url = `${SITE_URL}/${locale}${clean}`;
  const cleanDescription = stripHtml(description);
  const ogImage = normalizeSeoImageUrl(image) ?? defaultOgImage(locale);

  return {
    // Absolute title so the layout's "%s | SITE_NAME" template isn't applied
    // twice. Callers pass a brandless title; we append the brand once here.
    title: { absolute: `${title} | ${SITE_NAME}` },
    description: cleanDescription,
    alternates: buildAlternates(path, locale),
    robots: noindex
      ? { index: false, follow: !nofollow }
      : { index: true, follow: !nofollow, googleBot: { index: true, follow: !nofollow, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    openGraph: {
      type,
      url,
      title,
      description: cleanDescription,
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
      ...(type === 'article' && tags ? { tags } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: cleanDescription,
      images: [ogImage],
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
  };
}

// ----------------------------------------------------------------------------
// JSON-LD structured data builders (AEO / GEO — helps Google, Perplexity,
// ChatGPT Search, Gemini parse the page reliably).
// ----------------------------------------------------------------------------

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': LOGO_ID,
      url: LOGO_URL,
      contentUrl: LOGO_URL,
      width: 2000,
      height: 2000,
    },
    description: 'Mentorship and startup readiness for Startup Visa and global migration programs.',
    sameAs: ASHAVID.sameAs,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Toronto',
      addressRegion: 'ON',
      addressCountry: 'CA',
    },
    parentOrganization: {
      '@type': 'Organization',
      name: ASHAVID.name,
      url: ASHAVID.url,
      sameAs: ASHAVID.sameAs,
    },
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: LOCALES.map(schemaLanguage),
    publisher: { '@id': ORGANIZATION_ID },
  };
}

interface WebPageJsonLdInput {
  title: string;
  description: string;
  url: string;
  locale: string;
}

export function webPageJsonLd(page: WebPageJsonLdInput, type: 'WebPage' | 'CollectionPage' = 'WebPage') {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${page.url}#webpage`,
    url: page.url,
    name: page.title,
    description: page.description,
    inLanguage: schemaLanguage(page.locale),
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
  };
}

export function collectionPageJsonLd(page: WebPageJsonLdInput) {
  return webPageJsonLd(page, 'CollectionPage');
}

export function blogJsonLd(page: WebPageJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${page.url}#blog`,
    url: page.url,
    name: page.title,
    description: page.description,
    inLanguage: schemaLanguage(page.locale),
    isPartOf: { '@id': `${page.url}#webpage` },
    publisher: { '@id': ORGANIZATION_ID },
  };
}

interface ArticleJsonLdInput {
  title: string;
  description: string;
  url: string;
  image?: string | null;
  datePublished: string | Date;
  dateModified: string | Date;
  locale: string;
  section?: string;
  tags?: string[];
}

export function articleJsonLd(a: ArticleJsonLdInput) {
  const image = normalizeSeoImageUrl(a.image);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${a.url}#article`,
    headline: a.title,
    description: stripHtml(a.description),
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${a.url}#webpage` },
    url: a.url,
    ...(image ? { image: [image] } : {}),
    datePublished: new Date(a.datePublished).toISOString(),
    dateModified: new Date(a.dateModified).toISOString(),
    inLanguage: schemaLanguage(a.locale),
    ...(a.section ? { articleSection: a.section } : {}),
    ...(a.tags && a.tags.length ? { keywords: a.tags.join(', ') } : {}),
    author: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#editorial-team-${a.locale === 'fa' ? 'fa' : 'en'}`,
      name: a.locale === 'fa' ? 'تیم تحریریه استارتاپ ویزا رودز' : 'Startup Visa Roads Editorial Team',
      url: `${SITE_URL}/${a.locale === 'fa' ? 'fa' : 'en'}/blog`,
    },
    publisher: { '@id': ORGANIZATION_ID },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[], locale: string) {
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: schemaLanguage(locale),
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
