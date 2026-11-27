# 09 — Release report

> Phase 09 · 7:45–8:45 · Source: `agent-prompts/09-FINAL-TEST.md`
> Feature freeze. Prove the frozen build works. Fix only blockers.

## Freeze

- Freeze announced at:
- Commit under test:
- Deployed URL:
- Environment:

## Release gate

Run `npm run release:check`, then record the result.

| Check | Result | Duration | Evidence |
| ----- | ------ | -------- | -------- |
| Format |        |          |          |
| Lint |          |          |          |
| Typecheck |     |          |          |
| Unit tests |    |          |          |
| Production build | |        |          |
| E2E |           |          |          |
| Dependency audit | |        |          |

Report artifact: `artifacts/release-report.md`.

## Manual checks

| Check | Result | Notes |
| ----- | ------ | ----- |
| Golden path | | |
| Empty state | | |
| Error state | | |
| Unauthorized state | | |
| Mobile width (390px) | | |
| Keyboard path and focus | | |
| Contrast | | |
| Reduced motion | | |

## Deployed smoke

| Target | Result | Notes |
| ------ | ------ | ----- |
| Home |        |       |
| `/api/health` | |     |
| Demo login or demo mode | | |
| Golden path | | |
| One email delivery or Mailpit fallback | | |

## Fallback

- Recording path:
- Played once on:
- Works from a cold start:

## Waivers

| Check | Reason | Risk | Owner |
| ----- | ------ | ---- | ----- |
|       |        |      |       |

## Gate

- [ ] The release gate is green, or a waiver is recorded.
- [ ] The deployed URL passes the smoke test.
- [ ] The fallback recording is playable.
- [ ] Only blockers were fixed after the freeze.

Next: `agent-prompts/10-DEMO-PITCH.md` → `docs/discovery/10-demo-script.md`
