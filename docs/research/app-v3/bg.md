# Bulgaria (BG) — routes and site check, 9 Nov 2026

New country: `lib/routes-v2/bg.ts` (5 routes) and `lib/routes-v2/extras/bg.ts`. No Gemini notebook for Bulgaria, so `media` is empty everywhere. Leva are converted at BGN 1.95583 = EUR 1 (ECB). The evaluating body for the startup visa is the **Ministry of Innovation and Growth (MIG)**, Directorate "Economic Growth Instruments" — not BSMEPA.

## Official pages opened (2026-11-09)

| What | URL |
|---|---|
| MIG service 3263, Startup Visa certificate (30 days, free, 1 year, NIMS, attachments) | https://www.mig.government.bg/3263-issuance-of-a-sertificate-for-a-high-tech-and-or-innovative-project-startup-visa/?lang=en |
| MIG news: six criteria, 8 of 14, 2-year extension, "the certificate alone does not allow relocation", permit up to 1 year | https://www.mig.government.bg/upcoming-events/the-ministry-of-innovation-and-growth-will-issue-startup-visa-for-high-tech-and-innovative-projects/?lang=en |
| Ordinance (CoM Decree 318 of 7 Oct 2022), English | https://www.mig.government.bg/wp-content/uploads/2022/11/ordinance-on-the-terms-and-conditions-for-issuing.docx |
| MIG NIMS guidelines (qualified e-signature, .p7s, 12 months, budget 0.00, 13 attachments / 3 mandatory, procedure BG-177549112-2023-01) | https://www.mig.government.bg/wp-content/uploads/2022/11/guidelines-on-how-to-complete-the-online-application-form-2.docx |
| Foreigners Act, Bulgarian, consolidated to SG 79/2024 (MFA) — arts. 24(1)(2), 24(1)(20), 24c, 24p, 25(1)(5), 25(1)(16), 25(3), 33k | https://www.mfa.bg/upload/138160/Закон за чужденците в Република България.pdf |
| Foreigners Act, English text published by MIG (to SG 22/2022; Bulgarian part to SG 8/2023) | https://www.mig.government.bg/wp-content/uploads/2022/11/foreigners_in_the_republic_of_bulgaria_act.pdf |
| Employment Agency, EU Blue Card (1.5 × average gross salary, ≥6-month contract, 3-year degree or 5 years’ experience, 24 months–5 years, ≤3 months procedure) | https://www.az.government.bg/pages/visokokvalificirana-zaetost-sinia-karta/ |
| MFA, visa for Bulgaria (Schengen air/sea 31 Mar 2024, land 1 Jan 2025; where to apply) — read in the Browser pane | https://www.mfa.bg/en/services-travel/consular-services/travel-bulgaria/visa-bulgaria |
| MFA, long-stay visa type D sheet (housing, insurance, means ≥ minimum wage, criminal record, interview; file dated 2012) | https://www.mfa.bg/upload/716/VISA_TYPE_D.pdf |
| Bulgarian Citizenship Act, consolidated to SG 55/2026 (art. 12: 5 years after permanent/long-term permit, Bulgarian, release from current citizenship with exceptions) | https://iisda.government.bg/adm_services/service_regulatory_file/20082_213644 |
| ECB: euro since 1 Jan 2026, BGN 1.95583 | https://www.ecb.europa.eu/euro/changeover/bulgaria/html/index.en.html |
| Council of Ministers draft (strategy.bg): minimum wage BGN 1,213 = €620.20 from 1 Jan 2026 | https://www.strategy.bg/bg/public-consultations/11485/export |
| InvestBulgaria Agency: flat 10% corporate and personal income tax; 5% WHT on dividends to non-EU/EEA companies | https://investbg.government.bg/ |
| Indicators: UNDP HDR 2025 table, World Bank API (GDP/cap, unemployment, population), EF EPI 2025 | see `PROFILE_BG` |

**Could not open** (Cloudflare / bot checks, not bypassed): lex.bg, mon.bg (study admission, Ordinance 20/2022), minfin.bg, nra.bg (refused), mvr.bg not reached. WIPO GII 2026, World Happiness 2026, GPI and Henley figures for Bulgaria could not be read, so those indicators are left out.

## Per-route summary

