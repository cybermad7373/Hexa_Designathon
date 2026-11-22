# Phase 00 — Intake

**Time:** 0:00–0:15
**Artifact:** `docs/discovery/00-problem-statement.md`
**Goal:** capture the problem exactly and name the constraints. Do not propose a solution.

## Read first

- `AGENTS.md`
- `docs/PLAYBOOK-10H.md`
- `docs/QUALITY-BAR.md`
- The raw brief supplied by the user.

## Do

1. Paste the brief verbatim into `docs/discovery/00-problem-statement.md`. Do not paraphrase it.
2. Read it twice. Extract:
   - explicit requirements;
   - implicit requirements;
   - constraints: time, team, stack, budget, data, legal, deployment;
   - users, buyers, blockers, and other stakeholders;
   - unknowns and contradictions;
   - red flags and non-goals;
   - success signals the judges or users will look for.
3. Write a one-sentence restatement in your own words.
4. Ask at most three questions, and only if the answer blocks all progress. Otherwise record an
   assumption and move on.
5. Name the smallest demo that would prove the idea, without designing it yet.
6. Confirm that no product code exists and that no product code will be written until phases 05 and 06
   artifacts exist.

## Output structure

```md
# Problem statement

## Raw brief
<verbatim>

## One-sentence restatement
...

## Explicit requirements
- ...

## Implicit requirements
- ...

## Constraints
- ...

## Stakeholders
- ...

## Unknowns and assumptions
- ...

## Red flags and non-goals
- ...

## Success signals
- ...

## Blocking questions
- ...
```

## Gate

- The brief is captured verbatim.
- Requirements, constraints, and unknowns are separated.
- No solution, feature list, architecture, or UI has been proposed.
- Any assumption is labeled.

## Response block

```text
## Phase 00 — Intake
Artifact: docs/discovery/00-problem-statement.md
Gate: PASS | BLOCKED
Decisions:
- ...
Risks:
- ...
Next: phase 01 — Explore
```

If the brief is missing, stop and ask for it. Do not invent a problem.
