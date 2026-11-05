import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import prisma from '@/lib/prisma';
import type { AgentReportPayload } from '@/lib/agent-reports/report';
import { ExternalLinks, ItemList, MetricTile, TelegramBadge, agentName, fmtDate } from '@/components/admin/AgentReports';

export const dynamic = 'force-dynamic';

function payloadOf(json: string): AgentReportPayload | null {
  try {
    return JSON.parse(json) as AgentReportPayload;
  } catch {
    return null;
  }
}

export default async function AgentReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await prisma.agentReport.findUnique({ where: { id } });
  if (!row) notFound();
  const p = payloadOf(row.payload);
  const loc = row.locale === 'en' ? 'en' : 'fa';
  const fa = loc === 'fa';

  // Each metric's trend: the same label in this agent's earlier reports.
  const earlier = await prisma.agentReport
    .findMany({ where: { agent: row.agent, createdAt: { lte: row.createdAt } }, orderBy: { createdAt: 'desc' }, take: 10, select: { payload: true } })
    .catch(() => []);
  const history = (label: string): number[] =>
    earlier
      .map((e) => payloadOf(e.payload)?.metrics?.find((m) => m.label === label)?.value)
      .filter((v): v is number => typeof v === 'number')
      .reverse();

  return (
    <div className="max-w-5xl">
      <Link href={`/en/admin/reports?agent=${row.agent}`} className="inline-flex items-center gap-1.5 text-sm text-[#1a1a1a]/60 hover:text-[#1a1a1a] mb-6 font-sans">
        <ArrowLeft className="w-4 h-4" /> All reports
      </Link>

      <div className="flex flex-wrap items-center gap-2 mb-4 font-sans">
        <span className="rounded-full bg-[#1a1a1a] text-[#CCFF00] px-3 py-0.5 text-xs font-semibold">{agentName(row.agent, 'en')}</span>
        <span className="text-xs text-[#1a1a1a]/50 uppercase tracking-widest">{row.job}</span>
        <span className="text-xs text-[#1a1a1a]/40">· {fmtDate(row.createdAt, 'en')}</span>
        <span className="ms-auto"><TelegramBadge status={row.telegramStatus} error={row.telegramError} /></span>
      </div>
      {row.telegramStatus === 'failed' && row.telegramError && (
        <p className="mb-4 text-xs text-red-700 font-sans">Telegram: {row.telegramError}</p>
      )}

      <div dir={fa ? 'rtl' : 'ltr'} className={fa ? 'font-vazir' : 'font-sans'}>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3 leading-tight">{row.title}</h1>
        {p?.period && (
          <p className="text-xs text-[#1a1a1a]/45 mb-3" dir="ltr">{p.period.from} → {p.period.to}</p>
        )}
        <p className="text-base text-[#1a1a1a]/75 leading-loose whitespace-pre-line mb-8">{row.summary}</p>

        {!p && <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">This report's stored data could not be read.</p>}

        {p && p.actions.length > 0 && (
          <section className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="flex items-center gap-2 font-bold text-amber-900 mb-3">
              <AlertTriangle className="w-5 h-5" />
              {fa ? 'تصمیم‌هایی که با شماست' : 'Decisions for you'}
            </h2>
            <ol className={`space-y-2 ps-5 text-sm text-amber-950 leading-relaxed ${fa ? '[list-style-type:persian]' : 'list-decimal'}`}>
              {p.actions.map((a, i) => <li key={i}>{a}</li>)}
            </ol>
          </section>
        )}

        {p && p.metrics.length > 0 && (
          <section className="mb-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {p.metrics.map((m, i) => (
              <MetricTile key={i} m={m} locale={loc} history={typeof m.value === 'number' ? history(m.label) : []} />
            ))}
          </section>
        )}

        {p?.sections.map((s, i) => (
          <section key={i} className="mb-6 bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-3">{s.heading}</h2>
            {s.body && <p className="text-sm text-[#1a1a1a]/75 leading-loose whitespace-pre-line mb-2">{s.body}</p>}
            {s.items && <ItemList items={s.items} locale={loc} />}
          </section>
        ))}

        {p && p.links.length > 0 && (
          <div className="mt-8"><ExternalLinks links={p.links} /></div>
        )}
      </div>
    </div>
  );
}
