// ============================================================================
// Express Entry — Step 2: Education & Language
// /components/express-entry/steps/StepEducationLanguage.tsx
// ============================================================================
'use client';

import React from 'react';
import { GraduationCap } from 'lucide-react';
import CLBTooltip from '../ui/CLBTooltip';
import type { CandidateProfile, OfficialLanguageProfile } from '../../../lib/express-entry/types';
import { EducationLevel } from '../../../lib/express-entry/types';

interface T {
  step2_title: string;
  education_label: string;
  edu_less_secondary: string;
  edu_secondary: string;
  edu_one_year: string;
  edu_two_year: string;
  edu_bachelors: string;
  edu_two_plus: string;
  edu_masters: string;
  edu_doctoral: string;
  first_lang_label: string;
  second_lang_label: string;
  lang_english: string;
  lang_french: string;
  test_type: string;
  test_ielts: string;
  test_celpip: string;
  test_tef: string;
  test_tcf: string;
  speaking: string;
  listening: string;
  reading: string;
  writing: string;
  clb_level: string;
  no_second_lang: string;
  add_second_lang: string;
}

interface StepEducationLanguageProps {
  profile: Partial<CandidateProfile>;
  onChange: (changes: Partial<CandidateProfile>) => void;
  locale: string;
  t: T;
}

const EDU_LEVELS = [
  { val: EducationLevel.LessThanSecondary, key: 'edu_less_secondary' },
  { val: EducationLevel.SecondaryDiploma, key: 'edu_secondary' },
  { val: EducationLevel.OneYearPostSecondary, key: 'edu_one_year' },
  { val: EducationLevel.TwoYearPostSecondary, key: 'edu_two_year' },
  { val: EducationLevel.BachelorsDegree, key: 'edu_bachelors' },
  { val: EducationLevel.TwoPlusDegrees, key: 'edu_two_plus' },
  { val: EducationLevel.MastersDegree, key: 'edu_masters' },
  { val: EducationLevel.DoctoralDegree, key: 'edu_doctoral' },
] as const;

function CLBSelect({ id, value, onChange, label }: { id: string; value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-xs text-ink/60 font-sans">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2.5 border border-ink/20 bg-paper font-mono text-sm focus:border-ink focus:outline-none appearance-none cursor-pointer"
      >
        <option value={0}>—</option>
        {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((clb) => (
          <option key={clb} value={clb}>CLB {clb}</option>
        ))}
      </select>
    </div>
  );
}

