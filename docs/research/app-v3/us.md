# United States: notebook vs our data vs official pages (2026-10-27)

Notebook: `4a145981-e27d-4313-b504-5c64700236c2`, "قانون کارآفرینی بین‌المللی: راهنمای جامع…" (7 sources: 6 YouTube videos and 1 markdown summary of USCIS guidance). It covers the International Entrepreneur Rule only. No notebook covers NIW, EB-1A, EB-2, O-1 or F-1; those were checked against official pages only.

Blocked: travel.state.gov (Visa Bulletin, DS-160, visa fee and dual-nationality pages) sits behind a Cloudflare bot challenge, both in WebFetch and in the browser. I did not try to get past it. federalregister.gov and ecfr.gov HTML pages redirect to an "unblock" page, but the govinfo and federalregister full-text copies and the eCFR versioner API opened. Visa fees came from 22 CFR 22.1 on eCFR (current to 2026-10-23) instead.

## Verification status: what can switch to `verified: true`

| Route | Now | Recommendation |
|---|---|---|
| us-eb2-niw | false | **Switch to true if the Visa Bulletin date is removed** from `processing` (and from `review`). Every other key figure is now official: degree test and three prongs (USCIS EB-2 page), NIW premium = 45 business days (USCIS premium page, updated 03/23/2026), fees (G-1055 edition 10/16/26: I-140 715/665, Asylum Program Fee 300 self-petitioner, I-907 2,965, I-485 1,440/1,390). |
| us-eb1a | false | **Switch to true** after removing the "EB-1 ROW current or near current" phrase. Criteria, 15 business days premium and fees are official. |
| us-eb2-advanced-degree | false | **Switch to true** after removing the Visa Bulletin date. PERM times are now official (flag.dol.gov, as of 10/05/2026): add them. |
| us-international-entrepreneur-rule | false | **Switch to true.** All thresholds, the 400% poverty-line condition, the 5-year company age and the parole fee are now read on USCIS and 8 CFR 212.19. Processing time is genuinely not published. |
| us-o1a, us-f1 | true | Stay true; one F-1 correction below. |

The Visa Bulletin dates (EB-2 ROW final action 1 Jan 2025, EB-1 India/China) remain unverified: the only official copy is on travel.state.gov.

## Proclamation 10998: read from the text (govinfo FR Doc 2025-23570, 90 FR 59717)

- Sec. 2: Iran stays under the **full** suspension of entry, for immigrants and non-immigrants.
- Sec. 6(a): it applies only to nationals who were **outside the US on the effective date and had no valid visa** on that date.
- Sec. 6(b) exceptions: green-card holders; dual nationals travelling on a passport of a non-listed country; A-1, A-2, C-2, C-3, G-1 to G-4, NATO-1 to 6 visas; athletes, coaches and immediate relatives for the World Cup, Olympics or other major events; US-government-employee SIVs; **immigrant visas for ethnic and religious minorities facing persecution in Iran**. Case-by-case national-interest exceptions by the AG (6(d)) or DHS (6(e)).
- Sec. 10: effective 12:01 a.m. EST, 1 January 2026. Sec. 7: review every 180 days.
- Inside the US: the USCIS hold memos (PM-602-0192, PM-602-0194) were vacated (D.R.I., 5 June 2026) and enjoined with a certified class (N.D. Cal., 24 Aug 2026). USCIS alert of 28 Aug 2026 says it adjudicates "in the normal course" pending further review.

Our `US_TRAVEL_BAN` note says "immigrant and non-immigrant visas are suspended for Iranian nationals; narrow exceptions only (e.g. dual nationals on a non-listed passport)". Verdict: **right in substance, imprecise**. The proclamation suspends *entry*, and only for people outside the US without a valid visa on 1 Jan 2026. Suggested wording: "From 1 Jan 2026 entry of Iranian nationals as immigrants and non-immigrants is fully suspended for those who were outside the US without a valid visa on that date. Exceptions include green-card holders, dual nationals on a non-listed passport, and immigrant visas for persecuted religious and ethnic minorities from Iran." Keep `blockedCitizenships: ['IR']` (the app cannot see where the user is). For the IER route the proclamation's wording is about entry "as immigrants and nonimmigrants"; parole is neither, so whether it bars IER parole is not stated in the text. CBP and USCIS may still refuse parole in discretion; keep the block but word it as "entry restrictions apply" rather than "visa suspended".

## Conflicts per route

### us-international-entrepreneur-rule (notebook + official)

