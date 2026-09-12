# Knowledge Sources — architecture

Status: phase 1 BUILT (12 Sep 2026); phases 2–4 pending. Owner: Farjad.

Phase 1 as shipped: `lib/knowledge/*` (chunk, embed, adapters/html, adapters/pdf,
digest, sources, ingest, retrieve, admin), `/api/admin/sources*`,
`/api/cron/sources`, `/admin/sources` and `/admin/sources/[id]`. Verified
end to end on a pasted text, a canada.ca page and an uploaded 15-page PDF:
chunks carry page/heading locators, the digest is a fact list, retrieval
ranks an off-topic document out. One deviation from the plan below: the
`SourceArticle` backfill moves to phase 3, where the source-writer lane
starts reading `SourceDocument` — backfilling earlier would mean two tables
holding the same ledger with only one being read.

## 1. What we are building, in one paragraph

An admin-managed **knowledge base** that the autopilot writes *from*. The
admin registers sources (a news URL, an official site to keep watching, a
PDF, a YouTube video). The system ingests each one into plain text, splits it
into citable chunks, embeds them, and keeps a digest. When the writer drafts
an article — from the keyword queue or from a fresh news item — it is handed
an **evidence pack**: the chunks that actually answer the brief, with their
provenance. Every number in the finished article must trace back to a chunk,
or the article is refused. Watched sources are re-read on a schedule; new
items are triaged against our keyword list and only the relevant ones enter
the queue.

This is RAG (retrieval-augmented generation) for the per-topic evidence, plus
a small CAG-style (cache-augmented) layer for the few documents that should
be in *every* prompt on a subject. Section 6 explains why both and not one.

## 2. What already exists (do not rebuild)

| Piece | Where | Keep / change |
|---|---|---|
| RSS harvest of 3 feeds + ledger | `lib/autopilot/sources.ts`, `SourceArticle` | Becomes the first three **watch** sources. Ledger rows become `SourceDocument`s. |
| Fact sheet → article → originality gate | `lib/autopilot/source-writer.ts` | Keep. Its `readSource` step splits into *triage at ingest* and *fact sheet at write time*. |
| Official-host allowlist for citations | `lib/autopilot/official-sources.ts` | Keep; it becomes the default `trust = official` rule for new sources on those hosts. |
| Keyword queue | `AiKeyword`, `content/keywords.ts`, `content/fa/topics.ts` | Keep. It is the relevance filter for watched sources and the retrieval query for the planned lane. |
| Invented-number guard | `lib/autopilot/text.ts` (`inventedNumbers`) | Keep; upgraded from "no numbers we did not give you" to "no numbers not in the evidence pack". |
| Cron pattern | `/api/cron/*` with `CRON_SECRET`, `maxDuration = 300` | Ingestion runs as one more cron route, not a new queue system. |

## 3. Two axes, not four types

The four things the admin asked for are really two independent properties:

| | HTML page | PDF | YouTube |
|---|---|---|---|
| **once** (fetch one time, never again) | news article, a guide page | programme guide, form instructions | a webinar, an interview |
| **watch** (re-check on a schedule) | IRCC news page, a PNP updates page, any RSS/Atom feed | — (a PDF URL can be re-checked for a changed hash, rare) | a channel (later, not v1) |

