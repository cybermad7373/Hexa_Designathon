# 05 — Solution design

> Phase 05 · 2:15–3:00 · Source: `agent-prompts/05-SOLUTION-DESIGN.md`
> This artifact unblocks product code. Do not start Phase 07 until every requirement maps to a
> component, every must-handle edge case has a design, and no blocking question is open.

## System diagram

```text
Browser
  → Next.js App Router (server components, route handlers)
    → Zod validation → authorization → domain service
      → Prisma → PostgreSQL
      → email outbox → worker (/api/cron/email) → provider / Mailpit
    → Redis (rate limits, cache) [optional]
```

Replace with the real diagram once the brief is known.

## Stack decisions

| Decision | Choice | Alternative rejected | Why | ADR |
| -------- | ------ | -------------------- | --- | --- |
|          |        |                      |     |     |

Any irreversible choice (auth, storage, queue, external provider) gets an ADR in `docs/decisions/`.

## Data model

| Entity | Key fields | Tenant-owned | Indexes | Delete behavior |
| ------ | ---------- | ------------ | ------- | --------------- |
|        |            |              |         |                 |

Rules: every tenant table carries `workspaceId`, every query filters by it, lists are cursor-paginated.

## API contract

| Method | Route | Auth | Permission | Request | Response | Errors | Idempotency |
| ------ | ----- | ---- | ---------- | ------- | -------- | ------ | ----------- |
|        |       |      |            |         |          |        |             |

Envelope: `{ data }` on success, `{ error: { code, message, requestId } }` on failure.

## RBAC

| Permission | OWNER | ADMIN | MEMBER | VIEWER |
| ---------- | ----- | ----- | ------ | ------ |
|            |       |       |        |        |

Guards: no self-escalation, last owner cannot be removed or demoted, role checks are server-side only.

## Email

| Event | Recipient | Template | Trigger | Preference | Suppression |
| ----- | --------- | -------- | ------- | ---------- | ----------- |
|       |           |          |         |            |             |

All sends go through the outbox with an idempotency key. No inline sends in request transactions.

## Failure modes

| Failure | Impact | Detection | Degraded behavior |
| ------- | ------ | --------- | ----------------- |
|         |        |           |                   |

## Observability

- Structured logs with request id:
- Health endpoint checks:
- Metrics and where they live:
- Alerts (if any):

## Test strategy

| Layer | What it protects | Where |
| ----- | ---------------- | ----- |
| Unit | domain rules, RBAC, validation, email rendering | `apps/web/src/**/*.test.ts` |
| E2E | golden path | `apps/web/e2e/` |
| Manual | empty, error, unauthorized, mobile, keyboard | release checklist |

## Vertical slices

| # | Slice | Hours | Done when |
| - | ----- | ----- | --------- |
| 1 | Foundation |       |           |
| 2 | Data |           |           |
| 3 | Auth and tenancy | |           |
| 4 | Core read path | |           |
| 5 | Core write path | |           |
| 6 | Email |          |           |
| 7 | Secondary flow | |           |
| 8 | Polish |         |           |

## Risks

| # | Risk | Likelihood | Impact | Mitigation | Owner |
| - | ---- | ---------- | ------ | ---------- | ----- |
| 1 |      |            |        |            |       |

## Gate

- [ ] Every Phase 04 requirement maps to a component and an API route.
- [ ] Every must-handle edge case has a design.
- [ ] Every tenant table has `workspaceId` and an index plan.
- [ ] RBAC permissions and escalation guards are explicit.
- [ ] Every email event is in the outbox catalog.
- [ ] No blocking question remains.

Next: `agent-prompts/06-VISUAL-DIRECTION.md` → `docs/discovery/06-visual-direction.md`
