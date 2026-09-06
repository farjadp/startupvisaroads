# Spec — the Persian magazine

**Date:** 6 Sep 2026 · **Path:** architectural · **Status:** awaiting approval

## 1. The problem

`/fa/blog` has been live since the Persian site shipped and has **never published a
single article**. The Persian RSS feed returns zero items. Meanwhile the English
feed carries twenty.

This is not a rendering fault. The page returns 200 and renders «مجله» with an
empty list, because the list is empty.

## 2. What we know

Established this session, from production and from the code:

| Fact | Evidence |
|---|---|
| The Persian pipeline exists end to end | `planner`, `writer`, `source-writer` and `pipeline` all branch on `locale === 'fa'` and prompt in Persian, with a Persian house style, register rules and an AI-ism blocklist |
| The Persian link inventory is current | `FA_SITE_PAGES` carries the post-pivot Persian paths |
| Persian categories are ready | `lib/fa/categories.ts` maps every category slug to a Persian label |
| Nothing has ever come out | `/fa/rss.xml` → 0 items; `/fa/blog` → 0 article links |
| English also stalled, from 5 Sep | Newest English article 5 Sep 22:25, then nothing until the citation-host fix |
| All three news feeds are Canadian | `SOURCES` = IRCC, CIC News, Moving2Canada — on a site that pivoted to Denmark, the Netherlands and Finland |

**The citation-host defect fixed in #9 is the leading explanation for the Persian
silence too**, and it hit Persian at least as hard: a rejected citation downgrades
the article to `DRAFT`, and until #9 whether a citation counted depended on which
of `canada.ca` / `www.canada.ca` the model happened to emit.

That matters for this plan: **the first step is to observe, not to build.** If the
next scheduled Persian run publishes, the "make it run" half of this spec is
already done and we should not write a line of code for it.

## 3. Decisions taken

From Farjad, 6 Sep 2026:

- **Scope:** both — get it running first, then design what it publishes.
- **Origin:** hybrid. News pieces may come from the shared English feeds; guide
  pieces are Persian-first, written for the Iranian founder, not translated.
- **Sources:** add the European authorities. The current three are Canada-only.

## 4. Approaches considered

**A. Translate every English article into Persian.** Rejected — and already
rejected once, in Phase 1, for the site pages. The Iranian founder arrives with a
different question and distrusts a different set of things. A mirror is what
stalled the Persian site at 6% coverage the first time.

**B. Persian-only, no shared news.** Rejected as too slow. A regulation change in
Denmark is the same event in both languages; refusing to cover it in Persian
means the Persian reader learns it somewhere else.

**C. Hybrid, two lanes.** Chosen, and what Farjad picked. A news lane triggered by
real changes in the feeds, and a guide lane driven by Persian search intent. They
have different sourcing, different cadences and different risk profiles.

## 5. Design

### Part A — make it run, and make silence impossible

A.1 **Observe first.** Before any code: read `/admin/autopilot` for the Persian
runs and `/admin/articles` for Persian `DRAFT` rows. Three outcomes:
  - rows exist with `created > 0` → #9 already fixed it; skip to Part B
  - rows exist with `created = 0` → the gate is still rejecting; read the logged
    warning #9 now emits and fix what it names
  - no `fa` rows at all → the Cloud Scheduler jobs for `fa` were never created or
    are failing; this is infrastructure, not code

A.2 **A standing signal.** The reason six weeks passed unnoticed is that nothing
reported. Add a small digest — the last N `AutopilotRun` rows per locale, with
created counts and warnings — surfaced where Farjad will actually see it, not
buried in Cloud Run logs. Exact surface is an open question (§8).

### Part B — the two lanes

**News lane** (source-driven). Trigger: a feed item that names a programme we
cover. The Persian piece is not a translation of the English one: it answers
"what does this change for an Iranian applicant" — sanctions and proof of funds,
where the interview happens, which documents need Iranian certification. Same
strict gate: no official citation, no publication.

**Guide lane** (planned). Topics come from Persian search intent and the
differentiators already recorded for the Persian site, which have no English
equivalent and are the reason to have a Persian magazine at all:

- انتقال وجه و اثبات تمکن مالی تحت تحریم
- محل مصاحبه: دبی، ایروان، آنکارا، تفلیس
- تفاوت منتورشیپ با «مؤسسه مهاجرتی»
- مدارک ایرانی: ترجمه رسمی، تأییدیه تحصیلی، روزنامه رسمی

These need a Persian topic backlog the planner can draw from, rather than the
planner inventing topics from the site's own pages.

### Part C — European sources

Add the authorities the site now leads with. Each needs a feed or news page that
is actually machine-readable — **which is a spike, not an assumption**:

| Authority | Country | To check |
|---|---|---|
| Migri | Finland | news feed? |
| Business Finland | Finland | press releases? |
| SIRI / nyidanmark | Denmark | news page format |
| IND | Netherlands | news feed? |
| Startup Estonia | Estonia | blog feed? |

`SOURCES` already carries `enabled` and `freshDays`, so adding entries is
mechanical once the URLs are known. Any authority without a usable feed is left
out rather than scraped.

## 6. Out of scope

Translating the existing twenty English articles · a separate Persian editorial
calendar UI · changing the English lanes · Persian social distribution.

## 7. Success criteria

1. `/fa/rss.xml` returns items, and `/fa/blog` lists them.
2. A Persian article that fails the citation gate is visible as a warning within a
   day, without anyone reading Cloud Run logs.
3. At least one published Persian guide covers a topic with no English equivalent.
4. No Persian article makes a programme claim without an official citation.
5. European feed items reach the Persian lane, not only Canadian ones.

## 8. Open questions

- Where should the autopilot digest surface — email, Telegram, or an admin banner?
- Persian cadence: keep the documented 2/day, or fewer and longer?
- Does the guide lane's Persian topic backlog live in the repo as a typed module,
  or in the database so it can be edited from the admin console?
