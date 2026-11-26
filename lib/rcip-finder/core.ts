// ============================================================================
// lib/rcip-finder/core.ts
// Pure rules of the RCIP employer finder: matching an occupation to listed
// employers, the contact policy, the unlock steps and the monthly quota.
// No database access here, so all of it is unit-tested.
// ============================================================================
import tables from '@/content/data-reports/2026-10/finder-tables.json';
import { occupationByNoc, teerOf, clbFor } from './occupations';

export const FINDER_EDITION = tables.meta.month;
export const PAGE_SIZE = 20;
/** Deepest page a query may reach: a search never walks the whole list. */
export const MAX_PAGES = 10;

type Tables = {
  nocs: Record<string, string>;
  sectors: Record<string, { n: number; sectors: { sector: string; share: number; n: number }[] }>;
  postings: Record<string, { postings: number; vacancies: number; median_wage_hr: number | null; wage_n: number; by_community: Record<string, number> }>;
};
export const TABLES = tables as unknown as Tables & typeof tables;

export const isNoc = (v: unknown): v is string => typeof v === 'string' && /^\d{5}$/.test(v) && v in TABLES.nocs;

export type MatchRule = {
  noc: string;
  /** Lowercase substrings of business type: the employer's main work. */
  core: string[];
  /** NAICS sectors that post this occupation nationally. */
  sectors: string[];
};

export function matchRule(noc: string): MatchRule {
  const occ = occupationByNoc(noc);
  return {
    noc,
    core: occ?.core ?? [],
    sectors: (TABLES.sectors[noc]?.sectors ?? []).map((s) => s.sector),
  };
}

export type Tier = 'core' | 'related';

export type Candidate = { id: string; community: string; name: string; businessTypeNorm: string; sector: string | null; closedNote: string | null };

/** Which tier a listing falls in for this rule, or null when it does not match. */
export function tierOf(c: Pick<Candidate, 'businessTypeNorm' | 'sector'>, rule: MatchRule): Tier | null {
  if (rule.core.some((k) => c.businessTypeNorm.includes(k))) return 'core';
  if (c.sector && rule.sectors.includes(c.sector)) return 'related';
  return null;
}

/**
 * Closest first: the core tier, then related; inside a tier, communities
 * where this occupation was advertised in the data month come first (most
 * postings first), listings the community marks closed go last, then by name.
 */
export function rankCandidates(cands: Candidate[], rule: MatchRule): (Candidate & { tier: Tier; communityPostings: number })[] {
  const byCommunity = TABLES.postings[rule.noc]?.by_community ?? {};
  const out: (Candidate & { tier: Tier; communityPostings: number })[] = [];
  for (const c of cands) {
    const tier = tierOf(c, rule);
    if (tier) out.push({ ...c, tier, communityPostings: (byCommunity as Record<string, number>)[c.community] ?? 0 });
  }
  return out.sort(
    (a, b) =>
      (a.tier === b.tier ? 0 : a.tier === 'core' ? -1 : 1) ||
      b.communityPostings - a.communityPostings ||
      Number(!!a.closedNote) - Number(!!b.closedNote) ||
      a.name.localeCompare(b.name),
  );
}

export type ProfileCheck = {
  noc: string;
  name: string;
  teer: number | null;
  clbNeeded: number | null;
  clbMeets: boolean | null;
  experienceMeets: boolean | null;
  postings: Tables['postings'][string] | null;
};

/** What the profile says against IRCC's published minimums. Not an eligibility assessment. */
export function profileCheck(noc: string, clb: number | null, experience: string | null): ProfileCheck {
  const teer = teerOf(noc);
  const clbNeeded = clbFor(teer);
  return {
    noc,
    name: TABLES.nocs[noc] ?? noc,
    teer,
    clbNeeded,
    clbMeets: clb == null || clbNeeded == null ? null : clb >= clbNeeded,
    // IRCC: one year (1,560 hours) of related paid work in the last three years.
    experienceMeets: experience == null ? null : experience !== 'lt1',
    postings: TABLES.postings[noc] ?? null,
  };
}

// ── Contacts ────────────────────────────────────────────────────────────────

export type ContactPolicy = 'all' | 'safe' | 'off';
export const CONTACT_POLICY_KEY = 'rcipFinder.contactPolicy';
export const NO_CONTACT_COMMUNITIES_KEY = 'rcipFinder.noContactCommunities';
/** Communities whose lists ask candidates not to use them to solicit job offers (read 15 Nov 2026). */
export const SOLICITATION_NOTICE_COMMUNITIES = ['North Okanagan-Shuswap', 'Moose Jaw', 'Pictou County'];

const ROLE_LOCAL = /^(info|hr|careers?|jobs?|hiring|recruit(ing|ment)?|employment|office|admin|contact|hello|reception|general|inquiries|enquiries|apply|team|work)([._-].*)?$/;
export const isRoleAddress = (email: string) => ROLE_LOCAL.test(email.split('@')[0]?.toLowerCase() ?? '');

export type ContactRow = { community: string; website: string | null; phone: string | null; emails: string; contactSource: string };
export type Contact = { website: string | null; phone: string | null; emails: string[]; source: string };

const parseEmails = (raw: string): string[] => {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && x.includes('@')) : [];
  } catch {
    return [];
  }
};

/**
 * The contact a revealed row may show under the policy, or null when it may
 * show none. 'all' = everything held; 'safe' = no AI low-confidence rows, no
 * row in a community that asks for no solicitation, and named-person emails
 * only when the community's own list published them; 'off' = nothing.
 */
export function contactFor(row: ContactRow, policy: ContactPolicy, blocked: string[]): Contact | null {
  if (policy === 'off' || row.contactSource === 'none') return null;
  let emails = parseEmails(row.emails);
  if (policy === 'safe') {
    if (row.contactSource === 'ai_low' || blocked.includes(row.community)) return null;
    if (row.contactSource !== 'source_list') emails = emails.filter(isRoleAddress);
  }
  if (!row.website && !row.phone && emails.length === 0) return null;
  return { website: row.website, phone: row.phone, emails, source: row.contactSource };
}

// ── Unlock steps and quota ───────────────────────────────────────────────────

export const STEPS = ['account', 'profile', 'guide', 'quiz', 'pledge'] as const;
export type Step = (typeof STEPS)[number];
export const isStep = (v: unknown): v is Step => typeof v === 'string' && (STEPS as readonly string[]).includes(v);

/** Each completed step opens one reveal a month, five at most. */
export const quotaFor = (done: string[]) => STEPS.filter((s) => done.includes(s)).length;

/** Start of the calendar month (UTC) the quota counts from. */
export const monthStart = (now: Date) => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

/** A step can be done only after the ones before it. */
export function nextStep(done: string[]): Step | null {
  return STEPS.find((s) => !done.includes(s)) ?? null;
}

/** Quiz answer key: option ids from components/rcip-finder/copy.ts, checked on the server. */
export const QUIZ_KEY: Record<string, string> = { q1: 'full', q2: 'clb5', q3: 'designated' };
export const quizPassed = (answers: unknown) =>
  !!answers && typeof answers === 'object' && Object.entries(QUIZ_KEY).every(([q, a]) => (answers as Record<string, unknown>)[q] === a);

export const EXPERIENCE = ['lt1', '1to2', '3plus'] as const;
export const isExperience = (v: unknown): v is (typeof EXPERIENCE)[number] => typeof v === 'string' && (EXPERIENCE as readonly string[]).includes(v);
export const isClb = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 1 && (v as number) <= 12;
