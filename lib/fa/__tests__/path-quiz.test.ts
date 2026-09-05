import { describe, it, expect } from 'vitest';
import { recommendPath, type QuizAnswers } from '../path-quiz';

const base: QuizAnswers = {
  goal: 'residency',
  team: 'solo',
  business: 'none',
  language: 'mid',
  capital: 'under50',
  background: 'professional',
  horizon: 'medium',
};

describe('recommendPath', () => {
  it('never recommends the closed Canada Start-up Visa', () => {
    for (const business of ['none', 'idea', 'mvp', 'revenue'] as const)
      for (const team of ['solo', 'team'] as const)
        for (const capital of ['under50', '50to200', '200to500', 'over500'] as const) {
          const r = recommendPath({ ...base, business, team, capital });
          expect(r.href).not.toBe('/canada-startup-visa');
        }
  });

  it('tells an idea-stage founder with no capital it is too early', () => {
    const r = recommendPath({ ...base, business: 'idea', background: 'none' });
    expect(r.path).toBe('too-early');
    expect(r.href).toBe('/mentorship');
  });

  it('sends a two-founder team with a product to Finland', () => {
    const r = recommendPath({ ...base, team: 'team', business: 'revenue', capital: '50to200' });
    expect(r.path).toBe('finland');
    expect(r.href).toBe('/europe/finland');
  });

  it('sends a solo founder in a hurry or on a small budget to Estonia', () => {
    expect(recommendPath({ ...base, business: 'mvp', capital: 'under50' }).path).toBe('estonia');
    expect(recommendPath({ ...base, business: 'revenue', capital: '50to200', horizon: 'urgent' }).path).toBe('estonia');
  });

  it('sends a solo founder with a running business and budget to Denmark', () => {
    const r = recommendPath({ ...base, business: 'revenue', capital: '50to200' });
    expect(r.path).toBe('denmark');
  });

  it('sends a funded professional who wants residency to Atlantic Canada', () => {
    const r = recommendPath({ ...base, capital: 'over500', business: 'none' });
    expect(r.path).toBe('atlantic');
    expect(r.href).toBe('/pnp/new-brunswick');
  });

  it('sends a researcher with publications to EB-2 NIW', () => {
    const r = recommendPath({ ...base, background: 'research', language: 'high' });
    expect(r.path).toBe('eb2niw');
  });

  it('never sends a founder with sub-CLB-5 language to Europe', () => {
    const r = recommendPath({ ...base, business: 'revenue', language: 'low', capital: '50to200' });
    expect(['too-early', 'atlantic']).toContain(r.path);
  });

  it('always returns a non-empty reason', () => {
    for (const business of ['none', 'idea', 'mvp', 'revenue'] as const)
      for (const background of ['none', 'professional', 'research'] as const)
        expect(recommendPath({ ...base, business, background }).why.length).toBeGreaterThan(20);
  });
});
