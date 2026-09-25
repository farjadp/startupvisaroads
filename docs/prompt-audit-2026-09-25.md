# Prompt audit — 25 September 2026

## Stated assumptions

The audit was run non-interactively. Two things were fixed from the repository rather than asked, and you can overturn either by re-running with a narrower request.

1. **Provider.** This project calls **OpenAI**, not Anthropic: `openai@^6.42.0` in `package.json`, `lib/ai.ts:1`, `lib/socials.ts:4`, `lib/autopilot/pipeline.ts:13`, `lib/knowledge/embed.ts`. Nothing here was rewritten toward an Anthropic SDK, and no finding below rests on a Claude-specific API behaviour. Where the audit's pattern library makes a claim that is only true on Claude models — that `temperature` is rejected, that thinking configuration replaces "think step by step", that assistant prefills return a 400 — that claim is **not** applied. Those levers still work on OpenAI, so their presence here is not a finding.
2. **Target generation.** The repository's own newest pin is `gpt-4.1` (`lib/autopilot/pipeline.ts:18`, overridable by `AUTOPILOT_MODEL`). Two older lanes still pin `gpt-4o` (`lib/ai.ts:319`) and `gpt-4o-mini` (`lib/socials.ts:117`). The audit treats **`gpt-4.1` and later** as the target: prompt text written against `gpt-4o`'s documented weaknesses is the removal candidate.

**Git provenance is unavailable.** The history is squashed — `4e24539` (8 Sep 2026) introduces essentially the whole codebase, so `git blame` dates every prompt line to one commit. Provenance came instead from the file header comments, which are unusually good: `art-direction.ts`, `originality.ts`, `images.ts`, `write-insight.ts` and `socials.ts` each state which real failure their rules exist to prevent, with a date. That is the strongest keep signal in the repo and it did most of the work of telling cruft from load-bearing text.

---

## Summary

**The prompt surface is in good shape, and the newer half of it is better than good.** `lib/autopilot/**` and `lib/social/{write-insight,knowledge}.ts` are what a well-maintained prompt surface looks like: every prohibition carries its reason, the numeric constraints are enforced in code as well as stated in prose (`rejectReason`, `rejectKnowledge`, `gateFigures`, `structureDrift`, `tooClose`), and the retry ladders are deliberate rather than defensive. Most of the audit's pattern table finds nothing there, and per the guide's own rule — *an audit that finds nothing should change nothing* — I have proposed no edits to any of it.

The findings concentrate in the **two older lanes** that the autopilot superseded but did not replace: `lib/ai.ts` (`generateArticlePayload`) and `lib/socials.ts` (`generateSocialCaptions`).

The three highest-impact findings:

1. **The legacy writer publishes with no fact discipline at all, and the two writers disagree about whether inventing figures is allowed.** `lib/autopilot/**` runs `FACT_RULES`, an evidence pack, a figure gate and an originality gate behind every article. `lib/ai.ts:generateArticlePayload` runs none of them, and `app/api/ai/process/route.ts:51` writes its output straight to `status: 'PUBLISHED'`. An immigration article that invents a fee or a draw score is the single most expensive mistake this site can make, and only one of the two lanes is defended against it. This is the finding worth acting on first. (Finding 1.)
2. **The prompt and the code disagree about the X caption budget, and the code wins by truncating mid-sentence.** `lib/socials.ts:103` asks for 120–140 characters; `lib/socials.ts:303` hard-cuts at 240 with an ellipsis. Half the available budget goes unused, and a caption that overshoots is severed mid-thought — which is precisely the failure `lib/social/write-insight.ts` was written to eliminate on the newer lane. (Finding 5.)
3. **`lib/ai.ts`'s length rule states the same number twice and then pleads.** "up to 3000 words (between 2000 and 3000 words)" followed by "Do NOT truncate or write placeholders … Assess this importance intelligently and adjust the length dynamically" is an inline arithmetic rubric plus pressure language, written for a model that under-delivered on length. The autopilot solved this properly in code — `wordTarget()` plus a measured `expand` loop. (Finding 3.)

