# Deploying to Google Cloud (Cloud Run)

This app is container-ready (`output: 'standalone'`, listens on `$PORT`/`8080`).
Below is an end-to-end Cloud Run setup with Cloud SQL (Postgres), Cloud Storage
(images), and Cloud Scheduler (AI auto-pilot cron).

Set these once:

```bash
export PROJECT_ID=your-project
# NOTE (6 Sep 2026): production actually runs in europe-west1, not us-central1.
# There is also a stale duplicate service in us-central1, 35 revisions behind
# and serving no traffic — do not deploy to it, and check which service the
# domain points at before believing a curl against a run.app URL.
export REGION=europe-west1
export SERVICE=startupvisaroads
export SITE_URL=https://yourdomain.com   # your real public domain
gcloud config set project $PROJECT_ID
```

---

## 1. Database — Cloud SQL (PostgreSQL)

```bash
gcloud sql instances create svr-db --database-version=POSTGRES_16 \
  --tier=db-f1-micro --region=$REGION
gcloud sql databases create startupvisaroads --instance=svr-db
gcloud sql users create svruser --instance=svr-db --password='STRONG_PASSWORD'
```

Connection name (looks like `PROJECT:REGION:svr-db`):

```bash
export INSTANCE_CONN=$(gcloud sql instances describe svr-db --format='value(connectionName)')
```

`DATABASE_URL` (Cloud Run connects to Cloud SQL over a Unix socket):

```
postgresql://svruser:STRONG_PASSWORD@localhost/startupvisaroads?host=/cloudsql/PROJECT:REGION:svr-db
```

Migrations run automatically on container start
(`prisma migrate deploy` in the Dockerfile `CMD`).

---

## 2. Image storage — Cloud Storage (S3-compatible)

Storing images as base64 in Postgres bloats the DB and hurts Core Web Vitals.
The app uploads to any S3-compatible bucket when `S3_*` env vars are set.

```bash
export BUCKET=svr-media-$PROJECT_ID
gcloud storage buckets create gs://$BUCKET --location=$REGION --uniform-bucket-level-access
# Make objects publicly readable (or front with Cloud CDN):
gcloud storage buckets add-iam-policy-binding gs://$BUCKET \
  --member=allUsers --role=roles/storage.objectViewer
```

Create an **HMAC interoperability key** (Console: Cloud Storage → Settings →
Interoperability → Create a key for a service account). You'll get an
Access Key + Secret. Then set:

```
S3_ENDPOINT=https://storage.googleapis.com
S3_BUCKET=svr-media-...
S3_REGION=us-central1          # must match the bucket location
S3_ACCESS_KEY_ID=<HMAC access key>
S3_SECRET_ACCESS_KEY=<HMAC secret>
S3_PUBLIC_BASE_URL=https://storage.googleapis.com/svr-media-...
```

---

## 3. Build & deploy

Create an Artifact Registry repo once, then build with your domain baked in for
statically-generated pages (uses `cloudbuild.yaml`):

```bash
gcloud artifacts repositories create svr --repository-format=docker --location=$REGION

gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_SITE_URL=$SITE_URL,_REGION=$REGION,_REPO=svr,_SERVICE=$SERVICE
# (or locally) docker build --build-arg NEXT_PUBLIC_SITE_URL=$SITE_URL -t IMAGE . && docker push IMAGE
```

Deploy, wiring in Cloud SQL and all env vars:

