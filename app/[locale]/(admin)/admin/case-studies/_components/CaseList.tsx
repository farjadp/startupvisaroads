'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api, fmtDate, toApiError, STATUSES, TYPES, TYPE_LABEL, type ApiError, type CaseListItem } from './api';
import { ErrorBox, SampleTag, StatusBadge } from './ui';

const selectCls = 'rounded-lg border border-[#1a1a1a]/15 bg-white px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/30';

export default function CaseList() {
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [items, setItems] = useState<CaseListItem[] | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const q = new URLSearchParams();
    if (status) q.set('status', status);
    if (type) q.set('type', type);
    try {
      const data = await api<{ items: CaseListItem[] }>(`/api/admin/case-studies${q.toString() ? `?${q.toString()}` : ''}`);
      setItems(data.items);
    } catch (e) {
      setError(toApiError(e));
      setItems(null);
    } finally {
      setLoading(false);
    }
  }, [status, type]);

  useEffect(() => { void load(); }, [load]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]/50">
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
            <option value="">All</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]/50">
          Type
          <select value={type} onChange={(e) => setType(e.target.value)} className={selectCls}>
            <option value="">All</option>
            {TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
          </select>
        </label>
        <button type="button" onClick={() => void load()} className="ms-auto rounded-lg border border-[#1a1a1a]/15 px-3 py-2 text-sm hover:border-[#1a1a1a]/40">
          Refresh
        </button>
      </div>

      <ErrorBox error={error} />

      {loading && !items && <p className="text-sm text-[#1a1a1a]/60">Loading cases…</p>}

      {items && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#1a1a1a]/15 bg-white/60 p-10 text-center">
          <p className="font-serif text-2xl text-[#1a1a1a] mb-2">No cases{status || type ? ' match these filters' : ' yet'}</p>
          <p className="text-sm text-[#1a1a1a]/60">The case-study-writer agent posts here; new cases land in IN REVIEW.</p>
        </div>
      )}

      {items && items.length > 0 && (
        <ul className="space-y-3">
          {items.map((c) => {
            const allChecked = c.claimsTotal > 0 && c.claimsChecked === c.claimsTotal;
            return (
              <li key={c.id}>
                <Link href={`/en/admin/case-studies/${c.id}`} className="block bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-5 hover:border-[#1a1a1a]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/30">
                  <div className="flex flex-wrap items-center gap-2 mb-2 font-sans">
                    <StatusBadge status={c.status} />
                    <span className="text-xs text-[#1a1a1a]/60 uppercase tracking-widest">{TYPE_LABEL[c.type] ?? c.type}</span>
                    <span className="text-xs text-[#1a1a1a]/60">· {c.locale.toUpperCase()}</span>
                    {c.sample && <SampleTag />}
                    <span className="ms-auto flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                      <span className={`rounded-full px-2 py-0.5 ${allChecked ? 'bg-emerald-100 text-emerald-900' : 'bg-[#1a1a1a]/5 text-[#1a1a1a]/70'}`}>
                        Claims {c.claimsChecked}/{c.claimsTotal}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 ${c.redLineCount > 0 ? 'bg-red-100 text-red-900' : 'bg-[#1a1a1a]/5 text-[#1a1a1a]/70'}`}>
                        {c.redLineCount} red-line{c.redLineCount === 1 ? '' : 's'}
                      </span>
                    </span>
                  </div>
                  <p dir={c.locale === 'fa' ? 'rtl' : 'ltr'} className={`text-lg text-[#1a1a1a] font-semibold ${c.locale === 'fa' ? 'font-vazir' : ''}`}>{c.title}</p>
                  <p className="text-sm text-[#1a1a1a]/60 mt-1">
                    {[c.citation, c.route, c.outcome, c.decisionDate ? fmtDate(c.decisionDate) : null].filter(Boolean).join(' · ')}
                  </p>
                  <p className="text-xs text-[#1a1a1a]/50 mt-1">/{c.locale}/case-studies/{c.slug} · updated {fmtDate(c.updatedAt, true)}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
