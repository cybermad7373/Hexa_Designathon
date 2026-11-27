# Prompts

The prompt chain is the runbook. It forces exploration before code, design before build, and testing
before the demo. The repo is a scaffold; these prompts are how you turn it into a product without
inventing the idea in advance.

## How to use

1. Put the raw problem statement in `docs/discovery/00-problem-statement.md`.
2. Open `MASTER-WORKFLOW.md`.
3. Paste it into the agent, with the problem statement appended under "Problem statement", or say:
   "Read `agent-prompts/MASTER-WORKFLOW.md` and run it. The brief is in
   `docs/discovery/00-problem-statement.md`."
4. Let the agent run phases 00 → 10 in order. Review each artifact before the next phase.
5. If you need to pause or hand off, use the individual phase prompt for the current phase.

The master workflow is self-contained. The phase prompts are the detailed version of each step and
are useful when you want to re-run a gate, split work across agents, or recover a stalled phase.

## Order

| Prompt                              | Phase            | Artifact                                      |
| ----------------------------------- | ---------------- | --------------------------------------------- |
| `00-INTAKE.md`                      | Intake           | `00-problem-statement.md`                     |
| `01-EXPLORE.md`                     | Explore          | `01-opportunity-map.md`                       |
| `02-EDGE-CASES.md`                  | Edge cases       | `02-edge-cases.md`                            |
| `03-RESEARCH.md`                    | Research         | `03-research.md`                              |
| `04-ENHANCE-PROBLEM-STATEMENT.md`   | Enhance PS       | `04-enhanced-problem-statement.md`            |
| `05-SOLUTION-DESIGN.md`             | Solution design  | `05-solution-design.md`                       |
| `06-VISUAL-DIRECTION.md`            | Visual direction | `06-visual-direction.md`                      |
| `07-BUILD.md`                       | Build            | `07-build-log.md`                             |
| `08-HARDEN.md`                      | Harden           | `08-hardening-report.md`                      |
| `09-FINAL-TEST.md`                  | Final test       | `09-release-report.md`                        |
| `10-DEMO-PITCH.md`                  | Demo + pitch     | `10-demo-script.md`                           |

## Skill loading

Use the `skill` tool at the phase boundary. The exact matrix is in `AGENTS.md` and
`docs/DESIGN-SYSTEM.md`. The non-negotiables:

- Phase 06: `design-taste-frontend`, plus `imagegen-frontend-web` or `imagegen-frontend-mobile` for
  references.
- Phase 07: `full-output-enforcement` for large code generation.
- Phase 08: `redesign-existing-projects` only if the brief is a redesign.

If a skill is unavailable, follow `docs/DESIGN-SYSTEM.md` and say which fallback you used.

## Rules

- No product code before `05-solution-design.md` and `06-visual-direction.md` exist.
- Every phase ends with a gate and a response block.
- Every claim in research has a source or is labeled an assumption.
- Every edge case has a decision.
- Every requirement maps to a component and a test.
- RBAC roles, permissions, escalation guards, and the last-owner rule are designed in phase 05.
- Email events, templates, preferences, suppression, and failure states are designed in phase 05.
- The final test window is protected. Freeze features at T-60.
- Unit tests pass 100% with zero skipped or flaky and >= 95% coverage on every tested module.
- Produce the four scored deliverables: repo link, slide deck, 3–5 minute video, and a <= 1000 word
  architecture abstract. Details in `docs/EVALUATION-CHECKLIST.md`.
- Confirm the website delivery gate at each phase boundary in `docs/WEBSITE-DELIVERY-STATUS.md`.
  Items are `Done`, `N/A - reason`, or `Blocked`, each with evidence. No ticking from intent.
- Do not commit or push unless the user explicitly asks.

## Timeboxes

The timeboxes are in `docs/PLAYBOOK-10H.md`. If a phase overruns, compress the artifact, not the
quality gate. Never skip the final test.
