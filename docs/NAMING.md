# Naming and rebrand checklist

The repo ships under a working brand, not a final product name. Decide the product name only after the
problem statement is reviewed and `docs/discovery/04-enhanced-problem-statement.md` has a filled
**Product naming** section.

## Working names

| Thing | Working name | Status |
| ----- | ------------ | ------ |
| Studio / event brand | Hexa | Keep unless the brief says otherwise |
| Product name | TBD | Decide after the brief |
| Product tagline | TBD | Decide after the brief |
| Demo workspace | Hexa Demo | Replace with product-flavored demo data |
| Package scope | `@hexa/web` | Rename only if the product name must appear in code |

## Rename points

Change these together so the app, tests, logs, and docs stay consistent.

| Area | File | What to change |
| ---- | ---- | -------------- |
| Page metadata | `apps/web/src/app/layout.tsx` | `title`, `title.template`, `applicationName`, description |
| Landing page copy | `apps/web/src/app/page.tsx` | Header wordmark, footer, hero copy (usually replaced by the real product UI) |
| Service identity | `apps/web/src/lib/logger.ts` | `service` name |
| Health payload | `apps/web/src/app/api/health/route.ts` | `service` value |
| Health e2e assertion | `apps/web/e2e/smoke.spec.ts` | Expected `service` value |
| Email defaults | `.env.example` and `apps/web/src/lib/env.ts` | `EMAIL_FROM` display name and domain |
| Workspace package | `apps/web/package.json` | `name` (`@hexa/web`) |
| Root scripts | `package.json` | Every `--workspace @hexa/web` reference |
| Docker build | `Dockerfile` | Image name and workspace references |
| Compose project | `docker-compose.yml` | Project name, container names, volume names |
| Seed data | `apps/web/prisma/seed.ts` | Demo user, workspace, welcome subject |
| Docs | `README.md`, `AGENTS.md`, `docs/*` | Titles, examples, deploy commands |
| CI | `.github/workflows/ci.yml` | Only if the package scope changed |

## Keep versus change

- **Keep:** database user `hexa`, local DB name `hexa`, ports, and repo name. They are infrastructure
  identifiers, not customer-facing brand.
- **Change:** anything a judge, user, or email recipient can see: page title, header, email sender
  name, health `service` value, demo data, and docs titles.
- **Change together:** the health route, its e2e assertion, and the logger base field. A mismatch here
  is a red test, not a cosmetic issue.

## Guardrails

- Do not rename before the problem statement is reviewed.
- Do not rename the git repository during the designathon; it breaks clone instructions and links.
- Do not invent a name that implies a customer, certification, or partnership that does not exist.
- Run `npm run check` after any rename. Metadata and tests are part of the contract.

## Decision log

| Date | Decision | Reason | Owner |
| ---- | -------- | ------ | ----- |
|      |          |        |       |
