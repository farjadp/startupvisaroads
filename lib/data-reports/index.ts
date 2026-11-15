// ============================================================================
// lib/data-reports/index.ts
// Data reports: statistical articles built from public datasets (the first
// series is RCIP designated-employer lists x Job Bank open data).
//
// A data report is an ordinary Article, published through /api/agent-articles
// and read at /<locale>/blog/<slug>. What makes it a data report is the tag
// DATA_REPORT_TAG; nothing else in the schema changes. The index at
// /<locale>/data-reports lists them by edition (the month the data covers,
// read from the slug). It does not use the Case Studies pipeline or its
// counsel switches.
// ============================================================================
import prisma from '@/lib/prisma';
import { NOT_WITHDRAWN } from '@/lib/legacy-redirects';
import { ORGANIZATION_ID, SITE_URL, WEBSITE_ID, schemaLanguage } from '@/lib/seo';

export const DATA_REPORT_TAG = 'data-report';
export const DATA_REPORTS_PATH = '/data-reports';

export type ReportLocale = 'en' | 'fa';

export type DataReportItem = {
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: Date;
  updatedAt: Date;
};

export type Edition = {
  /** `2026-10`, or `undated` when the slug carries no month. */
  key: string;
  year: number | null;
  /** 1-12 */
  month: number | null;
  reports: DataReportItem[];
};

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const EDITION_RE = new RegExp(`(?:^|-)(${MONTHS.join('|')})-(20\\d{2})(?:-|$)`);

/** `rcip-job-market-october-2026-communities` -> { year: 2026, month: 10 }. */
export function editionOfSlug(slug: string): { year: number; month: number } | null {
  const m = EDITION_RE.exec(slug);
  if (!m) return null;
  return { year: Number(m[2]), month: MONTHS.indexOf(m[1]) + 1 };
}

/**
 * Group reports by the month their data covers, newest edition first. Inside
 * an edition the parts keep their publishing order (part 1 first), so a
 * series reads top to bottom. Reports with no month in the slug go last.
 */
export function groupByEdition(items: DataReportItem[]): Edition[] {
  const map = new Map<string, Edition>();
  for (const item of items) {
    const e = editionOfSlug(item.slug);
    const key = e ? `${e.year}-${String(e.month).padStart(2, '0')}` : 'undated';
    const edition = map.get(key) ?? { key, year: e?.year ?? null, month: e?.month ?? null, reports: [] };
    edition.reports.push(item);
    map.set(key, edition);
  }
  const editions = Array.from(map.values());
  for (const edition of editions) edition.reports.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
  return editions.sort((a, b) => {
    if (a.key === 'undated') return 1;
    if (b.key === 'undated') return -1;
    return a.key < b.key ? 1 : -1;
  });
}

