# Architecture

The default is a modular monolith: one deployable Next.js app with a clean server layer, one
Postgres database, and Redis available when the problem earns it. This is the fastest path to a
production-shaped product in ten hours.

## Default stack

| Layer      | Choice                                   | Why                                                        |
| ---------- | ---------------------------------------- | ---------------------------------------------------------- |
| UI         | Next.js App Router, React Server Components | Fast to build, server-first, good defaults for SEO and perf |
| Styling    | Tailwind CSS 4 + tokens                  | Fast iteration without a design-system rewrite             |
| Language   | TypeScript strict                        | Catches integration mistakes before the demo               |
| Validation | Zod                                      | One schema at every trust boundary                         |
| Data       | PostgreSQL 16 + Prisma 6                 | Relational integrity, migrations, typed client             |
| Cache/queue| Redis 7 (optional)                       | Rate limits, cache, background jobs                        |
| Logging    | Pino, structured JSON                    | Searchable logs with redaction                             |
| Tests      | Vitest + Playwright                      | Unit speed, e2e confidence                                 |
| Deploy     | Vercel or Docker                         | Preview deploys or portable container                      |

If the problem requires a different stack, write an ADR in `docs/decisions/` first.

## System shape

```text
Browser
  │
  ▼
Next.js app (stateless)
  ├── Server Components / route handlers
  │     ├── validate input (Zod)
  │     ├── authenticate (session)
  │     ├── authorize (RBAC policy + workspace membership)
  │     ├── call service
  │     └── return envelope
  ├── Service layer (domain rules, transactions, audit, email enqueue)
  ├── Repository layer (Prisma queries, tenant filters)
  ├── RBAC policy (pure role/permission matrix, escalation guards)
  └── Integrations (third-party APIs, storage, email provider)
        │
        ▼
PostgreSQL ── Redis (cache, rate limits, queues)
        │
        └── Email outbox ── cron/worker ── SMTP / Resend
```

## Layering rules

- **Route handlers and server actions** do transport work: parse, validate, authenticate, authorize,
  call a service, shape the response. No business rules.
- **Services** own domain rules, transactions, idempotency, and audit writes. They accept a trusted
  actor and workspace context, never raw request objects.
- **Repositories** own Prisma queries. Every tenant-owned query takes `workspaceId`.
- **Components** never import Prisma. Client components never import server-only modules.
- **Integrations** are wrapped in a small adapter with timeouts, retries, and error normalization.

```text
src/
├── app/                 # routes, layouts, route handlers
├── components/          # UI primitives and feature UI
├── features/            # feature-specific components and hooks
├── lib/                 # env, errors, http, rate limit, utils
└── server/
    ├── auth/            # session, actor resolution, RBAC policy
    ├── email/           # event catalog, templates, provider, outbox
    ├── services/        # domain rules
    ├── repositories/    # Prisma queries
    └── integrations/    # third-party adapters
```

## Multi-tenancy

The scaffold ships `User`, `Workspace`, `Membership`, `AuditLog`, and the email outbox tables.

- Every tenant-owned table has `workspaceId` and an index that starts with it.
- Every query filters by the workspace resolved from the session, never from the request body.
- Membership is the source of truth for access. Roles: `OWNER`, `ADMIN`, `MEMBER`, `VIEWER`.
- Cross-tenant reads are a critical bug. Test them explicitly.
- Mutations that change access, money, status, or ownership write an `AuditLog` row.

Canonical authorization shape:

```ts
const actor = await requireActor();
const membership = await requireMembership(actor.id, workspaceId, ["OWNER", "ADMIN"]);
const result = await service.doThing({ actor, workspaceId: membership.workspaceId, input });
```

### RBAC

The policy lives in `src/server/auth/rbac.ts` as a pure matrix, separate from session resolution.

- Roles: `OWNER`, `ADMIN`, `MEMBER`, `VIEWER`.
- Permissions are explicit strings such as `member:invite`, `billing:manage`, `project:delete`.
- Route handlers call `assertCan(role, permission)` after resolving membership.
- Role changes call `assertCanAssignRole`. Only an `OWNER` may create another `OWNER` or `ADMIN`.
- Removal calls `assertCanRemoveMember`. The last `OWNER` cannot be removed or demoted.
- Tests cover the matrix and every escalation guard. Client-side hiding is never authorization.

## Authentication

Pick one in phase 05 and document it in an ADR.

| Option           | Use when                                                | Notes                                      |
| ---------------- | ------------------------------------------------------- | ------------------------------------------ |
| Auth.js          | You need OAuth or email magic links quickly             | Mature, many adapters                      |
| Better Auth      | You want a modern TypeScript-first session library      | Good DX, check adapter support             |
| Owned sessions   | The demo needs one role and no external provider        | Hash tokens, httpOnly cookies, short TTL   |
| Demo mode        | Judges need a zero-friction walkthrough                 | Clearly labeled, disabled in production    |

