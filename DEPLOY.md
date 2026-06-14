# Deploying to Google Cloud (Cloud Run)

This app is container-ready (`output: 'standalone'`, listens on `$PORT`/`8080`).
Below is an end-to-end Cloud Run setup with Cloud SQL (Postgres), Cloud Storage
(images), and Cloud Scheduler (AI auto-pilot cron).

Set these once:

```bash
export PROJECT_ID=your-project
export REGION=us-central1
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

## 5. AI auto-pilot cron — Cloud Scheduler

Generates one queued article per run via `/api/cron/generate`:

```bash
export RUN_URL=$(gcloud run services describe $SERVICE --region $REGION --format='value(status.url)')
gcloud scheduler jobs create http svr-ai-writer \
  --location $REGION \
  --schedule "0 */6 * * *" \
  --uri "$RUN_URL/api/cron/generate" \
  --http-method GET \
  --headers "Authorization=Bearer YOUR_CRON_SECRET"
```

---

## 6. Post-deploy SEO checklist

- `https://yourdomain.com/robots.txt` → lists your real `Sitemap:`/`Host:`
- `https://yourdomain.com/sitemap.xml` → URLs use your real domain
- View source on a blog post → `<link rel="canonical">`, `og:*`, and
  `application/ld+json` (BlogPosting + BreadcrumbList + FAQPage) present
- Submit the domain + sitemap in **Google Search Console** and **Bing Webmaster
  Tools** to kick off indexing.
```
