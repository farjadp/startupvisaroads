#!/bin/sh
# ============================================================================
# docker-entrypoint.sh
# Start the web server. Migrations are attempted first, but they can no
# longer stop the container from booting.
#
# The old CMD was `prisma migrate deploy && node server.js`. On 20 Sep 2026
# that `&&` took production down for a deploy: Cloud SQL (db-f1-micro, ~25
# connection slots) was saturated by the running revision, migrate deploy
# got "remaining connection slots are reserved for non-replication superuser
# connections", exited non-zero, and the server never started — so the
# revision never listened on 8080 and Cloud Run rejected it. A database at
# its connection ceiling is a capacity problem; it should not also be a
# failed deploy.
#
# So: retry (the ceiling is usually transient — the old revision is still
# draining), then start the server regardless, and shout if the migrations
# did not make it, because a silent failure here is schema drift nobody
# hears about.
#
#   RUN_MIGRATIONS=0   skip migrations entirely — set this once migrations
#                      run as their own step before the deploy.
#   MIGRATE_ATTEMPTS   how many tries (default 5, ~2 minutes with backoff).
# ============================================================================
set -u

SCHEMA="prisma/schema.production.prisma"
ATTEMPTS="${MIGRATE_ATTEMPTS:-5}"

# A failed migration must reach a human. The bot credentials are already on
# the service for the content alerts; if they are absent this is a no-op.
alert() {
  [ -n "${TELEGRAM_BOT_TOKEN:-}" ] && [ -n "${TELEGRAM_CHAT_ID:-}" ] || return 0
  # Form-encoded, so spaces become '+'; the message below stays plain ASCII
  # rather than carrying anything else that would need escaping here.
  body="chat_id=${TELEGRAM_CHAT_ID}&text=$(printf '%s' "$1" | tr ' ' '+')"
  wget -q -O /dev/null --post-data "$body" \
    "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" 2>/dev/null || true
}

if [ "${RUN_MIGRATIONS:-1}" = "0" ]; then
  echo "[boot] RUN_MIGRATIONS=0 — skipping migrations"
else
  i=1
  while [ "$i" -le "$ATTEMPTS" ]; do
    echo "[boot] prisma migrate deploy (attempt $i/$ATTEMPTS)"
    if npx prisma migrate deploy --schema="$SCHEMA"; then
      echo "[boot] migrations applied"
      break
    fi
    if [ "$i" -eq "$ATTEMPTS" ]; then
      echo "[boot] ERROR: migrate deploy failed $ATTEMPTS times — starting the server anyway"
      alert "SVR deploy - prisma migrate deploy failed ${ATTEMPTS} times on boot. The server started and the site is up, but the schema may be behind the code. Check the Cloud Run logs."
      break
    fi
    sleep $((i * 5))
    i=$((i + 1))
  done
fi

echo "[boot] starting server on port ${PORT:-8080}"
exec node server.js