### Counts

| Group | Findings | Of which in the diff |
|---|---|---|
| 1a Pressure language | 3 | 3 |
| 1c Over-specification | 1 | 1 |
| 1d Fossils | 3 | 2 |
| 1f Output-shaping choreography | 1 | 1 |
| 2 Brittle skill/rule files | 1 | 1 |
| 3 Tool descriptions | 0 | — |
| 4 Request config and architecture | 4 | 1 |
| **Total** | **13** | **9 hunks** |

Group 3 is empty because this codebase defines no tools — every call is a single completion. Group 2 has one finding only because there are no `SKILL.md`, `CLAUDE.md` or `.cursorrules` files; the one finding is model names pinned into user-facing copy.

### Verification already done

The proposed diff was applied on a scratch basis and checked before being reverted: `npx tsc --noEmit` is clean, and `npx vitest run` passes **521 tests across 50 files**. No test asserts any of the changed prompt strings, so nothing downstream had to move. What has *not* been done is a behavioural probe — nobody has measured the articles these prompts produce before and after. Per Step 7, treat every removal below as a hypothesis: the diff is safe to apply and cheap to revert, but the quality claim is unproven until you read a few generated articles.

---

## Findings

Ordered highest confidence first. `file:line` refers to the committed state, before the patch.

### 1. The legacy writer states no fact discipline, and contradicts the autopilot

| | |
|---|---|
| **Location** | `lib/ai.ts:241-315` (the prompt), `app/api/ai/process/route.ts:50-54`, `app/api/cron/generate/route.ts:70-71` |
| **Evidence** | The prompt's ten rules cover structure, SEO, HTML classes, tone, visuals and JSON shape. Not one of them constrains what may be asserted as fact. Compare `lib/autopilot/pipeline.ts:34-38`: *"NEVER state a specific draw score, draw date, processing time in weeks, quota count, acceptance rate, fee amount or price unless it was given to you in this prompt."* |
| **Pattern** | Group 1d (patch accretion / two lanes drifted apart) and the keep-list's one exception to leaving redundancy alone: **the duplicates actually disagree.** |
| **Why obsolete** | Not obsolete so much as never written. The autopilot lane was built later with fact grounding as its whole point; the legacy lane kept the pre-grounding prompt and is still the one wired to the admin "AI Writer" and the `/api/cron/generate` route. `app/api/ai/process/route.ts:51` publishes at `PUBLISHED`, so nothing sits between an invented fee and a live page. |
| **Confidence** | **High** — verified by reading both prompts and both call sites. |
| **Action** | `add`. The diff adds a mode-aware `factRules()` to `lib/ai.ts`: in `KEYWORD` mode (no source supplied at all) no figure of any kind may be stated; in `URL`/`TEXT` mode every figure must appear in the input, and the input is marked as DATA, not instructions. `FACT_RULES` is deliberately **not** imported verbatim — its first bullet presumes an evidence block this lane does not have, so importing it would gut `KEYWORD` mode. **The larger fix is out of scope for a prompt audit:** retiring `generateArticlePayload` and pointing both routes at the autopilot's `draftBody`/`draftMeta` would give the legacy lane the evidence pack, the figure gate and the originality gate too. That is a route-level rewrite with product consequences (the manual URL/TEXT modes have no autopilot equivalent), so it is named here rather than patched. |

### 2. `IMPORTANT:` on a plain requirement

| | |
|---|---|
| **Location** | `lib/ai.ts:245` |
| **Evidence** | `IMPORTANT: Write the ENTIRE article (title, excerpt, content, tags, quickFacts) in ${languageName}.` |
| **Pattern** | Group 1a — emphasis with no adjacent reason. |
| **Why obsolete** | The language requirement is real and must stay; the volume around it was calibrated against a model that dropped it. Current models follow the plain statement, and a prompt whose one capitalised marker sits on its least contentious rule has spent that marker for nothing. `ENTIRE` is also doing the work the field list already does. |
| **Confidence** | **High** |
| **Action** | `rewrite` → `Write every field (title, excerpt, content, tags, quickFacts) in ${languageName}.` |