/** `October 2026` / `اکتبر ۲۰۲۶`. Gregorian month names in both languages: the data is published by month. */
export function editionLabel(edition: Pick<Edition, 'year' | 'month'>, locale: ReportLocale): string | null {
  if (!edition.year || !edition.month) return null;
  const date = new Date(Date.UTC(edition.year, edition.month - 1, 1));
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR-u-ca-gregory' : 'en-CA', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}

export const dataReportsUrl = (locale: ReportLocale) => `${SITE_URL}/${locale}${DATA_REPORTS_PATH}`;
export const reportUrl = (locale: ReportLocale, slug: string) => `${SITE_URL}/${locale}/blog/${slug}`;

/** Published data reports in one locale, newest first. [] on a database error. */
export async function listDataReports(locale: ReportLocale): Promise<DataReportItem[]> {
  try {
    const rows = await prisma.article.findMany({
      where: { status: 'PUBLISHED', locale, tags: { some: { name: DATA_REPORT_TAG } }, AND: [NOT_WITHDRAWN] },
      select: { slug: true, title: true, excerpt: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => ({ slug: r.slug, title: r.title, excerpt: r.excerpt, publishedAt: r.createdAt, updatedAt: r.updatedAt }));
  } catch (e) {
    console.error('data-reports: listDataReports failed', e);
    return [];
  }
}

/** How many published reports each locale has; the sitemap and hreflang read this. */
export async function countDataReports(): Promise<Record<ReportLocale, { count: number; lastModified: Date | null }>> {
  const out: Record<ReportLocale, { count: number; lastModified: Date | null }> = {
    en: { count: 0, lastModified: null },
    fa: { count: 0, lastModified: null },
  };
  for (const locale of ['en', 'fa'] as const) {
    const items = await listDataReports(locale);
    out[locale] = {
      count: items.length,
      lastModified: items.reduce<Date | null>((latest, i) => (!latest || i.updatedAt > latest ? i.updatedAt : latest), null),
    };
  }
  return out;
}

/**
 * Canonical and hreflang for the index. A locale with no report yet is not
 * advertised as an alternate, and the page itself is noindex until it has one.
 */
export function indexAlternates(locale: ReportLocale, withReports: ReportLocale[]) {
  const canonical = dataReportsUrl(locale);
  if (!withReports.includes('en') || !withReports.includes('fa')) return { canonical };
  return { canonical, languages: { en: dataReportsUrl('en'), fa: dataReportsUrl('fa'), 'x-default': dataReportsUrl('en') } };
}

type IndexJsonLdInput = { locale: ReportLocale; name: string; description: string; reports: DataReportItem[] };

/** CollectionPage with the reports as an ItemList. */
export function dataReportsIndexJsonLd({ locale, name, description, reports }: IndexJsonLdInput) {
  const url = dataReportsUrl(locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: schemaLanguage(locale),
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: reports.length,
      itemListElement: reports.map((r, i) => ({ '@type': 'ListItem', position: i + 1, url: reportUrl(locale, r.slug), name: r.title })),
    },
  };
}

/** The two public sources every report in the RCIP series is built from. */
export const RCIP_JOB_MARKET_SOURCES = {
  jobBank: {
    name: 'Job Bank open data: all job postings',
    publisher: 'Employment and Social Development Canada',
    url: 'https://open.canada.ca/data/en/dataset/ea639e28-c0fc-48bf-b5dd-b8899bd43072',
    license: 'https://open.canada.ca/en/open-government-licence-canada',
  },
  ircc: {
    name: 'Rural Community Immigration Pilot',
    publisher: 'Immigration, Refugees and Citizenship Canada',
    url: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/rural-franco-pilots/rural-immigration.html',
  },
} as const;

type DatasetJsonLdInput = { locale: ReportLocale; name: string; description: string; editions: Edition[] };

/**
 * Dataset: the derived monthly statistics. `isBasedOn` names the government
 * open data it is computed from; the licence is the source's, which requires
 * attribution and allows reuse.
 */
export function rcipJobMarketDatasetJsonLd({ locale, name, description, editions }: DatasetJsonLdInput) {
  const dated = editions.filter((e) => e.year && e.month).map((e) => e.key).sort();
  if (dated.length === 0) return null;
  const url = dataReportsUrl(locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${url}#rcip-job-market`,
    name,
    description,
    url,
    inLanguage: schemaLanguage(locale),
    creator: { '@id': ORGANIZATION_ID },
    license: RCIP_JOB_MARKET_SOURCES.jobBank.license,
    isAccessibleForFree: true,
    spatialCoverage: { '@type': 'Country', name: 'Canada' },
    temporalCoverage: dated.length === 1 ? dated[0] : `${dated[0]}/${dated[dated.length - 1]}`,
    isBasedOn: [
      { '@type': 'Dataset', name: RCIP_JOB_MARKET_SOURCES.jobBank.name, url: RCIP_JOB_MARKET_SOURCES.jobBank.url, publisher: { '@type': 'GovernmentOrganization', name: RCIP_JOB_MARKET_SOURCES.jobBank.publisher } },
    ],
  };
}
