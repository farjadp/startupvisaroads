# Case Studies pipeline (phase 0)

Spec: `docs/product/case-studies-spec.md` §5–§6. Operator agent: `.claude/agents/case-study-writer.md`.
Status, 9 Nov 2026: scripts, gates and offline eval are built and green. No live (model) run has happened yet: there is no `ANTHROPIC_API_KEY` in this environment.

## Where things live

| What | Where | In git? |
| --- | --- | --- |
| Fetch, parse, stages 3-10 | `scripts/case-studies/{fetch,parse,pipeline}.ts` | yes |
| Prompts (versioned) | `scripts/case-studies/prompts/{extract,verify,write-en,write-fa}.v1.md` | yes |
| Rules (quotes, disposition gate, red lines, PII, trace) | `lib/case-studies/*`, `scripts/case-studies/lib/rules.ts` | yes |
| Decision list (spec §10) | `scripts/case-studies/decisions.json` | yes |
| Eval harness and labels (short quotes only) | `scripts/case-studies/eval/` | yes |
| Raw decisions, `parsed.json`, `parties.private.json`, stage outputs | `CASE_STUDIES_DIR/<slug>/` (default `~/VisaRoads-private/case-studies/`) | **never** |
| Type B raw notes | `CLIENT_CASES_DIR/<id>/raw.md` (default `~/VisaRoads-private/cases/`) | **never** |

The repo is public. `paths.ts` refuses a `CASE_STUDIES_DIR` inside the working tree.

## Stages and exact commands

| # | Stage | Command | Model |
| --- | --- | --- | --- |
| 0 | Type B redaction (two passes) | `npx tsx scripts/case-studies/pipeline.ts redact-b <client-case-id>` | none |
| 1 | Fetch | `npx tsx scripts/case-studies/fetch.ts --citation "2025 FC 12" --url <official document.do URL>` · `--spec10` · `--robots-only` | none |
| 2 | Parse | `npx tsx scripts/case-studies/parse.ts "2025 FC 12"` · `--all` | none |
| 3 | Extract claims + quotes | `npx tsx scripts/case-studies/pipeline.ts extract "2025 FC 12"` | `CASE_STUDIES_MODEL_EXTRACT` |
| 4 | Ground (exact quote check, disposition gate, model verify) | `... pipeline.ts ground "2025 FC 12"` | `CASE_STUDIES_MODEL_VERIFY` |
| 5 | Anonymise | `... pipeline.ts anonymise "2025 FC 12"` | none |
| 6 | Write English | `... pipeline.ts write-en "2025 FC 12"` | `CASE_STUDIES_MODEL_WRITE` |
| 7 | Write Persian (from claims, never from the English draft) | `... pipeline.ts write-fa "2025 FC 12"` | `CASE_STUDIES_MODEL_WRITE` |
| 8 | Trace (claim parity, invented numbers, red lines, fa lint, party names) | `... pipeline.ts trace "2025 FC 12"` | none |
| 9 | Payload | `... pipeline.ts payload "2025 FC 12"` | none |
| 10 | Post en + fa to `/api/agent-case-studies` (lands IN_REVIEW) | `... pipeline.ts post "2025 FC 12"` | none |
| 3-9 | All, stops before post | `... pipeline.ts all "2025 FC 12"` | as above |

A failing gate writes `STOPPED.json` in the case folder and exits non-zero. There is no repair path: a failed claim is dropped; a failed holding or disposition stops the case; regex and model disposition must agree; "allowed in part" and consent judgments are blocked; holdings must be the court speaking.

## Env vars

| Var | Default | Used by |
| --- | --- | --- |
| `CASE_STUDIES_PROVIDER` | `gemini` (since 2026-11-10) or `claude` | `scripts/case-studies/lib/anthropic.ts` (dispatch) |
| `GEMINI_API_KEY` | none (required for stages 3, 4, 6, 7 and the live eval when the provider is gemini) | `scripts/case-studies/lib/gemini.ts` |
| `ANTHROPIC_API_KEY` | none (required when the provider is claude) | `scripts/case-studies/lib/anthropic.ts` |
| `CASE_STUDIES_MODEL_EXTRACT` | gemini `gemini-3.8-flash` / claude `claude-opus-5-5` | stage 3 (opt in to `gemini-4-argon` here) |
| `CASE_STUDIES_MODEL_WRITE` | gemini `gemini-3.8-flash` / claude `claude-sonnet-5-5` | stages 6, 7 |
| `CASE_STUDIES_MODEL_VERIFY` | gemini `gemini-3.5-flash-lite` / claude `claude-haiku-5-5` | stage 4 |
| `CASE_STUDIES_DIR` | `~/VisaRoads-private/case-studies` | all stages |
| `CLIENT_CASES_DIR` | `~/VisaRoads-private/cases` | `redact-b` |
| `CASE_STUDIES_POST_URL` | `http://localhost:3000` | stage 10 |
| `AGENT_REPORTS_TOKEN` | none (required for stage 10) | stage 10 bearer token |
| `CASE_STUDIES_FETCH_INTERVAL_MS` | 5000 (floor 5000) | stage 1 |

API guidance: no `claude-api` SKILL.md file was found under `~/.claude/skills` or `~/.claude/plugins` when this doc was written. The client calls the Messages API (`POST /v1/messages`) with `fetch`, following the public Anthropic docs. It uses structured output via `output_config.format` (json_schema) and the default adaptive thinking. The repo has no Anthropic SDK, and phase 0 does not add dependencies.

