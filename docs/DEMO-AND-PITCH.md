# Demo and pitch

The demo is the deliverable. Judges remember a clear story and a live moment, not a feature list.

## Narrative arc

1. **Problem:** who is stuck, and what does it cost them?
2. **Insight:** what did exploration reveal that others miss?
3. **Solution:** the one flow that changes the outcome.
4. **Live proof:** run the golden path with real seed data.
5. **Depth:** show one edge case handled well and one production signal.
6. **Impact:** measured result, honest limitation, next step.

## Three-minute script

| Time      | Beat                    | What happens                                                        |
| --------- | ----------------------- | ------------------------------------------------------------------- |
| 0:00–0:20 | Hook                    | Name the user and the painful moment. No company history.           |
| 0:20–0:40 | Insight                 | The non-obvious finding from discovery.                             |
| 0:40–1:00 | Solution                | One sentence: what the product does and for whom.                   |
| 1:00–2:20 | Live golden path        | Seed data → core action → visible result. Narrate the why.          |
| 2:20–2:40 | Depth                   | Show empty/error/unauthorized or a second role. Mention the guard.  |
| 2:40–3:00 | Impact + close          | Measured or clearly labeled result, limitation, next step, ask.     |

Rules:

- One flow. Do not tour the app.
- No dead air while loading; preload the page before you start.
- Say what the user gets, not which library you used.
- If something fails, switch to the fallback immediately and keep talking.

## Five-minute version

Add:

- A second persona or role boundary.
- The architecture in one sentence: "Next.js on Postgres, tenant-scoped, RBAC-guarded, cursor-paginated."
- A security or scale proof: cross-tenant test, RBAC escalation test, rate limit, indexed query, load smoke.
- The email moment: trigger, queued row, worker, delivered message, and the safety checks.
- The roadmap: what the next 10 hours would buy.

## Slide outline

1. **Title:** product name, one-line promise, team.
2. **Problem:** user, moment, cost. One real quote or scenario, not a fake statistic.
3. **Insight:** what exploration and research revealed.
4. **Solution:** one screenshot of the golden path and three bullets.
5. **Under the hood:** architecture diagram, security and scale choices.
6. **Proof and next:** test results, limitation, roadmap, ask.

Keep slides visual. No paragraph dumps. The demo is the main event.

## Live demo checklist

- [ ] Browser at 100% zoom, one window, no bookmarks bar.
- [ ] Demo account signed in or demo mode ready.
- [ ] Seed data reset within the last 10 minutes.
- [ ] The golden path rehearsed twice from a cold start.
- [ ] Notifications and OS popups silenced.
- [ ] Fallback recording open in a second tab.
- [ ] Deployed URL and health endpoint bookmarked.
- [ ] A second workspace ready for the authorization moment, if shown.
- [ ] A second role ready for the RBAC moment, if shown.
- [ ] Mailpit or the real inbox open for the email moment.
- [ ] The email queue drained and the outbox status visible.
- [ ] The "wow" moment happens within the first 60 seconds of the demo.

## Fallback plan

Record a 2–3 minute screen capture of the golden path on the frozen build. Keep it local and in the
cloud. If the live demo fails:

1. Say "I'll switch to the recorded run so we can keep moving."
2. Play the recording and narrate over it.
3. Return to the live app only for Q&A if it recovers.

The fallback must show the same flow, the same data, and the same result. Do not record a different
version of the product.

## Q&A preparation

Prepare a one-sentence answer for each:

1. Who is the user and why do they care?
2. What did you cut, and why?
3. How do you prevent one tenant from seeing another's data?
4. How does RBAC work, and how do you stop privilege escalation?
5. What happens when the database, email provider, or a third-party API is down?
6. How does this scale to 10× users?
7. What is the hardest technical decision you made?
8. How did you validate the problem?
9. How is email made durable, safe, and observable?
10. What would you build with another 10 hours?
11. What is the business model or adoption path?

Answer with evidence. "We tested it" beats "we think it scales."

## Judging criteria mapping

Copy the event's rubric here and map each criterion to evidence:

| Criterion   | Weight | Our evidence                                  |
| ----------- | ------ | --------------------------------------------- |
| Problem fit |        | Discovery artifact, insight, user scenario    |
| Execution   |        | Golden path, tests, deployed URL              |
| Design      |        | Visual direction, screenshots, a11y checks    |
| Technical   |        | Architecture, security, scale, release report |
| Demo        |        | Rehearsed script, fallback, Q&A               |

The scored submission has four deliverables. Treat the table below as the evaluator's view of the
repo, not as extra work after the demo:

| Deliverable | Accepted format | Evaluation purpose | Our evidence |
| --- | --- | --- | --- |
| Repository link | `https://github.com/organization/repo` | Source inspection, commit history, documentation quality, unit test coverage | Fresh-clone build, release report, `docs/EVALUATION-CHECKLIST.md` |
| Slide deck | Google Slides, Canva, OneDrive, PDF link | Business value, architecture, competitive advantage, roadmap | Deck link and slide count |
| Video demo | Loom, YouTube, Google Drive link | 3–5 minute walkthrough of working functionality and key user flows | URL, duration, flow list |
| Architecture abstract | Formatted text, <= 1000 words | Problem, technological innovations, system design | Word count and file or link |

## Rehearsal checklist

- [ ] Rehearsal one timed end to end.
- [ ] Rehearsal two from a cold start, same build.
- [ ] Fallback recording played once.
- [ ] Q&A answered out loud.
- [ ] Slide timing checked.
- [ ] Demo data reset and verified.
- [ ] Email queue drained and one message verified.
- [ ] Submission link and credentials tested.

## Close

End with the ask: a pilot, a user interview, a next step, or the specific thing the judges should
remember. Do not end on "that's it."
