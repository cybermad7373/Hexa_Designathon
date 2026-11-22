# Security standard

Security is a design input, not a hardening pass. The scaffold covers the baseline; the build must
cover the product-specific surface.

## Threat model

### Assets

- User identity, sessions, and credentials.
- Tenant data and cross-tenant isolation.
- Mutations that change access, money, status, or ownership.
- API keys, database URLs, and third-party tokens.
- Audit history.

### Actors

- Anonymous visitor.
- Authenticated member of one workspace.
- Malicious member of another workspace.
- Abusive automation or scraper.
- Compromised third-party integration.

### Surfaces

- Auth and session endpoints.
- Every route handler and server action.
- File uploads and URL fetches.
- Webhooks and third-party callbacks.
- Admin or internal routes.
- Email templates, reset links, and the email worker.
- Logs, error messages, and client bundles.

## OWASP Top 10 mapping

| Risk                       | Control in this repo                                                             |
| -------------------------- | -------------------------------------------------------------------------------- |
| Broken access control      | Server-side membership checks, tenant-scoped queries, cross-tenant tests          |
| Cryptographic failures     | Managed auth library or hashed sessions, TLS, secrets out of source              |
| Injection                  | Prisma parameterization, Zod validation, no string-built SQL                     |
| Insecure design            | Phase 02 edge cases, Phase 05 threat model, rate limits, idempotency             |
| Security misconfiguration  | Security headers, `poweredByHeader: false`, env validation, least-privilege CI   |
| Vulnerable components      | Dependabot, `npm audit --omit=dev --audit-level=high` in the release gate        |
| Auth failures              | Rate-limited auth, httpOnly cookies, short session TTL, no token in localStorage |
| Data integrity failures    | Transactions, unique constraints, audit log, idempotency keys                    |
| Logging failures           | Structured logs with request id, secret redaction, no PII in client errors       |
| SSRF                       | Allowlist outbound hosts, block private IP ranges, timeouts on fetches            |

## Authentication

- Use a maintained library unless the demo genuinely needs only a seeded single-user mode.
- Cookies: `httpOnly`, `secure` in production, `sameSite=lax` or `strict`.
- Session TTL is short; rotate the session on login and privilege change.
- Rate limit login, signup, password reset, and magic-link requests.
- Never reveal whether an email exists in a login error.
- Never log passwords, tokens, or reset links.
- Disable demo mode in production or protect it with a server-side flag and a visible banner.

## Authorization and tenancy

The server is the only authority.

```ts
const actor = await requireActor();
const membership = await requireMembership(actor.id, workspaceId, ["OWNER", "ADMIN"]);
```

Rules:

- Resolve `workspaceId` from the session or the authorized resource, never from the request body.
- Check membership and role before reading or writing tenant data.
- Filter every tenant query by `workspaceId`.
- Return `404` instead of `403` when revealing existence is a leak.
- Test with two workspaces: user A must never read or mutate workspace B.
- Client-side hiding is UX, not authorization.

### RBAC

- Use the pure policy module in `src/server/auth/rbac.ts`; do not scatter role checks through UI code.
- Check an explicit permission, not a role string, at the route or service boundary.
- Only an `OWNER` may grant `OWNER` or `ADMIN`. An `ADMIN` may grant `MEMBER` or `VIEWER`.
- An `ADMIN` may remove members and viewers, but not peers or owners.
- The last `OWNER` cannot be removed or demoted. Test this with a seeded single-owner workspace.
- Role changes are audited with actor, target, old role, new role, and request id.
- A user cannot change their own role unless the product explicitly allows it and the last-owner rule
  still holds.

## Email security

Email is an untrusted output channel and a phishing target.

- Treat template variables as hostile. Escape HTML and strip CRLF from every subject.
- Allow only `http` and `https` in call-to-action links. Never render a user-supplied URL raw.
- Never put passwords, session tokens, or secrets in an email body or subject.
- Password-reset links are single-use, short-lived, hashed at rest, and never logged.
- The cron endpoint requires `CRON_SECRET` and compares it in constant time.
- Rate limit invitation and password-reset enqueue paths per actor and per recipient.
- Check `EmailSuppression` before enqueue. Process bounces and complaints into the suppression list.
- Transactional email cannot be disabled by preference; product and marketing can.
- Do not log recipient addresses, rendered bodies, or provider payloads.
- Configure SPF, DKIM, and DMARC on the sending domain before production.
- Use a dedicated subdomain for transactional mail to protect the primary domain's reputation.
- Local development uses Mailpit. Never send real user email from a dev or test environment.

## Input validation

- Every request body, query string, route param, header used in logic, and third-party payload goes
  through Zod.
- Reject unknown keys where practical. Cap string lengths, array sizes, and numeric ranges.
- Validate file type by content, not only extension. Cap size. Store outside the web root.
- Validate URLs before fetching them. Allowlist schemes and hosts.
- Parse dates as ISO strings and normalize to UTC.
- Treat all client input as hostile, including ids, cursors, and sort fields.