### 3. The length rule: an arithmetic rubric, stated twice, then pleaded

| | |
|---|---|
| **Location** | `lib/ai.ts:252-255` |
| **Evidence** | `**up to 3000 words (between 2000 and 3000 words)**` … `Do NOT truncate or write placeholders. Write the full extensive sections and paragraphs. Assess this importance intelligently and adjust the length dynamically.` |
| **Pattern** | Group 1c (over-specification), Group 1b (inline arithmetic rubric the model must compute), Group 1a (`Do NOT` + "intelligently"). |
| **Why obsolete** | "up to 3000 (between 2000 and 3000)" is the same bound twice, which reads as two competing instructions. "Assess this importance intelligently and adjust dynamically" is strategy coaching — it does not change what is legal or how success is measured, which is the audit's own test for deletable. And "Do NOT truncate" is a workaround for `gpt-4o` under-delivering on length; the autopilot fixed that failure the right way, by **measuring** the result (`wordCountHtml`) and re-asking (`expand`), not by insisting harder. |
| **Confidence** | **High** on the duplication and the coaching; **Medium** on "Do NOT truncate", which is a re-test candidate rather than a certainty. |
| **Action** | `rewrite`. One range per depth tier, the sections requirement kept, one plain sentence for completeness ("Every section is complete prose — no placeholders"). The word counts themselves are **kept**: this is a genuinely format-sensitive output and the numbers are the product decision, not a verbosity clamp. |

### 4. `You MUST` / `NEVER` inside the visual spec

| | |
|---|---|
| **Location** | `lib/ai.ts:276`, `lib/ai.ts:279` |
| **Evidence** | `NEVER include text overlays or infographic elements in a PHOTO prompt.` and `You MUST write the complete, valid SVG code yourself. Requirements:` |
| **Pattern** | Group 1a — triggering boosters on instructions that are not in contention. |
| **Why obsolete** | Both sit inside a block that already spells out the contract in detail; the shouting adds nothing the surrounding sentences do not. Note the contrast with `lib/autopilot/art-direction.ts`, where `NOTHING WITH WRITING ON IT` **stays**: its header comment records that flux rendered paper as garbled pseudo-text on real runs. That is a prohibition against a demonstrated failure, and keep-list item 5 protects it. These two are not. |
| **Confidence** | **Medium** — no provenance either way; the reasoning is the density argument, not a measurement. |
| **Action** | `rewrite` to plain statements. |

### 5. The X caption budget: prompt and code disagree, and the code truncates mid-thought

