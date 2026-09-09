// ============================================================================
// The Israel guide is the one Persian route page that is a reference rather
// than an offer, and the rules that make it safe are easy to undo by accident
// — someone tidying the site "for consistency" would add the instalment
// section every other guide has, or drop the route into the calculator so the
// comparison table looks complete. These tests are the tripwire for that.
// ============================================================================
import { describe, it, expect } from 'vitest';
import { page } from '@/content/fa/israel';
import { FA_PATHS, FA_PAIRED } from '../paths';
import { RULES } from '../programmes';
import { flagFor } from '../flags';

describe('/fa/israel', () => {
  it('is a real Persian path paired with the English guide', () => {
    expect(FA_PATHS).toContain('/israel');
    expect(page.path).toBe('/israel');
    expect(FA_PAIRED['/israel']).toBe('/country/israel');
  });

  it('leads with the access problem instead of burying it', () => {
    expect(page.status).toBeDefined();
    expect(page.status!.tone).toBe('closed');
    // The two halves of the bar: Israel's side and Iran's side.
    expect(page.status!.body).toContain('متخاصم');
    expect(page.status!.body).toContain('گذرنامه‌ی ایرانی');
  });

  it('publishes no instalment structure and no refund undertaking', () => {
    // We cannot deliver this route, so our commercial terms have no business
    // on the page. Selling an undertaking on an unreachable route is the
    // exact behaviour the rest of the site tells readers to walk away from.
    //
    // Asserted on the section headings rather than on the prose: the page
    // does mention both, in the one sentence that says it carries neither,
    // and that sentence is the point rather than a violation.
    for (const heading of page.sections.map((s) => s.heading)) {
      expect(heading).not.toContain('اقساط');
      expect(heading).not.toContain('بازگشت وجه');
    }
    const prose = page.sections.flatMap((s) => [...s.body, ...(s.bullets ?? []), s.callout ?? '']).join(' ');
    expect(prose).toContain('نه ساختار اقساط هست و نه تعهد بازگشت وجه');
    // No instalment is ever tied to an event, which is how the other guides
    // phrase the offer.
    expect(prose).not.toContain('قسط اول');
  });

  it('dates the landing-pad list rather than passing 2017 off as today', () => {
    const prose = page.sections.flatMap((s) => [...s.body, ...(s.bullets ?? []), s.callout ?? '']).join(' ');
    expect(prose).toContain('۲۰۱۷');
    expect(page.faqs.some((f) => f.a.includes('۲۰۱۷'))).toBe(true);
  });

  it('stays out of the eligibility calculator and the comparison table', () => {
    // Both are derived from RULES. An entry there would rank Israel against
    // routes a reader can actually take, and the passport bar is not a
    // threshold an applicant can clear.
    expect(RULES.map((r) => r.key)).not.toContain('israel');
    expect(RULES.map((r) => r.href)).not.toContain('/israel');
  });

  it('carries no flag, because the Star of David geometry is not published', () => {
    expect(flagFor('/israel')).toBeNull();
  });

  it('sends the reader on to routes that are open to them', () => {
    const targets = page.closing.map((c) => c.href);
    expect(targets).toContain('/which-path');
    for (const t of targets) {
      if (t.startsWith('/')) expect(FA_PATHS).toContain(t);
    }
  });
});
