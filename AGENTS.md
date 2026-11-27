# AGENTS.md — Hexa Designathon OS

This repo exists to turn one raw problem statement into a deployed, secure, scalable, demo-ready
product in ten hours. You are the agent operating it. The clock is real; the standards are not
negotiable.

## Prime directive

Explore first. Design second. Build third. Test last, in a protected window. The demo is the
deliverable.

This repository is a **scaffold**, not a product. Keep foundations, standards, and prompts ready. Do
not invent or implement a product idea before the brief exists.

Do **not** write product code before both of these exist:

- `docs/discovery/05-solution-design.md`
- `docs/discovery/06-visual-direction.md`

If the clock is tight, compress the artifacts. Never skip them.

## Start sequence

1. Put the raw brief in `docs/discovery/00-problem-statement.md`.
2. Read `agent-prompts/MASTER-WORKFLOW.md` end to end.
3. Run phases 00 → 10 in order. One artifact per phase.
4. At each phase boundary, load the listed skill with the `skill` tool.
5. During the build, update `docs/discovery/07-build-log.md` at least hourly.
6. At T-60, freeze features and run phase 09. No exceptions.

## Phase gates

| #   | Phase            | Time        | Artifact                                      | Exit gate                                        | Skills                                                                                       |
| --- | ---------------- | ----------- | --------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| 00  | Intake           | 0:00–0:15   | `00-problem-statement.md`                     | Requirements, constraints, unknowns captured     | —                                                                                            |
| 01  | Explore          | 0:15–0:55   | `01-opportunity-map.md`                       | Users, jobs, alternatives, assumptions           | `WebSearch` tool                                                                             |
| 02  | Edge cases       | 0:55–1:20   | `02-edge-cases.md`                            | Failure matrix, abuse cases, top 10 decisions    | —                                                                                            |
| 03  | Research         | 1:20–1:45   | `03-research.md`                              | Sources, prior art, build-vs-borrow              | `WebSearch`, `WebFetch` tools                                                                |
| 04  | Enhance PS       | 1:45–2:15   | `04-enhanced-problem-statement.md`            | Metrics, scope, acceptance criteria              | —                                                                                            |
| 05  | Solution design  | 2:15–3:00   | `05-solution-design.md`                       | Architecture, data, API, RBAC, email, risks, slices | Read `docs/ARCHITECTURE.md`, `SCALABILITY.md`, `SECURITY.md`, `DATA-MODEL.md`             |
| 06  | Visual direction | 3:00–3:30   | `06-visual-direction.md`                      | Design read, tokens, motion, reference assets    | `design-taste-frontend` + one image skill                                                    |
| 07  | Build            | 3:30–6:45   | `07-build-log.md`                             | Golden path works end to end locally             | `full-output-enforcement`, keep `design-taste-frontend`                                      |
| 08  | Harden           | 6:45–7:45   | `08-hardening-report.md`                      | No high/critical findings; mediums documented    | `redesign-existing-projects` only for redesigns                                              |
| 09  | Final test       | 7:45–8:45   | `09-release-report.md`                        | Release gate green or explicitly waived          | —                                                                                            |
| 10  | Demo + pitch     | 8:45–10:00  | `10-demo-script.md`                           | Demo rehearsed twice, fallback ready             | —                                                                                            |

### Skill loading protocol

Use the `skill` tool at the phase boundary. Do not just mention a skill in prose.

- **Phase 06, mandatory:** `design-taste-frontend`.
- **Phase 06, reference generation:** `imagegen-frontend-web` for a web product, or
  `imagegen-frontend-mobile` for a mobile product. One reference image per section.
- **Phase 06, motion-heavy brief:** add `gpt-taste`.
- **Phase 06, premium/luxury brief:** add `high-end-visual-design`.
- **Phase 06, aesthetic match only:** `minimalist-ui` or `industrial-brutalist-ui`.
- **Phase 06, brand system required:** add `brandkit`.
- **Phase 06, screenshots supplied:** `screenshot-to-code`.
- **Phase 07, large code generation:** `full-output-enforcement`.
- **Phase 08, redesign of an existing app:** `redesign-existing-projects`.