## Output and injection

- React escapes by default. Never use `dangerouslySetInnerHTML` with user content.
- If rich text is required, sanitize with a maintained library and an allowlist.
- Prisma parameterizes queries. Never interpolate SQL.
- Do not echo raw provider or database errors. Use `AppError` and the error envelope.
- Set `Content-Type: application/json` on API responses.
- Do not put secrets or internal ids in client bundles.

## CSRF

- Cookie-authenticated state-changing requests need CSRF protection.
- Prefer `sameSite=lax` or `strict` cookies plus an origin check.
- For cross-site forms or webhooks, use a signed token or signature verification.
- Never accept state-changing GET requests.

## Security headers

The scaffold sets:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` with camera, microphone, geolocation, and browsing-topics disabled
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`
- `Strict-Transport-Security` in production
- A report-only CSP as a starting point

Before shipping, replace the report-only CSP with an enforcing, nonce-based policy and remove
`unsafe-inline` and `unsafe-eval` from `script-src`. Verify with the browser console and the deployed
headers.

## Secrets

- No secrets in source, tests, screenshots, or client bundles.
- `.env` is ignored. `.env.example` contains placeholders only.
- Use the platform's secret store in deployed environments.
- Rotate any secret that appears in a log or a recording.
- Do not pass secrets as build arguments to Docker.
- CI uses placeholder secrets and never real production credentials.

## Rate limiting

- Auth, signup, password reset, invitation, upload, and write endpoints are rate limited.
- Key by user id when authenticated, otherwise by IP.
- Return `429` with `Retry-After`.
- The included in-process limiter is per instance. Use Redis for multi-instance deployments.
- Apply per-tenant quotas for expensive operations.

## Audit logging

Write an `AuditLog` row for mutations that change:

- Membership, role, or ownership.
- Money, billing, or plan.
- Status of a critical entity.
- Deletion or export of data.
- Authentication events that matter (login failure bursts, session revocation).

Record actor, workspace, action, entity, entity id, request id, IP, and user agent. Do not store
secrets or full PII payloads in metadata.

## Logging and privacy

- Structured JSON logs with request id, route, status, latency, actor id, and workspace id.
- Redact authorization headers, cookies, passwords, tokens, API keys, and PII.
- Log 5xx with stack traces server-side only.
- Do not log request bodies by default.
- Set a retention policy for production logs.
- Collect the minimum PII needed for the product. Document retention in the solution design.

## SSRF and outbound requests

- Allowlist hosts for user-supplied URLs.
- Block loopback, link-local, and private IP ranges.
- Follow redirects only within the allowlist.
- Set connect and read timeouts.
- Never return raw upstream responses or headers to the client.

## Dependencies

- Dependabot is enabled.
- CI and the release gate audit production dependencies at `high`; the baseline is zero findings.
- Transitive security fixes are pinned through `overrides` in the root `package.json` (`postcss`,
  `effect`, `deepmerge-ts`) until Next.js and Prisma ship patched ranges. Re-check the pins on every
  major upgrade and remove them once the parent ranges include the fixes.
- Remove unused packages before submission.
- Do not add a package for a one-line utility.
- Pin major versions and review lockfile changes.

## Deployment

- TLS only. HSTS in production.
- Managed Postgres with backups and least-privilege credentials.
- No database port exposed publicly.
- Separate development, preview, and production secrets.
- Health checks do not reveal secrets or internal topology.
- Rollback plan documented in [DEPLOYMENT.md](DEPLOYMENT.md).

## Incident response

If something breaks or leaks:

1. Stop the bleeding: disable the route, rotate the secret, or roll back.
2. Preserve evidence: logs, request ids, audit rows.
3. Assess scope: which tenants, which data, which window.
4. Fix the root cause and add a regression test.
5. Record the incident and the follow-up in the release report.

At a hackathon, tell the team lead immediately. Do not hide a security issue to protect the demo.

## Security release checklist

- [ ] Auth and session cookies are configured correctly.
- [ ] Every workspace read and write checks membership server-side.
- [ ] RBAC checks use explicit permissions; escalation guards are tested.
- [ ] Last owner cannot be removed or demoted.
- [ ] Cross-tenant access tested with two workspaces.
- [ ] Every boundary input is validated with Zod.
- [ ] Errors use the standard envelope; no stack traces or SQL leak.
- [ ] Security headers are present on the deployed URL.
- [ ] CSP is enforcing, or the gap is documented with a reason.
- [ ] Rate limits cover auth and write endpoints.
- [ ] Audit log covers access, money, status, and ownership changes.
- [ ] Email templates escape variables, strip CRLF, and allow only http(s) links.
- [ ] Cron endpoint is secret-protected and constant-time compared.
- [ ] Reset and invitation links are short-lived, single-use, and never logged.
- [ ] Suppression and preference checks run before enqueue.
- [ ] No secrets in the repo, client bundle, logs, or screenshots.
- [ ] `npm run security:audit` passes at high severity.
- [ ] Demo credentials are scoped, rotated, and safe to share.
