'use client';

// ============================================================================
// components/admin/finder/FinderControls.tsx
// Client controls on /admin/finder: the contact-policy switch, the "resolved"
// button on a contact report, and copying the opted-in email list.
// ============================================================================
import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { resolveContactReport, setContactPolicy } from '@/app/actions/finderAdminActions';

const POLICY_TEXT: Record<string, { label: string; help: string }> = {
  all: { label: 'All contacts', help: 'Every website, phone and email we hold, in every community. Your decision of 26 Nov 2026.' },
  safe: { label: 'Safe only', help: 'Hides low-confidence AI rows and the no-solicitation communities listed below. Named emails only where the community list published them; otherwise role addresses (info@, hr@…).' },
  off: { label: 'Off', help: 'No contact details at all. The list and matching stay; reveals are refused.' },
};

export function PolicySwitch({ current }: { current: string }) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const save = () =>
    start(async () => {
      setError(null);
      if (!window.confirm(`Switch contact policy to "${POLICY_TEXT[value].label}"? It applies to every visitor on the next request.`)) return;
      const r = await setContactPolicy(value);
      if (!r.success) setError(r.error);
      else router.refresh();
    });

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {Object.entries(POLICY_TEXT).map(([k, t]) => (
          <label
            key={k}
            className={`cursor-pointer rounded-xl border p-4 transition-colors ${value === k ? 'border-[#1a1a1a] bg-white' : 'border-[#1a1a1a]/10 bg-white/50 hover:border-[#1a1a1a]/30'}`}
          >
            <span className="flex items-center gap-2 font-semibold text-[#1a1a1a]">
              <input type="radio" name="policy" value={k} checked={value === k} onChange={() => setValue(k)} className="accent-[#1a1a1a]" />
              {t.label}
              {current === k && <span className="ms-auto rounded-full bg-[#CCFF00] px-2 py-0.5 text-[10px] uppercase tracking-wider">live</span>}
            </span>
            <span className="mt-2 block text-xs leading-relaxed text-[#1a1a1a]/60">{t.help}</span>
          </label>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending || value === current}
          className="rounded-lg bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-[#CCFF00] disabled:opacity-40"
        >
          {pending ? 'Saving…' : 'Save policy'}
        </button>
        {error && <span className="text-sm text-red-700">{error}</span>}
      </div>
    </div>
  );
}

export function ResolveButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState(false);
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const r = await resolveContactReport(id);
          if (r.success) router.refresh();
          else setError(true);
        })
      }
      className="rounded-lg border border-[#1a1a1a]/20 px-3 py-1 text-xs font-semibold text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#CCFF00] disabled:opacity-40"
    >
      {error ? 'Failed, retry' : pending ? '…' : 'Mark resolved'}
    </button>
  );
}

export function CopyOptIn({ emails }: { emails: string[] }) {
  const [done, setDone] = useState(false);
  if (emails.length === 0) return <span className="text-xs text-[#1a1a1a]/50">Nobody has opted in yet.</span>;
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(emails.join('\n'));
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          window.prompt('Copy the list:', emails.join(', '));
        }
      }}
      className="rounded-lg border border-[#1a1a1a]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#1a1a1a] hover:border-[#1a1a1a]"
    >
      {done ? 'Copied' : `Copy ${emails.length} opted-in email${emails.length === 1 ? '' : 's'}`}
    </button>
  );
}
