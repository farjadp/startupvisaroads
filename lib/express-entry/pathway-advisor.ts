// ============================================================================
// Express Entry — Pathway Advisor
// Source: /lib/express-entry/pathway-advisor.ts
//
// Takes a CrsResult + category matches and produces ranked pathway
// recommendations, including concrete score-improvement deltas computed
// by the CRS engine.
//
// Thresholds are read from /config/pathway-advisor.json — never hardcoded.
// ============================================================================

import type { CandidateProfile, CrsResult, CategoryMatch, PathwayRecommendation, ScoreDelta } from './types';
import { EducationLevel } from './types';
import { computeScoreDelta } from './crs-engine';
import advisorConfig from '../../config/pathway-advisor.json';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const cutoffs = advisorConfig.cutoffReferences;
const thresholds = advisorConfig.pathwayThresholds;

function isCompetitiveForGeneral(score: number): boolean {
  return score >= cutoffs.generalDraw.recentScore;
}

function isNearGeneral(score: number): boolean {
  const gap = cutoffs.generalDraw.recentScore - score;
  return gap > 0 && gap <= thresholds.nearCompetitiveForGeneralDraw.marginBelowCutoff;
}

function isCompetitiveForFrench(score: number): boolean {
  return score >= cutoffs.frenchDraw.recentScore;
}

