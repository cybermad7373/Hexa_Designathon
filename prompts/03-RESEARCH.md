# Phase 03 — Research

**Time:** 1:20–1:45 (hard stop at 25 minutes)
**Artifact:** `docs/discovery/03-research.md`
**Goal:** borrow what exists, avoid inventing what is known, and find the defensible differentiator.

## Read first

- `docs/discovery/01-opportunity-map.md`
- `docs/discovery/02-edge-cases.md`
- `docs/ARCHITECTURE.md`

## Do

1. Search prior art, competitors, open-source projects, APIs, datasets, regulations, and benchmarks.
2. Use the `WebSearch` and `WebFetch` tools. Record the URL and access date for every source.
3. Separate fact from inference:
   - **Fact:** supported by a source.
   - **Inference:** your conclusion from facts.
   - **Assumption:** unverified, with a validation plan.
4. Build a build-vs-borrow table with effort, risk, and lock-in.
5. Name the differentiator the product can defend in the demo. It must be more than "nicer UI."
6. Name what you will not build because a mature primitive exists.
7. Do not fabricate APIs, datasets, customers, benchmarks, or quotes. If a source cannot be found,
   say so.
8. Stop when the timebox ends. A thin, cited research note beats a perfect one that eats the build.

## Output structure

```md
# Research

## Questions
- ...

## Sources
| Source | URL | Accessed | What it proves |
| --- | --- | --- | --- |
| | | | |

## Findings
- Fact:
- Inference:
- Assumption:

## Prior art
| Product / project | Approach | Strength | Gap |
| --- | --- | --- | --- |
| | | | |

## Build vs borrow
| Capability | Build | Borrow | Decision | Why |
| --- | --- | --- | --- | --- |
| | | | | |

## Differentiator
...

## Reuse decisions
- ...

## Open questions
- ...
```

## Gate

- Reuse decisions are made and cited.
- No hallucinated source is presented as fact.
- The differentiator is specific enough to demo.
- The timebox was respected.

## Response block

```text
## Phase 03 — Research
Artifact: docs/discovery/03-research.md
Gate: PASS | BLOCKED
Decisions:
- ...
Risks:
- ...
Next: phase 04 — Enhance the problem statement
```
