#!/bin/sh
set -e

mkdir -p /app/data

echo "Running Prisma migrations..."
npx prisma migrate deploy

if [ "${RUN_SEED:-false}" = "true" ]; then
  echo "Seeding database..."
  npx tsx prisma/seed.ts
fi

echo "Starting Next.js..."
exec node server.js
