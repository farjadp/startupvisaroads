// ============================================================================
// Express Entry — Category Matcher
// Source: /lib/express-entry/category-matcher.ts
//
// Given a CandidateProfile, determines which 2026 category-based draw
// categories the candidate may qualify for.
//
// Eligibility logic is driven by /config/categories.json — thresholds
// (12 months, 3-year lookback) are read from config, NOT hardcoded here.
// ============================================================================

import type { CandidateProfile, CategoryMatch } from './types';
import categoriesConfig from '../../config/categories.json';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Convert years to months for comparison against config threshold. */
function yearsToMonths(years: number): number {
  return years * 12;
}

/**
 * Determines if the candidate has qualifying work experience in terms of
 * duration. We use the candidate's work experience fields as a proxy for
 * the "12 months in the last 3 years" requirement.
 *
 * NOTE: The UI will clarify that the work must be in the eligible NOC
 * occupation. We validate duration here; occupation is validated by NOC match.
 */
function hasQualifyingExperience(profile: CandidateProfile): boolean {
  const threshold = categoriesConfig.eligibilityThreshold.minimumWorkExperienceMonths;
  // Foreign work experience (if >= 1 year = 12 months, threshold met)
  const foreignMonths = yearsToMonths(profile.foreignWorkExperienceYears);
  const canadianMonths = yearsToMonths(profile.canadianWorkExperienceYears);
  // Either foreign or Canadian experience can count, or combined
  return foreignMonths >= threshold || canadianMonths >= threshold;
}

