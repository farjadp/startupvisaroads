// Server-rendered pieces of /admin/reports. No client JS: every value is agent
// output and is rendered as text, never as HTML.

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ExternalLink, Send, CircleSlash, Clock } from 'lucide-react';
import { AGENTS, formatDelta, localNumber, type AgentId, type Item, type Metric } from '@/lib/agent-reports/report';

export function agentName(agent: string, locale: 'fa' | 'en' = 'fa'): string {
  return agent in AGENTS ? AGENTS[agent as AgentId][locale] : agent;
}

export function fmtDate(d: Date, locale: 'fa' | 'en'): string {
  return new Intl.DateTimeFormat(locale === 'fa' ? 'fa-IR' : 'en-CA', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Toronto',
  }).format(d);
}

export function TelegramBadge({ status, error }: { status: string; error?: string | null }) {
  const map: Record<string, { cls: string; label: string; Icon: typeof Send }> = {
    sent: { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Telegram sent', Icon: Send },
    failed: { cls: 'bg-red-50 text-red-700 border-red-200', label: 'Telegram failed', Icon: AlertTriangle },
    skipped: { cls: 'bg-[#1a1a1a]/5 text-[#1a1a1a]/50 border-[#1a1a1a]/10', label: 'Not sent', Icon: CircleSlash },
    pending: { cls: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Sending', Icon: Clock },
  };
  const s = map[status] ?? map.pending;
  return (
    <span title={error ?? undefined} className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-sans font-semibold ${s.cls}`}>
      <s.Icon className="w-3 h-3" />
      {s.label}
    </span>
  );
}

/** A trend line from the same metric in this agent's earlier reports, oldest first. */
function Sparkline({ values, good }: { values: number[]; good: boolean }) {
  if (values.length < 2) return null;
  const w = 96;
  const h = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => `${((i / (values.length - 1)) * w).toFixed(1)},${(h - 2 - ((v - min) / span) * (h - 4)).toFixed(1)}`);
  const last = pts[pts.length - 1].split(',');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-24 h-7" aria-hidden="true">
      <polyline points={pts.join(' ')} fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" className={good ? 'stroke-emerald-500' : 'stroke-[#1a1a1a]/40'} />
      <circle cx={last[0]} cy={last[1]} r="2.5" className={good ? 'fill-emerald-500' : 'fill-[#1a1a1a]/50'} />
    </svg>
  );
}

export function MetricTile({ m, locale, history }: { m: Metric; locale: 'fa' | 'en'; history: number[] }) {
  const up = (m.delta ?? 0) > 0;
  const better = m.delta === undefined || m.delta === 0 ? null : (m.higherIsBetter ?? true) === up;
  const trendGood = history.length > 1 ? (history[history.length - 1] >= history[0]) === (m.higherIsBetter ?? true) : false;
  return (
    <div className="bg-white p-5 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-col justify-between gap-3">
      <p className="text-[#1a1a1a]/55 text-xs font-semibold leading-snug">{m.label}</p>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="font-serif text-3xl text-[#1a1a1a] leading-none" dir="ltr">
            {localNumber(m.value, locale)}
            {m.unit && <span className="text-base text-[#1a1a1a]/50 ms-1">{m.unit}</span>}
          </p>
          {better !== null && m.delta !== undefined && (
            <p className={`mt-2 text-xs font-semibold ${better ? 'text-emerald-600' : 'text-red-600'}`} dir="ltr">
              {formatDelta(m.delta, locale)}
            </p>
          )}
        </div>
        <Sparkline values={history} good={trendGood} />
      </div>
    </div>
  );
}

const PRIORITY: Record<string, string> = {
  P1: 'bg-[#CCFF00] text-[#1a1a1a]',
  P2: 'bg-[#1a1a1a]/10 text-[#1a1a1a]',
  P3: 'bg-[#1a1a1a]/5 text-[#1a1a1a]/60',
};

function barClass(score: number): string {
  if (score >= 70) return 'bg-[#1a1a1a]';
  if (score >= 50) return 'bg-[#1a1a1a]/50';
  return 'bg-[#1a1a1a]/25';
}

// Width as one of a fixed set of Tailwind classes, so no inline style is needed.
const WIDTHS = ['w-0', 'w-[5%]', 'w-[10%]', 'w-[15%]', 'w-[20%]', 'w-[25%]', 'w-[30%]', 'w-[35%]', 'w-[40%]', 'w-[45%]', 'w-[50%]', 'w-[55%]', 'w-[60%]', 'w-[65%]', 'w-[70%]', 'w-[75%]', 'w-[80%]', 'w-[85%]', 'w-[90%]', 'w-[95%]', 'w-full'];
const widthFor = (score: number) => WIDTHS[Math.round(Math.max(0, Math.min(100, score)) / 5)];

export function ItemList({ items, locale }: { items: Item[]; locale: 'fa' | 'en' }) {
  const scored = items.some((i) => i.score !== undefined);
  const sorted = scored ? [...items].sort((a, b) => (b.score ?? -1) - (a.score ?? -1)) : items;
  return (
    <ul className="divide-y divide-[#1a1a1a]/5">
      {sorted.map((it, i) => (
        <li key={i} className="py-3 flex flex-col gap-1.5">
          <div className="flex items-start gap-3">
            {it.priority && <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold font-sans ${PRIORITY[it.priority]}`}>{it.priority}</span>}
            <div className="flex-grow min-w-0">
              <p className="text-sm text-[#1a1a1a] leading-relaxed">
                {it.url ? (
                  <a href={it.url} target="_blank" rel="noopener noreferrer nofollow" className="underline decoration-[#1a1a1a]/20 underline-offset-4 hover:decoration-[#1a1a1a]">
                    {it.title}
                  </a>
                ) : (
                  it.title
                )}
              </p>
              {it.note && <p className="text-xs text-[#1a1a1a]/55 mt-1 leading-relaxed">{it.note}</p>}
            </div>
            {it.status && <span className="shrink-0 text-[11px] text-[#1a1a1a]/50 border border-[#1a1a1a]/10 rounded-full px-2 py-0.5">{it.status}</span>}
            {it.score !== undefined && (
              <span className="shrink-0 font-serif text-lg text-[#1a1a1a] w-10 text-end" dir="ltr">
                {localNumber(it.score, locale)}
              </span>
            )}
          </div>
          {it.score !== undefined && (
            <div className="h-1.5 rounded-full bg-[#1a1a1a]/5 overflow-hidden">
              <div className={`h-full rounded-full ${barClass(it.score)} ${widthFor(it.score)}`} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function AgentFilter({ current, counts }: { current: string | null; counts: Record<string, number> }) {
  const chip = (href: string, label: string, active: boolean, n?: number) => (
    <Link
      key={href}
      href={href}
      className={`rounded-full px-4 py-1.5 text-sm font-sans border transition-colors ${active ? 'bg-[#1a1a1a] text-[#F2F0E9] border-[#1a1a1a]' : 'bg-white text-[#1a1a1a]/70 border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30'}`}
    >
      {label}
      {n !== undefined && <span className="ms-2 opacity-60">{n}</span>}
    </Link>
  );
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return (
    <div className="flex flex-wrap gap-2">
      {chip('/en/admin/reports', 'All', !current, total)}
      {(Object.keys(AGENTS) as AgentId[]).map((a) => chip(`/en/admin/reports?agent=${a}`, AGENTS[a].en, current === a, counts[a] ?? 0))}
    </div>
  );
}

export function ExternalLinks({ links }: { links: { label: string; url: string }[] }) {
  if (!links.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((l, i) => (
        <a key={i} href={l.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#1a1a1a]/10 px-3 py-1.5 text-sm hover:border-[#1a1a1a]/30">
          <ExternalLink className="w-3.5 h-3.5" />
          {l.label}
        </a>
      ))}
    </div>
  );
}
