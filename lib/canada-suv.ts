// ============================================================================
// lib/canada-suv.ts
// The one place that says what the Canada Start-up Visa Program is, and what
// state it is in. Every SUV surface — the English pillar page, the Persian
// pages, page metadata, the writers' brand facts — reads from here, so an
// IRCC change is one edit in one file.
//
// RULES FOR THIS FILE
//  1. Every figure here is quoted from a canada.ca page and carries the URL
//     it came from in `SUV_SOURCES`. If canada.ca does not state it, it does
//     not belong in this file.
//  2. Anything IRCC has not published — the replacement pilot's cap, its
//     processing target, its opening date — lives in `SUV_UNOFFICIAL` and is
//     labelled as reporting, never as fact. Pages must render it as such.
//  3. IRCC's own processing-time widget on the About page returns no figure
//     at present, so THERE IS NO PROCESSING TIME IN THIS FILE. A months
//     number for SUV would be invented, and an invented number in an
//     immigration decision costs the reader money.
//
// Verified 2026-09-12 against the five canada.ca pages listed below.
// Re-verify at every content review; this is the most time-sensitive fact
// on the site.
// ============================================================================

/** The day the facts below were last read off canada.ca. */
export const SUV_VERIFIED = '2026-09-12';

export const SUV_SOURCES = {
  program: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html',
  about: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/about.html',
  eligibility: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/eligibility.html',
  designatedOrganizations:
    'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/eligibility/designated-organizations.html',
  apply: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/apply.html',
} as const;

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------
/**
 * IRCC's own word for the programme's state is "Paused", on every SUV page.
 * We use the same word: "closed" would tell someone with a file in progress
 * that their application is gone, and it is not.
 */
export const SUV_STATE = {
  /** IRCC's status label, verbatim. */
  label: 'Paused',
  /** "The Start-Up Visa Program was paused on June 30, 2026." */
  pausedOn: '2026-06-30',
  /**
   * The last intake rule, verbatim in substance: to apply you needed a valid
   * 2025 commitment certificate AND had to apply by 30 June 2026. The
   * programme is closed to all other applications.
   */
  lastIntake: { certificateYear: 2025, filingDeadline: '2026-06-30' },
  /**
   * "If we get a commitment certificate before January 1, 2026, you have
   * 6 months to send us your application."
   */
  certificateCutoff: '2026-01-01',
  certificateFilingWindowMonths: 6,
  /** Applications accepted before the pause date are still being processed. */
  inFlightStillProcessed: true,
  /**
   * The open work permit is the one thing still available, and the English
   * page had this backwards. IRCC, on all three SUV pages: "If you're
   * eligible, you can still apply for an OPEN work permit so you can work
   * while we process your application." Separately, the *extension* page is
   * headed "Closed to new applicants" — extending requires that you already
   * hold an SUV work permit. Both halves must travel together or the
   * sentence misleads.
   */
  openWorkPermit: {
    availableWhileProcessing: true,
    extensionClosedToNewApplicants: true,
  },
  /** Designated organisations are marked "Paused" for taking on new founders too. */
  designatedOrganisationIntakePaused: true,
} as const;

// ---------------------------------------------------------------------------
// Eligibility, as the programme stood
// ---------------------------------------------------------------------------
export const SUV_RULES = {
  /** Outside Quebec — Quebec runs its own programmes. */
  excludesQuebec: true,
  maxOwnersPerBusiness: 5,
  /** Each applicant must hold 10% or more of the total voting rights. */
  minVotingRightsPerApplicant: 10,
  /** Applicants and the designated organisation together: more than 50%. */
  minCombinedVotingRights: 50,
  /** Canadian Language Benchmark 5 in listening, reading, writing AND speaking. */
  language: { benchmark: 5, abilities: ['listening', 'reading', 'writing', 'speaking'], languages: ['English', 'French'] },
  /** If the application succeeds, all three obligations bite. */
  ifApproved: [
    'incorporate the business in Canada',
    'provide active and ongoing management of the business from inside Canada',
    'keep an essential part of business operations in Canada',
  ],
  /** In the PR Portal the programme is called the Start-Up Business Class. */
  portalName: 'Start-Up Business Class',
} as const;

// ---------------------------------------------------------------------------
// Designated organisations
// ---------------------------------------------------------------------------
export const SUV_ORGS = {
  /** A venture capital fund must confirm an investment of at least this much. */
  ventureCapitalMinimum: 200_000,
  /** An angel investor group must confirm an investment of at least this much. */
  angelMinimum: 75_000,
  /**
   * An incubator accepts you into its programme rather than investing — but
   * "no minimum investment" is no longer the whole truth: IRCC prioritises
   * incubators with committed capital of $75,000, so an incubator without it
   * is a slower lane, not an equal one.
   */
  incubatorPriorityCommittedCapital: 75_000,
  /** Since 1 April 2024: 10 complete group applications per organisation per year. */
  groupApplicationsPerOrganisationPerYear: 10,
  capInForceSince: '2024-04-01',
  /** Over the cap, the application is returned and the processing fees reimbursed. */
  overCapApplicationsReturned: true,
  /**
   * A group application counts against the cap once submitted — including
   * when a member fails the completeness check. Every member must file their
   * own PR application before any of them can be processed.
   */
  capCountsIncompleteGroups: true,
  currency: 'CAD',
} as const;

// ---------------------------------------------------------------------------
// Settlement funds — IRCC's table, updated 29 July 2025
// ---------------------------------------------------------------------------
/** Family size → funds required, in Canadian dollars. */
export const SUV_SETTLEMENT_FUNDS: Readonly<Record<number, number>> = {
  1: 15_263,
  2: 19_001,
  3: 23_360,
  4: 28_362,
  5: 32_168,
  6: 36_280,
  7: 40_392,
};

/** Beyond seven people, add this per additional family member. */
export const SUV_SETTLEMENT_FUNDS_EXTRA_PER_PERSON = 4_112;

/** The date printed above IRCC's own table. Quote it whenever you quote a figure. */
export const SUV_SETTLEMENT_FUNDS_UPDATED = '2025-07-29';

export function settlementFundsFor(familySize: number): number {
  const size = Math.max(1, Math.floor(familySize));
  const listed = SUV_SETTLEMENT_FUNDS[size];
  if (listed !== undefined) return listed;
  return SUV_SETTLEMENT_FUNDS[7] + (size - 7) * SUV_SETTLEMENT_FUNDS_EXTRA_PER_PERSON;
}

// ---------------------------------------------------------------------------
// The replacement — reported, not published
// ---------------------------------------------------------------------------
/**
 * IRCC has said the pause is a transition to a new, targeted pilot for
 * immigrant entrepreneurs, with details to be announced. That is as far as
 * canada.ca goes: no cap, no processing target, no opening date, no
 * eligibility criteria.
 *
 * The cap and processing-target figures that circulate (a ~2,000-a-year cap,
 * a ~12-month target) are trade-press reporting, not IRCC publications. A
 * founder cannot plan on them, so any page that mentions them must say where
 * they come from and that IRCC has not published them. The backlog figures
 * are reporting too: an inventory in the low 40-thousands with multi-year
 * processing, which is the reason given for the pause.
 */
export const SUV_UNOFFICIAL = {
  replacementAnnounced: true,
  replacementName: 'a targeted pilot for immigrant entrepreneurs',
  officialDetailsPublished: false,
  /** Nothing below is on canada.ca. Render it attributed, or not at all. */
  reportedOnly: {
    annualCap: 2000,
    processingTargetMonths: 12,
    backlogCases: 43_200,
    attribution: 'immigration trade press, December 2025',
  },
} as const;
