# Discovery artifacts

This directory is the audit trail of the ten-hour build. Every phase writes one artifact. The next
phase reads it before starting.

The repo is a scaffold. Do not pre-fill these artifacts with an invented product idea. Phase 00 stays
blank until the raw brief arrives. Artifacts 01–10 ship as empty templates: fill them in place during
their phase, keep the headings, and delete the instructional quotes once the phase is done.

Product naming is decided only after the brief is reviewed. See
[`docs/NAMING.md`](../NAMING.md) for the rename checklist.

## Artifact map

| #   | Artifact                                      | Phase            | Gate                                        |
| --- | --------------------------------------------- | ---------------- | ------------------------------------------- |
| 00  | `00-problem-statement.md`                     | Intake           | Requirements, constraints, unknowns captured |
| 01  | `01-opportunity-map.md`                       | Explore          | Users, jobs, alternatives, assumptions       |
| 02  | `02-edge-cases.md`                            | Edge cases       | Failure matrix, abuse cases, decisions       |
| 03  | `03-research.md`                              | Research         | Sources, prior art, build-vs-borrow          |
| 04  | `04-enhanced-problem-statement.md`            | Enhance PS       | Metrics, scope, acceptance criteria          |
| 05  | `05-solution-design.md`                       | Solution design  | Architecture, data, API, RBAC, email, risks  |
| 06  | `06-visual-direction.md`                      | Visual direction | Design read, tokens, motion, references      |
| 07  | `07-build-log.md`                             | Build            | Golden path works end to end                 |
| 08  | `08-hardening-report.md`                      | Harden           | No high/critical findings                    |
| 09  | `09-release-report.md`                        | Final test       | Release gate green or waived                 |
| 10  | `10-demo-script.md`                           | Demo + pitch     | Rehearsed twice, fallback ready              |

Supporting assets live in `docs/discovery/assets/` (reference images, screenshots, diagrams).

Each phase also confirms the applicable items in `docs/WEBSITE-DELIVERY-STATUS.md` with evidence.
The four scored deliverables and the 95% test line are tracked in `docs/EVALUATION-CHECKLIST.md`.
Neither is complete until evidence is linked; a filled template is not progress.

## Rules

- The raw brief is preserved verbatim in `00-problem-statement.md`. Do not edit it later; add notes
  below it.
- Every claim in research has a source or is labeled an assumption.
- Every edge case has a decision: handle now, handle later, or explicitly out of scope.
- Every requirement in 04 maps to a component in 05 and a test in 09.
- RBAC and email are designed in 05, implemented in 07, hardened in 08, and proven in 09.
- The build log is updated at least hourly.
- The release report contains evidence, not adjectives.

## Status

Update this table as you go.

| Phase | Status | Artifact | Notes |
| ----- | ------ | -------- | ----- |
| 00    | ⬜     |          |       |
| 01    | ⬜     |          |       |
| 02    | ⬜     |          |       |
| 03    | ⬜     |          |       |
| 04    | ⬜     |          |       |
| 05    | ⬜     |          |       |
| 06    | ⬜     |          |       |
| 07    | ⬜     |          |       |
| 08    | ⬜     |          |       |
| 09    | ⬜     |          |       |
| 10    | ⬜     |          |       |

Legend: ⬜ pending, 🟡 in progress, ✅ done, 🚫 blocked.

A phase is done only when its template is filled, its gate passes, and the status below is updated.
Having a template on disk is not progress.

## Handoff format

When pausing or handing off, append:

```text
State: what works, what is broken.
Next command: the exact next action.
Top risks: three items, ranked.
Open decisions: anything that blocks the next phase.
```
