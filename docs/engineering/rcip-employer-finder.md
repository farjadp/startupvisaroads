# RCIP employer finder

`/{en,fa}/data-reports/rcip-employers`. A visitor gives occupation, experience
and language level and sees the designated employers of the 14 RCIP
communities ranked by closeness to that work. Contacts are locked; a signed-in
visitor reveals at most five a month.

## Matching (`lib/rcip-finder/core.ts`)

- **Core tier:** the employer's business type contains one of the occupation's
  keywords (`lib/rcip-finder/occupations.ts`, about 50 occupations written by
  hand, en + fa names and aliases).
- **Related tier:** the employer's NAICS sector is one of the sectors that post
  this occupation nationally (`finder-tables.json`: share at least 10%, at least
  3 postings, top 3, from the October 2026 Job Bank file).
- Order: core, then related; inside a tier, communities that advertised the
  occupation in the data month first; listings the community marks closed last.
- Any of the ~500 NOC codes can be chosen in English or by code; occupations
  without hand-written keywords get only the related tier.

## Contacts and quota

- Contacts leave the database only for rows the visitor has revealed
  (`listEmployers`, `reveal` in `service.ts`). The page HTML has no rows at all.
- Policy, Setting `rcipFinder.contactPolicy`: `all` (default, the owner's
  decision of 26 Nov 2026), `safe` (no low-confidence rows, no rows in the
  communities in `rcipFinder.noContactCommunities` — default North
  Okanagan-Shuswap, Moose Jaw, Pictou County — and named-person emails only
  where the community list published them), `off`.
- Quota: one reveal a month per completed step (account, profile, guide, quiz,
  pledge), five at most, counted from the first of the month UTC. The count
  and the insert run in one serialisable transaction. A row already revealed
  costs nothing.

## Accounts

Passwordless: `POST /api/finder/auth/start` emails a 30-minute signed link
(Resend; `RESEND_API_KEY` / `FINDER_FROM_EMAIL` or the marketing settings);
`/api/finder/auth/verify` sets the `finder_session` cookie (90 days). Tokens
use a key derived from `JWT_SECRET` with a finder-only suffix. `DELETE
/api/finder/me` deletes the account, steps and reveals.

## Limits

In-memory rate limits per instance (`lib/rateLimit.ts`): search 40/min,
occupations 120/min, sign-in 5 per 15 min per IP and 3 per address, reveal
20/hour per user. A query reaches at most 10 pages of 20.

## Loading data

```
node scripts/import-rcip-employers.mjs <rcip_all_classified.csv> --edition YYYY-MM
```

Posts batches of 400 to `/api/agent-data/rcip-employers` (Bearer
`AGENT_REPORTS_TOKEN`). Rows are keyed on community + name + address, so a
re-import updates in place. The CSV stays in the data project; it is never
committed. `finder-tables.json` is rebuilt monthly with
`content/data-reports/rcip_finder_tables.py`.

## Not built yet

- An admin view for `ContactReport` rows (wrong contact, removal) and for the
  policy setting; today both are database rows.
- Retention: delete accounts inactive for 24 months.