So the model is `format ∈ {html, pdf, youtube, text}` × `cadence ∈ {once, watch}`.
`text` is pasted content: a transcript, meeting notes, an export from
NotebookLM, anything the admin already has as text. It has no fetch step and
is always `once`. The admin UI shows five buttons ("News link", "Site to
watch", "PDF", "YouTube", "Paste text") because that is how the admin thinks;
the buttons just pre-fill the fields.

A **Source** is what the admin registers. A **Document** is one concrete
thing we read. A once-source has exactly one document. A watch-source grows
documents over time (one per news item).

## 4. Data model (Prisma, both schemas)

```prisma
model Source {
  id           String   @id @default(cuid())
  kind         String   // html | pdf | youtube | text
  cadence      String   // once | watch
  url          String?  @unique   // null for pasted text and uploaded PDFs
  storagePath  String?  // GCS object path for uploaded PDFs
  title        String?
  trust        String   @default("press")   // official | press | commentary
  locale       String?  // en | fa | null (unknown/mixed)
  pinned       Boolean  @default(false)     // CAG: digest goes into every prompt on its topics
  topics       String?  // JSON string[] — keywords/programme paths this source is about
  watchEvery   Int?     // hours; watch only
  watchMode    String?  // feed | listing | sitemap ; watch+html only
  enabled      Boolean  @default(true)
  lastCheckedAt DateTime?
  lastError    String?
  notes        String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  documents    SourceDocument[]
}

// Replaces SourceArticle (backfilled, then dropped).
model SourceDocument {
  id           String   @id @default(cuid())
  sourceId     String
  url          String?  @unique   // null for pasted text / uploads
  title        String
  publishedAt  DateTime?
  fetchedAt    DateTime @default(now())
  contentHash  String   // sha256 of text; a watch re-fetch with same hash is a no-op
  text         String   // full plain text. Working input — NEVER published.
  language     String?
  digest       String?  // ~300-word fact list, model-written at ingest
  relevance    Int?     // 0–5 vs our keyword list (watch docs); null for once docs
  matchedTopics String? // JSON string[]
  status       String   @default("new") // new | ready | ignored | used | failed
  reason       String?
  articleIds   String?  // JSON string[] — articles written from / citing it
  chunks       SourceChunk[]
  @@index([sourceId, status, publishedAt])
}

model SourceChunk {
  id          String  @id @default(cuid())
  documentId  String
  ord         Int
  text        String        // 400–700 tokens, ~80-token overlap
  locator     String?       // "p.12" | "00:14:32" | "h2: Eligibility > h3: Funding"
  embedding   Bytes         // Float32 little-endian, 1536 dims (text-embedding-3-small)
  tokenCount  Int
  @@index([documentId, ord])
}

model IngestJob {
  id         String   @id @default(cuid())
  sourceId   String
  documentId String?
  step       String   // fetch | extract | chunk | embed | digest | triage
  status     String   @default("pending") // pending | running | done | failed
  attempts   Int      @default(0)
  error      String?
  runAfter   DateTime @default(now())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  @@index([status, runAfter])
}
```

Decisions baked in:

- **Embeddings live in Postgres as bytes, cosine computed in Node.** At our
  scale (hundreds of documents, tens of thousands of chunks at most) a full
  scan of candidate chunks after a cheap SQL pre-filter (by topic / source /
  recency) is milliseconds. Switching to `pgvector` is a one-column change
  when we pass ~50k chunks. This avoids an extension dependency the SQLite
  dev schema cannot mirror.
- **Full text is stored**, not capped at 9,000 chars like today. A 60-page
  programme guide is the whole point.
- **contentHash** is what makes "watch" cheap: re-fetch, hash, compare, stop.

## 5. Ingestion pipeline

```
admin adds Source ──▶ IngestJob(fetch)
                          │
        ┌─────────────────┼──────────────────┬──────────────────┐
        ▼                 ▼                  ▼                  ▼
   html adapter       pdf adapter       youtube adapter     text adapter
   (fetch, readability, (URL or GCS upload; (captions only; no    (pasted in admin;
    strip nav/boiler)    text per page,      captions ⇒ admin     no fetch)
                         keep page numbers)  pastes the transcript)
        └─────────────────┴──────────────────┴──────────────────┘
                          ▼
                 SourceDocument(text, hash)
                          ▼
              chunk ──▶ embed ──▶ digest ──▶ triage (watch only)
                                                 ▼
                                        relevance 0–5, matchedTopics
                                        (<3 ⇒ status = ignored, kept in ledger)
```

- **Runs on the existing cron shape**: `GET /api/cron/sources` processes up
  to N pending jobs within the 300 s budget, oldest first, with retry
  back-off. Cloud Scheduler calls it every 15 minutes. Adding a source in the
  admin never blocks on the fetch; the row shows "ingesting…" and polls.
- **Watch sources** get a second cron, `GET /api/cron/sources-watch`, which
  for each due source (a) uses the feed if `watchMode = feed`, (b) otherwise
  fetches the listing page, extracts same-host links, and treats unseen URLs
  as new documents (`listing`), or (c) reads the sitemap (`sitemap`). Feed
  autodiscovery (`<link rel="alternate" type="application/rss+xml">`) runs
  once when the source is created and sets `watchMode` automatically.
- **Triage** is the cheap half of today's `readSource`: given title + first
  1,500 chars + our keyword list, return `relevance`, `matchedTopics`,
  `usable`, `rejectReason`. It runs at ingest so an IRCC page that publishes
  three items a day costs three small calls, and the writer only ever sees the
  ones that scored.
- **Digest** is a 300-word list of discrete, dated, attributed facts. It is
  what the admin sees on the source page, what pinned sources contribute to
  prompts, and what the fact-sheet step starts from.
- **Adapters are the only place that knows a format.** Everything downstream
  works on `{ text, locators }`.
- **Politeness**: one fetch at a time per host, 15 s timeout, our existing
  `VisaRoadsBot` UA, robots.txt honoured. Cloudflare-protected hosts (we
  already know immigration.ca is one) fail with a clear "blocked" error in
  the admin rather than a silent empty document. A paid fetch proxy is a
  later option, not v1.

## 6. Retrieval — how the writer uses it

### 6.1 Evidence pack

```
retrieve(brief, locale, k = 12):
  1. query text  = primaryKeyword + searchQueryEn + workingTitle
  2. candidates  = chunks whose document.status = ready
                   AND (document.matchedTopics ∩ brief.keywords ≠ ∅
                        OR source.topics ∩ brief.keywords ≠ ∅
                        OR source.pinned)
                   -- if that yields < 40 chunks, widen to all ready chunks
  3. score       = 0.65·cosine(embedding, embed(query))
                 + 0.20·bm25-ish keyword overlap on chunk.text
                 + 0.10·trust bonus (official 1.0, press 0.5, commentary 0.2)
                 + 0.05·recency (linear decay over 18 months, none for pdf guides)
  4. take top k, at most 4 per document, dedupe near-identical chunks
  5. pinned sources: add their digest (not chunks) on top, always
  6. render as:
       [S1] IRCC — "Start-up Visa: eligibility" (official, canada.ca, fetched 2026-09-01, h2: Letter of support)
       «chunk text»
       [S2] …
```

The pack is passed to the existing `write` step with two rule changes in the
prompt: *cite `[Sn]` after every factual claim* and *a number not present in
the pack must not appear*. The rendered article gets its "Sources" foot block
built from the `[Sn]` actually used, mapped to the document URLs — which also
feeds our GEO goal (AI engines reward on-page, attributed sourcing).

### 6.2 Post-write check (the gate that makes this worth doing)

`inventedNumbers` today asks "did the model invent numbers we did not give
it?" It becomes: extract every number/date/currency from the body; each must
appear (normalised) in the evidence pack or in `BRAND_FACTS`; otherwise the
article is refused before images are bought, with the offending figures in
the run log. This is the mechanical enforcement of the standing rule "every
number cited to an official source".

### 6.3 Why RAG *and* a CAG layer

- Pure CAG (stuff everything into the 1M-token GPT-4.1 context, rely on
  prompt caching) works while the corpus is under ~150k tokens and breaks
  quietly after: cost per article climbs, and the model attends to the wrong
  document. We are writing several articles a day in two languages; the
  corpus will pass that within weeks of adding PDFs.
- Pure RAG loses the "always keep this in mind" documents — the programme
  guide for the route the article is about, the refund-undertaking scope.
  That is what `pinned` + digest is for: a few hundred tokens per pinned
  source, in every prompt on that topic, cached.
- So: **retrieve chunks per brief; pin digests per topic.** Both are cheap.

### 6.4 The two writing lanes after this change

| Lane | Trigger | Evidence |
|---|---|---|
| Planned (keyword queue) | `AiKeyword` / topics, as today | `retrieve(brief)` — may be empty; then the writer is told so and stays generic, as today |
| Source-driven | a watch document with `relevance ≥ 4` and `usable` | fact sheet from that document **plus** `retrieve(brief)` from everything else, so a news item about a rule change is written against the actual rule text |

A once-source (a news link the admin pasted) enters the source-driven lane
exactly like a watch document that scored 5 — the admin's act of adding it
*is* the triage.

## 7. Admin surface

`/admin/sources`

- Table: kind icon, title, cadence, trust, status (ingesting / ready / blocked /
  error), documents count, last checked, "used in N articles".
- **Add**: five buttons → one form (url, or file upload for PDF, or a
  textarea for pasted text; kind + cadence pre-filled; trust
  auto-set to *official* when the host is in `OFFICIAL_SOURCES`; topics
  multi-select from the keyword list; pinned toggle; watch interval).
- **Source page**: digest, documents list (for watch sources: relevance score
  and matched topics per item, with *ignored* ones visible but folded),
  chunks count, error log, buttons: *Re-fetch*, *Write from this now*
  (enqueues the source-driven lane with `publish` per settings), *Disable*.
- **Test retrieval** box on the index page: type a keyword, see the evidence
  pack the writer would get. This is the debugging tool that makes the
  system trustworthy; build it in phase 1.
- Later: *Articles needing review* — when a watch source re-ingests a document
  with a changed hash, articles in `articleIds` are flagged.

## 8. Safety and legal

- Fetched text is **data, never instructions**: evidence is wrapped in
  delimiters and the system prompt says so; adapters strip scripts, forms
  and hidden text.
- Nothing fetched is ever published. The originality gate (ten-word shingles)
  now runs against every document cited, not only the one the article was
  written from.
- YouTube transcripts and PDFs are working inputs under the same rule; the
  article cites the video/document URL and a timestamp or page.
- Secrets stay in env: `OPENAI_API_KEY` (embeddings + Whisper), optional
  `YOUTUBE_API_KEY` if we use the Data API for channel watching later.

## 9. Phases

1. **Foundation** — models, migration + `SourceArticle` backfill, html, pdf
   (URL **and** upload to a GCS bucket in `visaroads-website`) and text
   adapters, ingest cron, chunk/embed/digest, admin list + add + source page,
   *Test retrieval* box. Nothing changes in what gets published yet.
2. **Writer integration** — `retrieve()`, evidence pack in both lanes, `[Sn]`
   citations, the number gate. This is when article quality changes.
3. **Watch** — the three hard-coded feeds become rows; listing/sitemap modes;
   triage at ingest; `source-writer` reads `SourceDocument`; *Write from this
   now*.
4. **Media + maintenance** — YouTube adapter (captions only), changed-document
   → articles-needing-review queue.

Each phase ships on its own and is useful on its own.

## 10. Decisions (taken 12 Sep 2026)

1. **PDF**: URL and upload, both in phase 1. Uploads go to a GCS bucket in
   `visaroads-website`; Cloud Run has no disk.
2. **Video without captions**: no Whisper. The admin pastes the transcript
   into a `text` source. Keeps every job inside the 300 s cron budget.
3. **Watch sources**: an official source scoring relevance 5 auto-writes
   under the existing publish setting; everything else waits in the admin as
   *suggested*, one click to write.
4. **Production database** is Cloud SQL Postgres (DEPLOY.md). Cosine in Node
   for v1; Cloud SQL supports `pgvector`, so the switch is available when the
   chunk count justifies it.
5. **NotebookLM**: not a dependency. Consumer NotebookLM has no official API;
   unofficial cookie-based clients break on Google's schedule; the Enterprise
   API needs a separate Google Cloud licence. Its exports can be pasted as a
   `text` source. Re-check the API status once before phase 1 starts.
