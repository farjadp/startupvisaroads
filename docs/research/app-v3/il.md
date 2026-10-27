# Israel (IL) — notebook vs our data vs official pages

Checked 2026-10-27. Notebooks: `e2622cd0-7508-4e14-82e2-eebf9277c37d` (ویزای کارآفرینی اسرائیل, 53 sources, mostly law firms, agents and news) and `6081e2a5-deb1-4a37-9c7d-663e0e4cc9f9` (راهنمای جامع برنامه‌های اسرائیل, 10 sources, IIA pages plus one law firm and one YouTube video). Read only.

Official pages opened (browser pane; WebFetch gets 403 from innovationisrael.org.il and gov.il):

- IIA Innovation Visa: https://innovationisrael.org.il/en/programs/tech-innovation-visa/
- IIA procedure PDF (Hebrew, uploaded 2026/05, approved by the IIA council 6 Nov 2023): https://innovationisrael.org.il/wp-content/uploads/2026/05/נוהל-ויזת-יזם-זר-טכנולוגי.pdf
- IIA high-tech experts: https://innovationisrael.org.il/en/programs/visas-for-foreign-high-tech-experts-incentive-program/
- IIA Tnufa: https://innovationisrael.org.il/en/programs/ideation-tnufa-incentive-program/
- PIBA expert fee calculator (updated 14.04.2025): https://www.gov.il/he/service/working-permit-for-foreign-workers-calculator
- PIBA visa types: https://israel-entry.piba.gov.il/visa-option ; ETA-IL help: https://israel-entry.piba.gov.il/get-help
- PIBA student visa (updated 13.02.2024): https://www.gov.il/en/service/student_visa_application_type
- PIBA naturalisation (updated 01.01.2024): https://www.gov.il/en/service/request_for_citizenship_of_a_person_who_holds_pemanent_residency
- National Insurance average wage: https://www.btl.gov.il/English%20Homepage/Mediniyut/GeneralInformation/Pages/AverageWage.aspx

