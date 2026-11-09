# Tech-debt register — visaroads.com

Owner: cto. One row per item. Decision: fix now / fix next / accept / watch.

| # | Item | Cost of leaving it | Cost of fixing | Owner | Decision | Added |
|---|---|---|---|---|---|---|
| 1 | `lib/sanitize.ts` `isSafeUrl` only checks `startsWith('javascript:')`; `java&#x09;script:` and leading control chars pass. Article bodies rendered with `dangerouslySetInnerHTML` on public pages (see docs/security/case-studies.md, adjacent High). | Click-to-run stored XSS on public article pages, fed by admin article actions and `/api/agent-articles`. | ~1 h: reuse the control-char strip + scheme allowlist from `lib/case-studies/payload.ts`, add tests. | ciso → security-engineer | fix next (own PR, not in case studies) | 2026-11-09 |
| 2 | Case studies eval: 37 of 60 cases; only 5 real type A labels (target 40); live eval never run. | Pipeline quality unproven against the spec bars before first publish. | ~8 h labelling + one live run with ANTHROPIC_API_KEY; Farjad spot-checks 10. | head-of-data → llm-engineer | fix before first publish | 2026-11-09 |
| 3 | Case studies admin HTML saved before commit a0ec181 is not re-sanitised on read. | None in prod (no rows exist before deploy); dev only. | Clean on read in `GET /api/admin/case-studies/[id]`. | backend-developer | accept | 2026-11-09 |
| 4 | Withdrawn case cannot be superseded: nothing sets `supersededById`; withdrawn page 404s instead of 301 to a replacement (spec §9). | A corrected case gets a new slug and loses the old URL's equity. | ~0.5 day: replace action + 301 in the case page. | backend + frontend | fix next | 2026-11-09 |
| 5 | Publish/release run in a Serializable transaction; a concurrent switch write can raise a serialization error (500 on publish, cron run ends early). | Rare; retry is safe; next cron tick picks rows up. | Retry wrapper. | backend-developer | watch | 2026-11-09 |
| 6 | No ESLint config usable by the installed ESLint (no `eslint.config.*`). | `next lint` / lint gates don't run; style regressions undetected. | ~1 h: flat config + CI step. | cto | fix next | 2026-11-09 |
| 7 | `middleware.ts` uses the name Next 16 deprecates in favour of `proxy.ts`. | Breaks on a future Next major. | Rename + test. | cto | watch | 2026-11-09 |
