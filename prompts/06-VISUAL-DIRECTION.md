# Phase 06 — Visual direction

**Time:** 3:00–3:30
**Artifact:** `docs/discovery/06-visual-direction.md` plus `docs/discovery/assets/`
**Goal:** lock a distinctive, accessible visual system before building UI.

## Skills (call the `skill` tool now)

- **Mandatory:** `design-taste-frontend`.
- **References:** `imagegen-frontend-web` for a web product, or `imagegen-frontend-mobile` for mobile.
  Generate one reference image per section.
- Add `gpt-taste` if the brief is motion-heavy.
- Add `high-end-visual-design` if the brief is premium or luxury.
- Add `minimalist-ui` or `industrial-brutalist-ui` only if the design read matches.
- Add `brandkit` if a brand system is required.
- Use `screenshot-to-code` if the user supplied screenshots.

If a skill is unavailable, follow `docs/DESIGN-SYSTEM.md` and state the fallback.

## Brand lock

Read `docs/BRAND.md` before anything else. The palette, typeface (Manrope, weights 300–600), and logo
usage are fixed. Copy the tokens into the artifact; do not invent hex values, gradients, or a
second accent. Layout, imagery, and motion are the decisions this phase earns.

## Do

1. Write the design read:
   > Reading this as: **\<page kind>** for **\<audience>**, with a **\<vibe>** language, leaning
   > toward **\<design system or aesthetic family>**.
2. Set the dials: `DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY`.
3. Define tokens from `docs/BRAND.md`:
   - color roles and contrast ratios;
   - type scale and families;
   - spacing scale;
   - radius rule;
   - elevation;
   - motion timing and easing.
4. Choose layout families for each screen and section. Do not repeat one family.
5. Define motion with a reason for each animation and a reduced-motion fallback.
6. Define imagery. Use real or generated assets, not div-based fake screenshots.
7. Define all UI states: loading, empty, error, unauthorized, pending, success, failure.
8. Define the transactional email look:
   - same tokens as the app;
   - one CTA;
   - plain-text version;
   - 600px shell and 320px mobile check;
   - no external assets.
9. Save references in `docs/discovery/assets/`.
10. Run the anti-slop and accessibility checklists.

## Output structure

```md
# Visual direction

## Design read
...

## Dials
- DESIGN_VARIANCE:
- MOTION_INTENSITY:
- VISUAL_DENSITY:

## Tokens
### Color
| Token | Value | Use | Contrast |
| --- | --- | --- | --- |
| | | | |

### Type
...

### Spacing and shape
...

### Motion
...

## Layout families
| Screen / section | Family | Why |
| --- | --- | --- |
| | | |

## UI states
| View / action | Loading | Empty | Error | Unauthorized | Pending | Success | Failure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

## Email direction
- Shell:
- CTA:
- Footer:
- Mobile check:

## References
- `docs/discovery/assets/...`

## Anti-slop check
- [ ] No AI-purple gradient
- [ ] No generic glass
- [ ] No three equal feature cards
- [ ] No eyebrow spam
- [ ] No fake screenshots
- [ ] No lorem ipsum
- [ ] No dead buttons
- [ ] No invented metrics

## Accessibility check
- [ ] WCAG AA
- [ ] Keyboard path
- [ ] Visible focus
- [ ] Reduced motion
- [ ] 320px and 1440px
```

## Gate

- The design read is specific.
- Tokens are complete and contrast-safe.
- The direction is distinctive, not a generic AI default.
- Email direction matches the app.
- No product code yet.

## Response block

```text
## Phase 06 — Visual direction
Artifact: docs/discovery/06-visual-direction.md
Gate: PASS | BLOCKED
Decisions:
- ...
Risks:
- ...
Next: phase 07 — Build
```
