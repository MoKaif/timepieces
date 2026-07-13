# Changelog

All notable changes to Timepieces are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
(`MAJOR.MINOR.PATCH`). Commits follow
[Conventional Commits](https://www.conventionalcommits.org/).

## [Unreleased]

## [1.1.0] - 2026-07-13

### Fixed

- Dev server never started the API — `pnpm dev` ran only Vite with no proxy, so every
  `/api/*` request returned `index.html` and nothing persisted. The server now mounts Vite
  in middleware mode, so one process serves the API and the client on a single port.
- New watches were never saved: the client minted a `nanoid` id (incompatible with the DB's
  `UUID` column) and `saveWatch` always issued a `PUT`, which 404'd. Creates now `POST` and
  the server mints the UUID.
- Export produced an unresolved Promise; import, "Clear all watches", and the header
  Export/Import buttons were no-ops. All now work against the API.
- Editing a watch was impossible (the Edit button had no handler and no route existed). Added
  an `/edit/:id` page wired to the API.
- Divide-by-zero in appreciation percentages when purchase price was 0.

### Changed

- Full visual redesign — the **Midnight Dial** system (midnight-navy dial, lume-cream text,
  aged-brass accents, minute-track dividers, monospaced ledger numerals).
- Centralized INR formatting with lakh/crore-aware compact figures.
- `docker compose up` brings up PostgreSQL + the app together; Postgres host port moved to
  5433 to avoid conflicts.
- README and in-app copy now describe PostgreSQL persistence (previously claimed LocalStorage).

### Removed

- Unused `sqlite`/`sqlite3` dependencies and the misconfigured analytics snippet.

## [1.0.0] - 2026-07-11

Initial version control + versioning baseline. Establishes git tracking, the
changelog, and the SemVer/Conventional-Commits convention for Timepieces.
