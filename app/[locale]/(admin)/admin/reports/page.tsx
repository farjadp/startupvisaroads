import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { AGENTS, type AgentReportPayload } from '@/lib/agent-reports/report';
import { AgentFilter, TelegramBadge, agentName, fmtDate } from '@/components/admin/AgentReports';

export const dynamic = 'force-dynamic';

function payloadOf(json: string): Partial<AgentReportPayload> {
  try {
    return JSON.parse(json) as AgentReportPayload;
  } catch {
    return {};
  }
}

export default async function AgentReportsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = (await searchParams).agent;
  const agent = typeof q === 'string' && q in AGENTS ? q : null;

  let rows: Awaited<ReturnType<typeof prisma.agentReport.findMany>> = [];
  let counts: Record<string, number> = {};
  let warning: string | null = null;
  try {
    const [list, grouped] = await Promise.all([
      prisma.agentReport.findMany({ where: agent ? { agent } : {}, orderBy: { createdAt: 'desc' }, take: 60 }),
      prisma.agentReport.groupBy({ by: ['agent'], _count: { _all: true } }),
    ]);
    rows = list;
    counts = Object.fromEntries(grouped.map((g) => [g.agent, g._count._all]));
  } catch (e) {
    console.error('admin/reports: query failed', e);
    warning = 'Reports are unavailable right now: the database did not answer.';
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">Agent reports</h1>
        <p className="font-sans text-[#1a1a1a]/60">What market-intel, the SEO strategist, the fact-checker and the AI-visibility tracker found. Each one is also sent to Telegram.</p>
      </div>

      <div className="mb-6">
        <AgentFilter current={agent} counts={counts} />
      </div>

      {warning && <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">{warning}</p>}

      {!warning && rows.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#1a1a1a]/15 bg-white/60 p-10 text-center">
          <p className="font-serif text-2xl text-[#1a1a1a] mb-2">No reports yet</p>
          <p className="text-sm text-[#1a1a1a]/60">An agent posts here when it finishes a run: <code className="text-xs">node scripts/post-agent-report.mjs report.json</code></p>
        </div>
      )}

      <ul className="space-y-3">
        {rows.map((r) => {
          const p = payloadOf(r.payload);
          const loc = r.locale === 'en' ? 'en' : 'fa';
          const p1 = (p.sections ?? []).flatMap((s) => s.items ?? []).filter((i) => i.priority === 'P1').length;
          return (
            <li key={r.id}>
              <Link href={`/en/admin/reports/${r.id}`} className="block bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-5 hover:border-[#1a1a1a]/20 transition-colors">
                <div className="flex flex-wrap items-center gap-2 mb-3 font-sans">
                  <span className="rounded-full bg-[#1a1a1a] text-[#CCFF00] px-3 py-0.5 text-xs font-semibold">{agentName(r.agent, 'en')}</span>
                  <span className="text-xs text-[#1a1a1a]/50 uppercase tracking-widest">{r.job}</span>
                  <span className="text-xs text-[#1a1a1a]/40">· {fmtDate(r.createdAt, 'en')}</span>
                  <span className="ms-auto flex items-center gap-2">
                    {(p.actions?.length ?? 0) > 0 && (
                      <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[11px] font-semibold">{p.actions!.length} decision{p.actions!.length > 1 ? 's' : ''}</span>
                    )}
                    {p1 > 0 && <span className="rounded-full bg-[#CCFF00] text-[#1a1a1a] px-2 py-0.5 text-[11px] font-semibold">{p1} P1</span>}
                    <TelegramBadge status={r.telegramStatus} error={r.telegramError} />
                  </span>
                </div>
                <div dir={loc === 'fa' ? 'rtl' : 'ltr'} className={loc === 'fa' ? 'font-vazir' : 'font-sans'}>
                  <p className="text-lg text-[#1a1a1a] font-semibold mb-1">{r.title}</p>
                  <p className="text-sm text-[#1a1a1a]/60 leading-relaxed line-clamp-2">{r.summary}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
