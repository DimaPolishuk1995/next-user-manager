#!/bin/sh
MAX_ATTEMPTS=10
SLEEP_SECONDS=3

i=1
until pnpm prisma db push --schema=prisma/schema.prisma; do
  if [ "$i" -ge "$MAX_ATTEMPTS" ]; then
    echo "Database still unreachable after $MAX_ATTEMPTS attempts – giving up." >&2
    exit 1
  fi
  echo "DB not ready (attempt $i/$MAX_ATTEMPTS). Retrying in ${SLEEP_SECONDS}s…"
  i=$(( i + 1 ))
  sleep "$SLEEP_SECONDS"
done

pnpm ts-node prisma/seed.ts || true

exec node dist/src/main.js
