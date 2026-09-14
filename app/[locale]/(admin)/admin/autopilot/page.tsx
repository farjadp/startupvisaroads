import React from 'react';
import prisma from '@/lib/prisma';
import AutopilotConsole, { type RunRow } from '@/components/admin/AutopilotConsole';

export const dynamic = 'force-dynamic';

export default async function AutopilotPage() {
  const since7d = new Date(Date.now() - 7 * 864e5);

  const [runs, ledger, published7d, recentSkips] = await Promise.all([
    prisma.autopilotRun.findMany({ orderBy: { startedAt: 'desc' }, take: 30 }),
    prisma.sourceDocument.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.article.count({ where: { aiModel: { not: null }, status: 'PUBLISHED', createdAt: { gte: since7d } } }),
    prisma.sourceDocument.findMany({
      where: { status: { in: ['ignored', 'failed'] } },
      orderBy: { updatedAt: 'desc' },
      take: 12,
      select: { title: true, status: true, reason: true, updatedAt: true, source: { select: { title: true, url: true } } },
    }),
  ]);

  const ledgerCounts = Object.fromEntries(ledger.map((l) => [l.status, l._count._all])) as Record<string, number>;

  const rows: RunRow[] = runs.map((r) => ({
    id: r.id,
    startedAt: r.startedAt.toISOString(),
    finishedAt: r.finishedAt?.toISOString() ?? null,
    locale: r.locale,
    mode: r.mode,
    requested: r.requested,
    created: r.created,
    errors: r.errors,
    skipped: r.skipped,
    notes: r.notes,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Content Autopilot</h1>
        <p className="font-sans text-[#1a1a1a]/60">What the daily writers did, what they refused, and a manual trigger.</p>
      </div>

      <AutopilotConsole
        initialRuns={rows}
        stats={{
          published7d,
          // SourceDocument's states: `ready` is triaged and waiting, `used`
          // written from, `ignored`/`failed` refused. `new` is discovered but
          // not yet read, so it counts as waiting too.
          ledgerNew: (ledgerCounts.ready ?? 0) + (ledgerCounts.new ?? 0),
          ledgerUsed: ledgerCounts.used ?? 0,
          ledgerSkipped: (ledgerCounts.ignored ?? 0) + (ledgerCounts.failed ?? 0),
        }}
        recentSkips={recentSkips.map((s) => ({
          title: s.title,
          sourceSlug: s.source.title ?? s.source.url ?? 'source',
          status: s.status,
          reason: s.reason,
          updatedAt: s.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
