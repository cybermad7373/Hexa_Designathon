# 07 — Build log

> Phase 07 · 3:30–6:45 · Source: `agent-prompts/07-BUILD.md`
> Update this log at least hourly. Record what works, what broke, the next step, and the risks.

## Current state

- Golden path status:
- Last green command:
- Known broken:
- Deployed URL (if any):

## Slices

| # | Slice | Status | Notes |
| - | ----- | ------ | ----- |
| 1 | Foundation |        |       |
| 2 | Data |            |       |
| 3 | Auth and tenancy | |       |
| 4 | Core read path |  |       |
| 5 | Core write path | |       |
| 6 | Email |           |       |
| 7 | Secondary flow |  |       |
| 8 | Polish |          |       |

Status: todo / in progress / done / cut.

## Hourly log

| Time | Done | Broke | Next | Risks |
| ---- | ---- | ----- | ---- | ----- |
| T+3:30 |   |       |      |       |
| T+4:30 |   |       |      |       |
| T+5:30 |   |       |      |       |
| T+6:30 |   |       |      |       |

## Commands run

```text
npm run lint
npm run typecheck
npm run test
```

## Decisions

- Decision — why — alternative rejected.

## Risks

| # | Risk | Impact | Mitigation | Status |
| - | ---- | ------ | ---------- | ------ |
| 1 |      |        |            |        |

## Gate

- [ ] The golden path works end to end locally with seeded data.
- [ ] Lint, typecheck, and unit tests are green.
- [ ] Every mutation is validated, authorized, and audited where required.
- [ ] Every data view has loading, empty, error, and unauthorized states.
- [ ] No dead buttons, lorem ipsum, `any`, or `@ts-ignore`.
- [ ] The build log is current.

Next: `agent-prompts/08-HARDEN.md` → `docs/discovery/08-hardening-report.md`