If a skill is unavailable, follow `docs/DESIGN-SYSTEM.md` and state which fallback you used.

### Runtime portability

These instructions target any agent runtime: Antigravity, Cursor, Claude Code, Qoder, Codex, or a
plain chat with a free model. Adapt, do not stall:

- No `skill` tool: read `docs/DESIGN-SYSTEM.md` and `docs/BRAND.md`, state the fallback.
- No image generation: use a licensed asset or a typographic section; never fake a screenshot.
- No subagents: work sequentially with the same gates and receipts.
- Small context window: lean mode — `AGENTS.md`, the current phase prompt, its artifact, and
  `docs/BRAND.md` for anything visual. Nothing else.
- Never claim a tool result you did not observe. No invented test output, screenshots, or numbers.

## Brand contract

- Hexaware is the brand. Hexaware blue `#3C2CDA` is the only primary; Manrope is the only brand
  typeface; the logo appears in blue, white, or black only. Full palette, roles, contrast pairs,
  dark surfaces, and logo rules: `docs/BRAND.md`.
- Colors ship as tokens in `apps/web/src/app/globals.css` and the email `BRAND` map. A hard-coded hex
  in a component is a defect.
- Read `docs/BRAND.md` before phase 06 and before touching any UI, email, slide, or diagram.

## Engineering contract

1. **TypeScript strict.** No `any`, no `@ts-ignore`, no non-null assertions unless the invariant is
   documented and tested.
2. **Validate at the boundary.** Every request body, query string, route param, and third-party
   payload goes through Zod before it touches domain code.
3. **Authorize on the server.** Every workspace-scoped read and write checks membership and the
   explicit RBAC permission server-side. Never trust a client-supplied `workspaceId`, `userId`, or
   role. Guard role escalation and the last owner.
4. **Tenant isolation.** Every tenant-owned table has a `workspaceId`; every query filters by it.
   Cross-tenant reads are a critical bug.
5. **Errors are a contract.** Throw `AppError`; return `fail(error, requestId)`. Never leak stack
   traces, SQL, or provider messages to the client.
6. **Mutations are auditable.** Writes that change access, money, status, or data ownership write an
   `AuditLog` row with actor, entity, and request id.
7. **Scale is designed, not hoped for.** Cursor pagination, indexed filters, no N+1 queries, bounded
   payloads, timeouts, and idempotency keys for retried writes.
8. **Security defaults.** Security headers stay on. Rate limit auth, upload, and write endpoints.
   Redact secrets and PII from logs. No secrets in the client bundle.
9. **UI states are complete.** Every data view has loading, empty, error, and unauthorized states.
   Every action has pending, success, and failure feedback. No dead buttons.
10. **Email is durable and safe.** Enqueue through the outbox, never inline. Escape variables, strip
    CRLF from subjects, allow only http(s) links, and check preferences and suppression.
11. **Tests protect the demo.** Unit tests for domain logic, RBAC, email rendering, rate limiting,
    load balancing, an e2e golden path, and the release gate before the pitch. `npm run test:coverage`
    is a hard gate: 100% pass, zero skipped or flaky, and >= 95% statements, branches, functions, and
    lines on every tested module. No exclusion or waiver to reach the number.
12. **Evaluate like the judge.** Produce the four scored deliverables: a GitHub repo with clean history
    and documentation, a slide deck (business value, architecture, competitive advantage, roadmap),
    a 3–5 minute demo video, and a <= 1000 word architecture abstract. Evidence in
    `docs/EVALUATION-CHECKLIST.md`.
13. **Confirm the website delivery gate while building.** Select a profile at intake and mark each
    applicable item `Done`, `N/A - reason`, or `Blocked` with an evidence link in
    `docs/WEBSITE-DELIVERY-STATUS.md`. Never tick from intent. The studio's `release-readiness.md`
    gate stays mandatory for any public launch; the owner signs.

## Commands

