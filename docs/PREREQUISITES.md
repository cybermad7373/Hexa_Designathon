# Prerequisites

Everything needed before the clock starts. Do this the day before, not at hour zero.

## Required tools

| Tool           | Version  | Why                                      | Install (Windows)                              |
| -------------- | -------- | ---------------------------------------- | ---------------------------------------------- |
| Node.js        | 22.12+   | Runtime. 22 LTS or 24.                   | `winget install OpenJS.NodeJS.LTS`             |
| npm            | 10+      | Workspaces and scripts.                  | Ships with Node                                |
| Git            | 2.40+    | Version control.                         | `winget install Git.Git`                       |
| Docker Desktop | 4.x      | Postgres, Redis, and Mailpit locally.    | `winget install Docker.DockerDesktop`          |
| VS Code        | Current  | Editor, optional but recommended.        | `winget install Microsoft.VisualStudioCode`    |

macOS/Linux equivalents: `brew install node git`, Docker Desktop or `docker.io` + `docker-compose`.

## Optional tools

| Tool           | Use                                              |
| -------------- | ------------------------------------------------ |
| Playwright     | e2e tests: `npx playwright install chromium`     |
| k6             | Load smoke: `winget install k6.k6`               |
| Vercel CLI     | Deploy: `npm i -g vercel`                        |
| Prisma Studio  | Inspect data: `npm run db:studio`                |
| GitHub CLI     | PRs and releases: `winget install GitHub.cli`    |

## First-time setup

```powershell
git clone https://github.com/cybermad7373/Hexa_Designathon.git
cd Hexa_Designathon
npm install
npm run setup
npm run db:up
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The health endpoint is at
[http://localhost:3000/api/health](http://localhost:3000/api/health). Mailpit is at
[http://localhost:8025](http://localhost:8025); the app sends local email to SMTP port `1025`.

`npm run setup` copies `.env.example` to `apps/web/.env`. It does not overwrite an existing file. The
app and Prisma both run from `apps/web`, so that is the single source of truth for local env values.

## Environment variables

| Variable       | Required | Default                                                      | Notes                                      |
| -------------- | -------- | ------------------------------------------------------------ | ------------------------------------------ |
| `APP_URL`      | Yes      | `http://localhost:3000`                                      | Public base URL; use the deployed URL in prod |
| `APP_VERSION`  | No       | `0.1.0`                                                      | Shown in health and logs                   |
| `NODE_ENV`     | No       | `development`                                                | Set by the platform in production          |
| `LOG_LEVEL`    | No       | `info`                                                       | `debug` locally, `info` in prod            |
| `DATABASE_URL` | Yes      | `postgresql://hexa:hexa@localhost:5433/hexa?schema=public`   | Use a pooled URL in production             |
| `REDIS_URL`    | No       | `redis://localhost:6379`                                     | Required once you add queues or shared limits |
| `AUTH_SECRET`  | Prod     | placeholder                                                  | 32+ random bytes; never commit             |
| `EMAIL_PROVIDER` | No     | `console`                                                    | `console`, `smtp`, or `resend`             |
| `EMAIL_FROM`   | No       | `Hexa <no-reply@hexa.local>`                                 | Verified sender in production              |
| `SMTP_URL`     | SMTP     | `smtp://localhost:1025`                                      | Mailpit locally; provider URL in prod      |
| `RESEND_API_KEY` | Resend | empty                                                        | Required only for `EMAIL_PROVIDER=resend`  |
| `CRON_SECRET`  | Prod     | empty                                                        | 16+ random chars; protects the email worker |

Generate a secret:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Verify the machine

```bash
npm run verify
```

Expected: Node, npm, git, Docker daemon, `.env`, dependencies, and Prisma client all pass. Warnings
for optional tools are fine.

## Day-of checklist (30 minutes before the clock)

- [ ] `npm ci` completes cleanly.
- [ ] `apps/web/.env` exists and matches `.env.example`.
- [ ] Docker images are pulled: `docker pull postgres:16-alpine`, `docker pull redis:7-alpine`, and
      `docker pull axllent/mailpit:v1.27`.
- [ ] `npm run db:up` is healthy: `docker compose ps`.
- [ ] `npm run db:push && npm run db:seed` completes.
- [ ] `npm run dev` serves the app; the health endpoint returns `200`.
- [ ] `npm run email:process` delivers the seeded welcome email to Mailpit.
- [ ] Playwright browser installed: `npx playwright install chromium`.
- [ ] `npm run check` is green on the untouched scaffold.
- [ ] Ports 3000, 5433, 6379, 1025, and 8025 are free.
- [ ] Deployment target is authenticated and a test deploy works.
- [ ] A screen recorder is installed and tested.
- [ ] The problem statement is saved in `docs/discovery/00-problem-statement.md`.
- [ ] `agent-prompts/MASTER-WORKFLOW.md` is open.

## Troubleshooting

| Symptom                                | Fix                                                                 |
| -------------------------------------- | ------------------------------------------------------------------- |
| `pnpm: not recognized`                 | This repo uses npm workspaces. Use `npm`, not pnpm.                 |
| Docker daemon not running              | Start Docker Desktop and wait for the whale icon.                   |
| Port 3000 in use                       | `npx kill-port 3000` or `npm run dev -- --port 3001`.               |
| Port 5433 in use                       | Stop the conflicting service or change the compose host port.        |
| Prisma `P1001` cannot reach database   | Run `npm run db:up` and check `docker compose ps`.                  |
| Prisma client missing                  | `npm run db:push` then `npx prisma generate --schema apps/web/prisma/schema.prisma`. |
| Email not in Mailpit                   | Check `EMAIL_PROVIDER=smtp`, `SMTP_URL=smtp://localhost:1025`, then run `npm run email:process`. |
| `CRON_SECRET` missing                  | Add a 16+ character secret to `.env`; the worker returns `503` without it. |
| Playwright browser missing             | `npx playwright install chromium`.                                  |
| PowerShell blocks npm.ps1              | Use `npm.cmd` or set `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. |
| `apps/web/.env` missing                | `npm run setup`.                                                    |
| Build fails on a fresh clone           | Ensure `DATABASE_URL` exists; the app validates env at runtime.     |
| `npm run check` fails with `EPERM` on Windows | Stop `npm run dev` first. On Windows, `prisma generate` cannot replace the engine DLL while the dev server holds it. |

## Security notes for local setup

- The Docker database credentials are development-only. Never expose port 5433 publicly.
- Never commit `.env`. The repo ignores it.
- Replace `AUTH_SECRET` and `CRON_SECRET` before any shared or deployed environment.
- Do not seed real customer data. Use synthetic demo data only.
- Never send real email from local development; Mailpit is the local sink.
- Set SPF, DKIM, and DMARC on the production sending domain before enabling real delivery.
- If you deploy the Docker image, pass secrets at runtime, not build time.

## Timing rule

Do not spend the first hour of the designathon on setup. If a tool is broken at hour zero, use the
fallback: SQLite is not wired in, so prefer a hosted Postgres URL (Neon, Supabase, Railway) and set
`DATABASE_URL` in `.env`. The app only needs a reachable Postgres for the demo path.
