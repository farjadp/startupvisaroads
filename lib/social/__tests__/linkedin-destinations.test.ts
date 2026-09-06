import { describe, it, expect } from 'vitest';
import { DESTINATIONS } from '../destinations';

const linkedin = DESTINATIONS.filter((d) => d.platform === 'linkedin');

describe('the LinkedIn destinations', () => {
  it('covers both company pages', () => {
    expect(linkedin.map((d) => d.id).sort()).toEqual(['linkedin-ashavid', 'linkedin-visaroads']);
  });

  // Farjad asked for the pages only. A personal feed is a person talking, and
  // filling it automatically with brand posts costs the thing that makes it
  // worth following. Asserted so it reads as a decision, not an omission.
  it('does not post to the personal profile', () => {
    expect(linkedin.some((d) => d.id === 'linkedin-farjad')).toBe(false);
  });

  // Two LinkedIn apps exist, not one: VisaRoads owns its page and
  // PersonalWebsite owns Ashavid. A destination borrowing another's token
  // fails with a permission error that looks nothing like the real cause, so
  // every destination carries its own token key as well as its own URN.
  it('gives each destination its own token and its own URN', () => {
    const tokens = linkedin.map((d) => d.credentials.find((k) => k.includes('TOKEN')));
    const urns = linkedin.map((d) => d.credentials.find((k) => k.includes('URN')));
    expect(new Set(tokens).size).toBe(linkedin.length);
    expect(new Set(urns).size).toBe(linkedin.length);
    for (const k of [...tokens, ...urns]) expect(k).toBeTruthy();
  });

  // AshaVid is the AI venture, not the immigration brand. A Persian article
  // written for an Iranian founder is not what that page's audience follows.
  it('keeps the AshaVid page out of the Persian lane', () => {
    const ashavid = linkedin.find((d) => d.id === 'linkedin-ashavid')!;
    expect(ashavid.locales).toEqual(['en']);
    expect(ashavid.locales).not.toContain('fa');
  });

  it('sends Persian articles to the VisaRoads page', () => {
    expect(linkedin.find((d) => d.id === 'linkedin-visaroads')!.locales).toContain('fa');
  });

  it('gives every LinkedIn destination the autoPost escape hatch', () => {
    for (const d of linkedin) expect(typeof d.autoPost, d.id).toBe('boolean');
  });
});
