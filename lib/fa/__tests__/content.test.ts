import { describe, it, expect } from 'vitest';
import { faqJsonLd, faWebPageJsonLd } from '../content';
import { home, TELEGRAM_URL } from '@/content/fa/home';
import { FA_PATHS } from '../paths';
import { WEBSITE_ID } from '../../seo';

describe('Persian home hero', () => {
  it('keeps the assessment and direct conversation easy to reach', () => {
    expect(home.hero.primary.href).toBe('/which-path');
    expect(home.hero.primary.label.length).toBeLessThanOrEqual(30);
    expect(home.hero.secondary.href).toBe(TELEGRAM_URL);
    for (const cta of [home.hero.primary, home.hero.roadmap.cta, ...home.hero.routes]) {
      expect(FA_PATHS).toContain(cta.href);
    }
  });

  it('explains preparation as a sequence with a concrete output at each step', () => {
    expect(home.hero.roadmap.steps).toHaveLength(3);
    for (const step of home.hero.roadmap.steps) {
      expect(step.title.trim().length).toBeGreaterThan(0);
      expect(step.body.trim().length).toBeGreaterThan(0);
      expect(step.output.trim().length).toBeGreaterThan(0);
    }
    expect(FA_PATHS).toContain(home.hero.roadmap.cta.href);
  });

  it('keeps the legal boundary explicit and the lead copy concise', () => {
    expect(home.hero.positioning).toContain('حقوقی مهاجرت');
    expect(home.hero.sub.length).toBeLessThan(280);
  });
});

describe('faWebPageJsonLd', () => {
  it('links Persian pages to the canonical WebSite graph node', () => {
    const page = {
      path: '/faq',
      title: 'پرسش‌های رایج',
      description: 'پاسخ به پرسش‌های رایج',
      keywords: [],
      updated: '2026-09-06',
      image: 'faq',
      hero: { eyebrow: '', headline: '', sub: '', cta: { label: '', href: '/contact' } },
      sections: [],
      faqs: [],
      closing: [],
    };

    expect(faWebPageJsonLd(page).isPartOf).toEqual({ '@id': WEBSITE_ID });
  });
});

describe('faqJsonLd', () => {
  const faqs = [
    { q: 'ویزای استارتاپ کانادا چقدر طول می‌کشد؟', a: 'حدود ۳۷ ماه.' },
    { q: 'آیا نیاز به سرمایه شخصی دارم؟', a: 'بله، برای اثبات تمکن مالی.' },
  ];

  it('emits a FAQPage with one entry per question', () => {
    const ld = faqJsonLd(faqs) as any;
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@type']).toBe('FAQPage');
    expect(ld.mainEntity).toHaveLength(2);
    expect(ld.mainEntity[0].name).toBe(faqs[0].q);
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe(faqs[0].a);
    expect(ld.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
  });

  it('declares the answer language as Persian', () => {
    const ld = faqJsonLd(faqs) as any;
    expect(ld.inLanguage).toBe('fa-IR');
  });

  it('returns no mainEntity for an empty list', () => {
    expect((faqJsonLd([]) as any).mainEntity).toHaveLength(0);
  });
});
