# 02 — Edge cases

> Phase 02 · 0:55–1:20 · Source: `agent-prompts/02-EDGE-CASES.md`
> Attack the chosen angle before building it. Every must-handle case needs a decision and a test idea.

## Failure matrix

| Category | Trigger | Expected behavior | UI state | Test idea | Severity |
| -------- | ------- | ----------------- | -------- | --------- | -------- |
| Empty |         |                   |          |           |          |
| Boundary |        |                   |          |           |          |
| Invalid input |   |                   |          |           |          |
| Duplicate |       |                   |          |           |          |
| Concurrent write | |                  |          |           |          |
| Partial failure |  |                   |          |           |          |
| Timeout |         |                   |          |           |          |
| Offline |         |                   |          |           |          |
| Permissions |     |                   |          |           |          |
| Cross-tenant |    |                   |          |           |          |
| Abuse |           |                   |          |           |          |
| Privacy |         |                   |          |           |          |
| Accessibility |   |                   |          |           |          |
| Timezone / locale | |                 |          |           |          |
| Scale |           |                   |          |           |          |
| Migration |       |                   |          |           |          |
| Browser / device | |                  |          |           |          |

## Top 10 must-handle

| # | Case | Decision (handle now / later / out) | Where handled | Test |
| - | ---- | ----------------------------------- | ------------- | ---- |
| 1 |      |                                     |               |      |
| 2 |      |                                     |               |      |
| 3 |      |                                     |               |      |
| 4 |      |                                     |               |      |
| 5 |      |                                     |               |      |
| 6 |      |                                     |               |      |
| 7 |      |                                     |               |      |
| 8 |      |                                     |               |      |
| 9 |      |                                     |               |      |
| 10 |     |                                     |               |      |

## Explicitly out of scope

| # | Case | Why it is out | Revisit if |
| - | ---- | ------------- | ---------- |
| 1 |      |               |            |
| 2 |      |               |            |
| 3 |      |               |            |
| 4 |      |               |            |
| 5 |      |               |            |

## Abuse cases

| Abuse | Mitigation (server-side) | Verified by |
| ----- | ------------------------ | ----------- |
| Spam / flooding |               |             |
| Scraping / enumeration |      |             |
| Privilege escalation |        |             |
| Injection (SQL, XSS, command) | |            |
| SSRF / unsafe URL fetch |     |             |
| Upload abuse |                |             |
| Email header injection |      |             |
| Reset-link abuse |            |             |
| Outbox flooding |             |             |

## RBAC and email cases

- Unauthenticated access:
- Wrong-workspace access:
- Role downgrade mid-session:
- Last-owner removal:
- Email preference opt-out:
- Suppressed address:
- Provider failure and retry:

## Decisions

- Handle now:
- Handle later:
- Explicitly out:

## Gate

- [ ] Every must-handle case has a decision and a test idea.
- [ ] The top 5 out-of-scope cases are named with a reason.
- [ ] Abuse cases have server-side mitigations.
- [ ] The UI state for each handled case is defined.
- [ ] No product code was written.

Next: `agent-prompts/03-RESEARCH.md` → `docs/discovery/03-research.md`
