import { describe, it, expect } from 'vitest';
import { recommendPath, type QuizAnswers } from '../path-quiz';

const base: QuizAnswers = {
  goal: 'residency',
  business: 'none',
  language: 'mid',
  capital: 'under50',
  background: 'professional',
  horizon: 'medium',
};

describe('recommendPath', () => {
  it('tells an idea-stage founder with no capital it is too early', () => {
    const r = recommendPath({ ...base, business: 'idea', capital: 'under50', background: 'none' });
    expect(r.path).toBe('too-early');
    expect(r.href).toBe('/mentorship');
  });

  it('sends a revenue-stage founder with CLB 5 to the Start-up Visa', () => {
    const r = recommendPath({ ...base, business: 'revenue', language: 'mid', capital: '50to200' });
    expect(r.path).toBe('suv');
    expect(r.href).toBe('/canada-startup-visa');
  });

  it('sends a researcher with publications to EB-2 NIW', () => {
    const r = recommendPath({ ...base, background: 'research', business: 'none', language: 'high' });
    expect(r.path).toBe('eb2niw');
    expect(r.href).toBe('/usa-eb2-niw');
  });

  it('sends a skilled employee with strong language and no business to PNP', () => {
    const r = recommendPath({ ...base, background: 'professional', business: 'none', language: 'high' });
    expect(r.path).toBe('pnp');
    expect(r.href).toBe('/pnp');
  });

  it('prefers PNP over SUV for a funded founder in a hurry', () => {
    const r = recommendPath({ ...base, business: 'mvp', capital: 'over500', horizon: 'urgent' });
    expect(r.path).toBe('pnp');
  });

  it('never sends a founder with sub-CLB-5 language to SUV', () => {
    const r = recommendPath({ ...base, business: 'revenue', language: 'low', capital: '50to200' });
    expect(r.path).not.toBe('suv');
  });

  it('always returns a non-empty reason', () => {
    for (const business of ['none', 'idea', 'mvp', 'revenue'] as const) {
      for (const background of ['none', 'professional', 'research'] as const) {
        const r = recommendPath({ ...base, business, background });
        expect(r.why.length).toBeGreaterThan(20);
      }
    }
  });
});
