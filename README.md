# olegthelilfix.me

Personal archive and digital cabinet of curiosities for Oleg Aleksandrov.

The repository contains two applications and their production infrastructure:

- `src/` — Next.js 16 App Router frontend;
- `cms/` — Strapi 5 content management system;
- `docker-compose.yml` — Caddy, frontend, CMS and Postgres;
- `.github/workflows/deploy.yml` — GHCR build and Hetzner deployment;
- `src/data/` — bundled fallback content used when Strapi is unavailable.

## Local development

Requirements: Node.js 22 and npm.

```bash
# Frontend
npm ci
npm run dev

# CMS, in a second terminal
cd cms
npm ci
npm run develop
```

The frontend is available at `http://localhost:3000`, and the CMS admin at
`http://localhost:1337/admin`. `STRAPI_URL` defaults to
`http://localhost:1337`; if Strapi is unavailable, pages use the fallback data.

Copy the example files only when local overrides are needed:

```bash
cp .env.example .env.local
cp cms/.env.example cms/.env
```

## Verification

```bash
npm run check                       # frontend lint, types and production build
cd cms && npm run build             # CMS TypeScript + admin build
npm audit --omit=dev                # frontend production dependencies
cd cms && npm audit --omit=dev      # CMS; see SECURITY.md for upstream exception
```

After starting a production server, verify the public surface:

```bash
npm run smoke -- http://127.0.0.1:3000
```

The smoke test covers every public page, metadata routes, the health endpoint,
404 behavior and required security headers.

## Production

Production is self-hosted with Docker Compose. GitHub Actions publishes
commit-SHA-tagged application images to GHCR and deploys them to Hetzner over
SSH. Only Caddy publishes host ports 80/443. Postgres, Next.js and Strapi remain
on the internal network.

Do not expose CMS before its first owner account exists. Follow the bootstrap
procedure in [DEPLOY.md](./DEPLOY.md), then complete
[OWNER_CHECKLIST.md](./OWNER_CHECKLIST.md).

For local Compose verification:

```bash
docker compose config --quiet
docker compose up -d --build
docker compose ps
```

## Content model

Strapi collection endpoints enforce `visibility=public` in their controllers.
The frontend additionally applies the same filter and follows every pagination
page, so collections larger than the Strapi limit are not truncated.

The current fallback/seed content is an initial catalogue rather than the full
archive. Real photos and final collection totals remain an editorial launch
task, documented in the owner checklist.

## Operational documentation

- [DEPLOY.md](./DEPLOY.md) — GitHub/Hetzner setup, bootstrap, deployment, backup and rollback runbook;
- [OWNER_CHECKLIST.md](./OWNER_CHECKLIST.md) — actions that require domain/server/account ownership;
- [SECURITY.md](./SECURITY.md) — security policy and known upstream dependency exception;
- [CLAUDE.md](./CLAUDE.md) — detailed repository architecture and development conventions.
