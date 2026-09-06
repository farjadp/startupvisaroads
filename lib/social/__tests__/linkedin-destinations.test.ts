import { describe, it, expect } from 'vitest';
import { DESTINATIONS } from '../destinations';

const linkedin = DESTINATIONS.filter((d) => d.platform === 'linkedin');

describe('the LinkedIn destinations', () => {
  it('covers Farjad\'s profile and both company pages', () => {
    expect(linkedin.map((d) => d.id).sort()).toEqual(['linkedin-ashavid', 'linkedin-farjad', 'linkedin-visaroads']);
  });

  // One app, one token, three URNs. If they ever diverge, each destination
  // still declares what it needs, so `configured` stays honest per destination.
  it('shares the access token but gives each destination its own URN', () => {
    for (const d of linkedin) expect(d.credentials).toContain('LINKEDIN_ACCESS_TOKEN');
    const urns = linkedin.map((d) => d.credentials.find((k) => k.includes('URN')));
    expect(new Set(urns).size).toBe(linkedin.length);
  });

  // AshaVid is the AI venture, not the immigration brand. A Persian article
  // written for an Iranian founder is not what that page's audience follows.
  it('keeps the AshaVid page out of the Persian lane', () => {
    const ashavid = linkedin.find((d) => d.id === 'linkedin-ashavid')!;
    expect(ashavid.locales).toEqual(['en']);
    expect(ashavid.locales).not.toContain('fa');
  });

  it('sends Persian articles to Farjad and the VisaRoads page', () => {
    for (const id of ['linkedin-farjad', 'linkedin-visaroads']) {
      expect(linkedin.find((d) => d.id === id)!.locales, id).toContain('fa');
    }
  });

  it('gives every LinkedIn destination the autoPost escape hatch', () => {
    for (const d of linkedin) expect(typeof d.autoPost, d.id).toBe('boolean');
  });
});
