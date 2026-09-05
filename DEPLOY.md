# Production deployment runbook

This runbook deploys the complete stack on one Linux server:

| Service | Internal port | Public hostname |
|---|---:|---|
| Next.js | 3000 | `olegthelilfix.com` |
| Strapi | 1337 | `cms.olegthelilfix.com` |
| n8n | 5678 | `n8n.olegthelilfix.com` |
| Postgres | 5432 | not public |
| Caddy | 80/443 | all public hostnames |

## Prerequisites

- Linux server with at least 2 CPU, 4 GB RAM and sufficient disk for media/backups;
- Docker Engine and the Docker Compose plugin;
- Git and OpenSSL;
- SSH access with sudo privileges;
- control of DNS for `olegthelilfix.com`;
- inbound TCP 80/443 and UDP 443 allowed; do not expose 1337, 5678 or 5432.

## 1. Prepare the release

Deploy from a Git checkout, not by copying the local working directory. A local
Next.js standalone build may contain a copy of the build-time `.env`.

```bash
git clone <repository-url> olegthelilfix.com
cd olegthelilfix.com
git checkout <release-tag-or-commit>
./scripts/generate-production-env.sh .env
docker compose config --quiet
```

The generator creates mode-600 secrets for the Postgres admin, separate Strapi
and n8n database roles, Strapi tokens and the n8n encryption key. Store an
encrypted copy of `.env` outside the server. Losing `N8N_ENCRYPTION_KEY` makes
stored n8n credentials unreadable.

## 2. Create the first owners privately

Never put a fresh Strapi or n8n instance directly on the public internet. Start
only the database and applications with loopback-only ports:

```bash
docker compose \
  -f docker-compose.yml \
  -f docker-compose.bootstrap.yml \
  up -d --build db cms n8n

docker compose \
  -f docker-compose.yml \
  -f docker-compose.bootstrap.yml \
  ps
```

From your computer, open an SSH tunnel and keep it running:

```bash
ssh -L 1337:127.0.0.1:1337 -L 5678:127.0.0.1:5678 <server-user>@<server-ip>
```

Then create the accounts through the tunnel:

- Strapi: `http://127.0.0.1:1337/admin`;
- n8n: `http://127.0.0.1:5678`.

Use unique passwords and enable MFA if the installed product version supports
it. Confirm that both logins work before continuing.

## 3. DNS and public startup

Create these records pointing to the server public IP:

```text
olegthelilfix.com        A     <server-ip>
www.olegthelilfix.com    A     <server-ip>
cms.olegthelilfix.com    A     <server-ip>
n8n.olegthelilfix.com    A     <server-ip>
```

Add AAAA records only when the server has working public IPv6 and the firewall
permits it. Once DNS resolves, recreate the stack without the bootstrap override:

```bash
docker compose up -d --build --force-recreate
docker compose ps
docker compose logs --tail=100 caddy cms web n8n db
```

Only Caddy should display published host ports. Caddy obtains and renews TLS
certificates automatically.

## 4. Verify

```bash
npm run smoke -- https://olegthelilfix.com

curl -fsS https://cms.olegthelilfix.com/_health
curl -fsS https://n8n.olegthelilfix.com/healthz
```

Also verify manually:

- log in to Strapi and edit a public entry;
- wait at least 60 seconds and confirm the site reflects the edit;
- create a private entry and confirm anonymous `/api/...` requests cannot read it;
- upload a small image and restart the CMS container;
- create a disposable n8n workflow and restart n8n;
- check the site at 375 px width and print-preview the CV.

## Updates

Create a backup before every application or schema update:

```bash
./scripts/backup.sh
git fetch --tags
git checkout <new-release-tag-or-commit>
docker compose up -d --build
docker compose ps
npm run smoke -- https://olegthelilfix.com
```

Do not change the n8n encryption key during an update. The n8n image is pinned;
upgrade it deliberately and read its migration notes before changing the tag.

## Backups

```bash
BACKUP_DIR=/srv/backups/olegthelilfix ./scripts/backup.sh
```

Each backup contains:

- a logical dump of all Postgres roles/databases;
- Strapi uploads;
- n8n runtime data;
- checksums for all archives.

Copy backups to encrypted off-server storage. Store `.env` separately. Retain at
least one known-good backup from before each upgrade and test restoration on a
disposable server or Docker host.

## Rollback

For an application-only regression:

```bash
git checkout <previous-release-tag-or-commit>
docker compose up -d --build
npm run smoke -- https://olegthelilfix.com
```

If a release migrated database schemas incompatibly, stop the application and
restore the pre-release logical dump plus media archives on a disposable/staging
host first. Database restore is destructive; verify the target and backup before
running it.

## Existing legacy Postgres volume

`db/init/01-create-app-databases.sh` runs only when Postgres initializes an empty
data directory. A volume created by the old configuration still has the shared
database role. Do not delete a populated volume. Back it up, create the new roles
manually or migrate into a fresh cluster, and verify both applications before
cutover.

## Troubleshooting

- TLS pending: verify DNS resolves to this server and ports 80/443 are reachable.
- CMS/n8n unhealthy: inspect `docker compose logs cms n8n db`.
- Site shows fallback content: check `docker compose exec web node -e "fetch('http://cms:1337/_health').then(r=>console.log(r.status))"`.
- n8n credentials cannot decrypt: restore the original `N8N_ENCRYPTION_KEY`.
- Disk pressure: inspect `docker system df`, backup size and Docker logs before deleting anything.
