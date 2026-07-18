// ============================================================================
// Express Entry — Pure CRS Calculation Engine
// Source: /lib/express-entry/crs-engine.ts
//
// Zero UI dependencies. Zero Next.js / React imports.
// Input:  CandidateProfile
// Output: CrsResult
//
// All point values come from /config/crs-points.json — NEVER hardcoded here.
// Accuracy protocol: values that could not be 100% verified are flagged with
// TODO:VERIFY in crs-points.json and will appear in the `flags` array of the result.
// ============================================================================

import type { CandidateProfile, CrsResult, CrsBreakdown, LanguageAbilityScores } from './types';
import { EducationLevel } from './types';
import crsPoints from '../../config/crs-points.json';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** True when the spouse/CL partner is actually coming to Canada and affects point tables. */
function isWithSpouse(p: CandidateProfile): boolean {
  return (p.maritalStatus === 'married' || p.maritalStatus === 'commonLaw') &&
    p.spouseComingToCanada === true;
}

/**
 * Resolves an age to the correct point-table key.
 * IRCC: 17 and under = 0 pts; 45 and over = 0 pts.
 */
function resolveAgeKey(age: number): string {
  if (age <= 17) return '17';
  if (age >= 46) return '46plus';
  return String(age);
}

/**
 * Returns points for a given CLB level from the first-language per-ability table.
 * CLB 1–3 = 0. CLB 10+ = clb10plus value.
 */
function resolveFirstLangCLBPoints(
  clb: number,
  table: typeof crsPoints.coreHumanCapital.firstOfficialLanguage.withoutSpouse
): number {
  if (clb <= 3) return 0;
  if (clb === 4) return table.clb4.perAbility;
  if (clb === 5) return table.clb5.perAbility;
  if (clb === 6) return table.clb6.perAbility;
  if (clb === 7) return table.clb7.perAbility;
  if (clb === 8) return table.clb8.perAbility;
  if (clb === 9) return table.clb9.perAbility;
  // CLB 10 and above
  return table.clb10plus.perAbility;
}

/**
 * Returns points for a given CLB level from the second-language per-ability table.
 * CLB 1–4 = 0. CLB 9+ = clb9plus value.
 */
function resolveSecondLangCLBPoints(
  clb: number,
  table: typeof crsPoints.coreHumanCapital.secondOfficialLanguage.withoutSpouse
): number {
  if (clb <= 4) return table.clb1to4.perAbility;
  if (clb === 5) return table.clb5.perAbility;
  if (clb === 6) return table.clb6.perAbility;
  if (clb === 7) return table.clb7.perAbility;
  if (clb === 8) return table.clb8.perAbility;
  return table.clb9plus.perAbility; // CLB 9+
}

/** Sums four per-ability scores from a LanguageAbilityScores object using a resolver function. */
function sumAbilityPoints(
  scores: LanguageAbilityScores,
  resolver: (clb: number) => number
): number {
  return (
    resolver(scores.speaking) +
    resolver(scores.listening) +
    resolver(scores.reading) +
    resolver(scores.writing)
  );
}

/** Returns the minimum CLB across all four abilities. */
function minAbility(scores: LanguageAbilityScores): number {
  return Math.min(scores.speaking, scores.listening, scores.reading, scores.writing);
}

/** Returns the maximum CLB across all four abilities. */
function maxAbility(scores: LanguageAbilityScores): number {
  return Math.max(scores.speaking, scores.listening, scores.reading, scores.writing);
}

/** Returns true if all four abilities meet or exceed the threshold. */
function allAbilitiesMeet(scores: LanguageAbilityScores, threshold: number): boolean {
  return scores.speaking >= threshold &&
    scores.listening >= threshold &&
    scores.reading >= threshold &&
    scores.writing >= threshold;
}

/** True if education level is "one-year post-secondary or higher" (enum >= 2). */
function isPostSecondary(edu: EducationLevel): boolean {
  return edu >= EducationLevel.OneYearPostSecondary;
}