## Fetch: what we observed (9 Nov 2026, 22:58 UTC)

User-Agent on every request: `VisaRoadsCaseStudies/0.1 (+https://visaroads.com/contact)`, plain `fetch`, no browser headers.

- `robots.txt`: **200**. It blocks `BUbiNG` entirely and, for `*`, only two `/icm/` items (120620, 111322). No `/fc-cf/decisions/` path is disallowed.

| Citation | Route | Status | Type | sha256 |
| --- | --- | --- | --- | --- |
| 2025 FC 12 | start-up-visa | 200 | application/pdf | `9e86ad59a73669a014792c963142f0f96b7c7c5fbc41ae1992424c00c4a66f5d` |
| 2025 FC 1599 | start-up-visa | 200 | application/pdf | `54bd4992d5646940067eb46952db0a4ccdcd2bfab60db0bbbe4f0877f127a6e7` |
| 2026 FC 146 | start-up-visa | 200 | application/pdf | `1f65daa5c044ebfcde6ab0dc018bb4402587d1b37fa0bcb912370deff54db023` |
| 2026 FC 158 | work-permit-c11 | 200 | application/pdf | `9a3e3041cf167bb7585b9bbc596e0109abc51de75e0d69bec9a185934d0981c0` |
| 2026 FC 255 | study-permit | 200 | application/pdf | `a12d0e98f34609154b96c68f3b5215259120711e2e91215cfce8356d790d5b0f` |

There were no 403 or 429 responses. All five decisions were parsed, giving `parsed.json` and `parties.private.json` in each case folder.

### Manual download (when fetch gets 403/429)

`fetch.ts` stops on 403 or 429 and never retries with other headers. To get the decision by hand:

1. Open the official `decisions.fct-cf.gc.ca` URL in a normal browser.
2. Save the page as HTML, or the PDF, into `~/VisaRoads-private/case-studies/<slug>/` (slug example: `2025-fc-12`) as `raw.html` or `raw.pdf`.
3. Run `npx tsx scripts/case-studies/parse.ts "<citation>"` and continue from stage 3.

Never use a mirror (CanLII, vLex) or a scraping service.

## Official source

`decisions.fct-cf.gc.ca` is registered in `lib/autopilot/official-sources.ts` as `canada-federal-court`, so citations to decisions pass `officialCitationUrl`.

## Eval

Run: `npx tsx scripts/case-studies/eval/run.ts --offline` (no API key). The offline suite also runs in vitest (`lib/case-studies/__tests__/eval-offline.test.ts`), so `npx vitest run lib/case-studies` gates it.

Case counts vs the spec target of 60 (40 type A + 10 adversarial + 10 type B):

| Category | Have | Target | Gap |
| --- | --- | --- | --- |
| fc-real (labelled real decisions, type A) | 5 | 40 | 35 |
| trace (synthetic drafts, stage 8 rules; extra, not counted toward the 40) | 10 | none set | n/a |
| adversarial | 12 | 10 | none |
| type B (planted personal data) | 10 | 10 | none |
| **Total** | **37** | **60** | **35 real type A short** |

fc-real labels hold only short quotes (40 words or fewer). Each holding quote was checked against the cached `parsed.json` with `checkQuote` on 9 Nov 2026: 5 of 5 pass, every quote sits in or after the analysis section, and no party name from `parties.private.json` appears in the label file.

Offline result, 9 Nov 2026 (this is the baseline):

```
fc-real 5/5 · adversarial 12/12 · trace 10/10 · type-b 10/10 · total 37

disposition (fc-real, regex vs label)  100.0% (5/5)    bar 100%      PASS
remitted (fc-real)                     100.0% (5/5)    bar 100%      PASS
certified question (fc-real)           100.0% (5/5)    bar 100%      PASS
holding label grounded (fc-real)       100.0% (5/5)    bar >= 95%    PASS
hard-rule gate (adversarial)           100.0% (12/12)  bar 100%      PASS
unsupported claims published           0               bar 0         PASS
planted personal data leaked (type B)  0 of 45         bar 0         PASS
en/fa claim parity check               100.0% (10/10)  bar 100%      PASS
trace rules detection (stage 8)        100.0% (10/10)  bar 100%      PASS
Persian rubric (live only)             not run         mean >= 4/5, none < 3   SKIP
```

### What the live eval still needs

- A `GEMINI_API_KEY` (default provider) or an `ANTHROPIC_API_KEY` with `CASE_STUDIES_PROVIDER=claude`, for extract, verify, write-en and write-fa on the labelled decisions. The bars were set before the switch to Gemini; the live eval decides whether Gemini clears them, especially exact-quote grounding and the Persian rubric.
- About 8 hours of labelling: 35 more type A decisions, with disposition, remitted, certified question, a holding quote and paragraph, and the expected claim set. Fetch them with `fetch.ts`, parse them, then label from the private cache. Commit short quotes only.
- A Farjad spot-check of 10 labels (the 5 fc-real labels are still pending his check).
- The Persian rubric, scored on stage 7 output (mean 4/5 or higher, no case below 3). It cannot run offline.
- Cost and latency per case from the run logs (`runs.json` in each case folder). None are recorded yet.
- Hand-off to `mlops-engineer` to run the live eval in CI on prompt or model changes, using the bars above as the block threshold.