function LanguageBlock({
  langProfile,
  onChange,
  locale,
  t,
  prefix,
  allowSecond,
}: {
  langProfile: OfficialLanguageProfile | undefined;
  onChange: (lp: OfficialLanguageProfile | undefined) => void;
  locale: string;
  t: T;
  prefix: string; // for aria ID namespacing
  allowSecond?: boolean;
}) {
  const isRtl = locale === 'fa';
  const lp = langProfile ?? {
    language: 'english' as const,
    scores: { speaking: 0, listening: 0, reading: 0, writing: 0 },
  };

  const updateScores = (ability: keyof typeof lp.scores, val: number) => {
    onChange({ ...lp, scores: { ...lp.scores, [ability]: val } });
  };

  if (allowSecond && !langProfile) {
    return (
      <button
        type="button"
        onClick={() => onChange({ language: 'english', scores: { speaking: 0, listening: 0, reading: 0, writing: 0 } })}
        className="text-sm text-ink/50 underline underline-offset-2 hover:text-ink transition-colors"
      >
        + {t.add_second_lang}
      </button>
    );
  }

  return (
    <div className="space-y-4 p-4 border border-ink/10 bg-ink/[0.01]">
      {/* Language selection + test type */}
      <div className="flex flex-wrap gap-4">
        <div className="space-y-1.5 flex-1 min-w-[140px]">
          <label htmlFor={`${prefix}-lang`} className="block text-xs text-ink/60 font-sans">{t.first_lang_label.split(' ')[0] === 'زبان' ? 'زبان' : 'Language'}</label>
          <select
            id={`${prefix}-lang`}
            value={lp.language}
            onChange={(e) => onChange({ ...lp, language: e.target.value as 'english' | 'french' })}
            className="w-full px-3 py-2.5 border border-ink/20 bg-paper font-sans text-sm focus:border-ink focus:outline-none appearance-none"
          >
            <option value="english">{t.lang_english}</option>
            <option value="french">{t.lang_french}</option>
          </select>
        </div>

        <div className="space-y-1.5 flex-1 min-w-[140px]">
          <label htmlFor={`${prefix}-test`} className="block text-xs text-ink/60 font-sans">{t.test_type}</label>
          <select
            id={`${prefix}-test`}
            value={lp.testType ?? ''}
            onChange={(e) => onChange({ ...lp, testType: e.target.value as OfficialLanguageProfile['testType'] })}
            className="w-full px-3 py-2.5 border border-ink/20 bg-paper font-sans text-sm focus:border-ink focus:outline-none appearance-none"
          >
            <option value="">{isRtl ? '— انتخاب آزمون' : '— Select test'}</option>
            {lp.language === 'english' ? (
              <>
                <option value="IELTS_General">{t.test_ielts}</option>
                <option value="CELPIP_General">{t.test_celpip}</option>
              </>
            ) : (
              <>
                <option value="TEF_Canada">{t.test_tef}</option>
                <option value="TCF_Canada">{t.test_tcf}</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* CLB per-ability selects */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <CLBSelect id={`${prefix}-speaking`} value={lp.scores.speaking} onChange={(v) => updateScores('speaking', v)} label={t.speaking} />
        <CLBSelect id={`${prefix}-listening`} value={lp.scores.listening} onChange={(v) => updateScores('listening', v)} label={t.listening} />
        <CLBSelect id={`${prefix}-reading`} value={lp.scores.reading} onChange={(v) => updateScores('reading', v)} label={t.reading} />
        <CLBSelect id={`${prefix}-writing`} value={lp.scores.writing} onChange={(v) => updateScores('writing', v)} label={t.writing} />
      </div>

      {/* Remove second language button */}
      {allowSecond && (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="text-xs text-ink/40 underline underline-offset-2 hover:text-ink transition-colors"
        >
          {isRtl ? 'حذف زبان دوم' : 'Remove second language'}
        </button>
      )}
    </div>
  );
}

export default function StepEducationLanguage({ profile, onChange, locale, t }: StepEducationLanguageProps) {
  const isRtl = locale === 'fa';

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Section title */}
      <div className="flex items-center gap-3 pb-4 border-b border-ink/10">
        <div className="w-8 h-8 bg-acid flex items-center justify-center shrink-0">
          <GraduationCap size={16} className="text-ink" />
        </div>
        <h2 className="font-serif text-xl text-ink">{t.step2_title}</h2>
      </div>

      {/* Education Level */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-sans font-medium text-ink mb-3">{t.education_label}</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EDU_LEVELS.map(({ val, key }) => {
            const label = t[key as keyof T] as string;
            const isSelected = profile.education === val;
            return (
              <label
                key={val}
                className={`flex items-center gap-3 px-4 py-3 border cursor-pointer text-sm font-sans transition-all select-none ${
                  isSelected ? 'border-ink bg-ink text-paper' : 'border-ink/15 hover:border-ink/40 text-ink'
                }`}
              >
                <input
                  type="radio"
                  name="education"
                  value={val}
                  checked={isSelected}
                  onChange={() => onChange({ education: val })}
                  className="sr-only"
                />
                <span className={`font-mono text-xs ${isSelected ? 'text-acid' : 'text-ink/30'}`}>0{val}</span>
                {label}
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* First Official Language */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-sm font-sans font-medium text-ink">{t.first_lang_label}</label>
          <CLBTooltip locale={locale} />
        </div>
        <LanguageBlock
          langProfile={profile.firstLanguage}
          onChange={(lp) => onChange({ firstLanguage: lp })}
          locale={locale}
          t={t}
          prefix="first-lang"
        />
      </div>

      {/* Second Official Language */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-sm font-sans font-medium text-ink">{t.second_lang_label}</label>
          <CLBTooltip locale={locale} />
        </div>
        <LanguageBlock
          langProfile={profile.secondLanguage}
          onChange={(lp) => onChange({ secondLanguage: lp })}
          locale={locale}
          t={t}
          prefix="second-lang"
          allowSecond
        />
      </div>
    </div>
  );
}
