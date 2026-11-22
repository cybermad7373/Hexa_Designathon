# Scalability standard

Scale is designed, not hoped for. In a ten-hour build, scalability means the app stays correct and
fast under the load a judge can generate, and the architecture has an obvious next step.

Never claim a number you did not measure. Put measured results in
`docs/discovery/09-release-report.md` with the command and environment.

## Targets

| Signal                         | Target for the demo            | How to measure                     |
| ------------------------------ | ------------------------------ | ---------------------------------- |
| API read latency               | p95 < 300 ms                   | k6 or Playwright timings           |
| API write latency              | p95 < 800 ms                   | k6 or server logs                  |
| Error rate under load          | < 1%                           | k6 thresholds                      |
| Largest list response          | ≤ 50 rows, cursor paginated    | Code review + response size        |
| Database query                 | p95 < 100 ms                   | Prisma logs / `EXPLAIN ANALYZE`    |
| LCP                            | < 2.5 s                        | Lighthouse                         |
| INP                            | < 200 ms                       | Lighthouse / field data            |
| CLS                            | < 0.1                          | Lighthouse                         |
| First-load JS on the main view | < 250 kB gzipped               | `next build` output                |
| Health check                   | responds in < 1 s              | `/api/health`                      |

Hackathon infrastructure is small. The goal is not 10k RPS; it is no accidental quadratic work, no
unbounded query, and a clean horizontal-scaling story.

## Statelessness

- The app process holds no session, job, or tenant state that cannot be reconstructed.
- Sessions live in cookies or the database, not in module memory.
- Rate limits and caches that must be shared use Redis.
- Uploads go to object storage, not the container filesystem.
- Every instance can serve every request.

## Request path rules

- Validate and cap payload size before parsing expensive fields.
- Set a timeout on every external call. One retry only for idempotent reads.
- Never loop over an unbounded collection with a query per item.
- Stream or paginate large responses; do not build a giant array in memory.
- Use `Promise.all` for independent reads, but cap concurrency for fan-out.
- Return only the fields the UI needs. No `SELECT *` behavior in list endpoints.
- Use `cache-control: no-store` on authenticated responses.

## Database rules

### Pagination

Cursor pagination, always. Offset pagination degrades and duplicates rows under writes.

```ts
const rows = await db.item.findMany({
  where: { workspaceId },
  orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  take: limit + 1,
  ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
});
```

Return `nextCursor` and cap `limit` (for example, 50). Never return an unbounded list.

### Indexes

Add an index for every filter and sort in a primary list:

```prisma
@@index([workspaceId, createdAt])
@@index([workspaceId, status, createdAt])
```

Every tenant-owned index starts with `workspaceId`. Check the query plan for the list endpoint before
the demo.

### N+1 queries

- Use `include` or `select` to fetch related rows in one query.
- Batch ids with `findMany({ where: { id: { in: ids } } })`.
- Never query inside a `map` over rows.
- Log query counts in development when a request looks slow.

### Transactions and integrity

- Wrap multi-row writes in `db.$transaction`.
- Enforce uniqueness in the database, not only in application code.
- Use idempotency keys for retried creates.
- Prefer optimistic concurrency (`version` column) for editable records.

### Connections

- Use a pooled `DATABASE_URL` in serverless or multi-instance deployments.
- Prisma's singleton pattern is already in `src/server/db.ts`; keep it.
- Size the pool to the database plan. Do not open a connection per request manually.

## Caching

| Layer       | Use                                                    | Avoid                                      |
| ----------- | ------------------------------------------------------ | ------------------------------------------ |
| CDN / HTTP  | Public assets, static marketing pages                  | Authenticated or tenant-specific responses |
| Redis       | Shared rate limits, hot read models, job state         | Authorization decisions                    |
| In-process  | Cheap derived values for the lifetime of a request     | Cross-request tenant data                  |
| Client      | UI state, optimistic updates                           | Source-of-truth domain data                |