```bash
gcloud run deploy $SERVICE \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/svr/$SERVICE \
  --region $REGION --platform managed --allow-unauthenticated \
  --add-cloudsql-instances $INSTANCE_CONN \
  --set-env-vars "SITE_URL=$SITE_URL,NEXT_PUBLIC_SITE_URL=$SITE_URL" \
  --set-env-vars "DATABASE_URL=postgresql://svruser:STRONG_PASSWORD@localhost/startupvisaroads?host=/cloudsql/$INSTANCE_CONN" \
  --set-env-vars "JWT_SECRET=$(openssl rand -hex 32)" \
  --set-env-vars "ADMIN_USERNAME=admin,ADMIN_PASSWORD_HASH=<sha256-hex-of-your-password>" \
  --set-env-vars "CRON_SECRET=$(openssl rand -hex 24)" \
  --set-env-vars "OPENAI_API_KEY=...,FAL_KEY=..." \
  --set-env-vars "TELEGRAM_BOT_TOKEN=...,TELEGRAM_CHAT_ID=..." \
  --set-env-vars "S3_ENDPOINT=https://storage.googleapis.com,S3_BUCKET=$BUCKET,S3_REGION=$REGION,S3_PUBLIC_BASE_URL=https://storage.googleapis.com/$BUCKET" \
  --set-env-vars "S3_ACCESS_KEY_ID=...,S3_SECRET_ACCESS_KEY=..."
```

> Tip: for secrets prefer `--set-secrets` with Secret Manager instead of
> `--set-env-vars`.

Generate the admin password hash:

```bash
node -e "crypto.subtle.digest('SHA-256', new TextEncoder().encode('YOUR_PASSWORD')).then(d=>console.log(Buffer.from(d).toString('hex')))"
```

---

## 4. Custom domain

Map your domain (Cloud Run → Manage Custom Domains, or `gcloud beta run domain-mappings create`).
Make sure `SITE_URL` / `NEXT_PUBLIC_SITE_URL` match it exactly (no trailing slash),
otherwise canonical/sitemap/OG URLs will point at the wrong host.

---

## 5. Content autopilot — Cloud Scheduler

Two writers and a watchdog, all behind `Authorization: Bearer $CRON_SECRET`:

| Route | What it does |
|---|---|
| `/api/cron/autopilot?n=&locale=&publish=1` | Plans briefs from the site's own pages and the immigration calendar, writes, publishes. Always delivers `n`. |
| `/api/cron/autopilot-source?n=&locale=&publish=1` | Harvests IRCC / CIC News / Moving2Canada, reads each item into a fact sheet, writes an original, runs the originality gate. Refuses roughly half of what it reads, so it may deliver fewer than `n`. |
| `/api/cron/autopilot-digest[?hours=26&dry=1]` | Reads the day's `AutopilotRun` rows, decides per locale whether the lane is healthy / degraded / silent / stuck, and sends one Telegram message. `dry=1` returns the message instead of sending it. Requires `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. |
| `/api/cron/social-short[?dry=1]` | On a day nothing was published, posts one idea from the article that has gone longest without attention to the Telegram channel. Does nothing on a day an article published. Requires `TELEGRAM_CHANNEL_BOT_TOKEN` and `TELEGRAM_CHANNEL_ID`. |
| `/api/cron/social-insights[?n=2&dry=1]` | Two or three insight tweets a day, one idea per article, to both X accounts — @ashavidgroup in English inside the standard limit, @FarjadTalks in Persian long-form with the digital-assistant signature. Runs whether or not an article published. |

Add `&dry=1` to any of them for a run that spends nothing on images and saves nothing.
The query string **is** the schedule — there are no `AUTOPILOT_*_PER_DAY` env vars
to change; edit the job URI.

**Two traps.** (1) Call the `run.app` URL, never the Cloudflare-proxied domain:
a run takes minutes and Cloudflare cuts at 100 s (524). (2) The Cloud Run
request timeout must cover a run; raise it once:

```bash
gcloud run services update $SERVICE --region $REGION --timeout=900
```

Schedule (UTC). **Created 6 Sep 2026 in `europe-west1`** — before that date the
project had zero Cloud Scheduler jobs in every region, which is why the blog
only ever updated when someone triggered a run by hand, and why `/fa/blog`
was empty from the day it shipped: nothing had ever called the Persian lane.

Four writing jobs, not five. `svr-autopilot-source-fa` is deliberately **not
created yet**: the Persian lane starts at one planned article a day so its
output can be read before the volume goes up.


