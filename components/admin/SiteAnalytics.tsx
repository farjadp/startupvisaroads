// ============================================================================
// Server-rendered pieces of the admin home's Search Console and GA4 sections.
// No client JS: the en/fa switch is a link with ?site=, the chart is an SVG.
// ============================================================================
import React from 'react';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, PlugZap, TriangleAlert } from 'lucide-react';
import type { Panel } from '@/lib/site-analytics';
import { displayPath, percentChange, type DailyPoint, type SiteFilter } from '@/lib/site-analytics/shape';

const int = new Intl.NumberFormat('en-US');
export const fmtInt = (n: number) => int.format(Math.round(n));
export const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`;
export const fmtPos = (n: number) => (n ? n.toFixed(1) : '–');

function fmtDay(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

export function windowLabel(w: { startDate: string; endDate: string }) {
  return `${fmtDay(w.startDate)} – ${fmtDay(w.endDate)}`;
}

export function Delta({ current, previous, lowerIsBetter = false }: { current: number; previous: number; lowerIsBetter?: boolean }) {
  const change = percentChange(current, previous);
  if (change === null) return <span className="text-xs text-[#1a1a1a]/40">no prior data</span>;
  if (Math.abs(change) < 0.005) return <span className="text-xs font-bold text-[#1a1a1a]/50">no change</span>;
  const good = lowerIsBetter ? change < 0 : change > 0;
  const Icon = change > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${good ? 'text-green-700' : 'text-red-700'}`}>
      <Icon className="w-3.5 h-3.5" aria-hidden />
      {change > 0 ? '+' : ''}
      {(change * 100).toFixed(0)}%
    </span>
  );
}

export function KpiTile({
  label,
  value,
  current,
  previous,
  previousLabel,
  lowerIsBetter,
  source,
}: {
  label: string;
  value: string;
  current: number;
  previous: number;
  previousLabel: string;
  lowerIsBetter?: boolean;
  source: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 flex flex-col justify-between shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <p className="font-sans text-[#1a1a1a]/50 text-xs font-bold uppercase tracking-widest">{label}</p>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/35">{source}</span>
      </div>
      <div>
        <h3 className="font-serif text-4xl text-[#1a1a1a] mb-1">{value}</h3>
        <p className="font-sans text-xs text-[#1a1a1a]/50 flex items-center gap-2">
          <Delta current={current} previous={previous} lowerIsBetter={lowerIsBetter} />
          <span>vs {previousLabel}</span>
        </p>
      </div>
    </div>
  );
}

export function EmptyTile({ label, source }: { label: string; source: string }) {
  return (
    <div className="bg-white/60 p-6 rounded-2xl border border-dashed border-[#1a1a1a]/15 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6">
        <p className="font-sans text-[#1a1a1a]/40 text-xs font-bold uppercase tracking-widest">{label}</p>
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/30">{source}</span>
      </div>
      <h3 className="font-serif text-4xl text-[#1a1a1a]/25">–</h3>
    </div>
  );
}