/** True if education is bachelor's or higher (enum >= 4). */
function isBachelorOrHigher(edu: EducationLevel): boolean {
  return edu >= EducationLevel.BachelorsDegree;
}

// ---------------------------------------------------------------------------
// Section A: Core Human Capital
// ---------------------------------------------------------------------------

function calcAge(p: CandidateProfile, withSpouse: boolean): number {
  const table = withSpouse
    ? crsPoints.coreHumanCapital.age.withSpouse
    : crsPoints.coreHumanCapital.age.withoutSpouse;
  const key = resolveAgeKey(p.age) as keyof typeof table;
  return (table[key] as number) ?? 0;
}

function calcEducation(p: CandidateProfile, withSpouse: boolean): number {
  const table = withSpouse
    ? crsPoints.coreHumanCapital.education.withSpouse
    : crsPoints.coreHumanCapital.education.withoutSpouse;
  const key = String(p.education) as keyof typeof table;
  return (table[key] as number) ?? 0;
}

function calcFirstLanguage(p: CandidateProfile, withSpouse: boolean): number {
  const table = withSpouse
    ? crsPoints.coreHumanCapital.firstOfficialLanguage.withSpouse
    : crsPoints.coreHumanCapital.firstOfficialLanguage.withoutSpouse;
  const resolver = (clb: number) => resolveFirstLangCLBPoints(clb, table);
  return sumAbilityPoints(p.firstLanguage.scores, resolver);
}

function calcSecondLanguage(p: CandidateProfile, withSpouse: boolean): number {
  if (!p.secondLanguage) return 0;
  const table = withSpouse
    ? crsPoints.coreHumanCapital.secondOfficialLanguage.withSpouse
    : crsPoints.coreHumanCapital.secondOfficialLanguage.withoutSpouse;
  const resolver = (clb: number) => resolveSecondLangCLBPoints(clb, table);
  const raw = sumAbilityPoints(p.secondLanguage.scores, resolver);
  return Math.min(raw, crsPoints.coreHumanCapital.secondOfficialLanguage.maxPoints);
}

function calcCanadianWorkExp(p: CandidateProfile, withSpouse: boolean): number {
  const table = withSpouse
    ? crsPoints.coreHumanCapital.canadianWorkExperience.withSpouse
    : crsPoints.coreHumanCapital.canadianWorkExperience.withoutSpouse;
  const years = p.canadianWorkExperienceYears;
  const key = years >= 5 ? '5plus' : String(years);
  return (table[key as keyof typeof table] as number) ?? 0;
}

// ---------------------------------------------------------------------------
// Section B: Spouse / Common-Law Partner Factors
// ---------------------------------------------------------------------------

function calcSpouseFactors(p: CandidateProfile): { education: number; language: number; canadianWorkExperience: number } {
  const zero = { education: 0, language: 0, canadianWorkExperience: 0 };
  if (!isWithSpouse(p)) return zero;

  // Spouse education
  const eduKey = String(p.spouseEducation ?? 0) as keyof typeof crsPoints.spouseFactors.education.points;
  const educationPts = Math.min(
    (crsPoints.spouseFactors.education.points[eduKey] as number) ?? 0,
    crsPoints.spouseFactors.education.maxPoints
  );

  // Spouse first language
  let languagePts = 0;
  if (p.spouseFirstLanguage) {
    const langTable = crsPoints.spouseFactors.firstOfficialLanguage.points;
    const resolver = (clb: number): number => {
      if (clb <= 4) return langTable.clb1to4.perAbility;
      if (clb === 5) return langTable.clb5.perAbility;
      if (clb === 6) return langTable.clb6.perAbility;
      if (clb === 7) return langTable.clb7.perAbility;
      if (clb === 8) return langTable.clb8.perAbility;
      return langTable.clb9plus.perAbility;
    };
    languagePts = Math.min(
      sumAbilityPoints(p.spouseFirstLanguage, resolver),
      crsPoints.spouseFactors.firstOfficialLanguage.maxPoints
    );
  }

  // Spouse Canadian work experience
  const spouseYears = p.spouseCanadianWorkExperienceYears ?? 0;
  const spouseExpKey = spouseYears >= 5 ? '5plus' : String(spouseYears);
  const spouseExpPts = Math.min(
    (crsPoints.spouseFactors.canadianWorkExperience.points[spouseExpKey as keyof typeof crsPoints.spouseFactors.canadianWorkExperience.points] as number) ?? 0,
    crsPoints.spouseFactors.canadianWorkExperience.maxPoints
  );

  return {
    education: educationPts,
    language: languagePts,
    canadianWorkExperience: spouseExpPts,
  };
}

