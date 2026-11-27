# Website delivery gate — status record

> Source: `docs/WEBSITE-DELIVERY-CHECKLIST.md` (repo copy of the studio canonical checklist).
> Updated at every phase boundary. An item is `Done` only with evidence linked below.
> No item is ticked from intent, from code reading alone, or from a previous build.

## Gate state

- Profile: **Both** (provisional — public product surface plus an authenticated,
  workspace-scoped area in the scaffold; confirm against the brief in phase 00).
- State: **Not started — no product brief and no built product flow yet**.
- Last verified: 2026-11-27.
- Reason: `docs/discovery/00-problem-statement.md` still contains the placeholder brief.
  Phases 00–06 are design artifacts. No golden path exists to verify against.
- Owner: unassigned until phase 00.

## Section status

| Section | Applies | Items | Verified | Status | Confirm in |
| --- | --- | ---: | ---: | --- | --- |
| A1 Product clarity & content | Yes | 6 | 0 | Pending | 07 |
| A2 Core pages & trust | Yes | 7 | 0 | Pending | 07, 08 |
| A3 Forms, feedback & states | Yes | 5 | 0 | Pending | 07 |
| A4 Accessibility | Yes | 6 | 0 | Pending | 07, 08, 09 |
| A5 Responsive & browser/device | Yes | 4 | 0 | Pending | 08, 09 |
| A6 Performance & reliability | Yes | 5 | 0 | Pending | 08, 09 |
| A7 Security baseline | Yes | 6 | 0 | Pending | 08 |
| A8 Privacy, data & analytics | Yes | 5 | 0 | Pending | 08 |
| A9 SEO & discoverability | Yes (public surface) | 4 | 0 | Pending | 08 |
| A10 Release & operations | Yes | 4 | 0 | Pending | 09 |
| B1 Public trust & compliance | Conditional | 5 | 0 | Pending | 08 |
| B2 Public support & safety | Conditional | 4 | 0 | Pending | 07, 08 |
| B3 Regional readiness | Conditional | 4 | 0 | Pending | 08 |
| C1 Identity, access & governance | Yes (workspace product) | 4 | 0 | Pending | 05, 08 |
| C2 Security & compliance evidence | Yes | 4 | 0 | Pending | 05, 08 |
| C3 Enterprise operations | Yes | 4 | 0 | Pending | 05, 09 |
| C4 Enterprise UX | Yes | 3 | 0 | Pending | 07, 08 |
| D Conditional modules | Per brief | 9 | 0 | Pending | 04 |
| E Sign-off | Yes | 4 | 0 | Pending | 10 |

`Verified` counts items marked `Done` or `N/A - reason` with an evidence link. It does not
count unchecked items.

## When to confirm

| Phase | Confirm and record |
| --- | --- |
| 00 | Select and justify the profile. Name the class (web app). Re-open affected sections. |
| 04 | Decide which D modules apply. Mark the rest `N/A - reason`. |
| 05 | Write the data inventory, retention, tenant isolation, and backup story (A8, C2, C3). |
| 06 | Brand assets, contrast, focus, reduced motion, responsive families (A1, A4, A5). |
| 07 | Product clarity, states, forms, 404/500, support route, conditional modules as built (A1–A3, B2, C4). |
| 08 | Security, privacy, SEO, browser matrix, performance, evidence scans (A5–A9, B, C). |
| 09 | Deployed URL, HTTPS, headers, smoke, rollback, legal and support links live (A10, E). |
| 10 | Owner sign-off with release version, date, and evidence links (E). |

## Evidence ledger

One row per tick. Add rows during the build; do not backfill from memory.

| Item | Status | Evidence (URL / command + output / screenshot / config record) | Verified by | Date |
| --- | --- | --- | --- | --- |
| | Done / N/A - reason / Blocked | | | |

## N/A rule

`N/A` needs a reason that names why the item cannot apply to this product, for example:
"B3 currency formatting — no pricing or currency in scope; product is a free internal
workspace tool." "B1 age gate — no age-restricted content, UGC, or child-data flow."
"Skipped" and "no time" are not reasons.

## Blocking rules

- A critical failure (data loss, payment defect, security hole, crash on a reviewer
  device) blocks the release. Record it as `Blocked`, never as a known issue.
- This gate does not replace `Ruth Proj/Studio/SECURITY-COMPLIANCE.md`, the content
  policy, or the event's current live requirements. Re-read them at release time.
- The owner signs. An agent may run checks and fill the record but must never mark
  the app `Passed` from intent, a previous version, or an assumption.
- A new domain, payment flow, auth flow, region, data category, or major UI release
  re-opens the affected sections.

## Sign-off

- Profile confirmed:
- Gate: Not started / In progress (x/y) / Passed / Blocked
- Release version:
- Date:
- Evidence links:
- Owner:
