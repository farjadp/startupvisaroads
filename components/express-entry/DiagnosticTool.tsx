// ============================================================================
// Express Entry — Root Diagnostic Tool Orchestrator
// /components/express-entry/DiagnosticTool.tsx
//
// Manages 4-step form state and transitions between steps and result screen.
// All CRS computation happens client-side via the engine module.
// ============================================================================
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ArrowRight, ArrowLeft, Calculator } from 'lucide-react';
import ProgressBar from './ui/ProgressBar';
import StepPersonal from './steps/StepPersonal';
import StepEducationLanguage from './steps/StepEducationLanguage';
import StepWorkNoc from './steps/StepWorkNoc';
import StepExtras from './steps/StepExtras';
import ResultsScreen from './results/ResultsScreen';

import { calculateCRS } from '../../lib/express-entry/crs-engine';
import { matchCategories } from '../../lib/express-entry/category-matcher';
import { buildPathwayRecommendations } from '../../lib/express-entry/pathway-advisor';
import type { CandidateProfile, DiagnosticResult } from '../../lib/express-entry/types';
import { EducationLevel } from '../../lib/express-entry/types';

import crsPoints from '../../config/crs-points.json';
import pathwayAdvisorConfig from '../../config/pathway-advisor.json';

// ——— Initial default profile ——————————————————————————————

const DEFAULT_PROFILE: Partial<CandidateProfile> = {
  maritalStatus: 'single',
  spouseComingToCanada: false,
  nocCode: '',
  education: EducationLevel.BachelorsDegree,
  firstLanguage: {
    language: 'english',
    scores: { speaking: 0, listening: 0, reading: 0, writing: 0 },
  },
  secondLanguage: undefined,
  canadianWorkExperienceYears: 0,
  foreignWorkExperienceYears: 0,
  spouseEducation: undefined,
  spouseFirstLanguage: undefined,
  spouseCanadianWorkExperienceYears: 0,
  certificateOfQualification: false,
  provincialNomination: false,
  jobOffer: false,
  canadianEducation: 'none',
  siblingInCanada: false,
  frenchSkills: { speaking: 0, listening: 0, reading: 0, writing: 0 },
};

// ——— Validation ————————————————————————————————————————————

function validateStep(step: number, profile: Partial<CandidateProfile>): string[] {
  const errors: string[] = [];
  if (step === 1) {
    if (!profile.maritalStatus) errors.push('Select marital status');
    if ((profile.maritalStatus === 'married' || profile.maritalStatus === 'commonLaw') && profile.spouseComingToCanada === undefined) {
      errors.push('Indicate whether your spouse is coming to Canada');
    }
    if (!profile.age || profile.age < 17) errors.push('Enter a valid age (17 or older)');
    if (!profile.nocCode) errors.push('Select your NOC occupation code');
  }
  if (step === 2) {
    if (profile.education === undefined) errors.push('Select your education level');
    if (!profile.firstLanguage?.scores || profile.firstLanguage.scores.speaking === 0) {
      errors.push('Enter your first official language CLB scores (all 4 abilities)');
    }
  }
  if (step === 3) {
    if (profile.canadianWorkExperienceYears === undefined) errors.push('Select Canadian work experience');
    if (profile.foreignWorkExperienceYears === undefined) errors.push('Select foreign work experience');
    if (profile.certificateOfQualification === undefined) errors.push('Indicate certificate of qualification');
  }
  // Step 4 extras are all optional — no validation needed
  return errors;
}

// ——— Main Component ————————————————————————————————————————

interface DiagnosticToolProps {
  locale: string;
  messages: Record<string, string>;
}

const TOTAL_STEPS = 4;

