# Testing

Tests exist to protect the demo. In ten hours, coverage is not a number; it is confidence on the
golden path plus regression safety on the rules that are expensive to break.

## The pyramid for a hackathon

| Layer       | What it protects                                      | Tool       | Time budget |
| ----------- | ----------------------------------------------------- | ---------- | ----------- |
| Unit        | Domain rules, validation, error mapping, rate limits  | Vitest     | 20 min      |
| Integration | Service + database behavior, tenancy, transactions    | Vitest + Postgres | 20 min |
| E2E         | The one golden path a judge will see                  | Playwright | 20 min      |
| Smoke       | Deployed URL, health, critical assets                 | Playwright / curl | 10 min |
| Manual      | A11y, visual states, copy, edge cases                 | Checklist  | 20 min      |

Cover the rules that would embarrass the demo first, then close the gap to the hard 95% line.

## The 95% test line

This is a release gate, not a target. It applies to `npm run test:coverage`.

- 100% of collected unit tests pass. Zero failures, zero skipped, zero flaky, no `.only` or `.skip`.
- Statements, branches, functions, and lines are each **>= 95%** on every file with unit tests.
- Thresholds are enforced in `apps/web/vitest.config.ts`. The include list names only files that
  have tests; a new tested module is added to it in the same change as its test.
- Do not add an exclusion, a waiver, or a trivial test solely to reach the number. A file below the
  line blocks the release.
- Record the coverage summary and commit id in `docs/discovery/09-release-report.md`.

Full evaluator checklist: `docs/EVALUATION-CHECKLIST.md`.

## What must be tested

- The golden path from seed data to visible result.
- Authorization: user A cannot read or mutate workspace B.
- Validation: missing, malformed, too large, wrong type.
- Error envelope: no stack trace, stable code, request id.
- Idempotency: retrying a create does not duplicate.
- Pagination: limit cap, cursor stability.
- The empty state and the error state.
- The primary mutation's success and failure paths.
- RBAC: every role's allowed and denied permissions, plus escalation guards and last-owner protection.
- Email: template escaping, CRLF stripping, URL allowlisting, preference and suppression behavior,
  idempotent enqueue, retry/failure state, and a Mailpit delivery smoke.

## Commands

```bash
npm run test              # unit tests
npm run test:watch        # watch mode
npm run test:coverage     # coverage report
npm run test:e2e          # Playwright, starts the dev server
npm run check             # format + lint + typecheck + unit + build
npm run release:check     # full gate with timings and a report
```

Playwright browsers are installed once:

```bash
npx playwright install chromium
```

## Unit tests

- Location: `src/**/*.test.ts`.
- Test pure logic, validation schemas, error mapping, rate limiting, RBAC policy, and email rendering.
- No network, no database, no timers that depend on wall-clock time. Inject `now`.
- One behavior per test. Name the behavior, not the function.
- Prefer table-driven tests for validation boundaries.

## Integration tests

Use a dedicated test database, never the demo database.

```bash
DATABASE_URL=postgresql://hexa:hexa@localhost:5433/hexa_test npm run db:push
```

- Test service functions with a real Prisma client.
- Test tenant isolation with two workspaces.
- Test role changes against the last-owner rule.
- Test email enqueue: preference opt-out, suppression, duplicate idempotency key.
- Test the worker: success marks `SENT`, provider failure retries, max attempts marks `FAILED`.
- Test transactions roll back on failure.
- Clean up with a scoped delete, not a full database wipe on shared infrastructure.
- If time is short, cover tenancy and the primary write; skip the rest.

## E2E tests

- Location: `apps/web/e2e/`.
- One spec for the golden path; one smoke spec for home and health; one RBAC boundary spec.
- For email, assert the queued row and the Mailpit message, not a real inbox.
- Use role-based selectors (`getByRole`) and accessible names.
- Seed data before the run; never depend on manual state.
- Assert visible outcomes, not implementation details.
- Run at desktop and mobile width.
- No `waitForTimeout` unless a real animation requires it; use web-first assertions.

