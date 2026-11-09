'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { api, fmtDate, toApiError, TYPE_LABEL, type Action, type ApiError, type CaseDetail, type Claim } from './api';
import { BlockerList, ErrorBox, SampleTag, Section, StatusBadge } from './ui';
import { scopeText } from './ConsentsPanel';

const btnBase = 'rounded-lg px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/40 disabled:cursor-not-allowed disabled:opacity-40';
const inputCls = 'rounded-lg border border-[#1a1a1a]/15 bg-white px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/30';

function paraRefs(paras: Claim['paras']): string {
  return Array.isArray(paras) && paras.length ? paras.map((p) => `¶${p}`).join(', ') : '—';
}

/** Why an action can't run right now; empty means the button is enabled. */
function actionBlockers(action: Action, d: CaseDetail): string[] {
  const s = d.item.status;
  switch (action) {
    case 'submit':
      return s === 'DRAFT' ? [] : ['Only a DRAFT can be submitted.'];
    case 'approve':
      return [...(s === 'IN_REVIEW' ? [] : ['Only a case IN REVIEW can be approved.']), ...d.approval.reasons];
    case 'schedule':
    case 'publish':
      return [...(s === 'APPROVED' ? [] : [`Only an APPROVED case can be ${action === 'schedule' ? 'scheduled' : 'published'}.`]), ...d.publish.reasons];
    case 'reopen':
      return s === 'APPROVED' || s === 'SCHEDULED' ? [] : ['Only APPROVED or SCHEDULED cases can be reopened.'];
    case 'withdraw':
      return s === 'WITHDRAWN' ? ['Already withdrawn.'] : [];
  }
}

