// ============================================================================
// Central SEO / AEO / GEO configuration & helpers
// One source of truth for canonical URLs, hreflang alternates, Open Graph,
// Twitter cards and JSON-LD structured data used across the whole site.
// ============================================================================

import type { Metadata } from 'next';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://startupvisaroads.com').replace(/\/$/, '');
export const SITE_NAME = 'Startup Visa Roads';
export const TWITTER_HANDLE = '@startupvisaroads';

export const LOCALES = ['en', 'fa'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export function ogLocale(locale: string): string {
  return locale === 'fa' ? 'fa_IR' : 'en_US';
}

// Dynamically generated branded image (app/[locale]/opengraph-image.tsx).
// Always resolves to a real PNG, so it is safe to reference in OG tags & JSON-LD.
export const DEFAULT_OG_IMAGE = `${SITE_URL}/${DEFAULT_LOCALE}/opengraph-image`;
export const LOGO_URL = DEFAULT_OG_IMAGE;

/** Strip the leading locale segment and return a clean path beginning with `/`. */
function normalizePath(path: string): string {
  if (!path || path === '/') return '';
  let p = path.startsWith('/') ? path : `/${path}`;
  p = p.replace(/^\/(en|fa)(?=\/|$)/, '');
  return p === '/' ? '' : p;
}

/** Build canonical + hreflang alternates for a locale-agnostic path. */
export function buildAlternates(path: string, locale: string): Metadata['alternates'] {
  const clean = normalizePath(path);
  return {
    canonical: `${SITE_URL}/${locale}${clean}`,
    languages: {
      en: `${SITE_URL}/en${clean}`,
      fa: `${SITE_URL}/fa${clean}`,
      'x-default': `${SITE_URL}/en${clean}`,
    },
  };
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
}

/** Build a complete, SEO-rich Metadata object for a page. */
export function buildMetadata(input: PageMetaInput): Metadata {
  const { title, description, path, locale, image, type = 'website', publishedTime, modifiedTime, tags, noindex } = input;
  const clean = normalizePath(path);
  const url = `${SITE_URL}/${locale}${clean}`;
  const ogImage = image || DEFAULT_OG_IMAGE;

  return {
    // Absolute title so the layout's "%s | SITE_NAME" template isn't applied
    // twice. Callers pass a brandless title; we append the brand once here.
    title: { absolute: `${title} | ${SITE_NAME}` },
    description,
    alternates: buildAlternates(path, locale),
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
    openGraph: {
      type,
      url,
      title,
      description,
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
      description,
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
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    description: 'Mentorship and startup readiness for Startup Visa and global migration programs.',
    sameAs: [
      'https://twitter.com/startupvisaroads',
      'https://www.linkedin.com/company/startupvisaroads',
    ],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/en/blog?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
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
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: a.title,
    description: a.description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': a.url },
    url: a.url,
    ...(a.image ? { image: [a.image] } : {}),
    datePublished: new Date(a.datePublished).toISOString(),
    dateModified: new Date(a.dateModified).toISOString(),
    inLanguage: a.locale,
    ...(a.section ? { articleSection: a.section } : {}),
    ...(a.tags && a.tags.length ? { keywords: a.tags.join(', ') } : {}),
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
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

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}
