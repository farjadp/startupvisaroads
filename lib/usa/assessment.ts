// ============================================================================
// lib/usa/assessment.ts
// The scoring behind /usa/assessment — a readiness filter, not an eligibility
// verdict. It tells a founder which stage they are at and which passport
// question decides everything, so only serious profiles reach a US attorney.
//
// Three rules carried over from how adjudicators actually read files:
//  - O-1A needs three criteria; a high salary is weak as the third one, so a
//    file that only reaches three through salary is "consult", not "file".
//  - NIW needs an advanced degree (or a bachelor's plus five years of
//    progressive experience) before the Dhanasar prongs matter at all.
//  - Nationality comes first. An Iranian passport with no second citizenship
//    is held at the visa-issuance stage whatever the evidence says.
// ============================================================================

export const O1_CRITERIA = [
  'award',
  'membership',
  'press',
  'judging',
  'contribution',
  'authorship',
  'critical',
  'salary',
] as const;
export type O1Criterion = (typeof O1_CRITERIA)[number];

export const PASSPORTS = ['iran', 'canada', 'treaty', 'other'] as const;
export type Passport = (typeof PASSPORTS)[number];

export type Degree = 'masters' | 'bachelor5' | 'none';

export type AssessmentInput = {
  criteria: O1Criterion[];
  degree: Degree;
  /** Works in a field with a credible claim to US national importance. */
  nationalImportance: boolean;
  /** Has a concrete, documented plan for the work in the US. */
  plan: boolean;
  passports: Passport[];
};

export type O1Stage = 'early' | 'consult' | 'file';
export type NiwStage = 'not-eligible' | 'build' | 'strong';
export type Gate = 'blocked' | 'canadian' | 'treaty' | 'check';

export type AssessmentResult = {
  o1: O1Stage;
  /** Criteria claimed, excluding salary — the ones that carry a file. */
  strongCount: number;
  niw: NiwStage;
  gate: Gate;
};

export function assess(input: AssessmentInput): AssessmentResult {
  const unique = Array.from(new Set(input.criteria));
  const strongCount = unique.filter((c) => c !== 'salary').length;
  const total = unique.length;

  const o1: O1Stage = strongCount >= 3 ? 'file' : total >= 2 ? 'consult' : 'early';

  const niw: NiwStage =
    input.degree === 'none'
      ? 'not-eligible'
      : input.nationalImportance && input.plan
        ? 'strong'
        : 'build';

  const p = new Set(input.passports);
  const onlyIranian = p.has('iran') && !p.has('canada') && !p.has('treaty') && !p.has('other');
  const gate: Gate = onlyIranian
    ? 'blocked'
    : p.has('canada')
      ? 'canadian'
      : p.has('treaty')
        ? 'treaty'
        : 'check';

  return { o1, strongCount, niw, gate };
}
