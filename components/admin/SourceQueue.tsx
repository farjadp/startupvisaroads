'use client';

// The suggestion queue: items a watch source published that cleared triage
// but were not taken by a scheduled run. One click writes an article from
// one of them.
//
// Writing is fire-and-forget with polling, the same shape as the autopilot
// console: a run takes minutes and Cloudflare cuts the request at 100 s,
// but Cloud Run keeps working, so the row watches the run ledger instead of
// waiting on the response.

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Newspaper, RefreshCw, PenLine, FileText, ExternalLink, Clock } from 'lucide-react';

import type { SuggestedDocument } from '@/lib/knowledge/admin';
import type { RunRow } from '@/components/admin/AutopilotConsole';

type Props = { initialDocuments: SuggestedDocument[] };

/** "3 hours ago" without a dependency. */
function ago(iso: string | null): string {
  if (!iso) return '—';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '—';
  const secs = Math.round((Date.now() - then) / 1000);
  if (secs < 0) return 'just now';
  const steps: [number, string][] = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.345, 'week'],
    [12, 'month'],
  ];
  let value = secs;
  let unit = 'second';
  for (const [size, next] of steps) {
    if (value < size) break;
    value = value / size;
    unit = next;
  }
  const n = Math.floor(value);
  if (unit === 'second' && n < 45) return 'just now';
  return `${n} ${unit}${n === 1 ? '' : 's'} ago`;
}

const kb = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : String(n));

export default function SourceQueue({ initialDocuments }: Props) {
  const [documents, setDocuments] = useState<SuggestedDocument[]>(initialDocuments);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const kickedAt = useRef<number>(0);

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  // Clear the interval on unmount, whatever state the run is in.
  useEffect(() => stop, []);

  const refresh = async () => {
    try {
      const res = await fetch('/api/admin/sources/queue', { cache: 'no-store' });
      if (!res.ok) return;
      const data = (await res.json()) as { documents: SuggestedDocument[] };
      setDocuments(data.documents);
    } catch {
      /* keep what we have */
    }
  };

  // Watch the run ledger for the source-mode run we just started.
  const poll = async () => {
    try {
      const res = await fetch('/api/admin/autopilot/runs', { cache: 'no-store' });
      if (!res.ok) return;
      const data = (await res.json()) as { runs: RunRow[] };
      const mine = data.runs.find(
        (r) => r.mode === 'source' && new Date(r.startedAt).getTime() >= kickedAt.current - 60_000,
      );
      if (!mine?.finishedAt) return;
      stop();
      setBusyId(null);
      setMessage(
        mine.created > 0
          ? `Finished: ${mine.created} article${mine.created === 1 ? '' : 's'} written. Check Articles.`
          : `Finished without writing anything${mine.errors ? ', with errors' : ''}. The run log under Autopilot has the reason.`,
      );
      await refresh();
    } catch {
      /* a failed poll is transient; the next tick tries again */
    }
  };

  const write = (id: string, publish: boolean) => {
    stop();
    kickedAt.current = Date.now();
    setBusyId(id);
    setMessage('Writing… this takes one to several minutes. The row clears itself when the run finishes.');
    const qs = new URLSearchParams({ document: id, locale: 'en', mode: 'any', ...(publish ? { publish: '1' } : {}) });
    // Fire and forget: the response may never arrive through Cloudflare.
    void fetch(`/api/cron/autopilot-source?${qs}`, { cache: 'no-store' }).catch(() => {});
    timer.current = setInterval(() => void poll(), 4000);
  };

  const btn =
    'inline-flex items-center gap-2 border border-[#1a1a1a]/15 text-[#1a1a1a] px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap';

  return (
    <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden font-sans">
      <div className="px-6 py-4 border-b border-[#1a1a1a]/5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-[#1a1a1a]">Waiting for you</h2>
          <p className="mt-1 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">
            <Newspaper className="w-3.5 h-3.5" />
            {documents.length} item{documents.length === 1 ? '' : 's'} waiting
          </p>
        </div>
        <button
          onClick={() => void refresh()}
          className="inline-flex items-center gap-2 border border-[#1a1a1a]/15 text-[#1a1a1a] px-3 py-2 rounded-lg text-xs uppercase tracking-widest hover:bg-[#1a1a1a]/5 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {message && <p className="px-6 py-3 text-sm text-[#1a1a1a]/70 border-b border-[#1a1a1a]/5">{message}</p>}

      {documents.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-sm text-[#1a1a1a]/60">Nothing is waiting.</p>
          <p className="mt-2 text-xs text-[#1a1a1a]/40">
            Items appear here after a watch source publishes something that scores at least 4 out of 5 in triage.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-[#1a1a1a]/5">
          {documents.map((d) => {
            const busy = busyId === d.id;
            return (
              <li key={d.id} className={`px-6 py-5 ${busy ? 'bg-[#F2F0E9]' : ''}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      {d.url ? (
                        <a
                          href={d.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#1a1a1a] underline decoration-[#1a1a1a]/30 hover:decoration-[#1a1a1a] inline-flex items-baseline gap-1"
                        >
                          {d.title || 'Untitled'}
                          <ExternalLink className="w-3.5 h-3.5 self-center" />
                        </a>
                      ) : (
                        <span className="font-bold text-[#1a1a1a]">{d.title || 'Untitled'}</span>
                      )}
                      <span className="text-xs font-bold text-[#1a1a1a]/70">
                        {d.relevance === null ? 'not scored' : `${d.relevance}/5`}
                      </span>
                      {d.autoEligible && (
                        <span className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/50 bg-[#CCFF00]/30 rounded-full px-2 py-0.5">
                          A scheduled run would take this one unasked
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-[#1a1a1a]/50 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <Link href={`/en/admin/sources/${d.sourceId}`} className="hover:underline text-[#1a1a1a]/70">
                        {d.sourceName}
                      </Link>
                      <span>{d.trust}</span>
                      {d.locale && <span>{d.locale}</span>}
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {d.publishedAt ? `published ${ago(d.publishedAt)}` : `read ${ago(d.fetchedAt)}`}
                      </span>
                      <span>{kb(d.charCount)} chars</span>
                    </p>

                    {d.matchedTopics.length > 0 && (
                      <p className="mt-1 text-xs text-[#1a1a1a]/60">{d.matchedTopics.join(' · ')}</p>
                    )}

                    {d.digest && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/50 hover:text-[#1a1a1a]">
                          Digest
                        </summary>
                        <pre className="mt-2 whitespace-pre-wrap text-sm text-[#1a1a1a]/80 font-sans leading-relaxed">{d.digest}</pre>
                      </details>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button onClick={() => write(d.id, true)} disabled={busy || busyId !== null} className={btn}>
                      {busy ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <PenLine className="w-3.5 h-3.5" />}
                      {busy ? 'Writing' : 'Write and publish immediately'}
                    </button>
                    <button onClick={() => write(d.id, false)} disabled={busy || busyId !== null} className={btn}>
                      <FileText className="w-3.5 h-3.5" /> Write as draft
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="px-6 py-4 border-t border-[#1a1a1a]/5 text-xs text-[#1a1a1a]/40">
        Without “Publish immediately” the article lands as a draft under Articles. Writing takes one to several minutes;
        the run shows up in the log under Autopilot.
      </p>
    </div>
  );
}
