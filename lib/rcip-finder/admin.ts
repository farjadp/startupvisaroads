// ============================================================================
// lib/rcip-finder/admin.ts
// Read side of /admin/finder: who signed up to the RCIP employer finder, how
// far each got, open "this contact is wrong" reports, and the contact policy.
// Admin pages only; the middleware guards /admin and the actions re-check.
// ============================================================================
import prisma from '@/lib/prisma';
import { CONTACT_POLICY_KEY, STEPS, TABLES, monthStart, quotaFor, type ContactPolicy } from './core';
import { contactSettings } from './service';

export const USER_PAGE = 100;

export type FinderFilter = 'all' | 'optin' | 'verified';
export const isFinderFilter = (v: unknown): v is FinderFilter => v === 'all' || v === 'optin' || v === 'verified';

export type AdminUserRow = {
  id: string;
  email: string;
  createdAt: Date;
  verifiedAt: Date | null;
  lastSeenAt: Date | null;
  marketingOptIn: boolean;
  noc: string | null;
  occupation: string | null;
  experience: string | null;
  clb: number | null;
  steps: number;
  quota: number;
  usedThisMonth: number;
  revealsTotal: number;
};

export type AdminReportRow = {
  id: string;
  reason: string;
  note: string | null;
  createdAt: Date;
  employerName: string;
  community: string;
  reporterEmail: string | null;
};

export type FinderAdminData = {
  totals: { users: number; verified: number; optIn: number; reveals: number; revealsThisMonth: number; openReports: number };
  users: AdminUserRow[];
  matching: number;
  page: number;
  pages: number;
  reports: AdminReportRow[];
  policy: ContactPolicy;
  policySaved: boolean;
  blocked: string[];
};

export function userWhere(filter: FinderFilter, q: string | null) {
  return {
    ...(filter === 'optin' ? { marketingOptIn: true } : {}),
    ...(filter === 'verified' ? { verifiedAt: { not: null } } : {}),
    ...(q ? { email: { contains: q.toLowerCase() } } : {}),
  };
}

export async function loadFinderAdmin(opts: { filter: FinderFilter; q: string | null; page: number; now?: Date }): Promise<FinderAdminData> {
  const since = monthStart(opts.now ?? new Date());
  const where = userWhere(opts.filter, opts.q);

  const [users, verified, optIn, reveals, revealsThisMonth, openReports, matching, policyRow] = await Promise.all([
    prisma.finderUser.count(),
    prisma.finderUser.count({ where: { verifiedAt: { not: null } } }),
    prisma.finderUser.count({ where: { marketingOptIn: true } }),
    prisma.contactReveal.count(),
    prisma.contactReveal.count({ where: { createdAt: { gte: since } } }),
    prisma.contactReport.count({ where: { resolvedAt: null } }),
    prisma.finderUser.count({ where }),
    prisma.setting.findUnique({ where: { key: CONTACT_POLICY_KEY } }),
  ]);

  const pages = Math.max(1, Math.ceil(matching / USER_PAGE));
  const page = Math.min(Math.max(1, opts.page), pages);
  const rows = await prisma.finderUser.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * USER_PAGE,
    take: USER_PAGE,
    include: { steps: { select: { step: true } }, _count: { select: { reveals: true } } },
  });
  const monthly = rows.length
    ? await prisma.contactReveal.groupBy({ by: ['userId'], where: { userId: { in: rows.map((r) => r.id) }, createdAt: { gte: since } }, _count: { _all: true } })
    : [];
  const usedBy = new Map(monthly.map((m) => [m.userId, m._count._all]));

  const reportRows = await prisma.contactReport.findMany({
    where: { resolvedAt: null },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { employer: { select: { name: true, community: true } } },
  });
  const reporterIds = [...new Set(reportRows.map((r) => r.userId).filter((x): x is string => !!x))];
  const reporters = reporterIds.length
    ? new Map((await prisma.finderUser.findMany({ where: { id: { in: reporterIds } }, select: { id: true, email: true } })).map((u) => [u.id, u.email]))
    : new Map<string, string>();

  const { policy, blocked } = await contactSettings();
  const nocs = TABLES.nocs as Record<string, string>;

  return {
    totals: { users, verified, optIn, reveals, revealsThisMonth, openReports },
    users: rows.map((u) => {
      const done = u.steps.map((s) => s.step);
      return {
        id: u.id,
        email: u.email,
        createdAt: u.createdAt,
        verifiedAt: u.verifiedAt,
        lastSeenAt: u.lastSeenAt,
        marketingOptIn: u.marketingOptIn,
        noc: u.noc,
        occupation: u.noc ? nocs[u.noc] ?? null : null,
        experience: u.experience,
        clb: u.clb,
        steps: STEPS.filter((s) => done.includes(s)).length,
        quota: quotaFor(done),
        usedThisMonth: usedBy.get(u.id) ?? 0,
        revealsTotal: u._count.reveals,
      };
    }),
    matching,
    page,
    pages,
    reports: reportRows.map((r) => ({
      id: r.id,
      reason: r.reason,
      note: r.note,
      createdAt: r.createdAt,
      employerName: r.employer.name,
      community: r.employer.community,
      reporterEmail: r.userId ? reporters.get(r.userId) ?? null : null,
    })),
    policy,
    policySaved: !!policyRow,
    blocked,
  };
}

/** One email per line, for pasting into a CASL-compliant send: opted-in only. */
export async function optInEmails(): Promise<string[]> {
  const rows = await prisma.finderUser.findMany({ where: { marketingOptIn: true }, orderBy: { createdAt: 'asc' }, select: { email: true } });
  return rows.map((r) => r.email);
}
