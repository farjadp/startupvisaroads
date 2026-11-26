// ============================================================================
// lib/rcip-finder/service.ts
// Database side of the RCIP employer finder. Public reads never select the
// contact columns; contacts leave the database only in revealedContacts(),
// for rows the signed-in visitor has revealed.
// ============================================================================
import { createHash } from 'crypto';
import prisma from '@/lib/prisma';
import {
  CONTACT_POLICY_KEY,
  MAX_PAGES,
  NO_CONTACT_COMMUNITIES_KEY,
  PAGE_SIZE,
  SOLICITATION_NOTICE_COMMUNITIES,
  contactFor,
  matchRule,
  monthStart,
  nextStep,
  quotaFor,
  rankCandidates,
  type Contact,
  type ContactPolicy,
  type Step,
} from './core';

// ── Policy ──────────────────────────────────────────────────────────────────

export async function contactSettings(): Promise<{ policy: ContactPolicy; blocked: string[] }> {
  const rows = await prisma.setting.findMany({ where: { key: { in: [CONTACT_POLICY_KEY, NO_CONTACT_COMMUNITIES_KEY] } } });
  const raw = rows.find((r) => r.key === CONTACT_POLICY_KEY)?.value;
  // Owner's decision of 26 Nov 2026: show all contacts held. Admin can set 'safe' or 'off'.
  const policy: ContactPolicy = raw === 'safe' || raw === 'off' ? raw : 'all';
  let blocked = SOLICITATION_NOTICE_COMMUNITIES;
  const b = rows.find((r) => r.key === NO_CONTACT_COMMUNITIES_KEY)?.value;
  if (b) {
    try {
      const v = JSON.parse(b);
      if (Array.isArray(v)) blocked = v.filter((x): x is string => typeof x === 'string');
    } catch {
      /* keep the default */
    }
  }
  return { policy, blocked };
}

// ── Search ──────────────────────────────────────────────────────────────────

export type ListItem = {
  id: string;
  name: string;
  community: string;
  province: string;
  businessType: string;
  tier: 'core' | 'related';
  communityPostings: number;
  listAsOf: string | null;
  sourceUrl: string;
  closedNote: string | null;
  hasContact: boolean;
  contact: Contact | null;
};

export type ListResult = { total: number; coreTotal: number; page: number; pages: number; items: ListItem[]; capped: boolean };

export async function listEmployers(opts: { noc: string; province?: string | null; page: number; userId?: string | null }): Promise<ListResult> {
  const rule = matchRule(opts.noc);
  const or = [
    ...rule.core.map((k) => ({ businessTypeNorm: { contains: k } })),
    ...(rule.sectors.length ? [{ sector: { in: rule.sectors } }] : []),
  ];
  if (or.length === 0) return { total: 0, coreTotal: 0, page: 1, pages: 0, items: [], capped: false };

  const cands = await prisma.rcipEmployer.findMany({
    where: { OR: or, ...(opts.province ? { province: opts.province } : {}) },
    select: { id: true, community: true, name: true, businessTypeNorm: true, sector: true, closedNote: true },
  });
  const ranked = rankCandidates(cands, rule);
  const reachable = Math.min(ranked.length, PAGE_SIZE * MAX_PAGES);
  const pages = Math.ceil(reachable / PAGE_SIZE);
  const page = Math.min(Math.max(1, opts.page), Math.max(1, pages));
  const slice = ranked.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const rows = await prisma.rcipEmployer.findMany({
    where: { id: { in: slice.map((s) => s.id) } },
    select: {
      id: true, name: true, community: true, province: true, businessType: true, listAsOf: true, sourceUrl: true, closedNote: true,
      // Read to decide hasContact and, for revealed rows only, the contact. Never returned otherwise.
      website: true, phone: true, emails: true, contactSource: true,
    },
  });
  const { policy, blocked } = await contactSettings();
  const revealed = opts.userId
    ? new Set((await prisma.contactReveal.findMany({ where: { userId: opts.userId, employerId: { in: slice.map((s) => s.id) } }, select: { employerId: true } })).map((r) => r.employerId))
    : new Set<string>();
  const byId = new Map(rows.map((r) => [r.id, r]));

  const items: ListItem[] = [];
  for (const s of slice) {
    const r = byId.get(s.id);
    if (!r) continue;
    const contact = contactFor(r, policy, blocked);
    items.push({
      id: r.id, name: r.name, community: r.community, province: r.province, businessType: r.businessType,
      tier: s.tier, communityPostings: s.communityPostings, listAsOf: r.listAsOf, sourceUrl: r.sourceUrl, closedNote: r.closedNote,
      hasContact: !!contact,
      contact: revealed.has(r.id) ? contact : null,
    });
  }
  return { total: ranked.length, coreTotal: ranked.filter((r) => r.tier === 'core').length, page, pages, items, capped: ranked.length > reachable };
}

// ── Account, steps, quota ───────────────────────────────────────────────────

export type Me = {
  email: string;
  profile: { noc: string | null; experience: string | null; clb: number | null };
  steps: string[];
  next: Step | null;
  quota: number;
  used: number;
  marketingOptIn: boolean;
};

export async function getMe(userId: string, now = new Date()): Promise<Me | null> {
  const u = await prisma.finderUser.findUnique({ where: { id: userId }, include: { steps: { select: { step: true } } } });
  if (!u) return null;
  const steps = u.steps.map((s) => s.step);
  const used = await prisma.contactReveal.count({ where: { userId, createdAt: { gte: monthStart(now) } } });
  return {
    email: u.email,
    profile: { noc: u.noc, experience: u.experience, clb: u.clb },
    steps,
    next: nextStep(steps),
    quota: quotaFor(steps),
    used,
    marketingOptIn: u.marketingOptIn,
  };
}

