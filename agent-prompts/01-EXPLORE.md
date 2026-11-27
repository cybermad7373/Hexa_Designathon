# Phase 01 — Explore

**Time:** 0:15–0:55
**Artifact:** `docs/discovery/01-opportunity-map.md`
**Goal:** understand the humans, the job, and the alternatives before choosing a feature.

## Read first

- `docs/discovery/00-problem-statement.md`
- `docs/PLAYBOOK-10H.md`
- `docs/ARCHITECTURE.md`

## Do

1. Identify users, buyers, and blockers. For each:
   - context;
   - goal;
   - pain;
   - frequency;
   - current workaround;
   - what "good" looks like.
2. Write jobs-to-be-done in the user's words, not internal jargon.
3. Map current alternatives: spreadsheets, email, chat, pen and paper, an incumbent tool, doing
   nothing. Name why each is insufficient.
4. List the domain vocabulary the product must use. Define ambiguous terms.
5. Map the ecosystem: systems of record, integrations, data sources, regulations, and trust
   requirements.
6. Generate three opportunity angles. Score each 1–5 on:
   - impact;
   - feasibility in ten hours;
   - demo strength;
   - defensibility.
7. Choose one angle and state why. Name the riskiest assumption and the cheapest way to validate it.
8. Use the `WebSearch` tool only if the domain is unfamiliar. Cite sources or label the claim as an
   assumption.
9. Do not design the solution, the schema, or the UI yet.

## Output structure

```md
# Opportunity map

## Users and stakeholders
| Actor | Context | Goal | Pain | Frequency | Workaround |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Jobs to be done
- When ..., I want ..., so I can ...

## Alternatives
| Alternative | Why it exists | Where it fails | Our opening |
| --- | --- | --- | --- |

## Domain vocabulary
- ...

## Ecosystem and constraints
- ...

## Opportunity angles
| Angle | Impact | Feasibility | Demo | Defensibility | Total |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Chosen angle
...

## Riskiest assumption
- Assumption:
- Validation:
- Fallback if false:

## Sources and assumptions
- ...
```

## Gate

- The top opportunity is chosen with a reason.
- The riskiest assumption has a cheap validation plan.
- Alternatives include "do nothing."
- No product code, schema, or UI exists yet.

## Response block

```text
## Phase 01 — Explore
Artifact: docs/discovery/01-opportunity-map.md
Gate: PASS | BLOCKED
Decisions:
- ...
Risks:
- ...
Next: phase 02 — Edge cases
```
