'use client';

// One source: what we read from it, its digest, its passages count, the
// ingest log, and the controls — pin, trust, topics, re-read, disable,
// delete.

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Pin, PinOff, Trash2, Power, CheckCircle, AlertTriangle, Ban } from 'lucide-react';

import type { SourceDetailData } from '@/lib/knowledge/admin';

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString('en-CA', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');

export default function SourceDetail({ source: initial }: { source: SourceDetailData }) {
  const router = useRouter();
  const [source, setSource] = useState(initial);
  const [topics, setTopics] = useState(initial.topics.join(', '));
  const [trust, setTrust] = useState(initial.trust);
  const [title, setTitle] = useState(initial.title ?? '');
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const reload = async () => {
    const res = await fetch(`/api/admin/sources/${source.id}`, { cache: 'no-store' });
    if (!res.ok) return;
    const data = (await res.json()) as { source: SourceDetailData };
    setSource(data.source);
  };

  const active = source.status === 'pending' || source.status === 'ingesting';
  useEffect(() => {
    if (active && !timer.current) timer.current = setInterval(() => void reload(), 4000);
    if (!active && timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const patch = async (body: Record<string, unknown>, what: string) => {
    setBusy(what);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/sources/${source.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Failed');
      if (body.refetch) void fetch(`/api/cron/sources?limit=3&source=${encodeURIComponent(source.id)}`, { cache: 'no-store' }).catch(() => {});
      await reload();
      setMessage('Saved.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Failed');
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    if (!confirm('Delete this source and everything read from it? Articles already written stay as they are.')) return;
    setBusy('delete');
    await fetch(`/api/admin/sources/${source.id}`, { method: 'DELETE' });
    router.push('/en/admin/sources');
    router.refresh();
  };

  const input = 'border border-[#1a1a1a]/15 rounded-lg px-3 py-2 text-sm text-[#1a1a1a] bg-white w-full';
  const label = 'flex flex-col gap-1 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50';
  const btn = 'inline-flex items-center gap-2 border border-[#1a1a1a]/15 text-[#1a1a1a] px-4 py-2.5 rounded-lg text-xs uppercase tracking-widest hover:bg-[#1a1a1a]/5 transition-colors disabled:opacity-50';

  const status =
    source.status === 'ready' ? <span className="inline-flex items-center gap-1 text-green-700"><CheckCircle className="w-4 h-4" /> ready</span>
    : source.status === 'blocked' ? <span className="inline-flex items-center gap-1 text-orange-600"><Ban className="w-4 h-4" /> blocked</span>
    : source.status === 'error' ? <span className="inline-flex items-center gap-1 text-red-600"><AlertTriangle className="w-4 h-4" /> error</span>
    : <span className="inline-flex items-center gap-1 text-blue-700"><RefreshCw className="w-4 h-4 animate-spin" /> {source.status}</span>;

  return (
    <div className="space-y-8 font-sans">
      <div>
        <Link href="/en/admin/sources" className="inline-flex items-center gap-2 text-sm text-[#1a1a1a]/60 hover:text-[#1a1a1a] mb-4"><ArrowLeft className="w-4 h-4" /> All sources</Link>
        <h1 className="font-serif text-4xl mb-2 text-[#1a1a1a]">{source.title || source.url || 'Untitled source'}</h1>
        <p className="text-sm text-[#1a1a1a]/60 flex flex-wrap gap-x-4 gap-y-1">
          <span>{source.kind}{source.cadence === 'watch' ? ' · watch' : ''}</span>
          <span>{source.trust}</span>
          {source.url && <a href={source.url} target="_blank" rel="noreferrer" className="underline decoration-[#1a1a1a]/30 break-all">{source.url}</a>}
          <span>added {fmt(source.createdAt)}</span>
          <span>last read {fmt(source.lastCheckedAt)}</span>
          {status}
        </p>
        {source.lastError && <p className="mt-2 text-sm text-red-600">{source.lastError}</p>}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <label className={label}>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => title !== (source.title ?? '') && void patch({ title }, 'title')} className={input} />
          </label>
          <label className={label}>
            Topics
            <input value={topics} onChange={(e) => setTopics(e.target.value)} onBlur={() => void patch({ topics: topics.split(/[,\n]/).map((t) => t.trim()).filter(Boolean) }, 'topics')} className={input} />
          </label>
          <label className={label}>
            Trust
            <select value={trust} onChange={(e) => { setTrust(e.target.value); void patch({ trust: e.target.value }, 'trust'); }} className={input}>
              <option value="official">Official</option>
              <option value="press">Press</option>
              <option value="commentary">Commentary</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => void patch({ pinned: !source.pinned }, 'pin')} disabled={!!busy} className={btn}>
            {source.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />} {source.pinned ? 'Unpin' : 'Pin'}
          </button>
          <button onClick={() => void patch({ refetch: true }, 'refetch')} disabled={!!busy || active} className={btn}>
            <RefreshCw className={`w-4 h-4 ${busy === 'refetch' ? 'animate-spin' : ''}`} /> Re-read now
          </button>
          <button onClick={() => void patch({ enabled: !source.enabled }, 'enable')} disabled={!!busy} className={btn}>
            <Power className="w-4 h-4" /> {source.enabled ? 'Disable' : 'Enable'}
          </button>
          <button onClick={() => void remove()} disabled={!!busy} className={`${btn} text-red-600 border-red-200 hover:bg-red-50`}>
            <Trash2 className="w-4 h-4" /> Delete
          </button>
          {message && <span className="self-center text-sm text-[#1a1a1a]/60">{message}</span>}
        </div>
        {!source.enabled && <p className="mt-3 text-xs text-orange-600">Disabled: the writer does not see this source.</p>}
        {source.pinned && <p className="mt-3 text-xs text-[#1a1a1a]/50">Pinned: the digest below is put in front of the writer for every article on {source.topics.length ? source.topics.join(', ') : 'any topic (no topics set)'}.</p>}
      </div>

      {/* Documents */}
      {source.documents.map((d) => (
        <div key={d.id} className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <h2 className="font-serif text-2xl text-[#1a1a1a]">{d.title}</h2>
            <span className="text-xs text-[#1a1a1a]/50">
              {d.status} · {d.chunks} passages · {Math.round(d.charCount / 1000)}k chars{d.language ? ` · ${d.language}` : ''}{d.publishedAt ? ` · published ${fmt(d.publishedAt)}` : ''} · read {fmt(d.fetchedAt)}
              {d.articleIds.length > 0 && ` · used in ${d.articleIds.length} article${d.articleIds.length > 1 ? 's' : ''}`}
            </span>
          </div>
          {d.reason && <p className="text-sm text-red-600 mb-3">{d.reason}</p>}
          {d.digest ? (
            <pre className="whitespace-pre-wrap text-sm text-[#1a1a1a]/85 font-sans leading-relaxed">{d.digest}</pre>
          ) : (
            <p className="text-sm text-[#1a1a1a]/50">{active ? 'Digest is being written…' : 'No digest yet.'}</p>
          )}
        </div>
      ))}
      {source.documents.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 text-sm text-[#1a1a1a]/50">{active ? 'Reading…' : 'Nothing has been read from this source yet.'}</div>
      )}

      {/* Jobs */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1a1a1a]/5"><h2 className="font-serif text-2xl text-[#1a1a1a]">Ingest log</h2></div>
        <table className="min-w-full text-sm">
          <thead className="bg-[#1a1a1a]/[0.03] text-[10px] uppercase tracking-widest text-[#1a1a1a]/50">
            <tr>
              <th className="text-left px-6 py-3 font-bold">When</th>
              <th className="text-left px-4 py-3 font-bold">Step</th>
              <th className="text-left px-4 py-3 font-bold">Status</th>
              <th className="text-left px-4 py-3 font-bold">Attempts</th>
              <th className="text-left px-4 py-3 font-bold">Error</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]/5">
            {source.jobs.map((j) => (
              <tr key={j.id}>
                <td className="px-6 py-3 whitespace-nowrap text-[#1a1a1a]">{fmt(j.updatedAt)}</td>
                <td className="px-4 py-3 text-[#1a1a1a]/80">{j.step}</td>
                <td className="px-4 py-3 text-[#1a1a1a]/80">{j.status}</td>
                <td className="px-4 py-3 text-[#1a1a1a]/80">{j.attempts}</td>
                <td className="px-4 py-3 text-xs text-red-600">{j.error}</td>
              </tr>
            ))}
            {source.jobs.length === 0 && <tr><td colSpan={5} className="px-6 py-6 text-center text-[#1a1a1a]/40">No jobs.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
