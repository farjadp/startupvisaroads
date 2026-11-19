// ============================================================================
// lib/partners-json-ld.ts
// Structured data for /partners: the page, the B2B service it offers, its
// FAQ and the breadcrumb. The Service is provided by the site-wide
// Organization node, so answer engines tie "VisaRoads partner programme" to
// the same entity as the rest of the site. No price, rating or review: the
// site publishes none.
// ============================================================================

import { partnerCopy } from '@/content/partners';
import {
  ORGANIZATION_ID,
  SITE_URL,
  breadcrumbJsonLd,
  faqJsonLd,
  schemaLanguage,
  webPageJsonLd,
} from '@/lib/seo';

export function partnersJsonLd(locale: string, meta: { title: string; description: string }) {
  const copy = partnerCopy(locale);
  const lang = locale === 'fa' ? 'fa' : 'en';
  const url = `${SITE_URL}/${lang}/partners`;
  const home = `${SITE_URL}/${lang}`;

  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: meta.title,
    description: meta.description,
    serviceType: lang === 'fa' ? 'بیزینس‌پلن و منتورشیپ برای پرونده‌های استارتاپ ویزا' : 'Business plans and founder mentorship for startup visa files',
    url,
    inLanguage: schemaLanguage(lang),
    provider: { '@id': ORGANIZATION_ID },
    audience: {
      '@type': 'BusinessAudience',
      audienceType: lang === 'fa' ? 'مشاوران رسمی، وکلا و مؤسسات مهاجرت' : 'Regulated Canadian immigration consultants (RCICs) and immigration lawyers',
    },
    areaServed: copy.routes.items.map((r) => ({ '@type': 'Place', name: r.name })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: copy.build.title,
      itemListElement: copy.scope.do.items.map((item) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: item },
      })),
    },
  };

  return [
    { ...webPageJsonLd({ url, title: meta.title, description: meta.description, locale: lang }), mainEntity: { '@id': `${url}#service` } },
    service,
    faqJsonLd(copy.faq.items.map((f) => ({ question: f.q, answer: f.a })), lang),
    breadcrumbJsonLd([
      { name: 'VisaRoads', url: home },
      { name: meta.title, url },
    ]),
  ];
}
