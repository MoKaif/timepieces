# Timepieces

A private register for a watch collection. Track each piece, its valuation, and how the
collection moves over time — persisted to your own PostgreSQL database.

Built with React 19 + TypeScript + Vite on the front end, a small Express API on the back
end, and PostgreSQL for storage. The interface uses the **Midnight Dial** design: a deep
midnight-navy dial, lume-cream text, and aged-brass accents, with monospaced ledger numerals.

## Features

- **Dashboard** — portfolio value readout, subdial stats, recent pieces, and breakdown charts.
- **Gallery** — search, brand filters, and sorting across the whole collection.
- **Add / Edit** — full entry form with image upload (hero, brand logo, gallery) or image URLs.
- **Watch detail** — full-bleed hero, specifications, valuation, and image gallery.
- **Analytics** — value by brand, brand/movement distribution, acquisitions by year, and
  per-piece appreciation.
- **Settings** — export/import the collection as JSON, and clear the register.

## Data & storage

Everything is stored in **PostgreSQL** through the Express API under `/api` — not in the
browser. Data persists across sessions and devices as long as the database is running. Use
Settings → Export any time for a JSON backup.

## Running it

### With Docker (recommended)

Brings up PostgreSQL and the app together:

```bash
docker compose up
```

Then open the app at <http://localhost:3002> (host port 3002 → container 3000). Override with
`TIMEPIECES_PORT`. Data lives in the `postgres_data` Docker volume. The database is also
reachable from the host on port **5433** (container 5432) for tools like `psql`.

### Locally (without Docker)

Requires a running PostgreSQL. Point the app at it with `DATABASE_URL`, then:

```bash
pnpm install
DATABASE_URL=postgresql://timepieces:timepieces@localhost:5432/timepieces pnpm dev
```

The dev server runs Express with Vite mounted in middleware mode, so a single process serves
both the API and the client (with HMR) on one port (default 3000). The `watches` and
`settings` tables are created automatically on first start.

### Production build

```bash
pnpm build     # bundles the client (dist/public) and the server (dist/index.js)
pnpm start     # NODE_ENV=production, serves the built client + API
```

## Configuration

| Variable          | Default                                                        | Purpose                        |
| ----------------- | ------------------------------------------------------------- | ------------------------------ |
| `DATABASE_URL`    | `postgresql://timepieces:timepieces@localhost:5432/timepieces` | PostgreSQL connection string   |
| `PORT`            | `3000`                                                        | Port the server listens on     |
| `TIMEPIECES_PORT` | `3002`                                                        | Host port in `docker-compose`  |

## Project structure

```
client/          React app (Vite root)
  src/pages/     Dashboard, Gallery, AddWatch, EditWatch, WatchDetail, Analytics, Settings
  src/components/ Layout, WatchCard, WatchForm, ui/ (shadcn)
  src/contexts/  CollectionContext (collection state, talks to /api)
  src/lib/       storage (API client), analytics, format (INR), chartTheme
server/
  index.ts       Express app; mounts Vite in dev, serves static in prod
  db.ts          PostgreSQL data layer (watches + settings)
docker-compose.yml  Postgres + app
```

## Scripts

- `pnpm dev` — run the app (API + client) in development
- `pnpm build` — production build
- `pnpm start` — run the production build
- `pnpm check` — TypeScript type-check
- `pnpm format` — Prettier