// ---------------------------------------------------------------------------
// Section C: Skill Transferability (max 100 total)
// ---------------------------------------------------------------------------

/**
 * Calculates all five skill transferability factors and caps at 100.
 *
 * The five combinations:
 * 1. Education × First official language (CLB)
 * 2. Education × Canadian work experience
 * 3. Foreign work experience × First official language (CLB)
 * 4. Foreign work experience × Canadian work experience
 * 5. Certificate of qualification (trades) × First official language (CLB)
 */
function calcSkillTransferability(p: CandidateProfile): {
  educationLanguage: number;
  educationCanadianExperience: number;
  foreignExperienceLanguage: number;
  foreignExperienceCanadianExperience: number;
  certificateLanguage: number;
  subtotal: number;
} {
  const st = crsPoints.skillTransferability;
  const firstLangMin = minAbility(p.firstLanguage.scores);
  const foreignExp = p.foreignWorkExperienceYears;
  const canadianExp = p.canadianWorkExperienceYears;

  // ——— 1. Education × First Official Language ———————————————————
  let educationLanguage = 0;
  if (isPostSecondary(p.education)) {
    if (isBachelorOrHigher(p.education)) {
      // Bachelor or higher
      if (firstLangMin >= 9) educationLanguage = st.educationLanguage.bachelorOrHigherAndCLB9plus;
      else if (firstLangMin >= 7) educationLanguage = st.educationLanguage.bachelorOrHigherAndCLB7to8;
    } else {
      // One- or two-year post-secondary
      if (firstLangMin >= 9) educationLanguage = st.educationLanguage.postSecondaryAndCLB9plus;
      else if (firstLangMin >= 7) educationLanguage = st.educationLanguage.postSecondaryAndCLB7to8;
    }
  }

  // ——— 2. Education × Canadian Work Experience ——————————————————
  let educationCanadianExperience = 0;
  if (isPostSecondary(p.education) && canadianExp >= 1) {
    if (isBachelorOrHigher(p.education)) {
      if (canadianExp >= 2) educationCanadianExperience = st.educationCanadianExperience.bachelorOrHigherAnd2YearPlus;
      else educationCanadianExperience = st.educationCanadianExperience.bachelorOrHigherAnd1Year;
    } else {
      if (canadianExp >= 2) educationCanadianExperience = st.educationCanadianExperience.postSecondaryAnd2YearPlus;
      else educationCanadianExperience = st.educationCanadianExperience.postSecondaryAnd1Year;
    }
  }

  // ——— 3. Foreign Work Experience × First Official Language ———————
  let foreignExperienceLanguage = 0;
  if (foreignExp >= 1 && firstLangMin >= 7) {
    if (foreignExp >= 3) {
      if (firstLangMin >= 9) foreignExperienceLanguage = st.foreignExpLanguage.foreignExp3plusYearsAndCLB9plus;
      else foreignExperienceLanguage = st.foreignExpLanguage.foreignExp3plusYearsAndCLB7to8;
    } else {
      // 1–2 years
      if (firstLangMin >= 9) foreignExperienceLanguage = st.foreignExpLanguage.foreignExp1to2YearsAndCLB9plus;
      else foreignExperienceLanguage = st.foreignExpLanguage.foreignExp1to2YearsAndCLB7to8;
    }
  }

  // ——— 4. Foreign Work Experience × Canadian Work Experience ——————
  let foreignExperienceCanadianExperience = 0;
  if (foreignExp >= 1 && canadianExp >= 1) {
    if (foreignExp >= 3) {
      if (canadianExp >= 2) foreignExperienceCanadianExperience = st.foreignExpCanadianExp.foreignExp3plusYearsAndCanadian2YearPlus;
      else foreignExperienceCanadianExperience = st.foreignExpCanadianExp.foreignExp3plusYearsAndCanadian1Year;
    } else {
      if (canadianExp >= 2) foreignExperienceCanadianExperience = st.foreignExpCanadianExp.foreignExp1to2YearsAndCanadian2YearPlus;
      else foreignExperienceCanadianExperience = st.foreignExpCanadianExp.foreignExp1to2YearsAndCanadian1Year;
    }
  }

  // ——— 5. Certificate of Qualification × First Official Language ——
  let certificateLanguage = 0;
  if (p.certificateOfQualification && firstLangMin >= 5) {
    if (firstLangMin >= 7) certificateLanguage = st.certificateLanguage.certAndCLB7plus;
    else certificateLanguage = st.certificateLanguage.certAndCLB5to6;
  }

  // ——— Apply the 100-point cap —————————————————————————————————
  const raw = educationLanguage + educationCanadianExperience + foreignExperienceLanguage +
    foreignExperienceCanadianExperience + certificateLanguage;
  const subtotal = Math.min(raw, st.maxTotal);

  return {
    educationLanguage,
    educationCanadianExperience,
    foreignExperienceLanguage,
    foreignExperienceCanadianExperience,
    certificateLanguage,
    subtotal,
  };
}

