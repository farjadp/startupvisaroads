// ============================================================================
// lib/case-studies/public.ts
// Read-only queries behind the public Case Studies pages and the sitemap.
//
// "Published" means all four: status PUBLISHED, publishedAt in the past,
// never withdrawn, and the case type's publishing switch currently ON
// (lib/case-studies/settings.ts). The switches are kill switches: turning one
// OFF hides every page of that type from every read here, the sitemap
// included, without touching the rows; turning it back ON restores them. A
// failed settings read counts as both switches OFF. Seeded sample rows (`sample: true`) are invisible in
// production, whatever their status: they exist for dev screenshots only.
//
// Every query fails soft. A database outage gives an empty list or a null
// row (the page then 404s); it never throws into the render.
//
// Only the fields a public page may show are selected. Party names are never
// stored, but the select list is still a whitelist, so a column added later
// (style of cause, internal notes) cannot reach the page by accident.
// ============================================================================
import type { Prisma } from '@prisma/client';
import { cache } from 'react';
import prisma from '@/lib/prisma';
import { enabledCaseTypes, getCaseStudySettings, type CaseStudySettings } from '@/lib/case-studies/settings';

export type CaseLocale = 'en' | 'fa';
export type CaseType = 'FC_DECISION' | 'CLIENT_CASE';
export type CaseOutcome = 'allowed' | 'dismissed';

export type PublicClaim = {
  id: string;
  kind: string;
  text: string;
  paras: number[];
  quote: string;
};

export type PublicLesson = {
  text: string;
  /** The claim the lesson rests on; its ¶ chip is shown beside the lesson. */
  claim: PublicClaim | null;
  /** Optional link to the matching route-guide checklist. */
  href: string | null;
};

export type PublicFaq = { question: string; answer: string };

export type PublicCase = {
  id: string;
  groupKey: string;
  locale: CaseLocale;
  slug: string;
  type: CaseType;
  title: string;
  excerpt: string | null;
  keyTakeaway: string | null;
  court: string | null;
  citation: string | null;
  decisionDate: Date | null;
  route: string;
  country: string;
  outcome: CaseOutcome | null;
  officialUrl: string | null;
  certifiedQuestion: string | null;
  claims: PublicClaim[];
  lessons: PublicLesson[];
  faq: PublicFaq[];
  sample: boolean;
  publishedAt: Date;
  updatedAt: Date;
};

export type CaseListItem = {
  id: string;
  groupKey: string;
  locale: CaseLocale;
  slug: string;
  type: CaseType;
  title: string;
  citation: string | null;
  route: string;
  outcome: CaseOutcome | null;
  decisionDate: Date | null;
  publishedAt: Date;
  /** One line for the docket: the first lesson, else the "in one line". */
  lesson: string | null;
  sample: boolean;
};

export type SitemapCase = { locale: CaseLocale; slug: string; groupKey: string; updatedAt: Date };

// ----------------------------------------------------------------------------
// Where clauses
// ----------------------------------------------------------------------------

/** Production never shows a sample row. Read per call so tests can flip it. */
function hideSamples(): boolean {
  return process.env.NODE_ENV === 'production';
}

const ALL_OFF: CaseStudySettings = { courtPagesClearedByCounsel: false, clientCasesEnabled: false };

/**
 * The switches, read once per request (React `cache` dedupes within one server
 * render; outside a render each call reads afresh). Fails closed.
 */
const readSwitches = cache(async (): Promise<CaseStudySettings> => {
  try {
    return await getCaseStudySettings();
  } catch (e) {
    console.error('case-studies/public: settings read failed; treating every switch as off', e);
    return ALL_OFF;
  }
});

export function publishedWhere(settings: CaseStudySettings, now: Date = new Date()): Prisma.CaseStudyWhereInput {
  return {
    type: { in: enabledCaseTypes(settings) },
    status: 'PUBLISHED',
    publishedAt: { lte: now },
    withdrawnAt: null,
    ...(hideSamples() ? { sample: false } : {}),
  };
}

const LIST_SELECT = {
  id: true,
  groupKey: true,
  locale: true,
  slug: true,
  type: true,
  title: true,
  excerpt: true,
  keyTakeaway: true,
  citation: true,
  route: true,
  outcome: true,
  decisionDate: true,
  publishedAt: true,
  claims: true,
  lessons: true,
  sample: true,
} satisfies Prisma.CaseStudySelect;

const PAGE_SELECT = {
  id: true,
  groupKey: true,
  locale: true,
  slug: true,
  type: true,
  title: true,
  excerpt: true,
  keyTakeaway: true,
  court: true,
  citation: true,
  decisionDate: true,
  route: true,
  country: true,
  outcome: true,
  officialUrl: true,
  certifiedQuestion: true,
  claims: true,
  lessons: true,
  faq: true,
  sample: true,
  publishedAt: true,
  updatedAt: true,
} satisfies Prisma.CaseStudySelect;

// ----------------------------------------------------------------------------
// JSON parsing (fields are stored as strings; tolerate older or partial shapes)
// ----------------------------------------------------------------------------