### bg-startup-visa (startup) — verified
- Certificate from MIG: 6 criteria, max 14, pass 8 (Ord. art. 7(5)). 30-day review, 14 days to cure, decision notified within 7 days (arts. 7–9). Valid 1 year; +2 years on a progress report showing ≥50% of a Bulgarian company (art. 13). Free (art. 14). Applicant + 2 team members (art. 10). Changes reported within 7 days (art. 12); revocation grounds art. 15.
- Funds: three minimum wages for 30 consecutive days, mandatory attachment (Ord. art. 6(2)(10); NIMS guide). €620.20 × 3 = **€1,860.60** (2026). Scored test: `liquid ≥ €1,860.60`.
- Optional: BGN 100,000 = €51,129.19 of sales over 2 years (1 pt) or venture investment (1 pt).
- Residence: Foreigners Act art. 24p(1) — D visa + certificate + **after the D visa** ≥50% of a company in the certified field. MIG: the permit is up to 1 year; the certificate alone does not allow relocation.
- PR: art. 25(1)(5), 5 years lawful continuous residence, ≤30 months away. Citizenship: 5 more years (Citizenship Act art. 12) → ~10 years; dual citizenship restricted.
- Not found: D-visa fee and processing time; residence-permit fee.

### bg-trade-10-jobs (entrepreneur) — verified (statute only)
- Art. 24(1)(2): commercial activity with ≥10 full-time jobs for Bulgarian citizens kept for the stay, **per partner and per manager**. No amount. No scoreable criterion (no profile field for jobs), so the app shows it unscored.
- No Migration Directorate page with documents/fees/processing could be opened.

### bg-investor-pr (entrepreneur) — verified (statute only)
- Art. 25(1)(16): ≥BGN 500,000 (**€255,645.94**) into the capital of a company you own ≥50% of, new fixed assets of the same value, ≥10 jobs for Bulgarians, certified by MIG → **permanent** residence. Decision within two months (art. 25(3)). Scored test: `investment ≥ €255,645.94`.
- Related, not split out: art. 24(1)(20) BGN 250,000 (€127,822.97) + 5 jobs in a disadvantaged region (long-term residence); art. 25(1)(6)–(8) BGN 1–6 million investor options.

### bg-blue-card (talent) — **verified: false**
- Employment Agency: salary ≥ **1.5 × average gross salary** (last 12 months), contract ≥6 months, degree ≥3 years or 5 years’ comparable experience (3 of last 7 for some ICT roles), card 24 months–5 years, procedure ≤3 months (+15 days). Act art. 33k (SG 8/2023) confirms 24 months–5 years.
- Missing key figure: no euro salary floor on an official page (a third-party guide says ~€2,054/month; not used). Salary criterion left unscoreable.

### bg-study (study) — verified (Act only)
- Art. 24c: permit up to 1 year for full-time students; MES admission certificate; means ≥ minimum monthly wage per month (€620.20 → €7,442.40 for 12 months, scored); housing, insurance, criminal record, enrolment fee paid. Extensions decided within 14 days. Post-study permit up to 9 months (register with the Employment Agency within 7 working days). Student years count at half toward PR (art. 25(1)(5)).
- mon.bg blocked: admission procedure, tuition, D-visa certificate ordinance not read.

## Site check — visaroads.com/europe/bulgaria (en) and /fa/europe/bulgaria

Live pages (fetched 2026-11-09) match the repo files. Core startup-visa facts are **correct**: 6 criteria/14 points/pass 8, the point split, €1,860.60, 30/14/7 days, free, 1+2 years, applicant + 2, ≥50% after the D visa, 7-day change reporting, revocation grounds, qualified e-signature/.p7s/0.00/12 months, 13 attachments with 3 mandatory, legalised translations (art. 6(5)), expert-council composition (art. 4), definition of innovative (§1 item 6), PR after 5 years with ≤30 months away, euro since 1 Jan 2026, BGN 1.95583. The problems below are the exceptions.

Paths: EN = `app/[locale]/(public)/europe/bulgaria/BulgariaEn.tsx`, META = `.../bulgaria/meta.ts`, FA = `content/fa/europe-bulgaria.ts`.

