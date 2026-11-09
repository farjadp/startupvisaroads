// ============================================================================
// Case Studies editorial workflow (spec §4 is the rulebook).
//
//   DRAFT → IN_REVIEW → APPROVED → SCHEDULED → PUBLISHED; WITHDRAWN from any.
//
// One gate, in admin, enforced here on the server. The pure functions
// (approvalBlockers, publishBlockers) say why a step is refused; the DB
// helpers apply a step with a conditional update so a stale screen or two
// overlapping requests can never skip the gate.
// ============================================================================
import type { CaseStudy, ConsentRecord, Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import type { StoredClaim } from '@/lib/case-studies/claims';
import type { RedLineHit } from '@/lib/case-studies/redlines';
import { scanRedLines, htmlToText } from '@/lib/case-studies/redlines';
import type { CaseStudyPayload } from '@/lib/case-studies/payload';
import { getCaseStudySettings, type CaseStudySettings } from '@/lib/case-studies/settings';

export const CASE_STATUSES = ['DRAFT', 'IN_REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED', 'WITHDRAWN'] as const;
export type CaseStatus = (typeof CASE_STATUSES)[number];
export const TRANSITIONS = ['submit', 'approve', 'schedule', 'publish', 'reopen', 'withdraw'] as const;
export type TransitionAction = (typeof TRANSITIONS)[number];

/** The columns the gate reads. A full CaseStudy row satisfies it. */
export type GateRow = Pick<
  CaseStudy,
  'type' | 'status' | 'claims' | 'redLines' | 'approvedAt' | 'consentRecordId' | 'citation' | 'officialUrl' | 'outcome'
>;
export type GateConsent = Pick<ConsentRecord, 'id' | 'revokedAt'> | null;

export function parseJsonArray<T = unknown>(raw: string | null | undefined): T[] | null {
  if (!raw) return [];
  try {
    const v: unknown = JSON.parse(raw);
    return Array.isArray(v) ? (v as T[]) : null;
  } catch {
    return null;
  }
}

export function claimCounts(raw: string): { claimsTotal: number; claimsChecked: number } {
  const claims = parseJsonArray<StoredClaim>(raw) ?? [];
  return { claimsTotal: claims.length, claimsChecked: claims.filter((c) => c.verified === true).length };
}

/** Everything the gate checks except the status itself. */
function contentBlockers(row: GateRow, consent: GateConsent): string[] {
  const reasons: string[] = [];
  const claims = parseJsonArray<StoredClaim>(row.claims);
  if (claims === null) {
    reasons.push('Claims are unreadable.');
  } else if (claims.length === 0) {
    reasons.push('There are no claims to check.');
  } else {
    const unchecked = claims.filter((c) => c.verified !== true).length;
    if (unchecked) reasons.push(`${unchecked} of ${claims.length} claims are not checked.`);
    if (row.type === 'FC_DECISION') {
      const noPara = claims.filter((c) => !Array.isArray(c.paras) || c.paras.length === 0).length;
      if (noPara) reasons.push(`${noPara} claims have no paragraph reference.`);
    }
  }
  const hits = parseJsonArray<RedLineHit>(row.redLines);
  if (hits === null) reasons.push('Red-line scan result is unreadable.');
  else if (hits.length) {
    const labels = [...new Set(hits.map((h) => h.label))].join('; ');
    reasons.push(`${hits.length} red-line hits (${labels}). Fix the text and repost.`);
  }
  if (row.type === 'FC_DECISION') {
    if (!row.citation) reasons.push('Citation is missing.');
    if (!row.officialUrl) reasons.push('Official link is missing.');
    if (!row.outcome) reasons.push('Outcome is missing.');
  } else if (row.type === 'CLIENT_CASE') {
    if (!row.consentRecordId) reasons.push('No consent record is linked.');
    else if (!consent || consent.id !== row.consentRecordId) reasons.push('The linked consent record was not found.');
    else if (consent.revokedAt) reasons.push('The consent has been revoked.');
  } else {
    reasons.push(`Unknown case type ${row.type}.`);
  }
  return reasons;
}

/** Why approval is refused; empty means Farjad may approve. */
export function approvalBlockers(row: GateRow, consent: GateConsent): string[] {
  const reasons: string[] = [];
  if (row.status !== 'IN_REVIEW') reasons.push(`Status is ${row.status}; only IN_REVIEW can be approved.`);
  return reasons.concat(contentBlockers(row, consent));
}

/**
 * Why publishing is refused; empty means it may go live.
 * mode 'now'     — the admin's publish/schedule button: needs APPROVED.
 * mode 'release' — the cron releasing a held page: needs SCHEDULED.
 */
export function publishBlockers(
  row: GateRow,
  settings: CaseStudySettings,
  consent: GateConsent,
  mode: 'now' | 'release' = 'now',
): string[] {
  const reasons: string[] = [];
  const wanted = mode === 'release' ? 'SCHEDULED' : 'APPROVED';
  if (row.status !== wanted) reasons.push(`Status is ${row.status}; only ${wanted} can be published here.`);
  if (!row.approvedAt) reasons.push('Not approved.');
  reasons.push(...contentBlockers(row, consent));
  if (row.type === 'FC_DECISION' && !settings.courtPagesClearedByCounsel) {
    reasons.push('Court-decision pages are switched off until counsel clears them.');
  }
  if (row.type === 'CLIENT_CASE' && !settings.clientCasesEnabled) {
    reasons.push('Client cases are switched off until counsel reviews the consent form.');
  }
  return reasons;
}

// ---------------------------------------------------------------------------
// Serialising for the admin API
// ---------------------------------------------------------------------------

export function serialiseCaseStudy(row: CaseStudy) {
  return {
    ...row,
    issues: parseJsonArray(row.issues) ?? [],
    lessons: parseJsonArray(row.lessons) ?? [],
    claims: parseJsonArray<StoredClaim>(row.claims) ?? [],
    faq: parseJsonArray<{ q: string; a: string }>(row.faq) ?? [],
    redLines: parseJsonArray<RedLineHit>(row.redLines) ?? [],
  };
}
export type SerialisedCaseStudy = ReturnType<typeof serialiseCaseStudy>;

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

export type Failure = { ok: false; status: 400 | 404 | 409; error: string; reasons: string[] };
const fail = (status: Failure['status'], error: string, reasons: string[] = []): Failure => ({ ok: false, status, error, reasons });
const STALE = 'The case changed while you were looking at it. Reload and try again.';

async function loadWithConsent(id: string) {
  const row = await prisma.caseStudy.findUnique({ where: { id } });
  if (!row) return null;
  const consent = row.consentRecordId
    ? await prisma.consentRecord.findUnique({ where: { id: row.consentRecordId } })
    : null;
  return { row, consent };
}

// ---------------------------------------------------------------------------
// Ingest (agent POST)
// ---------------------------------------------------------------------------

export function scanCase(p: Pick<CaseStudyPayload, 'content' | 'title' | 'excerpt' | 'keyTakeaway' | 'locale'>): RedLineHit[] {
  const text = [htmlToText(p.content), p.title, p.excerpt ?? '', p.keyTakeaway ?? ''].join('\n');
  return scanRedLines(text, p.locale);
}

export type IngestResult =
  | { ok: true; row: CaseStudy; created: boolean; redLines: RedLineHit[] }
  | Failure;

/** Create in IN_REVIEW, or replace a DRAFT/IN_REVIEW row with the same (locale, slug). Never publishes. */
export async function ingestCaseStudy(p: CaseStudyPayload): Promise<IngestResult> {
  if (p.consentRecordId) {
    const consent = await prisma.consentRecord.findUnique({ where: { id: p.consentRecordId } });
    if (!consent) return fail(400, 'consentRecordId does not exist');
  }
  const redLines = scanCase(p);
  const data = {
    groupKey: p.groupKey,
    type: p.type,
    status: 'IN_REVIEW',
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    keyTakeaway: p.keyTakeaway,
    summaryEn: p.summaryEn,
    court: p.court,
    citation: p.citation,
    decisionDate: p.decisionDate,
    judge: p.judge,
    route: p.route,
    country: p.country,
    outcome: p.outcome,
    officialUrl: p.officialUrl,
    issues: JSON.stringify(p.issues),
    lessons: JSON.stringify(p.lessons),
    claims: JSON.stringify(p.claims.map((c) => ({ ...c, verified: false }))),
    faq: JSON.stringify(p.faq),
    redLines: JSON.stringify(redLines),
    sourceSha256: p.sourceSha256,
    fetchedAt: p.fetchedAt,
    certifiedQuestion: p.certifiedQuestion,
    consentRecordId: p.consentRecordId,
    aiModel: p.aiModel,
    approvedBy: null,
    approvedAt: null,
    publishAt: null,
  } satisfies Prisma.CaseStudyUncheckedUpdateInput;

  try {
    const existing = await prisma.caseStudy.findUnique({
      where: { locale_slug: { locale: p.locale, slug: p.slug } },
      select: { id: true, status: true },
    });
    if (!existing) {
      const row = await prisma.caseStudy.create({ data: { ...data, locale: p.locale, slug: p.slug } });
      return { ok: true, row, created: true, redLines };
    }
    if (existing.status !== 'DRAFT' && existing.status !== 'IN_REVIEW') {
      return fail(409, `A case with this slug is ${existing.status}; a repost only replaces DRAFT or IN_REVIEW. Reopen it in admin first.`);
    }
    const { count } = await prisma.caseStudy.updateMany({
      where: { id: existing.id, status: { in: ['DRAFT', 'IN_REVIEW'] } },
      data,
    });
    if (!count) return fail(409, 'The case left review while the repost was saved. Reopen it in admin first.');
    const row = await prisma.caseStudy.findUniqueOrThrow({ where: { id: existing.id } });
    return { ok: true, row, created: false, redLines };
  } catch (e) {
    if (isUniqueViolation(e)) return fail(409, 'Another case already uses this groupKey in this locale.');
    throw e;
  }
}

function isUniqueViolation(e: unknown): boolean {
  return typeof e === 'object' && e !== null && (e as { code?: unknown }).code === 'P2002';
}

// ---------------------------------------------------------------------------
// Claim ticks (admin)
// ---------------------------------------------------------------------------

export type ClaimTickResult = { ok: true; claimsChecked: number; claimsTotal: number } | Failure;

export async function setClaimVerified(id: string, claimId: string, verified: boolean): Promise<ClaimTickResult> {
  // Optimistic concurrency on updatedAt; quick successive ticks retry rather than fail.
  for (let attempt = 0; attempt < 3; attempt++) {
    const row = await prisma.caseStudy.findUnique({ where: { id } });
    if (!row) return fail(404, 'Case not found');
    if (row.status !== 'IN_REVIEW') return fail(409, `Claims can only be ticked while IN_REVIEW (status is ${row.status}).`);
    const claims = parseJsonArray<StoredClaim>(row.claims);
    if (claims === null) return fail(409, 'Claims are unreadable.');
    const claim = claims.find((c) => c.id === claimId);
    if (!claim) return fail(404, 'Claim not found');
    claim.verified = verified;
    const json = JSON.stringify(claims);
    const { count } = await prisma.caseStudy.updateMany({
      where: { id, status: 'IN_REVIEW', updatedAt: row.updatedAt },
      data: { claims: json },
    });
    if (count) return { ok: true, ...claimCounts(json) };
  }
  return fail(409, STALE);
}

// ---------------------------------------------------------------------------
// Transitions (admin)
// ---------------------------------------------------------------------------

export type TransitionResult = { ok: true; item: SerialisedCaseStudy } | Failure;
export type TransitionOptions = { username: string; publishAt?: Date; reason?: string; now?: Date };

export async function transitionCaseStudy(
  id: string,
  action: TransitionAction,
  opts: TransitionOptions,
): Promise<TransitionResult> {
  const now = opts.now ?? new Date();
  const loaded = await loadWithConsent(id);
  if (!loaded) return fail(404, 'Case not found');
  const { row, consent } = loaded;
  let where: Prisma.CaseStudyWhereInput;
  let data: Prisma.CaseStudyUncheckedUpdateManyInput;

  switch (action) {
    case 'submit': {
      if (row.status !== 'DRAFT') return fail(409, 'Cannot submit', [`Status is ${row.status}; only DRAFT can be submitted.`]);
      where = { id, status: 'DRAFT' };
      data = { status: 'IN_REVIEW' };
      break;
    }
    case 'approve': {
      const reasons = approvalBlockers(row, consent);
      if (reasons.length) return fail(409, 'Cannot approve', reasons);
      where = { id, status: 'IN_REVIEW', updatedAt: row.updatedAt };
      data = { status: 'APPROVED', approvedBy: opts.username, approvedAt: now };
      break;
    }
    case 'schedule': {
      if (!opts.publishAt || Number.isNaN(opts.publishAt.getTime())) return fail(400, 'publishAt is required');
      if (opts.publishAt.getTime() <= now.getTime()) return fail(400, 'publishAt must be in the future');
      // Scheduling is refused for anything that could not publish now; the cron re-checks at release.
      const reasons = publishBlockers(row, await getCaseStudySettings(), consent, 'now');
      if (reasons.length) return fail(409, 'Cannot schedule', reasons);
      where = { id, status: 'APPROVED', approvedAt: { not: null }, updatedAt: row.updatedAt };
      data = { status: 'SCHEDULED', publishAt: opts.publishAt };
      break;
    }
    case 'publish': {
      const reasons = publishBlockers(row, await getCaseStudySettings(), consent, 'now');
      if (reasons.length) return fail(409, 'Cannot publish', reasons);
      where = { id, status: 'APPROVED', approvedAt: { not: null }, updatedAt: row.updatedAt };
      data = { status: 'PUBLISHED', publishedAt: now };
      break;
    }
    case 'reopen': {
      if (row.status !== 'APPROVED' && row.status !== 'SCHEDULED') {
        return fail(409, 'Cannot reopen', [`Status is ${row.status}; only APPROVED or SCHEDULED can be reopened.`]);
      }
      where = { id, status: { in: ['APPROVED', 'SCHEDULED'] } };
      data = { status: 'IN_REVIEW', approvedBy: null, approvedAt: null, publishAt: null };
      break;
    }
    case 'withdraw': {
      const reason = opts.reason?.trim();
      if (!reason) return fail(400, 'A reason is required to withdraw');
      if (reason.length > 1000) return fail(400, 'reason is over 1000 characters');
      if (row.status === 'WITHDRAWN') return fail(409, 'Cannot withdraw', ['Already withdrawn.']);
      where = { id, status: { not: 'WITHDRAWN' } };
      data = { status: 'WITHDRAWN', withdrawnAt: now, withdrawnReason: reason };
      break;
    }
  }

  const { count } = await prisma.caseStudy.updateMany({ where, data });
  if (!count) return fail(409, STALE, [STALE]);
  console.info(`[case-studies] ${action} ${id} (${row.status}) by ${opts.username}`);
  const updated = await prisma.caseStudy.findUniqueOrThrow({ where: { id } });
  return { ok: true, item: serialiseCaseStudy(updated) };
}

// ---------------------------------------------------------------------------
// Consent revocation
// ---------------------------------------------------------------------------

export type RevokeResult = { ok: true; withdrawn: number } | Failure;

/** Revoke a consent and withdraw every linked case, in one transaction. */
export async function revokeConsent(id: string, reason: string, username: string, now = new Date()): Promise<RevokeResult> {
  const result = await prisma.$transaction(async (tx): Promise<RevokeResult> => {
    const consent = await tx.consentRecord.findUnique({ where: { id } });
    if (!consent) return fail(404, 'Consent record not found');
    if (consent.revokedAt) return fail(409, 'Consent is already revoked');
    await tx.consentRecord.update({ where: { id }, data: { revokedAt: now, revokedReason: reason } });
    const { count } = await tx.caseStudy.updateMany({
      where: { consentRecordId: id, status: { not: 'WITHDRAWN' } },
      data: { status: 'WITHDRAWN', withdrawnAt: now, withdrawnReason: `Consent revoked: ${reason}` },
    });
    return { ok: true, withdrawn: count };
  });
  if (result.ok) console.info(`[case-studies] consent ${id} revoked by ${username}; ${result.withdrawn} cases withdrawn`);
  return result;
}

// ---------------------------------------------------------------------------
// Scheduled release (15-minute sources cron)
// ---------------------------------------------------------------------------

export type ReleaseResult = { released: string[]; held: { id: string; reasons: string[] }[] };

/** Publish every SCHEDULED case whose time has come and whose gate still passes. Safe to call often. */
export async function releaseDueCaseStudies(now = new Date(), limit = 10): Promise<ReleaseResult> {
  const due = await prisma.caseStudy.findMany({
    where: { status: 'SCHEDULED', publishAt: { lte: now }, approvedAt: { not: null } },
    orderBy: { publishAt: 'asc' },
    take: limit,
  });
  const out: ReleaseResult = { released: [], held: [] };
  if (!due.length) return out;
  const settings = await getCaseStudySettings();
  for (const row of due) {
    const consent = row.consentRecordId
      ? await prisma.consentRecord.findUnique({ where: { id: row.consentRecordId } })
      : null;
    const reasons = publishBlockers(row, settings, consent, 'release');
    if (reasons.length) {
      out.held.push({ id: row.id, reasons });
      continue;
    }
    const { count } = await prisma.caseStudy.updateMany({
      where: { id: row.id, status: 'SCHEDULED', approvedAt: { not: null }, publishAt: { lte: now } },
      data: { status: 'PUBLISHED', publishedAt: now },
    });
    if (count) out.released.push(`${row.locale}/${row.slug}`);
  }
  return out;
}
