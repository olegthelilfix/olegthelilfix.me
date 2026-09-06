# Hetzner deployment through GitHub Actions

The production workflow builds the Next.js, Strapi and MCP images, pushes immutable
commit-SHA tags to GitHub Container Registry (GHCR), uploads a small release
bundle over SSH and runs Docker Compose on one Hetzner server. Application
secrets are generated on the server and never pass through GitHub.

| Service | Public address | Host exposure |
|---|---|---|
| Next.js | `https://olegthelilfix.me` | through Caddy only |
| Strapi | `https://cms.olegthelilfix.me` | through Caddy only |
| Strapi MCP | none | server `127.0.0.1:3001` only; SSH tunnel and Bearer token required |
| PostgreSQL | none | Docker network only |

## 1. Prepare the Hetzner server

Use a supported Ubuntu or Debian release with at least 2 vCPU, 4 GB RAM and
enough disk for Docker images, uploads and backups. Install current Docker
Engine, the Docker Compose plugin, OpenSSL and an SSH server from their official
repositories.

Create a non-root deployment user from the Hetzner console or a root SSH
session. Replace the sample public key with the public half of the dedicated
deployment key; never copy the private key to the server.

```bash
adduser --disabled-password --gecos "" deploy
usermod -aG docker deploy
install -d -o deploy -g deploy -m 0750 /opt/olegthelilfix
install -d -o deploy -g deploy -m 0700 /home/deploy/.ssh
install -o deploy -g deploy -m 0600 /dev/null /home/deploy/.ssh/authorized_keys
echo '<DEPLOY_PUBLIC_KEY>' >> /home/deploy/.ssh/authorized_keys
```

Log out and back in as `deploy`, then verify:

```bash
docker version
docker compose version
docker run --rm hello-world
```

Configure the firewall to allow SSH, TCP 80/443 and UDP 443. Do not expose
5432, 1337, 3000 or 3001. Disable SSH password authentication after confirming
key-based access in a second terminal.

## 2. Create and verify the SSH credentials

Generate a dedicated key on your own computer:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/olegthelilfix_deploy -C github-actions-olegthelilfix
```

Add the `.pub` contents to `/home/deploy/.ssh/authorized_keys` as shown above.
Collect the host key only from a trusted network and compare its fingerprint
with `/etc/ssh/ssh_host_ed25519_key.pub` through the Hetzner console:

```bash
ssh-keyscan -H <SERVER_IP_OR_HOSTNAME> > hetzner_known_hosts
ssh-keygen -lf hetzner_known_hosts
```

The workflow deliberately does not call `ssh-keyscan`; an incorrect or changed
host key makes deployment fail instead of silently trusting another server.

## 3. Configure GitHub

In **Settings → Environments**, create an environment named `production`.
Where your GitHub plan supports it, restrict it to `main`/`master` and require a
reviewer. Add these secrets to that environment, or as repository Actions
secrets when environment secrets are unavailable:

| Name | Value |
|---|---|
| `HETZNER_HOST` | server IPv4 address or DNS hostname |
| `HETZNER_SSH_PRIVATE_KEY` | complete contents of `~/.ssh/olegthelilfix_deploy` |
| `HETZNER_SSH_KNOWN_HOSTS` | complete contents of `hetzner_known_hosts` |

Add these Actions variables if the defaults do not match:

| Name | Default |
|---|---|
| `HETZNER_SSH_USER` | `deploy` |
| `HETZNER_SSH_PORT` | `22` |
| `HETZNER_DEPLOY_PATH` | `/opt/olegthelilfix` |

Keep `AUTO_DEPLOY_ENABLED` unset for the first deployment. The workflow uses
the built-in short-lived `GITHUB_TOKEN` for GHCR; no long-lived GitHub PAT is
stored on the server.

## 4. Run the private bootstrap deployment

Open **Actions → Deploy to Hetzner → Run workflow**, select the current release
branch and choose `bootstrap`.

The workflow will:

1. build and publish all three app images with the Git commit SHA;
2. create `/opt/olegthelilfix/shared/.env` with mode `0600` on the server;
3. create a least-privilege Strapi PostgreSQL role/database;
4. start PostgreSQL and Strapi with the CMS port bound only to server loopback;
5. wait until both bootstrap services are healthy.

Create an SSH tunnel from your computer:

```bash
ssh -i ~/.ssh/olegthelilfix_deploy \
  -L 1337:127.0.0.1:1337 \
  deploy@<SERVER_IP_OR_HOSTNAME>
```

Create and verify the first owners before exposing either service:

- Strapi: `http://127.0.0.1:1337/admin`.

In Strapi, open **Settings → API Tokens → Create new API Token**. Create a
`Custom` token named `MCP content editor`. Grant `find`, `findOne`, `create` and
`update` for the content types managed through MCP; do not grant `delete`.
Copy the token immediately because Strapi shows it only once.

Add it to the server environment over SSH:

```bash
ssh -i ~/.ssh/olegthelilfix_deploy deploy@<SERVER_IP_OR_HOSTNAME>
nano /opt/olegthelilfix/shared/.env
```

Set the previously empty value, save and close the editor:

```text
STRAPI_API_TOKEN=<THE_SCOPED_STRAPI_TOKEN>
MCP_WRITE_ENABLED=true
```

`MCP_ACCESS_TOKEN` is generated automatically during bootstrap. Do not replace
it with the Strapi token: the two tokens protect different trust boundaries.