// ---------------------------------------------------------------------------
// Section D: Additional Points
// ---------------------------------------------------------------------------

function calcAdditionalPoints(p: CandidateProfile): {
  provincialNomination: number;
  frenchLanguage: number;
  canadianEducation: number;
  sibling: number;
  jobOffer: 0;
} {
  const add = crsPoints.additionalPoints;

  // Provincial Nomination
  const provincialNomination = p.provincialNomination ? add.provincialNomination.points : 0;

  // Job Offer — always 0 per IRCC policy change March 25, 2025
  const jobOffer = 0 as const;

  // French Language Bonus
  let frenchLanguage = 0;
  const frenchConfig = add.frenchLanguage;
  if (allAbilitiesMeet(p.frenchSkills, frenchConfig.minimumNCLC)) {
    // Determine tier based on English ability
    const hasEnglishCLB5PlusAllAbilities =
      p.firstLanguage.language === 'english' && allAbilitiesMeet(p.firstLanguage.scores, frenchConfig.englishThresholdForTier2) ||
      p.secondLanguage?.language === 'english' && allAbilitiesMeet(p.secondLanguage.scores, frenchConfig.englishThresholdForTier2);

    frenchLanguage = hasEnglishCLB5PlusAllAbilities
      ? frenchConfig.tier2_englishCLB5plusAllAbilities
      : frenchConfig.tier1_noEnglishOrEnglishCLB4orBelow;
  }

  // Canadian Education
  let canadianEducation = 0;
  if (p.canadianEducation === 'oneTwo') canadianEducation = add.canadianEducation.oneTwoYear;
  else if (p.canadianEducation === 'threeOrMore') canadianEducation = add.canadianEducation.threeOrMoreYear;

  // Sibling in Canada
  const sibling = p.siblingInCanada ? add.siblingInCanada.points : 0;

  return { provincialNomination, frenchLanguage, canadianEducation, sibling, jobOffer };
}

// ---------------------------------------------------------------------------
// Main entry point — calculateCRS
// ---------------------------------------------------------------------------

/**
 * Calculates the CRS score for a given candidate profile.
 *
 * This is a pure function — same input always produces the same output.
 * No side effects, no network calls, no file I/O at call time.
 *
 * @param profile - The complete CandidateProfile
 * @returns CrsResult with total score, full breakdown, and any runtime flags
 */
