// ============================================================================
// CRS Engine Unit Tests
// Source: /lib/express-entry/__tests__/crs-engine.test.ts
//
// Covers:
//  - Single vs. married (with spouse) profile point tables
//  - All age bracket boundaries
//  - CLB boundary transitions (6→7, 7→8, 9→10)
//  - Transferability cap at 100
//  - French bonus both tiers (25 pts / 50 pts)
//  - PNP +600
//  - Job offer → always 0 pts (post March 2025)
//  - 5 full fixture candidates with documented expected scores
//  - Config validation (rulesVersion, lastVerified, source required)
// ============================================================================

import { describe, it, expect } from 'vitest';
import { calculateCRS, computeScoreDelta } from '../crs-engine';
import type { CandidateProfile } from '../types';
import { EducationLevel } from '../types';

// Config files for validation tests
import crsPoints from '../../../config/crs-points.json';
import categories from '../../../config/categories.json';
import languageConversion from '../../../config/language-conversion.json';
import nocCodes from '../../../config/noc-codes.json';
import pathwayAdvisor from '../../../config/pathway-advisor.json';

// ---------------------------------------------------------------------------
// Helper: build a minimal valid profile (easy to override per test)
// ---------------------------------------------------------------------------
function baseProfile(overrides: Partial<CandidateProfile> = {}): CandidateProfile {
  return {
    maritalStatus: 'single',
    spouseComingToCanada: false,
    age: 30,
    nocCode: '21231',
    education: EducationLevel.BachelorsDegree,
    firstLanguage: {
      language: 'english',
      scores: { speaking: 9, listening: 9, reading: 9, writing: 9 },
    },
    secondLanguage: undefined,
    canadianWorkExperienceYears: 1,
    foreignWorkExperienceYears: 0,
    certificateOfQualification: false,
    provincialNomination: false,
    jobOffer: false,
    canadianEducation: 'none',
    siblingInCanada: false,
    frenchSkills: { speaking: 0, listening: 0, reading: 0, writing: 0 },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// 1. Config Validation Tests
// ---------------------------------------------------------------------------
describe('Config Validation', () => {
  it('crs-points.json has rulesVersion, lastVerified, and source', () => {
    expect(crsPoints).toHaveProperty('rulesVersion');
    expect(crsPoints).toHaveProperty('lastVerified');
    expect(crsPoints).toHaveProperty('source');
    expect(typeof crsPoints.rulesVersion).toBe('string');
    expect(typeof crsPoints.lastVerified).toBe('string');
    expect(typeof crsPoints.source).toBe('string');
    expect(crsPoints.rulesVersion.length).toBeGreaterThan(0);
    expect(crsPoints.lastVerified.length).toBeGreaterThan(0);
    expect(crsPoints.source.length).toBeGreaterThan(0);
  });

  it('categories.json has rulesVersion, lastVerified, and source', () => {
    expect(categories).toHaveProperty('rulesVersion');
    expect(categories).toHaveProperty('lastVerified');
    expect(categories).toHaveProperty('source');
    expect(typeof categories.rulesVersion).toBe('string');
    expect(typeof categories.lastVerified).toBe('string');
    expect(typeof categories.source).toBe('string');
  });

  it('language-conversion.json has rulesVersion, lastVerified, and source', () => {
    expect(languageConversion).toHaveProperty('rulesVersion');
    expect(languageConversion).toHaveProperty('lastVerified');
    expect(languageConversion).toHaveProperty('source');
  });

  it('noc-codes.json has rulesVersion, lastVerified, and source', () => {
    expect(nocCodes).toHaveProperty('rulesVersion');
    expect(nocCodes).toHaveProperty('lastVerified');
    expect(nocCodes).toHaveProperty('source');
  });

  it('pathway-advisor.json has rulesVersion, lastVerified, and source', () => {
    expect(pathwayAdvisor).toHaveProperty('rulesVersion');
    expect(pathwayAdvisor).toHaveProperty('lastVerified');
    expect(pathwayAdvisor).toHaveProperty('source');
  });
});

// ---------------------------------------------------------------------------
// 2. Age Bracket Tests
// ---------------------------------------------------------------------------
describe('Age Brackets (without spouse)', () => {
  it('age 17 (or under) → 0 points', () => {
    const result = calculateCRS(baseProfile({ age: 17 }));
    expect(result.breakdown.coreHumanCapital.age).toBe(0);
  });

  it('age 18 → 99 points', () => {
    const result = calculateCRS(baseProfile({ age: 18 }));
    expect(result.breakdown.coreHumanCapital.age).toBe(99);
  });

  it('age 26–29 → 130 points (peak)', () => {
    for (const age of [26, 27, 28, 29]) {
      const result = calculateCRS(baseProfile({ age }));
      expect(result.breakdown.coreHumanCapital.age).toBe(130);
    }
  });

  it('age 35 → 114 points (start of decline)', () => {
    const result = calculateCRS(baseProfile({ age: 35 }));
    expect(result.breakdown.coreHumanCapital.age).toBe(114);
  });

  it('age 45 → 35 points', () => {
    const result = calculateCRS(baseProfile({ age: 45 }));
    expect(result.breakdown.coreHumanCapital.age).toBe(35);
  });

  it('age 46+ → 0 points', () => {
    for (const age of [46, 50, 60, 99]) {
      const result = calculateCRS(baseProfile({ age }));
      expect(result.breakdown.coreHumanCapital.age).toBe(0);
    }
  });
});

describe('Age Brackets (with spouse coming to Canada)', () => {
  const spouseProfile = (age: number) =>
    baseProfile({
      age,
      maritalStatus: 'married',
      spouseComingToCanada: true,
      spouseEducation: EducationLevel.BachelorsDegree,
      spouseFirstLanguage: { speaking: 5, listening: 5, reading: 5, writing: 5 },
      spouseCanadianWorkExperienceYears: 0,
    });

  it('age 25 with spouse → 115 points (lower than withoutSpouse 129)', () => {
    const result = calculateCRS(spouseProfile(25));
    expect(result.breakdown.coreHumanCapital.age).toBe(115);
  });

  it('age 46+ with spouse → 0 points', () => {
    const result = calculateCRS(spouseProfile(50));
    expect(result.breakdown.coreHumanCapital.age).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 3. CLB Boundary Tests
// ---------------------------------------------------------------------------
describe('First Language CLB Boundaries (without spouse)', () => {
  const profileWithCLB = (clb: number) =>
    baseProfile({
      firstLanguage: {
        language: 'english',
        scores: { speaking: clb, listening: clb, reading: clb, writing: clb },
      },
      // Isolate language by removing exp and education transferability
      canadianWorkExperienceYears: 0,
      foreignWorkExperienceYears: 0,
      certificateOfQualification: false,
    });

  it('CLB 3 → 0 points per ability', () => {
    const result = calculateCRS(profileWithCLB(3));
    expect(result.breakdown.coreHumanCapital.firstLanguage).toBe(0);
  });

  it('CLB 4 → 6 × 4 = 24 points', () => {
    const result = calculateCRS(profileWithCLB(4));
    expect(result.breakdown.coreHumanCapital.firstLanguage).toBe(24);
  });

  it('CLB 6 → 8 × 4 = 32 points', () => {
    const result = calculateCRS(profileWithCLB(6));
    expect(result.breakdown.coreHumanCapital.firstLanguage).toBe(32);
  });

  it('CLB 7 → 16 × 4 = 64 points (jump from CLB 6)', () => {
    const result = calculateCRS(profileWithCLB(7));
    expect(result.breakdown.coreHumanCapital.firstLanguage).toBe(64);
  });

  it('CLB 8 → 22 × 4 = 88 points', () => {
    const result = calculateCRS(profileWithCLB(8));
    expect(result.breakdown.coreHumanCapital.firstLanguage).toBe(88);
  });

  it('CLB 9 → 29 × 4 = 116 points', () => {
    const result = calculateCRS(profileWithCLB(9));
    expect(result.breakdown.coreHumanCapital.firstLanguage).toBe(116);
  });

  it('CLB 10 → 32 × 4 = 128 points', () => {
    const result = calculateCRS(profileWithCLB(10));
    expect(result.breakdown.coreHumanCapital.firstLanguage).toBe(128);
  });

  it('CLB 12 (max) → same as CLB 10+ = 128 points', () => {
    const result = calculateCRS(profileWithCLB(12));
    expect(result.breakdown.coreHumanCapital.firstLanguage).toBe(128);
  });
});

// ---------------------------------------------------------------------------
// 4. Transferability Cap at 100
// ---------------------------------------------------------------------------
describe('Skill Transferability Cap', () => {
  it('Multiple transferability combos that exceed 100 are capped at 100', () => {
    // Profile designed to trigger multiple transferability combos:
    // - Bachelor's + CLB 9+ (education × language): 50 pts
    // - Bachelor's + 3+ years Canadian exp: 50 pts
    // - 3+ years foreign exp + CLB 9+: 50 pts
    // - 3+ years foreign exp + 3+ years Canadian: 50 pts
    // Raw = 200, should cap at 100
    const result = calculateCRS(
      baseProfile({
        education: EducationLevel.BachelorsDegree,
        firstLanguage: {
          language: 'english',
          scores: { speaking: 10, listening: 10, reading: 10, writing: 10 },
        },
        canadianWorkExperienceYears: 5,
        foreignWorkExperienceYears: 3,
      })
    );
    expect(result.breakdown.skillTransferability.subtotal).toBe(100);
    expect(result.breakdown.skillTransferability.subtotal).toBeLessThanOrEqual(100);
  });

  it('Low profile with no transferability combos → 0 transferability points', () => {
    const result = calculateCRS(
      baseProfile({
        education: EducationLevel.SecondaryDiploma, // below 1-year post-secondary
        canadianWorkExperienceYears: 0,
        foreignWorkExperienceYears: 0,
        firstLanguage: {
          language: 'english',
          scores: { speaking: 5, listening: 5, reading: 5, writing: 5 },
        },
        certificateOfQualification: false,
      })
    );
    expect(result.breakdown.skillTransferability.subtotal).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 5. French Language Bonus Tests
// ---------------------------------------------------------------------------
describe('French Language Bonus (Additional Points)', () => {
  it('NCLC 7+ in all abilities, no English test → tier 1 = 25 points', () => {
    const result = calculateCRS(
      baseProfile({
        firstLanguage: {
          language: 'french',
          scores: { speaking: 7, listening: 7, reading: 7, writing: 7 },
        },
        secondLanguage: undefined,
        frenchSkills: { speaking: 7, listening: 7, reading: 7, writing: 7 },
        canadianWorkExperienceYears: 0,
        foreignWorkExperienceYears: 0,
        certificateOfQualification: false,
      })
    );
    expect(result.breakdown.additionalPoints.frenchLanguage).toBe(25);
  });

  it('NCLC 7+ in all abilities, English CLB 5+ in all abilities → tier 2 = 50 points', () => {
    const result = calculateCRS(
      baseProfile({
        firstLanguage: {
          language: 'french',
          scores: { speaking: 7, listening: 7, reading: 7, writing: 7 },
        },
        secondLanguage: {
          language: 'english',
          scores: { speaking: 5, listening: 5, reading: 5, writing: 5 },
        },
        frenchSkills: { speaking: 7, listening: 7, reading: 7, writing: 7 },
        canadianWorkExperienceYears: 0,
        foreignWorkExperienceYears: 0,
        certificateOfQualification: false,
      })
    );
    expect(result.breakdown.additionalPoints.frenchLanguage).toBe(50);
  });

  it('NCLC 6 (below threshold) → 0 French bonus', () => {
    const result = calculateCRS(
      baseProfile({
        frenchSkills: { speaking: 6, listening: 6, reading: 6, writing: 6 },
      })
    );
    expect(result.breakdown.additionalPoints.frenchLanguage).toBe(0);
  });

  it('Only 3 of 4 French abilities meet NCLC 7 → 0 bonus (all 4 required)', () => {
    const result = calculateCRS(
      baseProfile({
        frenchSkills: { speaking: 7, listening: 7, reading: 7, writing: 6 },
      })
    );
    expect(result.breakdown.additionalPoints.frenchLanguage).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 6. PNP +600 Test
// ---------------------------------------------------------------------------
describe('Provincial Nomination', () => {
  it('PNP adds exactly 600 points', () => {
    const withoutPNP = calculateCRS(baseProfile({ provincialNomination: false }));
    const withPNP = calculateCRS(baseProfile({ provincialNomination: true }));
    expect(withPNP.total - withoutPNP.total).toBe(600);
    expect(withPNP.breakdown.additionalPoints.provincialNomination).toBe(600);
  });
});

// ---------------------------------------------------------------------------
// 7. Job Offer → Always 0 Points (Post March 2025)
// ---------------------------------------------------------------------------
describe('Job Offer (Arranged Employment)', () => {
  it('jobOffer field present but always awards 0 points', () => {
    const withJobOffer = calculateCRS(baseProfile({ jobOffer: true }));
    const withoutJobOffer = calculateCRS(baseProfile({ jobOffer: false }));
    expect(withJobOffer.breakdown.additionalPoints.jobOffer).toBe(0);
    expect(withJobOffer.total).toBe(withoutJobOffer.total);
  });

  it('jobOffer in breakdown is always typed as 0 (literal type)', () => {
    const result = calculateCRS(baseProfile({ jobOffer: true }));
    // TypeScript type ensures this is always `0`, runtime must match
    expect(result.breakdown.additionalPoints.jobOffer).toStrictEqual(0);
  });
});

// ---------------------------------------------------------------------------
// 8. Single vs. Married (Point Table Switch)
// ---------------------------------------------------------------------------
describe('Single vs. Married (withSpouse vs withoutSpouse tables)', () => {
  it('Single candidate uses withoutSpouse table (higher age points)', () => {
    const single = calculateCRS(baseProfile({ maritalStatus: 'single', age: 30 }));
    expect(single.breakdown.coreHumanCapital.age).toBe(129); // withoutSpouse[30]
  });

  it('Married with spouse coming uses withSpouse table (lower age points)', () => {
    const married = calculateCRS(
      baseProfile({
        maritalStatus: 'married',
        spouseComingToCanada: true,
        age: 30,
        spouseEducation: EducationLevel.SecondaryDiploma,
        spouseFirstLanguage: { speaking: 5, listening: 5, reading: 5, writing: 5 },
        spouseCanadianWorkExperienceYears: 0,
      })
    );
    expect(married.breakdown.coreHumanCapital.age).toBe(115); // withSpouse[30]
  });

  it('Married with spouse NOT coming uses withoutSpouse table', () => {
    const marriedNoSpouse = calculateCRS(
      baseProfile({
        maritalStatus: 'married',
        spouseComingToCanada: false,
        age: 30,
      })
    );
    expect(marriedNoSpouse.breakdown.coreHumanCapital.age).toBe(129); // withoutSpouse
    expect(marriedNoSpouse.breakdown.spouseFactors.subtotal).toBe(0);
  });

  it('Spouse factors are 0 when spouse is not coming', () => {
    const result = calculateCRS(
      baseProfile({ maritalStatus: 'married', spouseComingToCanada: false })
    );
    expect(result.breakdown.spouseFactors.subtotal).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 9. computeScoreDelta helper
// ---------------------------------------------------------------------------
describe('computeScoreDelta', () => {
  it('Returns positive delta when improving CLB score', () => {
    const profile = baseProfile({
      firstLanguage: {
        language: 'english',
        scores: { speaking: 7, listening: 7, reading: 7, writing: 7 },
      },
    });
    const { delta } = computeScoreDelta(profile, {
      firstLanguage: {
        language: 'english',
        scores: { speaking: 9, listening: 9, reading: 9, writing: 9 },
      },
    });
    expect(delta).toBeGreaterThan(0);
  });

  it('Returns 0 delta for no-op modification', () => {
    const profile = baseProfile();
    const { delta } = computeScoreDelta(profile, {});
    expect(delta).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 10. Five Full Fixture Candidates
// ---------------------------------------------------------------------------
describe('Full Fixture Candidates (End-to-End)', () => {
  /**
   * FIXTURE 1: The Strong Tech Professional
   * Profile: Single, age 29, Bachelor's CS, IELTS CLB 9 all abilities,
   *          2 years Canadian WE, 0 foreign WE, no extras.
   *
   * Expected score calculation (manual):
   * A. Core (withoutSpouse):
   *   - Age 29 → 130
   *   - Bachelor's → 120
   *   - First lang CLB 9 (29×4) → 116
   *   - Second lang → 0
   *   - Canadian WE 2 yrs → 53
   *   Subtotal A = 419
   * B. Spouse = 0
   * C. Transferability:
   *   - Education(bachelor) × Lang(CLB9) → 50
   *   - Education(bachelor) × Canadian WE 2yr → 50
   *   - Total raw = 100, cap = 100
   *   Subtotal C = 100
   * D. Additional = 0
   *
   * Total = 419 + 0 + 100 + 0 = 519
   */
  it('Fixture 1 — Strong Tech Professional: score = 519', () => {
    const profile = baseProfile({
      age: 29,
      maritalStatus: 'single',
      spouseComingToCanada: false,
      education: EducationLevel.BachelorsDegree,
      firstLanguage: {
        language: 'english',
        scores: { speaking: 9, listening: 9, reading: 9, writing: 9 },
      },
      canadianWorkExperienceYears: 2,
      foreignWorkExperienceYears: 0,
    });
    const result = calculateCRS(profile);
    expect(result.total).toBe(519);
  });

  /**
   * FIXTURE 2: The Mid-Level International Candidate
   * Profile: Single, age 35, Bachelor's, IELTS CLB 7 all abilities,
   *          0 Canadian WE, 3 years foreign WE, no extras.
   *
   * A. Core (withoutSpouse):
   *   - Age 35 → 114
   *   - Bachelor's → 120
   *   - First lang CLB 7 (16×4) → 64
   *   - Second lang → 0
   *   - Canadian WE 0 → 0
   *   Subtotal A = 298
   * B. Spouse = 0
   * C. Transferability:
   *   - Education(bachelor) × Lang(CLB7) → 25 (CLB 7–8 bracket)
   *   - Education × Canadian WE 0 → 0 (need ≥1yr)
   *   - Foreign WE 3yr × Lang CLB7 → 25 (3yr+, CLB 7–8)
   *   - Foreign WE × Canadian WE 0 → 0
   *   Raw = 50, cap not reached
   *   Subtotal C = 50
   * D. Additional = 0
   *
   * Total = 298 + 0 + 50 + 0 = 348
   */
  it('Fixture 2 — Mid-Level International Candidate: score = 348', () => {
    const profile = baseProfile({
      age: 35,
      maritalStatus: 'single',
      education: EducationLevel.BachelorsDegree,
      firstLanguage: {
        language: 'english',
        scores: { speaking: 7, listening: 7, reading: 7, writing: 7 },
      },
      canadianWorkExperienceYears: 0,
      foreignWorkExperienceYears: 3,
    });
    const result = calculateCRS(profile);
    expect(result.total).toBe(348);
  });

  /**
   * FIXTURE 3: The Nominated Candidate (PNP)
   * Profile: Single, age 40, Bachelor's, CLB 7, 1 yr Canadian WE, PNP nominated.
   *
   * A. Core (withoutSpouse):
   *   - Age 40 → 85
   *   - Bachelor's → 120
   *   - First lang CLB 7 → 64
   *   - Second lang → 0
   *   - Canadian WE 1 yr → 40
   *   Subtotal A = 309
   * B. Spouse = 0
   * C. Transferability:
   *   - Education(bachelor) × Lang(CLB7) → 25
   *   - Education(bachelor) × Canadian WE 1yr → 25
   *   Raw = 50
   *   Subtotal C = 50
   * D. Additional:
   *   - PNP → 600
   *   Subtotal D = 600
   *
   * Total = 309 + 0 + 50 + 600 = 959
   */
  it('Fixture 3 — Nominated Candidate with PNP +600: score = 959', () => {
    const profile = baseProfile({
      age: 40,
      maritalStatus: 'single',
      education: EducationLevel.BachelorsDegree,
      firstLanguage: {
        language: 'english',
        scores: { speaking: 7, listening: 7, reading: 7, writing: 7 },
      },
      canadianWorkExperienceYears: 1,
      foreignWorkExperienceYears: 0,
      provincialNomination: true,
    });
    const result = calculateCRS(profile);
    expect(result.total).toBe(959);
  });

  /**
   * FIXTURE 4: The Bilingual Candidate (French Tier 2 Bonus)
   * Profile: Single, age 28, Master's, French as first lang CLB 8,
   *          English as second lang CLB 5, NCLC 8 in all French abilities,
   *          1 yr Canadian WE.
   *
   * A. Core (withoutSpouse):
   *   - Age 28 → 130
   *   - Master's → 135
   *   - First lang French CLB 8 (22×4) → 88
   *   - Second lang English CLB 5 (1×4) → capped at 24 → raw = 4, actual = 4
   *   - Canadian WE 1 yr → 40
   *   Subtotal A = 397
   * B. Spouse = 0
   * C. Transferability:
   *   - Education(bachelor+) × Lang(CLB 8) = 25 (7–8 bracket, bachelor+)
   *   - Education(bachelor+) × Canadian WE 1yr = 25
   *   Raw = 50
   *   Subtotal C = 50
   * D. Additional:
   *   - French: NCLC 8 all 4 abilities (≥7), English CLB 5+ all 4 → tier 2 = 50
   *   Subtotal D = 50
   *
   * Total = 397 + 0 + 50 + 50 = 497
   */
  it('Fixture 4 — Bilingual Candidate with French Tier 2 Bonus: score = 497', () => {
    const profile = baseProfile({
      age: 28,
      maritalStatus: 'single',
      education: EducationLevel.MastersDegree,
      firstLanguage: {
        language: 'french',
        scores: { speaking: 8, listening: 8, reading: 8, writing: 8 },
      },
      secondLanguage: {
        language: 'english',
        scores: { speaking: 5, listening: 5, reading: 5, writing: 5 },
      },
      frenchSkills: { speaking: 8, listening: 8, reading: 8, writing: 8 },
      canadianWorkExperienceYears: 1,
      foreignWorkExperienceYears: 0,
    });
    const result = calculateCRS(profile);
    expect(result.total).toBe(497);
  });

  /**
   * FIXTURE 5: The Married Couple (Spouse Coming to Canada)
   * Profile: Married, spouse coming, age 32, Bachelor's, CLB 9 all,
   *          2 yrs Canadian WE. Spouse: Bachelor's, CLB 7, 0 Canadian WE.
   *
   * A. Core (withSpouse tables):
   *   - Age 32 → 112
   *   - Bachelor's (withSpouse) → 112
   *   - First lang CLB 9 (29×4) → 116  [first lang table same for both]
   *   - Second lang → 0
   *   - Canadian WE 2 yr (withSpouse) → 46
   *   Subtotal A = 386
   * B. Spouse factors:
   *   - Education Bachelor's (tier 4) → 8
   *   - Language CLB 7 (3×4) → 12
   *   - Canadian WE 0 → 0
   *   Subtotal B = 20
   * C. Transferability:
   *   - Education(bachelor+) × Lang(CLB9) → 50
   *   - Education(bachelor+) × Canadian WE 2yr → 50
   *   Raw = 100, cap = 100
   *   Subtotal C = 100
   * D. Additional = 0
   *
   * Total = 386 + 20 + 100 + 0 = 506
   */
  it('Fixture 5 — Married Couple with Spouse Coming: score = 506', () => {
    const profile = baseProfile({
      age: 32,
      maritalStatus: 'married',
      spouseComingToCanada: true,
      education: EducationLevel.BachelorsDegree,
      firstLanguage: {
        language: 'english',
        scores: { speaking: 9, listening: 9, reading: 9, writing: 9 },
      },
      canadianWorkExperienceYears: 2,
      foreignWorkExperienceYears: 0,
      spouseEducation: EducationLevel.BachelorsDegree,
      spouseFirstLanguage: { speaking: 7, listening: 7, reading: 7, writing: 7 },
      spouseCanadianWorkExperienceYears: 0,
    });
    const result = calculateCRS(profile);
    expect(result.total).toBe(506);
  });
});