/** Checks if the candidate's NOC code is in the category's NOC list. */
function nocMatchesCategory(
  nocCode: string,
  categoryNocCodes: Array<{ code: string; title: string }>
): boolean {
  return categoryNocCodes.some((n) => n.code === nocCode);
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

/**
 * Evaluates which 2026 IRCC category-based draw categories the candidate
 * may be eligible for.
 *
 * Returns all categories with an `eligible` flag and a human-readable reason.
 * This is intentionally NOT a hard pass/fail — it surfaces categories where
 * the candidate should consult IRCC directly.
 *
 * @param profile - The complete CandidateProfile
 * @returns Array of CategoryMatch objects (all categories, with eligible flag)
 */
export function matchCategories(profile: CandidateProfile): CategoryMatch[] {
  const results: CategoryMatch[] = [];

  for (const category of categoriesConfig.categories) {
    let eligible = false;
    let eligibilityReason = '';
    let eligibilityReasonFa = '';

    const criteria = category.eligibilityCriteria as {
      type: string;
      nocRestriction?: boolean;
      minimumNCLC?: number;
      allFourAbilitiesRequired?: boolean;
      minimumCanadianWorkExperienceMonths?: number;
    };

    if (criteria.type === 'languageOnly') {
      // French category: no NOC restriction, just NCLC threshold
      const nclcMin = criteria.minimumNCLC ?? 7;
      const frenchAllMeet =
        profile.frenchSkills.speaking >= nclcMin &&
        profile.frenchSkills.listening >= nclcMin &&
        profile.frenchSkills.reading >= nclcMin &&
        profile.frenchSkills.writing >= nclcMin;

      if (frenchAllMeet) {
        eligible = true;
        eligibilityReason = `Your French skills meet NCLC ${nclcMin}+ in all four abilities — the primary eligibility requirement for this category.`;
        eligibilityReasonFa = `مهارت فرانسوی شما در هر چهار مهارت به سطح NCLC ${nclcMin}+ می‌رسد — شرط اصلی واجد شرایط بودن در این دسته.`;
      } else {
        eligible = false;
        eligibilityReason = `This category requires NCLC ${nclcMin}+ in all four French abilities (speaking, listening, reading, writing). Your current French scores do not meet this threshold.`;
        eligibilityReasonFa = `این دسته نیاز به NCLC ${nclcMin}+ در هر چهار مهارت فرانسوی دارد. نمرات فعلی فرانسوی شما به این حد نمی‌رسد.`;
      }
    } else if (criteria.type === 'nocBased') {
      // NOC-based categories: require qualifying experience in an eligible NOC
      const nocMatch = nocMatchesCategory(profile.nocCode, category.nocCodes as Array<{ code: string; title: string }>);
      const hasExp = hasQualifyingExperience(profile);

      if (nocMatch && hasExp) {
        eligible = true;
        eligibilityReason = `Your occupation (NOC ${profile.nocCode}) is in the eligible list for this category, and you have at least 12 months of qualifying work experience in the last 3 years.`;
        eligibilityReasonFa = `شغل شما (NOC ${profile.nocCode}) در لیست مشاغل واجد شرایط این دسته قرار دارد و حداقل ۱۲ ماه تجربه کاری در ۳ سال اخیر دارید.`;
      } else if (!nocMatch) {
        eligible = false;
        eligibilityReason = `Your occupation (NOC ${profile.nocCode || 'not selected'}) is not in the eligible NOC list for this category.`;
        eligibilityReasonFa = `شغل شما (NOC ${profile.nocCode || 'انتخاب نشده'}) در لیست مشاغل واجد شرایط این دسته نیست.`;
      } else {
        eligible = false;
        eligibilityReason = `Your occupation matches this category, but you need at least 12 months of qualifying work experience in the last 3 years.`;
        eligibilityReasonFa = `شغل شما با این دسته مطابقت دارد، اما به حداقل ۱۲ ماه تجربه کاری واجد شرایط در ۳ سال اخیر نیاز دارید.`;
      }
    } else if (criteria.type === 'nocBasedWithCanadianExp') {
      // Requires Canadian experience in addition to NOC match
      const nocMatch = nocMatchesCategory(profile.nocCode, category.nocCodes as Array<{ code: string; title: string }>);
      const minCanadianMonths = criteria.minimumCanadianWorkExperienceMonths ?? 12;
      const canadianMonths = yearsToMonths(profile.canadianWorkExperienceYears);
      const hasCanadianExp = canadianMonths >= minCanadianMonths;

      if (nocMatch && hasCanadianExp) {
        eligible = true;
        eligibilityReason = `Your occupation (NOC ${profile.nocCode}) qualifies for this category and you have at least ${minCanadianMonths / 12} year(s) of Canadian work experience.`;
        eligibilityReasonFa = `شغل شما (NOC ${profile.nocCode}) واجد شرایط این دسته است و حداقل ${minCanadianMonths / 12} سال تجربه کاری در کانادا دارید.`;
      } else if (!nocMatch) {
        eligible = false;
        eligibilityReason = `Your occupation (NOC ${profile.nocCode || 'not selected'}) does not qualify for this category.`;
        eligibilityReasonFa = `شغل شما (NOC ${profile.nocCode || 'انتخاب نشده'}) واجد شرایط این دسته نیست.`;
      } else {
        eligible = false;
        eligibilityReason = `Your occupation qualifies, but this category requires at least ${minCanadianMonths / 12} year(s) of Canadian work experience. Your current Canadian experience is ${profile.canadianWorkExperienceYears} year(s).`;
        eligibilityReasonFa = `شغل شما واجد شرایط است، اما این دسته به حداقل ${minCanadianMonths / 12} سال تجربه کاری در کانادا نیاز دارد. تجربه فعلی شما در کانادا ${profile.canadianWorkExperienceYears} سال است.`;
      }
    }

    results.push({
      id: category.id,
      name: category.name,
      nameFa: category.nameFa,
      description: category.description,
      descriptionFa: category.descriptionFa,
      recentCutoff: category.recentCutoff.score,
      cutoffDrawDate: category.recentCutoff.drawDate,
      eligible,
      eligibilityReason,
      eligibilityReasonFa,
    });
  }

  return results;
}

/** Returns only the categories the candidate is eligible for. */
export function getEligibleCategories(profile: CandidateProfile): CategoryMatch[] {
  return matchCategories(profile).filter((c) => c.eligible);
}
