import { describe, expect, it } from 'vitest';
import { PARTNER_COPY, PARTNER_BOOKING_EMBED_URL, PARTNER_BOOKING_URL } from '@/content/partners';
import { partnersJsonLd } from '@/lib/partners-json-ld';
import { metaFor } from '@/lib/pageMeta';
import { FA_PAIRED, isFaPath } from '@/lib/fa/paths';

const ALL_TEXT = (locale: 'en' | 'fa') => JSON.stringify(PARTNER_COPY[locale]);

describe('partner page copy', () => {
  it.each(['en', 'fa'] as const)('%s publishes no VisaRoads price', (locale) => {
    expect(ALL_TEXT(locale)).not.toMatch(/[$€£]\s?\d|\d\s?(USD|EUR|CAD|دلار|یورو)/);
  });

  it.each(['en', 'fa'] as const)('%s cites an official source for every route fact', (locale) => {
    for (const r of PARTNER_COPY[locale].routes.items) {
      expect(r.sourceUrl).toMatch(/^https:\/\/(www\.)?(ind\.nl|migri\.fi|nyidanmark\.dk|vlaanderen\.be)\//);
    }
    expect(PARTNER_COPY[locale].routes.canada.sourceUrl).toMatch(/^https:\/\/www\.canada\.ca\//);
  });

  it.each(['en', 'fa'] as const)('%s says VisaRoads is not an immigration representative', (locale) => {
    const faq = PARTNER_COPY[locale].faq.items[0].a;
    expect(faq).toMatch(locale === 'en' ? /not an immigration representative/ : /نماینده‌ی مهاجرتی نیست/);
  });

  it('keeps Persian prose free of em dashes and Arabic ي/ك', () => {
    expect(ALL_TEXT('fa')).not.toMatch(/[—يك]/);
  });

  it('embeds the booking schedule in its embeddable view and links the full view as a fallback', () => {
    expect(PARTNER_BOOKING_EMBED_URL).toBe(`${PARTNER_BOOKING_URL}?gv=true`);
    expect(PARTNER_BOOKING_URL).toMatch(/^https:\/\/calendar\.google\.com\/calendar\/appointments\/schedules\//);
  });
});

describe('partner page SEO', () => {
  it('is a paired Persian page, so hreflang points both ways', () => {
    expect(isFaPath('/partners')).toBe(true);
    expect(FA_PAIRED['/partners']).toBe('/partners');
  });

  it.each(['en', 'fa'] as const)('%s has its own canonical and both hreflang alternates', (locale) => {
    const meta = metaFor('/partners', locale) as any;
    expect(meta.alternates.canonical).toContain(`/${locale}/partners`);
    expect(Object.keys(meta.alternates.languages)).toEqual(expect.arrayContaining(['en', 'fa']));
  });

  it('emits WebPage, Service, FAQPage and BreadcrumbList with no price or rating', () => {
    const blocks = partnersJsonLd('fa', { title: 't', description: 'd' }) as any[];
    expect(blocks.map((b) => b['@type'])).toEqual(['WebPage', 'Service', 'FAQPage', 'BreadcrumbList']);
    const json = JSON.stringify(blocks);
    expect(json).not.toMatch(/"price"|aggregateRating|"review"/);
    expect(blocks[2].mainEntity).toHaveLength(PARTNER_COPY.fa.faq.items.length);
    expect(blocks[1].url).toMatch(/\/fa\/partners$/);
  });
});