function parseArray(json: string | null | undefined): unknown[] {
  if (!json) return [];
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

export function parseClaims(json: string | null | undefined): PublicClaim[] {
  const out: PublicClaim[] = [];
  for (const raw of parseArray(json)) {
    if (!raw || typeof raw !== 'object') continue;
    const r = raw as Record<string, unknown>;
    const id = str(r.id);
    const text = str(r.text);
    if (!id || !text) continue;
    const paras = Array.isArray(r.paras)
      ? r.paras.filter((n): n is number => typeof n === 'number' && Number.isInteger(n) && n > 0)
      : [];
    out.push({ id, kind: str(r.kind) || 'fact', text, paras, quote: str(r.quote) });
  }
  return out;
}

/** The claim ids a lesson entry points at, across the shapes the pipeline may use. */
function lessonRefs(r: Record<string, unknown>): string[] {
  const refs: string[] = [];
  for (const key of ['basedOn', 'claimIds']) {
    const v = r[key];
    if (Array.isArray(v)) refs.push(...v.filter((x): x is string => typeof x === 'string'));
  }
  for (const key of ['claimId', 'id']) {
    const v = r[key];
    if (typeof v === 'string') refs.push(v);
  }
  return refs;
}

function safeHref(v: unknown): string | null {
  const s = str(v);
  if (!s) return null;
  // Internal paths and https links only; anything else is dropped.
  if (s.startsWith('/') && !s.startsWith('//')) return s;
  if (/^https:\/\//.test(s)) return s;
  return null;
}

/**
 * Lessons rest on claims (spec §3.8). The lesson-kind claims are the source;
 * the `lessons` JSON only adds a guide link. A lessons entry that names no
 * claim is not shown: an unsupported lesson is exactly what the page must
 * not publish.
 */
export function buildLessons(claims: PublicClaim[], lessonsJson: string | null | undefined): PublicLesson[] {
  const entries = parseArray(lessonsJson)
    .filter((x): x is Record<string, unknown> => !!x && typeof x === 'object')
    .map((r) => ({ text: str(r.text), refs: lessonRefs(r), href: safeHref(r.href ?? r.guideHref ?? r.link) }));

  const byId = new Map(claims.map((c) => [c.id, c]));
  const lessonClaims = claims.filter((c) => c.kind === 'lesson');

  if (lessonClaims.length) {
    return lessonClaims.map((c) => {
      const entry = entries.find((e) => e.refs.includes(c.id));
      return { text: c.text, claim: c, href: entry?.href ?? null };
    });
  }

  const out: PublicLesson[] = [];
  for (const e of entries) {
    const claim = e.refs.map((id) => byId.get(id)).find(Boolean) ?? null;
    if (!e.text || !claim) continue;
    out.push({ text: e.text, claim, href: e.href });
  }
  return out;
}

export function parseFaq(json: string | null | undefined): PublicFaq[] {
  const out: PublicFaq[] = [];
  for (const raw of parseArray(json)) {
    if (!raw || typeof raw !== 'object') continue;
    const r = raw as Record<string, unknown>;
    const question = str(r.question ?? r.q);
    const answer = str(r.answer ?? r.a);
    if (question && answer) out.push({ question, answer });
  }
  return out;
}

const asLocale = (l: string): CaseLocale => (l === 'fa' ? 'fa' : 'en');
const asType = (t: string): CaseType => (t === 'CLIENT_CASE' ? 'CLIENT_CASE' : 'FC_DECISION');
const asOutcome = (o: string | null): CaseOutcome | null => (o === 'allowed' || o === 'dismissed' ? o : null);

type ListRow = Prisma.CaseStudyGetPayload<{ select: typeof LIST_SELECT }>;
type PageRow = Prisma.CaseStudyGetPayload<{ select: typeof PAGE_SELECT }>;

function toListItem(r: ListRow): CaseListItem {
  const claims = parseClaims(r.claims);
  const lessons = buildLessons(claims, r.lessons);
  return {
    id: r.id,
    groupKey: r.groupKey,
    locale: asLocale(r.locale),
    slug: r.slug,
    type: asType(r.type),
    title: r.title,
    citation: r.citation,
    route: r.route,
    outcome: asOutcome(r.outcome),
    decisionDate: r.decisionDate,
    // publishedWhere guarantees a value; the fallback only satisfies the type.
    publishedAt: r.publishedAt ?? new Date(0),
    lesson: lessons[0]?.text ?? r.keyTakeaway ?? r.excerpt ?? null,
    sample: r.sample,
  };
}

export function toPublicCase(r: PageRow): PublicCase {
  const claims = parseClaims(r.claims);
  return {
    id: r.id,
    groupKey: r.groupKey,
    locale: asLocale(r.locale),
    slug: r.slug,
    type: asType(r.type),
    title: r.title,
    excerpt: r.excerpt,
    keyTakeaway: r.keyTakeaway,
    court: r.court,
    citation: r.citation,
    decisionDate: r.decisionDate,
    route: r.route,
    country: r.country,
    outcome: asOutcome(r.outcome),
    officialUrl: safeHref(r.officialUrl),
    certifiedQuestion: r.certifiedQuestion,
    claims,
    lessons: buildLessons(claims, r.lessons),
    faq: parseFaq(r.faq),
    sample: r.sample,
    publishedAt: r.publishedAt ?? new Date(0),
    updatedAt: r.updatedAt,
  };
}

// ----------------------------------------------------------------------------
// Queries
// ----------------------------------------------------------------------------

export async function listPublished(opts: { locale: string; route?: string | null; outcome?: string | null }): Promise<CaseListItem[]> {
  const outcome = asOutcome(opts.outcome ?? null);
  try {
    const live = publishedWhere(await readSwitches());
    const rows = await prisma.caseStudy.findMany({
      where: {
        ...live,
        locale: asLocale(opts.locale),
        ...(opts.route ? { route: opts.route } : {}),
        ...(outcome ? { outcome } : {}),
      },
      select: LIST_SELECT,
      orderBy: [{ decisionDate: 'desc' }, { publishedAt: 'desc' }],
    });
    return rows.map(toListItem);
  } catch (e) {
    console.error('case-studies/public: listPublished failed', e);
    return [];
  }
}

export async function getPublished(locale: string, slug: string): Promise<PublicCase | null> {
  try {
    const row = await prisma.caseStudy.findFirst({
      where: { ...publishedWhere(await readSwitches()), locale: asLocale(locale), slug },
      select: PAGE_SELECT,
    });
    return row ? toPublicCase(row) : null;
  } catch (e) {
    console.error('case-studies/public: getPublished failed', e);
    return null;
  }
}

/** The published rows of one en/fa group (0, 1 or 2 rows). */
export async function getPair(groupKey: string): Promise<{ locale: CaseLocale; slug: string }[]> {
  try {
    const rows = await prisma.caseStudy.findMany({
      where: { ...publishedWhere(await readSwitches()), groupKey },
      select: { locale: true, slug: true },
    });
    return rows.map((r) => ({ locale: asLocale(r.locale), slug: r.slug }));
  } catch (e) {
    console.error('case-studies/public: getPair failed', e);
    return [];
  }
}

/**
 * Where a request for a slug that is not published in this locale should go,
 * or null for a 404:
 * - the same case published in the other locale (spec §7, one-locale case);
 * - a withdrawn case's published replacement (spec §9).
 */
export async function findRedirectTarget(locale: string, slug: string): Promise<string | null> {
  const here = asLocale(locale);
  const other: CaseLocale = here === 'en' ? 'fa' : 'en';
  try {
    const live = publishedWhere(await readSwitches());
    const own = await prisma.caseStudy.findFirst({
      where: { locale: here, slug, ...(hideSamples() ? { sample: false } : {}) },
      select: { groupKey: true, withdrawnAt: true, supersededById: true },
    });

    if (own?.withdrawnAt && own.supersededById) {
      const next = await prisma.caseStudy.findFirst({
        where: { ...live, id: own.supersededById },
        select: { locale: true, slug: true },
      });
      if (next) return `/${asLocale(next.locale)}/case-studies/${next.slug}`;
      return null;
    }
    if (own?.withdrawnAt) return null;

    const twin = await prisma.caseStudy.findFirst({
      where: { ...live, locale: other, ...(own ? { groupKey: own.groupKey } : { slug }) },
      select: { slug: true },
    });
    return twin ? `/${other}/case-studies/${twin.slug}` : null;
  } catch (e) {
    console.error('case-studies/public: findRedirectTarget failed', e);
    return null;
  }
}

export async function countPublished(locale: string): Promise<number> {
  try {
    return await prisma.caseStudy.count({ where: { ...publishedWhere(await readSwitches()), locale: asLocale(locale) } });
  } catch (e) {
    console.error('case-studies/public: countPublished failed', e);
    return 0;
  }
}

export async function listForSitemap(): Promise<SitemapCase[]> {
  try {
    const rows = await prisma.caseStudy.findMany({
      where: publishedWhere(await readSwitches()),
      select: { locale: true, slug: true, groupKey: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map((r) => ({ locale: asLocale(r.locale), slug: r.slug, groupKey: r.groupKey, updatedAt: r.updatedAt }));
  } catch (e) {
    console.error('case-studies/public: listForSitemap failed', e);
    return [];
  }
}

// ----------------------------------------------------------------------------
// Filters (index page)
// ----------------------------------------------------------------------------

export type CaseFilters = { route: string | null; outcome: CaseOutcome | null };

/** Read the index's query parameters; unknown values are ignored. */
export function readFilters(sp: Record<string, string | string[] | undefined>, routes: readonly string[]): CaseFilters {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? null;
  const route = one(sp.route);
  return {
    route: route && routes.includes(route) ? route : null,
    outcome: asOutcome(one(sp.outcome)),
  };
}

export function applyFilters(items: CaseListItem[], f: CaseFilters): CaseListItem[] {
  return items.filter((i) => (!f.route || i.route === f.route) && (!f.outcome || i.outcome === f.outcome));
}
