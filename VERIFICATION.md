# VERIFICATION.md — CRS Engine Accuracy Checklist

Every value or rule below was used in the CRS engine but **requires manual verification** against the official IRCC source before this tool can be considered production-ready.

> [!CAUTION]
> Do not remove items from this list without first confirming the value against the official IRCC source URL provided.

---

## How to verify

1. Open the source URL in the right column.
2. Find the specific table or rule mentioned.
3. If the value matches the config, mark it as ✅ and add the verification date.
4. If it differs, update `/config/crs-points.json` (or the relevant config file) and re-run tests with `npm test`.

---

## Items requiring verification

### `/config/crs-points.json`

| # | Item | Config value | Source URL | Status |
|---|------|-------------|------------|--------|
| 1 | Second official language per-ability points (CLB 5–9+) | See `secondOfficialLanguage` key | https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/criteria-comprehensive-ranking-system/grid.html | ⚠️ UNVERIFIED |
| 2 | Skill transferability: educationLanguage bracket values (13/25/25/50) | `skillTransferability.educationLanguage` | Same URL above | ⚠️ UNVERIFIED |
| 3 | Skill transferability: educationCanadianExperience bracket values | `skillTransferability.educationCanadianExperience` | Same URL above | ⚠️ UNVERIFIED |
| 4 | Skill transferability: foreignExpLanguage bracket values | `skillTransferability.foreignExpLanguage` | Same URL above | ⚠️ UNVERIFIED |
| 5 | Skill transferability: foreignExpCanadianExp bracket values | `skillTransferability.foreignExpCanadianExp` | Same URL above | ⚠️ UNVERIFIED |
| 6 | Skill transferability: certificateLanguage values (13/25) | `skillTransferability.certificateLanguage` | Same URL above | ⚠️ UNVERIFIED |
| 7 | French bonus tier 1: 25 pts (NCLC 7+, no English or English CLB ≤4) | `additionalPoints.frenchLanguage.tier1_noEnglishOrEnglishCLB4orBelow` | Same URL above | ⚠️ UNVERIFIED |
| 8 | French bonus tier 2: 50 pts (NCLC 7+, English CLB 5+ all abilities) | `additionalPoints.frenchLanguage.tier2_englishCLB5plusAllAbilities` | Same URL above | ⚠️ UNVERIFIED |
| 9 | French minimum NCLC threshold: 7 | `additionalPoints.frenchLanguage.minimumNCLC` | Same URL above | ⚠️ UNVERIFIED |
| 10 | Job offer = 0 pts effective March 25, 2025 | `additionalPoints.jobOffer.points = 0` | https://www.canada.ca/en/immigration-refugees-citizenship/news/notices/removal-job-offer-points-express-entry.html | ✅ CONFIRMED |
| 11 | PNP = +600 pts | `additionalPoints.provincialNomination.points = 600` | https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/criteria-comprehensive-ranking-system/grid.html | ✅ CONFIRMED |
| 12 | Canadian education: 1–2 year = +15 pts | `additionalPoints.canadianEducation.oneTwoYear = 15` | Same URL above | ⚠️ UNVERIFIED |
| 13 | Canadian education: 3+ years = +30 pts | `additionalPoints.canadianEducation.threeOrMoreYear = 30` | Same URL above | ⚠️ UNVERIFIED |
| 14 | Sibling in Canada = +15 pts | `additionalPoints.siblingInCanada.points = 15` | Same URL above | ⚠️ UNVERIFIED |

### `/config/categories.json`

| # | Item | Config value | Source URL | Status |
|---|------|-------------|------------|--------|
| 15 | Minimum qualifying work experience: 12 months | `eligibilityThreshold.minimumWorkExperienceMonths = 12` | https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/submit-profile/rounds-invitations/category-based-selection.html | ⚠️ UNVERIFIED |
| 16 | Lookback window: 3 years | `eligibilityThreshold.workExperienceLookbackYears = 3` | Same URL above | ⚠️ UNVERIFIED |
| 17 | French category draw recent cut-off (336, Jun 18 2025) | `generalDrawReference.recentCutoff` | https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/submit-profile/rounds-invitations.html | ⚠️ STALE — update with latest draw |
| 18 | Healthcare category cut-off (475, May 7 2025) | `categories[1].recentCutoff.score` | Same URL above | ⚠️ STALE — update with latest draw |
| 19 | STEM category cut-off (486, May 21 2025) | `categories[2].recentCutoff.score` | Same URL above | ⚠️ STALE — update with latest draw |
| 20 | Trades category cut-off (430, Apr 16 2025) | `categories[3].recentCutoff.score` | Same URL above | ⚠️ STALE — update with latest draw |
| 21 | Education category cut-off (479, Apr 2 2025) | `categories[4].recentCutoff.score` | Same URL above | ⚠️ STALE — update with latest draw |
| 22 | General draw cut-off (541, Jun 25 2025) | `generalDrawReference.recentCutoff` | Same URL above | ⚠️ STALE — update with latest draw |
| 23 | CEC draw cut-off (522, Jun 11 2025) | `cecDrawReference.recentCutoff` | Same URL above | ⚠️ STALE — update with latest draw |

### `/config/language-conversion.json`

| # | Item | Source URL | Status |
|---|------|------------|--------|
| 24 | IELTS General → CLB conversion table (all abilities) | https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/language-requirements/language-testing.html | ⚠️ UNVERIFIED |
| 25 | CELPIP General 1:1 CLB mapping | Same URL above | ⚠️ UNVERIFIED |
| 26 | TEF Canada → NCLC conversion table | Same URL above | ⚠️ UNVERIFIED |
| 27 | TCF Canada → NCLC conversion table | Same URL above | ⚠️ UNVERIFIED |

---

## Summary

- **Confirmed**: 2 items (#10, #11)
- **Unverified**: 23 items
- **Stale cut-offs**: 7 items (update regularly after every IRCC draw)

---

## High-priority items (verify these first)

The following items have the highest impact on CRS score accuracy:

1. **Skill transferability brackets** (#2–#6) — These are the second-largest source of points for most candidates (up to 100 pts). A wrong value here causes systematic errors.
2. **French bonus tiers** (#7–#9) — Many candidates' primary pathway. A wrong threshold or point value significantly impacts pathway recommendations.
3. **Second language per-ability points** (#1) — Affects all candidates who have taken a second language test.

---

## After verification

Once a value is confirmed, update its entry in this file to ✅ and note:
- Date verified: YYYY-MM-DD
- Person who verified: [name/role]

Update the `lastVerified` date in the affected config file accordingly.
