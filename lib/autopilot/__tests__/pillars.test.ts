import { describe, it, expect } from 'vitest';
import { PILLAR_SHARE, classifyPillar, linksForPillar, pillarForToday, pillarOf, type Pillar } from '../pillars';
import { EN_KEYWORDS_BY_PILLAR } from '@/content/en/keywords';
import { keywordPillar } from '@/content/keywords';

describe('the mix', () => {
  // Approved by Farjad on 26 Oct 2026.
  it('is 25 work, 25 business, 20 study, 20 life, 10 news', () => {
    expect(PILLAR_SHARE).toEqual({ work: 25, business: 25, study: 20, life: 20, news: 10 });
    expect(Object.values(PILLAR_SHARE).reduce((a, b) => a + b, 0)).toBe(100);
  });
});

describe('classifyPillar', () => {
  it.each<[string, Pillar]>([
    ['pgwp eligibility', 'study'],
    ['study in finland for free', 'study'],
    ['nova scotia entrepreneur stream', 'business'],
    ['netherlands startup visa facilitator', 'business'],
    ['cost of living in helsinki', 'life'],
    ['moving to finland with family', 'life'],
    ['express entry draw', 'work'],
    ['finland work permit requirements', 'work'],
    ['تحصیل در هلند', 'study'],
    ['مهاجرت کاری به کانادا', 'work'],
    ['هزینه زندگی در ترکیه', 'life'],
    ['استارتاپ ویزای استونی', 'business'],
  ])('%s → %s', (text, pillar) => {
    expect(classifyPillar(text)).toBe(pillar);
  });
});

describe('pillarOf', () => {
  it('reads the tag before guessing from the title', () => {
    expect(pillarOf({ title: 'Express Entry draw explained', topicSeed: '[pillar:news] [family:route-mechanics]' })).toBe('news');
    expect(pillarOf({ title: 'Express Entry draw explained', topicSeed: null })).toBe('work');
  });
});

describe('pillarForToday', () => {
  it('picks the planned pillar furthest below its share', () => {
    const recent: Pillar[] = ['business', 'business', 'work', 'business', 'work', 'life', 'business', 'work'];
    expect(pillarForToday(recent)).toBe('study');
  });

  it('never picks news, however little of it there is', () => {
    expect(pillarForToday(['work', 'business', 'study', 'life'])).not.toBe('news');
  });

  it('starts with work on an empty history', () => {
    expect(pillarForToday([])).toBe('work');
  });

  // The failure Farjad named: a run of startup pieces must hand the next day
  // to someone else.
  it('moves off business after a run of business articles', () => {
    expect(pillarForToday(Array(10).fill('business'))).not.toBe('business');
  });
});

describe('the English pool', () => {
  it('files every keyword under the pillar it is in', () => {
    for (const [p, list] of Object.entries(EN_KEYWORDS_BY_PILLAR)) {
      for (const k of list) expect(keywordPillar('en', k), k).toBe(p);
    }
  });
});

describe('linksForPillar', () => {
  it('drops startup and founder pages from a study, work or life brief', () => {
    expect(linksForPillar('work', ['/country/finland', '/europe/netherlands', '/blog/x'])).toEqual(['/country/finland', '/blog/x']);
    expect(linksForPillar('study', ['/mentorship', '/tools/express-entry'])).toEqual(['/tools/express-entry']);
  });

  it('keeps them on a business brief', () => {
    expect(linksForPillar('business', ['/europe/netherlands', '/services'])).toEqual(['/europe/netherlands', '/services']);
  });

  it('keeps a brief linkable when business pages were all it had', () => {
    expect(linksForPillar('life', ['/europe/denmark'])).toEqual(['/europe/denmark']);
  });
});
