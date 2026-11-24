// ============================================================================
// lib/pricing/json-ld.ts
// Structured data for /pricing: the page, one Service per route group that a
// reader can actually see with a number (active, priced, and legally
// reviewed where that is required), with one Offer per price line (the
// fixed fee: per family, per team, per province …); the FAQ; the
// breadcrumb. Always resolved as production (showDrafts false), so TBD text
// or a gated card never reaches the schema, in dev either.
// ============================================================================
import { ORGANIZATION_ID, SITE_URL, breadcrumbJsonLd, faqJsonLd, schemaLanguage, webPageJsonLd } from '@/lib/seo';
import { resolveCopy, resolveGroups } from './resolve';
import type { PricingDoc, PricingLocale } from './types';

export function pricingJsonLd(doc: PricingDoc, locale: PricingLocale, meta: { title: string; description: string }) {
  const url = `${SITE_URL}/${locale}/pricing`;
  const live = { showDrafts: false };
  const groups = resolveGroups(doc, locale, live).filter((g) => g.status === 'active' && g.prices.some((p) => p.amount));
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
    offers: g.prices
      .filter((p) => p.amount)
      .map((p) => ({
        '@type': 'Offer',
        name: p.label,
        url: g.ctaHref ?? url,
        price: p.amount,
        priceCurrency: g.currency,
        priceSpecification: { '@type': 'PriceSpecification', price: p.amount, priceCurrency: g.currency },
      })),
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
