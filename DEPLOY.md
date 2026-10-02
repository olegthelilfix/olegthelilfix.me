# Hetzner deployment through GitHub Actions

Every release is an immutable Git revision containing both application code
and content. GitHub Actions builds one Next.js image, publishes it to GHCR,
uploads the Compose/Caddy configuration and updates the Hetzner server over
SSH.

| Service | Public address | Host exposure |
|---|---|---|
| Next.js | `https://olegthelilfix.me` | through Caddy only |
| Caddy | ports 80/443 | public TLS endpoint |

## 1. Server preparation

Use a supported Ubuntu or Debian release with Docker Engine, the Docker Compose
plugin and an SSH server. Create a non-root deployment user:

```bash
adduser --disabled-password --gecos "" deploy
usermod -aG docker deploy
install -d -o deploy -g deploy -m 0750 /opt/olegthelilfix
install -d -o deploy -g deploy -m 0700 /home/deploy/.ssh
install -o deploy -g deploy -m 0600 /dev/null /home/deploy/.ssh/authorized_keys
echo '<DEPLOY_PUBLIC_KEY>' >> /home/deploy/.ssh/authorized_keys
```

Allow SSH, TCP 80/443 and UDP 443 in the firewall. Port 3000 must remain
private.

## 2. GitHub configuration

Create the `production` Environment and add:

| Secret | Value |
|---|---|
| `HETZNER_HOST` | server IPv4 address or DNS hostname |
| `HETZNER_SSH_PRIVATE_KEY` | dedicated deployment private key |
| `HETZNER_SSH_KNOWN_HOSTS` | verified SSH host-key line |

Optional variables:

| Variable | Default |
|---|---|
| `HETZNER_SSH_USER` | `deploy` |
| `HETZNER_SSH_PORT` | `22` |
| `HETZNER_DEPLOY_PATH` | `/opt/olegthelilfix` |
| `AUTO_DEPLOY_ENABLED` | unset; set to `true` for deploys after successful CI |

The workflow uses its short-lived `GITHUB_TOKEN` for GHCR. No registry token
is stored on the server.

## 3. DNS

```text
olegthelilfix.me        A     <SERVER_IPV4>
www.olegthelilfix.me    A     <SERVER_IPV4>
```

The old `cms.olegthelilfix.me` and `mcp.olegthelilfix.me` records are no
longer needed and should be deleted. Add AAAA records only when IPv6 is
configured and firewalled.

## 4. Deploy

Open **Actions -> Deploy to Hetzner -> Run workflow**. There is no bootstrap
mode and no application-secret setup.

The deploy:

1. builds and publishes the web image tagged with the exact Git SHA;
2. uploads `docker-compose.yml` and `Caddyfile`;
3. pulls the image on Hetzner;
4. starts Caddy and Next.js with health checks;
5. updates `/opt/olegthelilfix/current`.

Verify:

```bash
npm run smoke -- https://olegthelilfix.me

ssh -i ~/.ssh/olegthelilfix_deploy deploy@<SERVER>
cd /opt/olegthelilfix/current
docker compose ps
docker compose logs --tail=100 caddy web
```

## Migrating from Strapi

The first file-content release runs Compose with `--remove-orphans`, which
stops and removes the retired `cms`, `mcp` and `db` containers. Docker
volumes containing the previous database and uploads are deliberately retained
for rollback.

After the new site has been verified and the old content has been backed up,
list the retained volumes:

```bash
docker volume ls --filter name=olegthelilfix
```

Removing those volumes is irreversible and is intentionally not part of the
automated deploy.

The local MCP SSH tunnel and `oleg_strapi` Codex configuration can be removed
after migration; they are no longer used by the site.

## Publishing content

1. edit files in `content/`;
2. run `npm run check`;
3. commit and push;
4. CI validates and builds the exact content revision;
5. automatic deploy runs when `AUTO_DEPLOY_ENABLED=true`.

## Rollback

Previous Git-SHA images and release directories remain available. Re-run the
workflow from a known-good Git tag or branch. The retained legacy CMS volumes
allow a manual rollback to a pre-migration release until they are explicitly
removed.

## Troubleshooting

- Docker permission denied: log out and back in after adding `deploy` to the
  Docker group.
- Host-key verification failed: compare the new fingerprint in Hetzner Console
  before updating the GitHub secret.
- GHCR pull denied: verify package access and Actions `packages: write`.
- TLS pending: check DNS and inbound TCP 80/443.
- Content did not change: confirm the edited file was committed and that the
  deployed `RELEASE_SHA` matches the commit.
