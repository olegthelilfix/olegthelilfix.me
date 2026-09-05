@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Next.js 16 (App Router, Turbopack).** See `AGENTS.md` — this Next.js has breaking changes from older versions; consult `node_modules/next/dist/docs/` before relying on remembered APIs.

## What this is

The personal archive site **olegthelilfix.com** — a "digital museum / cabinet of curiosities" for Oleg Aleksandrov. The guiding aesthetic is **managed chaos** — each section is its own small visual world, while global navigation, typography, URLs and accessibility stay consistent.

Two apps live in this repo:
- **Frontend** (repo root) — Next.js 16, the site itself.
- **CMS** (`cms/`) — a Strapi 5 app that backs the content. **Every editorial content type is now served from Strapi** (records, postcards, articles, journey events, projects, memories, hobbies, photos, now entries, plus the `cv` and `home` single types). The frontend always falls back to the local mock module if the CMS is unreachable, so it never breaks. Presentation/navigation config (the collections cabinet `drawers`, and the `journeyCategories` / `articleKinds` / `projectStatuses` + `statusColor` label configs) deliberately stays in `src/data/` — it isn't editable content.

The original single-file prototype (a proprietary "Design Component" `.dc.html` + its runtime) is preserved in `reference/` as the source of truth for content and look. It is not part of the build.

## Commands

Frontend (repo root):

```bash
npm run dev     # dev server (Turbopack) at http://localhost:3000
npm run build   # production build; type-checks + prerenders every route
npm run start   # serve the production build
npm run lint    # ESLint
```

CMS (`cd cms`):

```bash
npm run develop  # Strapi in watch mode at http://localhost:1337 (admin at /admin)
npm run start    # Strapi without watch
npm run build    # build the Strapi admin panel
```

For the full stack, run both. The frontend reads `STRAPI_URL` (see `.env.local`, default `http://localhost:1337`); with the CMS off it silently uses mock data. There is no unit/E2E suite yet, but `npm run smoke -- <base-url>` verifies every route, metadata endpoints, 404 behavior and security headers against a running production server.

**Production / deploy:** the whole stack is containerised in `docker-compose.yml` — `caddy` (auto-TLS reverse proxy, the only service publishing :80/:443), `web` (`Dockerfile`, Next.js standalone), `cms` (`cms/Dockerfile`, non-root Strapi), `db` (Postgres with separate Strapi/n8n roles), and a pinned `n8n` image. Every service has a healthcheck and bounded Docker logs. Caddy routes by domain (`Caddyfile`): `olegthelilfix.com`→web, `cms.olegthelilfix.com`→cms admin, `n8n.olegthelilfix.com`→n8n. Generate `.env` with `scripts/generate-production-env.sh`; create the first CMS/n8n owners privately with `docker-compose.bootstrap.yml`; only then start the public stack. Full procedure, DNS and rollback are in `DEPLOY.md`.

## Architecture

### Content ⟂ presentation (the core rule)

Mock data under `src/data/` is the stand-in for the future CMS: **plain facts only — no colours, transforms, or layout.** Presentation lives in components and CSS Modules. When adding content, thread it through the data module; when adding visuals, keep them out of the data.

- `src/data/types.ts` — all content interfaces + `Visibility` (`public | unlisted | private`). Note the vinyl type is `VinylRecord`, deliberately **not** `Record`, to avoid shadowing TypeScript's built-in `Record<K,V>`.
- One module per content type: `vinyl.ts`, `postcards.ts`, `journey.ts`, `memories.ts`, `cv.ts`, `projects.ts`, `articles.ts`, `hobbies.ts` (also exports `nowEntries` + `photos`), `home.ts`, `collections.ts`. These are now the **fallback** for CMS-backed types and still the live source for the rest.
- Every item has a stable `id` and a `visibility`; some carry light id relations to encode the "everything is connected" idea.

### Backend (Strapi CMS) & the data-access layer

`cms/` is a Strapi 5 app (TypeScript, SQLite in dev — `DATABASE_CLIENT` switches it to Postgres for prod). Content types are defined **as code** (`cms/src/api/<type>/content-types/<type>/schema.json` + factory controller/route/service), not clicked together in the admin, so they're versioned and reproducible. `cms/src/index.ts` `bootstrap()` **seeds** each collection on first boot (from `cms/src/seed/data.ts`, ported from the frontend mock) and **grants the public role** find/findOne — both idempotent. Collection controllers always add `visibility=public`, so anonymous clients cannot bypass privacy by omitting the frontend's filter.

