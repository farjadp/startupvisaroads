// ============================================================================
// Express Entry — Step 1: Personal Information
// /components/express-entry/steps/StepPersonal.tsx
// ============================================================================
'use client';

import React from 'react';
import { User } from 'lucide-react';
import NocSearch from '../ui/NocSearch';
import type { CandidateProfile } from '../../../lib/express-entry/types';

// i18n dictionary subset passed from parent
interface T {
  step1_title: string;
  marital_status: string;
  marital_single: string;
  marital_married: string;
  marital_cl: string;
  spouse_coming: string;
  spouse_yes: string;
  spouse_no: string;
  age: string;
  age_note: string;
  noc_label: string;
  noc_placeholder: string;
}

interface StepPersonalProps {
  profile: Partial<CandidateProfile>;
  onChange: (changes: Partial<CandidateProfile>) => void;
  locale: string;
  t: T;
}

function FieldGroup({ label, children, htmlFor }: { label: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-sans font-medium text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}

function RadioGroup<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { val: T; label: string }[];
  value: T | undefined;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3" role="radiogroup">
      {options.map((opt) => (
        <label
          key={opt.val}
          className={`flex items-center gap-2 px-4 py-2.5 border cursor-pointer text-sm font-sans transition-all select-none ${
            value === opt.val
              ? 'border-ink bg-ink text-paper'
              : 'border-ink/20 hover:border-ink/50 text-ink'
          }`}
        >
          <input
            type="radio"
            name={name}
            value={opt.val}
            checked={value === opt.val}
            onChange={() => onChange(opt.val)}
            className="sr-only"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

export default function StepPersonal({ profile, onChange, locale, t }: StepPersonalProps) {
  const isRtl = locale === 'fa';
  const maritalStatus = profile.maritalStatus;
  const isMarried = maritalStatus === 'married' || maritalStatus === 'commonLaw';

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Section title */}
      <div className="flex items-center gap-3 pb-4 border-b border-ink/10">
        <div className="w-8 h-8 bg-acid flex items-center justify-center shrink-0">
          <User size={16} className="text-ink" />
        </div>
        <h2 className="font-serif text-xl text-ink">{t.step1_title}</h2>
      </div>

      {/* Marital Status */}
      <FieldGroup label={t.marital_status}>
        <RadioGroup
          name="maritalStatus"
          value={maritalStatus}
          onChange={(v) => onChange({ maritalStatus: v as CandidateProfile['maritalStatus'], spouseComingToCanada: false })}
          options={[
            { val: 'single', label: t.marital_single },
            { val: 'married', label: t.marital_married },
            { val: 'commonLaw', label: t.marital_cl },
          ]}
        />
      </FieldGroup>

      {/* Spouse coming to Canada — only if married/CL */}
      {isMarried && (
        <FieldGroup label={t.spouse_coming}>
          <RadioGroup
            name="spouseComingToCanada"
            value={profile.spouseComingToCanada === true ? 'yes' : profile.spouseComingToCanada === false ? 'no' : undefined}
            onChange={(v) => onChange({ spouseComingToCanada: v === 'yes' })}
            options={[
              { val: 'yes', label: t.spouse_yes },
              { val: 'no', label: t.spouse_no },
            ]}
          />
        </FieldGroup>
      )}

      {/* Age */}
      <FieldGroup label={t.age} htmlFor="field-age">
        <div className="flex items-center gap-3">
          <input
            id="field-age"
            type="number"
            min={17}
            max={99}
            value={profile.age ?? ''}
            onChange={(e) => onChange({ age: Number(e.target.value) })}
            placeholder="e.g. 30"
            className="w-28 px-4 py-3 border border-ink/20 bg-paper font-mono text-sm focus:border-ink focus:outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <p className="text-xs text-ink/40 font-sans">{t.age_note}</p>
        </div>
      </FieldGroup>

      {/* NOC Code */}
      <NocSearch
        id="field-noc"
        value={profile.nocCode ?? ''}
        onChange={(code) => onChange({ nocCode: code })}
        locale={locale}
        label={t.noc_label}
        placeholder={t.noc_placeholder}
      />
    </div>
  );
}
