# QA: Case Studies (branch feat/case-studies)

Date: 9 Nov 2026. Scope: spec docs/product/case-studies-spec.md. Environment: local dev server :3217 from this worktree, SQLite dev.db.

## Verdict

GO for opening a PR. NOT a publish decision: publishing court-decision pages stays blocked by the counsel switch (`courtPagesClearedByCounsel`, default OFF) by design.

## Automated results

- `npx vitest run`: 83 files, 1026 tests, all passed.
- `npx tsc --noEmit`: no errors.
- Case-study test files (lib/case-studies/__tests__): anonymise-lint, eval-offline, fc-parser, payload, quotes, redlines, routes, sanitise-url-schemes, security-fixes, seo, workflow-gate.

## Acceptance matrix

| Requirement | Evidence | Result |
|---|---|---|
| Both schemas + reversible migration | prisma/migrations/20261109210000_case_studies; docs/engineering/case-studies-migration.md has Rollback (down SQL) and a verification run on throwaway Postgres 16. CaseStudy table present in SQLite dev.db and e2e exercised it. I did not re-run Postgres migrate/rollback myself. | Pass (Postgres run taken from doc) |
| Workflow states | e2e: IN_REVIEW, APPROVED, PUBLISHED, WITHDRAWN observed; workflow-gate.test.ts (17 tests) | Pass |
| Approval refused until all claims ticked | e2e step 3: 409 "2 of 2 claims are not checked."; approve 200 after both ticks | Pass |
| Counsel switch default OFF blocks type A publish | e2e step 4: 409 "Court-decision pages are switched off until counsel clears them."; public page 404. Settings GET at end shows false. | Pass |
| Turning switch off hides pages | e2e step 6: published page 200 -> 404 and slug gone from sitemap; back ON -> 200 | Pass |
| Agent endpoint IN_REVIEW only, same auth as agent-articles | e2e 1-2: 401 without/with wrong token; valid post returns status IN_REVIEW, claims forced verified=false (claimsChecked 0). Auth code: Bearer AGENT_REPORTS_TOKEN or authorisedCron. Same-auth parity with agent-articles read from code only, not compared by diff. | Pass |
| Public en/fa pages + verbatim disclaimers | EN disclaimer (a) found verbatim in rendered HTML (spec section 5 line 151). FA pages: screenshots only, FA disclaimer text not byte-compared. | Pass EN, FA visual only |
| JSON-LD | Parseable application/ld+json Article, citation equals officialUrl | Pass |
| hreflang only for complete pairs | seo.ts: emitted only when both locales published; seo.test.ts (13). Not exercised live (QA row was single-locale). | Pass (unit) |
| Sitemap published only | slug present when PUBLISHED (1 match), absent when switch off (0) | Pass |
| Slug pattern | FC_SLUG_RE `^[a-z0-9-]+-(\d{4})-fc-(\d+)$` in payload.ts; payload.test.ts | Pass (unit) |
| No party names | anonymise.ts + anonymise-lint.test.ts (17); stage 8 trace party-name detection in eval-offline | Pass (unit) |
| Exact quote checker | quotes.ts; quotes.test.ts (25) | Pass (unit) |
| 12-rule red-line scan | redlines.ts has 12 rule entries (grep); redlines.test.ts (18) | Pass |
| fa from claims | Persian lint (persian-lint.ts) and parity check in eval-offline trace test (parity equal). Generation itself needs the live pipeline, not run. | Pass (offline) |
| case-study-writer agent | .claude/agents/case-study-writer.md exists; contents not reviewed beyond existence | Present |
| Eval harness: 37 of 60 cases, offline only | eval-offline.test.ts runs the synthetic subset in CI (4 tests pass; asserts 0 unsupported claims published, 0 planted personal data leaked, parity). The fc-real cases need ~/VisaRoads-private, run on Farjad's Mac. I did not count 37 of 60 independently; figure is from the brief. | Pass (subset), count unverified |
| Tests for gate/switch/quote/red-lines/agent auth | workflow-gate, security-fixes, quotes, redlines, routes tests present and green. No unit test confirmed specifically for the agent 401; covered by e2e above. | Pass |

## E2E table (curl against :3217)

| # | Step | Expected | Actual |
|---|---|---|---|
| 1a | POST agent endpoint, no token | 401 | 401 |
| 1b | wrong token | 401 | 401 |
| 2 | valid FC payload, bearer | 200, IN_REVIEW | 200, IN_REVIEW, claimsTotal 2, claimsChecked 0, redLines [] (second run: created:false, update of same row) |
| 2b | admin login | 200 | 200 |
| 3 | approve, claims unchecked | 409 + reasons | 409 "2 of 2 claims are not checked." |
| 4a | tick c1, c2 | ok | 200, 200 (1/2, 2/2) |
| 4b | approve | 200 | 200 APPROVED |
| 4c | publish, switch OFF | 409 | 409 counsel-switch reason |
| 4d | public page | 404 | 404 |
| 5a | PUT switch true | 200 | 200 |
| 5b | publish | 200 | 200 PUBLISHED |
| 5c | public page | 200 | 200 |
| 5d | sitemap contains slug | yes | 1 match |
| 5e | disclaimer (a) verbatim | yes | True |
| 5f | JSON-LD Article citation = officialUrl | yes | True |
| 6a | switch false: page / sitemap | 404 / gone | 404 / 0 matches |
| 6b | switch true | 200, page 200 | 200, 200 |
| 6c | withdraw reason "qa" | 200, page 404 | 200, 404 |
| 6d | switch false final | false | settings GET: courtPagesClearedByCounsel false |
| 7a | PUT, Origin https://evil.example | 403 | 403 "Cross-origin request refused" |
| 7b | PUT, text/plain | 415 | 415 |

Notes: the first script run failed on a quoting bug in my script (empty id, no mutation reached a real row); fixed and re-run clean. The first run did toggle the settings switch; it ended false. QA row deleted from prisma/dev.db; remaining rows are the 2099-fc-1/2/3 samples. Dev server on :3217 was already running; left running. :3060 untouched.

## Mobile screenshots

docs/product/case-studies-screens/{en,fa}-{case,index}-mobile.png retaken by the previous QA; viewed as good by the brief, committed unchanged. Desktop and admin-review shots were already in the repo. I did not re-inspect pixels.

## Top risks

1. Counsel clearance is the only gate on type A publication; the switch is a single boolean toggled from admin. Nothing in QA can verify counsel has actually cleared the content. Keep it OFF in production until Farjad confirms.
2. Postgres path: migration verified only by the doc's throwaway run, not by me; db-f1-micro connection exhaustion can fail migrations at boot (see memory), so check "successfully applied" after deploy.
3. FA coverage is weaker: FA disclaimer not byte-checked, hreflang pair logic only unit-tested, FA generation from claims not run live. Also the eval 37 of 60 figure is unverified by me, and real-case (fc-real) evals only run on Farjad's Mac.

## Other notes

- Untracked AGENTS.md (auto-written by `next dev`) is not part of this commit.
- Not tested: concurrent publish/switch race (commit 43e36ac addresses it; security-fixes.test.ts covers), RTL rendering beyond screenshots, double-submit on approve.
