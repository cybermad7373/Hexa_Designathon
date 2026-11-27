# Brand contract — Hexaware

This file is the single source of truth for color, type, and logo usage. `docs/DESIGN-SYSTEM.md`
governs layout, motion, and craft. If the two disagree on a brand value, this file wins.

Source: Hexaware Brand Guidelines v2.0 (July 2026),
`hexaware.com/wp-content/uploads/2024/01/Hexaware-Brand-Guidelines.pdf`. Values below are extracted
from the official palette page, not estimated. Re-verify if the guideline version changes.

## Palette (official)

| Name          | Hex       | RGB         | Role                                                       |
| ------------- | --------- | ----------- | ---------------------------------------------------------- |
| Hexaware blue | `#3C2CDA` | 60 45 218   | Primary: CTAs, links, focus, active, brand fills           |
| Bright blue   | `#1D86FF` | 29 134 255  | Support: charts, large UI accents on dark                  |
| Electric blue | `#14CBDE` | 20 203 222  | Live indicators and data accents on dark surfaces          |
| Dark blue     | `#07125E` | 07 18 94    | Dark surface, footer, headers                              |
| Black         | `#040D43` | 04 13 67    | Ink: text on light, deepest surface                        |
| Silver        | `#8088A7` | 128 136 167 | Muted text on dark                                         |
| Border dark   | `#535983` | 83 89 131   | Muted text on light, borders on dark                       |
| Border light  | `#CBD0E5` | 203 208 229 | Borders, dividers, disabled fills on light                 |
| Light         | `#EEEFF2` | 238 239 242 | Inset panels, skeletons, hover fills                       |
| White         | `#F8F8F9` | 248 248 249 | Page canvas on light                                       |
| Snow          | `#FFFFFF` | 255 255 255 | Cards and sheets on light                                  |
| Honey         | `#EA9D00` | 235 157 0   | Warm accent on dark only; never body text on light         |
| Canary        | `#F4CB4E` | 244 203 78  | Highlight on dark only; never body text on light           |
| Error         | `#DA2D2C` | 218 45 44   | Destructive and error states only                          |

Bright blue and Electric blue support the primary; they never replace it as the CTA color.

## Product tokens (light — default)

Tokens live in `apps/web/src/app/globals.css` and the email `BRAND` map. Components never hard-code
hex values.

| Token         | Value     | Use                                   | Contrast (WCAG)                    |
| ------------- | --------- | ------------------------------------- | ---------------------------------- |
| `canvas`      | `#F8F8F9` | Page background                       | —                                  |
| `surface`     | `#FFFFFF` | Cards, sheets, email shell            | —                                  |
| `surface-2`   | `#EEEFF2` | Inset panels, skeletons, hovers       | —                                  |
| `line`        | `#CBD0E5` | Borders, dividers                     | —                                  |
| `fg`          | `#040D43` | Primary text                          | 17.3:1 on canvas, 18.4:1 on surface |
| `muted`       | `#535983` | Secondary text                        | 6.3:1 on canvas, 6.7:1 on surface   |
| `brand`       | `#3C2CDA` | Primary action, links, focus ring     | 7.7:1 on canvas, 8.1:1 on surface   |
| `brand-hover` | `#3224BD` | Hover and pressed on primary          | Darker than brand, still ≥ 4.5:1    |
| `brand-ink`   | `#FFFFFF` | Text and icons on the brand fill      | 8.1:1 on brand                     |
| `danger`      | `#DA2D2C` | Error text, destructive actions       | 4.8:1 on surface (AA body)         |

Verified pairings: `#FFFFFF` on `#3C2CDA` (8.1:1) for primary buttons; `#040D43` on `#F8F8F9`
(17.3:1) for body; `#535983` on `#FFFFFF` (6.7:1) for secondary. `#1D86FF` is 3.6:1 on light — use
only for large text (≥ 24px or 19px bold), UI boundaries, or graphics, never paragraph copy.
`#EA9D00` and `#F4CB4E` are 2.2:1 on light — dark text only, or dark surfaces.

## Dark surfaces (only when the brief explicitly calls for dark)

| Token       | Value                             | Note                            |
| ----------- | --------------------------------- | ------------------------------- |
| `canvas`    | `#040D43`                         | Deepest surface                 |
| `surface`   | `#07125E`                         | Panels and cards                |
| `surface-2` | `color-mix(#535983 18%, #040D43)` | Raised or inset                 |
| `fg`        | `#EEEFF2`                         | 16:1 on canvas                  |
| `muted`     | `#8088A7`                         | 5.3:1 on canvas                 |
| `brand`     | `#3C2CDA`                         | Fills with white text           |
| `accent`    | `#14CBDE`                         | 8.4:1 on `#07125E`; live states |

One theme per page. Never place a light section inside a dark page or the reverse.

## Typography

- **Manrope is the only brand typeface.** Weights 300 (default), 400, 500, 600. Never 700 or 800.
- Long paragraphs may use Heebo; presentations, UI, and documents use Manrope only.
- Mono is allowed only for code, IDs, timestamps, and tabular figures, never headlines or body.
- Display: line height 0.95–1.15, tracking `-0.02em` to `-0.045em`, max two lines in the hero.
- Body: line height 1.55–1.7, max 65ch.
- Self-host through `@fontsource-variable/manrope` or `next/font`; no external font `<link>`.
- Transactional email uses the system sans stack (Arial/Helvetica); web fonts are not allowed in
  email. It keeps the brand colors, spacing, and one-CTA rule.

## Logo

- Ship the official lockup in blue, white, or black only. Never recolor, outline, shadow, rotate, or
  add effects.
- Clear space equals the height of the "H" on all sides. Minimum width: 90px digital, 20mm print.
- The scaffold hexagon in `components/brand/hex-mark.tsx` is a placeholder for internal screens, not
  the Hexaware logo. Replace it before any external demo; if the pack is unavailable, set the
  wordmark in Manrope SemiBold, flat brand blue.

## Voice

Confident, modern, human. One strong accent, not five. Generous whitespace so the message leads.
Sentences are plain and specific. No hype adjectives without a receipt.

## Do / Don't

- Do lead every surface with brand blue on white or light, and keep one accent per page.
- Do reuse the tokens in UI, email, slides, diagrams, and demo assets.
- Don't use gradients, glows, or dark mesh heroes built from the brand blues.
- Don't introduce off-palette hex values, second typefaces, or extra accent colors.
- Don't put white text on Bright blue (`#1D86FF`) at body size; it fails AA.
- Don't use Honey, Canary, or Electric blue as text on light surfaces.
- Don't mix the light and dark surface systems inside one page.

## Enforcement

1. Phase 06 copies these tokens into `06-visual-direction.md`; it does not invent a palette.
2. Any new color pair needs a measured ratio recorded next to it.
3. A UI, email, or slide that uses a non-token hex is a defect, not a style choice.
4. If an official asset or value is missing, state the fallback and the reason; never invent one.