/** The fail-closed and error states, shared by both sources. */
export function PanelNotice({ panel, name }: { panel: Exclude<Panel<unknown>, { state: 'ok' }>; name: string }) {
  if (panel.state === 'not_configured') {
    return (
      <div className="rounded-2xl border border-[#1a1a1a]/10 bg-white px-5 py-4 text-sm text-[#1a1a1a]/70 flex gap-3">
        <PlugZap className="w-5 h-5 shrink-0 text-[#1a1a1a]/40" aria-hidden />
        <div>
          <p className="font-bold text-[#1a1a1a]">{name} is not connected</p>
          <p>
            Missing: {panel.missing.join(', ')}. Setup steps are in DEPLOY.md, section 8.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900 flex gap-3">
      <TriangleAlert className="w-5 h-5 shrink-0" aria-hidden />
      <div>
        <p className="font-bold">{name} could not be read</p>
        <p>{panel.message}</p>
        {panel.serviceAccount && (
          <p className="mt-1">
            Access must be granted to <code className="font-mono text-xs">{panel.serviceAccount}</code>.
          </p>
        )}
      </div>
    </div>
  );
}

export function SiteSwitch({ site }: { site: SiteFilter }) {
  const items: Array<{ id: SiteFilter; label: string }> = [
    { id: 'all', label: 'Whole site' },
    { id: 'en', label: '/en' },
    { id: 'fa', label: '/fa' },
  ];
  return (
    <nav aria-label="Site section" className="inline-flex rounded-full bg-white border border-[#1a1a1a]/10 p-1 font-sans text-sm">
      {items.map((it) => (
        <Link
          key={it.id}
          href={it.id === 'all' ? '/en/admin' : `/en/admin?site=${it.id}`}
          aria-current={site === it.id ? 'page' : undefined}
          className={`px-4 py-1.5 rounded-full transition-colors ${
            site === it.id ? 'bg-[#1a1a1a] text-[#F2F0E9]' : 'text-[#1a1a1a]/60 hover:text-[#1a1a1a]'
          }`}
        >
          {it.label}
        </Link>
      ))}
    </nav>
  );
}

/** Daily clicks as bars with impressions as a line, scaled independently. */
export function DailyChart({ points }: { points: DailyPoint[] }) {
  const W = 700;
  const H = 140;
  const pad = 4;
  const maxClicks = Math.max(1, ...points.map((p) => p.clicks));
  const maxImpr = Math.max(1, ...points.map((p) => p.impressions));
  const step = (W - pad * 2) / Math.max(1, points.length);
  const barW = Math.max(2, step - 4);
  const line = points
    .map((p, i) => `${(pad + i * step + step / 2).toFixed(1)},${(H - pad - (p.impressions / maxImpr) * (H - pad * 2)).toFixed(1)}`)
    .join(' ');

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-36" role="img" aria-label="Daily clicks and impressions, last 28 days">
        {points.map((p, i) => {
          const h = (p.clicks / maxClicks) * (H - pad * 2);
          return (
            <rect key={p.date} x={pad + i * step + (step - barW) / 2} y={H - pad - h} width={barW} height={h} rx={2} className="fill-[#1a1a1a]">
              <title>{`${fmtDay(p.date)}: ${p.clicks} clicks, ${p.impressions} impressions`}</title>
            </rect>
          );
        })}
        <polyline points={line} fill="none" strokeWidth={2} className="stroke-[#8AAD00]" strokeLinejoin="round" />
      </svg>
      <figcaption className="mt-2 flex justify-between font-sans text-xs text-[#1a1a1a]/50">
        <span>{points[0] && fmtDay(points[0].date)}</span>
        <span className="flex gap-4">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#1a1a1a]" />Clicks (max {fmtInt(maxClicks)})</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#8AAD00]" />Impressions (max {fmtInt(maxImpr)})</span>
        </span>
        <span>{points.at(-1) && fmtDay(points.at(-1)!.date)}</span>
      </figcaption>
    </figure>
  );
}

export interface Column<T> {
  label: string;
  align?: 'right';
  render: (row: T) => React.ReactNode;
}

export function RankTable<T>({
  title,
  note,
  rows,
  columns,
  empty,
}: {
  title: string;
  note?: string;
  rows: T[];
  columns: Column<T>[];
  empty: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-[#1a1a1a]/5">
        <h3 className="font-serif text-2xl text-[#1a1a1a]">{title}</h3>
        {note && <p className="font-sans text-xs text-[#1a1a1a]/50 mt-1">{note}</p>}
      </div>
      <table className="w-full text-left font-sans text-sm table-fixed">
        <thead className="bg-[#1a1a1a]/5 text-[#1a1a1a]/60 uppercase tracking-widest text-[10px]">
          <tr>
            {columns.map((c, i) => (
              <th key={c.label} className={`px-4 py-3 font-bold ${c.align === 'right' ? 'text-right w-20' : ''} ${i === 0 ? 'pl-6' : ''}`}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1a1a1a]/5">
          {rows.map((row, r) => (
            <tr key={r} className="hover:bg-[#1a1a1a]/[0.02] transition-colors">
              {columns.map((c, i) => (
                <td
                  key={c.label}
                  className={`px-4 py-3 ${c.align === 'right' ? 'text-right text-[#1a1a1a]/70 font-bold tabular-nums' : 'text-[#1a1a1a] truncate'} ${i === 0 ? 'pl-6' : ''}`}
                >
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-[#1a1a1a]/40 italic">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/** A path cell: truncated, full value on hover, `dir="auto"` so Persian slugs read correctly. */
export function PathCell({ value }: { value: string }) {
  const path = displayPath(value);
  return (
    <span title={path} dir="auto" className="font-bold">
      {path}
    </span>
  );
}

export function UpdatedAt({ iso }: { iso: string }) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  const text = minutes < 1 ? 'just now' : minutes < 60 ? `${minutes} min ago` : `${Math.round(minutes / 60)} h ago`;
  return <span className="font-sans text-xs text-[#1a1a1a]/40">Fetched {text}, refreshed every 6 h</span>;
}
