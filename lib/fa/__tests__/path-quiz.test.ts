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

  it('sends a funded team chasing growth to Italy, not Finland', () => {
    const r = recommendPath({ ...base, team: 'team', business: 'revenue', capital: '200to500', goal: 'growth' });
    expect(r.path).toBe('italy');
    expect(r.href).toBe('/europe/italy');
  });

  // EUR 50,000 is about CAD 75,000 and the guidelines call even that "purely
  // indicative" for a team, so a team under CAD 50,000 has no business being
  // pointed at Italy. Finland asks for no investment at all.
  it('keeps a team on a small budget away from Italy', () => {
    expect(
      recommendPath({ ...base, team: 'team', business: 'revenue', capital: 'under50', goal: 'growth' }).path,
    ).toBe('finland');
  });

  // Naturalisation in Italy takes ten years for a non-EU resident, against
  // Denmark's eight. A reader optimising for a passport is sent to the routes
  // that reach one sooner, so this exclusion gets a test rather than a comment.
  it('never sends a passport-first goal to Italy', () => {
    for (const goal of ['residency', 'family'] as const)
      for (const capital of ['under50', '50to200', '200to500', 'over500'] as const)
        for (const team of ['solo', 'team'] as const)
          for (const horizon of ['urgent', 'medium', 'long'] as const)
            expect(
              recommendPath({ ...base, goal, business: 'mvp', language: 'mid', capital, horizon, team }).path,
            ).not.toBe('italy');
  });

  it('sends a solo founder in a hurry or on a small budget to Estonia', () => {
    expect(recommendPath({ ...base, business: 'mvp', capital: 'under50' }).path).toBe('estonia');
    expect(recommendPath({ ...base, business: 'revenue', capital: '50to200', horizon: 'urgent' }).path).toBe('estonia');
  });

  it('sends a growth-focused solo founder to the Netherlands', () => {
    const r = recommendPath({ ...base, business: 'revenue', capital: '50to200', goal: 'growth' });
    expect(r.path).toBe('netherlands');
    expect(r.href).toBe('/europe/netherlands');
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

  it('splits the growth-first solo founder by budget', () => {
    const growth = { ...base, goal: 'growth', team: 'solo', business: 'mvp', language: 'mid' } as const;
    // Türkiye gives three years of runway on a low burn; the Dutch permit is
    // twelve months and then a fresh RVO assessment. Budget is the honest
    // discriminator between them.
    expect(recommendPath({ ...growth, capital: 'under50' }).path).toBe('turkey');
    expect(recommendPath({ ...growth, capital: '50to200' }).path).toBe('netherlands');
  });

  // `goal: 'family'` reads «آینده‌ی تحصیلی و زندگی فرزندان». A parent
  // optimising for their children's future wants the route that can end in a
  // European passport, and Türkiye is the one route here that cannot. This is
  // a deliberate exclusion, so it gets a test rather than a comment.
  it('never sends the children\'s-future goal to Türkiye', () => {
    for (const capital of ['under50', '50to200', '200to500', 'over500'] as const)
      for (const horizon of ['urgent', 'medium', 'long'] as const)
        for (const team of ['solo', 'team'] as const)
          expect(
            recommendPath({ ...base, goal: 'family', business: 'mvp', language: 'mid', capital, horizon, team }).path,
          ).not.toBe('turkey');
  });

  it('always returns a non-empty reason', () => {
    for (const business of ['none', 'idea', 'mvp', 'revenue'] as const)
      for (const background of ['none', 'professional', 'research'] as const)
        expect(recommendPath({ ...base, business, background }).why.length).toBeGreaterThan(20);
  });
});
