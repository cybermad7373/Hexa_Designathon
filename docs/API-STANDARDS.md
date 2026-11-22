# API standards

One contract, everywhere. Predictable envelopes make the UI, tests, and error handling simpler.

## Routes

- Use `src/app/api/<resource>/route.ts` for REST-style handlers.
- Use server actions for form mutations when they keep the flow simpler; apply the same validation,
  authz, and error rules.
- Resource names are plural nouns: `/api/workspaces`, `/api/workspaces/:id/members`.
- Actions that are not CRUD use a verb sub-resource: `/api/invitations/:id/accept`.
- Never put a secret or tenant id in a path that the client can choose without an authorization check.

## Methods and status codes

| Method | Use                    | Success |
| ------ | ---------------------- | ------- |
| GET    | Read                   | 200     |
| POST   | Create or action       | 201 / 200 / 202 |
| PATCH  | Partial update         | 200     |
| PUT    | Full replace           | 200     |
| DELETE | Remove                 | 204     |

Errors: `400` validation, `401` unauthenticated, `403` forbidden, `404` not found or hidden,
`409` conflict, `422` semantically invalid, `429` rate limited, `500` internal, `503` unavailable.

## Success envelope

```json
{
  "data": {
    "id": "clx...",
    "name": "Example"
  }
}
```

Lists add pagination metadata:

```json
{
  "data": [{ "id": "clx..." }],
  "meta": {
    "nextCursor": "clx...",
    "hasMore": true
  }
}
```

Use the helpers in `src/lib/http.ts`:

```ts
return ok(data);
return created(data);
return noContent();
```

## Error envelope

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have access to this workspace.",
    "details": { "field": "role" },
    "requestId": "8f2c..."
  }
}
```

Rules:

- `code` is a stable enum from `ERROR_CODES`.
- `message` is safe for the client. No SQL, stack traces, provider payloads, or internal ids.
- `details` is optional and must not leak secrets or PII.
- `requestId` is always included in production responses.
- Log the full error server-side with the same request id.

Use:

```ts
throw new AppError(ERROR_CODES.FORBIDDEN, "You do not have access to this workspace.");
return fail(error, requestId);
```

## Validation

Every boundary uses Zod:

```ts
const createSchema = z.object({
  name: z.string().trim().min(1).max(80),
  visibility: z.enum(["private", "workspace"]).default("private"),
});

const parsed = createSchema.safeParse(body);
if (!parsed.success) {
  throw new AppError(ERROR_CODES.BAD_REQUEST, "Invalid request body", {
    details: parsed.error.flatten().fieldErrors,
  });
}
```

- Validate route params and query strings too.
- Cap page size and string lengths.
- Reject unknown keys for mutation payloads where practical.
- Normalize emails and dates at the boundary.
- Do not pass raw request objects into services.

## Authentication and authorization

```ts
const actor = await requireActor();
const membership = await requireMembership(actor.id, workspaceId);
assertCan(membership.role, "member:invite");
```

- Resolve the actor from the session, not from a header the client controls.
- Resolve the workspace from the resource or the session, then verify membership.
- Check an explicit RBAC permission, not a role string, for privileged actions.
- Guard role changes with `assertCanAssignRole`; guard removals with `assertCanRemoveMember`.
- Filter every query by `workspaceId`.
- Return `404` instead of `403` when existence is sensitive.
- Write an audit row for access, money, status, and ownership mutations.

## Email queue

`POST /api/cron/email` drains the outbox.

- Requires `Authorization: Bearer $CRON_SECRET`.
- Returns `{ data: { processed, sent, retried, failed } }`.
- Returns `401` without the secret, `503` when the queue is not configured.
- Bounded batch, `no-store`, no recipient data in the response.
- Never expose the queue route to the browser or the client bundle.

## Pagination

Cursor-based, stable order, capped page size.

```ts
const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);
const cursor = searchParams.get("cursor") ?? undefined;

const rows = await db.item.findMany({
  where: { workspaceId },
  orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  take: limit + 1,
  ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
});

const hasMore = rows.length > limit;
const page = hasMore ? rows.slice(0, limit) : rows;
const nextCursor = hasMore ? page[page.length - 1]?.id : null;
```

Never expose offset pagination on the primary list.

## Filtering and sorting

- Allowlist filter fields and sort fields.
- Every allowed filter and sort has an index that starts with `workspaceId`.
- Sort always includes a tiebreaker (`id`) for stable cursors.
- Reject unknown sort fields with `400`.

## Idempotency

For creates that can be retried (payments, invitations, webhooks):

- Accept an `Idempotency-Key` header.
- Store `(workspaceId, key)` with the request hash and the response.
- Return the original response for a replay.
- Reject the same key with a different payload as `409`.
- Expire keys after a documented window.

## Rate limiting

- Return `429` with `Retry-After`.
- Include `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset`.
- Key by actor id when authenticated, otherwise IP.
- The included limiter is in-process; use Redis for multiple instances.
- Apply stricter limits to auth, invitation, upload, and write endpoints.

## Versioning

- For a hackathon, keep one version and document it.
- If the contract must change, add a new route or a version prefix; do not silently break clients.
- Keep `docs/openapi.yaml` if the team can maintain it. Otherwise, keep this document current.

## API checklist

- [ ] Every route validates params, query, and body.
- [ ] Every workspace route checks membership and an explicit RBAC permission.
- [ ] Role changes pass escalation and last-owner guards.
- [ ] Every tenant query filters by `workspaceId`.
- [ ] Every error uses the envelope and a stable code.
- [ ] Every list is cursor paginated and capped.
- [ ] Every mutation that matters writes an audit row.
- [ ] Every retryable create supports an idempotency key.
- [ ] Every auth and write route is rate limited.
- [ ] The email worker is secret-protected and returns no recipient data.
- [ ] No secret, stack trace, or PII in a response.
