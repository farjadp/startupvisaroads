'use client';

// Admin console for the content autopilot: stats, a manual trigger, the run
// log, and the reader's recent refusals. The manual trigger is fire-and-
// forget with polling, the same shape as AiWriterUI: a run takes minutes and
// Cloudflare cuts the request at 100 s, but Cloud Run keeps working, so the
// page watches the run ledger instead of waiting on the response.

import React, { useEffect, useRef, useState } from 'react';
import { Play, RefreshCw, CheckCircle, AlertTriangle, Newspaper, Sparkles, Ban } from 'lucide-react';

export type RunRow = {
  id: string;
  startedAt: string;
  finishedAt: string | null;
  locale: string;
  mode: string;
  requested: number;
  created: number;
  errors: string | null;
  skipped: string | null;
  notes: string | null;
};

type Props = {
  initialRuns: RunRow[];
  stats: { published7d: number; ledgerNew: number; ledgerUsed: number; ledgerSkipped: number };
  recentSkips: { title: string; sourceSlug: string; status: string; reason: string | null; updatedAt: string }[];
};

function parseList(json: string | null): { title?: string; error?: string; reason?: string }[] {
  if (!json) return [];
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

const fmt = (iso: string) => new Date(iso).toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function AutopilotConsole({ initialRuns, stats, recentSkips }: Props) {
  const [runs, setRuns] = useState<RunRow[]>(initialRuns);
  const [mode, setMode] = useState<'planned' | 'source'>('planned');
  const [locale, setLocale] = useState<'en' | 'fa'>('en');
  const [n, setN] = useState(1);
  const [publish, setPublish] = useState(false);
  const [dry, setDry] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const watching = useRef<string | null>(null);

  const refresh = async () => {
    try {
      const res = await fetch('/api/admin/autopilot/runs', { cache: 'no-store' });
      if (res.ok) {
        const data = (await res.json()) as { runs: RunRow[] };
        setRuns(data.runs);
        return data.runs;
      }
    } catch {
      /* transient */
    }
    return null;
  };

  // While a manual run is in flight, poll the ledger until its row is finished.
  useEffect(() => {
    if (!busy) return;
    const t = setInterval(async () => {
      const latest = await refresh();
      if (!latest) return;
      const mine = watching.current ? latest.find((r) => r.id === watching.current) : latest[0];
      if (!watching.current && latest[0] && new Date(latest[0].startedAt).getTime() > Date.now() - 10 * 60_000) watching.current = latest[0].id;
      if (mine?.finishedAt) {
        setBusy(false);
        setMessage(`Finished: ${mine.created}/${mine.requested} created${mine.errors ? ', with errors' : ''}${mine.skipped ? `, ${parseList(mine.skipped).length} skipped` : ''}.`);
        watching.current = null;
      }
    }, 5000);
    return () => clearInterval(t);
  }, [busy]);

  const start = () => {
    setBusy(true);
    setMessage('Running… this takes one to several minutes. The log below updates on its own.');
    watching.current = null;
    const path = mode === 'planned' ? '/api/cron/autopilot' : '/api/cron/autopilot-source';
    const qs = new URLSearchParams({ n: String(n), locale, ...(publish ? { publish: '1' } : {}), ...(dry ? { dry: '1' } : {}) });
    // Fire and forget: the response may never arrive through Cloudflare.
    fetch(`${path}?${qs}`, { cache: 'no-store' }).catch(() => {});
  };

  const card = (label: string, value: number, Icon: React.ComponentType<{ className?: string }>, tone: string) => (
    <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
      <div className={`inline-flex p-3 rounded-xl mb-6 ${tone}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-sans text-[#1a1a1a]/50 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <h3 className="font-serif text-4xl text-[#1a1a1a]">{value}</h3>
    </div>
  );

  return (
    <div className="space-y-8 font-sans">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {card('Published, last 7 days', stats.published7d, Sparkles, 'bg-[#CCFF00]/30 text-[#1a1a1a]')}
        {card('Source items waiting', stats.ledgerNew, Newspaper, 'bg-blue-50 text-blue-600')}
        {card('Source items written', stats.ledgerUsed, CheckCircle, 'bg-green-50 text-green-700')}
        {card('Source items refused', stats.ledgerSkipped, Ban, 'bg-orange-50 text-orange-600')}
      </div>

      {/* Manual trigger */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
        <h2 className="font-serif text-2xl text-[#1a1a1a] mb-4">Run now</h2>
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">
            Writer
            <select value={mode} onChange={(e) => setMode(e.target.value as 'planned' | 'source')} className="border border-[#1a1a1a]/15 rounded-lg px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#1a1a1a] bg-white">
              <option value="planned">Planned (from site inventory)</option>
              <option value="source">Source-driven (from news feeds)</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">
            Language
            <select value={locale} onChange={(e) => setLocale(e.target.value as 'en' | 'fa')} className="border border-[#1a1a1a]/15 rounded-lg px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#1a1a1a] bg-white">
              <option value="en">English</option>
              <option value="fa">Persian</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">
            Articles
            <input type="number" min={1} max={4} value={n} onChange={(e) => setN(Math.min(4, Math.max(1, Number(e.target.value) || 1)))} className="border border-[#1a1a1a]/15 rounded-lg px-3 py-2 text-sm w-20 text-[#1a1a1a] bg-white" />
          </label>
          <label className="flex items-center gap-2 text-sm text-[#1a1a1a] pb-2">
            <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} /> Publish immediately
          </label>
          <label className="flex items-center gap-2 text-sm text-[#1a1a1a] pb-2">
            <input type="checkbox" checked={dry} onChange={(e) => setDry(e.target.checked)} /> Dry run (no images, nothing saved)
          </label>
          <button
            onClick={start}
            disabled={busy}
            className="inline-flex items-center gap-2 bg-[#1a1a1a] text-[#CCFF00] px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {busy ? 'Running' : 'Start'}
          </button>
          <button onClick={() => void refresh()} className="inline-flex items-center gap-2 border border-[#1a1a1a]/15 text-[#1a1a1a] px-4 py-2.5 rounded-lg text-xs uppercase tracking-widest hover:bg-[#1a1a1a]/5 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh log
          </button>
        </div>
        {message && <p className="mt-4 text-sm text-[#1a1a1a]/70">{message}</p>}
        <p className="mt-3 text-xs text-[#1a1a1a]/40">Without “Publish immediately” the articles land as drafts under Articles. The scheduled runs publish directly.</p>
      </div>

      {/* Run log */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1a1a1a]/5">
          <h2 className="font-serif text-2xl text-[#1a1a1a]">Run log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#1a1a1a]/[0.03] text-[10px] uppercase tracking-widest text-[#1a1a1a]/50">
              <tr>
                <th className="text-left px-6 py-3 font-bold">Started</th>
                <th className="text-left px-4 py-3 font-bold">Writer</th>
                <th className="text-left px-4 py-3 font-bold">Lang</th>
                <th className="text-left px-4 py-3 font-bold">Created</th>
                <th className="text-left px-4 py-3 font-bold">Status</th>
                <th className="text-left px-4 py-3 font-bold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {runs.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-[#1a1a1a]/40">No runs yet.</td></tr>
              )}
              {runs.map((r) => {
                const errors = parseList(r.errors);
                const skipped = parseList(r.skipped);
                const running = !r.finishedAt;
                return (
                  <tr key={r.id} className="align-top">
                    <td className="px-6 py-3 whitespace-nowrap text-[#1a1a1a]">{fmt(r.startedAt)}</td>
                    <td className="px-4 py-3 text-[#1a1a1a]/80">{r.mode}</td>
                    <td className="px-4 py-3 uppercase text-[#1a1a1a]/80">{r.locale}</td>
                    <td className="px-4 py-3 text-[#1a1a1a] font-bold">{r.created}/{r.requested}</td>
                    <td className="px-4 py-3">
                      {running ? (
                        <span className="inline-flex items-center gap-1 text-blue-700"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> running</span>
                      ) : errors.length ? (
                        <span className="inline-flex items-center gap-1 text-orange-600"><AlertTriangle className="w-3.5 h-3.5" /> {errors.length} error{errors.length > 1 ? 's' : ''}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-green-700"><CheckCircle className="w-3.5 h-3.5" /> ok</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#1a1a1a]/60 max-w-xl">
                      {r.notes && <div className="mb-1">{r.notes}</div>}
                      {errors.map((e, i) => <div key={`e${i}`} className="text-orange-700">✕ {e.title ? `${e.title}: ` : ''}{e.error}</div>)}
                      {skipped.map((s, i) => <div key={`s${i}`}>↷ {s.title}: {s.reason}</div>)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reader refusals */}
      {recentSkips.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
          <h2 className="font-serif text-2xl text-[#1a1a1a] mb-1">Recently refused sources</h2>
          <p className="text-xs text-[#1a1a1a]/40 mb-4">Why the reader declined to write from an item. A refusal is the gate working; a pattern is a prompt to fix.</p>
          <ul className="divide-y divide-[#1a1a1a]/5 text-sm">
            {recentSkips.map((s, i) => (
              <li key={i} className="py-3">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[#1a1a1a] font-medium">{s.title}</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 whitespace-nowrap">{s.sourceSlug} · {fmt(s.updatedAt)}</span>
                </div>
                <div className="text-[#1a1a1a]/60 text-xs mt-1">{s.reason}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
