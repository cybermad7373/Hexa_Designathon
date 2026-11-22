# Phase 10 — Demo and pitch

**Time:** 8:45–10:00
**Artifact:** `docs/discovery/10-demo-script.md` plus the fallback recording
**Goal:** make the product legible in three minutes and resilient in the room.

## Do

1. Write a 3-minute script and a 5-minute script:
   - problem;
   - insight;
   - solution;
   - one live golden path;
   - under the hood: RBAC and email;
   - proof: tests, security, scale;
   - next.
2. Build the slide outline. Keep it sparse. The product is the visual.
3. List exact demo steps with:
   - seeded state;
   - expected visible result;
   - recovery action if it fails.
4. Include the email moment:
   - trigger the event;
   - show the queued row;
   - drain the worker;
   - open Mailpit or the real inbox;
   - state why the email is durable and safe.
5. Prepare answers to the ten questions in `docs/DEMO-AND-PITCH.md`.
6. Map the event's judging criteria to evidence from the release report.
7. Record a 2–3 minute fallback of the golden path on the frozen build.
8. Rehearse twice. Time it. Fix only demo blockers.
9. Submit with buffer. Upload the video early.

## Output structure

```md
# Demo script

## 3-minute script
| Time | Beat | Say | Show |
| --- | --- | --- | --- |
| | | | |

## 5-minute script
...

## Demo steps
| # | Action | Expected result | If it fails |
| --- | --- | --- | --- |
| | | | |

## Email moment
- Trigger:
- Queue evidence:
- Delivery evidence:
- Safety note:

## Judging criteria
| Criterion | Evidence | Where |
| --- | --- | --- |
| | | |

## Q&A
- ...

## Fallback
- Recording:
- Duration:
- Location:

## Submission
- URL:
- Credentials:
- Deadline:
```

## Gate

- The demo works from a cold start.
- It is rehearsed twice and timed.
- The fallback is playable.
- The email moment is rehearsed.
- Submission happens with buffer.

## Response block

```text
## Phase 10 — Demo and pitch
Artifact: docs/discovery/10-demo-script.md
Gate: PASS | BLOCKED
Decisions:
- ...
Risks:
- ...
Next: submit
```
