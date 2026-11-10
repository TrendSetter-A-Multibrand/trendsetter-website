# syntax=docker/dockerfile:1.7

# Self-hosted image of the site (the Russian VPS). Built where the network is
# good and shipped to the server as a file - the server itself reaches npm,
# GitHub and Docker Hub only now and then.
#
#   docker build --secret id=buildenv,src=<env file> -t trendsetter-web .
#
# The env file holds what `next build` needs while it prerenders the pages from
# Storyblok (STORYBLOK_TOKEN, STORYBLOK_SPACE_ID, STORYBLOK_REGION, the
# NEXT_PUBLIC_* values). It is mounted for that one step and never written into
# a layer. Everything else (DATABASE_URL, mail, Rarus, secrets) comes at run
# time from the server's own env file.

FROM node:24-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 NEXT_OUTPUT=standalone
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=secret,id=buildenv,target=/app/.env.production.local \
    npm run build

FROM node:24-bookworm-slim AS run
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 TZ=Europe/Moscow
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.status<500?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
