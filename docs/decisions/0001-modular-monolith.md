# ADR 0001: Modular monolith on Next.js and Postgres

- Status: Accepted
- Date: 2026-11-22
- Deciders: Engineering lead, product lead

## Context

The team has ten hours to produce a deployed, secure, scalable, demo-ready product. The problem
statement is not known at setup time. The solution needs fast iteration, server-side authorization,
relational data, and a credible production story without operational overhead.

## Decision

Use a modular monolith:

- One Next.js App Router deployable for UI, route handlers, and server actions.
- TypeScript strict everywhere.
- PostgreSQL with Prisma for the data layer.
- Zod at every boundary.
- Tailwind CSS with design tokens for the UI.
- Redis available for rate limits, cache, and queues when the problem needs it.
- Vitest for unit tests, Playwright for e2e.
- Vercel or a Docker container for deployment.

The server layer is split into services and repositories. Components never import Prisma.

## Consequences

Positive:

- One deploy, one language, one schema, one test suite.
- Server-side rendering and server actions reduce API surface.
- Relational integrity and migrations are available from hour one.
- The same code runs locally, in Docker, and on a managed platform.
- The scaling path (stateless app, indexes, pagination, Redis, queue, read replica) is incremental.

Negative:

- A single deployable can become a bottleneck if the team does not enforce module boundaries.
- Next.js server components and client components require discipline about server-only imports.
- A monolith can hide N+1 queries and unbounded lists if code review is skipped.

Mitigations:

- Enforce the layering rules in `docs/ARCHITECTURE.md`.
- Keep `workspaceId` on every tenant row and index.
- Run the release gate and a load smoke before the demo.
- Split a service out only when its scaling profile is genuinely different.

## Alternatives considered

- **Separate API service:** more operational surface and duplicated auth for a ten-hour build.
- **BaaS-only (Supabase/Firebase) with client queries:** faster start, but server-side authorization
  and complex domain rules become harder to guarantee.
- **SQLite:** simpler local setup, but weaker production story and concurrency behavior.

## Follow-up

- Write ADR 0002 for the auth choice in Phase 05.
- Write ADR 0003 if file storage, a queue, or a second service is added.
