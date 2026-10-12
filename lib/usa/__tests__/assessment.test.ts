import { describe, it, expect } from 'vitest';
import { assess, type AssessmentInput } from '../assessment';

const base: AssessmentInput = { criteria: [], degree: 'none', nationalImportance: false, plan: false, passports: ['canada'] };

describe('US readiness assessment', () => {
  it('needs three criteria other than salary to be ready to file', () => {
    expect(assess({ ...base, criteria: ['press', 'judging', 'critical'] }).o1).toBe('file');
    expect(assess({ ...base, criteria: ['press', 'judging', 'salary'] }).o1).toBe('consult');
  });

  it('calls two criteria the time to consult, and fewer too early', () => {
    expect(assess({ ...base, criteria: ['press', 'judging'] }).o1).toBe('consult');
    expect(assess({ ...base, criteria: ['press'] }).o1).toBe('early');
    expect(assess({ ...base, criteria: [] }).o1).toBe('early');
  });

  it('does not count a criterion twice', () => {
    expect(assess({ ...base, criteria: ['press', 'press', 'press'] }).strongCount).toBe(1);
  });

  it('treats NIW as unavailable without an advanced degree or its equivalent', () => {
    expect(assess({ ...base, nationalImportance: true, plan: true }).niw).toBe('not-eligible');
    expect(assess({ ...base, degree: 'bachelor5' }).niw).toBe('build');
    expect(assess({ ...base, degree: 'masters', nationalImportance: true, plan: true }).niw).toBe('strong');
  });

  it('blocks an Iranian passport with no second citizenship, whatever the evidence', () => {
    const r = assess({ ...base, passports: ['iran'], criteria: ['press', 'judging', 'critical', 'award'], degree: 'masters' });
    expect(r.gate).toBe('blocked');
  });

  it('opens the Canadian gate for an Iranian-Canadian dual citizen', () => {
    expect(assess({ ...base, passports: ['iran', 'canada'] }).gate).toBe('canadian');
    expect(assess({ ...base, passports: ['iran', 'treaty'] }).gate).toBe('treaty');
    expect(assess({ ...base, passports: ['other'] }).gate).toBe('check');
  });
});
