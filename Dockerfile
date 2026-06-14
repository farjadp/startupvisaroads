FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Use production schema (postgresql) for build
RUN cp prisma/schema.production.prisma prisma/schema.prisma
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
# Public site origin baked into statically-generated pages (canonical/OG/sitemap).
# Override at build: docker build --build-arg NEXT_PUBLIC_SITE_URL=https://yourdomain.com
# (On Cloud Run you can ALSO set a SITE_URL runtime env var to fix dynamic routes
#  such as sitemap.xml and article canonicals without rebuilding.)
ARG NEXT_PUBLIC_SITE_URL=https://visaroads.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
# Build with a placeholder DATABASE_URL so Next.js doesn't fail at build time
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost/placeholder"
RUN npm run build

FROM base AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "npx prisma migrate deploy --schema=prisma/schema.production.prisma && node server.js"]
