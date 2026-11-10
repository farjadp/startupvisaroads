import { describe, it, expect } from 'vitest';
import { SITE_URL } from '@/lib/seo';
import {
  caseAlternates,
  caseArticleJsonLd,
  caseBreadcrumbJsonLd,
  caseReviewedPageJsonLd,
  indexAlternates,
  pairLanguages,
  type CaseJsonLdInput,
} from '@/lib/case-studies/seo';
import { applyFilters, buildLessons, parseClaims, readFilters, type CaseListItem } from '@/lib/case-studies/public';

const base: CaseJsonLdInput = {
  locale: 'en',
  slug: 'start-up-visa-2099-fc-1',
  title: 'SAMPLE — Language results on file',
  description: 'The officer said the results were missing.',
  citation: '2099 FC 1',
  officialUrl: 'https://decisions.fct-cf.gc.ca/',
  decisionDate: new Date('2099-01-02T00:00:00Z'),
  court: 'Federal Court of Canada',
  publishedAt: new Date('2026-11-01T00:00:00Z'),
  updatedAt: new Date('2026-11-02T00:00:00Z'),
};

describe('caseArticleJsonLd', () => {
  it('describes the decision as a CreativeWork named by its neutral citation', () => {
    const ld = caseArticleJsonLd(base);
    expect(ld['@type']).toBe('Article');
    expect(ld.about).toEqual({
      '@type': 'CreativeWork',
      name: '2099 FC 1',
      url: 'https://decisions.fct-cf.gc.ca/',
      dateCreated: '2099-01-02',
      creator: { '@type': 'GovernmentOrganization', name: 'Federal Court of Canada' },
    });
    expect(ld.citation).toBe('https://decisions.fct-cf.gc.ca/');
    expect(ld.url).toBe(`${SITE_URL}/en/case-studies/start-up-visa-2099-fc-1`);
  });

  it('never carries a party name, even when the input row has one', () => {
    const row = {
      ...base,
      styleOfCause: 'Jane Applicant v Canada (Citizenship and Immigration)',
      applicant: 'Jane Applicant',
      parties: ['Jane Applicant', 'Minister'],
      judge: 'Justice Example',
    } as CaseJsonLdInput;
    const ld = caseArticleJsonLd(row);
    const json = JSON.stringify(ld);
    expect(json).not.toContain('Jane');
    expect(json).not.toContain('Applicant');
    expect(json).not.toContain('Justice Example');

    const keys = new Set<string>();
    const walk = (v: unknown) => {
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { keys.add(k); walk(x); }
    };
    walk(ld);
    for (const forbidden of ['styleOfCause', 'applicant', 'parties', 'party', 'respondent', 'judge', 'defendant', 'plaintiff']) {
      expect(keys.has(forbidden)).toBe(false);
    }
  });

  it('omits about and citation when the row has no citation or official URL', () => {
    const ld = caseArticleJsonLd({ ...base, citation: null, officialUrl: null });
    expect('about' in ld).toBe(false);
    expect('citation' in ld).toBe(false);
  });
});

