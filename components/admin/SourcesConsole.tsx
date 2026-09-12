'use client';

// Admin console for knowledge sources: register one (a link, a site to
// watch, a PDF, pasted text), watch it ingest, and try retrieval against
// what is on file. Registering is fire-and-forget with polling, like the
// autopilot console: the cron does the reading, this page watches the rows.

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Link2, Rss, FileText, ClipboardPaste, Youtube, RefreshCw, Search, CheckCircle, AlertTriangle, Ban, Pin, ShieldCheck } from 'lucide-react';
import type { SourceRow } from '@/lib/knowledge/admin';
import type { EvidencePack } from '@/lib/knowledge/retrieve';

type Props = {
  initialSources: SourceRow[];
  keywordPool: string[];
  retainsFiles: boolean;
  /** Rendered between the retrieval box and the sources table — the suggestion queue. */
  children?: React.ReactNode;
};

type Mode = 'link' | 'watch' | 'pdf' | 'text';

const MODES: { id: Mode; label: string; hint: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'link', label: 'News link', hint: 'One page, read once.', Icon: Link2 },
  { id: 'watch', label: 'Site to watch', hint: 'A news or updates page we re-read on a schedule.', Icon: Rss },
  { id: 'pdf', label: 'PDF', hint: 'Upload a file or give its URL.', Icon: FileText },
  { id: 'text', label: 'Paste text', hint: 'A transcript, notes, anything you already have as text.', Icon: ClipboardPaste },
];

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');
const kb = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : String(n));

function StatusPill({ status, job }: { status: string; job: string | null }) {
  if (status === 'ready') return <span className="inline-flex items-center gap-1 text-green-700"><CheckCircle className="w-3.5 h-3.5" /> ready</span>;
  if (status === 'blocked') return <span className="inline-flex items-center gap-1 text-orange-600"><Ban className="w-3.5 h-3.5" /> blocked</span>;
  if (status === 'error') return <span className="inline-flex items-center gap-1 text-red-600"><AlertTriangle className="w-3.5 h-3.5" /> error</span>;
  return <span className="inline-flex items-center gap-1 text-blue-700"><RefreshCw className="w-3.5 h-3.5 animate-spin" /> {job ? job.split(':')[1] : status}</span>;
}

