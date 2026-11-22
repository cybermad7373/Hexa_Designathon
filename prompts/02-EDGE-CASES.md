# Phase 02 — Edge cases

**Time:** 0:55–1:20
**Artifact:** `docs/discovery/02-edge-cases.md`
**Goal:** attack the idea before building it. Every must-handle case gets a decision and a test idea.

## Read first

- `docs/discovery/01-opportunity-map.md`
- `docs/SECURITY.md`
- `docs/QUALITY-BAR.md`

## Do

1. Build a failure matrix across at least:
   - empty, boundary, invalid, duplicate, concurrent;
   - partial failure, timeout, offline, retry;
   - permissions, role escalation, cross-tenant;
   - abuse, privacy, accessibility, timezone/locale;
   - scale, migration, browser/device.
2. For each row, define:
   - trigger;
   - expected behavior;
   - UI state;
   - test idea;
   - severity: critical, high, medium, low.
3. Choose the top 10 that must be handled for the demo.
4. Choose the top 5 that are explicitly out of scope, with a reason.
5. Add abuse cases specific to the product:
   - spam and scraping;
   - enumeration;
   - privilege escalation;
   - injection;
   - SSRF;
   - upload abuse;
   - email header injection;
   - reset-link abuse;
   - outbox flooding.
6. Add RBAC cases:
   - viewer attempts a write;
   - admin attempts to create an admin or owner;
   - admin attempts to remove a peer;
   - last owner is removed or demoted;
   - a client sends a forged `workspaceId` or role.
7. Add email cases:
   - duplicate event;
   - provider timeout;
   - suppressed recipient;
   - opted-out product email;
   - missing template variable;
   - malicious name or workspace name;
   - reset link requested for an unknown account.
8. For every handled case, state what the user sees. No silent failures.

## Output structure

```md
# Edge cases and abuse cases

## Failure matrix
| # | Area | Trigger | Expected behavior | UI state | Test idea | Severity |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## Top 10 must-handle
1. ...

## Explicitly out of scope
| Case | Reason |
| --- | --- |
| | |

## Abuse cases
| Case | Control | Test |
| --- | --- | --- |
| | | |

## RBAC and email cases
| Case | Expected | Test |
| --- | --- | --- |
| | | |

## Decisions
- ...
```

## Gate

- Every must-handle case has a decision and a test idea.
- Out-of-scope cases are explicit.
- RBAC escalation and last-owner cases are covered.
- Email abuse and failure cases are covered.
- No product code yet.

## Response block

```text
## Phase 02 — Edge cases
Artifact: docs/discovery/02-edge-cases.md
Gate: PASS | BLOCKED
Decisions:
- ...
Risks:
- ...
Next: phase 03 — Research
```