| Field | Ours | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Re-parole criteria | investment/grants 622,142, or revenue ≥622,142 with 20% growth, or ≥5 jobs | E-2 comparison says "for renewal the startup must have created 5 full-time jobs" | Any one of: 622,142 USD investment/grants, 5 qualified jobs, or 622,142 USD revenue with 20% average growth | Ours right; notebook wrong | https://www.uscis.gov/working-in-the-united-states/international-entrepreneur-rule |
| Household income >400% FPL | criterion, marked "verify" | — | 8 CFR 212.19(i): condition of parole, "greater than 400 percent of the federal poverty line" | Ours right, now verified; drop the "[verify]" note | https://www.ecfr.gov/current/title-8/chapter-I/subchapter-B/part-212/section-212.19 |
| Company age 5 years | from regulation | 5 years | 8 CFR 212.19(a)(2) and USCIS page both say formed within 5 years before filing | Ours right; now on the USCIS page too | same |
| I-941 fee | 1,200 + parole fee "if approved" (amount not listed; review says G-1055 showed 1,020 online) | — | G-1055 ed. 10/16/26: I-941 1,200; Immigration Parole Fee "Online: $1,050, if USCIS notifies you of conditional approval" (FY 2027 amount, effective 16 Oct 2026) | Ours incomplete → add parole fee 1,050 | https://www.uscis.gov/g-1055 |
| Qualified investor | not described | must be US-based, majority owned by US citizens/LPRs, track record of 746,571 in 5 years, 2 startups with 5 jobs or 622,142 revenue | Same (8 CFR 212.19(a)(5), USCIS page) | Notebook right; we lack it (added in extras) | both above |
| Own money counts? | "not personal funds" | no: founders, family and their entities excluded | Same (212.19 definitions) | Agree | 212.19 |
| Adjustment of status | pr: "None: parole is not a status" | cannot adjust inside the US; must leave and use a consulate | USCIS: "parole is not admission", generally ineligible to adjust or change status in the US | Agree; consider adding the consular-exit fact to `pr` | IER page |
| Spouse/children | not in route | spouse I-765 after parole; children may not work; all give biometrics | Same; spouse I-765 (c)(34) 520 paper + 570 H.R. 1 fee | Notebook right; added in extras | IER page, G-1055 |
| Investor revenue figure | — | 622,142 | Page body says 622,142, but the page's own FAQ still says 528,293 | Use 622,142 (rule figure); USCIS page inconsistent | IER page |
| EB-5 minimum "800,000" | — | 800,000 | USCIS EB-5 page (last updated 03/01/2023) is stale and does not state current amounts | Notebook only, unverified; not used | https://www.uscis.gov/working-in-the-united-states/permanent-workers/eb-5-immigrant-investor-program |
| E-2: "minimum ~50,000", "~3 jobs for renewal", "India and China not treaty countries" | — | as stated | not checked (E-2 is not one of our routes) | Notebook only, unverified | — |

Notebook also says the government "accelerated processing" of IER: no official statement found; USCIS publishes no IER processing time.

### us-eb2-niw

| Field | Ours | Official | Verdict | URL |
|---|---|---|---|---|
| Premium clock | 45 business days | 45 business days (E21 NIW) | Right | https://www.uscis.gov/forms/all-forms/how-do-i-request-premium-processing |
| Fees | I-140 715/665, APF 300, I-907 2,965, I-485 1,440/1,390 | Same in G-1055 ed. 10/16/26 (the 16 Oct change touched I-131, I-589, I-765, I-821, I-941 only) | Right; the "re-read G-1055 after 16 Oct" review note can be closed | https://www.uscis.gov/g-1055 |
| Visa Bulletin EB-2 ROW FAD 1 Jan 2025 | "unverified" | travel.state.gov blocked | Unverified; remove the figure or keep it flagged | — |
| Forms | — | USCIS EB-2 page lists ETA-9089 Appendix A for NIW | Missing in ours; added to documents | https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-second-preference-eb-2 |
| Consular costs | not listed | DOS immigrant visa fee (employment) 345 per person; USCIS Immigrant Fee 235 | Missing; added to funds | eCFR 22 CFR 22.1; G-1055 |

### us-eb1a

| Field | Ours | Official | Verdict | URL |
|---|---|---|---|---|
| Criteria | 10, at least 3, or one-time award | Same; comparable evidence allowed | Right | https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-first-preference-eb-1 |
| Premium | 15 business days | 15 (E11) | Right | premium page |
| "EB-1 ROW current or near" | unverified | blocked | Unverified; remove | — |

### us-eb2-advanced-degree

