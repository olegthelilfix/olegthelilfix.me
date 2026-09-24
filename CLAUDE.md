@AGENTS.md

# Repository guide

This is **olegthelilfix.me**, a Next.js 16 App Router personal archive. Read the
relevant local Next.js documentation under `node_modules/next/dist/docs/`
before changing framework code.

## Architecture

- `content/` is the only editorial source of truth. It contains typed
  TypeScript modules and no presentation logic.
- `src/lib/content.ts` is the server-only access layer. It returns repository
  content and filters collection entries to `visibility === "public"`.
- `src/app/` contains statically generated pages.
- Interactive behavior stays in small client components; the rest remains
  Server Components.
- `src/lib/routes.ts` is the source of truth for navigation and wander routes.
- CSS Modules provide section-specific presentation; global tokens live in
  `src/styles/tokens.css`.

There is no Strapi, MCP content gateway, Postgres database or runtime content
fetch. A content edit is published through commit -> CI -> Docker image ->
Hetzner.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run check
npm run smoke -- http://127.0.0.1:3000
docker compose --env-file .env.docker.example config --quiet
```

## Content conventions

- Keep stable ids when editing existing entries.
- Never commit secrets or non-public personal information.
- `public` entries render; `unlisted` and `private` do not.
- Keep layout, colors and transforms out of factual content unless a field is
  explicitly part of the existing visual model.
- Keep `reference/` untouched.

## Production

The Compose stack contains only `caddy` and `web`. GitHub Actions publishes
one immutable GHCR image and deploys it over SSH. See `DEPLOY.md` for the
runbook and legacy-Strapi migration behavior.