## Accessibility checks

- Keyboard-only walkthrough of the golden path.
- Visible focus on every interactive element.
- Labels above inputs; errors associated.
- Contrast check on text, buttons, and muted text.
- Reduced motion enabled in the browser; verify no essential content disappears.
- Headings in order; one `h1` per page.
- Skip link works.

## Security checks

- Two-workspace authorization test.
- Invalid input returns `400` with the envelope.
- Unauthenticated request returns `401`; wrong role returns `403` or `404`.
- Privilege escalation is rejected: admin cannot create admin or owner; last owner cannot be removed.
- Email cron returns `401` without the secret and does not leak queue contents.
- Rendered email escapes `<script>`, strips CRLF from subjects, and blocks `javascript:` links.
- Security headers present on the deployed URL.
- No secrets in the client bundle (`grep` the `.next/static` output for known secret names).
- `npm run security:audit` passes at high severity.

## Load smoke

```bash
npm run build
npm run start
k6 run tests/load/smoke.js
```

Or against the deployed URL:

```bash
BASE_URL=https://your-app.example k6 run tests/load/smoke.js
```

Record the result. If k6 is unavailable, state the limitation in the release report.

## The final 60-minute sequence

T-60 means T-60. Freeze features. No refactors.

| Minute | Action                                                              | Owner    |
| ------ | ------------------------------------------------------------------- | -------- |
| T-60   | Announce freeze. Merge to one deployable branch.                    | Lead     |
| T-58   | `npm run format:check && npm run lint && npm run typecheck`         | Engineer |
| T-52   | `npm run test`                                                      | Engineer |
| T-50   | `npm run test:coverage` — 100% pass, >= 95% on all four metrics      | Engineer |
| T-48   | `npm run build`                                                     | Engineer |
| T-40   | `npm run test:e2e`                                                  | Engineer |
| T-30   | Deploy the frozen build; smoke home, health, and the golden path    | Engineer |
| T-22   | Manual golden path with seed data; check empty and error states     | Product  |
| T-18   | Keyboard and contrast spot check; mobile width check                | Design   |
| T-14   | `npm run release:check` (or stepwise if already run)                | Lead     |
| T-10   | Write `docs/discovery/09-release-report.md` with evidence           | Lead     |
| T-8    | Rehearsal one from a cold start                                     | Everyone |
| T-4    | Fix only demo blockers; re-run affected checks                      | Engineer |
| T-2    | Rehearsal two; confirm fallback recording                           | Everyone |
| T-0    | Submit. Do not start a new feature.                                 | Lead     |

If a check fails at T-20, fix the smallest blocker and re-run that check plus the golden path. Do not
refactor.

## Release report template

Write to `docs/discovery/09-release-report.md`:

```md
# Release report

- Commit:
- Deployed URL:
- Timestamp:
- Node / browser:

## Gate results

| Check | Result | Evidence |
| --- | --- | --- |
| Format | | |
| Lint | | |
| Typecheck | | |
| Unit | | |
| Coverage (>= 95%) | | |
| Build | | |
| E2E | | |
| Audit | | |
| Deployed smoke | | |
| Golden path | | |
| A11y | | |
| Load smoke | | |

## Waivers

- Check:
- Reason:
- Risk:
- Owner:

## Known limitations

- ...

## Rollback

- ...
```

## Flake policy

- A flaky test is a broken test. Fix it or delete it before the demo.
- No retries to hide a race. Playwright retries are for CI network noise, not local determinism.
- If a test depends on time, inject a clock.
- If a test depends on order, isolate state.

## Test data

- Synthetic only. No real customer data.
- Seed idempotently; running it twice must not duplicate the demo.
- Keep one known-good demo account and one second workspace for authorization tests.
- Keep a second user per role for RBAC tests, or create them in the test setup.
- Email addresses must be synthetic (`@example.com` or Mailpit-only).
- Never test against production data.
- Record the seed command in the demo script.
