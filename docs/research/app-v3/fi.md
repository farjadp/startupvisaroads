# Finland — notebook vs our data vs official (read 2026-10-27)

**Access limits.** migri.fi, intermin.fi and valtioneuvosto.fi answer both WebFetch and the browser with a Cloudflare "verify you are human" challenge. I did not try to get past it. So **no Migri figure could be verified**: the income requirement (1,030 / 1,090 / 1,210 and the family add-ons), every Migri fee except the start-up e-application, processing tables, and the student funds (800 / 9,600). They stay as they are in `europe.ts`, and the three routes stay `verified: false`. The law itself was read on Finlex (Ulkomaalaislaki 301/2004, Kansalaisuuslaki 359/2003, consolidated) and the reform in HE 216/2026 (Edilex copy; status on eduskunta.fi).

**Can any FI route switch to `verified: true`?** No. All three depend on Migri's money figure, which could not be opened. Someone has to read migri.fi in a normal browser (the challenge passes for a person) and confirm: income requirement table, family table (+360 or +310 per child from the third), fees 2026, student funds.

## Has the law changed? (notebook 84fd9670, "amendment, Aug 2026")

That notebook's single source is the Ministry of Economic Affairs and Employment's working-group report (TEM 2025:36), which contains **proposals**, not law. The official follow-up:

