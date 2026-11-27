# Hexa Designathon OS

A phase-gated operating system for a 10-hour designathon. Drop in a raw problem statement; get out a
deployed, secure, scalable, demo-ready product with the receipts.

The repo ships with a production-ready Next.js + TypeScript + Postgres scaffold, a discovery
workflow, a visual quality bar, a security and scalability standard, and a protected final test
window. The interface runs on the locked Hexaware brand system: Hexaware blue `#3C2CDA`, Manrope,
and the palette in [docs/BRAND.md](docs/BRAND.md).

## Quickstart

Requirements: Node 22.12+, npm 10+, Git, and Docker Desktop. Full setup:
[docs/PREREQUISITES.md](docs/PREREQUISITES.md).

```bash
git clone https://github.com/cybermad7373/Hexa_Designathon.git
cd Hexa_Designathon
npm install
npm run setup
npm run db:up
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Verify the machine with `npm run verify`.
Mailpit captures local email at [http://localhost:8025](http://localhost:8025); run
`npm run email:process` to drain the seeded welcome email.

This is a scaffold. It ships reusable foundations, standards, and prompts, not a product idea. Once the
problem statement is in place, run the master workflow and build only what the brief earns.

## What is inside

```text
.
├── AGENTS.md                     # standing contract for the build agent
├── LICENSE                       # MIT license for this project
├── THIRD-PARTY-NOTICES.md        # dependency licenses, versions, and sources
├── apps/web                      # Next.js app, Prisma schema, tests
├── docs/
│   ├── PREREQUISITES.md          # install, env, day-of checklist
│   ├── PLAYBOOK-10H.md           # hour-by-hour plan and scope control
│   ├── ARCHITECTURE.md           # default stack and layering rules
│   ├── SCALABILITY.md            # capacity, caching, pagination, load tests
│   ├── SECURITY.md               # threat model and OWASP checklist
│   ├── BRAND.md                  # locked Hexaware palette, type, logo rules
│   ├── DESIGN-SYSTEM.md          # anti-slop visual standard
│   ├── NAMING.md                 # product naming and rebrand checklist
│   ├── QUALITY-BAR.md            # definition of done and release gate
│   ├── API-STANDARDS.md          # envelopes, errors, pagination, idempotency
│   ├── DATA-MODEL.md             # tenancy, RBAC, email outbox, indexing
│   ├── TESTING.md                # test pyramid and T-60 sequence
│   ├── DEPLOYMENT.md             # Vercel and Docker paths, rollback
│   ├── DEMO-AND-PITCH.md         # 3-minute script and Q&A
│   ├── SUBMISSION-CHECKLIST.md   # final 30 minutes
│   ├── decisions/                # architecture decision records
│   └── discovery/                # phase artifact templates, filled in as you go
├── licenses/                     # full texts of dependency licenses
├── agent-prompts/
│   ├── MASTER-WORKFLOW.md        # the runbook to paste with the brief
│   └── 00–10 phase prompts       # focused prompts for each gate
├── scripts/                      # setup, verify, release gate
└── tests/load/                   # optional k6 smoke test
```

## The workflow

1. **Intake** the brief.
2. **Explore** users, jobs, alternatives, constraints.
3. **Attack** the idea with edge cases and abuse cases.
4. **Research** prior art, APIs, datasets, regulations.
5. **Enhance** the problem statement into a scoped PRD with metrics.
6. **Design** the architecture, data model, API, authz, and failure modes.
7. **Direct** the visual system and generate references.
8. **Build** vertical slices, not horizontal layers.
9. **Harden** security, scale, accessibility, performance.
10. **Test** in the protected final hour.
11. **Demo** the golden path with a fallback.

The full runbook is [agent-prompts/MASTER-WORKFLOW.md](agent-prompts/MASTER-WORKFLOW.md). The phase prompts are in
[agent-prompts/](agent-prompts/).

The runbook is development tooling. `npm run prepare:submission` removes it before submission; see
[docs/SUBMISSION-CHECKLIST.md](docs/SUBMISSION-CHECKLIST.md).

## Commands

| Command                 | What it does                                   |
| ----------------------- | ---------------------------------------------- |
| `npm run dev`           | Start the app                                  |
| `npm run db:up`         | Start Postgres, Redis, and Mailpit             |
| `npm run db:push`       | Sync the Prisma schema                         |
| `npm run db:seed`       | Seed the demo workspace and one welcome email  |
| `npm run email:process` | Drain the email outbox into Mailpit            |
| `npm run lint`          | ESLint                                         |
| `npm run typecheck`     | TypeScript                                     |
| `npm run test`          | Vitest                                         |
| `npm run test:e2e`      | Playwright                                     |
| `npm run check`         | Format + lint + types + unit + build           |
| `npm run release:check` | Full release gate, writes a timed report       |
| `npm run security:audit`| Production dependency audit                    |
| `npm run verify`        | Check the machine and environment              |

## Default stack

- **Next.js 15** App Router, React 19, TypeScript strict
- **Tailwind CSS 4** with Hexaware design tokens, Manrope (brand) and Geist Mono
- **PostgreSQL 16** + **Prisma 6** (multi-tenant foundation)
- **RBAC policy** with four roles, permissions, and escalation guards
- **Email outbox** with templates, preferences, suppression, retries, and Mailpit locally
- **Redis 7** available for rate limits, cache, and queues
- **Vitest** for unit tests, **Playwright** for e2e
- **Pino** structured logs, request ids, health endpoint
- **Docker Compose** for local services, **Dockerfile** for the app
- **GitHub Actions** for lint, types, tests, build, and dependency audit

The stack is a default, not a religion. If the problem demands something else, write an ADR in
`docs/decisions/` and update `docs/ARCHITECTURE.md` before coding.

Security pins: the root `package.json` overrides three transitive packages (`postcss`, `effect`,
`deepmerge-ts`) to patched versions that their parents have not adopted yet. Production audit is
clean. Re-check the pins when Next.js or Prisma is upgraded.

## Standards

- [Security](docs/SECURITY.md): authz, RBAC, tenancy, email safety, validation, rate limits, secrets, OWASP.
- [Scalability](docs/SCALABILITY.md): budgets, pagination, caching, queues, load tests.
- [Quality bar](docs/QUALITY-BAR.md): definition of done and release gate.
- [Brand](docs/BRAND.md): locked palette, tokens, typography, logo rules.
- [Design system](docs/DESIGN-SYSTEM.md): visual direction, motion, accessibility, email design.
- [Testing](docs/TESTING.md): the T-60 final test sequence.

## The final test window

Reserve **T-60 to T-00** for testing. Freeze features, run the release gate, smoke the deployed URL,
rehearse the demo twice. A working, tested product beats an unfinished feature list.

```bash
npm run release:check
```

The report lands in `artifacts/release-report.md`. Copy the summary into
`docs/discovery/09-release-report.md`.

## License

MIT. See [LICENSE](LICENSE). Third-party dependencies remain under their own licenses; see
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) and the full texts in [`licenses/`](licenses).
