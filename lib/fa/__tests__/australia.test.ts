// ============================================================================
// The Australia guide is built against the supplied deck rather than from it,
// and the corrections are the whole value of the page. Each is one edit away
// from being smoothed back out by someone who reads the deck and not the
// invitation rounds, so they are asserted here.
// ============================================================================
import { describe, it, expect } from 'vitest';
import { page } from '@/content/fa/australia';
import { FA_PATHS, FA_PAIRED } from '../paths';
import { RULES } from '../programmes';
import { flagFor } from '../flags';

const prose = () =>
  [
    page.hero.sub,
    page.status?.body ?? '',
    ...page.sections.flatMap((s) => [s.heading, ...s.body, ...(s.bullets ?? []), s.callout ?? '']),
  ].join(' ');

const allText = () => [prose(), ...page.faqs.flatMap((f) => [f.q, f.a])].join(' ');

describe('/fa/australia', () => {
  it('is a real Persian path paired with the English guide', () => {
    expect(FA_PATHS).toContain('/australia');
    expect(page.path).toBe('/australia');
    expect(FA_PAIRED['/australia']).toBe('/country/australia');
  });

  it('says plainly that this is not a startup visa', () => {
    // The single most consequential correction: the deck and every Persian
    // guide sell 858 to early-stage founders, and it is assessed on the
    // individual against an international-eminence standard.
    expect(prose()).toContain('این ویزای استارتاپ نیست');
    expect(allText()).toContain('۱۸۸');
  });

  it('carries the published invitation figures, not just the benefits', () => {
    const t = allText();
    for (const n of ['۲٬۱۶۶', '۲۴۸', '۱٬۸۱۵', '۱۴۶']) {
      expect(t).toContain(n);
    }
  });

  it('flags that Direction 112 was superseded', () => {
    expect(page.status).toBeDefined();
    expect(page.status!.tone).toBe('changed');
    // The Direction numbers are proper names and stay in Latin digits, unlike
    // every other figure on the Persian site.
    expect(page.status!.body).toContain('Direction 120');
    expect(page.status!.body).toContain('Ministerial Direction 112');
  });

  it('corrects the state-nomination advice with the priority breakdown', () => {
    const t = allText();
    expect(t).toContain('۱۹۲'); // Priority 3, April–June 2026
    expect(t).toContain('۱۱۳'); // Priority 3, January–March 2026
    // And says the quiet part: the recommended lane is the narrow one.
    expect(t).toContain('کلید طلایی');
  });

  it('publishes no refund undertaking, and says why', () => {
    for (const heading of page.sections.map((s) => s.heading)) {
      expect(heading).not.toContain('اقساط');
      expect(heading).not.toContain('بازگشت وجه');
    }
    expect(prose()).not.toContain('قسط اول');
    // The reason is the point: no evaluating body exists to undertake against.
    expect(prose()).toContain('تعهد بازگشت وجه');
    expect(allText()).toContain('تضمین دعوت‌نامه');
  });

  it('stays out of the eligibility calculator', () => {
    // The NIV sets no financial threshold at all, and compare.ts sorts an
    // absent threshold as the LOWEST barrier. An entry here would rank the
    // hardest route on the site as the most accessible one.
    expect(RULES.map((r) => r.key)).not.toContain('australia');
    expect(RULES.map((r) => r.href)).not.toContain('/australia');
  });

  it('carries no flag', () => {
    expect(flagFor('/australia')).toBeNull();
  });

  it('sends the reader on to routes inside the Persian site', () => {
    for (const t of page.closing.map((c) => c.href)) {
      if (t.startsWith('/')) expect(FA_PATHS).toContain(t);
    }
  });
});
