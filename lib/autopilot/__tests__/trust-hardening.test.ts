import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { OFFICIAL_SOURCES, officialSourcePromptForBrief, officialSourcesForBrief, officialCitationUrl } from '../official-sources';
import { decidePlannedPublication } from '../text';

const root = process.cwd();

describe('official source registry', () => {
  it('covers every supported authority with HTTPS host roots', () => {
    const ids = OFFICIAL_SOURCES.map((source) => source.id);
    expect(ids).toEqual(expect.arrayContaining([
      'canada-ircc',
      'canada-ontario',
      'canada-saskatchewan',
      'usa-uscis',
      'finland-migri',
      'finland-business-finland',
      'denmark-nyidanmark',
      'denmark-business-authority',
      'estonia-startup-estonia',
      'netherlands-ind',
      'australia-home-affairs',
      'uae-government',
    ]));
    for (const source of OFFICIAL_SOURCES) expect(new URL(source.url).protocol).toBe('https:');
  });

  it('does not select an authority from an acronym embedded in another word', () => {
    const sources = officialSourcesForBrief({
      workingTitle: 'Finding the right Australian pathway',
      angle: 'Individual founders compare options',
      primaryKeyword: 'Australia founder visa',
      secondaryKeywords: [],
      mustLink: ['/country/australia'],
    });
    expect(sources.map((source) => source.id)).toEqual(['australia-home-affairs']);
  });

  it('selects relevant sources and gives the writer a citation requirement', () => {
    const brief = {
      workingTitle: 'How the Finland start-up permit works',
      angle: 'Founder eligibility and endorsement',
      primaryKeyword: 'Finland startup permit',
      secondaryKeywords: ['Business Finland'],
      mustLink: ['/europe/finland'],
    };
    expect(officialSourcesForBrief(brief).map((source) => source.id)).toEqual([
      'finland-migri',
      'finland-business-finland',
    ]);
    const prompt = officialSourcePromptForBrief(brief);
    expect(prompt).toContain('https://migri.fi/');
    expect(prompt).toContain('inline citation');
    expect(prompt).toContain('mutable programme claim');
  });
});

describe('planned publication decision', () => {
  it('downgrades a requested publication without an official citation', () => {
    expect(decidePlannedPublication(true, 0)).toEqual({
      status: 'DRAFT',
      warning: 'Publication downgraded to DRAFT: no allowlisted official citation survived link enforcement.',
    });
  });

  it('allows requested publication when an official citation survives', () => {
    expect(decidePlannedPublication(true, 1)).toEqual({ status: 'PUBLISHED' });
    expect(decidePlannedPublication(false, 1)).toEqual({ status: 'DRAFT' });
  });
});

describe('prompt and legacy cron safety', () => {
  it('does not request pseudo-compliance metadata', () => {
    const prompts = [
      readFileSync(`${root}/lib/ai.ts`, 'utf8'),
      readFileSync(`${root}/lib/autopilot/writer.ts`, 'utf8'),
    ].join('\n');
    expect(prompts).not.toMatch(/95%|95٪|validated for 2026|compliance|actionability/i);
  });

  it('keeps the legacy generation cron draft-only', () => {
    const route = readFileSync(`${root}/app/api/cron/generate/route.ts`, 'utf8');
    expect(route).toContain("createArticleFromPayload(payload, { locale, status: 'DRAFT' })");
    expect(route).not.toContain("createArticleFromPayload(payload, { locale, status: 'PUBLISHED' })");
  });

  it('keeps source editorial citations free of nofollow', () => {
    const writer = readFileSync(`${root}/lib/autopilot/source-writer.ts`, 'utf8');
    expect(writer).toContain('rel="noopener noreferrer"');
    expect(writer).not.toContain('rel="nofollow noopener"');
  });
});

describe('official citation hosts', () => {
  // The registry mixes the two forms — `migri.fi` beside
  // `www.businessfinland.fi` — so an exact hostname match let a coin toss in
  // the writer's output decide whether an article published at all.
  it('treats www and the bare domain as the same authority, in both directions', () => {
    expect(officialCitationUrl('https://www.migri.fi/en/startup-permit')).not.toBeNull();
    expect(officialCitationUrl('https://migri.fi/en/startup-permit')).not.toBeNull();
    expect(officialCitationUrl('https://canada.ca/en/immigration.html')).not.toBeNull();
    expect(officialCitationUrl('https://www.canada.ca/en/immigration.html')).not.toBeNull();
  });

  it('accepts a subdomain of an authority, which is still that authority', () => {
    expect(officialCitationUrl('https://ircc.canada.ca/english/index.asp')).not.toBeNull();
  });

  it('accepts the New Brunswick domain a writer would actually cite', () => {
    // The registry lists www2.gnb.ca; nobody writing prose links to www2.
    expect(officialCitationUrl('https://www.gnb.ca/immigration')).not.toBeNull();
  });

  it('does not let a lookalike domain through the suffix check', () => {
    expect(officialCitationUrl('https://notcanada.ca/en')).toBeNull();
    expect(officialCitationUrl('https://canada.ca.example.com/en')).toBeNull();
    expect(officialCitationUrl('https://evil.com/?x=canada.ca')).toBeNull();
  });

  it('still refuses anything that is not a plain https authority URL', () => {
    expect(officialCitationUrl('http://www.canada.ca/en')).toBeNull();
    expect(officialCitationUrl('https://www.canada.ca:8443/en')).toBeNull();
    expect(officialCitationUrl('https://user:pass@www.canada.ca/en')).toBeNull();
    expect(officialCitationUrl('not a url')).toBeNull();
  });

  it('accepts at least one citation host for every authority in the registry', () => {
    for (const source of OFFICIAL_SOURCES) {
      expect(officialCitationUrl(source.url), source.id).not.toBeNull();
    }
  });
});