| Command                 | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `npm run dev`           | Start the app at `http://localhost:3000`             |
| `npm run db:up`         | Start Postgres, Redis, and Mailpit via Docker        |
| `npm run db:push`       | Sync the Prisma schema (fast hackathon path)         |
| `npm run db:migrate`    | Create a real migration (use before schema changes)  |
| `npm run db:seed`       | Seed the demo workspace, owner, and welcome email    |
| `npm run email:process` | Drain the email outbox into Mailpit                  |
| `npm run lint`          | ESLint                                               |
| `npm run typecheck`     | TypeScript, no emit                                  |
| `npm run test`          | Vitest unit tests                                    |
| `npm run test:coverage` | Vitest unit tests with enforced 95% thresholds       |
| `npm run test:e2e`      | Playwright golden-path and smoke tests               |
| `npm run build`         | Production build                                     |
| `npm run check`         | Format + lint + typecheck + unit tests + build       |
| `npm run release:check` | Full release gate with timings and a report          |
| `npm run security:audit`| Production dependency audit                          |
| `npm run verify`        | Machine and environment check                        |

## Definition of done

A feature is done only when it satisfies [docs/QUALITY-BAR.md](docs/QUALITY-BAR.md):

- The golden path works with seeded data.
- Loading, empty, error, and unauthorized states exist.
- Server-side authorization is enforced through the RBAC policy.
- Inputs are validated; errors use the standard envelope.
- User-facing events enqueue durable, escaped email through the outbox.
- No N+1 query, unbounded list, or client-trusted tenant id.
- Keyboard, focus, contrast, and reduced motion are checked.
- Unit or e2e coverage exists for the behavior.
- `npm run check` is green.
- The build log is updated.

## Top 1% bar

"Done" is the quality bar. "Top 1%" is the standard: the twelve-point test in
[docs/QUALITY-BAR.md](docs/QUALITY-BAR.md#the-top-1-test), passed with receipts.

- Every claim carries evidence: test name, screenshot, log line, measured number, or source URL.
  Delete any claim you cannot evidence.
- Every phase leaves the next one faster: artifact, decision log, next command, top three risks.
- Craft is visible in the details: real copy, designed states, brand tokens, no placeholder anything.
- If time forces a cut, cut features, never evidence, security, accessibility, or the demo path.

## Do not

- Invent APIs, datasets, benchmarks, customers, or testimonials.
- Present mock numbers as real measurements.
- Commit secrets, `.env` files, or real customer data.
- Add `any`, `@ts-ignore`, `console.log`, or commented-out code.
- Ship dead buttons, lorem ipsum, or placeholder links.
- Put authorization logic only in the client.
- Send email inline in a request transaction or log recipient addresses/reset links.
- Invent brand colors, fonts, or logo variants outside `docs/BRAND.md`.
- Paste a whole standard or skill into a prompt when a link will do.
- Build product-specific features before the brief and phase 05/06 artifacts exist.
- Run destructive database commands against a shared database.
- Refactor during the T-60 test window. Fix blockers only.
- Commit or push unless the user explicitly asks.

## Phase response format

Every phase ends with this block:

```text
## Phase NN — Name
Artifact: docs/discovery/NN-name.md
Gate: PASS | BLOCKED
Decisions:
- ...
Risks:
- ...
Next: phase NN+1 — Name
```

If a gate is blocked, stop and state the smallest decision needed to unblock it. Do not silently
lower the bar.

## Context hygiene and budget

- Read the discovery artifacts before re-deriving anything. Do not re-research settled questions;
  cite the artifact instead.
- Read only what the task needs, in this order: `AGENTS.md` → current phase prompt → its artifact →
  `docs/BRAND.md` if the work is visual. Stop when the task is covered.
- Budgets: at most three instruction files per phase (`AGENTS.md`, the phase prompt, one standard);
  each phase prompt ≤ 6 KB; each artifact ≤ 150 lines unless it is a checklist. Expand only with a
  decision, not prose.
- One artifact per phase. Link, do not copy. Load one skill at a time, at its phase boundary, and
  never paste skill text into an artifact.
- Keep a decision log in the current phase artifact. At handoff, write the current state, the next
  command, and the top three risks.
- If the stack must change, write an ADR in `docs/decisions/` and update
  `docs/ARCHITECTURE.md` before coding.

## When the user gives the problem statement

Run `agent-prompts/MASTER-WORKFLOW.md`. That prompt is the source of truth for phase order, gates, and
artifact formats. This file is the standing contract; the master workflow is the runbook.