Invalidate on write. Add a short TTL as a safety net. Protect against stampedes with a lock or
single-flight pattern only if the problem needs it.

## Async work

Move work off the request path when it is slow or unreliable:

- Email, notifications, exports, report generation, webhook fan-out.
- Every job is idempotent and keyed by a stable id.
- Retries use exponential backoff with a cap and a dead-letter path.
- Jobs log start, finish, duration, attempt, and outcome.
- The API returns `202 Accepted` with a job id when work is queued.

Email uses the Postgres outbox. The request only inserts a row; the worker drains a bounded batch.
This keeps signup, invitation, and reset latency independent of the provider.

- Index `(status, scheduledAt)` so the worker claim stays cheap.
- Claim rows with a conditional update; do not process the same row twice.
- Cap attempts and move permanent failures to `FAILED`; never retry forever.
- Monitor queue age. A rising oldest-queued age is the first backlog signal.
- Move to Redis or a managed queue only when the outbox drain is the bottleneck.

For the hackathon, a synchronous call with a timeout is acceptable for non-email work if it stays
under the latency target. Document the trade-off.

## Rate limiting

The scaffold includes an in-process fixed-window limiter. It is per instance, so it is a demo-safe
first step, not a distributed guarantee.

- Limit auth, invitation, upload, and write endpoints.
- Key by user id when authenticated, otherwise by IP.
- Return `429` with `Retry-After`.
- Add `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset` headers.
- Move to Redis for multiple instances.
- Apply per-tenant quotas so one workspace cannot starve another.

## Multi-tenant fairness

- Every query is scoped by `workspaceId`.
- Per-tenant limits on writes, uploads, and expensive jobs.
- Bound fan-out per tenant.
- Never let a single tenant trigger an unbounded background job loop.
- Test cross-tenant access with two seeded workspaces.

## Load testing

The repo includes a k6 smoke test at `tests/load/smoke.js`.

```bash
npm run build
npm run start
k6 run tests/load/smoke.js
```

Against a deployed URL:

```bash
BASE_URL=https://your-app.example k6 run tests/load/smoke.js
```

The default scenario runs 10 virtual users for 30 seconds and fails if the error rate exceeds 1% or
p95 latency exceeds 500 ms. Adjust the scenario for the demo, not to make the numbers look good.

Record:

- Date, commit, environment, and database size.
- VUs, duration, requests, error rate, p50/p95/p99.
- The slowest endpoint and the query behind it.
- What you changed as a result.

If you cannot run k6, use Playwright with repeated requests and report that limitation honestly.

## Capacity math

Use this template before claiming scale:

```text
Peak concurrent users:      N
Requests per user/minute:   R
Peak RPS:                   N * R / 60
Average response budget:    1000 / peak RPS ms per instance
Database queries per req:   Q
Peak queries/second:        peak RPS * Q
```

If peak queries/second exceeds what the database plan can serve, add an index, cache, or queue before
adding instances.

## Scale checklist

- [ ] Every list is cursor paginated and capped.
- [ ] Every tenant query filters by `workspaceId`.
- [ ] Every filter and sort in the primary list has an index.
- [ ] No N+1 queries on the golden path.
- [ ] External calls have timeouts and bounded retries.
- [ ] Mutations are idempotent where retries are possible.
- [ ] Email is enqueued through the outbox and drained in bounded batches.
- [ ] The worker claim is safe under concurrency; attempts are capped.
- [ ] Queue age is observable; failures have a terminal state.
- [ ] Rate limits exist on auth and write endpoints.
- [ ] The app is stateless and safe to run as multiple instances.
- [ ] Health endpoint reports database readiness.
- [ ] A load smoke test has been run and recorded.
- [ ] The scaling next step is written in the solution design.

## What not to do

- Do not add a queue, microservice, or read replica before the simple path is measured.
- Do not cache tenant data globally.
- Do not use offset pagination for the primary list.
- Do not fetch a full table and filter in JavaScript.
- Do not run a query per row in a loop.
- Do not present a local benchmark as production capacity.
