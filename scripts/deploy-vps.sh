#!/usr/bin/env bash
# Builds the site image and ships it to the Russian VPS.
#
#   scripts/deploy-vps.sh https://trendsettermultibrand.online noindex
#   scripts/deploy-vps.sh https://trendsetterstore.ru
#
# The word "noindex" after the address closes the site to search engines; leave
# it out once the domain is the official one.
#
# The address is the only thing that changes when the domain does: Next.js bakes
# it into canonical links, the sitemap and og:image at build time, so a new
# domain means a new image. The server's nginx and certificate are switched
# separately, with ~/trendsetter/enable-https.sh <domain> <email>.
#
# Reads what `next build` needs from .env.local (the Storyblok keys and the maps
# key); nothing else goes into the image. The values reach the build as a Docker
# secret and never land in a layer. The server's own secrets live in its .env.
set -euo pipefail

SITE_URL="${1:?usage: deploy-vps.sh https://domain}"
HOST="${VPS_HOST:-karen@5.35.122.23}"
cd "$(dirname "$0")/.."

ENVFILE="$(mktemp)"
trap 'rm -f "$ENVFILE"' EXIT
grep -E '^(STORYBLOK_TOKEN|STORYBLOK_SPACE_ID|STORYBLOK_REGION|NEXT_PUBLIC_YANDEX_MAPS_KEY)=' .env.local > "$ENVFILE"
echo "NEXT_PUBLIC_SITE_URL=$SITE_URL" >> "$ENVFILE"
[ "${2:-}" = "noindex" ] && echo "NEXT_PUBLIC_SITE_NOINDEX=1" >> "$ENVFILE"

docker build --platform linux/amd64 --secret "id=buildenv,src=$ENVFILE" -t trendsetter-web:latest .
docker save trendsetter-web:latest | gzip | ssh "$HOST" 'gunzip | docker load'
ssh "$HOST" 'cd ~/trendsetter && docker compose up -d web'
echo "deployed with SITE_URL=$SITE_URL ${2:-}"
