# Ireland (IE) — app content v3 research

Checked 2026-10-27. New country: no existing route data, so the comparison is notebook vs official page. irishimmigration.ie pages render client-side; they were read in the built-in browser. The STEP Guidelines PDF was read locally (PDFKit).

Notebooks:
- `be4208ac-88f5-4407-8cc3-0f1219d3c475` (STEP, 2 sources: the ISD STEP page and STEP-Guidelines-Sep-2023.pdf). Accurate overall, because it rests on the official documents.
- `eac50320-adb5-4526-9f63-51987a7239b8` (Europe business visas): **no Ireland content at all**: it covers Spain (and a little Portugal/France). Nothing to compare.

## Routes written (`lib/routes-v2/ie.ts`)

| Key | Family | Status | Lead fact |
|---|---|---|---|
| `ie-step` | startup | open | EUR 50,000 is necessary, not sufficient: HPSU bar (10 jobs, EUR 1m sales in 3 years), no appeal; closed to RU/BY citizens |
| `ie-critical-skills` | talent | open | Stamp 4 after 2 years; EUR 40,904 (listed, degree) / EUR 68,911 (others) |
| `ie-study` | study | open | EUR 10,000 per year; Stamp 1G 12 months (level 8) or up to 24 (level 9+); Stamp 2 not reckonable |
| `ie-iip` | entrepreneur | closed | Closed at close of business 15 Feb 2023 |

## Conflicts: notebook vs official

| Field | Notebook | Official | Verdict | URL |
|---|---|---|---|---|
| How to apply | Email to startup@justice.ie | Page heading says "online application", but the step text says submit by email to startup@justice.ie; guidelines say email | Notebook right | https://www.irishimmigration.ie/coming-to-work-in-ireland/what-are-my-options-for-working-in-ireland/coming-to-work-for-more-than-90-days/start-up-entrepreneur-programme-step/ |
| Funds held | "Three consecutive months before applying" | Three full consecutive months; latest statement no more than one month old; or a bank letter covering the same | Notebook right, app adds the one-month rule | https://www.irishimmigration.ie/wp-content/uploads/2023/09/STEP-Guidelines-Sep-2023.pdf |
| Renewal | "2 years, renewable for 3" | 2 years, then 3, **then 5-year instalments**; long-term residence after 5 years | Notebook incomplete | same PDF |
| Language (IELTS) | No requirement | No language requirement in page or guidelines | Notebook right | same |
| Children over 18 | Not covered | Only minor (under-18) children | Notebook right | same PDF |
| Failure of the start-up | Reviewed; apply on another basis (new STEP, permit, green card) | Same | Notebook right | same PDF |
| Russian/Belarusian citizens | Not accepted | Same (Minister's instruction) | Notebook right; app uses `blockedCitizenships: RU, BY` | STEP page |
| Department name | "Department of Justice" | Department of Justice, Home Affairs and Migration | Updated | STEP page footer |

No figure conflicts found for STEP: the notebook's EUR 50,000 / 30,000 / 350 match the official documents.

## What the notebook lacks that the app now has

- STEP: quarterly committee rounds; HPSU definition in full (headquartered in Ireland, under 5 years old); private medical insurance; funds must move to an Irish business account before the permission issues; fee covers the whole family.
- Critical Skills Employment Permit (all of it): thresholds EUR 40,904 / 36,848 (recent graduates) / 68,911, 2-year offer, EUR 1,000 fee (90% refund), 12 weeks' notice, no labour market test, 9 months with first employer, Stamp 4 after 2 years, long-term residence after 60 months.
- Study: EUR 10,000 per year (EUR 833/month for 6–8 month stays) from 30 June 2025; 20/40 hours work; 7-year cap; Stamp 1G graduate programme; IRP fee EUR 300.
- IIP closure (15 Feb 2023) and that STEP continues.
- Citizenship: 5 years reckonable in the last 9 incl. the last 12 months; Stamp 1, 1G (graduate scheme) and 4 count, Stamp 2 does not; fee EUR 175 + up to EUR 950; dual citizenship allowed.

## Studio items

| Notebook | Title | Kind |
|---|---|---|
| be4208ac… (STEP) | بلوپرینت کارآفرینی ایرلند | slides |
| be4208ac… (STEP) | برنامه کارآفرین نوپا ایرلند (STEP) | infographic |
| eac50320… (Europe) | Spain Startup Visa Blueprint ×2, Spain Startup Visa Guide, four Spain infographics | slides / infographic, **Spain only, not used for IE** |

## Indicators (profile)

| Indicator | Value | Source |
|---|---|---|
| HDI | rank 11 of 193, 0.949 (2023 data, HDR 2025) | https://hdr.undp.org/data-center/human-development-index (Table 1 xlsx) |
| Happiness | rank 13 (dashboard year 2025) | https://data.worldhappiness.report/table |
| Global Peace Index 2026 | rank 5 of 163, 1.371 | https://www.visionofhumanity.org/wp-content/uploads/2026/06/Global-Peace-Index-2026-A3-map-poster.pdf |
| WIPO GII 2026 | rank 19 of 139 | https://www.wipo.int/gii-ranking/en/rank |
| GDP per capita 2025 | USD 131,592 | World Bank API NY.GDP.PCAP.CD |
| Unemployment 2025 | 4.63% | World Bank API SL.UEM.TOTL.ZS |

## Could not verify (left out)

- Effective date of the Critical Skills thresholds (enterprise.gov.ie page is undated); exact department name for permits (written as "Department of Enterprise").
- Which stamp STEP holders receive (guidelines do not name it).
- Long-stay D visa fee; STEP processing time beyond "quarterly".
- The ISD IIP FAQ (about 1,500 cases on hand) was not opened; only the closure announcement was.
- Henley passport rank and top tax rate: not included. EF EPI does not rank Ireland.
