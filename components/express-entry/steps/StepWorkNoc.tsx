// ============================================================================
// Express Entry — Step 3: Work Experience & Transferability
// /components/express-entry/steps/StepWorkNoc.tsx
// ============================================================================
'use client';

import React from 'react';
import { Briefcase } from 'lucide-react';
import type { CandidateProfile } from '../../../lib/express-entry/types';

interface T {
  step3_title: string;
  canadian_exp_label: string;
  foreign_exp_label: string;
  cert_label: string;
  cert_note: string;
  years: string;
  year: string;
  or_more: string;
  yes: string;
  no: string;
}

interface StepWorkNocProps {
  profile: Partial<CandidateProfile>;
  onChange: (changes: Partial<CandidateProfile>) => void;
  locale: string;
  t: T;
}

function ExpSelect({
  id,
  value,
  onChange,
  max,
  locale,
  t,
}: {
  id: string;
  value: number | undefined;
  onChange: (v: number) => void;
  max: 5 | 3;
  locale: string;
  t: T;
}) {
  const isRtl = locale === 'fa';
  const options = Array.from({ length: max + 1 }, (_, i) => i);

  return (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {options.map((i) => {
        const isSelected = value === i;
        const isMax = i === max;
        const label = i === 0
          ? '0'
          : isMax
            ? `${i}+ ${isRtl ? 'سال' : t.year}`
            : `${i} ${i === 1 ? (isRtl ? 'سال' : t.year) : (isRtl ? 'سال' : t.years)}`;
        return (
          <label
            key={i}
            className={`px-4 py-2.5 border cursor-pointer text-sm font-mono transition-all select-none ${
              isSelected
                ? 'border-ink bg-ink text-paper'
                : 'border-ink/20 hover:border-ink/50 text-ink'
            }`}
          >
            <input
              type="radio"
              name={id}
              value={i}
              checked={isSelected}
              onChange={() => onChange(i)}
              className="sr-only"
            />
            {label}
          </label>
        );
      })}
    </div>
  );
}

export default function StepWorkNoc({ profile, onChange, locale, t }: StepWorkNocProps) {
  const isRtl = locale === 'fa';

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Section title */}
      <div className="flex items-center gap-3 pb-4 border-b border-ink/10">
        <div className="w-8 h-8 bg-acid flex items-center justify-center shrink-0">
          <Briefcase size={16} className="text-ink" />
        </div>
        <h2 className="font-serif text-xl text-ink">{t.step3_title}</h2>
      </div>

      {/* Canadian Work Experience */}
      <div className="space-y-3">
        <label className="block text-sm font-sans font-medium text-ink">{t.canadian_exp_label}</label>
        <ExpSelect
          id="canadian-exp"
          value={profile.canadianWorkExperienceYears}
          onChange={(v) => onChange({ canadianWorkExperienceYears: v as CandidateProfile['canadianWorkExperienceYears'] })}
          max={5}
          locale={locale}
          t={t}
        />
      </div>

      {/* Foreign Work Experience */}
      <div className="space-y-3">
        <label className="block text-sm font-sans font-medium text-ink">{t.foreign_exp_label}</label>
        <ExpSelect
          id="foreign-exp"
          value={profile.foreignWorkExperienceYears}
          onChange={(v) => onChange({ foreignWorkExperienceYears: v as CandidateProfile['foreignWorkExperienceYears'] })}
          max={3}
          locale={locale}
          t={t}
        />
      </div>

      {/* Certificate of Qualification */}
      <div className="space-y-2">
        <label className="block text-sm font-sans font-medium text-ink">{t.cert_label}</label>
        <p className="text-xs text-ink/50 font-sans">{t.cert_note}</p>
        <div className="flex gap-3" role="radiogroup">
          {([true, false] as const).map((val) => {
            const isSelected = profile.certificateOfQualification === val;
            return (
              <label
                key={String(val)}
                className={`px-6 py-2.5 border cursor-pointer text-sm font-sans transition-all select-none ${
                  isSelected ? 'border-ink bg-ink text-paper' : 'border-ink/20 hover:border-ink/50 text-ink'
                }`}
              >
                <input
                  type="radio"
                  name="cert"
                  value={String(val)}
                  checked={isSelected}
                  onChange={() => onChange({ certificateOfQualification: val })}
                  className="sr-only"
                />
                {val ? t.yes : t.no}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
