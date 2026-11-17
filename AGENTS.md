@C:\Users\jamali.a\.codex\RTK.md

# Repository guidance

## Project and ownership

This is a bilingual towing and roadside assistance app: Next.js App Router,
React, TypeScript, Tailwind CSS, and Prisma with SQLite. Keep the single-app,
single-node deployment model unless the task explicitly changes it.

- `src/app/[locale]/`: public pages and admin routes.
- `src/app/actions/`: server mutations; validate input and authorize here.
- `src/components/`: public, admin, shared, and reusable UI components.
- `src/lib/`: authentication, Prisma, validation, data access, and formatting.
- `src/lib/i18n/` and `messages/`: locale routing and UI dictionaries.
- `prisma/`: schema, committed migrations, and seed script.
- `src/proxy.ts`: locale routing at the request boundary.

Read the relevant implementation before editing. Extend the existing owner or
helper rather than duplicating logic. Preserve unrelated working-tree changes.

## Behavior to preserve

- Persian is the default locale with unprefixed URLs and RTL layout. English
  uses `/en` and LTR layout. Use `localizedPath` for localized links; coordinate
  routing changes with `src/proxy.ts` and the locale helpers.
- Update both `messages/fa.json` and `messages/en.json` for UI copy. Business
  content uses paired `*Fa` / `*En` database fields. Reuse the existing date,
  digit, and currency formatting helpers.
- Store monetary amounts as integer Toman. Keep vehicle IDs and request status
  values consistent with their owning definitions and the Prisma schema.
- Protect admin pages on the server and check `requireAdmin` in each protected
  mutation. A hidden button or route layout alone is not authorization.
- Validate untrusted input with the existing Zod schemas. Preserve request
  submission safeguards: rate limiting, honeypot validation, active-service
  checks, and the existing soft duplicate guard. The rate limiter is per process.
- Keep database and authentication code on the server. Never expose session
  secrets, password hashes, or customer contact/location data in public output.

## Data and environment

Use `.env.example` and `README.md` for setup; do not commit secrets or SQLite
database files. `data/` contains persistent application data, not disposable
build output. Do not reset or replace it to make a check pass.

Change the schema through Prisma and commit migrations. Use `db:migrate` for
development migration work and `db:deploy` to apply committed migrations.
Review the target database before running either. Seeding updates services,
business settings, and the admin password from the environment, so it is not a
read-only verification step.

## Commands and verification

Follow the imported RTK instructions: prefix shell commands with `rtk`; use
`rtk proxy` when a command needs raw execution.

```sh
rtk npm run dev       # local development
rtk npm run lint      # ESLint
rtk npm run build     # production build and TypeScript checks
rtk npm run db:migrate
rtk npm run db:deploy
rtk npm run db:seed
```

Run the smallest checks appropriate to the change. For application changes,
run lint and build when feasible; check affected flows in both locales and
screen sizes for UI changes. There is no configured automated test script.
`scripts/smoke-request.ts` inserts a real database row and does not exercise the
submission action; use it only against an intentional test database.
Documentation-only changes need a diff review, not an application build.
Report what changed, what was verified, and any material limitations.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
