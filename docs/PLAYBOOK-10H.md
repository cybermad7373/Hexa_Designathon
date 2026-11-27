# The 10-hour playbook

The clock is the constraint. Scope is the variable. Quality is not.

## Operating rules

1. **Artifacts before code.** Each phase ends with a file in `docs/discovery/`.
2. **One golden path.** Build the demo path first; everything else is optional.
3. **Vertical slices.** Ship a thin end-to-end flow before widening any layer.
4. **Checkpoint every two hours.** Show the current state, name the next risk.
5. **Cut scope, not states.** Loading, empty, error, and unauthorized states survive every cut.
6. **Protect the final hour.** T-60 is a feature freeze. Testing is scheduled work, not leftover time.
7. **No silent assumptions.** Write them down; validate the riskiest one first.

## Timeline

| Time        | Phase            | Output                                         | Checkpoint                    |
| ----------- | ---------------- | ---------------------------------------------- | ----------------------------- |
| 0:00–0:15   | 00 Intake        | Raw brief, constraints, unknowns               | Brief restated in one sentence |
| 0:15–0:55   | 01 Explore       | Opportunity map, personas, jobs, alternatives  | Top three opportunities ranked |
| 0:55–1:20   | 02 Edge cases    | Failure matrix, abuse cases, must-handle list  | Top 10 edge cases chosen      |
| 1:20–1:45   | 03 Research      | Prior art, APIs, datasets, build-vs-borrow     | Reuse decisions made          |
| 1:45–2:15   | 04 Enhance PS    | Scoped PRD, metrics, acceptance criteria       | Scope and cut line agreed     |
| 2:15–3:00   | 05 Solution      | Architecture, data, API, authz, slices         | Design review pass            |
| 3:00–3:30   | 06 Visual        | Design read, brand tokens (`BRAND.md`), refs   | Visual direction locked       |
| 3:30–5:00   | 07 Build A       | Foundation, data, auth, core read path         | Golden path half-working      |
| 5:00–6:45   | 07 Build B       | Core write path, secondary flow, polish        | Golden path end to end        |
| 6:45–7:45   | 08 Harden        | Security, scale, a11y, perf fixes              | No high/critical findings     |
| 7:45–8:45   | 09 Final test    | Full release gate, deployed smoke, regression  | Release report signed         |
| 8:45–9:30   | 10 Demo          | Script, slides, fallback recording             | Rehearsal one                 |
| 9:30–10:00  | 10 Pitch         | Rehearsal two, submission, buffer              | Submitted early               |

If the build is behind at 5:00, cut the secondary flow. If it is behind at 6:00, cut all stretch
features. Never cut the final test window.

## Checkpoint protocol

At each checkpoint, answer in five lines:

```text
Working: the one flow a judge can see.
Broken: the highest-severity known issue.
Next: the next vertical slice.
Risk: the thing most likely to break the demo.
Decision: what we are cutting or changing now.
```

If a checkpoint has no working flow, stop adding features and finish the current slice.

## Scope control

### Must ship

- One golden path from seed data to visible result.
- Authentication or a clearly scoped single-tenant demo mode.
- Server-side authorization on every workspace-scoped read and write.
- RBAC with the four roles, escalation guards, and last-owner protection.
- Transactional email for the golden-path events, through a durable outbox.
- Input validation and a standard error envelope.
- Loading, empty, error, and unauthorized states on every data view.
- Seeded demo data and a reset command.
- Health endpoint and structured logs.
- Deployed URL, or a local fallback recording if deployment fails.
- A rehearsed 3-minute demo.

### Should ship

- Email preference center and suppression handling.
- Audit log for mutations.
- Cursor pagination on the primary list.
- Rate limiting on auth and write endpoints.
- Idempotency on the primary create action.
- Basic analytics or usage signal.
- Dark/light theme if the product is consumer-facing.

### Stretch (only after the release gate is green)

- Real-time updates.
- Import/export.
- Integrations.
- Admin analytics.
- Fancy motion.
- Extra roles.

### Never cut

- Authorization checks.
- Input validation.
- Error and empty states.
- Seed data.
- The final test window.
- The demo fallback.

## Team split

### Solo

Run phases in order. Use the agent to draft artifacts and code. Review every authz and data change
yourself. Timebox exploration to 90 minutes, not more.

### Two people

- **Product/design:** phases 01–06, copy, demo narrative, visual QA.
- **Engineering:** scaffold, data, API, authz, golden path.
- Rejoin at every checkpoint. One person owns the release gate.

### Three or four people

- **Lead:** scope, architecture, integration, release gate.
- **Builder A:** data, auth, core read path.
- **Builder B:** core write path, secondary flow.
- **Designer/storyteller:** visual direction, UI polish, demo script, slides.
- No one owns a layer in isolation; everyone owns a working slice.

## Risk register

Keep this in the current phase artifact. Five rows maximum.

| Risk | Likelihood | Impact | Early signal | Mitigation | Owner |
| ---- | ---------- | ------ | ------------ | ---------- | ----- |
|      |            |        |              |            |       |

Review at every checkpoint. If a risk becomes real, cut scope immediately.

## Contingency plans

| Failure                        | Fallback                                                                 |
| ------------------------------ | ------------------------------------------------------------------------ |
| Database unreachable           | Hosted Postgres URL, or seed an in-memory demo dataset behind a flag.    |
| Auth provider down             | Demo mode with a signed-in seed user, clearly labeled, never in prod.    |
| Deployment fails               | Local demo with a recorded backup video. Do not debug infra at T-30.     |
| Third-party API down           | Cache the last good response and show a degraded-state banner.           |
| Email provider down            | Queue stays durable; show "email queued"; demo the outbox and Mailpit.   |
| Email lands in spam            | Use a verified domain, SPF/DKIM/DMARC, plain text, and a Mailpit fallback. |
| A key feature is half-built     | Hide it behind a disabled state with an honest "coming next" note.       |
| Demo data is wrong             | `npm run db:seed` reset; keep a snapshot of the expected screens.        |
| Time is short                  | Cut to one flow, one role, one screen, one story. Still test it.         |

## T-60 feature freeze

At T-60:

- Stop adding features.
- Merge or park branches. One branch must be deployable.
- Run `npm run release:check`.
- Fix only failures that block the golden path, security, or the demo.
- No refactors, no dependency upgrades, no schema changes unless the demo is broken.
- Smoke the email path: enqueue, process, verify the Mailpit message, check the outbox status.
- Freeze the deployed build. Rehearse from that build.
- Record the fallback demo before the final rehearsal.

## Final test sequence

See [TESTING.md](TESTING.md) for the minute-by-minute sequence. Summary:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
npm run release:check
```

Then smoke the deployed URL, walk the golden path twice, verify one real email delivery (or the Mailpit
fallback), and check the demo fallback.

## Submission timing

Submit with 15 minutes of buffer. Portals fail. Upload the video early. Keep the deployed URL and
demo credentials in `docs/discovery/10-demo-script.md`.
