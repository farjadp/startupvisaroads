// ============================================================================
// Express Entry — Results Screen
// /components/express-entry/results/ResultsScreen.tsx
// ============================================================================
'use client';

import React, { useState } from 'react';
import {
  ArrowRight, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, XCircle, TrendingUp, Globe, Star, BookOpen
} from 'lucide-react';
import type { DiagnosticResult, PathwayType, CrsBreakdown } from '../../../lib/express-entry/types';
import { Link } from '@/navigation';

// ——— i18n labels ——————————————————————————————————————————————
interface T {
  your_score: string;
  out_of: string;
  breakdown_title: string;
  core_hc: string;
  age: string;
  education: string;
  first_lang: string;
  second_lang: string;
  canadian_exp: string;
  spouse_factors: string;
  transferability: string;
  additional: string;
  pnp_pts: string;
  french_pts: string;
  can_edu_pts: string;
  sibling_pts: string;
  job_offer_pts: string;
  job_offer_zero_note: string;
  total: string;
  categories_title: string;
  eligible: string;
  not_eligible: string;
  cutoff_label: string;
  cutoff_caution: string;
  pathways_title: string;
  score_gain: string;
  book_cta: string;
  disclaimer_title: string;
  disclaimer: string;
  rules_version: string;
  last_verified: string;
  restart: string;
  no_category_match: string;
}

interface ResultsScreenProps {
  result: DiagnosticResult;
  locale: string;
  t: T;
  onRestart: () => void;
}

// ——— Score Gauge ————————————————————————————————————————————