export default function SourcesConsole({ initialSources, keywordPool, retainsFiles, children }: Props) {
  const [sources, setSources] = useState<SourceRow[]>(initialSources);
  const [mode, setMode] = useState<Mode>('link');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [trust, setTrust] = useState<'auto' | 'official' | 'press' | 'commentary'>('auto');
  const [locale, setLocale] = useState<'' | 'en' | 'fa'>('');
  const [pinned, setPinned] = useState(false);
  const [topics, setTopics] = useState('');
  const [watchEvery, setWatchEvery] = useState(24);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [pack, setPack] = useState<EvidencePack | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = async () => {
    try {
      const res = await fetch('/api/admin/sources', { cache: 'no-store' });
      if (!res.ok) return;
      const data = (await res.json()) as { sources: SourceRow[] };
      setSources(data.sources);
    } catch {
      /* keep what we have */
    }
  };

  // Poll while anything is still being read.
  const active = sources.some((s) => s.status === 'pending' || s.status === 'ingesting');
  useEffect(() => {
    if (active && !timer.current) timer.current = setInterval(() => void refresh(), 4000);
    if (!active && timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
    };
  }, [active]);

  const kick = (sourceId: string) => {
    // Fire-and-forget: the cron route does the reading; we watch the rows.
    void fetch(`/api/cron/sources?limit=3&source=${encodeURIComponent(sourceId)}`, { cache: 'no-store' }).catch(() => {});
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.set('kind', mode === 'text' ? 'text' : mode === 'pdf' ? 'pdf' : 'html');
      fd.set('cadence', mode === 'watch' ? 'watch' : 'once');
      fd.set('url', url.trim());
      fd.set('title', title.trim());
      fd.set('text', text);
      if (trust !== 'auto') fd.set('trust', trust);
      if (locale) fd.set('locale', locale);
      fd.set('pinned', pinned ? '1' : '0');
      fd.set('topics', topics);
      fd.set('watchEvery', String(watchEvery));
      fd.set('notes', notes);
      if (mode === 'pdf' && file) fd.set('file', file);
      const res = await fetch('/api/admin/sources', { method: 'POST', body: fd });
      const data = (await res.json()) as { ok?: boolean; id?: string; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error ?? 'Could not register the source.');
      kick(data.id);
      setUrl('');
      setTitle('');
      setText('');
      setFile(null);
      setNotes('');
      setMessage('Registered. Reading it now — the row updates as it goes.');
      await refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  };

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setSearchError(null);
    setPack(null);
    try {
      const res = await fetch('/api/admin/sources/retrieve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, k: 8 }) });
      const data = (await res.json()) as EvidencePack & { error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Retrieval failed');
      setPack(data);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSearching(false);
    }
  };

  const ready = sources.filter((s) => s.status === 'ready').length;
  const chunks = sources.reduce((n, s) => n + s.chunks, 0);
  const pinnedCount = sources.filter((s) => s.pinned).length;
  const official = sources.filter((s) => s.trust === 'official').length;

  const card = (label: string, value: number, Icon: React.ComponentType<{ className?: string }>, tone: string) => (
    <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
      <div className={`inline-flex p-3 rounded-xl mb-6 ${tone}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="font-sans text-[#1a1a1a]/50 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <h3 className="font-serif text-4xl text-[#1a1a1a]">{value}</h3>
    </div>
  );

  const input = 'border border-[#1a1a1a]/15 rounded-lg px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#1a1a1a] bg-white w-full';
  const label = 'flex flex-col gap-1 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50';

  return (
    <div className="space-y-8 font-sans">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {card('Sources ready', ready, CheckCircle, 'bg-green-50 text-green-700')}
        {card('Passages on file', chunks, FileText, 'bg-blue-50 text-blue-600')}
        {card('Official sources', official, ShieldCheck, 'bg-[#CCFF00]/30 text-[#1a1a1a]')}
        {card('Pinned', pinnedCount, Pin, 'bg-orange-50 text-orange-600')}
      </div>

      {/* Add */}
      <form onSubmit={submit} className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
        <h2 className="font-serif text-2xl text-[#1a1a1a] mb-4">Add a source</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {MODES.map(({ id, label: l, hint, Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => setMode(id)}
              className={`text-left p-4 rounded-xl border transition-colors ${mode === id ? 'border-[#1a1a1a] bg-[#1a1a1a] text-[#CCFF00]' : 'border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30 text-[#1a1a1a]'}`}
            >
              <Icon className="w-5 h-5 mb-2" />
              <div className="text-sm font-bold">{l}</div>
              <div className={`text-xs mt-1 ${mode === id ? 'text-[#CCFF00]/70' : 'text-[#1a1a1a]/50'}`}>{hint}</div>
            </button>
          ))}
          <div className="text-left p-4 rounded-xl border border-dashed border-[#1a1a1a]/10 text-[#1a1a1a]/40">
            <Youtube className="w-5 h-5 mb-2" />
            <div className="text-sm font-bold">YouTube</div>
            <div className="text-xs mt-1">Next phase. Paste the transcript as text for now.</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {mode !== 'text' && (
            <label className={`${label} md:col-span-2`}>
              {mode === 'pdf' ? 'PDF URL (or upload below)' : mode === 'watch' ? 'Page or feed URL to watch' : 'URL'}
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className={input} required={mode !== 'pdf'} />
            </label>
          )}
          {mode === 'pdf' && (
            <label className={`${label} md:col-span-2`}>
              Upload PDF {retainsFiles ? '' : '(text is kept; the file itself is not retained until a bucket is configured)'}
              <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-sm font-normal normal-case tracking-normal text-[#1a1a1a]" />
            </label>
          )}
          {mode === 'text' && (
            <>
              <label className={`${label} md:col-span-2`}>
                Where it came from (optional URL, for the citation)
                <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className={input} />
              </label>
              <label className={`${label} md:col-span-2`}>
                Text
                <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} className={`${input} font-mono text-xs`} placeholder="Paste the transcript or notes here…" required />
              </label>
            </>
          )}
          <label className={label}>
            Title {mode === 'text' ? '' : '(optional; read from the page if empty)'}
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} required={mode === 'text'} />
          </label>
          <label className={label}>
            Topics (comma-separated keywords this source is about)
            <input value={topics} onChange={(e) => setTopics(e.target.value)} list="kw-pool" className={input} placeholder="start-up visa, express entry" />
            <datalist id="kw-pool">{keywordPool.slice(0, 200).map((k) => <option key={k} value={k} />)}</datalist>
          </label>
          <label className={label}>
            Trust
            <select value={trust} onChange={(e) => setTrust(e.target.value as typeof trust)} className={input}>
              <option value="auto">Auto (official when the host is a known authority)</option>
              <option value="official">Official (government / authority)</option>
              <option value="press">Press (news publication)</option>
              <option value="commentary">Commentary (blogs, consultants)</option>
            </select>
          </label>
          <label className={label}>
            Language
            <select value={locale} onChange={(e) => setLocale(e.target.value as typeof locale)} className={input}>
              <option value="">Detect</option>
              <option value="en">English</option>
              <option value="fa">Persian</option>
            </select>
          </label>
          {mode === 'watch' && (
            <label className={label}>
              Re-check every (hours)
              <input type="number" min={1} max={168} value={watchEvery} onChange={(e) => setWatchEvery(Number(e.target.value) || 24)} className={input} />
            </label>
          )}
          <label className={`${label} md:col-span-2`}>
            Notes (for you)
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className={input} />
          </label>
          <label className="flex items-center gap-2 text-sm text-[#1a1a1a] md:col-span-2">
            <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} /> Pin: its digest goes into every article on its topics
          </label>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button type="submit" disabled={busy} className="inline-flex items-center gap-2 bg-[#1a1a1a] text-[#CCFF00] px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-[#CCFF00] hover:text-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {busy ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {busy ? 'Registering' : 'Register and read'}
          </button>
          {message && <p className="text-sm text-[#1a1a1a]/70">{message}</p>}
        </div>
        {mode === 'watch' && <p className="mt-3 text-xs text-[#1a1a1a]/40">The page is read now. Scheduled re-reading and per-item relevance triage arrive in the next phase.</p>}
      </form>

      {/* Test retrieval */}
      <form onSubmit={search} className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
        <h2 className="font-serif text-2xl text-[#1a1a1a] mb-1">Test retrieval</h2>
        <p className="text-sm text-[#1a1a1a]/60 mb-4">Type what an article would be about and see the evidence the writer would be handed.</p>
        <div className="flex gap-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. start-up visa letter of support requirements" className={input} />
          <button type="submit" disabled={searching || query.trim().length < 3} className="inline-flex items-center gap-2 border border-[#1a1a1a]/15 text-[#1a1a1a] px-4 py-2.5 rounded-lg text-xs uppercase tracking-widest hover:bg-[#1a1a1a]/5 transition-colors disabled:opacity-50 whitespace-nowrap">
            {searching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Retrieve
          </button>
        </div>
        {searchError && <p className="mt-3 text-sm text-red-600">{searchError}</p>}
        {pack && (
          <div className="mt-6 space-y-4">
            <p className="text-xs text-[#1a1a1a]/50">{pack.candidates} passages scored · {pack.items.length} selected · {pack.pinned.length} pinned digest{pack.pinned.length === 1 ? '' : 's'}</p>
            {pack.pinned.map((p) => (
              <div key={p.sourceId} className="rounded-xl border border-orange-200 bg-orange-50/40 p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-orange-700 mb-1">Pinned · {p.title}</div>
                <pre className="whitespace-pre-wrap text-xs text-[#1a1a1a]/80 font-sans">{p.digest}</pre>
              </div>
            ))}
            {pack.items.map((it) => (
              <div key={it.chunkId} className="rounded-xl border border-[#1a1a1a]/10 p-4">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-xs mb-2">
                  <span className="font-bold text-[#1a1a1a]">[{it.ref}]</span>
                  <Link href={`/en/admin/sources/${it.sourceId}`} className="text-[#1a1a1a] underline decoration-[#1a1a1a]/30">{it.title}</Link>
                  <span className="text-[#1a1a1a]/50">{it.trust}{it.locator ? ` · ${it.locator}` : ''}</span>
                  <span className="text-[#1a1a1a]/40">score {it.score} (meaning {it.parts.cosine}, words {it.parts.keyword}, trust {it.parts.trust}, fresh {it.parts.recency})</span>
                </div>
                <p className="text-sm text-[#1a1a1a]/80 whitespace-pre-wrap">{it.text}</p>
              </div>
            ))}
            {!pack.items.length && !pack.pinned.length && <p className="text-sm text-[#1a1a1a]/60">Nothing on file answers that. The writer would be told so and stay generic.</p>}
          </div>
        )}
      </form>

      {children}

      {/* List */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1a1a1a]/5 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#1a1a1a]">Sources</h2>
          <button onClick={() => void refresh()} className="inline-flex items-center gap-2 border border-[#1a1a1a]/15 text-[#1a1a1a] px-3 py-2 rounded-lg text-xs uppercase tracking-widest hover:bg-[#1a1a1a]/5 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#1a1a1a]/[0.03] text-[10px] uppercase tracking-widest text-[#1a1a1a]/50">
              <tr>
                <th className="text-left px-6 py-3 font-bold">Source</th>
                <th className="text-left px-4 py-3 font-bold">Kind</th>
                <th className="text-left px-4 py-3 font-bold">Trust</th>
                <th className="text-left px-4 py-3 font-bold">Status</th>
                <th className="text-left px-4 py-3 font-bold">Passages</th>
                <th className="text-left px-4 py-3 font-bold">Used in</th>
                <th className="text-left px-4 py-3 font-bold">Last read</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {sources.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-[#1a1a1a]/40">Nothing registered yet.</td></tr>
              )}
              {sources.map((s) => (
                <tr key={s.id} className="align-top">
                  <td className="px-6 py-3 max-w-md">
                    <Link href={`/en/admin/sources/${s.id}`} className="font-bold text-[#1a1a1a] hover:underline">{s.title || s.url || 'Untitled'}</Link>
                    {s.url && <div className="text-xs text-[#1a1a1a]/40 truncate">{s.url}</div>}
                    {s.topics.length > 0 && <div className="text-xs text-[#1a1a1a]/50 mt-1">{s.topics.join(' · ')}</div>}
                    {s.lastError && <div className="text-xs text-red-600 mt-1">{s.lastError}</div>}
                  </td>
                  <td className="px-4 py-3 text-[#1a1a1a]/80">{s.kind}{s.cadence === 'watch' ? ' · watch' : ''}{s.pinned ? ' · pinned' : ''}</td>
                  <td className="px-4 py-3 text-[#1a1a1a]/80">{s.trust}</td>
                  <td className="px-4 py-3"><StatusPill status={s.status} job={s.job} /></td>
                  <td className="px-4 py-3 text-[#1a1a1a]">{s.chunks} <span className="text-[#1a1a1a]/40 text-xs">({kb(s.chars)} chars)</span></td>
                  <td className="px-4 py-3 text-[#1a1a1a]">{s.usedIn}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-[#1a1a1a]/70">{fmt(s.lastCheckedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