export async function completeStep(userId: string, step: Step) {
  await prisma.finderStep.upsert({ where: { userId_step: { userId, step } }, update: {}, create: { userId, step } });
}

export type RevealResult =
  | { ok: true; contact: Contact | null; alreadyRevealed: boolean }
  | { ok: false; error: 'not_found' | 'no_contact' | 'quota' };

/**
 * Reveal one row's contact. Already revealed rows cost nothing. The count
 * check and the insert run in one serialisable transaction so two quick
 * clicks cannot spend more than the quota.
 */
export async function reveal(userId: string, employerId: string, now = new Date()): Promise<RevealResult> {
  const row = await prisma.rcipEmployer.findUnique({
    where: { id: employerId },
    select: { id: true, community: true, website: true, phone: true, emails: true, contactSource: true },
  });
  if (!row) return { ok: false, error: 'not_found' };
  const { policy, blocked } = await contactSettings();
  const contact = contactFor(row, policy, blocked);
  if (!contact) return { ok: false, error: 'no_contact' };

  return prisma.$transaction(
    async (tx) => {
      const existing = await tx.contactReveal.findUnique({ where: { userId_employerId: { userId, employerId } } });
      if (existing) return { ok: true as const, contact, alreadyRevealed: true };
      const [steps, used] = await Promise.all([
        tx.finderStep.findMany({ where: { userId }, select: { step: true } }),
        tx.contactReveal.count({ where: { userId, createdAt: { gte: monthStart(now) } } }),
      ]);
      if (used >= quotaFor(steps.map((s) => s.step))) return { ok: false as const, error: 'quota' as const };
      await tx.contactReveal.create({ data: { userId, employerId } });
      return { ok: true as const, contact, alreadyRevealed: false };
    },
    { isolationLevel: process.env.DATABASE_URL?.startsWith('file:') ? undefined : 'Serializable' },
  );
}

// ── Import ──────────────────────────────────────────────────────────────────

export type ImportRow = {
  community: string;
  province: string;
  name: string;
  address?: string;
  businessType: string;
  sector: string | null;
  listedSector?: string | null;
  listAsOf?: string | null;
  sourceUrl: string;
  closedNote?: string | null;
  website?: string | null;
  phone?: string | null;
  emails?: string[];
  contactSource: string;
};

const str = (v: unknown, max: number) => (typeof v === 'string' && v.trim() && v.length <= max ? v.trim() : null);
const SOURCES = new Set(['source_list', 'ai_verify', 'ai_low', 'none']);
const fold = (s: string) => s.toLowerCase().normalize('NFKC').replace(/\s+/g, ' ').trim();

/** Validate one import row; returns the cleaned row or a reason. */
export function parseImportRow(raw: unknown): { ok: true; row: ImportRow } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'not an object' };
  const r = raw as Record<string, unknown>;
  const community = str(r.community, 80);
  const province = str(r.province, 4);
  const name = str(r.name, 300);
  const businessType = str(r.businessType, 200) ?? 'unknown';
  const sourceUrl = str(r.sourceUrl, 1000);
  if (!community || !province || !name || !sourceUrl) return { ok: false, error: 'community, province, name and sourceUrl are required' };
  if (!/^https?:\/\//.test(sourceUrl)) return { ok: false, error: 'sourceUrl must be http(s)' };
  const website = str(r.website, 500);
  const contactSource = typeof r.contactSource === 'string' && SOURCES.has(r.contactSource) ? r.contactSource : 'none';
  const emails = Array.isArray(r.emails) ? r.emails.filter((e): e is string => typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim())).map((e) => e.trim().toLowerCase()).slice(0, 10) : [];
  const closed = r.closedNote === 'excluded' || r.closedNote === 'not_accepting' ? r.closedNote : null;
  return {
    ok: true,
    row: {
      community, province, name, businessType, sourceUrl, contactSource, emails,
      address: str(r.address, 300) ?? '',
      sector: str(r.sector, 8),
      listedSector: str(r.listedSector, 120),
      listAsOf: str(r.listAsOf, 40),
      closedNote: closed,
      website: website && /^https?:\/\//.test(website) ? website : null,
      phone: str(r.phone, 40),
    },
  };
}

export const importKey = (r: Pick<ImportRow, 'community' | 'name' | 'address'>) =>
  createHash('sha256').update(`${fold(r.community)}|${fold(r.name)}|${fold(r.address ?? '')}`).digest('hex');

export async function upsertEmployers(rows: ImportRow[], edition: string) {
  let created = 0;
  let updated = 0;
  for (const r of rows) {
    const key = importKey(r);
    const data = {
      edition, community: r.community, province: r.province, name: r.name, nameNorm: fold(r.name),
      businessType: r.businessType, businessTypeNorm: fold(r.businessType), sector: r.sector,
      listedSector: r.listedSector ?? null, listAsOf: r.listAsOf ?? null, sourceUrl: r.sourceUrl, closedNote: r.closedNote ?? null,
      website: r.website ?? null, phone: r.phone ?? null, emails: JSON.stringify(r.emails ?? []), contactSource: r.contactSource,
    };
    const existing = await prisma.rcipEmployer.findUnique({ where: { key }, select: { id: true } });
    if (existing) {
      await prisma.rcipEmployer.update({ where: { key }, data });
      updated++;
    } else {
      await prisma.rcipEmployer.create({ data: { key, ...data } });
      created++;
    }
  }
  return { created, updated };
}
