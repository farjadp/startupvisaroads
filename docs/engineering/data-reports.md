# Data reports

Statistical articles built from public datasets. First series: the RCIP job
market (designated-employer lists of the 14 Rural Community Immigration Pilot
communities against Job Bank open data), monthly from the October 2026 file.

## What is in the repo

| Path | What |
|---|---|
| `lib/data-reports/index.ts` | The section: tag, edition parsing, queries, JSON-LD |
| `lib/data-reports/charts.ts` | Inline-SVG charts used inside the article HTML |
| `app/[locale]/(public)/data-reports/page.tsx` | Public index, en + fa |
| `content/data-reports/<YYYY-MM>/stats.json` | Every figure a month's reports print |
| `content/data-reports/jobbank_report_stats.py` | Snapshot of the script that wrote `stats.json` |
| `content/agent-articles/2026-11-rcip-jobbank/` | The six article sources, build, payloads, review page |

A data report is an ordinary `Article`. It is published with
`POST /api/agent-articles` like any hand-written article and read at
`/<locale>/blog/<slug>`. Two things make it a data report:

- the tag `data-report` (the index lists published articles carrying it);
- a slug that carries the month of the data, e.g.
  `rcip-job-market-october-2026-communities` (the index groups by it).

No schema change, no case type, and no dependency on the Case Studies
switches. The index is `noindex` and absent from the sitemap for a locale
until that locale has one published report. `/fa/data-reports` is allowed
through the Persian redirect layer in `lib/fa/redirects.ts`.

## Where the data lives

The raw data is not in this repo. It is in Farjad's data project
(`Work-Studio/webscraper`):

- `jobbank_raw/<month>.csv`: the national Job Bank open-data file (UTF-16,
  tab-separated). Source: <https://open.canada.ca/data/en/dataset/ea639e28-c0fc-48bf-b5dd-b8899bd43072>,
  Open Government Licence – Canada.
- `rcip_all_classified.csv`: one row per designated-employer listing on the 14
  community lists, with `source_url` and `list_as_of`. It holds employer names
  and contacts and must never be copied here.
- `jobbank_build.py`: matches postings to the 14 communities by province and
  town name, writes `jobbank_data.json`.
- `jobbank_report_stats.py`: cleans, aggregates and writes the stats file.

Only `stats.json` crosses into this repo. It contains aggregates: no employer
name, contact or address.

## Method (`jobbank_report_stats.py`)

1. **National template postings.** An external-board posting is a template when
   its signature (job title, salary unit, salary minimum, salary maximum) has a
   fixed salary (minimum = maximum) and appears in the national file in at
   least 3 provinces or territories and 20 towns. A local wage does not repeat
   to the cent across provinces; a remote job advertised town by town does.
   Each signature the rule catches is written to `templates.signatures` with
   its national spread and the commonest original ad titles, and needs a
   written decision in `REVIEWED`. Templates are counted on their own line and
   excluded from every ranking, share and median.
   October 2026: 147 postings. 120 "inside sales representative" at one annual
   salary in 744 towns (original titles begin "Remote Inside Sales"); 27
   "informatics consultant" / "retail sales representative" at three fixed
   salaries (original title "Work From Home Sales Consultant").
2. **Repeats that stay.** The same title and wage in four or more communities,
   not caught by the rule, is listed in `kept_after_review` and needs a reason
   in `KEPT`. October 2026: a seasonal call-centre posting (one province),
   cashiers at an entry wage on eight dates, and a retail chain posting
   directly on Job Bank.
3. **Industry.** Both sides are mapped to NAICS sectors. Job Bank labels mix
   sectors and sub-sectors (`JOBBANK_LABEL_TO_SECTOR`: 811-814 into 81, 561,
   562 and 5613 into 56). The employer side uses the first two digits of the
   listing's NAICS code. An unmapped label raises a warning.
4. **Wages.** Each posting's salary minimum in dollars per hour (from
   `jobbank_build.py`). Every median is stored with its `wage_n`;
   `small_sample` is true under 20 wages. Reports print n beside each median
   and mark small samples.
5. **Listings.** `listings.total` counts rows. `unique_employer_names` counts
   distinct normalised names per community. Reports say "designated-employer
   listings".
6. **Seasonal work.** NOC 85101 (harvesting labourers) is flagged seasonal and
   reported with and without.
7. **Occupation groups.** Food service: eight unit groups; trades and
   transport: NOC broad category 7; health and social: broad category 3 plus
   six social and care unit groups. The lists are in `meta.method.clusters`.

`meta.warnings` must be empty before a month is published.

## The article build

`node content/agent-articles/2026-11-rcip-jobbank/build.mjs [--start YYYY-MM-DD]`

- Every number in the articles is formatted from `stats.json` (`fmt` in
  `lib.mjs`). The build extracts every number from the finished text and
  fails if one is not in `stats.json`, not registered as computed (`dv`), and
  not in the short `EXTRA` list of non-statistics (years, TEER and CLB levels,
  the 30-hour rule).
- It also fails on an employer name from the listings file, an email
  address, a banned phrase, Arabic letter forms or Latin digits in Persian
  prose.
- It writes `out/*.json` (payloads) and `review.html` (the drafts and a
  "figure, where it comes from" table).
- `--start` is the day part 1 is posted. Part 1 has no `publishAt`; parts 2
  and 3 are held for the next two days (English 14:00 UTC, Persian 18:00 UTC).

Post with `node scripts/post-agent-article.mjs content/agent-articles/2026-11-rcip-jobbank/out/*.json`.
A correction is a rebuild and a re-post of the same slug.

## Next month

1. Download the month's Job Bank file into `webscraper/jobbank_raw/`; re-read
   the 14 community lists if they changed.
2. `python3 jobbank_build.py --input jobbank_raw/<file> --month YYYY-MM`
3. `python3 jobbank_report_stats.py --input jobbank_raw/<file> --month YYYY-MM`.
   Resolve every warning: review new template signatures and repeats by hand.
4. Copy the JSON to `content/data-reports/YYYY-MM/stats.json`.
5. Copy the article folder, change the edition, slugs (month in the slug) and
   the prose that the new numbers no longer support. Do not reuse sentences
   about which community or occupation leads without checking.
6. Run the fact-checker on the drafts, build, open a PR.

## Limits to state in every report

One month; no employer names in the open data, so a posting is never shown to
come from a designated employer; about half of postings have no industry;
postings without a town cannot be placed; wages are posting minimums; the 14
lists carry different dates.
