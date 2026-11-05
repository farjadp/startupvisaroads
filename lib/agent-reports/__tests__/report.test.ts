import { describe, it, expect } from 'vitest';
import { parseReport, telegramMessage, localNumber, safeUrl, TELEGRAM_LIMIT } from '../report';

const base = { agent: 'market-intel', job: 'scan', title: 'اسکن هفتگی', summary: 'خلاصه' };

describe('parseReport', () => {
  it('accepts a minimal report and fills the lists', () => {
    const r = parseReport(base);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.report).toMatchObject({ agent: 'market-intel', locale: 'fa', metrics: [], sections: [], actions: [], links: [] });
  });

  it('rejects an unknown agent, a bad job and missing text', () => {
    expect(parseReport({ ...base, agent: 'rogue' }).ok).toBe(false);
    expect(parseReport({ ...base, job: 'Scan Now' }).ok).toBe(false);
    expect(parseReport({ ...base, title: '  ' }).ok).toBe(false);
    expect(parseReport({ ...base, summary: undefined }).ok).toBe(false);
    expect(parseReport([]).ok).toBe(false);
  });

  it('drops links that are not http(s)', () => {
    const r = parseReport({
      ...base,
      links: [{ label: 'x', url: 'javascript:alert(1)' }, { label: 'notion', url: 'https://app.notion.com/p/abc' }],
      sections: [{ heading: 'h', items: [{ title: 't', url: 'data:text/html,hi' }] }],
    });
    if (!r.ok) throw new Error(r.error);
    expect(r.report.links).toEqual([{ label: 'notion', url: 'https://app.notion.com/p/abc' }]);
    expect(r.report.sections[0].items![0].url).toBeUndefined();
  });

  it('clamps scores and drops malformed metrics, items and empty sections', () => {
    const r = parseReport({
      ...base,
      metrics: [{ label: 'clicks', value: 44, delta: 3 }, { label: 'bad' }, { value: 1 }, { label: 'nan', value: NaN }],
      sections: [{ heading: 'empty' }, { heading: 'opps', items: [{ title: 'a', score: 140, priority: 'P1' }, { score: 3 }, { title: 'b', score: -5, priority: 'P9' }] }],
    });
    if (!r.ok) throw new Error(r.error);
    expect(r.report.metrics).toEqual([{ label: 'clicks', value: 44, delta: 3 }]);
    expect(r.report.sections).toHaveLength(1);
    expect(r.report.sections[0].items).toEqual([{ title: 'a', score: 100, priority: 'P1' }, { title: 'b', score: 0 }]);
  });

  it('keeps a period only when both ends are ISO dates', () => {
    const ok = parseReport({ ...base, period: { from: '2026-10-29', to: '2026-11-05' } });
    const bad = parseReport({ ...base, period: { from: 'last week', to: '2026-11-05' } });
    expect(ok.ok && ok.report.period).toEqual({ from: '2026-10-29', to: '2026-11-05' });
    expect(bad.ok && bad.report.period).toBeUndefined();
  });
});

describe('telegramMessage', () => {
  it('names the agent, lists metrics in Persian digits, counts decisions and links the admin page', () => {
    const r = parseReport({
      ...base,
      metrics: [{ label: 'کلیک', value: 1234, delta: -12 }],
      actions: ['تأیید ۱۴ پیشنهاد'],
    });
    if (!r.ok) throw new Error(r.error);
    const text = telegramMessage(r.report, 'https://visaroads.com/en/admin/reports/abc');
    expect(text).toContain('هوش بازار · scan');
    expect(text).toContain('• کلیک: ۱٬۲۳۴ (−۱۲)');
    expect(text).toContain('۱ تصمیم با شماست');
    expect(text.endsWith('گزارش کامل: https://visaroads.com/en/admin/reports/abc')).toBe(true);
  });

  it('stays under the Telegram limit and keeps the link', () => {
    const r = parseReport({ ...base, summary: 'x'.repeat(1500), actions: Array(20).fill('y'.repeat(500)) });
    if (!r.ok) throw new Error(r.error);
    const text = telegramMessage(r.report, 'https://visaroads.com/en/admin/reports/abc');
    expect(text.length).toBeLessThanOrEqual(TELEGRAM_LIMIT);
    expect(text).toContain('/en/admin/reports/abc');
  });
});

describe('helpers', () => {
  it('localNumber converts digits for fa only', () => {
    expect(localNumber(2026, 'fa')).toBe('۲٬۰۲۶');
    expect(localNumber(2026, 'en')).toBe('2,026');
  });
  it('safeUrl allows only http and https', () => {
    expect(safeUrl('ftp://x.y')).toBeUndefined();
    expect(safeUrl('https://x.y/a')).toBe('https://x.y/a');
  });
});
