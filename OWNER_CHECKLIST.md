# Owner launch checklist

These items need your accounts, decisions or access and therefore cannot be
completed from the repository alone.

## Repository

- [ ] Restore or create the Git repository: the current working folder has no `.git`.
- [ ] Add a private/public remote and push a clean main branch.
- [ ] Confirm `.env*`, `.next/`, `node_modules/`, `cms/.tmp/` and backups are absent from Git history.
- [ ] If any secret may have been shared or committed, rotate all database, Strapi and n8n secrets.
- [ ] Enable branch protection and require the `CI` workflow before merging.

## Domain and server

- [ ] Provision a Linux server with Docker Compose, at least 2 CPU and 4 GB RAM.
- [ ] Configure SSH keys; disable password SSH login when possible.
- [ ] Allow inbound 80/TCP, 443/TCP and 443/UDP.
- [ ] Confirm 5432, 1337 and 5678 are not public.
- [ ] Create A records for apex, `www`, `cms` and `n8n`.
- [ ] Add AAAA only if IPv6 is actually configured and firewalled.
- [ ] Set DNS registrar auto-renew and account MFA.

## First secure startup

- [ ] Clone a specific release commit/tag onto the server.
- [ ] Run `./scripts/generate-production-env.sh .env` on the server.
- [ ] Save an encrypted off-server copy of `.env`.
- [ ] Run the bootstrap Compose command from `DEPLOY.md`; do not start Caddy yet.
- [ ] Use the SSH tunnel to create the first Strapi administrator.
- [ ] Use the SSH tunnel to create the first n8n owner.
- [ ] Verify both logins, then start the normal Compose stack.
- [ ] Confirm `docker compose ps` reports every service healthy.

## Content and identity

- [ ] Confirm the public name, biography, CV, contact email and dates are accurate.
- [ ] Decide whether the site launches in English only.
- [ ] Replace placeholder photo gradients with real approved media, or explicitly accept the placeholder launch.
- [ ] Reconcile catalogue claims with available entries: currently 12/214 records and 8/46 postcards are seeded.
- [ ] Confirm every item marked `public` is safe to publish; keep sensitive entries private.
- [ ] Confirm `hello@olegthelilfix.com` exists and can receive mail.

## Verification and operations

- [ ] Run `npm run smoke -- https://olegthelilfix.com` after DNS/TLS is live.
- [ ] Verify a Strapi edit reaches the frontend after the 60-second ISR window.
- [ ] Verify a private Strapi record is not returned anonymously.
- [ ] Verify uploads and n8n workflows survive container restarts.
- [ ] Configure an encrypted off-server backup destination.
- [ ] Run `./scripts/backup.sh` and test restoration on a disposable host.
- [ ] Add uptime checks for the site, CMS `/_health` and n8n `/healthz`.
- [ ] Decide whether CMS and n8n should remain IP/VPN-restricted permanently.
- [ ] Set a monthly dependency/OS update reminder and review `SECURITY.md`.