| # | Claim on site | Where (file:line) | Official says | URL | Severity |
|---|---|---|---|---|---|
| 1 | The €620.20 minimum wage is sourced to a BTA news story | META:58-62; FA:24 (comment) | Figure is right (CoM draft BGN 1,213 = €620.20; adopted per BTA), but BTA is a news agency, not the decree. Cite the CoM decree / State Gazette (reported as Decree 243 of 13 Nov 2025, SG 98/2025 — not opened) | https://www.strategy.bg/bg/public-consultations/11485/export | Medium (sourcing rule) |
| 2 | "A draft decree proposes €660 from 1 Jan 2027 → €1,980" shown as a cost row | EN:208, EN:273; FA:93, FA:237 | Not found on any official page I could open; unverified. Keep only with an official link, or drop the figure | — | Medium |
| 3 | "Bulgaria's Foreigners Act has other routes for investors and ordinary business owners, with much higher financial conditions" | EN:325; FA:145 | The ordinary business route (art. 24(1)(2)) has **no money threshold**; its bar is 10 jobs for Bulgarian citizens per partner. Investor routes start at BGN 250,000 / 500,000 | Act (MFA consolidated) | Medium |
| 4 | Step 7 "Residence permit" carries the figure "1 + 2 — years: certificate, then extension" | EN:167-172 | The 1+2 years is the certificate. MIG says the residence permit itself is for up to 1 year; mixing them reads as a 3-year permit | MIG news page | Low |
| 5 | Hero: MIG "issues a certificate at 8, free and within 30 days" | EN:392 | 8 is the minimum for a positive proposal; the minister decides on the council's report, notified within 7 days after. Not automatic at 8 | Ordinance arts. 7–9 | Low |
| 6 | "One of the documents needed for a long-term residence permit" | EN:238, EN:437; FA:53, FA:209 | Art. 24p grants a "prolonged" (продължително) residence permit; "long-term" (дългосрочно) is the EU long-term resident status in Bulgarian law. The English Ordinance uses "long-term", so this is a translation trap rather than an error | Act art. 24p | Low |
| 7 | "A full Schengen member since January 2025" | EN:467; FA:213 | MFA: Schengen from 31 Mar 2024 (air/sea), internal land checks lifted 1 Jan 2025. Defensible; more precise wording advised | https://www.mfa.bg/en/services-travel/consular-services/travel-bulgaria/visa-bulgaria | Low |
| 8 | "Dividend tax is 5%, for every Bulgarian company" | EN:733, EN:754; FA:285 | Official page read: 5% WHT on dividends to **non-EU/EEA companies**; 10% flat CIT/PIT confirmed. 5% for individuals not read on an official page | https://investbg.government.bg/ | Low |
| 9 | "10%, among the lowest in the EU"; "EOOD/OOD with a token legal minimum capital" | EN:732-733, EN:750-753; FA:284-285 | 10% confirmed; "lowest in the EU" and minimum capital not checked on an official page (minfin.bg/Commercial Register blocked) | — | Low (unsupported) |
| 10 | "About six and a half million people" | EN:839; FA:298 | World Bank 2025: 6,433,302 (≈6.4 million) | https://api.worldbank.org/v2/country/BGR/indicator/SP.POP.TOTL?format=json | Low |
| 11 | Comparison: Spain 20 days + positive silence, 3-year permit, 10-year citizenship; Italy €50,000 for the team, 1-year permit; Estonia "an MVP is required"; Denmark quota | EN:227-233, EN:870-871; FA:315-319 | Not checked against official pages in this pass. "Estonia: MVP required" in particular should be re-checked on the Estonian Startup Committee criteria | — | Low (unverified) |
| 12 | Sanctioned-passport note: Iran not in the Apostille Convention; legalisation chain via MFA and embassy; bank and e-signature hurdles | EN:845-851; FA:302-310 | Not verifiable on the Bulgarian pages opened. Also an Iranian-applicant section edges toward the "applying from <country>" angle the guides avoid (nationality, not departure, but worth a look) | — | Low (unsupported / editorial) |
| 13 | D-visa documents "usually passport, criminal record, health insurance, accommodation, proof of means" | EN:154, EN:309; FA:129 | Supported by the MFA type D sheet, which adds: means of at least the minimum monthly wage for the period, apply in person at the mission where you permanently reside, interview required. Consider adding | https://www.mfa.bg/upload/716/VISA_TYPE_D.pdf | Low (omission) |
| 14 | Sources list cites the 2022 English Act PDF on mig.government.bg | META:44-47 | A newer official consolidation exists (MFA, to SG 79/2024); arts. 24p and 25(1)(5) are unchanged in it | Act (MFA consolidated) | Low |
| 15 | "The wage on your filing day is what counts" | EN:208, EN:273; FA:93 | The Ordinance says "at least three minimum wages" for 30 days before the application; the filing-day rule is our reading, not stated | Ordinance art. 6(2)(10) | Low |

Not on the site, worth adding: citizenship needs 5 more years after permanent residence and, for most nationalities, giving up the current citizenship (Citizenship Act art. 12); the art. 25(1)(16) investor route gives permanent residence directly.

## Indicators (PROFILE_BG)
HDI 55/193 (0.845, 2023 data); GDP per capita US$20,328 (2025); unemployment 3.5% (2025); EF EPI 2025 18/123; flat 10% income tax (InvestBulgaria). Not found: World Happiness 2026 rank (dashboard did not render Bulgaria), WIPO GII 2026 rank, GPI, Henley.
