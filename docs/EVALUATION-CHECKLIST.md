# Evaluation checklist — AI and human review

Use this checklist to verify the repo will pass automated (AI) evaluation, static analysis,
security review, and human inspection. Every box must be checkable with evidence (test name,
file reference, command output, or screenshot). If a box cannot be checked, record the reason
and risk in `docs/discovery/09-release-report.md`.

## 1. Build, format, and type safety

- [ ] `npm run format:check` is green (Prettier).
- [ ] `npm run lint` is green (ESLint, no errors).
- [ ] `npm run typecheck` is green (`tsc --noEmit`, strict).
- [ ] No `any`, `@ts-ignore`, or undocumented non-null assertions in shipped code.
- [ ] No `console.log`, commented-out code, or dead buttons in shipped code.
- [ ] `npm run build` succeeds from a fresh clone.
- [ ] `npm run check` (format + lint + typecheck + test + build) is green.

## 2. Tests and evidence

- [ ] `npm test` (Vitest) is green; every domain rule has a unit test.
- [ ] Unit test coverage is at or above 95% across `src/lib`, `src/server/auth`, and `src/server/email` (`vitest run --coverage`).
- [ ] Coverage threshold is enforced in `apps/web/vitest.config.ts` (statements, branches, functions, lines ≥ 95%).
- [ ] Any file below 95% coverage is flagged in the release report with a waiver (reason, risk, owner).
- [ ] `npm run test:e2e` (Playwright) covers the golden path from seeded data.
- [ ] Rate limiter: fixed window, sliding window log, token bucket, key independence,
  fail-open on store failure, and standard headers are tested (`src/lib/rate-limit.test.ts`,
  `src/lib/rate-limiter.enterprise.test.ts`).
- [ ] Load balancer: round-robin, least-connections, weighted round-robin, unhealthy
  exclusion, dispatch/complete tracking, and failure stats are tested
  (`src/lib/load-balancer.test.ts`).
- [ ] RBAC matrix and escalation guards tested (`src/server/auth/rbac.test.ts`).
- [ ] Errors mapped through `AppError` envelope tested (`src/lib/errors.test.ts`).
- [ ] Every claim in docs/demos has a receipt (test, screenshot, log, or measured number).

## 3. Rate limiter (enterprise)

- [ ] Multiple algorithms: fixed-window, sliding-window-log, token-bucket.
- [ ] Pluggable store (`RateLimitStore`) with in-memory default and Redis path documented.
- [ ] Fail-open behavior: if the store throws, requests are allowed and a warning is logged.
- [ ] Standard HTTP headers: `ratelimit-limit`, `ratelimit-remaining`, `ratelimit-reset`,
  `retry-after`.
- [ ] Named registry (`RateLimiterRegistry`) so middleware reuses configured instances.
- [ ] Input validation: `limit` and `windowMs` must be positive (`AppError`).
- [ ] No `any`; strict TypeScript; structured logging at the route/middleware layer.
- [ ] Redis down degrades to in-process limits without failing reads (documented failure mode).

## 4. Load balancer (enterprise)

- [ ] Strategies: round-robin, least-connections, weighted-round-robin.
- [ ] Active health checks with configurable interval, timeout, and failure threshold.
- [ ] Unhealthy backends excluded from selection; `null` returned when none are healthy.
- [ ] In-flight request tracking for least-connections; `dispatch`/`complete` accounting.
- [ ] Dynamic weight updates and manual health overrides.
- [ ] Per-backend stats including success rate and active requests.
- [ ] `startHealthChecks` / `stopHealthChecks` lifecycle; idempotent start.

## 5. Security (AI evaluator focus)