| Field | Ours | Official | Verdict | URL |
|---|---|---|---|---|
| PERM times | "not captured" | Analyst review: priority dates of Jan 2026 being processed; average 336 days (Aug 2026); audit Dec 2025; PWD queue at June 2026 receipts (as of 10/05 and 9/30/2026) | Ours missing → add | https://flag.dol.gov/processingtimes |
| Who pays PERM | review: "worker may not pay PERM costs" | 20 CFR 656.12(b): employer may not seek or receive payment for labor certification, including its attorney fees; the worker **may** pay their own costs and attorney | Ours imprecise → reword | https://www.ecfr.gov/current/title-20/chapter-V/part-656/subpart-A/section-656.12 |
| Fees | I-140 715, APF 600 regular, I-907, I-485 | Same | Right | G-1055 |

### us-o1a

| Field | Ours | Official | Verdict | URL |
|---|---|---|---|---|
| DOS visa fee | "not captured" | 205 USD for H, L, O, P, Q, R (22 CFR 22.1 item 21(b)) | Ours missing → add 205 | eCFR 22 CFR 22.1 |
| I-129 O | 1,055 / 1,005 / 530 | Same | Right | G-1055 |

### us-f1

| Field | Ours | Official | Verdict | URL |
|---|---|---|---|---|
| Fixed admission period | review: "confirm the Federal Register effective date" | Final rule FR Doc 2026-14439 (17 Jul 2026), **effective 15 Sep 2026** (major rule; DHS will publish if Congress changes it). Admission up to programme length, not over 4 years; longer needs an extension of stay | Confirmed → can be stated | https://www.federalregister.gov/documents/2026/07/17/2026-14439/establishing-a-fixed-time-period-of-admission-and-an-extension-of-stay-procedure-for-nonimmigrant |
| MRV fee | "185, could not be read" | 185 USD (22 CFR 22.1 item 21(a)) | Confirmed → add | eCFR |
| Visa Integrity Fee 250 (H.R. 1) | not listed | not found on an official page I could open | Unverified, still not listed | — |
| OPT | 12 + 24 STEM | Same (USCIS OPT page, updated 11/25/2024); apply 90 days before to 60 days after | Right | https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students |
| **New:** OPT fee proposal | — | NPRM 2026-20660 (8 Oct 2026): 70,000 USD initial OPT, 30,000 USD each later OPT; comments close 9 Nov 2026 | Proposal only; added as a reality, should go into the route `review` | https://www.federalregister.gov/documents/2026/10/08/2026-20660/optional-practical-training-fees |
| SEVIS | 350 | 350 | Right | https://www.ice.gov/sevis/i901 |

### Country-level

| Field | Official | URL |
|---|---|---|
| Naturalization | 5 years LPR, 30 months physical presence, 3 months in the state, basic English + civics | https://www.uscis.gov/citizenship/learn-about-citizenship/citizenship-and-naturalization/i-am-a-lawful-permanent-resident-of-5-years |
| Dual citizenship | Dual citizens "do not have to choose"; keeping the other nationality depends on that country | https://www.usa.gov/dual-citizenship (updated 17 Mar 2026) |

## What the notebook covers that our data lacked

Spouse work permit and children's no-work rule; biometrics for all family members; the qualified-investor definition (US ownership, 746,571 track record, 2 portfolio startups with 5 jobs or 622,142 revenue); the definition of a qualified job; partial funding plus alternative evidence (I-941 questions 10 and 14 both "Yes": not checked on the form itself); the three-founder cap with one shared investment; parole is not admission, so consular exit for a later green card. All added to `lib/routes-v2/extras/us.ts` from the official text.

## Studio items (notebook 4a145981)

| Title | Kind |
|---|---|
| IER Strategic Roadmap (7 sources) | slides |
| FY2025 IER Strategic Blueprint (1 source) | slides |
| راهنمای قانون کارآفرینی بین‌المللی IER (7 sources) | infographic |
| راهنمای قانون کارآفرینی بین‌المللی IER (1 source) | infographic |

No video, mind map, quiz or flashcards. The "FY2025" deck likely predates the FY 2027 fee change; check its figures before export.

## Not verified

- Visa Bulletin dates for EB-1 and EB-2 (travel.state.gov blocked by a bot challenge).
- H.R. 1 Visa Integrity Fee (250 USD).
- USCIS normal (non-premium) processing times.
- I-131 parole filing fee for IER family members (the G-1055 table layout did not let me tie the amount to the category with confidence; not encoded).
- EB-5 investment amounts (USCIS page stale).
- EF EPI: the United States is not ranked (native English), so no English indicator.