export default function DiagnosticTool({ locale, messages: m }: DiagnosticToolProps) {
  const isRtl = locale === 'fa';
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<CandidateProfile>>(DEFAULT_PROFILE);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [computing, setComputing] = useState(false);

  const updateProfile = useCallback((changes: Partial<CandidateProfile>) => {
    setProfile((prev) => ({ ...prev, ...changes }));
    setErrors([]);
  }, []);

  const stepLabels = [m.step1_short, m.step2_short, m.step3_short, m.step4_short];

  const handleNext = useCallback(() => {
    const errs = validateStep(step, profile);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    setErrors([]);
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Compute results
      setComputing(true);
      try {
        const fullProfile = profile as CandidateProfile;
        const crsResult = calculateCRS(fullProfile);
        const categoryMatches = matchCategories(fullProfile);
        const pathwayRecommendations = buildPathwayRecommendations(fullProfile, crsResult, categoryMatches);
        setResult({
          profile: fullProfile,
          crsResult,
          categoryMatches,
          pathwayRecommendations,
          rulesVersion: crsPoints.rulesVersion,
          lastVerified: crsPoints.lastVerified,
        });
      } catch (err) {
        console.error('[DiagnosticTool] Engine error:', err);
        setErrors([isRtl ? 'خطا در محاسبه. لطفاً مقادیر را بررسی کنید.' : 'Calculation error. Please check your inputs.']);
      } finally {
        setComputing(false);
      }
    }
  }, [step, profile, isRtl]);

  const handleBack = useCallback(() => {
    setErrors([]);
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRestart = useCallback(() => {
    setStep(1);
    setProfile(DEFAULT_PROFILE);
    setResult(null);
    setErrors([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ——— Common T for sub-steps ———————————————————————————
  const t = useMemo(() => m, [m]);

  // ——— Result screen ————————————————————————————————————
  if (result) {
    return (
      <div className="w-full">
        <ResultsScreen
          result={result}
          locale={locale}
          t={{
            your_score: m.your_score,
            out_of: m.out_of,
            breakdown_title: m.breakdown_title,
            core_hc: m.core_hc,
            age: m.age,
            education: m.education,
            first_lang: m.first_lang,
            second_lang: m.second_lang,
            canadian_exp: m.canadian_exp,
            spouse_factors: m.spouse_factors,
            transferability: m.transferability,
            additional: m.additional,
            pnp_pts: m.pnp_pts,
            french_pts: m.french_pts,
            can_edu_pts: m.can_edu_pts,
            sibling_pts: m.sibling_pts,
            job_offer_pts: m.job_offer_pts,
            job_offer_zero_note: m.job_offer_zero_note,
            total: m.total,
            categories_title: m.categories_title,
            eligible: m.eligible,
            not_eligible: m.not_eligible,
            cutoff_label: m.cutoff_label,
            cutoff_caution: m.cutoff_caution,
            pathways_title: m.pathways_title,
            score_gain: m.score_gain,
            book_cta: m.book_cta,
            disclaimer_title: m.disclaimer_title,
            disclaimer: m.disclaimer,
            rules_version: m.rules_version,
            last_verified: m.last_verified,
            restart: m.restart,
            no_category_match: m.no_category_match,
          }}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  // ——— Form steps ——————————————————————————————————————
  const isLastStep = step === TOTAL_STEPS;

  return (
    <div className="w-full space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <ProgressBar
        currentStep={step}
        totalSteps={TOTAL_STEPS}
        stepLabels={stepLabels}
        isRtl={isRtl}
      />

      {/* Step content */}
      <div className="min-h-[400px]">
        {step === 1 && (
          <StepPersonal
            profile={profile}
            onChange={updateProfile}
            locale={locale}
            t={{
              step1_title: m.step1_title,
              marital_status: m.marital_status,
              marital_single: m.marital_single,
              marital_married: m.marital_married,
              marital_cl: m.marital_cl,
              spouse_coming: m.spouse_coming,
              spouse_yes: m.spouse_yes,
              spouse_no: m.spouse_no,
              age: m.age,
              age_note: m.age_note,
              noc_label: m.noc_label,
              noc_placeholder: m.noc_placeholder,
            }}
          />
        )}
        {step === 2 && (
          <StepEducationLanguage
            profile={profile}
            onChange={updateProfile}
            locale={locale}
            t={{
              step2_title: m.step2_title,
              education_label: m.education_label,
              edu_less_secondary: m.edu_less_secondary,
              edu_secondary: m.edu_secondary,
              edu_one_year: m.edu_one_year,
              edu_two_year: m.edu_two_year,
              edu_bachelors: m.edu_bachelors,
              edu_two_plus: m.edu_two_plus,
              edu_masters: m.edu_masters,
              edu_doctoral: m.edu_doctoral,
              first_lang_label: m.first_lang_label,
              second_lang_label: m.second_lang_label,
              lang_english: m.lang_english,
              lang_french: m.lang_french,
              test_type: m.test_type,
              test_ielts: m.test_ielts,
              test_celpip: m.test_celpip,
              test_tef: m.test_tef,
              test_tcf: m.test_tcf,
              speaking: m.speaking,
              listening: m.listening,
              reading: m.reading,
              writing: m.writing,
              clb_level: m.clb_level,
              no_second_lang: m.no_second_lang,
              add_second_lang: m.add_second_lang,
            }}
          />
        )}
        {step === 3 && (
          <StepWorkNoc
            profile={profile}
            onChange={updateProfile}
            locale={locale}
            t={{
              step3_title: m.step3_title,
              canadian_exp_label: m.canadian_exp_label,
              foreign_exp_label: m.foreign_exp_label,
              cert_label: m.cert_label,
              cert_note: m.cert_note,
              years: m.years,
              year: m.year,
              or_more: m.or_more,
              yes: m.yes,
              no: m.no,
            }}
          />
        )}
        {step === 4 && (
          <StepExtras
            profile={profile}
            onChange={updateProfile}
            locale={locale}
            t={{
              step4_title: m.step4_title,
              pnp_label: m.pnp_label,
              pnp_note: m.pnp_note,
              job_offer_label: m.job_offer_label,
              job_offer_removed_note: m.job_offer_removed_note,
              canadian_edu_label: m.canadian_edu_label,
              edu_none: m.edu_none,
              edu_one_two: m.edu_one_two,
              edu_three_plus: m.edu_three_plus,
              sibling_label: m.sibling_label,
              sibling_note: m.sibling_note,
              french_label: m.french_label,
              french_note: m.french_note,
              speaking: m.speaking,
              listening: m.listening,
              reading: m.reading,
              writing: m.writing,
              yes: m.yes,
              no: m.no,
            }}
          />
        )}
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="space-y-1 p-4 border border-red-200 bg-red-50/50" role="alert">
          {errors.map((e, i) => (
            <p key={i} className="text-xs text-red-700 font-sans">• {e}</p>
          ))}
        </div>
      )}

      {/* Navigation buttons */}
      <div className={`flex gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-5 py-3 border border-ink/20 text-sm font-sans font-medium text-ink hover:border-ink transition-colors"
            aria-label={m.back}
          >
            {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            {m.back}
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={computing}
          className="flex items-center gap-2 px-6 py-3 bg-ink text-paper text-sm font-sans font-semibold hover:bg-ink/90 transition-colors disabled:opacity-50 ms-auto"
          aria-label={isLastStep ? m.calculate : m.next}
        >
          {computing ? (
            <span className="font-mono text-xs">{isRtl ? 'در حال محاسبه...' : 'Calculating...'}</span>
          ) : (
            <>
              {isLastStep && <Calculator size={16} />}
              {isLastStep ? m.calculate : m.next}
              {!isLastStep && (isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} />)}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
