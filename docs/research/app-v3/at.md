# Austria (AT) — notebook vs official, 27 Oct 2026

New country: no existing route data, so "ours" = the new `lib/routes-v2/at.ts`. Notebooks read: `ae2c4048` (Austria residence and citizenship through a startup, 10 sources, mostly migration.gv.at + third-party sites) and `eac50320` (Europe business visas — it covers Spain, Portugal and France only; nothing on Austria).

Official pages opened (all 2026-10-27):
- Start-up founders: https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/start-up-founders/
- Self-employed key workers: https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/self-employed-key-workers/
- Very highly qualified workers: https://www.migration.gv.at/en/types-of-immigration/permanent-immigration/very-highly-qualified-workers/
- Temporary residence (students): https://www.migration.gv.at/en/types-of-immigration/temporary-residence/
- Daueraufenthalt – EU (updated 07.08.2026): https://www.oesterreich.gv.at/de/themen/menschen_aus_anderen_staaten/aufenthalt/3/2/Seite.120402
- Integration agreement: https://www.migration.gv.at/en/living-and-working-in-austria/integration-and-citizenship/integration-agreement/
- Citizenship: https://www.migration.gv.at/en/living-and-working-in-austria/integration-and-citizenship/citizenship/
- Early naturalisation after six years (updated 29.01.2026): https://www.oesterreich.gv.at/de/themen/menschen_aus_anderen_staaten/staatsbuergerschaft/1/Vorzeitige-Verleihung-nach-sechs-Jahren

## at-startup — conflicts

| Field | Ours (at.ts) | Notebook | Official | Verdict | URL |
|---|---|---|---|---|---|
| Points bar | 50 of 85 | 50 of 85 | 50, max 85 | match | start-up founders |
| Capital / equity | €30,000, ≥50% | €30,000, ≥50% | €30,000, ≥50% | match | start-up founders |
| Fee | €218 | €218 | €218 | match | start-up founders |
| AMS opinion | 3 weeks | 3 weeks | within three weeks | match | start-up founders |
| Team size | none set; 50% per applicant limits it | "max 2 founders" | not stated | notebook only (an inference, stated as a reality, not a rule) | start-up founders |
| Citizenship | 10 years, 6 with B2 or integration | 10 years, 6 with "successful integration" | 10 years (5 with a permit); 6 with B2 German or sustained integration | match | citizenship pages |
| Dual citizenship | not allowed (in principle) | not accepted | "principally loss of previous citizenship" | match | citizenship |
| Family | not modelled | spouse and dependent children with housing and income | not on the start-up page | notebook only, unverified | — |

No real conflict: this notebook rests mainly on the official page.

## Other Austrian routes

`at-self-employed`, `at-very-highly-qualified` and `at-study` are not in the notebook. Points to re-check:
- Students: migration.gv.at shows €777.58 (under 24) / €1,308.39 (24+) a month **without a year**; its linked brochure is named 2025; secondary sites give €722.58 for under-24 in 2026. €1,308.39 matches the 2026 single-person reference. Route set `verified: false`. Student fee not on the page.
- Very highly qualified: page gives no processing time and no figure for the job-seeker visa's "adequate means".

## What the notebook adds that our data lacks
- Suggested business-plan focus: innovation, the founder's control of management, macroeconomic benefit (job creation, capital transfer). Consistent with the official page; used in steps.
- Gründerservice (Austrian Federal Economic Chamber) as the place for business-plan help — linked in a step.

## Studio items (notebook ae2c4048)
| Title | Kind |
|---|---|
| Austrian Startup Founder Guide | slides |
| Austria Startup Visa Blueprint | slides |
| راهنمای دریافت کارت اقامت اتریش | infographic |
| راهنمای ویزای استارتاپ اتریش | infographic |

Notebook eac50320 Studio items are all Spain (3 slide decks, 4 infographics): none for AT/NO/SE.

## Country indicators
HDI 22/193 (0.930, 2023 data, UNDP); World Happiness 2026 rank 19; GPI 2026 rank 6/163; GDP per capita US$62,930 (2025, World Bank); unemployment 5.6% (2025); WIPO GII 2026 rank 18/139; EF EPI 2025 rank 3/123. Not included: Henley passport and OECD tax (not opened).
