# Submission checklist

Submit with buffer. Portals fail, uploads stall, and links break.

## T-60: freeze

- [ ] Features frozen.
- [ ] One deployable branch.
- [ ] Release gate started.
- [ ] No dependency upgrades or refactors.

## T-30: repo

- [ ] `README.md` matches the product, not the template.
- [ ] Problem statement and enhanced PS are in `docs/discovery/`.
- [ ] Solution design and visual direction are in `docs/discovery/`.
- [ ] Build log and hardening report are current.
- [ ] Release report is written.
- [ ] Demo script and credentials are in `docs/discovery/10-demo-script.md`.
- [ ] No `.env`, secrets, or real customer data in git history.
- [ ] `.env.example` lists every required variable.
- [ ] The repo builds from a fresh clone.
- [ ] `npm run test:coverage`: 100% pass and >= 95% on statements, branches, functions, lines.
- [ ] Commit history is meaningful; the submission commit matches the tested commit.
- [ ] `docs/EVALUATION-CHECKLIST.md` has no unexplained unchecked item.
- [ ] `docs/WEBSITE-DELIVERY-STATUS.md` has a profile and evidence for every applicable item, or an
      explicit `Blocked` record with owner and date.

## T-30: scored deliverables

- [ ] GitHub repository link points to the public repo.
- [ ] Presentation slide deck link (Google Slides, Canva, OneDrive, or PDF) explains business value,
      architecture, competitive advantage, and roadmap.
- [ ] Video demo URL (Loom, YouTube, or Google Drive) is 3–5 minutes and shows working functionality
      and key user flows.
- [ ] Solution architecture abstract is formatted text, <= 1000 words, covering the problem,
      technological innovations, and system design.
- [ ] Every link opens from a clean browser session before submission.

## T-30: deploy

- [ ] Deployed URL is live over HTTPS.
- [ ] Health endpoint returns `200`.
- [ ] Demo account or demo mode works.
- [ ] Golden path works on the deployed build.
- [ ] RBAC boundary works on the deployed build.
- [ ] One transactional email is delivered, or the Mailpit fallback is documented.
- [ ] Email cron is scheduled and returns success.
- [ ] Security headers are present.
- [ ] Rollback path is known.
- [ ] The deployed build matches the tested commit.

## T-20: demo

- [ ] 3-minute script finalized.
- [ ] Slides exported as PDF.
- [ ] Fallback recording recorded and playable.
- [ ] Demo data seeded.
- [ ] Email inbox or Mailpit open and verified.
- [ ] Browser and screen share tested.
- [ ] Q&A answers prepared.
- [ ] Rehearsal one complete.
- [ ] Rehearsal two complete.

## T-10: submission

- [ ] Project title and tagline final.
- [ ] Team names and roles final.
- [ ] Description is accurate and free of invented metrics.
- [ ] Repository link and deployed URL added.
- [ ] Demo video uploaded.
- [ ] Screenshots uploaded.
- [ ] Known limitations listed honestly.
- [ ] Submission form opened early.
- [ ] Submission confirmed with a screenshot or receipt.

## Pre-submission cleanup: remove the agent runbook

The runbook lives in the single top-level folder `agent-prompts/` so it can be removed in one step.
It is development tooling, not a submitted deliverable.

- [ ] Run `npm run prepare:submission`. It deletes `agent-prompts/` and strips every dangling
      reference from the surviving docs and the page copy.
- [ ] The command reports zero remaining references. Evidence: `artifacts/submission-cleanup.txt`.
- [ ] `npm run check` is green after cleanup.
- [ ] Commit the deletions and push. The submitted repo must not contain `agent-prompts/`.
- [ ] Do not run the cleanup before the build is finished; the runbook is needed for phases 00–10.

## Final sign-off

| Area       | Owner | Status |
| ---------- | ----- | ------ |
| Product    |       |        |
| Engineering|       |        |
| Design     |       |        |
| Security   |       |        |
| Demo       |       |        |
| Submission |       |        |

If a box cannot be checked, write the reason and the risk in the release report. Do not silently
skip it.