Could not open: PIBA pilot procedure 5.3.0029 (2016) and procedure 5.3.0041 (gov.il PDFs, 403 / blank viewer); the MFA tourist-visa table (https://www.gov.il/en/departments/dynamiccollectors/ashrotzarim) loads but returns "Result not found" for every country, including Canada.

## Iranian passport holders — what the official pages say

Nothing. None of the IIA pages, the IIA procedure, the PIBA pages above or the ETA-IL portal mentions Iran or "enemy state" nationals. The IIA procedure sets no nationality bar for the Innovation Visa; the decision rests with PIBA, whose procedure we could not read. The B/1 expert track requires citizenship of a country exempt from Israel's tourist visa (IIA), but we could not open the MFA table that lists those countries. **No `blockedCitizenships` should be set and no "Iranians can apply" claim made** until PIBA answers in writing. The extras carry a neutral reality on every IL route saying exactly this.

## il-innovation-visa

| Field | Ours | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Procedure date | "approved in 2024"; 2024 PIBA text not found | — | IIA procedure: approved by IIA council 6 Nov 2023; PDF uploaded 2026/05; IIA page still says "approved in 2024" | ours partly wrong → cite the IIA procedure PDF as the procedure in force | IIA procedure |
| Supporting framework | "accelerator or host" | 12 named landing pads (Trendlines etc.) | Israeli body working with early-stage tech companies under IIA benefit tracks (3, 4, 39, 8, 29, 49) or a private accelerator with ≥3 years' experience, with an agreement with the entrepreneur | notebook "12" unverified; ours incomplete → use the procedure definition | IIA procedure |
| Length | B/2 up to 2 years | "1 year, extendable to 24–27 months" (law firm) | up to two years | ours right | IIA page |
| Work permission | "not a work permit" (2016 pilot) | "may not receive salary from any Israeli company" | IIA page: procedure meant to facilitate "entry, stay, and work authorization"; benefit = "Stay Permit (B/2)" | unresolved; the 2016 text could not be re-read. Drop "not a work permit" or mark as from the 2016 pilot | IIA page |
| After 2 years | B/1, cap 63 months | B/1 up to 5 years | IIA expert page: up to 5 years | 63 months unverified (2016 procedure not re-read) → prefer "up to 5 years" (IIA) | IIA expert |
| Grant | none | notebook 1 says visa holders can take Tnufa alongside | "approval shall not entitle the applicant to any monetary grant" | ours right; notebook misleading (Tnufa is a separate programme) | IIA page |
| Experience | "background and experience" | "at least 2 years in the field" | no number of years | notebook only, unverified | IIA page |
| Documents | — | passport valid 18 months, police certificate, medical certificate, business plan | IIA: framework statement, framework declaration, living-costs declaration, R&D plan | notebook only, unverified | IIA page |
| Family | — | spouse and children under 18 on B/2 | not on pages read | notebook only, unverified | — |
| Processing / fees | not published | — | not published | ours right | — |

**Verified?** Can switch to `true` if the lead rewrites `pr` to the IIA wording (up to two years; next step B/1 up to 5 years) and drops "63 months" and "not a work permit". No money figures depend on unread pages.

## il-expert-b1

| Field | Ours | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Visa-exempt citizenship | weight 2, "fast track", unscoreable | condition | IIA lists it among the criteria "the expert must meet" | **ours wrong → make it weight 3, a condition, not a bonus**; scoreable once the visa-exempt list can be read | IIA expert |
| Salary | 2 × NIS 13,566 = NIS 27,132 (calculated) | 2 × average wage | PIBA: base gross salary for a regular position not less than twice "the average wage in the economy"; no amount. BTL lists NIS 13,566 (art. 1) and NIS 13,769 (art. 2 benefits / contributions) from 1 Jan 2026 | ours still calculated; which BTL figure PIBA uses is not stated (2 × 13,769 = 27,538). Keep `verified: false` | PIBA calc, BTL |
| Duration | 1 yr, yearly to 5 yrs; 2016 says 63 months | 1 yr, to 5 yrs | IIA: up to 1 year, extendable each year up to 5 years | ours right on 5 years; 63 months unverified | IIA expert |
| Processing | 6–10 business days | 6–10 | 6–10 business days | ours right | IIA expert |
| Spouse | — | spouse gets work visa | spouse gets a work visa | add | IIA expert |
| Fees | not encoded | — | application fee NIS 1,340 per expert; annual fee NIS 10,680 (full year; 1/200 per day under 6 months); B/1 licence NIS 195 a year; re-entry visa NIS 195 a year. Updated each 1 January; page dated 14.04.2025 | **add as fees** (employer pays the first two) | PIBA calc |
| Ukraine exception | — | 90 days, no salary floor | on IIA page (since 10 Apr 2022) | notebook right; not relevant to our users | IIA expert |

**Verified?** Stays `false` (salary amount is calculated; PIBA publishes no figure).

## il-student

| Field | Ours | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Fee | NIS 195 | — | NIS 195 | ours right | PIBA student |
| Validity | up to 1 year, yearly | — | up to a year, A/2 temporary stay permit | ours right | PIBA student |
| Institution | higher-education institution or yeshiva | — | PIBA visa types: institution recognised by the Council for Higher Education, Volcani Centre programme, China-Israel Institute BA | add "CHE-recognised" | PIBA visa types |
| Documents | admission, tuition, means, passport, birth certificate, grades | — | same plus a current photo | add photo | PIBA student |
| Where | — | — | in person at a PIBA office or Israeli mission; pay cash/card there; online only with an Israeli card | add | PIBA student |

**Verified?** Stays `true`.

## In the notebooks, missing from our data

- Tnufa: conditional grant up to NIS 200,000 over 12 months, 80% of budget, royalty repayment (IIA confirms; notebook says 80–85% and "100k a year over two years" — the 2-year split is notebook only).
- Startup Fund (Pre-Seed 60% up to NIS 1.5 M, Seed 50% up to NIS 5 M, Round A 30% up to NIS 15 M; DeepTech increases from 15 Jul 2026) — notebook only, not checked (Israeli companies; not a visa matter).
- Incubators programme: up to NIS 3.5 M, 85% grant, incubator takes up to 50% equity — notebook only, not checked.
- INNOFENSE defence accelerator (~NIS 200k, TRL 3–5) — notebook only; not suitable for the app.
- ETA-IL: NIS 25, valid up to 2 years, 90 days per visit (confirmed on the PIBA portal) — useful context, not a route.
- Naturalisation rules (3 of 5 years as permanent resident, Hebrew, give up other citizenship) — confirmed on gov.il; used in the timeline.

## Studio items

Notebook `e2622cd0…`:

| Title | Kind |
|---|---|
| Israel Innovation 2026 Strategic Architecture | slides |
| فراتر از انتظار: ۵ درس غافل‌گیرکننده از بازگشت قدرتمند تکنولوژی اسرائیل در سال ۲۰۲۶ | report (blog post) |
| چشم‌انداز نوآوری اسرائیل ۲۰۲۶ | infographic |
| گزارش راهبردی وضعیت نوآوری و فناوری‌های پیشرفته اسرائیل در سال ۲۰۲۶ | report (briefing doc) |
| Are You the Right Founder for Israel's Innovation Visa? (5:19, cinematic) | video |
| Israel Startup Funding Blueprint | slides |
| The Israel Innovation Blueprint | slides |
| اینفوگرافیک پیشران‌های اقتصاد دانش‌بنیان | infographic |

Notebook `6081e2a5…`:

| Title | Kind |
|---|---|
| Israel Innovation Blueprint | slides |
| راهنمای جامع ویزای نوآوری اسرائیل | infographic |

Media leads in `extras/il.ts`: all video/infographic/slides on il-innovation-visa; the two `6081e2a5…` items also on il-expert-b1. The Studio items were not opened, so their figures are unchecked.