function ScoreGauge({ score }: { score: number }) {
  // Max realistic CRS without PNP is ~1200 (PNP adds 600); display cap 1200
  const displayMax = score >= 600 ? 1200 : 1200;
  const pct = Math.min((score / displayMax) * 100, 100);

  return (
    <div className="relative flex flex-col items-center py-8">
      {/* Circular gauge (SVG) */}
      <svg viewBox="0 0 200 120" className="w-64 h-36" aria-hidden="true">
        {/* Track arc */}
        <path
          d="M 20 110 A 80 80 0 0 1 180 110"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="12"
          strokeOpacity="0.08"
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d="M 20 110 A 80 80 0 0 1 180 110"
          fill="none"
          stroke="#CCFF00"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * 251.2} 251.2`}
          className="transition-all duration-1000 ease-out"
        />
        {/* Score text */}
        <text x="100" y="90" textAnchor="middle" className="font-mono" fontSize="36" fontWeight="700" fill="#1a1a1a">
          {score}
        </text>
      </svg>

      {/* Score labels */}
      <div className="flex justify-between w-64 -mt-1">
        <span className="text-xs font-mono text-ink/30">0</span>
        <span className="text-xs font-mono text-ink/30">{displayMax}</span>
      </div>
    </div>
  );
}

// ——— Breakdown Row ——————————————————————————————————————————

function BRow({ label, pts, note }: { label: string; pts: number; note?: string }) {
  return (
    <div className="flex items-baseline justify-between py-2 border-b border-ink/5 gap-4">
      <div>
        <span className="text-sm font-sans text-ink">{label}</span>
        {note && <p className="text-[11px] text-amber-600 font-sans mt-0.5">{note}</p>}
      </div>
      <span className={`font-mono text-sm font-bold shrink-0 ${pts > 0 ? 'text-ink' : 'text-ink/30'}`}>
        +{pts}
      </span>
    </div>
  );
}

// ——— Breakdown Accordion ——————————————————————————————————

function BreakdownAccordion({ breakdown, t }: { breakdown: CrsBreakdown; t: T }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-ink/10">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-sans font-semibold text-ink hover:bg-ink/[0.02] transition-colors"
        aria-expanded={open}
      >
        {t.breakdown_title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-6">
          {/* Core Human Capital */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-2">{t.core_hc}</h4>
            <BRow label={t.age} pts={breakdown.coreHumanCapital.age} />
            <BRow label={t.education} pts={breakdown.coreHumanCapital.education} />
            <BRow label={t.first_lang} pts={breakdown.coreHumanCapital.firstLanguage} />
            <BRow label={t.second_lang} pts={breakdown.coreHumanCapital.secondLanguage} />
            <BRow label={t.canadian_exp} pts={breakdown.coreHumanCapital.canadianWorkExperience} />
            <div className="flex justify-between pt-2 font-semibold text-sm">
              <span>{t.total}</span>
              <span className="font-mono">{breakdown.coreHumanCapital.subtotal}</span>
            </div>
          </div>

          {/* Spouse Factors */}
          {breakdown.spouseFactors.subtotal > 0 && (
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-2">{t.spouse_factors}</h4>
              <BRow label={t.education} pts={breakdown.spouseFactors.education} />
              <BRow label={t.first_lang} pts={breakdown.spouseFactors.language} />
              <BRow label={t.canadian_exp} pts={breakdown.spouseFactors.canadianWorkExperience} />
              <div className="flex justify-between pt-2 font-semibold text-sm">
                <span>{t.total}</span>
                <span className="font-mono">{breakdown.spouseFactors.subtotal}</span>
              </div>
            </div>
          )}

          {/* Skill Transferability */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-2">{t.transferability}</h4>
            <BRow label="Education × Language" pts={breakdown.skillTransferability.educationLanguage} />
            <BRow label="Education × Canadian Work Exp" pts={breakdown.skillTransferability.educationCanadianExperience} />
            <BRow label="Foreign Exp × Language" pts={breakdown.skillTransferability.foreignExperienceLanguage} />
            <BRow label="Foreign Exp × Canadian Work Exp" pts={breakdown.skillTransferability.foreignExperienceCanadianExperience} />
            <BRow label="Certificate × Language" pts={breakdown.skillTransferability.certificateLanguage} />
            <div className="flex justify-between pt-2 font-semibold text-sm">
              <span>{t.total} (max 100)</span>
              <span className="font-mono">{breakdown.skillTransferability.subtotal}</span>
            </div>
          </div>

          {/* Additional Points */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-ink/40 mb-2">{t.additional}</h4>
            <BRow label={t.pnp_pts} pts={breakdown.additionalPoints.provincialNomination} />
            <BRow label={t.french_pts} pts={breakdown.additionalPoints.frenchLanguage} />
            <BRow label={t.can_edu_pts} pts={breakdown.additionalPoints.canadianEducation} />
            <BRow label={t.sibling_pts} pts={breakdown.additionalPoints.sibling} />
            <BRow
              label={t.job_offer_pts}
              pts={0}
              note={t.job_offer_zero_note}
            />
            <div className="flex justify-between pt-2 font-semibold text-sm">
              <span>{t.total}</span>
              <span className="font-mono">{breakdown.additionalPoints.subtotal}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ——— Category Card ——————————————————————————————————————————

function CategoryCard({ category, locale, t }: {
  category: DiagnosticResult['categoryMatches'][0];
  locale: string;
  t: T;
}) {
  const isRtl = locale === 'fa';
  const [showReason, setShowReason] = useState(false);

  return (
    <div className={`border p-4 space-y-2 transition-colors ${category.eligible ? 'border-acid bg-acid/5' : 'border-ink/10 bg-ink/[0.01] opacity-60'}`}>
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-sans font-semibold text-sm text-ink">
          {isRtl ? category.nameFa : category.name}
        </h4>
        {category.eligible ? (
          <CheckCircle2 size={18} className="text-green-600 shrink-0" />
        ) : (
          <XCircle size={18} className="text-ink/20 shrink-0" />
        )}
      </div>

      <p className="text-xs text-ink/60 font-sans">
        {isRtl ? category.descriptionFa : category.description}
      </p>

      {category.eligible && category.recentCutoff !== null && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-ink">{t.cutoff_label}: {category.recentCutoff}</span>
          <span className="text-xs text-ink/40 font-sans">({category.cutoffDrawDate})</span>
        </div>
      )}

      {category.eligible && (
        <p className="text-[10px] text-ink/50 font-sans italic">{t.cutoff_caution}</p>
      )}

      <button
        type="button"
        onClick={() => setShowReason(!showReason)}
        className="text-xs text-ink/40 hover:text-ink underline underline-offset-2 transition-colors"
      >
        {showReason ? '↑ ' : '↓ '}{isRtl ? 'دلیل' : 'Why?'}
      </button>

      {showReason && (
        <p className="text-xs text-ink/60 font-sans pt-1">
          {isRtl ? category.eligibilityReasonFa : category.eligibilityReason}
        </p>
      )}
    </div>
  );
}

// ——— Pathway Icon ——————————————————————————————————————————

function PathwayIcon({ type }: { type: PathwayType }) {
  const icons: Record<PathwayType, React.ReactNode> = {
    general_draw: <Globe size={18} />,
    category_draw: <Star size={18} />,
    pnp: <TrendingUp size={18} />,
    french_pathway: <BookOpen size={18} />,
    improve_language: <TrendingUp size={18} />,
    gain_experience: <TrendingUp size={18} />,
    improve_education: <BookOpen size={18} />,
  };
  return <>{icons[type] ?? <TrendingUp size={18} />}</>;
}

// ——— Pathway Card ——————————————————————————————————————————

function PathwayCard({ rec, locale, t }: {
  rec: DiagnosticResult['pathwayRecommendations'][0];
  locale: string;
  t: T;
}) {
  const isRtl = locale === 'fa';
  const isTop = rec.rank === 1;

  return (
    <div className={`border p-5 space-y-3 ${isTop ? 'border-ink bg-ink text-paper' : 'border-ink/10'}`}>
      <div className="flex items-center gap-3">
        <div className={`shrink-0 ${isTop ? 'text-acid' : 'text-ink/40'}`}>
          <PathwayIcon type={rec.type} />
        </div>
        <h4 className={`font-sans font-semibold text-sm ${isTop ? 'text-paper' : 'text-ink'}`}>
          {isRtl ? rec.titleFa : rec.titleEn}
        </h4>
        <span className={`ms-auto font-mono text-xs px-2 py-0.5 border ${isTop ? 'border-acid text-acid' : 'border-ink/20 text-ink/40'}`}>
          #{rec.rank}
        </span>
      </div>

      <p className={`text-xs font-sans leading-relaxed ${isTop ? 'text-paper/80' : 'text-ink/60'}`}>
        {isRtl ? rec.rationaleFa : rec.rationale}
      </p>

      {/* Score deltas */}
      {rec.scoreDeltas && rec.scoreDeltas.length > 0 && (
        <div className="space-y-1.5">
          {rec.scoreDeltas.slice(0, 3).map((delta, i) => (
            <div key={i} className={`flex items-center gap-2 text-xs font-sans p-2 border ${isTop ? 'border-acid/30 bg-acid/10 text-acid' : 'border-acid bg-acid/10 text-ink'}`}>
              <TrendingUp size={12} className="shrink-0" />
              <span className="flex-1 truncate">{isRtl ? delta.actionFa : delta.action}</span>
              <span className="font-mono font-bold shrink-0">+{delta.pointsGained} {t.score_gain}</span>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      {rec.actionLink && (
        <Link
          href={rec.actionLink as any}
          className={`inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider transition-opacity hover:opacity-70 ${isTop ? 'text-acid' : 'text-ink'}`}
        >
          {isRtl ? rec.actionLabelFa : rec.actionLabelEn}
          <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}

// ——— Main Results Screen ——————————————————————————————————

export default function ResultsScreen({ result, locale, t, onRestart }: ResultsScreenProps) {
  const isRtl = locale === 'fa';
  const { crsResult, categoryMatches, pathwayRecommendations, rulesVersion, lastVerified } = result;
  const eligibleCategories = categoryMatches.filter((c) => c.eligible);

  return (
    <div className="space-y-10" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ——— Score Hero ——————————————————————————————————— */}
      <div className="text-center space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/40">
          {isRtl ? 'امتیاز تخمینی CRS شما' : 'Your Estimated CRS Score'}
        </p>
        <ScoreGauge score={crsResult.total} />
        <p className="text-sm text-ink/50 font-sans">{t.out_of} 1,200</p>
      </div>

      {/* ——— Score Breakdown Accordion ————————————————————— */}
      <BreakdownAccordion breakdown={crsResult.breakdown} t={t} />

      {/* ——— Category Match Cards ————————————————————————— */}
      <section aria-labelledby="categories-heading">
        <h3 id="categories-heading" className="font-serif text-xl text-ink mb-4">{t.categories_title}</h3>

        {eligibleCategories.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {eligibleCategories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} locale={locale} t={t} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink/50 font-sans p-4 border border-ink/10">{t.no_category_match}</p>
        )}

        {/* Show ineligible categories collapsed */}
        {categoryMatches.filter((c) => !c.eligible).length > 0 && (
          <details className="mt-3">
            <summary className="text-xs text-ink/40 cursor-pointer hover:text-ink transition-colors font-sans">
              {isRtl
                ? `${categoryMatches.filter((c) => !c.eligible).length} دسته دیگر (غیر واجد شرایط)`
                : `${categoryMatches.filter((c) => !c.eligible).length} other categories (not eligible)`}
            </summary>
            <div className="grid gap-3 sm:grid-cols-2 mt-3">
              {categoryMatches.filter((c) => !c.eligible).map((cat) => (
                <CategoryCard key={cat.id} category={cat} locale={locale} t={t} />
              ))}
            </div>
          </details>
        )}
      </section>

      {/* ——— Pathway Recommendations ——————————————————————— */}
      <section aria-labelledby="pathways-heading">
        <h3 id="pathways-heading" className="font-serif text-xl text-ink mb-4">{t.pathways_title}</h3>
        <div className="space-y-3">
          {pathwayRecommendations.map((rec) => (
            <PathwayCard key={rec.rank} rec={rec} locale={locale} t={t} />
          ))}
        </div>
      </section>

      {/* ——— Disclaimer (mandatory) ————————————————————————— */}
      <div className="p-4 border border-ink/20 bg-ink/[0.02] space-y-2" role="note" aria-label={isRtl ? 'سلب مسئولیت' : 'Legal disclaimer'}>
        <div className="flex items-center gap-2 text-ink/60">
          <AlertTriangle size={14} className="shrink-0" />
          <h4 className="font-sans font-semibold text-xs uppercase tracking-wider">{t.disclaimer_title}</h4>
        </div>
        <p className="text-xs text-ink/50 font-sans leading-relaxed">{t.disclaimer}</p>
      </div>

      {/* ——— CRS Footer ————————————————————————————————————— */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-4">
        <div className="text-xs text-ink/30 font-mono space-y-0.5">
          <p>{t.rules_version}: {rulesVersion}</p>
          <p>{t.last_verified}: {lastVerified}</p>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="text-xs font-sans text-ink/50 underline underline-offset-2 hover:text-ink transition-colors"
        >
          ↺ {t.restart}
        </button>
      </div>
    </div>
  );
}
