# Bilingual Towing & Roadside Assistance Website

Production-ready Next.js website for a personal towing / roadside assistance business.

- Persian (default, RTL) + English (LTR)
- Public landing page + multi-step online request form
- Admin dashboard (requests, services, business settings)
- SQLite + Prisma (single file database)
- One Next.js app, one Docker container

## Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- SQLite via Prisma ORM
- Zod validation + Server Actions
- Jose signed HTTP-only admin sessions (bcrypt password hashes)
- Leaflet + OpenStreetMap for location picking
- Lightweight JSON dictionaries for i18n (`messages/fa.json`, `messages/en.json`)

## Project structure

```text
src/app/[locale]/          # fa + en routes
  (public)/                # landing, services, contact
  admin/                   # protected dashboard
src/components/            # public, admin, ui, shared
src/lib/                   # prisma, auth, i18n, validation
messages/                  # fa.json / en.json
prisma/                    # schema, migrations, seed
data/app.db                # persistent SQLite file
```

## Local development

### 1. Install

```bash
npm install
```

### 2. Environment

Copy `.env.example` to `.env` and set values:

```bash
DATABASE_URL="file:../data/app.db"
SESSION_SECRET="replace-with-a-long-random-secret-at-least-32-chars"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="ChangeMe123!"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Database migrate + seed

```bash
npm run db:migrate
npm run db:seed
```

The seed script is upsert-based (safe to re-run). It:

- Creates/updates the six initial services and prices from the HTML prototype
- Creates/updates business settings (name + phone `09128184585`)
- Creates/updates the admin account from `ADMIN_USERNAME` / `ADMIN_PASSWORD`

### 4. Run

```bash
npm run dev
```

- Persian site: [http://localhost:3000](http://localhost:3000)
- English site: [http://localhost:3000/en](http://localhost:3000/en)
- Admin (Persian): [http://localhost:3000/admin](http://localhost:3000/admin)
- Admin (English): [http://localhost:3000/en/admin](http://localhost:3000/en/admin)

## Bilingual routing

| URL | Language |
|-----|----------|
| `/`, `/services`, `/contact`, `/admin` | Persian (default) |
| `/en`, `/en/services`, `/en/contact`, `/en/admin` | English |
| `/fa/...` | Redirects to unprefixed Persian URL and stores locale cookie |

Locale preference is stored in the `NEXT_LOCALE` cookie. Persian is the default for new visitors.

## Admin account

1. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env`
2. Run `npm run db:seed`
3. Sign in at `/admin/login`

There is no public registration. Re-running the seed updates the admin password hash to match the current env values.

## Docker deployment

### Build & run

```bash
cp .env.example .env
# edit SESSION_SECRET, ADMIN_PASSWORD, NEXT_PUBLIC_SITE_URL

# first boot: also seed
RUN_SEED=true docker compose up -d --build

# later boots (keep data, no re-seed needed)
docker compose up -d --build
```

SQLite is stored on the host at `./data` and mounted into the container at `/app/data`. The database survives container restarts, recreation, and image updates.

### Nginx Proxy Manager

1. Create a Proxy Host pointing to `towing-web:3000` (or host `IP:3000`)
2. Enable Websockets if desired
3. Force SSL as needed
4. Set `NEXT_PUBLIC_SITE_URL` to the public HTTPS origin (no trailing slash)

No extra reverse-proxy container is required — use your existing NPM instance.

## Database backup & restore

### Backup

```bash
cp ./data/app.db ./backups/app-$(date +%Y%m%d).db
```

Or from Docker:

```bash
docker compose exec web cp /app/data/app.db /app/data/app-backup.db
```

### Restore

1. Stop the app: `docker compose stop web`
2. Replace `./data/app.db` with the backup file
3. Start again: `docker compose start web`

## Prisma commands

```bash
npm run db:migrate   # create/apply migrations (dev)
npm run db:deploy    # apply migrations (prod)
npm run db:seed      # seed services/settings/admin
npm run db:studio    # Prisma Studio GUI
```

## Internationalization

- UI strings: `messages/fa.json` and `messages/en.json`
- Service titles/descriptions and business hero/copy: database fields (`*Fa` / `*En`)
- Persian UI uses RTL + Vazirmatn + Persian digits / Jalali dates where appropriate
- English UI uses LTR + IBM Plex Sans

## Security notes

- Admin routes and mutations are protected on the server
- Sessions use signed HTTP-only cookies
- Public request submissions are rate-limited (in-memory, per instance)
- Honeypot field on the request form
- Admin pages send `noindex`
- Security headers configured in `next.config.ts`

## Assumptions

- Single-node deployment (in-memory rate limit is per process)
- Currency amounts are stored as integer **Toman**
- Vehicle types use stable IDs (`passenger_car`, `suv`, …) with translated labels
- `cacheComponents` is disabled because nearly every page reads SQLite / sessions