| | |
|---|---|
| **Location** | `lib/socials.ts:103` (the prompt) vs `lib/socials.ts:301-307` (the enforcement) |
| **Evidence** | Prompt: `Write a very brief single paragraph (around 120-140 characters max)`. Code: `const maxTextLength = 240; … text = text.substring(0, maxTextLength - 3) + '...'` |
| **Pattern** | Group 1f (numeric output ceiling written against a padding model) compounded by Group 1d (unenforced / mis-enforced instruction) — and the two numbers genuinely disagree, which is what lifts this above a refactoring preference. |
| **Why obsolete** | 240 is the arithmetically correct budget (280 minus the 23-character URL, as the code's own comment says). 120–140 wastes nearly half of it, and because the prompt and the enforcement carry different numbers, an overshooting caption is cut with an ellipsis rather than rewritten. `lib/social/write-insight.ts:126-131` documents exactly why that is the wrong failure mode: *"a post cut mid-thought is the failure mode this module exists to remove, so it is rewritten or dropped instead."* The newer lane learned this; the older one has not. |
| **Confidence** | **High** — both numbers are in the file and they do not match. |
| **Action** | `rewrite`. One `TWITTER_CAPTION_BUDGET = 240` constant, stated to the model and used by the truncator, so the two can no longer drift. The comment records why 240 and what the old mismatch cost. |

### 6. `Do NOT include any URL`, three times

| | |
|---|---|
| **Location** | `lib/socials.ts:102-104` |
| **Evidence** | The identical sentence terminates each of the three per-platform bullets, as does `Include 5-10 highly relevant hashtags`. |
| **Pattern** | Group 1c — repetition as reinforcement; near-duplicate sentences across sections. |
| **Why obsolete** | Both rules are platform-independent. Stated three times they read as three separate rules the model must reconcile, and they crowd out the per-platform text that is actually differentiated (the tone). |
| **Confidence** | **Medium** |
| **Action** | `rewrite` — hoist both to a single numbered rule above the per-platform list, leaving each bullet to carry only its tone and shape. The diff also adds a no-new-facts rule, which this lane lacks entirely and which every other writing surface in the repo has. |

### 7. Model names pinned into user-facing copy and the README

| | |
|---|---|
| **Location** | `components/admin/AiWriterUI.tsx:180-181`, `README.md:12` |
| **Evidence** | `'… GPT-4o will write a full, SEO-optimized article and Fal.ai will generate the images instantly.'`; `Automated editorial rewriter using GPT-4o and Fal.ai (Flux) …` |
| **Pattern** | Group 2 — pinned model names silently degrade after the next release; volatile specifics with no verification date. |
| **Why obsolete** | Already wrong in two ways. The autopilot moved to `gpt-4.1` (`pipeline.ts:18`) and covers moved to `gpt-image-2` (`lib/ai.ts:158`, `lib/autopilot/images.ts:48`), but the admin console and the README still tell the reader `GPT-4o` and Fal. Nothing re-checks this copy when a pin changes, so it will keep rotting. |
| **Confidence** | **High** — verifiably out of date today. |
| **Action** | `rewrite`. Copy describes the capability, not the vendor; the README points at where the pins actually live, so the next change has one place to update. |

### 8. `WRITER_MODEL = 'gpt-4.1'` and its justification comment — `flag`, re-test

| | |
|---|---|
| **Location** | `lib/autopilot/pipeline.ts:17-18` |
| **Evidence** | `// gpt-4.1 follows length instructions; gpt-4o returned 550–850 words when asked for 1,900.` |
| **Pattern** | Group 1d (model-version workaround), Group 2 (pinned model name). |
| **Why obsolete** | It is not — this is a **keeper**, and I am flagging it only for the re-test. The comment is exactly what good provenance looks like: the pin names the failure it fixes and the model it fixes it on. But the comparison it records is against a model two generations back, so it no longer tells you whether `gpt-4.1` is still the right choice, only that it beat `gpt-4o`. The env override (`AUTOPILOT_MODEL`) means re-testing costs nothing. |
| **Confidence** | **Low** (the *removal* case is low; the re-test case is strong) |
| **Action** | `flag` — no edit proposed. When you next re-baseline, add the date and the newer comparison to the comment rather than replacing it. |

### 9. The two-call body/metadata split — `flag`, re-test

| | |
|---|---|
| **Location** | `lib/autopilot/writer.ts:51-57` |
| **Evidence** | `Asking gpt-4o for a 2,000-word HTML body inside a JSON string comes back at ~250 words: the JSON mode truncates long string values.` |
| **Pattern** | Group 1d — a workaround traced to a model the pipeline no longer runs. |
| **Why obsolete** | Possibly not obsolete at all, which is why this is a flag and not a removal. The comment gives the split **two** justifications, and only the first is model-specific: the second — *"which also keeps the takeaway consistent with the text"* — is an architectural benefit that survives any model change, since `draftMeta` reads the finished body. Collapsing the two calls would cost that. |
| **Confidence** | **Low** |
| **Action** | `flag` — no edit. If you ever test collapsing it, the thing to measure is takeaway/body consistency, not word count. |

### 10. `MAX_OUTPUT_TOKENS = 12000`, sized against `gpt-4o` — `flag`

| | |
|---|---|
| **Location** | `lib/autopilot/pipeline.ts:79-80` |
| **Evidence** | `/** Long-form output. gpt-4o stops at ~4k tokens unless told otherwise, which silently truncates a 2,000-word article. */` |
| **Pattern** | Group 4 — `max_tokens` sized for a different model. |
| **Why obsolete** | The ceiling is almost certainly still fine (12k tokens comfortably holds a 2,300-word HTML article), so there is nothing to fix. It is listed because the *reason* recorded for the number is a retired model's default, which makes the number look arbitrary to the next reader. |
| **Confidence** | **Low** |
| **Action** | `flag` — no edit. |

### 11. Explicit `temperature` on every call — `flag`, and explicitly **not** a finding

| | |
|---|---|
| **Location** | `lib/autopilot/pipeline.ts:82-102` and its eleven callers (0.1 in `triage.ts`, 0.2 in `knowledge/digest.ts`, 0.4 in `readSource`, 0.5 in `draftMeta`, 0.7 in `draftBody`/`expand`, 0.8 in `planBriefsWithModel`, 0.9 in `humanise`) |
| **Pattern** | The audit's Group 1b signal `temperature\|top_p` in request code matches here. |
| **Why obsolete** | **It is not, and the signal is a false positive on this codebase.** That row exists because `temperature` is *rejected* on current Claude models; on OpenAI it is a live, supported parameter. More to the point, temperature is load-bearing here rather than vestigial: the retry ladders in `write-insight.ts:157` (0.75 → 0.3) and `social/knowledge.ts:113` (0.9 → 0.5) use a colder second attempt as their correction mechanism, and the per-stage spread from 0.1 (scoring) to 0.9 (voice rewrite) tracks how much variation each stage should have. Removing it would break the retry design. Recorded so a future audit does not mistake the grep hit for cruft. |
| **Confidence** | **High** that this should be left alone. |
| **Action** | `flag` — no edit, deliberately. |

### 12. AI-ism ban lists duplicated across four files — `flag`, no edit

| | |
|---|---|
| **Location** | `lib/autopilot/pipeline.ts:69,73`; `lib/social/write-insight.ts:79-80` (`VOICE`); `lib/social/knowledge.ts` (the `Voice:` line in `prompt()`) |
| **Evidence** | Overlapping banned-phrase lists: `"In today's fast-paced world"`, `"It's important to note"`, `"delve"`, `"navigate the complexities"`, `"unlock"`, `"seamless"`, `"robust"`, `"leverage"`, `"game-changer"`, `"landscape"`, `"journey"`, plus `"tapestry"` / `"at the end of the day"` in the article pipeline and `"hidden gem"` in the knowledge lane. |
| **Pattern** | Group 1e (prohibition clusters — banned-phrase and tic lists with no stated provenance) and Group 2 (information duplicated across files, which drifts). |
| **Why obsolete** | It probably is not, and keep-list item 8 decides this one. I checked whether the lists **disagree**, which is the audit's threshold for proposing deduplication: they do not. Each is a subset of the article pipeline's list plus at most one lane-specific addition, and the additions are correct for their lane (`"hidden gem"` belongs in a country-writing prompt and nowhere else). Working redundancy that does not contradict itself is a refactoring preference, not a dated pattern. The lists are also a deliberate house-voice decision, which is the author's call and not the model's. |
| **Confidence** | **Low** |
| **Action** | `flag` — no edit. If they ever start to disagree, consolidate into one exported constant with per-lane additions. |

### 13. One model call per judgment step — clean, recorded for completeness

Step 4's Group 4 check asks you to *count the model-call sites and ask of each whether its inputs fully determine its output*. Done. Thirteen call sites: `lib/ai.ts` (1), `lib/socials.ts` (1), `planner.planBriefsWithModel`, `writer.draftBody`, `writer.draftMeta`, `pipeline.expand`, `pipeline.humanise`, `source-writer.readSource`, `source-writer.draftFromFacts`, `knowledge/digest.writeDigest`, `knowledge/triage`, `social/write-insight`, `social/knowledge`, plus `knowledge/embed` (embeddings, not a completion).

Every one is genuinely adaptive. The nearest thing to a deterministic call is `knowledge/triage` at temperature 0.1 returning a 0–5 score, and that is relevance judgment against a keyword queue — not arithmetic. Better still, the deterministic work has already been pulled *out* of the model and into code where it belongs: `originality.ts` (shingle comparison, no model call, and its header says so proudly), `diversity.ts` (variety planning), `text.ts` (`inventedNumbers`, `wordCountHtml`, `enforceLinks`), `evidence.gateFigures`, `pipeline.structureDrift`. **No finding.** This is the part of the audit the codebase passes most convincingly.

Also checked and clean: no cache-hostile ordering (no prompt caching is in use, and with per-request-unique inputs there is little to cache); no budget countdowns rendered into context; no redundant sub-agent roster (there are no sub-agents); no assistant-turn prefill on any path; no `stop_sequences` guarding JSON (both JSON lanes use `response_format: { type: 'json_object' }`, which is the right mechanism); no `<scratchpad>` / "think step by step" / "take a deep breath" anywhere in the repo.

**One gap worth naming, outside the pattern tables:** there is **no token accounting**. No call site records `response.usage`, so per-surface cost is invisible and the autopilot's 3–5 articles a day at 3–4 passes each is unmeasured. The audit's own Group 4 closes on this point — without cost visibility, every other finding here is unmeasurable. Logging `completion.usage` in `chatText`/`chatJson` is a handful of lines and is the prerequisite for tuning anything.

---

## The proposed diff

`docs/prompt-audit-2026-09-25.patch` — nine hunks, one finding each, applied with:

```
git apply docs/prompt-audit-2026-09-25.patch
```

Take hunks selectively if you prefer; they are independent.

| Hunk | File | Finding |
|---|---|---|
| 1 | `README.md` | 7 — pinned model names |
| 2 | `components/admin/AiWriterUI.tsx` | 7 — pinned model names in admin copy |
| 3 | `lib/ai.ts` | 1 — `factRules()` added |
| 4 | `lib/ai.ts` | 2 — `IMPORTANT:` removed |
| 5 | `lib/ai.ts` | 3 — length rule rewritten |
| 6 | `lib/ai.ts` | 4 — `NEVER` / `You MUST` in the visual spec |
| 7 | `lib/ai.ts` | 1 (second half) — code-side fence strip, so rule 5 no longer depends only on the model obeying |
| 8 | `lib/socials.ts` | 5 — `TWITTER_CAPTION_BUDGET`, one number in prompt and code |
| 9 | `lib/socials.ts` | 6 — no-URL and hashtag rules hoisted; no-new-facts rule added |

Nothing under `lib/autopilot/**` or `lib/social/{write-insight,knowledge}.ts` is touched.

## If you apply it

1. `git apply docs/prompt-audit-2026-09-25.patch`, then `npx tsc --noEmit && npx vitest run` — both were clean and green on the scratch application (521 tests, 50 files).
2. Generate two or three articles through the admin AI Writer in each mode and read them. What you are checking is the pair of hypotheses the diff rests on: that the articles still hit their length band without "Do NOT truncate", and that `factRules()` in `KEYWORD` mode does not leave the prose so figure-free that it reads evasive. If either regresses, re-add the instruction **in its minimal form** rather than restoring the original wording.
3. Post one article to X and confirm the caption now uses the fuller budget and finishes its sentence.

## Re-run this audit when

The `AUTOPILOT_MODEL` pin changes. Prompts are per-model artifacts — the "Do NOT truncate" line in finding 3 is load-bearing on `gpt-4o` and dead weight on `gpt-4.1`, and the next pin will make a different subset of this file wrong.
