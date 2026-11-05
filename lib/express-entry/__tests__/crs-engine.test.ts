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
//  - Labour Market Integration (3 Nov 2026): experience path vs high-wage job offer
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
    highWageCanadianExperience: 'none',
    jobOfferWage: 'none',
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

  it('age 20–29 → 110 points (peak)', () => {
    for (const age of [20, 25, 29]) {
      const result = calculateCRS(baseProfile({ age }));
      expect(result.breakdown.coreHumanCapital.age).toBe(110);
    }
  });

  it('age 30 → 105, age 35 → 77 (decline)', () => {
    expect(calculateCRS(baseProfile({ age: 30 })).breakdown.coreHumanCapital.age).toBe(105);
    expect(calculateCRS(baseProfile({ age: 35 })).breakdown.coreHumanCapital.age).toBe(77);
  });

  it('age 44 → 6, age 45 → 0 (IRCC: 45 or more scores 0)', () => {
    expect(calculateCRS(baseProfile({ age: 44 })).breakdown.coreHumanCapital.age).toBe(6);
    expect(calculateCRS(baseProfile({ age: 45 })).breakdown.coreHumanCapital.age).toBe(0);
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

  it('age 25 with spouse → 100 points (lower than withoutSpouse 110)', () => {
    const result = calculateCRS(spouseProfile(25));
    expect(result.breakdown.coreHumanCapital.age).toBe(100);
  });

  it('age 40 with spouse → 45 points', () => {
    const result = calculateCRS(spouseProfile(40));
    expect(result.breakdown.coreHumanCapital.age).toBe(45);
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

  it('CLB 6 → 9 × 4 = 36 points', () => {
    const result = calculateCRS(profileWithCLB(6));
    expect(result.breakdown.coreHumanCapital.firstLanguage).toBe(36);
  });

  it('CLB 7 → 17 × 4 = 68 points (jump from CLB 6)', () => {
    const result = calculateCRS(profileWithCLB(7));
    expect(result.breakdown.coreHumanCapital.firstLanguage).toBe(68);
  });

  it('CLB 8 → 23 × 4 = 92 points', () => {
    const result = calculateCRS(profileWithCLB(8));
    expect(result.breakdown.coreHumanCapital.firstLanguage).toBe(92);
  });

  it('CLB 9 → 31 × 4 = 124 points', () => {
    const result = calculateCRS(profileWithCLB(9));
    expect(result.breakdown.coreHumanCapital.firstLanguage).toBe(124);
  });

  it('CLB 10 → 34 × 4 = 136 points', () => {
    const result = calculateCRS(profileWithCLB(10));
    expect(result.breakdown.coreHumanCapital.firstLanguage).toBe(136);
  });

  it('CLB 12 (max) → same as CLB 10+ = 136 points', () => {
    const result = calculateCRS(profileWithCLB(12));
    expect(result.breakdown.coreHumanCapital.firstLanguage).toBe(136);
  });
});

// ---------------------------------------------------------------------------
// 4. Transferability Cap at 100
// ---------------------------------------------------------------------------
describe('Skill Transferability Cap', () => {
  it('Multiple transferability combos that exceed 100 are capped at 100', () => {
    // Profile designed to trigger multiple transferability combos:
    // - Bachelor's + CLB 9+ (education × language): 25 pts
    // - Bachelor's + 2+ years Canadian exp: 25 pts
    // - 3+ years foreign exp + CLB 9+: 50 pts
    // - 3+ years foreign exp + 3+ years Canadian: 50 pts
    // Raw = 150, should cap at 100
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
// 7. Labour Market Integration (IRCC, from 3 November 2026)
// Source: canada.ca CRS criteria page, date modified 2026-11-03.
// Either the Canadian work experience path or a high-wage job offer, not both.
// ---------------------------------------------------------------------------
describe('Labour Market Integration', () => {
  const noCanadianExp = { canadianWorkExperienceYears: 0 as const };

  it('job offer at 2× / 1.5× / 1.3× the median wage → 100 / 70 / 50', () => {
    expect(calculateCRS(baseProfile({ ...noCanadianExp, jobOfferWage: '2x' })).breakdown.coreHumanCapital.labourMarketIntegration).toBe(100);
    expect(calculateCRS(baseProfile({ ...noCanadianExp, jobOfferWage: '1.5x' })).breakdown.coreHumanCapital.labourMarketIntegration).toBe(70);
    expect(calculateCRS(baseProfile({ ...noCanadianExp, jobOfferWage: '1.3x' })).breakdown.coreHumanCapital.labourMarketIntegration).toBe(50);
    expect(calculateCRS(baseProfile({ ...noCanadianExp, jobOfferWage: 'none' })).breakdown.coreHumanCapital.labourMarketIntegration).toBe(0);
  });

  it('job offer points are the same with or without a spouse', () => {
    const r = calculateCRS(baseProfile({
      ...noCanadianExp, jobOfferWage: '2x', maritalStatus: 'married', spouseComingToCanada: true,
      spouseEducation: EducationLevel.SecondaryDiploma, spouseFirstLanguage: { speaking: 4, listening: 4, reading: 4, writing: 4 },
    }));
    expect(r.breakdown.coreHumanCapital.labourMarketIntegration).toBe(100);
  });

  it('experience path = work length + high-wage experience (single: 5 yrs 80 + 2× 70 = 150, the maximum)', () => {
    const r = calculateCRS(baseProfile({ canadianWorkExperienceYears: 5, highWageCanadianExperience: '2x' }));
    expect(r.breakdown.labourMarketIntegration.workLength).toBe(80);
    expect(r.breakdown.labourMarketIntegration.highWageExperience).toBe(70);
    expect(r.breakdown.coreHumanCapital.labourMarketIntegration).toBe(150);
  });

  it('with a spouse the experience path tops out at 140 (70 + 70)', () => {
    const r = calculateCRS(baseProfile({
      canadianWorkExperienceYears: 5, highWageCanadianExperience: '2x', maritalStatus: 'married', spouseComingToCanada: true,
      spouseEducation: EducationLevel.SecondaryDiploma, spouseFirstLanguage: { speaking: 4, listening: 4, reading: 4, writing: 4 },
    }));
    expect(r.breakdown.coreHumanCapital.labourMarketIntegration).toBe(140);
  });

  it('high-wage experience 1.5× → 40, 1.3× → 20', () => {
    expect(calculateCRS(baseProfile({ canadianWorkExperienceYears: 1, highWageCanadianExperience: '1.5x' })).breakdown.labourMarketIntegration.highWageExperience).toBe(40);
    expect(calculateCRS(baseProfile({ canadianWorkExperienceYears: 1, highWageCanadianExperience: '1.3x' })).breakdown.labourMarketIntegration.highWageExperience).toBe(20);
  });

  it('high-wage experience needs at least 1 year of Canadian work experience', () => {
    const r = calculateCRS(baseProfile({ ...noCanadianExp, highWageCanadianExperience: '2x' }));
    expect(r.breakdown.labourMarketIntegration.highWageExperience).toBe(0);
    expect(r.breakdown.coreHumanCapital.labourMarketIntegration).toBe(0);
  });

  it('never both: the higher of the two paths applies', () => {
    // 1 yr (40) + no high-wage experience = 40 vs job offer 2× = 100 → 100
    const offerWins = calculateCRS(baseProfile({ canadianWorkExperienceYears: 1, jobOfferWage: '2x' }));
    expect(offerWins.breakdown.coreHumanCapital.labourMarketIntegration).toBe(100);
    expect(offerWins.breakdown.labourMarketIntegration.applied).toBe('jobOffer');
    // 3 yrs (64) + 2× (70) = 134 vs job offer 1.5× = 70 → 134
    const expWins = calculateCRS(baseProfile({ canadianWorkExperienceYears: 3, highWageCanadianExperience: '2x', jobOfferWage: '1.5x' }));
    expect(expWins.breakdown.coreHumanCapital.labourMarketIntegration).toBe(134);
    expect(expWins.breakdown.labourMarketIntegration.applied).toBe('experience');
  });

  it('flags the either/or assumption when both paths score', () => {
    const r = calculateCRS(baseProfile({ canadianWorkExperienceYears: 1, jobOfferWage: '1.3x' }));
    expect(r.flags.some((f) => f.includes('Labour Market Integration'))).toBe(true);
  });

  it('a job offer no longer sits in the additional points', () => {
    const r = calculateCRS(baseProfile({ ...noCanadianExp, jobOfferWage: '2x' }));
    expect(r.breakdown.additionalPoints.subtotal).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 7b. Skill transferability rows (IRCC CRS criteria page, 2026-11-03)
// ---------------------------------------------------------------------------
describe('Skill Transferability rows', () => {
  it("a bachelor's alone is in the post-secondary row: CLB 9 → 25, CLB 7 → 13", () => {
    const clb = (n: number) => ({ language: 'english' as const, scores: { speaking: n, listening: n, reading: n, writing: n } });
    expect(calculateCRS(baseProfile({ canadianWorkExperienceYears: 0, firstLanguage: clb(9) })).breakdown.skillTransferability.educationLanguage).toBe(25);
    expect(calculateCRS(baseProfile({ canadianWorkExperienceYears: 0, firstLanguage: clb(7) })).breakdown.skillTransferability.educationLanguage).toBe(13);
  });

  it("two or more credentials (one 3+ years), master's and PhD are in the top row: CLB 9 → 50", () => {
    for (const education of [EducationLevel.TwoPlusDegrees, EducationLevel.MastersDegree, EducationLevel.DoctoralDegree]) {
      const r = calculateCRS(baseProfile({ education, canadianWorkExperienceYears: 2 }));
      expect(r.breakdown.skillTransferability.educationLanguage).toBe(50);
      expect(r.breakdown.skillTransferability.educationCanadianExperience).toBe(50);
    }
  });

  it('certificate of qualification: CLB 5–6 → 25, CLB 7+ → 50', () => {
    const clb = (n: number) => ({ language: 'english' as const, scores: { speaking: n, listening: n, reading: n, writing: n } });
    const base = { certificateOfQualification: true, education: EducationLevel.SecondaryDiploma, canadianWorkExperienceYears: 0 as const };
    expect(calculateCRS(baseProfile({ ...base, firstLanguage: clb(5) })).breakdown.skillTransferability.certificateLanguage).toBe(25);
    expect(calculateCRS(baseProfile({ ...base, firstLanguage: clb(7) })).breakdown.skillTransferability.certificateLanguage).toBe(50);
  });

  it('second official language is capped at 22 with a spouse', () => {
    const r = calculateCRS(baseProfile({
      maritalStatus: 'married', spouseComingToCanada: true,
      spouseEducation: EducationLevel.SecondaryDiploma, spouseFirstLanguage: { speaking: 4, listening: 4, reading: 4, writing: 4 },
      secondLanguage: { language: 'french', scores: { speaking: 10, listening: 10, reading: 10, writing: 10 } },
    }));
    expect(r.breakdown.coreHumanCapital.secondLanguage).toBe(22);
  });
});

// ---------------------------------------------------------------------------
// 8. Single vs. Married (Point Table Switch)
// ---------------------------------------------------------------------------
describe('Single vs. Married (withSpouse vs withoutSpouse tables)', () => {
  it('Single candidate uses withoutSpouse table (higher age points)', () => {
    const single = calculateCRS(baseProfile({ maritalStatus: 'single', age: 30 }));
    expect(single.breakdown.coreHumanCapital.age).toBe(105); // withoutSpouse[30]
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
    expect(married.breakdown.coreHumanCapital.age).toBe(95); // withSpouse[30]
  });

  it('Married with spouse NOT coming uses withoutSpouse table', () => {
    const marriedNoSpouse = calculateCRS(
      baseProfile({
        maritalStatus: 'married',
        spouseComingToCanada: false,
        age: 30,
      })
    );
    expect(marriedNoSpouse.breakdown.coreHumanCapital.age).toBe(105); // withoutSpouse
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
  // Expected scores are worked by hand from the IRCC CRS criteria page
  // (date modified 2026-11-03), checked 2026-11-05.

  /**
   * FIXTURE 1: Single, 29, bachelor's, CLB 9, 2 yrs Canadian work.
   * A: age 110 + education 120 + language 31×4 = 124 + LMI (work length 53) = 407
   * C: bachelor's × CLB 9 = 25, bachelor's × 2 yrs Canadian = 25 → 50
   * Total = 457
   */
  it('Fixture 1 — Strong Tech Professional: score = 457', () => {
    const profile = baseProfile({
      age: 29,
      education: EducationLevel.BachelorsDegree,
      firstLanguage: { language: 'english', scores: { speaking: 9, listening: 9, reading: 9, writing: 9 } },
      canadianWorkExperienceYears: 2,
      foreignWorkExperienceYears: 0,
    });
    expect(calculateCRS(profile).total).toBe(457);
  });

  /**
   * FIXTURE 2: Single, 35, bachelor's, CLB 7, no Canadian work, 3 yrs foreign.
   * A: age 77 + education 120 + language 17×4 = 68 + LMI 0 = 265
   * C: bachelor's × CLB 7 = 13, foreign 3+ yrs × CLB 7 = 25 → 38
   * Total = 303
   */
  it('Fixture 2 — Mid-Level International Candidate: score = 303', () => {
    const profile = baseProfile({
      age: 35,
      education: EducationLevel.BachelorsDegree,
      firstLanguage: { language: 'english', scores: { speaking: 7, listening: 7, reading: 7, writing: 7 } },
      canadianWorkExperienceYears: 0,
      foreignWorkExperienceYears: 3,
    });
    expect(calculateCRS(profile).total).toBe(303);
  });

  /**
   * FIXTURE 3: Single, 40, bachelor's, CLB 7, 1 yr Canadian work, provincial nomination.
   * A: age 50 + education 120 + language 68 + LMI (work length 40) = 278
   * C: bachelor's × CLB 7 = 13, bachelor's × 1 yr Canadian = 13 → 26
   * D: nomination 600
   * Total = 904
   */
  it('Fixture 3 — Nominated Candidate with PNP +600: score = 904', () => {
    const profile = baseProfile({
      age: 40,
      education: EducationLevel.BachelorsDegree,
      firstLanguage: { language: 'english', scores: { speaking: 7, listening: 7, reading: 7, writing: 7 } },
      canadianWorkExperienceYears: 1,
      foreignWorkExperienceYears: 0,
      provincialNomination: true,
    });
    expect(calculateCRS(profile).total).toBe(904);
  });

  /**
   * FIXTURE 4: Single, 28, master's, French first (CLB 8), English second (CLB 5), 1 yr Canadian work.
   * A: age 110 + education 135 + language 23×4 = 92 + second 1×4 = 4 + LMI 40 = 381
   * C: master's × CLB 8 = 25, master's × 1 yr Canadian = 25 → 50
   * D: French NCLC 7+ and English CLB 5+ on all four = 50
   * Total = 481
   */
  it('Fixture 4 — Bilingual Candidate with French Tier 2 Bonus: score = 481', () => {
    const profile = baseProfile({
      age: 28,
      education: EducationLevel.MastersDegree,
      firstLanguage: { language: 'french', scores: { speaking: 8, listening: 8, reading: 8, writing: 8 } },
      secondLanguage: { language: 'english', scores: { speaking: 5, listening: 5, reading: 5, writing: 5 } },
      frenchSkills: { speaking: 8, listening: 8, reading: 8, writing: 8 },
      canadianWorkExperienceYears: 1,
      foreignWorkExperienceYears: 0,
    });
    expect(calculateCRS(profile).total).toBe(481);
  });

  /**
   * FIXTURE 5: Married, spouse coming, 32, bachelor's, CLB 9, 2 yrs Canadian work.
   * Spouse: bachelor's, CLB 7, no Canadian work.
   * A (with-spouse tables): age 85 + education 112 + language 29×4 = 116 + LMI 46 = 359
   * B: education 8 + language 3×4 = 12 + 0 = 20
   * C: 25 + 25 = 50
   * Total = 429
   */
  it('Fixture 5 — Married Couple with Spouse Coming: score = 429', () => {
    const profile = baseProfile({
      age: 32,
      maritalStatus: 'married',
      spouseComingToCanada: true,
      education: EducationLevel.BachelorsDegree,
      firstLanguage: { language: 'english', scores: { speaking: 9, listening: 9, reading: 9, writing: 9 } },
      canadianWorkExperienceYears: 2,
      foreignWorkExperienceYears: 0,
      spouseEducation: EducationLevel.BachelorsDegree,
      spouseFirstLanguage: { speaking: 7, listening: 7, reading: 7, writing: 7 },
      spouseCanadianWorkExperienceYears: 0,
    });
    expect(calculateCRS(profile).total).toBe(429);
  });

  /**
   * FIXTURE 6: Single, 29, bachelor's, CLB 9, no Canadian work, 3 yrs foreign,
   * job offer in an occupation at 2× the median wage (new on 3 Nov 2026).
   * A: age 110 + education 120 + language 124 + LMI (job offer) 100 = 454
   * C: bachelor's × CLB 9 = 25, foreign 3+ × CLB 9 = 50 → 75
   * Total = 529
   */
  it('Fixture 6 — High-wage job offer from abroad: score = 529', () => {
    const profile = baseProfile({
      age: 29,
      education: EducationLevel.BachelorsDegree,
      firstLanguage: { language: 'english', scores: { speaking: 9, listening: 9, reading: 9, writing: 9 } },
      canadianWorkExperienceYears: 0,
      foreignWorkExperienceYears: 3,
      jobOfferWage: '2x',
    });
    expect(calculateCRS(profile).total).toBe(529);
  });
});
