// ============================================================================
// lib/pricing/json-ld.ts
// Structured data for /pricing: the page, one Service per route group that a
// reader can actually see with a number (active, priced, and legally
// reviewed where that is required), each with an Offer whose
// priceSpecification.minPrice is the "starting from" amount; the FAQ; the
// breadcrumb. Always resolved as production (showDrafts false), so a TBD or
// an unreviewed Canada card never reaches the schema, in dev either.
// ============================================================================
import { ORGANIZATION_ID, SITE_URL, breadcrumbJsonLd, faqJsonLd, schemaLanguage, webPageJsonLd } from '@/lib/seo';
import { resolveCopy, resolveGroups } from './resolve';
import type { PricingDoc, PricingLocale } from './types';

export function pricingJsonLd(doc: PricingDoc, locale: PricingLocale, meta: { title: string; description: string }) {
  const url = `${SITE_URL}/${locale}/pricing`;
  const live = { showDrafts: false };
  const groups = resolveGroups(doc, locale, live).filter((g) => g.status === 'active' && g.price);
  const copy = resolveCopy(doc.copy[locale], locale, live);

  const services = groups.map((g) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#${g.key}`,
    name: g.title,
    ...(g.summary ? { description: g.summary } : {}),
    serviceType: locale === 'fa' ? 'منتورینگ بیزنس و آماده‌سازی تیم' : 'Business mentoring and team preparation',
    provider: { '@id': ORGANIZATION_ID },
    inLanguage: schemaLanguage(locale),
    url: `${url}#${g.key}`,
    offers: {
      '@type': 'Offer',
      url: g.ctaHref ?? url,
      priceCurrency: g.price!.currency,
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: g.price!.amount,
        priceCurrency: g.price!.currency,
      },
    },
  }));

  return [
    webPageJsonLd({ url, title: meta.title, description: meta.description, locale }),
    ...services,
    faqJsonLd(copy.faq.items.map((f) => ({ question: f.q, answer: f.a })), locale),
    breadcrumbJsonLd([
      { name: 'VisaRoads', url: `${SITE_URL}/${locale}` },
      { name: meta.title, url },
    ]),
  ].filter(Boolean);
}
