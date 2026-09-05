import { describe, it, expect } from 'vitest';
import { faqJsonLd } from '../content';

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