- [ ] Every external input validated with Zod at the boundary (body, query, params).
- [ ] Server-side authorization on every workspace-scoped read and write (`assertCan`).
- [ ] RBAC permissions checked explicitly; role escalation guarded; last-owner protected.
- [ ] Every tenant query filters by `workspaceId`; no cross-tenant reads.
- [ ] Client-supplied `workspaceId` / `userId` / role never trusted.
- [ ] Errors use `AppError` + standard envelope; no stack traces, SQL, or provider messages leak.
- [ ] Auth cookies httpOnly, secure in production, sameSite.
- [ ] Secrets redacted from logs (Pino redaction); no secrets in the client bundle.
- [ ] Rate limits cover auth and write endpoints.
- [ ] Email cron endpoint secret-protected; reset links short-lived and unlogged.
- [ ] Security headers present; CSP enforced or gap documented.
- [ ] `npm run security:audit` passes at high severity.
- [ ] Mutations changing access/money/status/ownership write an `AuditLog` row.

## 6. Scalability

- [ ] Primary lists cursor-paginated and capped; no unbounded queries.
- [ ] Filters and sorts indexed; no full-table scans on the golden path.
- [ ] App stateless (no in-memory session/job state); safe to run as multiple instances.
- [ ] Shared rate limits/cache have a documented Redis path.
- [ ] External calls have timeouts and bounded retries.
- [ ] Retried writes are idempotent (idempotency keys).
- [ ] Load smoke run recorded or limitation stated.

## 7. Accessibility

- [ ] WCAG AA contrast; no color-only status.
- [ ] Full keyboard path with visible focus states.
- [ ] Labels, alt text, and accessible names present.
- [ ] Reduced motion honored.
- [ ] Tested at 320px and 1440px.

## 8. Performance

- [ ] LCP < 2.5s, INP < 200ms, CLS < 0.1 on the main view.
- [ ] First-load JS < 250 kB gzipped on the main view.
- [ ] Images optimized and sized; no obvious layout shift.

## 9. Reliability and operations

- [ ] Health endpoint works (liveness + readiness).
- [ ] Structured logs include request id; every 5xx logged server-side.
- [ ] Email enqueued through the outbox, never inline in the request transaction.
- [ ] Email templates escaped, with plain-text fallback; preferences/suppression checked.
- [ ] Outbox observable by status and age; failures have a safe error code.
- [ ] `.env.example` matches required variables; no `.env` or secrets committed.
- [ ] Rollback path documented; deployed URL works or fallback recorded.

## 10. UI completeness (every data view / action)

- [ ] Loading, empty, error, and unauthorized states on every data view.
- [ ] Pending, success, and failure feedback on every action.
- [ ] No lorem ipsum, dead buttons, placeholder links, or fake data as real.
- [ ] Brand tokens used (Hexaware blue `#3C2CDA`, Manrope); no off-palette hex.

## 11. Top 1% test (QUALITY-BAR.md)

- [ ] One-sentence insight; a stranger can repeat it after the demo.
- [ ] First screen proves the product in five seconds without a voiceover.
- [ ] Golden path completes cold from seeded data in under three minutes.
- [ ] Every state designed: loading, empty, error, unauthorized, pending, success, failure.
- [ ] Every claim has a receipt.
- [ ] Brand applied without drift.
- [ ] Tenancy and authorization proven by tests.
- [ ] Performance measured on the demo machine.
- [ ] Keyboard-only golden path completes with visible focus.
- [ ] Email moment lands in Mailpit with plain-text fallback.
- [ ] Copy passes the read-aloud test (specific, grammatical, no filler).
- [ ] Judge "what if" questions have a one-line answer and a fallback path.

## 12. Release gate (T-60)

- [ ] Format, lint, typecheck, unit tests, build, e2e all green.
- [ ] Dependency audit: no high/critical production vulnerabilities.
- [ ] Deployed smoke: home, health, golden path.
- [ ] Demo rehearsed twice, timed; fallback recording playable.
- [ ] Release report written with any waivers (reason, risk, owner).
- [ ] `npm run prepare:submission` run; `agent-prompts/` deleted and all references stripped.
- [ ] The submitted commit contains no runbook folder or dangling prompt reference.

## How to run the gate

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run security:audit
npm run release:check
```

Any `npm run check` failure blocks the release; fix only blockers in the final window.