Never store passwords in plain text. Never put the session token in `localStorage`. Use httpOnly,
secure, sameSite cookies and rotate on privilege change.

## API conventions

- REST-style route handlers under `src/app/api/**/route.ts`, or typed server actions for mutations.
- Validate body, query, and params with Zod. Reject unknown keys where practical.
- Return `{ data }` on success and `{ error: { code, message, details?, requestId } }` on failure.
- Use `AppError` and `fail(error, requestId)`. Never leak provider or database messages.
- Cursor pagination by default. Cap page size. No unbounded lists.
- Use idempotency keys for retried creates and payments.
- Document the contract in `docs/API-STANDARDS.md` and, if time allows, `docs/openapi.yaml`.

## Background work

Do not add a queue until the problem needs it.

| Need                         | Start with                    | Scale with                    |
| ---------------------------- | ----------------------------- | ----------------------------- |
| Email on user events         | Postgres outbox + cron route  | Redis queue + worker          |
| Long report generation       | Synchronous with a timeout    | BullMQ or a managed queue     |
| Scheduled cleanup            | A route called by cron        | Managed cron + idempotent job |
| Retried webhooks             | Idempotency table             | Durable queue                 |

Every job must be idempotent and observable.

### Email outbox

Never send email inside the request transaction. The service writes an `EmailMessage` row and returns;
a worker drains the queue.

- `enqueueEmail` validates the event, checks preferences and the suppression list, renders the
  template, and inserts with an idempotency key.
- `POST /api/cron/email` is protected by `CRON_SECRET` and drains a bounded batch.
- Local development uses Mailpit at `http://localhost:8025`; no real email leaves the machine.
- Production uses SMTP or Resend, with SPF, DKIM, and DMARC configured on the sending domain.
- Retries are bounded with exponential backoff; permanent failures stay `FAILED` with a safe error
  code, never the provider message.
- The outbox is observable by status and age. A backlog is a visible metric, not a silent one.

## Caching

- **HTTP:** `cache-control` for public assets; `no-store` for authenticated responses.
- **Server:** cache only data that is safe to share. Key by workspace and input.
- **Client:** avoid global state until prop drilling is real. Use server components first.
- **Invalidation:** write-through or tag-based. Never cache authorization decisions.

## Observability

- Structured logs with request id, route, actor id, workspace id, latency, and status.
- Redact authorization headers, cookies, passwords, tokens, and PII.
- Health endpoint: liveness (process) and readiness (database) signals.
- Log every 5xx with stack traces server-side; return only a generic message to the client.
- Add a request id to every response and every audit row.

## Failure modes

| Failure                  | Behavior                                                        |
| ------------------------ | --------------------------------------------------------------- |
| Database down            | Health returns `503`; UI shows a retryable degraded state        |
| Redis down               | Fall back to in-process limits; log a warning; do not fail reads |
| Third-party timeout      | Bounded timeout, one retry for idempotent reads, graceful message |
| Email provider down      | Outbox keeps the row queued; bounded retry; UI is unaffected      |
| Duplicate email event    | Idempotency key returns the original row                          |
| Partial write            | Transaction or compensating action; never leave orphan rows      |
| Duplicate request        | Idempotency key returns the original result                      |
| Unauthorized access      | `403` with a generic message; log the actor and route            |
| Cross-tenant probe       | `404` rather than `403` when leaking existence matters           |

## Scaling path

1. Keep the app stateless. No in-memory session or job state.
2. Add indexes for every filter and sort used by the primary list.
3. Replace unbounded lists with cursor pagination.
4. Move rate limits and cache to Redis when running more than one instance.
5. Move the email outbox and other slow work to a queue with idempotent jobs.
6. Add a read replica only after query plans and indexes are clean.
7. Add a CDN for public assets and static pages.
8. Split a service out of the monolith only when its scaling profile is genuinely different.

Details and budgets: [SCALABILITY.md](SCALABILITY.md).

## Deployment

- Local: Docker Compose for Postgres, Redis, and Mailpit; `npm run dev`; `npm run email:process` drains
  the outbox into Mailpit.
- Preview: Vercel preview per pull request, or a Docker container per environment.
- Production: managed Postgres with backups, pooled connections, health checks, and a rollback path.
- Migrations: `prisma migrate deploy` in the release step, never `db push` in production.

Details: [DEPLOYMENT.md](DEPLOYMENT.md).

## Architecture decision records

Every irreversible or expensive-to-reverse choice gets an ADR in `docs/decisions/`:

```text
0001-modular-monolith.md
0002-auth-choice.md
0003-file-storage.md
```

Use [decisions/0001-modular-monolith.md](decisions/0001-modular-monolith.md) as the template.
