# Deployment

The demo must run from a deployed URL. A local fallback is acceptable only when the platform fails,
and it must be recorded before the pitch.

## Environments

| Environment | Purpose                          | Database                     | Secrets                    |
| ----------- | -------------------------------- | ---------------------------- | -------------------------- |
| Local       | Build and debug                  | Docker Postgres              | `.env`                     |
| Preview     | Pull request and stakeholder check | Branch database or schema  | Platform preview secrets   |
| Production  | Demo and submission              | Managed Postgres with backups | Platform production secrets |

Never point preview or local at production data.

## Environment variables

Required:

```text
APP_URL=https://your-app.example
APP_VERSION=1.0.0
NODE_ENV=production
LOG_LEVEL=info
DATABASE_URL=postgresql://...
AUTH_SECRET=<32+ random bytes>
EMAIL_PROVIDER=resend
EMAIL_FROM="Hexa <no-reply@your-domain.example>"
RESEND_API_KEY=<provider key>
CRON_SECRET=<16+ random chars>
```

Optional: `REDIS_URL`, `SENTRY_DSN`, `SMTP_URL` when `EMAIL_PROVIDER=smtp`.

Email requires a verified sending domain with SPF, DKIM, and DMARC. Use a dedicated subdomain for
transactional mail. The cron endpoint is `POST /api/cron/email` with
`Authorization: Bearer $CRON_SECRET`; schedule it every minute or use the platform's cron.

Use the platform secret store. Do not bake secrets into the Docker image.

## Option A: Vercel

1. Import the repository.
2. Set the root directory to the repository root. The workspace build command is
   `npm run build --workspace @hexa/web`.
3. Set the environment variables for Preview and Production.
4. Provision Postgres (Neon, Supabase, Vercel Postgres, or another managed provider). Use a pooled
   connection string for serverless.
5. Deploy. Then run migrations against the production database:

```bash
DATABASE_URL="<production-url>" npm run db:deploy
DATABASE_URL="<production-url>" npm run db:seed
```

6. Add a Vercel Cron entry for `/api/cron/email`, or call the endpoint from an external scheduler with
   the `CRON_SECRET`.
7. Smoke the deployed URL, including one email delivery.

## Option B: Docker

```bash
docker build -t hexa-web .
docker run --rm -p 3000:3000 --env-file .env.production hexa-web
```

For a managed platform (Fly.io, Render, Railway, ECS), push the image, set the env vars, run
`npm run db:deploy` as a release command, and expose port 3000 with a health check on
`/api/health`.

## Database

- Use a managed Postgres with automated backups and TLS.
- Use a pooled connection string for serverless or many instances.
- Do not expose the database port publicly.
- Create a least-privilege application user.
- Run `prisma migrate deploy` before starting the new app version.
- Seed only the demo workspace, never real data.

## Pre-deploy checklist

- [ ] `npm run release:check` is green locally.
- [ ] `DATABASE_URL` points at the target environment.
- [ ] `AUTH_SECRET` is set and not the placeholder.
- [ ] `CRON_SECRET` is set and not the placeholder.
- [ ] `EMAIL_PROVIDER`, `EMAIL_FROM`, and provider credentials are set.
- [ ] The sending domain has SPF, DKIM, and DMARC.
- [ ] The cron schedule calls `/api/cron/email`.
- [ ] `APP_URL` matches the deployed domain.
- [ ] Security headers are enabled.
- [ ] Migrations are committed.
- [ ] The seed is idempotent.
- [ ] The fallback recording exists.

## Post-deploy smoke

Run these against the deployed URL:

```bash
curl -i https://your-app.example/
curl -i https://your-app.example/api/health
```

Then in a browser:

- [ ] Home loads over HTTPS with no console errors.
- [ ] Health returns `200` and `database: "ok"`.
- [ ] Security headers are present.
- [ ] Demo login or demo mode works.
- [ ] The golden path completes.
- [ ] One transactional email is queued, drained, and delivered.
- [ ] The outbox row reaches `SENT` with a provider message id.
- [ ] Empty, error, and unauthorized states render.
- [ ] Mobile width is usable.
- [ ] No secret appears in the page source or network payloads.

## Rollback

- Keep the previous deployment available.
- If the new build breaks the demo, roll back first, diagnose second.
- If a migration is destructive, restore from backup rather than attempting a down-migration under
  pressure.
- Record the rollback command in the release report.
- Never debug infrastructure during the final test window.

## Observability

- Health: `/api/health` returns service, version, database status, latency, request id.
- Logs: structured JSON, request id on every request, secrets redacted.
- Errors: log 5xx server-side with a request id; return a generic message.
- Metrics: platform request count, error rate, and latency; add Sentry or an equivalent if time
  allows.
- Alerts: not required for the demo, but know where the logs live.

## Runbook

| Symptom                    | First action                                             |
| -------------------------- | -------------------------------------------------------- |
| 502 / 503 from platform    | Check deploy logs, health check, and database reachability |
| Health says `degraded`     | Check `DATABASE_URL`, database status, and connection pool |
| Migrations fail            | Stop the deploy; inspect the migration; restore if needed |
| Auth loop or cookie issue  | Check `APP_URL`, cookie domain, and `AUTH_SECRET`         |
| Slow first load            | Check bundle size, image sizes, and cold start            |
| Demo data missing          | Re-run the seed against the deployed database             |
| Email queue growing        | Check the cron schedule, `CRON_SECRET`, provider status, and worker logs |
| Email in spam              | Verify SPF, DKIM, DMARC, sender domain, and plain-text part |
| Cron returns 401           | Check the `Authorization: Bearer` header and `CRON_SECRET` |

## Submission URLs

Record in `docs/discovery/10-demo-script.md`:

- Deployed URL
- Demo account or demo-mode instructions
- Fallback recording path
- Health endpoint
- Repository URL
