# Security status

## Reporting

Do not open a public issue for a suspected vulnerability or exposed secret.
Contact `hello@olegthelilfix.me` with reproduction steps and affected URLs.

## Deployment controls

- Frontend production dependencies must pass
  `npm audit --omit=dev --audit-level=high`.
- GitHub Actions connects with a dedicated SSH key owned by the non-root
  `deploy` user.
- The verified host key is pinned in `HETZNER_SSH_KNOWN_HOSTS`.
- The workflow uses a short-lived `GITHUB_TOKEN` for GHCR and logs out on the
  server after each deployment.
- Third-party Actions are pinned to immutable commit SHAs.
- Caddy is the only public container; the Next.js port is internal.

## Content model

The site has no CMS login, database, public content API or runtime content
credentials. Public visibility is enforced centrally in
`src/lib/content.ts`. Secrets and private personal information must never be
committed to `content/`, even when an item uses `visibility: "private"`.