- **HE 216/2026 vp** ("Hallituksen esitys … ulkomaalaislain ja eräiden muiden lakien muuttamisesta") is in Parliament: status "Käsittelyssä", page last updated 7 Oct 2026. https://www.eduskunta.fi/valtiopaivaasiat/HE+216/2026
- What it proposes (https://www.edilex.fi/he/20260216): Business Finland's assessment becomes a **partial decision** made inside Migri's UMA system **after** the paid permit application (EUR 650 online), replacing the free, separate Eligibility Statement; growth-company criteria written into the Act; the extension conditions spelled out; for the **entrepreneur** permit, a first applicant whose business has not started in Finland would not need a registered company at application stage. **Proposed entry into force 12 Jan 2028.**
- **Verdict:** current rules (Eligibility Statement first, ≤ 4 months old) still apply. Our routes are right to describe today's process; add a `review` note and maybe a "reform pending" line on fi-startup and fi-self-employed.

## fi-startup

| Field | Ours | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Team | ≥ 2 founders, all moving | same | ≥ 2 founders "planning to move to Finland" | ours right | https://www.startupinfinland.com/applying |
| Ownership | ≥ 60% | — | "at least 60% holding" | ours right (matches 8f0226d) | same |
| Statement age | ≤ 4 months | — | ≤ 4 months before the application is filed (§ 80) | ours right | https://www.finlex.fi/fi/lainsaadanto/2004/301 |
| Permit type | review: "not published" | "always continuous (A)" | § 80: "jatkuva kasvuyrittäjän oleskelulupa" (continuous) | **resolved: continuous** | Finlex 301/2004 § 80 |
| First permit length | (not encoded) | 2 years | max 2 years | notebook right; add | startupinfinland |
| Extension | — | up to 4 years | § 80 b: same/similar business, profitable **or** still meets BF criteria; Migri may ask BF. Length not in the Act | notebook "4 years" unverified | Finlex § 80 b |
| Application fee online | 650 | — | HE 216/2026 cites the EUR 650 electronic fee | ours right | https://www.edilex.fi/he/20260216 |
| Paper fee | 800 | — | not readable (Migri) | unverified | — |
| Processing | ~2 weeks fast track; 2 months max | ~2 weeks | fast track decides within 2 weeks; statutory time 2 months (§ 84) | ours right | HE 216/2026 |
| Funds single | 1,030 / 1,090 / 1,210 net/month | same | Migri unreadable | unverified | — |
| Funds family | Helsinki +610 spouse, +610 1st child, +480, +360 | "~18,000/yr founder+spouse, ~22,000 with a child, ~26,000 with two (estimate)" | Migri unreadable | **conflict**: ours gives 21,840 / 29,160 a year for Helsinki; notebook is lower and admits its 4-person figure is a guess. Keep ours, flag. | — |
| 2-year permit if 24 months covered | yes | "very likely" | Migri unreadable | unverified | — |
| BF rejection rate | — | ~92% negative in 2024–25 | HE: 1,068 BF applications 2024, 746 in 2025, over 40% repeats; no rate given | notebook only, unverified | HE 216/2026 |
| Extension approval | — | 80–90% | site (8f0226d) now says ~80% 2024, ~65% 2025 from TEM 2025:36 | notebook wrong per TEM; I could not open TEM 2025:36 | — |
| PR | 6 y + 2 y work + B1, or 4 y with EUR 40k / recognised degree + 2 y work / C1 + 3 y work | — | § 56 a (law 1408/2025): exactly this (B1 = YKI level 3, C1 = YKI level 5) | ours right; entry date "8 Jan 2026" not read | Finlex § 56 a |
| Citizenship | (site) 8 y, 5 with language; test for applications from 1 Mar 2027 | 8 years | § 13: 8 years; § 18 a: 5 with language; 552/2026 adds the society-knowledge requirement and citizenship test **in force 1 Jan 2027** | ours right; the "filed from 1 Mar 2027" transitional rule was not found in the consolidated text, not contradicted | https://www.finlex.fi/fi/lainsaadanto/2003/359 |
| Dual citizenship | — | — | no renunciation condition in 359/2003 | allowed | Finlex 359/2003 |

**Commit 8f0226d reconciliation.** It changed four facts on the website: 60% holding (our route already says 60%), extension approval ~80% / ~65% (not in our route data; the notebook's "80–90%" is the old wrong figure — do not reuse it), citizenship test "applications filed on or after 1 March 2027" (Finlex shows the law in force 1 Jan 2027; consistent, transitional detail not read), 17 Dec 2025 financial-resources rule for citizenship (Finlex § 13 point 5 amended 24.10.2025/929, consistent). No conflict with `europe.ts`. `lib/fa/programmes.ts` 'finland': founders min 2 ✓, yearlyFunds 12,360 (Migri, unverified) — fine.

**Notebook has, we lack:** D visa sticker on fast track so you can fly before the card; post-decision monitoring (22% of start-up permits get a cancellation review, 71% of decided reviews end in cancellation, 93% at first-permit stage — TEM figures, not opened by me); applicants who claim social benefits soon after arrival undermine their funds claim; YEL insurance within 6 months (not verified); sanctions screening of Iranian and Russian applicants (HE/TEM context).

## fi-self-employed

| Field | Ours | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Agency | "ELY Centre" | ELY | § 79 / 79 a (27.6.2025/582): **elinvoimakeskus** makes the partial decision | **ours outdated → "elinvoimakeskus (formerly ELY Centre)"** | Finlex § 79 a |
| Conditions | registered company, works in it, profitable with 2-year forecast, funds | — | § 79 a: (1) registered company, (2) prerequisites for profitable business, (3) sufficient resources, (4) no serious neglect of taxes/payments; living covered by business income, or at the start by earned income, start-up funding or own funds; partial decision sets length and **temporary vs continuous** | ours broadly right; add (3), (4) and the temporary/continuous point. "Freelancers excluded" and "2-year forecast" not in the Act (Migri text, unverified) | Finlex § 79 a |
| Refusals | "most refusals on the ELY ground" | ">90% of extension refusals = ELY" | HE: **over 70% of first applications end negative, ~40% appealed** | add HE figure; ELY share unverified | HE 216/2026 |
| Extension refusal | — | ~30% since 2018 | not read | notebook only | — |
| Fees 750 / 900 | — | — | Migri unreadable | unverified | — |
| Processing | 1 month (2 max) | — | HE says statutory processing time for entrepreneur permits will shorten to one month (context unclear) | unverified | HE 216/2026 |
| Reform | — | — | first applicant may register company after the permit (proposed 12 Jan 2028) | add as pending | HE 216/2026 |

## fi-study

| Field | Ours | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Funds 800 / 9,600 + tuition | yes | — | Migri unreadable | unverified | — |
| Fees 600 / 750 | yes | — | Migri unreadable | unverified | — |
| PR via degree | Finnish master’s (or university bachelor’s) + A2, no residence period | — | § 56 c: university degree under Universities Act § 7, or UAS master’s; "developing" Finnish/Swedish = YKI level 2 **or 15 ECTS of Finnish/Swedish**; permit valid throughout the degree; refused if you lived abroad after graduating other than briefly | ours right; add the 15-credit option and the two conditions | Finlex § 56 c, 56 f |
| Student years toward § 56 | — | — | count only if the degree is completed | add | Finlex § 56 |

## Studio items

Notebook 3d61899e (Finland startup visa, 45 sources):
- video: *The Finnish Founder's Fork: Startup vs. Entrepreneur Permit* (5:29, cinematic)
- infographics: Finnish Business Residency Financial Requirements; Finland Business Permit 2026 Guide; راهنمای هزینه‌های کارآفرینی فنلاند ۲۰۲۶; نقشه راه ویزای استارتاپ فنلاند; راهنمای دریافت ویزای استارتاپ فنلاند; Finnish Startup Visa Process Guide; راهنمای ویزای استارتاپ فنلاند ۲۰۲۶; ویزای استارتاپ فنلاند: نقشه راه ۲۰۲۶; Finland Startup Permit 2026 Roadmap (×2); Finland Startup Permit 2026 Guide; راهنمای اقامت استارتاپ فنلاند
- slides: Finland Startup Visa Roadmap; Finland Startup Blueprint (×2); Nordic Startup Blueprint; The Finland Startup Blueprint; 2026 Finland Startup Blueprint; The Finnish Business Blueprint; Finland Startup Permit Playbook; The Finland Blueprint
- audio (not a MediaLead kind): چک‌لیست مالی و قانونی کارآفرینی در فنلاند (24:31); شروط سختگیرانه ویزای استارتاپ فنلاند (13:01)

Notebook 84fd9670 (reform, 1 source):
- slides: Finnish Business Residency Redesign; Finland Entrepreneurial Reform Blueprint
- infographics: نقشه راه اصلاحات اقامت کارآفرینی; معیارهای ویزای استارتاپ فنلاند; آمار و چالش‌های استارتاپ فنلاند; آمار تقاضاهای استارتاپی در فنلاند; اصلاحات اقامت کارآفرینی فنلاند ۲۰۲۵

Notebook eac50320 (Europe business visas): sources and Studio are Spain only; nothing on Finland.

**Caution for media:** the notebook infographics show the notebook's figures (e.g. 80–90% extension approval, ~18,000 family funds). Check each image against this report before it ships.

## Not verified (left out of `extras/fi.ts`)

Migri income requirement and family table, all Migri fees except EUR 650, student funds, Migri's document checklists, extension length, the 2-year-permit-with-24-months rule, BF rejection rate, TEM 2025:36 statistics, WIPO GII rank (wipo.int 403). The extras therefore carry **no living-cost fund lines for Finland**; documents say "check migri.fi" where the amount belongs.
