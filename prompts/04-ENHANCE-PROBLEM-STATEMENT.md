# Phase 04 — Enhance the problem statement

**Time:** 1:45–2:15
**Artifact:** `docs/discovery/04-enhanced-problem-statement.md`
**Goal:** turn the brief into a scoped, testable product definition that fits ten hours.

## Read first

- `docs/discovery/00-problem-statement.md`
- `docs/discovery/01-opportunity-map.md`
- `docs/discovery/02-edge-cases.md`
- `docs/discovery/03-research.md`
- `docs/QUALITY-BAR.md`

## Do

1. Write the enhanced problem statement:
   - problem;
   - users;
   - insight;
   - solution thesis;
   - scope in;
   - scope out;
   - user stories;
   - acceptance criteria;
   - success metrics;
   - non-goals;
   - risks;
   - demo narrative.
2. Use Given/When/Then for acceptance criteria.
3. Define the MVP and the cut line. Anything beyond the cut line is stretch.
4. Make every metric measurable in the demo or explicitly labeled as a target.
5. Check ten-hour feasibility. If it does not fit, cut scope now.
6. Map each requirement to a future component and a test.
7. Name the RBAC roles and permissions the product actually needs. Start from the scaffold's four roles
   and remove what the product does not use.
8. Name the user-facing events that trigger email. Classify each as transactional, product, or
   marketing. Do not add email for events nobody needs.
9. State the demo's one golden path in five steps or fewer.

## Output structure

```md
# Enhanced problem statement

## Problem
...

## Users
...

## Insight
...

## Solution thesis
...

## Scope in
- ...

## Scope out
- ...

## User stories
- As a ..., I want ..., so that ...

## Acceptance criteria
### Story 1
- Given ...
- When ...
- Then ...

## RBAC
| Role | Permissions | Notes |
| --- | --- | --- |
| OWNER | | |
| ADMIN | | |
| MEMBER | | |
| VIEWER | | |

## Email events
| Event | Category | Recipient | Trigger | Template |
| --- | --- | --- | --- | --- |
| | | | | |

## Success metrics
| Metric | Target | How measured | Real or target? |
| --- | --- | --- | --- |
| | | | |

## Non-goals
- ...

## Risks
- ...

## Demo narrative
1. ...

## Cut line
- MVP:
- Stretch:
```

## Gate

- Every requirement is testable.
- Scope fits the timebox.
- Metrics are measurable or labeled as targets.
- The demo narrative is one clear flow.
- RBAC roles and email events are explicit.
- No product code yet.

## Response block

```text
## Phase 04 — Enhance the problem statement
Artifact: docs/discovery/04-enhanced-problem-statement.md
Gate: PASS | BLOCKED
Decisions:
- ...
Risks:
- ...
Next: phase 05 — Solution design
```
