# Phase 05 — Solution design

**Time:** 2:15–3:00
**Artifact:** `docs/discovery/05-solution-design.md` plus any ADRs
**Goal:** make architecture, data, API, security, RBAC, email, and failure modes explicit before coding.

## Read first

- `docs/discovery/04-enhanced-problem-statement.md`
- `docs/ARCHITECTURE.md`
- `docs/SCALABILITY.md`
- `docs/SECURITY.md`
- `docs/API-STANDARDS.md`
- `docs/DATA-MODEL.md`
- `docs/DESIGN-SYSTEM.md`

## Do

1. Draw the system diagram: browser, app, services, database, cache/queue, email provider.
2. Decide the stack. Write an ADR in `docs/decisions/` for any irreversible choice: auth, storage,
   queue, email provider.
3. Design the data model:
   - entities, relations, tenancy;
   - indexes for every filter and sort;
   - unique constraints;
   - explicit `onDelete` behavior;
   - migration path.
4. Define the API contract:
   - routes and server actions;
   - request and response shapes;
   - Zod validation at each boundary;
   - error envelope;
   - cursor pagination and caps;
   - idempotency keys.
5. Define authentication, session, and tenant resolution.
6. Define RBAC:
   - permission matrix per role;
   - route-to-permission map;
   - escalation guards;
   - last-owner protection;
   - audit events.
7. Define the email design:
   - event catalog and category;
   - template list;
   - preference and suppression rules;
   - idempotency key strategy;
   - retry/backoff and failure states;
   - worker trigger and secret;
   - local Mailpit path and production provider.
8. Define failure modes and degraded states, including database, Redis, provider, email, and
   cross-tenant probes.
9. Define caching, background work, observability, and deployment.
10. Define the test strategy and vertical slices with time estimates.
11. Keep a risk register with the top five risks.
12. Map every requirement and must-handle edge case to a component and a test.

## Output structure

```md
# Solution design

## System diagram
```text
...
```

## Stack decisions
| Decision | Choice | Reason | ADR |
| --- | --- | --- | --- |
| | | | |

## Data model
| Model | Fields | Constraints | Indexes | Delete behavior |
| --- | --- | --- | --- | --- |
| | | | | |

## API contract
| Route / action | Method | Auth | Permission | Input | Output | Errors |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## RBAC
| Permission | OWNER | ADMIN | MEMBER | VIEWER |
| --- | --- | --- | --- | --- |
| | | | | |

## Email
| Event | Category | Template | Idempotency key | Retry | Recipient |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Failure modes
| Failure | Detection | Behavior | UI state | Test |
| --- | --- | --- | --- | --- |
| | | | | |

## Observability
- ...

## Test strategy
- ...

## Vertical slices
| Slice | Scope | Estimate | Exit check |
| --- | --- | --- | --- |
| | | | |

## Risks
| Risk | Likelihood | Impact | Mitigation | Owner |
| --- | --- | --- | --- | --- |
| | | | | |
```

## Gate

- Every requirement maps to a component.
- Every must-handle edge case has a design.
- RBAC permissions and escalation guards are explicit.
- Email events, templates, and failure behavior are explicit.
- No unresolved blocking question.
- No product code yet.

## Response block

```text
## Phase 05 — Solution design
Artifact: docs/discovery/05-solution-design.md
Gate: PASS | BLOCKED
Decisions:
- ...
Risks:
- ...
Next: phase 06 — Visual direction
```
