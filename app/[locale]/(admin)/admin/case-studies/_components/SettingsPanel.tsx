'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { api, toApiError, type ApiError, type Settings } from './api';
import { ErrorBox, Section } from './ui';

const SWITCHES: Array<{ key: keyof Settings; label: string; warning: string }> = [
  {
    key: 'courtPagesClearedByCounsel',
    label: 'Court pages cleared by counsel',
    warning: 'Leave OFF until counsel has answered the reproduction question (spec §5). While OFF no court-decision page can be published.',
  },
  {
    key: 'clientCasesEnabled',
    label: 'Client cases enabled',
    warning: 'Leave OFF until counsel has reviewed the consent form and each client case has a signed consent on record. While OFF no client case can be published.',
  },
];

export default function SettingsPanel() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [saving, setSaving] = useState<keyof Settings | null>(null);

  const load = useCallback(async () => {
    try {
      setSettings(await api<Settings>('/api/admin/case-studies/settings'));
      setError(null);
    } catch (e) {
      setError(toApiError(e));
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function toggle(key: keyof Settings, value: boolean) {
    setSaving(key);
    setError(null);
    try {
      await api<Settings>('/api/admin/case-studies/settings', { method: 'PUT', body: { [key]: value } });
    } catch (e) {
      setError(toApiError(e));
    } finally {
      setSaving(null);
      await load();
    }
  }

  return (
    <Section title="Global switches">
      <ErrorBox error={error} />
      {!settings && !error && <p className="text-sm text-[#1a1a1a]/60">Loading switches…</p>}
      {settings && (
        <ul className="divide-y divide-[#1a1a1a]/5">
          {SWITCHES.map((s) => {
            const on = settings[s.key];
            const id = `switch-${s.key}`;
            return (
              <li key={s.key} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                <button
                  id={id}
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-describedby={`${id}-warn`}
                  disabled={saving !== null}
                  onClick={() => void toggle(s.key, !on)}
                  className={`mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/40 disabled:opacity-50 ${on ? 'bg-[#1a1a1a]' : 'bg-[#1a1a1a]/20'}`}
                >
                  <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0.5 rtl:-translate-x-0.5'}`} />
                  <span className="sr-only">{s.label}</span>
                </button>
                <div>
                  <label htmlFor={id} className="font-semibold text-[#1a1a1a] cursor-pointer">
                    {s.label} <span className={`ms-2 text-xs font-bold ${on ? 'text-emerald-800' : 'text-[#1a1a1a]/60'}`}>{on ? 'ON' : 'OFF'}</span>
                  </label>
                  <p id={`${id}-warn`} className="mt-1 text-sm text-amber-900">{s.warning}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Section>
  );
}
