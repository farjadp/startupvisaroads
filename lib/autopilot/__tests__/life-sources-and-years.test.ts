import { describe, it, expect } from 'vitest';
import { calendarYears, gateFigures, numbersOutsideEvidence } from '../evidence';
import { officialCitationUrl, officialSourcesForBrief } from '../official-sources';

// 27–28 Oct 2026: five of six life-pillar articles were held as DRAFT because
// the authority they cited (a school, health or tax body) was not on the list.
describe('study, life and work authorities', () => {
  it.each([
    'https://www.government.nl/topics/education',
    'https://www.infofinland.fi/en/family/children',
    'https://www.kela.fi/web/en/families',
    'https://lifeindenmark.borger.dk/healthcare',
    'https://www.gov.uk/skilled-worker-visa',
    'https://studyinthestates.dhs.gov/students',
    'https://www.goc.gov.tr/ikamet-izinleri',
    'https://www2.gov.bc.ca/gov/content/health',
    'https://www.gov.mb.ca/health/',
    'https://www.quebec.ca/en/health',
  ])('accepts %s as an official citation', (url) => {
    expect(officialCitationUrl(url)).not.toBeNull();
  });

  it('still refuses an agency or a guide site', () => {
    expect(officialCitationUrl('https://www.expatica.com/nl/education/')).toBeNull();
    expect(officialCitationUrl('https://www.cicnews.com/2026/10/x.html')).toBeNull();
  });

  it('offers the writer a life authority for a life brief', () => {
    const ids = officialSourcesForBrief({
      workingTitle: 'How to Choose Schools for Expats in the Netherlands',
      angle: 'international and Dutch schools for a newcomer family',
      primaryKeyword: 'schools for expats in netherlands',
      secondaryKeywords: [],
      mustLink: [],
    }).map((s) => s.id);
    expect(ids).toContain('netherlands-government');
  });

  it('offers GOV.UK for a UK brief', () => {
    const ids = officialSourcesForBrief({ workingTitle: 'UK Skilled Worker visa salary rules', angle: '', primaryKeyword: 'uk skilled worker visa requirements', secondaryKeywords: [], mustLink: [] }).map((s) => s.id);
    expect(ids).toContain('uk-gov');
  });
});

// 27 Oct 2026: «سال ۱۴۰۵» and "2027 draws" were refused as invented figures.
describe('calendar years', () => {
  const OCT_2026 = new Date('2026-10-27T07:00:00Z');

  it('is this year and next, Gregorian and Persian', () => {
    expect(calendarYears(OCT_2026).sort()).toEqual(['1405', '1406', '2026', '2027']);
  });

  it('turns the Persian year at Nowruz', () => {
    expect(calendarYears(new Date('2026-03-01T00:00:00Z'))).toContain('1404');
    expect(calendarYears(new Date('2026-03-21T00:00:00Z'))).toContain('1405');
  });

  it('lets a body name this year or next with no source', () => {
    expect(numbersOutsideEvidence('<p>در سال ۱۴۰۵ و در 2027</p>', '', OCT_2026)).toEqual([]);
  });

  it('still refuses another year, and any other figure, with nothing behind it', () => {
    expect(numbersOutsideEvidence('<p>Since 2019 the cap is 15,263 permits.</p>', '', OCT_2026).sort()).toEqual(['15263', '2019']);
    expect(gateFigures('<p>about 48,000 applicants</p>', '', true).ok).toBe(false);
  });
});
