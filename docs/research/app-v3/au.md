# Australia (AU) — app content v3 research

Checked 2026-10-27. New country: no existing route data, so the comparison is notebook vs official page. immi.homeaffairs.gov.au returns 403 to WebFetch; every Home Affairs page below was read in the built-in browser.

Notebook: `9bb09871-6ea0-4803-894f-7eed5e5a9e34` (Australia National Innovation Visa, 9 sources, mostly YouTube and migration-agent pages, plus the Home Affairs 858 page). It covers the NIV only; nothing on 189/190, 500 or BIIP beyond one line on the old 188 investment amounts.

## Routes written (`lib/routes-v2/au.ts`)

| Key | Family | Status | Lead fact |
|---|---|---|---|
| `au-niv` | startup | open | Invitation-only PR; Apr–Jun 2026: 2,166 EOIs, 248 invitations |
| `au-biip` | entrepreneur | closed | BIIP closed 31 July 2024 |
| `au-skilled-189` | express | open | 65 is the floor; 4 June 2026 round cut-offs 65–95 by occupation |
| `au-skilled-190` | express | open | State nomination triggers the invitation; no occupation ceilings |
| `au-student` | study | open | From 2 Oct 2026 most students cannot bring family; AUD 29,710 living costs |

Global Talent (858) was replaced by the NIV in December 2024, so no separate route. Global Talent Employer Sponsored (GTES) still appears on the Home Affairs menu but is an employer agreement, not an individual route.

## Conflicts: notebook vs official

| Field | Notebook | Official | Verdict | URL |
|---|---|---|---|---|
| Ministerial Direction for NIV priorities | No. 112 | No. 120 | Notebook out of date → use 120 | https://immi.homeaffairs.gov.au/visas/working-in-australia/visas-for-innovation/national-innovation-visa/priorities |
| Accelerator letter | Not required, only "helpful" | Not listed as a requirement; links to government innovation hubs are listed as evidence, mainly alongside a government nomination | Notebook right, refined | same |
| Who needs Form 1000 and when | At visa application, not at EOI | Same: attach at application, otherwise not processed | Notebook right | https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/national-innovation-visa-858 |
| Age | "No absolute limit; under 18 or over 55 need exceptional benefit" | Any age; under 18 or **55 and over** must show exceptional benefit | Notebook slightly wrong (55 is included) | same |
| Team application | Not possible; each founder applies separately | Page describes an individual applicant with family unit; no team route | Notebook right | same |
| Invitation chances | "Priority 2 raises the chance significantly" | Priority 2 is second in order, but only <20 of 248 invitations (Apr–Jun 2026) were priority 2; 192 were priority 3 | Notebook overstated; app uses the round figures | https://immi.homeaffairs.gov.au/visas/working-in-australia/visas-for-innovation/national-innovation-visa/current-invitation-round |
| Old 188 investment | AUD 1.25–5 million | BIIP closed 31 July 2024 (Significant Investor stream was AUD 5 million) | Historical only, not used | https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/business-innovation-and-investment-188 |
| Queensland entrepreneur pathway | Named, no figures | Not checked (state site) | Notebook only, unverified | — |
| Fee | Not given | AUD 6,235 main applicant; second instalment AUD 4,890 | Official used | 858 page |

## What the notebook lacks that the app now has

- NIV fee (AUD 6,235) and second instalment (AUD 4,890).
- Real invitation numbers by priority and sector (Apr–Jun 2026).
- The 5-year travel facility and the Resident Return visa after it.
- 189/190: age under 45 at invitation, competent English, 65-point floor, 4 June 2026 cut-offs, Direction 122 processing queues, fees AUD 6,135 (189) and AUD 6,140 (190).
- Student 500: 2 Oct 2026 family rule, AUD 29,710 / 10,394 / 4,449 / 13,502 schooling, AUD 2,500 fee, 48 h per fortnight.
- Citizenship: 4 years lawful residence, last 12 months as PR, absences ≤12 months (≤90 days in the last year), test 75% plus all 5 values questions; dual citizenship since 2002.

## Studio items (notebook 9bb09871…)

| Title | Kind |
|---|---|
| The Founder's Guide to the National Innovation Visa (Subclass 858) | video (6:30, Cinematic) |
| Australian NIV Strategic Blueprint | slides |
| Australia National Innovation Visa Blueprint | slides |
| ویزای نوآوری ملی استرالیا ۲۰۲۶ | infographic |
| راهنمای ویزای نوآوری ملی استرالیا | infographic |

## Indicators (profile)

| Indicator | Value | Source |
|---|---|---|
| HDI | rank 7 of 193, 0.958 (2023 data, HDR 2025) | https://hdr.undp.org/data-center/human-development-index (Table 1 xlsx) |
| Happiness | rank 15 (dashboard year 2025) | https://data.worldhappiness.report/table |
| Global Peace Index 2026 | rank 20 of 163, 1.602 | https://www.visionofhumanity.org/wp-content/uploads/2026/06/Global-Peace-Index-2026-A3-map-poster.pdf |
| WIPO GII 2026 | rank 20 of 139 | https://www.wipo.int/gii-ranking/en/rank |
| GDP per capita 2025 | USD 65,130 | World Bank API NY.GDP.PCAP.CD |
| Unemployment 2025 | 4.09% | World Bank API SL.UEM.TOTL.ZS |

## Could not verify (left out)

- NIV, 189, 190, 500 processing times: Home Affairs only offers an interactive tool.
- Family-member visa charges: only in the Visa Pricing Estimator.
- The points table (calculator is interactive), so no experience/education criterion is scored for 189/190; the state-nomination points bonus.
- CLB 7 ≈ "competent English" is our mapping, not a Home Affairs statement.
- Student 500 exemption categories under the 2 Oct 2026 rule; English test requirement.
- Henley passport rank and top tax rate: pages not readable, not included. EF EPI does not rank Australia.