```bash
export RUN_URL=$(gcloud run services describe $SERVICE --region $REGION --format='value(status.url)')
export AUTH="Authorization=Bearer YOUR_CRON_SECRET"

gcloud scheduler jobs create http svr-autopilot-en        --location $REGION --schedule "0 6 * * *"  --uri "$RUN_URL/api/cron/autopilot?n=1&locale=en&publish=1"        --http-method GET --headers "$AUTH" --attempt-deadline 900s
gcloud scheduler jobs create http svr-autopilot-fa        --location $REGION --schedule "0 7 * * *"  --uri "$RUN_URL/api/cron/autopilot?n=1&locale=fa&publish=1"        --http-method GET --headers "$AUTH" --attempt-deadline 900s
gcloud scheduler jobs create http svr-autopilot-source-1  --location $REGION --schedule "0 11 * * *" --uri "$RUN_URL/api/cron/autopilot-source?n=1&locale=en&publish=1" --http-method GET --headers "$AUTH" --attempt-deadline 900s
gcloud scheduler jobs create http svr-autopilot-source-2  --location $REGION --schedule "0 14 * * *" --uri "$RUN_URL/api/cron/autopilot-source?n=1&locale=en&publish=1" --http-method GET --headers "$AUTH" --attempt-deadline 900s
gcloud scheduler jobs create http svr-autopilot-source-fa --location $REGION --schedule "0 16 * * *" --uri "$RUN_URL/api/cron/autopilot-source?n=1&locale=fa&publish=1" --http-method GET --headers "$AUTH" --attempt-deadline 900s

# The digest. Runs after the last writing job, reads the day's AutopilotRun
# rows and sends one Telegram message per day. This is the job that makes a
# dead lane visible: without it the pipeline reports its own failures only
# into an HTTP response body that Cloud Scheduler throws away.
gcloud scheduler jobs create http svr-autopilot-digest    --location $REGION --schedule "0 18 * * *" --uri "$RUN_URL/api/cron/autopilot-digest"                          --http-method GET --headers "$AUTH" --attempt-deadline 120s

# The quiet-day channel post. Runs after the last writing job and before the
# digest, so a day that produced nothing still puts something in the channel.
gcloud scheduler jobs create http svr-social-short        --location $REGION --schedule "0 17 * * *" --uri "$RUN_URL/api/cron/social-short"                              --http-method GET --headers "$AUTH" --attempt-deadline 120s

# Insight tweets. Twice a day, spread apart, so the two accounts have a
# steady presence rather than a burst.
gcloud scheduler jobs create http svr-social-insights-1  --location $REGION --schedule "0 9 * * *"  --uri "$RUN_URL/api/cron/social-insights?n=1"                       --http-method GET --headers "$AUTH" --attempt-deadline 180s
gcloud scheduler jobs create http svr-social-insights-2  --location $REGION --schedule "0 15 * * *" --uri "$RUN_URL/api/cron/social-insights?n=1"                       --http-method GET --headers "$AUTH" --attempt-deadline 180s
```

One article per job rather than one job with `n=5`: each article is three
model passes plus three images (two to four minutes), the source writer runs
sequentially, and a job that overruns leaves nothing behind but a half-finished
ledger row. Five small jobs also spread the day's publishing out, which is
better for crawl freshness than one burst.

Retire the old keyword-queue job when these are live:

```bash
gcloud scheduler jobs delete svr-ai-writer --location $REGION
```

Every run leaves a row in `AutopilotRun`; the admin console at
`/en/admin/autopilot` shows the log, the reader's refusals, and a manual trigger.

---

## 6. Post-deploy SEO checklist

- `https://yourdomain.com/robots.txt` → lists your real `Sitemap:`/`Host:`
- `https://yourdomain.com/sitemap.xml` → URLs use your real domain
- View source on a blog post → `<link rel="canonical">`, `og:*`, and
  `application/ld+json` (BlogPosting + BreadcrumbList + FAQPage) present
- Submit the domain + sitemap in **Google Search Console** and **Bing Webmaster
  Tools** to kick off indexing.
```