describe('hreflang pairing', () => {
  it('emits en, fa and x-default only when both rows are published', () => {
    const pair = [
      { locale: 'en' as const, slug: 'start-up-visa-2099-fc-1' },
      { locale: 'fa' as const, slug: 'start-up-visa-2099-fc-1' },
    ];
    expect(caseAlternates('fa', 'start-up-visa-2099-fc-1', pair)).toEqual({
      canonical: `${SITE_URL}/fa/case-studies/start-up-visa-2099-fc-1`,
      languages: {
        en: `${SITE_URL}/en/case-studies/start-up-visa-2099-fc-1`,
        fa: `${SITE_URL}/fa/case-studies/start-up-visa-2099-fc-1`,
        'x-default': `${SITE_URL}/en/case-studies/start-up-visa-2099-fc-1`,
      },
    });
  });

  it('pairs rows whose slugs differ by locale', () => {
    const langs = pairLanguages([
      { locale: 'en', slug: 'a' },
      { locale: 'fa', slug: 'b' },
    ]);
    expect(langs).toEqual({ en: `${SITE_URL}/en/case-studies/a`, fa: `${SITE_URL}/fa/case-studies/b`, 'x-default': `${SITE_URL}/en/case-studies/a` });
  });

  it('is canonical-only for a case published in one locale', () => {
    const alt = caseAlternates('en', 'study-permit-2099-fc-2', [{ locale: 'en', slug: 'study-permit-2099-fc-2' }]);
    expect(alt).toEqual({ canonical: `${SITE_URL}/en/case-studies/study-permit-2099-fc-2` });
    expect(caseAlternates('en', 'x', [])).toEqual({ canonical: `${SITE_URL}/en/case-studies/x` });
  });

  it('pairs the index only when both locales have a published case', () => {
    expect(indexAlternates('en', ['en'])).toEqual({ canonical: `${SITE_URL}/en/case-studies` });
    expect(indexAlternates('en', ['en', 'fa']).languages).toEqual({
      en: `${SITE_URL}/en/case-studies`,
      fa: `${SITE_URL}/fa/case-studies`,
      'x-default': `${SITE_URL}/en/case-studies`,
    });
  });
});

describe('reviewedBy and breadcrumbs', () => {
  it('claims a review only after the lag', () => {
    const pub = new Date('2026-11-01T00:00:00Z');
    expect(caseReviewedPageJsonLd('en', 's', pub, new Date('2026-11-02T00:00:00Z'))).toBeNull();
    const node = caseReviewedPageJsonLd('en', 's', pub, new Date('2026-12-01T00:00:00Z'));
    expect(node?.reviewedBy['@type']).toBe('Person');
  });

  it('builds Home > Case studies > title', () => {
    const bc = caseBreadcrumbJsonLd('fa', 's', 'عنوان');
    expect(bc.itemListElement.map((i) => i.name)).toEqual(['خانه', 'پرونده‌ها', 'عنوان']);
  });
});

describe('public parsing helpers', () => {
  const claims = parseClaims(JSON.stringify([
    { id: 'c1', kind: 'fact', text: 'A fact.', paras: [3], quote: 'q1', verified: true },
    { id: 'c2', kind: 'lesson', text: 'A lesson.', paras: [25, 0, 'x'], quote: 'q2', verified: true },
    { id: '', kind: 'fact', text: 'dropped' },
    'junk',
  ]));

  it('keeps valid claims and positive integer paragraphs only', () => {
    expect(claims.map((c) => c.id)).toEqual(['c1', 'c2']);
    expect(claims[1].paras).toEqual([25]);
  });

  it('builds lessons from lesson claims and takes guide links from the lessons JSON', () => {
    const lessons = buildLessons(claims, JSON.stringify([{ text: 'x', basedOn: ['c2'], href: '/startup-visa-canada' }]));
    expect(lessons).toEqual([{ text: 'A lesson.', claim: claims[1], href: '/startup-visa-canada' }]);
  });

  it('drops a lessons entry that rests on no claim, and unsafe links', () => {
    const only = parseClaims(JSON.stringify([{ id: 'c1', kind: 'holding', text: 'Held.', paras: [9], quote: 'q' }]));
    const lessons = buildLessons(only, JSON.stringify([
      { text: 'Supported', basedOn: ['c1'], href: 'javascript:alert(1)' },
      { text: 'Unsupported' },
    ]));
    expect(lessons).toEqual([{ text: 'Supported', claim: only[0], href: null }]);
  });

  it('reads filters and ignores unknown values', () => {
    expect(readFilters({ route: 'study-permit', outcome: 'allowed' }, ['study-permit'])).toEqual({ route: 'study-permit', outcome: 'allowed' });
    expect(readFilters({ route: 'nope', outcome: 'won' }, ['study-permit'])).toEqual({ route: null, outcome: null });
    const item = (route: string, outcome: 'allowed' | 'dismissed') => ({ route, outcome }) as CaseListItem;
    expect(applyFilters([item('a', 'allowed'), item('b', 'dismissed')], { route: null, outcome: 'dismissed' })).toHaveLength(1);
  });
});
