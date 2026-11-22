# Data model

Postgres is the source of truth. Prisma owns the schema and migrations. Every tenant-owned row is
scoped to a workspace.

## Current foundation

```text
User 1 ─── * Membership * ─── 1 Workspace
  │                              │
  ├── 1 EmailPreference          ├── * EmailMessage
  ├── * EmailMessage             └── * AuditLog
  └── * AuditLog

EmailSuppression (standalone by email address)
```

| Model             | Purpose                                   | Key constraints                          |
| ----------------- | ----------------------------------------- | ---------------------------------------- |
| `User`            | Identity                                  | `email` unique                           |
| `Workspace`       | Tenant boundary                           | `slug` unique                            |
| `Membership`      | User ↔ workspace with role                | unique `(userId, workspaceId)`           |
| `AuditLog`        | Security and business audit trail         | indexed by workspace/time, actor/time    |
| `EmailMessage`    | Durable email outbox and delivery state   | `idempotencyKey` unique                  |
| `EmailPreference` | Per-user category opt-in                  | `userId` unique                          |
| `EmailSuppression`| Hard bounce/complaint suppression list    | `email` unique                           |

Roles: `OWNER`, `ADMIN`, `MEMBER`, `VIEWER`.

## Email outbox

- `EmailMessage.status` is `QUEUED`, `SENDING`, `SENT`, `FAILED`, or `CANCELED`.
- `payload` stores the template variables, not a rendered body. Rendering stays code-reviewed and
  versioned.
- `idempotencyKey` prevents duplicate sends on retries and double-submits.
- `scheduledAt` supports backoff and delayed sends; `attempts` is bounded.
- `workspaceId` and `userId` are nullable for system mail such as password resets, but every
  workspace-originated event should set both when known.
- `EmailPreference` controls product and marketing categories. Transactional mail is always allowed.
- `EmailSuppression` is checked before every enqueue. Bounces and complaints must land here.
- The queue is drained by `POST /api/cron/email`, protected by `CRON_SECRET`. Local development uses
  Mailpit; no real email leaves the machine.
- Never store rendered HTML, reset tokens, or provider payloads in the outbox.

## Conventions

- Primary keys: `cuid()` strings unless the domain needs something else.
- Timestamps: `createdAt` default now, `updatedAt` with `@updatedAt`.
- Tenant-owned tables include `workspaceId` and an index that starts with it.
- Money is stored as integer minor units, never floats.
- Enums for closed sets; strings for open values.
- Soft delete only when the product needs recovery or audit; otherwise hard delete with a cascade
  policy that is explicit.
- JSON columns are for flexible metadata, not for data you need to filter or join.
- Every foreign key has an explicit `onDelete` behavior.

## Adding a domain model

1. Update `apps/web/prisma/schema.prisma`.
2. Add `workspaceId` if the row belongs to a tenant.
3. Add indexes for the filters and sorts the UI will use.
4. Run `npm run db:migrate -- --name <change>` to create a migration.
5. Update the seed if the demo needs the new model.
6. Add a unit or integration test for the critical rule.
7. Update this document.

For a hackathon, `npm run db:push` is acceptable during exploration. Before submission, create a real
migration with `npm run db:migrate` so the deployed database can be built reproducibly. Never run
`db push` against production.

## Indexing

Start every tenant index with `workspaceId`:

```prisma
@@index([workspaceId, createdAt])
@@index([workspaceId, status, createdAt])
@@index([workspaceId, ownerId])
@@index([status, scheduledAt])
```

Add a unique constraint for natural identifiers:

```prisma
@@unique([workspaceId, slug])
```

Check the primary list query with `EXPLAIN ANALYZE` before the demo. If it says `Seq Scan` on a table
that matters, add the index or change the query.

## Seeding

`npm run db:seed` creates:

- `demo@hexa.dev` / "Demo Operator"
- Workspace `hexa-demo` / "Hexa Demo"
- An `OWNER` membership
- An `EmailPreference` row
- One queued `welcome` email in the outbox
- A seed audit row

The seed is idempotent. Extend it with the demo data the golden path needs. Never seed real personal
data, real customer names, or real emails. Process the seeded email with `npm run email:process`, then
inspect it at `http://localhost:8025`.

## Migrations

| Environment | Command                                      |
| ----------- | -------------------------------------------- |
| Local dev   | `npm run db:migrate`                         |
| CI / deploy | `npm run db:deploy` (`prisma migrate deploy`) |
| Fast draft  | `npm run db:push` (never production)          |

Rules:

- Commit migration files.
- Review destructive changes before applying.
- Back up before a destructive production migration.
- Make migrations forward-only; roll forward with a fix, not a down-migration in an emergency.
- Test the migration against a fresh database before the demo.

## PII and retention

- Collect only what the product needs.
- Document PII fields in the solution design.
- Do not log request bodies or full user records.
- Redact secrets and PII in logs.
- Email addresses are PII. Do not log recipient addresses, reset links, or rendered email bodies.
- Define a retention window for audit logs, email rows, and user data.
- Provide a delete path if the product stores user content. Email rows should anonymize or delete on
  account deletion, except where a legal retention rule applies.
- Use synthetic data in demos, screenshots, and seed files.

## Backup and recovery

- Production uses a managed database with automated backups.
- Know the restore command before the demo.
- Test a restore into a scratch database if time allows.
- The demo fallback does not depend on a live database restore.

## Data checklist

- [ ] Every tenant table has `workspaceId` and an index starting with it.
- [ ] Every foreign key has an explicit delete behavior.
- [ ] Primary list filters and sorts are indexed.
- [ ] Money uses integer minor units.
- [ ] Migrations are committed and tested.
- [ ] Seed is idempotent and synthetic.
- [ ] PII fields are documented.
- [ ] Audit log covers security-relevant mutations.
- [ ] Email outbox has an idempotency key, bounded retries, and a suppression path.
- [ ] Production backup and restore path is known.
