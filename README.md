# olegthelilfix.me

Personal archive and digital cabinet of curiosities for Oleg Aleksandrov.

The site is a single Next.js 16 application. Editorial content is versioned
with the code and compiled into the site:

- `content/` - typed content files and editing guide;
- `src/` - App Router pages, components and presentation;
- `docker-compose.yml` - Next.js and Caddy production stack;
- `.github/workflows/deploy.yml` - GHCR build and Hetzner deployment.

There is no runtime CMS, content API or database.

## Local development

Requirements: Node.js 22 and npm.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Editing content

Edit the modules in [content/](./content/README.md). Pages consume them through
`src/lib/content.ts`, which centralizes public visibility filtering.

```text
content/*.ts -> production build -> immutable Docker image -> Hetzner
```

Run the complete local verification before pushing:

```bash
npm run check
docker compose --env-file .env.docker.example config --quiet
docker compose --env-file .env.docker.example build web
```

After starting a production build, the smoke test covers all public pages,
metadata routes, static assets, 404 behavior and security headers:

```bash
npm run smoke -- http://127.0.0.1:3000
```

## Production

GitHub Actions builds one commit-SHA-tagged web image, pushes it to GHCR and
deploys it to Hetzner over SSH. Caddy is the only Internet-facing container.
See [DEPLOY.md](./DEPLOY.md) for setup, migration and rollback.