`src/lib/content.ts` (marked `server-only`) is the frontend's data-access layer: one `getX()` per type (`getRecords`, `getPostcards`, `getArticles`, `getJourney`, `getProjects`, `getMemories`, `getHobbies`, `getPhotos`, `getNow`, `getCv`, `getHome`). Each fetches published (`visibility=public`) content from Strapi, follows pagination until every page has been collected, maps the flat Strapi 5 response to the `src/data/types.ts` shapes, and **falls back to the local mock module on any error**. `getCv`/`getHome` hit single types and use `populate` for their components. Server-component **pages** call the getters; client components that need the data (`VinylShelf`, `PostcardDeck`, `JourneyArchive`, `RememberDeck`, `HomeCollage`) receive it as props rather than importing mock directly. Every content route is ISR (`revalidate: 60`), so CMS edits appear without a rebuild.

The CMS seed (`cms/src/seed/data.ts`) is **generated** from the frontend mock modules by `scripts/gen-seed.ts` (`npx tsx scripts/gen-seed.ts`) so Strapi's initial content and the mock fallback never drift — don't hand-edit it.

**To add a new content type**: create a schema + factories under `cms/src/api/` (and components under `cms/src/components/` if nested), add it to `COLLECTION_SEEDS` or `SINGLE_SEEDS` in `cms/src/index.ts` (which also grants public read on boot), extend `scripts/gen-seed.ts`, add a `getX()` mapper in `src/lib/content.ts`, and have the page call it.

### Routing (App Router, real URLs)

Predictable paths replace the old hash routes. Priority sections built in depth: `/` (Home), `/cv`, `/journey`, `/remember`, `/collections`, `/collections/vinyl`, `/collections/postcards`. Supporting sections rendered simply: `/articles`, `/projects`, `/photos`, `/hobbies`, `/now`.

`src/lib/routes.ts` is the **single source of truth** for the nav and the wander button (`navLinks`, `wanderRoutes`) — keep it in sync so nothing points at a 404.

### Server vs client

Pages are **server components** (statically generated). Interactivity is isolated to small **client components** (`"use client"`):

- `components/WanderButton` — random route ≠ current (uses `wanderRoutes`).
- `app/HomeCollage.tsx` — the shifting home collage with density modes **Calm / Normal / Oleg**, persisted to `localStorage` under `archive-density` (read in `useEffect` to avoid hydration mismatch). Density gates which sections render.
- `app/collections/vinyl/VinylShelf.tsx` — record grid + detail modal built on the native `<dialog>` element (Esc-to-close, focus trap and focus restoration come for free).
- `app/collections/postcards/PostcardDeck.tsx` — desk / archive / map view switch + flip cards. The desk's absolute layout collapses to a static list at ≤680px.
- `app/journey/JourneyArchive.tsx` — category filter. `app/remember/RememberDeck.tsx` — cycles the memory set.

### Styling & design system

- **CSS Modules per section** (no Tailwind) — this is what makes each section a distinct "world". Colocated as `*.module.css` next to each `page.tsx`; the lighter supporting pages share `src/app/supporting.module.css`.
- `src/styles/tokens.css` — global tokens: `--acc` (swappable accent), `--paper`, `--ink`, `--page`, spacing, and the four font stacks.
- `src/app/globals.css` — reset, base type, the `.skip-link`, and the two accessibility guards every section inherits: **`@media (prefers-reduced-motion: reduce)`** (kills animation/transition globally) and **`@media print`** (`[data-noprint]` hides chrome; the CV prints clean).
- `src/app/layout.tsx` imports Instrument Serif, Newsreader, IBM Plex Mono and Caveat from pinned `@fontsource` packages. The files are bundled locally, so neither build nor runtime depends on Google Fonts.
- `src/lib/art.ts` — placeholder gradient helpers (sleeve / diagram / photo). Real media arrives with the backend; Stage 1 uses CSS gradients.

### Persistent chrome

`app/layout.tsx` wraps every page with `SiteHeader` (sticky nav + logo→`/` + wander), `SiteFooter`, and a skip link. Header/footer are tagged `data-noprint`.

## Conventions

- Add a route to **both** `navLinks` and `wanderRoutes` in `src/lib/routes.ts`.
- Mark chrome/controls that shouldn't print with `data-noprint="1"`.
- Keep `reference/` untouched — it's an archive of the original prototype.
- Frozen / abandoned / unfinished content is intentional and stays visible (see the Projects statuses); don't "tidy" it away.

## Verifying

Run `npm run check`, `cd cms && npm run build`, then start a production server and run `npm run smoke -- http://127.0.0.1:3000`. CI repeats these checks and builds both Docker images.

`npm run dev`, then confirm: nav renders on every route and the logo returns home; **wander** never 404s and never lands on the current page; **density** (Calm/Normal/Oleg) changes the home collage and survives reload; the **vinyl** modal opens/closes via ✕, backdrop and Esc with focus restored; **postcards** toggle desk/archive/map and flip; **remember** cycles; the **CV** print preview is clean; at 375px there is no horizontal scroll and the postcard desk becomes a list.
