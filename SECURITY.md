# Security policy

This repository is a hackathon build system, but it ships with production expectations.

## Reporting

Do not open a public issue for a vulnerability. Send the details to the team lead or the private
channel named in the event brief. Include the affected route, reproduction steps, and impact.

## Non-negotiables

- Never commit secrets, tokens, private keys, or real customer data.
- Validate every external input at the boundary with Zod.
- Authorize every workspace-scoped read and write on the server. Never trust a client-supplied
  workspace id or role.
- Use parameterized queries only. Prisma covers this; never concatenate SQL.
- Hash passwords with a memory-hard algorithm if the build includes password auth. Prefer a
  maintained auth library over hand-rolled sessions.
- Rate limit authentication, invitation, upload, and write endpoints.
- Keep dependencies patched; `npm audit --omit=dev --audit-level=high` is part of the release gate.
- Redact tokens, cookies, and PII in logs.

The full threat model, checklists, and OWASP mapping live in [docs/SECURITY.md](docs/SECURITY.md).
