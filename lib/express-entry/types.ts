// ============================================================================
// Express Entry — Shared Type Definitions
// Source: /lib/express-entry/types.ts
// These types are the contract between the UI, engine, advisor, and tests.
// Zero framework dependencies — pure TypeScript.
// ============================================================================

// ---------------------------------------------------------------------------
// Education Level Enum
// ---------------------------------------------------------------------------

/** IRCC CRS education tiers. Values 0–7 correspond exactly to the CRS grid rows. */
export enum EducationLevel {
  /** Less than secondary school (no diploma) */
  LessThanSecondary = 0,
  /** Secondary diploma / high school graduation */
  SecondaryDiploma = 1,
  /** One-year post-secondary program certificate or diploma */
  OneYearPostSecondary = 2,
  /** Two-year post-secondary program certificate or diploma */
  TwoYearPostSecondary = 3,
  /** Bachelor's degree OR three or more year post-secondary program */
  BachelorsDegree = 4,
  /** Two or more certificates/diplomas/degrees — one must be 3+ years */
  TwoPlusDegrees = 5,
  /** Master's degree OR professional degree (e.g., MD, JD, LLB) */
  MastersDegree = 6,
  /** Doctoral degree (PhD) */
  DoctoralDegree = 7,
}

// ---------------------------------------------------------------------------
// Language Ability Score — per ability (S/L/R/W) as CLB/NCLC level
// ---------------------------------------------------------------------------

/** A CLB or NCLC score for a single language ability. Range: 1–12. */
export type CLBScore = number;

/** Four per-ability scores (speaking, listening, reading, writing). */
export interface LanguageAbilityScores {
  speaking: CLBScore;
  listening: CLBScore;
  reading: CLBScore;
  writing: CLBScore;
}

/** A language profile including which language and per-ability CLB scores. */
export interface OfficialLanguageProfile {
  /** Which official language this test result is for. */
  language: 'english' | 'french';
  /** Test used — kept for UI display and tooltip binding only; does NOT affect scoring. */
  testType?: 'IELTS_General' | 'CELPIP_General' | 'TEF_Canada' | 'TCF_Canada';
  scores: LanguageAbilityScores;
}

// ---------------------------------------------------------------------------
// CandidateProfile — the full input to the CRS engine
// ---------------------------------------------------------------------------

/** Canadian education level for the additional-points section. */
export type CanadianEducationLevel = 'none' | 'oneTwo' | 'threeOrMore';

/** Complete candidate profile. All fields are required unless explicitly optional. */
export interface CandidateProfile {
  // ——— Personal ————————————————————————————————————————————————————
  /** 'single' includes divorced, widowed, or separated. 'married' / 'commonLaw' triggers spouse factors. */
  maritalStatus: 'single' | 'married' | 'commonLaw';
  /** Whether the spouse/CL partner will accompany the candidate to Canada.
   *  If false, the "withoutSpouse" point tables are used. */
  spouseComingToCanada: boolean;
  /** Candidate's age in years. Must be >= 17. 45+ maps to the "46plus" bracket (0 points). */
  age: number;
  /** Selected NOC 2021 code. Used for category matching, not CRS score calculation. */
  nocCode: string;

  // ——— Education ————————————————————————————————————————————————————
  education: EducationLevel;

  // ——— Language ————————————————————————————————————————————————————
  /** First official language (English or French). Always required. */
  firstLanguage: OfficialLanguageProfile;
  /** Second official language (English or French). Optional — leave undefined if no test taken. */
  secondLanguage?: OfficialLanguageProfile;

  // ——— Work Experience ————————————————————————————————————————————
  /** Years of skilled Canadian work experience. 5 = "5 or more". */
  canadianWorkExperienceYears: 0 | 1 | 2 | 3 | 4 | 5;
  /** Years of skilled foreign work experience outside Canada. 3 = "3 or more". */
  foreignWorkExperienceYears: 0 | 1 | 2 | 3;

  // ——— Spouse Factors (only scored when spouseComingToCanada === true) ——
  spouseEducation?: EducationLevel;
  /** Spouse's first official language per-ability CLB scores. */
  spouseFirstLanguage?: LanguageAbilityScores;
  /** Spouse's years of Canadian skilled work experience. */
  spouseCanadianWorkExperienceYears?: 0 | 1 | 2 | 3 | 4 | 5;

  // ——— Skill Transferability Inputs ——————————————————————————————
  /** Has a certificate of qualification issued by a Canadian province/territory (trades). */
  certificateOfQualification: boolean;

