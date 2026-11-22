# Phase 07 — Build

**Time:** 3:30–6:45
**Artifact:** `docs/discovery/07-build-log.md`
**Goal:** ship the golden path in vertical slices. No horizontal layer rewrites.

## Preconditions

- `docs/discovery/05-solution-design.md` exists.
- `docs/discovery/06-visual-direction.md` exists.
- The design direction is active.

If either artifact is missing, stop. Do not write product code.

## Skill

Load `full-output-enforcement` before large code generation. Keep the `design-taste-frontend`
constraints active.

## Slice order

1. **Foundation:** layout, tokens, UI primitives, error and loading states.
2. **Data:** schema, migration, seed, repository layer.
3. **Auth and tenancy:** actor resolution, RBAC checks, unauthorized states.
4. **Core read path:** the primary list or dashboard, paginated and indexed.
5. **Core write path:** the action that changes the outcome, validated and audited.
6. **Email:** enqueue the golden-path events, render, drain to Mailpit, verify outbox status.
7. **Secondary flow:** the next most valuable user job.
8. **Polish:** copy, motion, empty states, mobile, accessibility.

## After every slice

- Run `npm run lint`, `npm run typecheck`, and `npm run test`.
- Exercise the flow manually with seed data.
- Update `docs/discovery/07-build-log.md`:
  - what works;
  - what broke;
  - the next step;
  - top risks;
  - commands run and results.
- Do not leave a slice half-wired. Hide unfinished work behind an honest disabled state.

## Rules

- No `any`, no `@ts-ignore`, no dead buttons, no lorem ipsum.
- Every mutation is authorized, validated, and audited where required.
- Every role change passes the escalation and last-owner guards.
- Every list is paginated and indexed.
- Every data view has loading, empty, error, and unauthorized states.
- Email goes through the outbox; never inline.
- No secrets in the client bundle.

## Output structure

```md
# Build log

## Current state
- Working:
- Broken:
- Next:

## Slices
| Slice | Status | Evidence | Notes |
| --- | --- | --- | --- |
| | | | |

## Commands run
| Time | Command | Result |
| --- | --- | --- |
| | | |

## Decisions
- ...

## Risks
- ...
```

## Gate

- The golden path works end to end locally with seeded data.
- RBAC is enforced on the golden path.
- At least one golden-path email is queued and delivered to Mailpit.
- The build log is current.
- Lint, typecheck, and unit tests are green.

## Response block

```text
## Phase 07 — Build
Artifact: docs/discovery/07-build-log.md
Gate: PASS | BLOCKED
Decisions:
- ...
Risks:
- ...
Next: phase 08 — Harden
```
