import { describe, it, expect } from 'vitest';
import { extractInsights } from '../insights';

const body = `
<h2>شرایط</h2>
<p>فنلاند دست‌کم <strong>دو بنیان‌گذار</strong> می‌خواهد و دانمارک به یک نفر هم اجازه می‌دهد.</p>
<p>این بند در راهنمای رسمی آمده است.</p>
<h2>هزینه</h2>
<p>تمکن مالی سال اول دانمارک حدود <strong>۱۵۳٬۷۰۰ کرون</strong> است و برای خانواده بیشتر می‌شود.</p>
<ul><li>مورد اول</li></ul>
<p>کوتاه.</p>
<script>ignore()</script>
`;

describe('extractInsights', () => {
  it('takes the sentence around each phrase the writer marked decisive', () => {
    const out = extractInsights(body, 'fa');
    expect(out[0]).toContain('دو بنیان‌گذار');
    expect(out.some((s) => s.includes('۱۵۳٬۷۰۰'))).toBe(true);
  });

  it('returns plain text with no markup left in it', () => {
    for (const s of extractInsights(body, 'fa')) expect(s).not.toMatch(/[<>]/);
  });

  it('drops fragments too short to say anything', () => {
    for (const s of extractInsights(body, 'fa')) expect(s.length).toBeGreaterThan(40);
  });

  it('never returns the same sentence twice', () => {
    const out = extractInsights(body, 'fa');
    expect(new Set(out).size).toBe(out.length);
  });

  it('ignores script and style content', () => {
    expect(extractInsights(body, 'fa').join(' ')).not.toContain('ignore()');
  });

  it('renders Persian digits in Persian prose', () => {
    const out = extractInsights('<p>حداقل <strong>2 بنیان‌گذار</strong> لازم است و این شرط قابل مذاکره نیست.</p>', 'fa');
    expect(out[0]).toContain('۲');
  });

  it('keeps programme codes Latin', () => {
    const out = extractInsights('<p>مسیر <strong>EB-2 NIW</strong> برای پژوهشگران مناسب‌تر است و مدارک متفاوتی می‌خواهد.</p>', 'fa');
    expect(out[0]).toContain('EB-2 NIW');
  });

  // Without a marked phrase there is nothing the writer called decisive, and
  // guessing produces the bland middle of the article — worse than nothing.
  it('returns nothing rather than guessing when no phrase was marked', () => {
    expect(extractInsights('<p>یک پاراگراف کاملاً معمولی بدون هیچ تأکیدی در متن آن.</p>', 'fa')).toEqual([]);
  });

  it('handles an empty body without throwing', () => {
    expect(() => extractInsights('', 'fa')).not.toThrow();
    expect(extractInsights('', 'fa')).toEqual([]);
  });
});
