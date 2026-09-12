'use client';

// Articles whose ground has moved: a watch source was re-read, its text
// differed, and every article written from it was flagged. A published
// immigration article built on a source that changed may now be telling
// people something the authority no longer says, so this panel sits above
// the suggestion queue — a wrong published article outranks a new idea.
//
// Marking one handled is optimistic: the row leaves the list immediately and
// comes back if the PATCH fails. Nothing here judges whether the change was
// material; that is the point of the queue.

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Check, ExternalLink, Clock, RefreshCw, Trash2, Radio } from 'lucide-react';

import type { OpenReview } from '@/lib/knowledge/review';

type Props = { initialReviews: OpenReview[] };

const fmt = (iso: string) => {
  const t = new Date(iso);
  return Number.isNaN(t.getTime())
    ? '—'
    : t.toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

/** Published first — a live wrong page is the urgent one — then newest flag. */
function order(rows: OpenReview[]): OpenReview[] {
  return [...rows].sort((a, b) => {
    const pa = a.article.status === 'PUBLISHED' ? 0 : 1;
    const pb = b.article.status === 'PUBLISHED' ? 0 : 1;
    if (pa !== pb) return pa - pb;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export default function ArticleReviews({ initialReviews }: Props) {
  const [reviews, setReviews] = useState<OpenReview[]>(() => order(initialReviews));
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const res = await fetch('/api/admin/reviews', { cache: 'no-store' });
      if (!res.ok) return;
      const data = (await res.json()) as { reviews: OpenReview[] };
      setReviews(order(data.reviews));
    } catch {
      /* keep what we have */
    }
  };

  const markHandled = async (id: string) => {
    const before = reviews;
    setBusyId(id);
    setMessage(null);
    setReviews((rows) => rows.filter((r) => r.id !== id)); // optimistic
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Could not mark it handled.');
    } catch (err) {
      setReviews(order(before)); // roll back
      setMessage(err instanceof Error ? err.message : 'Could not mark it handled.');
    } finally {
      setBusyId(null);
    }
  };

  const btn =
    'inline-flex items-center gap-2 border border-[#1a1a1a]/15 text-[#1a1a1a] px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap';

  return (
    <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden font-sans">
      <div className="px-6 py-4 border-b border-[#1a1a1a]/5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-[#1a1a1a]">Needs review</h2>
          <p className="mt-1 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">
            <AlertTriangle className="w-3.5 h-3.5" />
            {reviews.length} article{reviews.length === 1 ? '' : 's'} whose source moved
          </p>
        </div>
        <button
          onClick={() => void refresh()}
          className="inline-flex items-center gap-2 border border-[#1a1a1a]/15 text-[#1a1a1a] px-3 py-2 rounded-lg text-xs uppercase tracking-widest hover:bg-[#1a1a1a]/5 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {message && (
        <p className="px-6 py-3 text-sm text-red-600 border-b border-[#1a1a1a]/5 whitespace-pre-line">{message}</p>
      )}

      {reviews.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <p className="text-sm text-[#1a1a1a]/60">No cited source has changed.</p>
          <p className="mt-2 text-xs text-[#1a1a1a]/40">
            This fills in when a watched page is re-read and its text differs from the version an article was written
            from.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-[#1a1a1a]/5">
          {reviews.map((r) => {
            const busy = busyId === r.id;
            const published = r.article.status === 'PUBLISHED';
            const gone = r.article.status === 'GONE';
            return (
              <li key={r.id} className={`px-6 py-5 ${published ? 'bg-[#F2F0E9]' : ''}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      {gone ? (
                        <span className="font-bold text-[#1a1a1a]/60 line-through">{r.article.title}</span>
                      ) : (
                        <Link
                          href={`/en/admin/articles/${r.article.id}/edit`}
                          className="font-bold text-[#1a1a1a] underline decoration-[#1a1a1a]/30 hover:decoration-[#1a1a1a]"
                        >
                          {r.article.title || 'Untitled'}
                        </Link>
                      )}
                      {published && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#1a1a1a]/60 bg-[#CCFF00]/40 rounded-full px-2 py-0.5">
                          <Radio className="w-3 h-3" /> live
                        </span>
                      )}
                      {gone && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-[#1a1a1a]/50 bg-[#1a1a1a]/5 rounded-full px-2 py-0.5">
                          <Trash2 className="w-3 h-3" /> the article was deleted
                        </span>
                      )}
                      {!published && !gone && (
                        <span className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40">
                          {r.article.status.toLowerCase()}
                        </span>
                      )}
                      <span className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40">
                        {r.article.locale}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-[#1a1a1a]/80">{r.reason}</p>
                    {r.detail && (
                      <p className="mt-1 text-sm text-[#1a1a1a]/60 whitespace-pre-line">{r.detail}</p>
                    )}

                    {r.document ? (
                      <p className="mt-2 text-xs text-[#1a1a1a]/50 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <a
                          href={r.document.url ?? undefined}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#1a1a1a]/70 underline decoration-[#1a1a1a]/30 hover:decoration-[#1a1a1a] inline-flex items-baseline gap-1"
                        >
                          {r.document.title || 'Untitled source document'}
                          <ExternalLink className="w-3 h-3 self-center" />
                        </a>
                        <span>{r.document.sourceName}</span>
                        <span>{r.document.trust}</span>
                        <span>read {fmt(r.document.fetchedAt)}</span>
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-[#1a1a1a]/40">The source document is no longer on file.</p>
                    )}

                    <p className="mt-1 text-xs text-[#1a1a1a]/40 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> flagged {fmt(r.createdAt)}
                    </p>
                  </div>

                  <button onClick={() => void markHandled(r.id)} disabled={busy} className={btn}>
                    {busy ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Mark handled
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <p className="px-6 py-4 border-t border-[#1a1a1a]/5 text-xs text-[#1a1a1a]/40">
        A flag says the text of a cited source changed, not that the article is wrong. Read both, fix the article if it
        needs it, then mark the row handled.
      </p>
    </div>
  );
}
