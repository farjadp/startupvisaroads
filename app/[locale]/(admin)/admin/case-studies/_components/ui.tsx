'use client';

import React from 'react';
import Link from 'next/link';
import type { ApiError, CaseStatus } from './api';

export function ErrorBox({ error, onDismiss }: { error: ApiError | null; onDismiss?: () => void }) {
  if (!error) return null;
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
      <div className="flex items-start gap-3">
        <p className="font-semibold">{error.message}</p>
        {error.status === 401 && (
          <Link href="/en/admin/login" className="underline underline-offset-2">Log in</Link>
        )}
        {onDismiss && (
          <button type="button" onClick={onDismiss} className="ms-auto text-xs underline underline-offset-2">Dismiss</button>
        )}
      </div>
      {error.reasons.length > 0 && (
        <ul className="mt-2 list-disc ps-5 space-y-1">
          {error.reasons.map((r) => <li key={r}>{r}</li>)}
        </ul>
      )}
    </div>
  );
}

const STATUS_STYLE: Record<CaseStatus, string> = {
  DRAFT: 'bg-[#1a1a1a]/5 text-[#1a1a1a]/70',
  IN_REVIEW: 'bg-amber-100 text-amber-900',
  APPROVED: 'bg-sky-100 text-sky-900',
  SCHEDULED: 'bg-indigo-100 text-indigo-900',
  PUBLISHED: 'bg-[#CCFF00] text-[#1a1a1a]',
  WITHDRAWN: 'bg-red-100 text-red-900',
};

export function StatusBadge({ status }: { status: CaseStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${STATUS_STYLE[status] ?? STATUS_STYLE.DRAFT}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

export function SampleTag() {
  return (
    <span className="rounded-full border border-dashed border-[#1a1a1a]/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/70">
      Sample
    </span>
  );
}

export function Section({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
      <div className="mb-4 flex flex-wrap items-baseline gap-3">
        <h2 className="font-serif text-2xl text-[#1a1a1a]">{title}</h2>
        {aside && <div className="ms-auto">{aside}</div>}
      </div>
      {children}
    </section>
  );
}

export function BlockerList({ title, reasons, okText }: { title: string; reasons: string[]; okText: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]/50 mb-2">{title}</p>
      {reasons.length === 0 ? (
        <p className="text-sm text-emerald-800">{okText}</p>
      ) : (
        <ul className="list-disc ps-5 space-y-1 text-sm text-red-900">
          {reasons.map((r) => <li key={r}>{r}</li>)}
        </ul>
      )}
    </div>
  );
}
