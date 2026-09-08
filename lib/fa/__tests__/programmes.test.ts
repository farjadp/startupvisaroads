import { describe, it, expect } from 'vitest';
import { RULES, assess, assessAll, type Applicant } from '../programmes';
import { isFaPath } from '../paths';

const base: Applicant = {
  netWorthCad: 0,
  investableCad: 0,
  founders: 1,
  age: 30,
  clb: 5,
  venture: 'idea',
};
const rule = (key: string) => RULES.find((r) => r.key === key)!;

describe('rule provenance', () => {
  // The thresholds live here AND in each page's Persian `facts`. That
  // duplication is only survivable if every rule says when it was checked
  // and against what.
  it('every rule carries a review date and a source', () => {
    for (const r of RULES) {
      expect(r.updated, r.key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(r.source, r.key).toMatch(/^https:\/\//);
    }
  });

  // Was a /europe/ or /pnp/ prefix check. Türkiye is a top-level guide — it
  // is the one route here that leads nowhere near an EU passport, so filing
  // it under /europe would mislead. Asserting membership of FA_PATHS is the
  // stronger claim anyway: it catches a rule pointing at a page that 404s.
  it('every rule points at a guide that exists in the Persian IA', () => {
    for (const r of RULES) expect(isFaPath(r.href), r.key).toBe(true);
  });
});

describe('assess', () => {
  it('clears New Brunswick when every threshold is met', () => {
    const a = assess(rule('new-brunswick'), { ...base, netWorthCad: 500_000, investableCad: 150_000, age: 40, clb: 5 });
    expect(a.verdict).toBe('clears');
    expect(a.checks.every((c) => c.status === 'pass')).toBe(true);
  });

  it('calls a single miss "close" rather than a refusal', () => {
    const a = assess(rule('new-brunswick'), { ...base, netWorthCad: 500_000, investableCad: 150_000, age: 60, clb: 5 });
    expect(a.verdict).toBe('close');
    expect(a.checks.find((c) => c.label === 'سن')?.status).toBe('fail');
  });

  it('treats the net worth boundary as inclusive', () => {
    const under = assess(rule('nova-scotia'), { ...base, netWorthCad: 599_999, investableCad: 150_000 });
    const exact = assess(rule('nova-scotia'), { ...base, netWorthCad: 600_000, investableCad: 150_000 });
    expect(under.checks.find((c) => c.label === 'دارایی خالص')?.status).toBe('fail');
    expect(exact.checks.find((c) => c.label === 'دارایی خالص')?.status).toBe('pass');
  });

  it('requires a second founder for Finland and caps Denmark at three', () => {
    expect(assess(rule('finland'), { ...base, founders: 1 }).checks[0].status).toBe('fail');
    expect(assess(rule('finland'), { ...base, founders: 2 }).checks[0].status).toBe('pass');
    expect(assess(rule('denmark'), { ...base, founders: 4 }).checks[0].status).toBe('fail');
  });

  it('scales per-founder settlement funds with the size of the team', () => {
    const one = assess(rule('estonia'), { ...base, founders: 1, investableCad: 16_000, venture: 'mvp' });
    const two = assess(rule('estonia'), { ...base, founders: 2, investableCad: 16_000, venture: 'mvp' });
    expect(one.checks.find((c) => c.label === 'تمکن مالی یک سال')?.status).toBe('pass');
    expect(two.checks.find((c) => c.label === 'تمکن مالی یک سال')?.status).toBe('fail');
  });

  it('holds Estonia to an MVP', () => {
    expect(assess(rule('estonia'), { ...base, venture: 'idea' }).checks.find((c) => c.label === 'مرحله‌ی محصول')?.status).toBe('fail');
    expect(assess(rule('estonia'), { ...base, venture: 'revenue' }).checks.find((c) => c.label === 'مرحله‌ی محصول')?.status).toBe('pass');
  });

  it('surfaces what it cannot score instead of scoring it', () => {
    const nl = assess(rule('netherlands'), base);
    expect(nl.unscored.length).toBeGreaterThan(0);
    expect(nl.checks.some((c) => c.label.includes('فسیلیتیتور'))).toBe(false);
  });

  it('never scores a route on a condition the programme does not set', () => {
    const dk = assess(rule('denmark'), base);
    expect(dk.checks.some((c) => c.label === 'زبان')).toBe(false);
    expect(dk.checks.some((c) => c.label === 'دارایی خالص')).toBe(false);
  });
});

describe('assessAll', () => {
  it('puts the routes the reader clears first and the rest behind them', () => {
    const out = assessAll({ netWorthCad: 0, investableCad: 60_000, founders: 2, age: 33, clb: 4, venture: 'mvp' });
    const verdicts = out.map((o) => o.verdict);
    expect(verdicts).toEqual([...verdicts].sort((a, b) => ({ clears: 0, close: 1, 'not-yet': 2 })[a] - ({ clears: 0, close: 1, 'not-yet': 2 })[b]));
    expect(out).toHaveLength(RULES.length);
  });

  it('returns a route with no measurable threshold as clearing, with its conditions listed', () => {
    const nl = assessAll({ ...base, founders: 1 }).find((o) => o.rule.key === 'netherlands')!;
    expect(nl.verdict).toBe('clears');
    expect(nl.unscored).toContain('قرارداد امضاشده با فسیلیتیتور مورد تأیید RVO');
  });
});