  // ——— Additional Points ————————————————————————————————————————
  /** Has received a provincial nomination. Adds 600 points. */
  provincialNomination: boolean;
  /**
   * Has a Canadian job offer (arranged employment).
   * IMPORTANT: This field is kept for UI display with an inline note.
   * Per IRCC policy effective March 25, 2025, this awards ZERO points.
   * DO NOT change the engine to award points for this field.
   */
  jobOffer: boolean;
  /** Post-secondary education completed in Canada. */
  canadianEducation: CanadianEducationLevel;
  /** Has a sibling (brother or sister) who is a Canadian citizen or permanent resident. */
  siblingInCanada: boolean;
  /** French ability scores (NCLC). Required for French bonus calculation. Zero out abilities if no French. */
  frenchSkills: LanguageAbilityScores;
}

// ---------------------------------------------------------------------------
// CrsResult — the full output from the CRS engine
// ---------------------------------------------------------------------------

/** Detailed per-factor CRS breakdown. Matches the 4 IRCC sections (A, B, C, D). */
export interface CrsBreakdown {
  coreHumanCapital: {
    age: number;
    education: number;
    firstLanguage: number;
    secondLanguage: number;
    canadianWorkExperience: number;
    subtotal: number;
  };
  spouseFactors: {
    education: number;
    language: number;
    canadianWorkExperience: number;
    subtotal: number;
  };
  skillTransferability: {
    educationLanguage: number;
    educationCanadianExperience: number;
    foreignExperienceLanguage: number;
    foreignExperienceCanadianExperience: number;
    certificateLanguage: number;
    /** Always capped at 100 per IRCC rules. */
    subtotal: number;
  };
  additionalPoints: {
    provincialNomination: number;
    frenchLanguage: number;
    canadianEducation: number;
    sibling: number;
    /** Always 0 — job offer no longer awards CRS points (effective March 25, 2025). */
    jobOffer: 0;
    subtotal: number;
  };
}

/** The full output object from the CRS engine. */
export interface CrsResult {
  /** The total estimated CRS score. */
  total: number;
  /** Detailed per-section and per-factor breakdown. */
  breakdown: CrsBreakdown;
  /**
   * Array of warning or informational flags.
   * Used for TODO:VERIFY notices or edge cases encountered during calculation.
   * Empty array = no flags.
   */
  flags: string[];
}

// ---------------------------------------------------------------------------
// Category Match — output from the category matcher
// ---------------------------------------------------------------------------

export interface CategoryMatch {
  id: string;
  name: string;
  nameFa: string;
  description: string;
  descriptionFa: string;
  /** The known recent draw cut-off score for this category. null = no draw held yet. */
  recentCutoff: number | null;
  cutoffDrawDate: string | null;
  /** Whether this candidate meets the minimum thresholds to be category-eligible. */
  eligible: boolean;
  /** Human-readable reason explaining the eligibility determination. */
  eligibilityReason: string;
  eligibilityReasonFa: string;
}

// ---------------------------------------------------------------------------
// Pathway Recommendation — output from the pathway advisor
// ---------------------------------------------------------------------------

export type PathwayType =
  | 'general_draw'
  | 'category_draw'
  | 'pnp'
  | 'french_pathway'
  | 'improve_language'
  | 'gain_experience'
  | 'improve_education';

export interface ScoreDelta {
  /** The lever that produces this delta (e.g., "Raise IELTS from CLB 8 to CLB 9"). */
  action: string;
  actionFa: string;
  /** Computed score gain from applying this lever. */
  pointsGained: number;
  /** Resulting score after applying the lever. */
  newScore: number;
}

export interface PathwayRecommendation {
  /** Priority rank (1 = highest priority). */
  rank: number;
  type: PathwayType;
  titleEn: string;
  titleFa: string;
  rationale: string;
  rationaleFa: string;
  /** Optional concrete score improvement deltas computed using the engine. */
  scoreDeltas?: ScoreDelta[];
  /** Optional CTA or link. */
  actionLink?: string;
  actionLabelEn?: string;
  actionLabelFa?: string;
}

// ---------------------------------------------------------------------------
// Full Diagnostic Result — wraps everything
// ---------------------------------------------------------------------------

export interface DiagnosticResult {
  profile: CandidateProfile;
  crsResult: CrsResult;
  categoryMatches: CategoryMatch[];
  pathwayRecommendations: PathwayRecommendation[];
  /** Config metadata shown in the results footer. */
  rulesVersion: string;
  lastVerified: string;
}
