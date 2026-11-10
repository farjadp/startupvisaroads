'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { api, fmtDate, toApiError, type ApiError, type ConsentListItem } from './api';
import { ErrorBox, Section } from './ui';

const inputCls = 'w-full rounded-lg border border-[#1a1a1a]/15 bg-white px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/30';
const labelCls = 'flex flex-col gap-1 text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]/50';

export function scopeText(scope: string): string {
  try {
    const v: unknown = JSON.parse(scope);
    if (v && typeof v === 'object' && 'text' in v && typeof (v as { text: unknown }).text === 'string') return (v as { text: string }).text;
    return JSON.stringify(v);
  } catch {
    return scope;
  }
}

export default function ConsentsPanel() {
  const [items, setItems] = useState<ConsentListItem[] | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ clientRef: '', scope: '', signedAt: '', documentUri: '' });
  const [revoking, setRevoking] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api<{ items: ConsentListItem[] }>('/api/admin/case-studies/consents');
      setItems(data.items);
    } catch (e) {
      setError(toApiError(e));
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await api('/api/admin/case-studies/consents', {
        method: 'POST',
        body: {
          clientRef: form.clientRef.trim(),
          scope: form.scope.trim(),
          signedAt: form.signedAt ? new Date(`${form.signedAt}T12:00:00`).toISOString() : '',
          ...(form.documentUri.trim() ? { documentUri: form.documentUri.trim() } : {}),
        },
      });
      setForm({ clientRef: '', scope: '', signedAt: '', documentUri: '' });
      setNotice('Consent recorded.');
    } catch (err) {
      setError(toApiError(err));
    } finally {
      setBusy(false);
      await load();
    }
  }

  async function revoke(id: string) {
    if (!reason.trim()) {
      setError(toApiError(new Error('A reason is required to revoke a consent.')));
      return;
    }
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const res = await api<{ ok: boolean; withdrawn: number | string[] }>(`/api/admin/case-studies/consents/${id}/revoke`, { method: 'POST', body: { reason: reason.trim() } });
      const n = Array.isArray(res.withdrawn) ? res.withdrawn.length : res.withdrawn;
      setNotice(`Consent revoked. ${n} linked case${n === 1 ? '' : 's'} withdrawn.`);
      setRevoking(null);
      setReason('');
    } catch (err) {
      setError(toApiError(err));
    } finally {
      setBusy(false);
      await load();
    }
  }

  return (
    <Section title="Client consents">
      <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        Revoking a consent withdraws every case linked to it, immediately. Use a client reference like VR-2026-014, never a name or email.
      </p>
      <div className="space-y-4">
        <ErrorBox error={error} onDismiss={() => setError(null)} />
        {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{notice}</p>}

        {!items && !error && <p className="text-sm text-[#1a1a1a]/60">Loading consents…</p>}
        {items && items.length === 0 && <p className="text-sm text-[#1a1a1a]/60">No consents recorded.</p>}
        {items && items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-start text-xs uppercase tracking-widest text-[#1a1a1a]/50">
                  <th className="py-2 pe-3 text-start font-semibold">Client ref</th>
                  <th className="py-2 pe-3 text-start font-semibold">Scope</th>
                  <th className="py-2 pe-3 text-start font-semibold">Signed</th>
                  <th className="py-2 pe-3 text-start font-semibold">Cases</th>
                  <th className="py-2 text-start font-semibold">State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/5">
                {items.map((c) => (
                  <tr key={c.id} className="align-top">
                    <td className="py-3 pe-3 font-mono text-xs">{c.clientRef}</td>
                    <td className="py-3 pe-3 max-w-xs">{scopeText(c.scope)}</td>
                    <td className="py-3 pe-3 whitespace-nowrap">{fmtDate(c.signedAt)}</td>
                    <td className="py-3 pe-3">{c.caseCount}</td>
                    <td className="py-3">
                      {c.revokedAt ? (
                        <span className="text-red-900">Revoked {fmtDate(c.revokedAt)}{c.revokedReason ? ` — ${c.revokedReason}` : ''}</span>
                      ) : revoking === c.id ? (
                        <div className="flex flex-col gap-2 min-w-56">
                          <label className={labelCls}>
                            Reason
                            <input value={reason} onChange={(e) => setReason(e.target.value)} className={inputCls} autoFocus />
                          </label>
                          <p className="text-xs text-red-900">This withdraws {c.caseCount} linked case{c.caseCount === 1 ? '' : 's'}.</p>
                          <div className="flex gap-2">
                            <button type="button" disabled={busy || !reason.trim()} onClick={() => void revoke(c.id)} className="rounded-lg bg-red-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">Revoke</button>
                            <button type="button" onClick={() => { setRevoking(null); setReason(''); }} className="rounded-lg border border-[#1a1a1a]/15 px-3 py-1.5 text-xs">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button type="button" onClick={() => { setRevoking(c.id); setReason(''); }} className="text-xs font-semibold text-red-800 underline underline-offset-2">Revoke…</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form onSubmit={(e) => void add(e)} className="border-t border-[#1a1a1a]/10 pt-4 grid gap-3 sm:grid-cols-2">
          <p className="sm:col-span-2 font-semibold text-[#1a1a1a]">Record a signed consent</p>
          <label className={labelCls}>
            Client ref
            <input required value={form.clientRef} onChange={(e) => setForm({ ...form, clientRef: e.target.value })} placeholder="VR-2026-014" className={inputCls} />
          </label>
          <label className={labelCls}>
            Signed on
            <input required type="date" value={form.signedAt} onChange={(e) => setForm({ ...form, signedAt: e.target.value })} className={inputCls} />
          </label>
          <label className={`${labelCls} sm:col-span-2`}>
            Scope (what the client agreed to)
            <textarea required rows={2} value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} className={inputCls} />
          </label>
          <label className={`${labelCls} sm:col-span-2`}>
            Document URI (private storage only, optional)
            <input value={form.documentUri} onChange={(e) => setForm({ ...form, documentUri: e.target.value })} className={inputCls} />
          </label>
          <div className="sm:col-span-2">
            <button type="submit" disabled={busy} className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-[#CCFF00] disabled:opacity-50">Save consent</button>
          </div>
        </form>
      </div>
    </Section>
  );
}
