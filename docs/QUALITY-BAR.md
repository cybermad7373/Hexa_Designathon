# Quality bar

A feature is done when it works, fails safely, and can be demonstrated. "It compiles" is not done.
"The happy path works on my machine" is not done.

## The top 1% test

Good products pass the checklist. Top 1% products pass this. One "no" means the build is not
demo-ready, whatever the feature count says.

1. One sentence names the insight; a stranger can repeat it after the demo.
2. The first screen proves the product in five seconds, without a voiceover.
3. The golden path completes cold, from seeded data, in under three minutes.
4. Every state is designed: loading, empty, error, unauthorized, pending, success, failure.
5. Every claim has a receipt: test, screenshot, log, or measured number. No receipt, no claim.
6. Brand is applied without drift: Hexaware tokens, Manrope, one accent, zero off-palette hex.
7. Tenancy and authorization are proven by tests, not just by code review.
8. Performance is measured on the demo machine: LCP, INP, CLS, first-load JS.
9. A keyboard-only run completes the golden path with visible focus.
10. The email moment lands in Mailpit on stage, with the plain-text fallback.
11. Copy passes the read-aloud test: specific, grammatical, no filler, no invented numbers.
12. A judge's "what if…" question has a one-line answer and a fallback path.
13. Unit tests pass 100% with zero skipped or flaky, and coverage is >= 95% on every tested module.
14. The four scored deliverables open from a clean browser and the website delivery gate has
    evidence for every applicable item.

## Definition of done

### Product

- [ ] The golden path works from seeded data with no manual database edits.
- [ ] The primary user can complete the core job in one clear flow.
- [ ] Every data view has loading, empty, error, and unauthorized states.
- [ ] Every action has pending, success, and failure feedback.
- [ ] No dead buttons, placeholder links, lorem ipsum, or fake data presented as real.
- [ ] Copy is specific, grammatical, and free of invented metrics.
- [ ] UI and email use `docs/BRAND.md` tokens; no off-palette hex in shipped code.

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

- [ ] Unit tests cover domain rules, validation, error mapping, RBAC, email, rate limiting, and load
      balancing.
- [ ] `npm run test:coverage` is green: 100% pass, zero skipped or flaky, and >= 95% statements,
      branches, functions, and lines on every tested module.
- [ ] No coverage exclusion or `.skip` was added to reach the number.
- [ ] E2E covers the golden path.
- [ ] `npm run check` is green.
- [ ] `npm run test:e2e` is green.
- [ ] Release report written with the coverage summary.

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

### Submission and delivery gate

- [ ] Repository link points to a public repo with a fresh-clone build and a meaningful commit
      history; no secrets in git history.
- [ ] Slide deck (Google Slides, Canva, OneDrive, or PDF) explains business value, architecture,
      competitive advantage, and roadmap.
- [ ] Demo video (Loom, YouTube, or Google Drive) is 3–5 minutes and shows working functionality
      and key user flows.
- [ ] Solution architecture abstract is formatted text, <= 1000 words, covering the problem,
      technological innovations, and system design.
- [ ] `docs/WEBSITE-DELIVERY-STATUS.md` has a selected profile, every applicable item `Done` or
      `N/A - reason` with evidence, and an owner sign-off, or an explicit `Blocked` record.
- [ ] `docs/EVALUATION-CHECKLIST.md` has no unexplained unchecked item at submission.

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
| Unit tests        | 100% pass, 0 skipped, 0 flaky                    |
| Coverage          | >= 95% statements, branches, functions, lines    |
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
| Brand fidelity         | Token grep for off-palette hex + screenshot      |
| 95% test line          | `npm run test:coverage` summary + commit id      |
| Repo quality           | Fresh-clone build output + commit history        |
| Slide deck             | Share link + slide count + PDF export           |
| Demo video             | URL + duration + flow list                       |
| Architecture abstract  | Word count + link or file path                   |
| Delivery gate          | `docs/WEBSITE-DELIVERY-STATUS.md` evidence rows  |

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
