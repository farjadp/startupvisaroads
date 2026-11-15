import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ articleFindMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ default: { article: { findMany: mocks.articleFindMany } } }));

import {
  DATA_REPORT_TAG,
  countDataReports,
  dataReportsIndexJsonLd,
  editionLabel,
  editionOfSlug,
  groupByEdition,
  indexAlternates,
  listDataReports,
  rcipJobMarketDatasetJsonLd,
  type DataReportItem,
} from '@/lib/data-reports';
import { faRedirectTarget } from '@/lib/fa/redirects';
import { localeSwitchTarget } from '@/lib/fa/paths';
import { SITE_URL } from '@/lib/seo';

const item = (slug: string, published: string): DataReportItem => ({
  slug,
  title: slug,
  excerpt: null,
  publishedAt: new Date(published),
  updatedAt: new Date(published),
});

describe('editionOfSlug', () => {
  it('reads the month the data covers from the slug', () => {
    expect(editionOfSlug('rcip-job-market-october-2026-communities')).toEqual({ year: 2026, month: 10 });
    expect(editionOfSlug('rcip-job-market-january-2027-occupations-fa')).toEqual({ year: 2027, month: 1 });
  });

  it('returns null without a month and year pair', () => {
    expect(editionOfSlug('rcip-job-offer-rules-designated-employer')).toBeNull();
    expect(editionOfSlug('mayfair-2026-report')).toBeNull();
    expect(editionOfSlug('report-october-1999')).toBeNull();
  });
});

describe('groupByEdition', () => {
  it('puts the newest month first and numbers parts in publishing order', () => {
    const editions = groupByEdition([
      item('rcip-job-market-november-2026-communities', '2026-12-16'),
      item('rcip-job-market-october-2026-industries', '2026-11-18'),
      item('rcip-job-market-october-2026-occupations', '2026-11-17'),
      item('rcip-job-market-october-2026-communities', '2026-11-16'),
      item('a-one-off-report', '2026-12-20'),
    ]);
    expect(editions.map((e) => e.key)).toEqual(['2026-11', '2026-10', 'undated']);
    expect(editions[1].reports.map((r) => r.slug)).toEqual([
      'rcip-job-market-october-2026-communities',
      'rcip-job-market-october-2026-occupations',
      'rcip-job-market-october-2026-industries',
    ]);
  });
});

describe('editionLabel', () => {
  it('names the Gregorian month in each language', () => {
    expect(editionLabel({ year: 2026, month: 10 }, 'en')).toBe('October 2026');
    expect(editionLabel({ year: 2026, month: 10 }, 'fa')).toMatch(/اکتبر/);
    expect(editionLabel({ year: 2026, month: 10 }, 'fa')).toMatch(/۲۰۲۶/);
    expect(editionLabel({ year: null, month: null }, 'en')).toBeNull();
  });
});

describe('listDataReports', () => {
  beforeEach(() => {
    mocks.articleFindMany.mockReset();
  });

  it('asks only for published articles carrying the data-report tag in that locale', async () => {
    mocks.articleFindMany.mockResolvedValue([
      { slug: 's', title: 'T', excerpt: 'E', createdAt: new Date('2026-11-16'), updatedAt: new Date('2026-11-17') },
    ]);
    const out = await listDataReports('fa');
    const where = mocks.articleFindMany.mock.calls[0][0].where;
    expect(where.status).toBe('PUBLISHED');
    expect(where.locale).toBe('fa');
    expect(where.tags).toEqual({ some: { name: DATA_REPORT_TAG } });
    expect(out[0]).toMatchObject({ slug: 's', title: 'T', excerpt: 'E' });
  });

  it('returns an empty list when the database fails', async () => {
    mocks.articleFindMany.mockImplementation(async () => {
      throw new Error('down');
    });
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(await listDataReports('en')).toEqual([]);
    expect((await countDataReports()).en).toEqual({ count: 0, lastModified: null });
    spy.mockRestore();
  });
});

describe('index SEO', () => {
  it('advertises a twin only when both locales have a report', () => {
    expect(indexAlternates('en', ['en'])).toEqual({ canonical: `${SITE_URL}/en/data-reports` });
    expect(indexAlternates('fa', ['en', 'fa']).languages).toEqual({
      en: `${SITE_URL}/en/data-reports`,
      fa: `${SITE_URL}/fa/data-reports`,
      'x-default': `${SITE_URL}/en/data-reports`,
    });
  });

  it('lists the reports as blog URLs in the CollectionPage', () => {
    const ld = dataReportsIndexJsonLd({ locale: 'en', name: 'n', description: 'd', reports: [item('rcip-job-market-october-2026-communities', '2026-11-16')] });
    expect(ld['@type']).toBe('CollectionPage');
    expect(ld.mainEntity.itemListElement[0].url).toBe(`${SITE_URL}/en/blog/rcip-job-market-october-2026-communities`);
  });

  it('emits a Dataset only when there is a dated edition, citing the open data it is built on', () => {
    expect(rcipJobMarketDatasetJsonLd({ locale: 'en', name: 'n', description: 'd', editions: [] })).toBeNull();
    const editions = groupByEdition([
      item('rcip-job-market-october-2026-communities', '2026-11-16'),
      item('rcip-job-market-november-2026-communities', '2026-12-16'),
    ]);
    const ld = rcipJobMarketDatasetJsonLd({ locale: 'en', name: 'n', description: 'd', editions });
    expect(ld?.temporalCoverage).toBe('2026-10/2026-11');
    expect(ld?.isBasedOn[0].url).toContain('open.canada.ca');
    expect(ld?.license).toContain('open-government-licence-canada');
  });
});

describe('Persian routing', () => {
  it('lets /fa/data-reports through instead of redirecting it to English', () => {
    expect(faRedirectTarget('/fa/data-reports')).toBeNull();
    expect(faRedirectTarget('/fa/data-reportsx')).toBe('/en/data-reportsx');
  });

  it('switches language to the twin index', () => {
    expect(localeSwitchTarget('/data-reports', 'fa')).toBe('/data-reports');
    expect(localeSwitchTarget('/data-reports', 'en')).toBe('/data-reports');
  });
});
