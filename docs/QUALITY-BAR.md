# Quality bar

A feature is done when it works, fails safely, and can be demonstrated. "It compiles" is not done.
"The happy path works on my machine" is not done.

## Definition of done

### Product

- [ ] The golden path works from seeded data with no manual database edits.
- [ ] The primary user can complete the core job in one clear flow.
- [ ] Every data view has loading, empty, error, and unauthorized states.
- [ ] Every action has pending, success, and failure feedback.
- [ ] No dead buttons, placeholder links, lorem ipsum, or fake data presented as real.
- [ ] Copy is specific, grammatical, and free of invented metrics.

### Engineering

- [ ] TypeScript strict; no `any`, `@ts-ignore`, or undocumented non-null assertions.
- [ ] Every external input is validated with Zod at the boundary.
- [ ] Server-side authorization on every workspace-scoped read and write.
- [ ] RBAC permissions are checked explicitly; escalation guards are tested.
- [ ] Every tenant query filters by `workspaceId`.
- [ ] Mutations that change access, money, status, or ownership write an audit row.
- [ ] Errors use `AppError` and the standard envelope; no stack traces or SQL leak.
- [ ] Lists are cursor paginated and capped; no unbounded query.
- [ ] No N+1 query on the golden path.
- [ ] External calls have timeouts and bounded retries.
- [ ] Retried writes are idempotent.
- [ ] User-facing events enqueue email through the outbox, never inline in the request.
- [ ] Email templates escape variables and have a text version.
- [ ] No secrets, PII, or debug logs in the client bundle.

### Security

- [ ] Auth cookies are httpOnly, secure in production, and sameSite.
- [ ] Cross-tenant access tested with two workspaces.
- [ ] Rate limits cover auth and write endpoints.
- [ ] Last owner cannot be removed or demoted.
- [ ] Email cron endpoint is secret-protected; reset links are short-lived and unlogged.
- [ ] Security headers present on the deployed URL.
- [ ] CSP is enforcing, or the gap is documented.
- [ ] `npm run security:audit` passes at high severity.
- [ ] Demo credentials are scoped and safe to share.

### Scalability

- [ ] Primary list uses cursor pagination.
- [ ] Filters and sorts are indexed.
- [ ] No full-table scan in the golden path.
- [ ] App is stateless; safe to run as multiple instances.
- [ ] Shared rate limits and cache have a Redis path documented.
- [ ] Load smoke run and recorded, or the limitation is stated.

### Accessibility

- [ ] WCAG AA contrast.
- [ ] Full keyboard path.
- [ ] Visible focus states.
- [ ] Labels, alt text, and accessible names present.
- [ ] Reduced motion honored.
- [ ] No color-only status.
- [ ] Tested at 320px and 1440px.

### Performance

- [ ] LCP < 2.5 s on the main view.
- [ ] INP < 200 ms.
- [ ] CLS < 0.1.
- [ ] First-load JS < 250 kB gzipped on the main view.
- [ ] Images optimized and sized.
- [ ] No obvious layout shift.

### Testing

- [ ] Unit tests cover domain rules and error mapping.
- [ ] E2E covers the golden path.
- [ ] `npm run check` is green.
- [ ] `npm run test:e2e` is green.
- [ ] Release report written.

### Operations

- [ ] `.env.example` matches the required variables.
- [ ] Health endpoint works.
- [ ] Structured logs include request id.
- [ ] Email outbox is observable by status and age; failures have a safe error code.
- [ ] Deployed URL works, or the fallback is recorded.
- [ ] Rollback path documented.
- [ ] Build log and release report updated.

### Demo

- [ ] Golden path rehearsed twice from a cold start.
- [ ] Fallback recording exists.
- [ ] Demo data is seeded and stable.
- [ ] Slides and script are in `docs/discovery/10-demo-script.md`.
- [ ] Submission checklist complete.

## Release gate

Run at T-60. No new features after this point.

```bash
npm run release:check
```

| Gate              | Required result                                  |
| ----------------- | ------------------------------------------------ |
| Format            | Pass                                             |
| Lint              | Pass                                             |
| Typecheck         | Pass                                             |
| Unit tests        | Pass                                             |
| Build             | Pass                                             |
| E2E               | Pass                                             |
| Dependency audit  | No high or critical production vulnerabilities    |
| Deployed smoke    | Home, health, golden path                        |
| Demo rehearsal    | Twice, timed                                     |
| Fallback          | Recorded and playable                            |

If a gate fails, fix only blockers. Record any waiver in `09-release-report.md` with the reason, the
risk, and the owner.

## Evidence table

Keep receipts in the release report. Claims without evidence do not count.

| Claim                  | Evidence                                        |
| ---------------------- | ----------------------------------------------- |
| Golden path works      | E2E test name + screenshot or recording         |
| Authz enforced         | Test with two workspaces + code reference        |
| No N+1                 | Query log or code review note                   |
| Fast enough            | Lighthouse or k6 output with environment        |
| Accessible             | Keyboard walkthrough notes + contrast check     |
| Secure                 | Audit output + headers check on deployed URL    |
| RBAC enforced          | Policy tests + two-role e2e or integration test |
| Email delivered        | Mailpit screenshot + outbox status evidence     |
| Scalable               | Load smoke result + pagination/index references |

## Self-score rubric

Score 1–5 per row before submission. Anything below 3 is a fix or a documented risk.

| Area            | 1                         | 3                              | 5                                      |
| --------------- | ------------------------- | ------------------------------ | -------------------------------------- |
| Problem clarity | Vague restatement         | Scoped PRD with metrics        | Sharp insight with evidence            |
| Core flow       | Broken                    | Works with seed data           | Works, recovers, and delights          |
| Design          | Generic template          | Coherent tokens and hierarchy  | Distinctive, accessible, polished      |
| Security        | Client-only checks        | Server authz + validation      | Threat model + audit + tests           |
| Scale           | Unbounded queries         | Pagination + indexes           | Measured under load                    |
| Testing         | Manual happy path         | Unit + e2e                     | Release gate + regression coverage     |
| Demo            | Unrehearsed               | Scripted                       | Rehearsed twice with fallback          |

## The last hour

The final test window is not buffer time. It is scheduled work. Protect it in every scope decision.
A tested three-feature product beats an untested ten-feature product.
