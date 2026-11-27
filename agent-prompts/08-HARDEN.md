# Phase 08 — Harden

**Time:** 6:45–7:45
**Artifact:** `docs/discovery/08-hardening-report.md`
**Goal:** close the gaps that would embarrass the demo or the production story.

## Read first

- `docs/discovery/05-solution-design.md`
- `docs/discovery/07-build-log.md`
- `docs/SECURITY.md`
- `docs/SCALABILITY.md`
- `docs/QUALITY-BAR.md`

## Do

### Security

- Check every route and server action for server-side authz.
- Test the RBAC matrix, escalation guards, and last-owner protection.
- Test cross-tenant reads and writes with two workspaces.
- Validate every boundary input; reject unknown keys where practical.
- Check rate limits on auth, invitation, reset, upload, and write endpoints.
- Verify security headers, CSP status, and secret hygiene.
- Check audit coverage for access, money, status, and ownership changes.
- Run `npm run security:audit`.

### Email

- Test HTML escaping, CRLF stripping, and URL allowlisting.
- Test preference opt-out, suppression, and duplicate idempotency.
- Test provider failure, retry, and terminal failure state.
- Verify the cron endpoint rejects missing or wrong secrets.
- Verify no recipient address or reset link is logged.
- Send one message to Mailpit and inspect desktop and mobile renders.

### Scale

- Check pagination, caps, indexes, and N+1 queries on the golden path.
- Check timeouts and idempotency on external calls.
- Check the Redis path for shared rate limits if multiple instances are claimed.

### Reliability

- Walk the failure modes: database down, provider timeout, email failure, partial write.
- Verify the UI shows a recoverable state.

### Accessibility and performance

- Keyboard path, focus, contrast, labels, reduced motion.
- LCP, INP, CLS, bundle size, image sizing.

### UX states

- Every data view: loading, empty, error, unauthorized.
- Every action: pending, success, failure.

### Tests

- Add a test for every fix. Do not leave a security or email fix untested.
- Re-run `npm run test:coverage`. The 95% line must still hold.

### Website delivery confirmation

- Confirm A5–A9, B1–B3 (if applicable), and C1–C4 from
  `docs/WEBSITE-DELIVERY-CHECKLIST.md`.
- Attach the scan, command output, or screenshot to `docs/WEBSITE-DELIVERY-STATUS.md`.
- Mark inapplicable items `N/A - reason`, where the reason names why the item cannot apply.

## Output structure

```md
# Hardening report

## Findings
| # | Area | Severity | Finding | Fix | Test | Status |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## RBAC evidence
- ...

## Email evidence
- ...

## Cross-tenant evidence
- ...

## Performance evidence
- ...

## Remaining risks
| Risk | Severity | Why accepted | Mitigation | Owner |
| --- | --- | --- | --- | --- |
| | | | | |
```

## Gate

- No high or critical findings.
- Mediums are documented with a mitigation.
- Every fix has a test and coverage is still >= 95%.
- No new features were added.
- Hardening-phase website delivery items are confirmed with evidence.

## Response block

```text
## Phase 08 — Harden
Artifact: docs/discovery/08-hardening-report.md
Gate: PASS | BLOCKED
Decisions:
- ...
Risks:
- ...
Next: phase 09 — Final test
```
