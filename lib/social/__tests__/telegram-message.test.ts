import { describe, it, expect } from 'vitest';
import { articleMessage, shortMessage, CAPTION_LIMIT } from '../telegram-message';

const fa = {
  title: 'اثبات تمکن مالی ویزای استارتاپ با حساب ایرانی',
  locale: 'fa' as const,
  slug: 'startup-visa-settlement-funds-iranian-bank-proof',
  keyTakeaway: 'شرط تمکن مالی را هر مرجع خودش اعلام می‌کند و قابل مذاکره نیست؛ آنچه برای متقاضی ایرانی فرق می‌کند اثبات آن است.',
  excerpt: 'راهنمای عملی برای بنیان‌گذارانی که پس‌اندازشان در ایران است.',
};
const en = {
  title: 'Denmark vs Finland for founding teams',
  locale: 'en' as const,
  slug: 'denmark-vs-finland',
  keyTakeaway: 'Finland requires two founders; Denmark accepts one. That single fact decides the route for most teams.',
  excerpt: 'A side-by-side on the axes that actually separate the two.',
};

describe('articleMessage', () => {
  it('carries the title and the canonical URL', () => {
    const m = articleMessage(fa);
    expect(m).toContain(fa.title);
    expect(m).toContain(`/fa/blog/${fa.slug}`);
    expect(m).toContain('https://');
  });

  it('writes in the article\'s own language, not the channel\'s', () => {
    expect(articleMessage(fa)).toMatch(/[؀-ۿ]/);
    expect(articleMessage(en)).not.toMatch(/[؀-ۿ]/);
  });

  it('stays inside the Telegram caption limit', () => {
    const huge = { ...fa, keyTakeaway: 'ب'.repeat(4000), excerpt: 'ب'.repeat(2000) };
    expect(articleMessage(huge).length).toBeLessThanOrEqual(CAPTION_LIMIT);
  });

  // A truncated link is worse than no framing at all: it is unclickable and
  // the post becomes pointless. Length has to come out of the prose.
  it('never truncates the URL to fit', () => {
    const huge = { ...fa, keyTakeaway: 'ب'.repeat(4000), excerpt: 'ب'.repeat(2000) };
    const m = articleMessage(huge);
    expect(m).toContain(`/fa/blog/${fa.slug}`);
    expect(m.trimEnd().endsWith(fa.slug)).toBe(true);
  });

  // Sent without parse_mode, so markup cannot execute — but a caption that
  // looks like broken markup still reads as a mistake to a human.
  it('emits no markup characters that a reader would take for formatting', () => {
    const m = articleMessage({ ...fa, title: '*bold* _under_ `code` [x](y)' });
    expect(m).not.toMatch(/[*_`]/);
  });

  it('renders Persian digits in Persian prose and keeps programme codes Latin', () => {
    const m = articleMessage({ ...fa, keyTakeaway: 'حداقل ۲ بنیان‌گذار برای EB-2 NIW لازم است.' });
    expect(m).toContain('۲');
    expect(m).toContain('EB-2 NIW');
  });
});

describe('shortMessage', () => {
  it('is materially shorter than the article post', () => {
    expect(shortMessage(fa).length).toBeLessThan(articleMessage(fa).length);
  });

  it('still carries a working link', () => {
    expect(shortMessage(fa)).toContain(`/fa/blog/${fa.slug}`);
  });

  it('leads with the idea rather than the headline, so the channel does not read as a feed', () => {
    const m = shortMessage(fa);
    expect(m.startsWith(fa.title)).toBe(false);
  });

  it('falls back to the excerpt when there is no key takeaway', () => {
    const m = shortMessage({ ...fa, keyTakeaway: null });
    expect(m).toContain(fa.excerpt.slice(0, 20));
  });
});
