# Phase 09 — Final test

**Time:** 7:45–8:45
**Artifact:** `docs/discovery/09-release-report.md`
**Goal:** prove the frozen build works. No new features, no refactors.

## Announce the freeze

At T-60, stop feature work. Merge or park branches. One branch must be deployable. Fix only blockers.

## Run the release gate

```bash
npm run release:check
```

If Playwright browsers are missing:

```bash
npx playwright install chromium
```

## Manual checks

- Golden path from seeded data.
- Empty state.
- Error state.
- Unauthorized state.
- RBAC boundary: viewer cannot write; admin cannot create an admin.
- Last-owner removal is rejected.
- Email: enqueue, drain, inspect Mailpit, verify outbox status.
- Mobile width and keyboard path.
- Contrast and reduced motion.

## Deployed smoke

- Home loads.
- `/api/health` returns `200`.
- Demo login works.
- Golden path works.
- One email is delivered, or the documented Mailpit fallback is shown.
- Security headers are present.

## Fallback

- Play the fallback recording once.
- Confirm the demo credentials and URL are in `docs/discovery/10-demo-script.md`.

## Report

Write `docs/discovery/09-release-report.md` with:
- commit, URL, timestamp, environment;
- gate results with evidence;
- waivers with reason, risk, and owner;
- known limitations;
- rollback path.

## Gate

- All required checks pass, or a waiver is recorded with reason, risk, and owner.
- The release report is written.
- No feature work happened after the freeze.

## Response block

```text
## Phase 09 — Final test
Artifact: docs/discovery/09-release-report.md
Gate: PASS | BLOCKED
Decisions:
- ...
Risks:
- ...
Next: phase 10 — Demo and pitch
```

If a check fails, fix the smallest blocker and re-run that check plus the golden path. Do not refactor.
