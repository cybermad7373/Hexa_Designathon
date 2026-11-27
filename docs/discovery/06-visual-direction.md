# 06 — Visual direction

> Phase 06 · 3:00–3:30 · Source: `agent-prompts/06-VISUAL-DIRECTION.md`
> Lock the visual system before building UI. Load `design-taste-frontend` with the skill tool, plus
> one reference skill (`imagegen-frontend-web` or `imagegen-frontend-mobile`).
> Brand lock: palette, typeface, and logo rules come from `docs/BRAND.md`. Record roles; never invent
> hex values or a second accent.

## Design read

- Page kind:
- Audience:
- Vibe in three words:
- Aesthetic family:
- What it must not look like:

## Dials

| Dial | Setting (1–5) | Why |
| ---- | ------------- | --- |
| Variance |  |  |
| Motion |    |  |
| Density |   |  |

## Tokens

### Color

| Token | Value | Use |
| ----- | ----- | --- |
| `canvas` | `#F8F8F9` | Page background |
| `surface` | `#FFFFFF` | Cards and sheets |
| `surface-2` | `#EEEFF2` | Inset, skeleton, hover |
| `line` | `#CBD0E5` | Borders and dividers |
| `fg` | `#040D43` | Primary text |
| `muted` | `#535983` | Secondary text |
| `brand` | `#3C2CDA` | Single accent, CTAs, links, focus |
| `brand-hover` | `#3224BD` | Hover and pressed |
| `brand-ink` | `#FFFFFF` | Text on the brand fill |
| `danger` | `#DA2D2C` | Error and destructive states |

One accent. Contrast checked against WCAG AA. Dark surfaces, if used, follow `docs/BRAND.md`.

### Type

| Role | Family | Size | Weight | Tracking |
| ---- | ------ | ---- | ------ | -------- |
| Display | Manrope |  | 300–600 |  |
| Body | Manrope |  | 400–500 |  |
| Mono | Geist Mono |  | 400 |  |

No other typeface. No 700 or 800 weights.

### Spacing and shape

- Spacing scale:
- Radius rule:
- Elevation rule:
- Border rule:

### Motion

| Animation | Reason | Duration / easing | Reduced-motion fallback |
| --------- | ------ | ----------------- | ----------------------- |
|           |        |                   |                         |

## Layout families

| Screen / section | Layout family | Why it differs from the previous section |
| ---------------- | ------------- | --------------------------------------- |
|                  |               |                                         |

## UI states

| View / action | Loading | Empty | Error | Unauthorized | Pending | Success |
| ------------- | ------- | ----- | ----- | ------------ | ------- | ------- |
|               |         |       |       |              |         |         |

## Email direction

- Layout:
- Type and color:
- Plain-text version:
- Escaping and link policy:

## References

- Reference images: `docs/discovery/assets/`
- Generated with:
- Source assets (licensed or generated):

## Anti-slop check

- [ ] No AI-purple gradient.
- [ ] No generic glass card stack.
- [ ] No three equal feature cards unless the content demands it.
- [ ] No eyebrow spam.
- [ ] No fake screenshots or device mockups.
- [ ] No lorem ipsum or invented metrics.
- [ ] No dead buttons or placeholder links.
- [ ] One icon family, one radius rule, one accent.

## Accessibility check

- [ ] WCAG AA contrast on text and controls.
- [ ] Full keyboard path with visible focus.
- [ ] Reduced motion supported.
- [ ] Labels on every input.
- [ ] Semantic headings and landmarks.
- [ ] Touch targets at least 44px on mobile.

## Gate

- [ ] The design read is specific, not generic.
- [ ] Tokens are complete.
- [ ] Each section uses a deliberate layout family.
- [ ] Motion has a reason and a fallback.
- [ ] Reference assets are saved.
- [ ] Anti-slop and accessibility checks pass.

Next: `agent-prompts/07-BUILD.md` → `docs/discovery/07-build-log.md`
