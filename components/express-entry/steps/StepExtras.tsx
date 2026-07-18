// ============================================================================
// Express Entry — Step 4: Extras (Additional Points)
// /components/express-entry/steps/StepExtras.tsx
// ============================================================================
'use client';

import React from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import CLBTooltip from '../ui/CLBTooltip';
import type { CandidateProfile } from '../../../lib/express-entry/types';

interface T {
  step4_title: string;
  pnp_label: string;
  pnp_note: string;
  job_offer_label: string;
  job_offer_removed_note: string;
  canadian_edu_label: string;
  edu_none: string;
  edu_one_two: string;
  edu_three_plus: string;
  sibling_label: string;
  sibling_note: string;
  french_label: string;
  french_note: string;
  speaking: string;
  listening: string;
  reading: string;
  writing: string;
  yes: string;
  no: string;
}

interface StepExtrasProps {
  profile: Partial<CandidateProfile>;
  onChange: (changes: Partial<CandidateProfile>) => void;
  locale: string;
  t: T;
}

function YesNoToggle({
  value,
  onChange,
  yesLabel,
  noLabel,
  name,
}: {
  value: boolean | undefined;
  onChange: (v: boolean) => void;
  yesLabel: string;
  noLabel: string;
  name: string;
}) {
  return (
    <div className="flex gap-3" role="radiogroup">
      {([true, false] as const).map((v) => (
        <label
          key={String(v)}
          className={`px-6 py-2.5 border cursor-pointer text-sm font-sans transition-all select-none ${
            value === v ? 'border-ink bg-ink text-paper' : 'border-ink/20 hover:border-ink/50 text-ink'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={String(v)}
            checked={value === v}
            onChange={() => onChange(v)}
            className="sr-only"
          />
          {v ? yesLabel : noLabel}
        </label>
      ))}
    </div>
  );
}

function NCLCSelect({
  id,
  value,
  onChange,
  label,
}: {
  id: string;
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs text-ink/60 font-sans">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2.5 border border-ink/20 bg-paper font-mono text-sm focus:border-ink focus:outline-none appearance-none"
      >
        <option value={0}>—</option>
        {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((clb) => (
          <option key={clb} value={clb}>NCLC {clb}</option>
        ))}
      </select>
    </div>
  );
}

export default function StepExtras({ profile, onChange, locale, t }: StepExtrasProps) {
  const isRtl = locale === 'fa';

  const updateFrench = (ability: keyof NonNullable<CandidateProfile['frenchSkills']>, val: number) => {
    const current = profile.frenchSkills ?? { speaking: 0, listening: 0, reading: 0, writing: 0 };
    onChange({ frenchSkills: { ...current, [ability]: val } });
  };

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Section title */}
      <div className="flex items-center gap-3 pb-4 border-b border-ink/10">
        <div className="w-8 h-8 bg-acid flex items-center justify-center shrink-0">
          <Sparkles size={16} className="text-ink" />
        </div>
        <h2 className="font-serif text-xl text-ink">{t.step4_title}</h2>
      </div>

      {/* Provincial Nomination */}
      <div className="space-y-2">
        <label className="block text-sm font-sans font-medium text-ink">{t.pnp_label}</label>
        <p className="text-xs text-ink/50 font-sans">{t.pnp_note}</p>
        <YesNoToggle
          name="pnp"
          value={profile.provincialNomination}
          onChange={(v) => onChange({ provincialNomination: v })}
          yesLabel={t.yes}
          noLabel={t.no}
        />
      </div>

      {/* Job Offer — UI field with IRCC policy note */}
      <div className="space-y-2">
        <label className="block text-sm font-sans font-medium text-ink">{t.job_offer_label}</label>

        {/* Prominent policy notice — always visible */}
        <div className="flex gap-3 p-3 border border-amber-400/50 bg-amber-50/50" role="note">
          <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 font-sans">{t.job_offer_removed_note}</p>
        </div>

        <YesNoToggle
          name="job-offer"
          value={profile.jobOffer}
          onChange={(v) => onChange({ jobOffer: v })}
          yesLabel={t.yes}
          noLabel={t.no}
        />
      </div>

      {/* Canadian Education */}
      <div className="space-y-3">
        <label className="block text-sm font-sans font-medium text-ink">{t.canadian_edu_label}</label>
        <div className="flex flex-wrap gap-2" role="radiogroup">
          {(['none', 'oneTwo', 'threeOrMore'] as const).map((val) => {
            const label = val === 'none' ? t.edu_none : val === 'oneTwo' ? t.edu_one_two : t.edu_three_plus;
            const isSelected = profile.canadianEducation === val;
            return (
              <label
                key={val}
                className={`px-4 py-2.5 border cursor-pointer text-sm font-sans transition-all select-none ${
                  isSelected ? 'border-ink bg-ink text-paper' : 'border-ink/20 hover:border-ink/50 text-ink'
                }`}
              >
                <input
                  type="radio"
                  name="can-edu"
                  value={val}
                  checked={isSelected}
                  onChange={() => onChange({ canadianEducation: val })}
                  className="sr-only"
                />
                {label}
              </label>
            );
          })}
        </div>
      </div>

      {/* Sibling in Canada */}
      <div className="space-y-2">
        <label className="block text-sm font-sans font-medium text-ink">{t.sibling_label}</label>
        <p className="text-xs text-ink/50 font-sans">{t.sibling_note}</p>
        <YesNoToggle
          name="sibling"
          value={profile.siblingInCanada}
          onChange={(v) => onChange({ siblingInCanada: v })}
          yesLabel={t.yes}
          noLabel={t.no}
        />
      </div>

      {/* French Skills (NCLC) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="block text-sm font-sans font-medium text-ink">{t.french_label}</label>
          <CLBTooltip locale={locale} />
        </div>
        <p className="text-xs text-ink/50 font-sans">{t.french_note}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <NCLCSelect
            id="french-speaking"
            value={profile.frenchSkills?.speaking ?? 0}
            onChange={(v) => updateFrench('speaking', v)}
            label={t.speaking}
          />
          <NCLCSelect
            id="french-listening"
            value={profile.frenchSkills?.listening ?? 0}
            onChange={(v) => updateFrench('listening', v)}
            label={t.listening}
          />
          <NCLCSelect
            id="french-reading"
            value={profile.frenchSkills?.reading ?? 0}
            onChange={(v) => updateFrench('reading', v)}
            label={t.reading}
          />
          <NCLCSelect
            id="french-writing"
            value={profile.frenchSkills?.writing ?? 0}
            onChange={(v) => updateFrench('writing', v)}
            label={t.writing}
          />
        </div>
      </div>
    </div>
  );
}
