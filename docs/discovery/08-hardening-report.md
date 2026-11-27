# 08 — Hardening report

> Phase 08 · 6:45–7:45 · Source: `agent-prompts/08-HARDEN.md`
> Close what would embarrass the demo or the production story. Add a test for every fix.

## Findings

| # | Area | Severity | Finding | Fix | Status | Test |
| - | ---- | -------- | ------- | --- | ------ | ---- |
| 1 |      |          |         |     |        |      |

Severity: critical / high / medium / low. No high or critical may remain open.

## RBAC evidence

| Check | Result | Evidence |
| ----- | ------ | -------- |
| Unauthenticated request rejected | | |
| Wrong-workspace request rejected | | |
| Cross-tenant read impossible | | |
| Self-escalation blocked | | |
| Last owner protected | | |
| Client-supplied role ignored | | |

## Email evidence

| Check | Result | Evidence |
| ----- | ------ | -------- |
| Enqueued through outbox, not inline | | |
| Variables escaped | | |
| CRLF stripped from subject | | |
| Only http(s) links allowed | | |
| Preference and suppression respected | | |
| Cron secret enforced | | |
| Retry and failure states visible | | |
| Mailpit delivery smoke | | |

## Cross-tenant evidence

- Test:
- Result:

## Performance evidence

| Metric | Before | After | Method |
| ------ | ------ | ----- | ------ |
|        |        |       |        |

## Remaining risks

| # | Risk | Severity | Why accepted | Mitigation |
| - | ---- | -------- | ------------ | ---------- |
| 1 |      |          |              |            |

## Gate

- [ ] No high or critical findings remain.
- [ ] Medium findings are documented with a mitigation.
- [ ] Every fix has a test.
- [ ] Accessibility and reduced motion checked.
- [ ] Security headers, rate limits, and audit coverage checked.

Next: `agent-prompts/09-FINAL-TEST.md` → `docs/discovery/09-release-report.md`