export function calculateCRS(profile: CandidateProfile): CrsResult {
  const flags: string[] = [];
  const withSpouse = isWithSpouse(profile);

  // ——— Section A ————————————————————————————————————————————————
  const age = calcAge(profile, withSpouse);
  const education = calcEducation(profile, withSpouse);
  const firstLanguage = calcFirstLanguage(profile, withSpouse);
  const secondLanguage = calcSecondLanguage(profile, withSpouse);
  const canadianWorkExperience = calcCanadianWorkExp(profile, withSpouse);

  const coreSubtotal = age + education + firstLanguage + secondLanguage + canadianWorkExperience;

  // ——— Section B ————————————————————————————————————————————————
  const spouseCalc = calcSpouseFactors(profile);
  const spouseSubtotal = spouseCalc.education + spouseCalc.language + spouseCalc.canadianWorkExperience;

  // ——— Section C ————————————————————————————————————————————————
  const transferability = calcSkillTransferability(profile);

  // ——— Section D ————————————————————————————————————————————————
  const additional = calcAdditionalPoints(profile);
  const additionalSubtotal = additional.provincialNomination + additional.frenchLanguage +
    additional.canadianEducation + additional.sibling + additional.jobOffer;

  // ——— Total ————————————————————————————————————————————————————
  const total = coreSubtotal + spouseSubtotal + transferability.subtotal + additionalSubtotal;

  // ——— Add TODO:VERIFY flag if relevant config entries were used ——
  // These correspond to values flagged in crs-points.json.
  if (profile.secondLanguage) {
    flags.push('TODO:VERIFY — second language per-ability points from config should be manually verified against canada.ca CRS grid');
  }
  if (profile.foreignWorkExperienceYears > 0 || profile.canadianWorkExperienceYears > 0 || profile.education > 0) {
    flags.push('TODO:VERIFY — all skill transferability point values should be verified against canada.ca CRS grid');
  }
  if (profile.frenchSkills && (profile.frenchSkills.speaking > 0 || profile.frenchSkills.listening > 0)) {
    flags.push('TODO:VERIFY — French bonus tiers (25/50 pts) should be verified against canada.ca CRS grid');
  }

  const breakdown: CrsBreakdown = {
    coreHumanCapital: {
      age,
      education,
      firstLanguage,
      secondLanguage,
      canadianWorkExperience,
      subtotal: coreSubtotal,
    },
    spouseFactors: {
      education: spouseCalc.education,
      language: spouseCalc.language,
      canadianWorkExperience: spouseCalc.canadianWorkExperience,
      subtotal: spouseSubtotal,
    },
    skillTransferability: {
      educationLanguage: transferability.educationLanguage,
      educationCanadianExperience: transferability.educationCanadianExperience,
      foreignExperienceLanguage: transferability.foreignExperienceLanguage,
      foreignExperienceCanadianExperience: transferability.foreignExperienceCanadianExperience,
      certificateLanguage: transferability.certificateLanguage,
      subtotal: transferability.subtotal,
    },
    additionalPoints: {
      provincialNomination: additional.provincialNomination,
      frenchLanguage: additional.frenchLanguage,
      canadianEducation: additional.canadianEducation,
      sibling: additional.sibling,
      jobOffer: 0,
      subtotal: additionalSubtotal,
    },
  };

  return { total, breakdown, flags };
}

/**
 * Computes the CRS score delta if a specific modification is applied to the profile.
 * Used by the pathway advisor to show concrete score improvements.
 *
 * @param baseProfile - Original profile
 * @param modification - Partial profile override
 * @returns Object with base score, modified score, and delta
 */
export function computeScoreDelta(
  baseProfile: CandidateProfile,
  modification: Partial<CandidateProfile>
): { baseScore: number; newScore: number; delta: number } {
  const baseResult = calculateCRS(baseProfile);
  const modifiedProfile: CandidateProfile = { ...baseProfile, ...modification };
  const modifiedResult = calculateCRS(modifiedProfile);
  return {
    baseScore: baseResult.total,
    newScore: modifiedResult.total,
    delta: modifiedResult.total - baseResult.total,
  };
}