export default function CaseReview({ id }: { id: string }) {
  const [data, setData] = useState<CaseDetail | null>(null);
  const [loadError, setLoadError] = useState<ApiError | null>(null);
  const [actionError, setActionError] = useState<ApiError | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [publishAt, setPublishAt] = useState('');
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');

  const load = useCallback(async () => {
    try {
      setData(await api<CaseDetail>(`/api/admin/case-studies/${encodeURIComponent(id)}`));
      setLoadError(null);
    } catch (e) {
      setLoadError(toApiError(e));
    }
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  async function toggleClaim(claimId: string, verified: boolean) {
    setActionError(null);
    // Optimistic tick; the refetch below is the source of truth.
    setData((d) => d && { ...d, item: { ...d.item, claims: d.item.claims.map((c) => (c.id === claimId ? { ...c, verified } : c)) } });
    try {
      await api(`/api/admin/case-studies/${encodeURIComponent(id)}/claims`, { method: 'PATCH', body: { claimId, verified } });
    } catch (e) {
      setActionError(toApiError(e));
    } finally {
      await load();
    }
  }

  async function run(action: Action) {
    const body: { action: Action; publishAt?: string; reason?: string } = { action };
    if (action === 'schedule') {
      const t = new Date(publishAt);
      if (!publishAt || Number.isNaN(t.getTime())) {
        setActionError(toApiError(new Error('Pick a release date and time first.')));
        return;
      }
      body.publishAt = t.toISOString();
    }
    if (action === 'withdraw') body.reason = withdrawReason.trim();
    setBusy(true);
    setActionError(null);
    setNotice(null);
    try {
      await api(`/api/admin/case-studies/${encodeURIComponent(id)}/transition`, { method: 'POST', body });
      setNotice(`Done: ${action}.`);
      if (action === 'withdraw') { setWithdrawOpen(false); setWithdrawReason(''); }
      if (action === 'schedule') setPublishAt('');
    } catch (e) {
      setActionError(toApiError(e));
    } finally {
      setBusy(false);
      await load();
    }
  }

  if (loadError && !data) {
    return (
      <div className="max-w-5xl space-y-4">
        <Link href="/en/admin/case-studies" className="text-sm underline underline-offset-2">← All case studies</Link>
        <ErrorBox error={loadError} />
        <button type="button" onClick={() => void load()} className={`${btnBase} border border-[#1a1a1a]/15`}>Try again</button>
      </div>
    );
  }
  if (!data) return <p className="text-sm text-[#1a1a1a]/60">Loading case…</p>;

  const { item, consent, settings } = data;
  const checked = item.claims.filter((c) => c.verified).length;
  const canTick = item.status === 'IN_REVIEW';
  const rtl = item.locale === 'fa';

  const renderAction = ({ action, label, tone }: { action: Action; label: string; tone: 'primary' | 'plain' | 'danger' }) => {
    const blockers = actionBlockers(action, data);
    const cls = tone === 'primary' ? 'bg-[#1a1a1a] text-[#CCFF00]' : tone === 'danger' ? 'bg-red-700 text-white' : 'border border-[#1a1a1a]/20 text-[#1a1a1a] bg-white';
    const disabled = busy || blockers.length > 0 || (action === 'schedule' && !publishAt) || (action === 'withdraw' && !withdrawReason.trim());
    return (
      <div className="flex flex-col gap-1">
        <button type="button" disabled={disabled} onClick={() => void run(action)} className={`${btnBase} ${cls}`} aria-describedby={blockers.length ? `why-${action}` : undefined}>
          {label}
        </button>
        {blockers.length > 0 && (
          <p id={`why-${action}`} className="text-xs text-[#1a1a1a]/60 max-w-56">{blockers[0]}{blockers.length > 1 ? ` (+${blockers.length - 1} more)` : ''}</p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-5xl space-y-6">
      <Link href="/en/admin/case-studies" className="text-sm underline underline-offset-2">← All case studies</Link>

      <header>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <StatusBadge status={item.status} />
          <span className="text-xs uppercase tracking-widest text-[#1a1a1a]/60">{TYPE_LABEL[item.type] ?? item.type}</span>
          <span className="text-xs text-[#1a1a1a]/60">· {item.locale.toUpperCase()}</span>
          {item.sample && <SampleTag />}
        </div>
        <h1 dir={rtl ? 'rtl' : 'ltr'} className={`font-serif text-4xl mb-2 text-[#1a1a1a] ${rtl ? 'font-vazir' : ''}`}>{item.title}</h1>
        <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          <div className="flex gap-2"><dt className="text-[#1a1a1a]/60">Citation</dt><dd className="font-semibold">{item.citation ?? '—'}</dd></div>
          <div className="flex gap-2"><dt className="text-[#1a1a1a]/60">Route</dt><dd className="font-semibold">{item.route ?? '—'}</dd></div>
          <div className="flex gap-2"><dt className="text-[#1a1a1a]/60">Outcome</dt><dd className="font-semibold">{item.outcome ?? '—'}</dd></div>
          <div className="flex gap-2"><dt className="text-[#1a1a1a]/60">Decided</dt><dd className="font-semibold">{fmtDate(item.decisionDate)}</dd></div>
          <div className="flex gap-2"><dt className="text-[#1a1a1a]/60">Slug</dt><dd className="font-mono text-xs self-center">/{item.locale}/case-studies/{item.slug}</dd></div>
          {item.publishAt && <div className="flex gap-2"><dt className="text-[#1a1a1a]/60">Release</dt><dd className="font-semibold">{fmtDate(item.publishAt, true)}</dd></div>}
          {item.approvedBy && <div className="flex gap-2"><dt className="text-[#1a1a1a]/60">Approved</dt><dd>{item.approvedBy}, {fmtDate(item.approvedAt, true)}</dd></div>}
          {item.withdrawnAt && <div className="flex gap-2 sm:col-span-2"><dt className="text-[#1a1a1a]/60">Withdrawn</dt><dd className="text-red-900">{fmtDate(item.withdrawnAt, true)} — {item.withdrawnReason}</dd></div>}
        </dl>
        {item.officialUrl ? (
          <a href={item.officialUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold underline underline-offset-2">
            Open the official decision ↗
          </a>
        ) : (
          item.type === 'FC_DECISION' && <p className="mt-3 text-sm text-red-900">No official link on this case.</p>
        )}
      </header>

      <ErrorBox error={actionError} onDismiss={() => setActionError(null)} />
      {loadError && <ErrorBox error={loadError} />}
      {notice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{notice}</p>}

      <Section
        title="Claims"
        aside={<span className={`rounded-full px-3 py-1 text-xs font-semibold ${checked === item.claims.length && item.claims.length > 0 ? 'bg-emerald-100 text-emerald-900' : 'bg-[#1a1a1a]/5 text-[#1a1a1a]/70'}`} aria-live="polite">{checked}/{item.claims.length} checked</span>}
      >
        {!canTick && <p className="mb-3 text-sm text-[#1a1a1a]/60">Claims can only be ticked while the case is IN REVIEW.</p>}
        {item.claims.length === 0 ? (
          <p className="text-sm text-red-900">This case has no claims.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-widest text-[#1a1a1a]/50">
                  <th className="py-2 pe-3 text-start font-semibold">Claim</th>
                  <th className="py-2 pe-3 text-start font-semibold">Kind</th>
                  <th className="py-2 pe-3 text-start font-semibold">¶ refs</th>
                  <th className="py-2 pe-3 text-start font-semibold">Exact quote</th>
                  <th className="py-2 text-start font-semibold">Checked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/5">
                {item.claims.map((c) => (
                  <tr key={c.id} className="align-top">
                    <td dir={rtl ? 'rtl' : 'ltr'} className="py-3 pe-3 max-w-xs">{c.text}</td>
                    <td className="py-3 pe-3 whitespace-nowrap text-xs uppercase tracking-wide text-[#1a1a1a]/70">{c.kind}</td>
                    <td className="py-3 pe-3 whitespace-nowrap font-mono text-xs">{paraRefs(c.paras)}</td>
                    <td className="py-3 pe-3 max-w-sm"><blockquote className="border-s-2 border-[#1a1a1a]/20 ps-3 italic text-[#1a1a1a]/80">{c.quote || '—'}</blockquote></td>
                    <td className="py-3">
                      <input
                        type="checkbox"
                        checked={c.verified}
                        disabled={!canTick}
                        onChange={(e) => void toggleClaim(c.id, e.target.checked)}
                        aria-label={`Checked: ${c.text.slice(0, 80)}`}
                        className="h-5 w-5 accent-[#1a1a1a] disabled:opacity-40"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="Red-line scan">
        {item.redLines.length === 0 ? (
          <p className="text-sm text-emerald-800">None.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {item.redLines.map((r, i) => (
              <li key={`${r.rule}-${r.index}-${i}`} className="flex flex-wrap gap-2">
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-900">{r.label}</span>
                <code className="text-xs bg-[#1a1a1a]/5 rounded px-1.5 py-0.5">{r.match}</code>
                <span className="text-xs text-[#1a1a1a]/50">at {r.index}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {item.type === 'CLIENT_CASE' && (
        <Section title="Consent record">
          {consent ? (
            <dl className="grid gap-1 text-sm">
              <div className="flex gap-2"><dt className="text-[#1a1a1a]/60">Client ref</dt><dd className="font-mono text-xs self-center">{consent.clientRef}</dd></div>
              <div className="flex gap-2"><dt className="text-[#1a1a1a]/60">Scope</dt><dd>{scopeText(consent.scope)}</dd></div>
              <div className="flex gap-2"><dt className="text-[#1a1a1a]/60">Signed</dt><dd>{fmtDate(consent.signedAt)}</dd></div>
              <div className="flex gap-2"><dt className="text-[#1a1a1a]/60">Recorded by</dt><dd>{consent.recordedBy}</dd></div>
              <div className="flex gap-2"><dt className="text-[#1a1a1a]/60">State</dt><dd className={consent.revokedAt ? 'text-red-900 font-semibold' : 'text-emerald-800 font-semibold'}>{consent.revokedAt ? `Revoked ${fmtDate(consent.revokedAt)}` : 'Live'}</dd></div>
            </dl>
          ) : (
            <p className="text-sm text-red-900">No consent record is linked. A client case cannot be approved without one.</p>
          )}
        </Section>
      )}

      <Section title="Gate and actions">
        <div className="grid gap-6 sm:grid-cols-2 mb-6">
          <BlockerList title="Approval blockers" reasons={data.approval.reasons} okText="Nothing blocks approval." />
          <BlockerList title="Publish blockers" reasons={data.publish.reasons} okText="Nothing blocks publishing." />
        </div>
        <p className="mb-4 text-xs text-[#1a1a1a]/60">
          Switches: court pages cleared by counsel <b>{settings.courtPagesClearedByCounsel ? 'ON' : 'OFF'}</b> · client cases enabled <b>{settings.clientCasesEnabled ? 'ON' : 'OFF'}</b>
        </p>
        <div className="flex flex-wrap items-start gap-4">
          {renderAction({ action: 'submit', label: 'Submit for review', tone: 'plain' })}
          {renderAction({ action: 'approve', label: 'Approve', tone: 'primary' })}
          {renderAction({ action: 'publish', label: 'Publish now', tone: 'primary' })}
          <div className="flex flex-wrap items-start gap-2">
            <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]/50">
              Release at
              <input type="datetime-local" value={publishAt} onChange={(e) => setPublishAt(e.target.value)} className={inputCls} />
            </label>
            <div className="pt-5">{renderAction({ action: 'schedule', label: 'Schedule', tone: 'plain' })}</div>
          </div>
          {renderAction({ action: 'reopen', label: 'Reopen', tone: 'plain' })}
          {!withdrawOpen ? (
            <button type="button" disabled={busy || item.status === 'WITHDRAWN'} onClick={() => setWithdrawOpen(true)} className={`${btnBase} border border-red-300 text-red-800 bg-white`}>
              Withdraw…
            </button>
          ) : (
            <div className="flex flex-wrap items-start gap-2">
              <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]/50">
                Reason (required)
                <input value={withdrawReason} onChange={(e) => setWithdrawReason(e.target.value)} className={`${inputCls} min-w-64`} autoFocus />
              </label>
              <div className="pt-5 flex gap-2">
                {renderAction({ action: 'withdraw', label: 'Withdraw', tone: 'danger' })}
                <button type="button" onClick={() => { setWithdrawOpen(false); setWithdrawReason(''); }} className={`${btnBase} border border-[#1a1a1a]/15 h-fit`}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section title="Preview">
        <p className="mb-3 text-xs text-[#1a1a1a]/60">Rendered content as stored (sanitised HTML). Page chrome, FAQ and schema are not shown.</p>
        {item.content ? (
          <div className="max-h-[36rem] overflow-y-auto rounded-xl border border-[#1a1a1a]/10 bg-[#F2F0E9]/40 p-6">
            <div
              dir={rtl ? 'rtl' : 'ltr'}
              className={`text-[15px] leading-relaxed text-[#1a1a1a] [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mt-4 [&_h3]:mb-1 [&_p]:my-3 [&_ul]:list-disc [&_ul]:ps-5 [&_ol]:list-decimal [&_ol]:ps-5 [&_li]:my-1 [&_a]:underline [&_blockquote]:border-s-2 [&_blockquote]:border-[#1a1a1a]/20 [&_blockquote]:ps-3 [&_blockquote]:italic ${rtl ? 'font-vazir' : ''}`}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </div>
        ) : (
          <p className="text-sm text-[#1a1a1a]/60">No content.</p>
        )}
      </Section>
    </div>
  );
}