Do not run `bootstrap` again after it succeeds; the server script will reject it.

## 5. Configure DNS and launch production

Point these records to the Hetzner server:

```text
olegthelilfix.me        A     <SERVER_IPV4>
www.olegthelilfix.me    A     <SERVER_IPV4>
cms.olegthelilfix.me    A     <SERVER_IPV4>
```

MCP deliberately has no public DNS record. Delete a pre-existing
`mcp.olegthelilfix.me` A/AAAA record; Caddy does not route this hostname.

Add AAAA only if IPv6 is configured and firewalled. Wait until the records
resolve publicly, then run **Deploy to Hetzner** manually with mode
`production`. Caddy will obtain TLS certificates and only ports 80/443 will be
public.

Verify from your computer:

```bash
npm run smoke -- https://olegthelilfix.me
curl -fsS https://cms.olegthelilfix.me/_health
```

On the server:

```bash
cd /opt/olegthelilfix/current
docker compose ps
docker compose logs --tail=100 caddy cms web db
docker compose logs --tail=100 mcp
```

## Connect Codex to the MCP endpoint

MCP is not reachable from the Internet. Create a separate key that can only
forward connections to this one server port; do not reuse the unrestricted
GitHub deployment key:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/olegthelilfix_mcp -C codex-mcp-tunnel
cat ~/.ssh/olegthelilfix_mcp.pub
```

Append its public-key line to `/home/deploy/.ssh/authorized_keys` on the server,
prefixed exactly as below. Replace the sample key, but keep the restrictions:

```text
restrict,port-forwarding,permitopen="127.0.0.1:3001",command="/usr/bin/false" ssh-ed25519 AAAA... codex-mcp-tunnel
```

Open an SSH tunnel from the computer running Codex and leave this command
running while using the MCP tools:

```bash
ssh -N \
  -o ExitOnForwardFailure=yes \
  -o ServerAliveInterval=30 \
  -i ~/.ssh/olegthelilfix_mcp \
  -L 127.0.0.1:3001:127.0.0.1:3001 \
  deploy@<SERVER_IP_OR_HOSTNAME>
```

In another terminal, verify the tunnel and confirm that an unauthenticated MCP
request is rejected:

```bash
curl -fsS http://127.0.0.1:3001/healthz
curl -sS -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3001/mcp
```

The second command must print `401`. Read the generated gateway token through
SSH without copying it into the repository or shell history:

```bash
grep '^MCP_ACCESS_TOKEN=' /opt/olegthelilfix/shared/.env
```

Expose the value to the environment that launches Codex as
`OLEG_STRAPI_MCP_TOKEN`, then add this to `~/.codex/config.toml` (or a trusted
project's `.codex/config.toml`). Do not put the token itself in that file:

```toml
[mcp_servers.oleg_strapi]
url = "http://127.0.0.1:3001/mcp"
bearer_token_env_var = "OLEG_STRAPI_MCP_TOKEN"
required = true
default_tools_approval_mode = "writes"
```

Restart Codex after the environment variable and tunnel are active, then check
the server with `/mcp`. Read tools are
`list_content_types`, `list_entries`, `get_entry` and `get_single_type`. When
`MCP_WRITE_ENABLED=true`, it also exposes `create_entry`, `update_entry` and
`update_single_type`. Codex asks for approval before write tools. There is
deliberately no deletion tool.

## 6. Enable automatic deployments

After the first production launch is verified, add the Actions variable:

```text
AUTO_DEPLOY_ENABLED=true
```

From then on, a successful `CI` run caused by a push to `main` or `master`
triggers deployment of that exact verified commit. Pull requests never deploy.
GitHub serializes deployments, so two releases cannot modify production at the
same time.

## Server layout and secrets

```text
/opt/olegthelilfix/
├── current -> releases/<git-sha>
├── releases/<git-sha>/
│   ├── docker-compose.yml
│   ├── deployment.env
│   └── ...
└── shared/.env
```

Never delete or regenerate `shared/.env` during an update. Back up this file
separately in encrypted storage.

## Backups

Run before every schema or dependency update:

```bash
cd /opt/olegthelilfix/current
BACKUP_DIR=/srv/backups/olegthelilfix ./scripts/backup.sh
```

The backup contains all PostgreSQL databases/roles, Strapi uploads and
checksums. Copy it off-server and test restoration on a disposable host. The
`.env` backup must be stored separately and encrypted.

## Rollback

Images are tagged with immutable Git commit SHAs and previous release bundles
remain under `releases/`. To roll back, run **Deploy to Hetzner** from a known
good Git tag/branch containing the workflow, choose `production`, and verify the
site. If a release performed an incompatible database migration, restore the
pre-release backup on a disposable host first; database restoration is
destructive.

## Troubleshooting

- `Permission denied` for Docker: log out after adding `deploy` to the `docker`
  group, then log in again.
- `Host key verification failed`: compare the current server host fingerprint;
  update the secret only after verifying the change through Hetzner Console.
- GHCR pull denied: ensure package access is inherited from this repository and
  Actions has read/write package permission.
- TLS pending: verify DNS and inbound TCP 80/443.
- MCP unavailable: verify that the production deployment is current, port 3001
  is bound to `127.0.0.1` on the server, and the local SSH tunnel is running.
- CMS unhealthy: inspect `docker compose logs cms db` from `current`.
- Site shows fallback data: check `docker compose exec web node -e
  "fetch('http://cms:1337/_health').then(r=>console.log(r.status))"`.