/** Computes concrete score deltas for realistic improvement levers. */
function buildScoreDeltas(profile: CandidateProfile, currentScore: number): ScoreDelta[] {
  const deltas: ScoreDelta[] = [];

  // Lever 1: First language CLB 9 across all abilities
  const firstLangMax = Math.max(
    profile.firstLanguage.scores.speaking,
    profile.firstLanguage.scores.listening,
    profile.firstLanguage.scores.reading,
    profile.firstLanguage.scores.writing,
  );
  if (firstLangMax < 9) {
    const { delta, newScore } = computeScoreDelta(profile, {
      firstLanguage: {
        ...profile.firstLanguage,
        scores: { speaking: 9, listening: 9, reading: 9, writing: 9 },
      },
    });
    if (delta > 0) {
      deltas.push({
        action: `Raise all ${profile.firstLanguage.language === 'english' ? 'English (IELTS/CELPIP)' : 'French (TEF/TCF)'} abilities to CLB 9`,
        actionFa: `بهبود تمام مهارت‌های ${profile.firstLanguage.language === 'english' ? 'انگلیسی' : 'فرانسوی'} به CLB ۹`,
        pointsGained: delta,
        newScore,
      });
    }
  }

  // Lever 2: Canadian work experience + 1 year (if under 5)
  if (profile.canadianWorkExperienceYears < 5) {
    const nextYear = Math.min(profile.canadianWorkExperienceYears + 1, 5) as 0 | 1 | 2 | 3 | 4 | 5;
    const { delta, newScore } = computeScoreDelta(profile, {
      canadianWorkExperienceYears: nextYear,
    });
    if (delta > 0) {
      deltas.push({
        action: `Gain 1 more year of skilled Canadian work experience (${profile.canadianWorkExperienceYears} → ${nextYear} year${nextYear > 1 ? 's' : ''})`,
        actionFa: `کسب یک سال بیشتر تجربه کاری ماهر در کانادا (${profile.canadianWorkExperienceYears} → ${nextYear} سال)`,
        pointsGained: delta,
        newScore,
      });
    }
  }

  // Lever 3: French bonus (if not already getting it)
  const frenchMin = Math.min(
    profile.frenchSkills.speaking,
    profile.frenchSkills.listening,
    profile.frenchSkills.reading,
    profile.frenchSkills.writing,
  );
  if (frenchMin < 7) {
    const { delta, newScore } = computeScoreDelta(profile, {
      frenchSkills: { speaking: 7, listening: 7, reading: 7, writing: 7 },
    });
    if (delta > 0) {
      deltas.push({
        action: 'Achieve NCLC 7+ in all French abilities (TEF Canada / TCF Canada)',
        actionFa: 'کسب NCLC ۷ یا بالاتر در تمام مهارت‌های فرانسوی',
        pointsGained: delta,
        newScore,
      });
    }
  }

  // Lever 4: Add second official language (CLB 5 minimum)
  if (!profile.secondLanguage) {
    const secondLang = profile.firstLanguage.language === 'english' ? 'french' : 'english';
    const { delta, newScore } = computeScoreDelta(profile, {
      secondLanguage: {
        language: secondLang,
        scores: { speaking: 5, listening: 5, reading: 5, writing: 5 },
      },
    });
    if (delta > 0) {
      deltas.push({
        action: `Add a second official language test result (${secondLang === 'english' ? 'IELTS/CELPIP CLB 5' : 'TEF/TCF NCLC 5'})`,
        actionFa: `افزودن نتیجه آزمون زبان رسمی دوم (${secondLang === 'english' ? 'انگلیسی CLB ۵' : 'فرانسوی NCLC ۵'})`,
        pointsGained: delta,
        newScore,
      });
    }
  }

  return deltas.sort((a, b) => b.pointsGained - a.pointsGained);
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

/**
 * Produces ranked pathway recommendations based on CRS score and category matches.
 *
 * Ranking logic (encodes advisor rules from config thresholds):
 * 1. If CRS ≥ general draw cut-off → "Competitive for general draws" (rank 1)
 * 2. If category match(es) exist → category draw path (rank 1 or 2)
 * 3. If strong French or near NCLC 7 → French pathway surfaced
 * 4. If below general and no category → PNP as primary recommendation
 * 5. Always include concrete score improvement levers
 *
 * @param profile - The full CandidateProfile
 * @param crsResult - The output from calculateCRS
 * @param categoryMatches - The output from matchCategories
 * @returns Ranked array of PathwayRecommendation objects
 */
export function buildPathwayRecommendations(
  profile: CandidateProfile,
  crsResult: CrsResult,
  categoryMatches: CategoryMatch[],
): PathwayRecommendation[] {
  const recommendations: PathwayRecommendation[] = [];
  const score = crsResult.total;
  const eligibleCategories = categoryMatches.filter((c) => c.eligible);
  const scoreDeltas = buildScoreDeltas(profile, score);
  const cta = advisorConfig.ctaConfig;
  let rankCounter = 1;

  // ——— 1. General Draw (if competitive) ——————————————————————————
  if (isCompetitiveForGeneral(score)) {
    recommendations.push({
      rank: rankCounter++,
      type: 'general_draw',
      titleEn: 'Competitive for General Express Entry Draws',
      titleFa: 'رقابتی برای دوره‌های انتخاب عمومی Express Entry',
      rationale: `Your estimated CRS score of ${score} meets or exceeds the recent general draw cut-off (${cutoffs.generalDraw.recentScore} on ${cutoffs.generalDraw.drawDate}). You are in a strong position to receive an ITA in a general draw. Ensure your profile is complete and up-to-date in your IRCC account.`,
      rationaleFa: `امتیاز CRS تخمینی شما (${score}) به حد نصاب آخرین دوره انتخاب عمومی (${cutoffs.generalDraw.recentScore} در ${cutoffs.generalDraw.drawDate}) می‌رسد یا از آن فراتر می‌رود. موقعیت خوبی برای دریافت ITA در دوره‌های عمومی دارید. مطمئن شوید پروفایل شما در سیستم IRCC کامل و به‌روز است.`,
      actionLink: cta.link,
      actionLabelEn: cta.labelEn,
      actionLabelFa: cta.labelFa,
    });
  }

  // ——— 2. Category Draws (for each eligible category) ————————————
  for (const cat of eligibleCategories) {
    const catCompetitive = cat.recentCutoff !== null && score >= cat.recentCutoff;
    recommendations.push({
      rank: rankCounter++,
      type: 'category_draw',
      titleEn: `Category Draw: ${cat.name}`,
      titleFa: `دوره دسته‌ای: ${cat.nameFa}`,
      rationale: `You appear eligible for the "${cat.name}" category-based draw. ${catCompetitive
        ? `Your score (${score}) meets the recent cut-off (${cat.recentCutoff} on ${cat.cutoffDrawDate ?? 'N/A'}).`
        : cat.recentCutoff !== null
          ? `The recent cut-off for this category was ${cat.recentCutoff} (${cat.cutoffDrawDate ?? 'N/A'}) — you may need to raise your score by approximately ${cat.recentCutoff - score} points.`
          : 'No dedicated cut-off data is available yet for this category — monitor the IRCC rounds of invitations page.'
        } Category draws can have significantly lower cut-offs than general draws.`,
      rationaleFa: `به نظر می‌رسد واجد شرایط دوره دسته‌ای "${cat.nameFa}" هستید. ${catCompetitive
        ? `امتیاز شما (${score}) به حد نصاب اخیر (${cat.recentCutoff} در ${cat.cutoffDrawDate ?? 'نامشخص'}) می‌رسد.`
        : cat.recentCutoff !== null
          ? `حد نصاب اخیر این دسته ${cat.recentCutoff} بود - ممکن است نیاز به افزایش حدود ${cat.recentCutoff - score} امتیاز داشته باشید.`
          : 'داده‌های حد نصاب برای این دسته هنوز موجود نیست — صفحه رسمی IRCC را دنبال کنید.'
        }`,
      actionLink: cta.link,
      actionLabelEn: cta.labelEn,
      actionLabelFa: cta.labelFa,
    });
  }

  // ——— 3. French Pathway ——————————————————————————————————————
  const frenchMin = Math.min(
    profile.frenchSkills.speaking,
    profile.frenchSkills.listening,
    profile.frenchSkills.reading,
    profile.frenchSkills.writing,
  );
  const frenchAlreadyQualified = frenchMin >= 7;

  if (frenchAlreadyQualified && isCompetitiveForFrench(score)) {
    recommendations.push({
      rank: rankCounter++,
      type: 'french_pathway',
      titleEn: 'French-Language Proficiency Draw',
      titleFa: 'دوره انتخاب مهارت زبان فرانسه',
      rationale: `You meet the NCLC 7+ threshold for French and your score (${score}) is competitive for the French-language draw (recent cut-off: ${cutoffs.frenchDraw.recentScore} on ${cutoffs.frenchDraw.drawDate}). The French pathway has the highest ITA volume among category draws in 2026 — this is your most reliable path.`,
      rationaleFa: `شما آستانه NCLC ۷+ برای فرانسوی را دارید و امتیاز شما (${score}) برای دوره انتخاب زبان فرانسه رقابتی است (حد نصاب اخیر: ${cutoffs.frenchDraw.recentScore}). این مسیر بیشترین حجم ITA را در دوره‌های دسته‌ای ۲۰۲۶ داشته است.`,
    });
  } else if (!frenchAlreadyQualified) {
    // Surface French pathway as a strong improvement lever
    const frenchDelta = scoreDeltas.find((d) => d.action.includes('French') || d.action.includes('NCLC'));
    recommendations.push({
      rank: rankCounter++,
      type: 'french_pathway',
      titleEn: 'Develop French — Unlock the Largest Draw Category',
      titleFa: 'یادگیری فرانسه — باز کردن بزرگترین دسته انتخاب',
      rationale: `The French-language proficiency draw has been the highest-volume category draw in 2026 (recent cut-off: ${cutoffs.frenchDraw.recentScore}). Achieving NCLC 7+ in all four French abilities would${frenchDelta ? ` add approximately ${frenchDelta.pointsGained} points to your CRS (to ${frenchDelta?.newScore ?? 'N/A'}) and` : ''} make you eligible for this draw. If you have any French background, investing in TEF/TCF preparation is highly recommended.`,
      rationaleFa: `دوره انتخاب مهارت زبان فرانسه بیشترین حجم دوره‌های دسته‌ای در ۲۰۲۶ را داشته است (حد نصاب اخیر: ${cutoffs.frenchDraw.recentScore}). کسب NCLC ۷+ در تمام مهارت‌های فرانسوی${frenchDelta ? ` حدود ${frenchDelta.pointsGained} امتیاز به CRS شما اضافه می‌کند و` : ''} شما را واجد شرایط این دوره می‌کند.`,
      scoreDeltas: frenchDelta ? [frenchDelta] : [],
    });
  }

  // ——— 4. PNP (if score is low and/or no category match) ————————
  if (score < thresholds.pnpRecommendationThreshold.scoreBelow || eligibleCategories.length === 0) {
    recommendations.push({
      rank: rankCounter++,
      type: 'pnp',
      titleEn: 'Provincial Nominee Program (PNP) — +600 CRS Points',
      titleFa: 'برنامه نامزدی استانی (PNP) — ۶۰۰ امتیاز CRS',
      rationale: `A provincial nomination adds 600 CRS points, making virtually any score competitive in a general draw. With a current score of ${score}, a nomination would bring your effective score to approximately ${score + 600}. Research which provincial streams align with your occupation (NOC ${profile.nocCode || 'not selected'}) and province of preference. Note: most PNP streams have their own criteria independent of CRS.`,
      rationaleFa: `نامزدی استانی ۶۰۰ امتیاز CRS اضافه می‌کند و تقریباً هر امتیازی را در دوره‌های عمومی رقابتی می‌کند. با امتیاز فعلی ${score}، نامزدی امتیاز مؤثر شما را به حدود ${score + 600} می‌رساند. تحقیق کنید کدام جریان‌های استانی با شغل (NOC ${profile.nocCode || 'انتخاب نشده'}) و استان مورد نظر شما مطابقت دارند.`,
      actionLink: cta.link,
      actionLabelEn: 'Discuss PNP Options',
      actionLabelFa: 'بررسی گزینه‌های PNP',
    });
  }

  // ——— 5. Score Improvement Levers ——————————————————————————————
  if (scoreDeltas.length > 0 && !isCompetitiveForGeneral(score)) {
    recommendations.push({
      rank: rankCounter++,
      type: 'improve_language',
      titleEn: 'Improve Your Score — Specific Actions for Your Profile',
      titleFa: 'بهبود امتیاز — اقدامات مشخص برای پروفایل شما',
      rationale: `Based on your current profile, here are the actions that would gain you the most CRS points: ${scoreDeltas.map((d, i) => `${i + 1}. ${d.action} (+${d.pointsGained} pts, new score: ${d.newScore})`).join('; ')}.`,
      rationaleFa: `بر اساس پروفایل فعلی شما، اقداماتی که بیشترین امتیاز CRS را به شما می‌دهند: ${scoreDeltas.map((d, i) => `${i + 1}. ${d.actionFa} (+${d.pointsGained} امتیاز، امتیاز جدید: ${d.newScore})`).join('; ')}.`,
      scoreDeltas,
    });
  }

  return recommendations.sort((a, b) => a.rank - b.rank);
}
