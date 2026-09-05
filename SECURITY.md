# Security status

## Reporting

Do not open a public issue for a suspected vulnerability or exposed secret.
Contact `hello@olegthelilfix.com` with reproduction steps and affected URLs.

## Dependency policy

- Frontend production dependencies must pass `npm audit --omit=dev --audit-level=high`.
- CMS production dependencies must pass at `critical` and are reviewed manually at `high` because Strapi controls a large transitive admin-panel tree.
- Never run `npm audit fix --force` without reviewing the proposed major-version changes and rebuilding both applications.

## Known upstream exception

As of 2026-08-21, Strapi 5.52.1 depends on an Admin AI SDK chain that resolves
`@ai-sdk/provider-utils` 3.0.x. npm reports GHSA-866g-f22w-33x8 and offers only
an incompatible Strapi downgrade or AI SDK major override. The affected code is
part of the authenticated Strapi admin build, not the public Next.js frontend.

Mitigations:

- keep the CMS admin hostname access-restricted where practical;
- do not expose the initial admin registration publicly;
- monitor Strapi releases and remove this exception as soon as a compatible fix ships;
- treat any new `critical` advisory as release-blocking.
