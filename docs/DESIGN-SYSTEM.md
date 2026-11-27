# Design system and visual quality bar

The goal is an interface that looks intentional, not generated. Every visual choice must be
defensible from the brief, the audience, and the content.

Load `design-taste-frontend` before phase 06. If the brief needs generated references, load
`imagegen-frontend-web` or `imagegen-frontend-mobile`. State the fallback if a skill is unavailable.

## 1. Design read (required)

Before choosing colors or components, write one line:

> Reading this as: **\<page kind>** for **\<audience>**, with a **\<vibe>** language, leaning toward
> **\<design system or aesthetic family>**.

Examples:

- B2B operations dashboard for clinic managers, calm and dense, leaning toward a restrained
  Tailwind system with Geist and compact data tables.
- Consumer marketplace for first-time renters, warm and trustworthy, leaning toward an editorial
  grid with real photography and one saturated accent.
- Internal incident console for engineers, dark and utilitarian, leaning toward a mono-heavy
  terminal aesthetic with high information density.

If the read is genuinely ambiguous, ask one question. Do not ask five.

## 2. Dials

Set these before building. They drive layout, motion, and density.

| Dial               | Range | Default | Meaning                                  |
| ------------------ | ----- | ------- | ---------------------------------------- |
| `DESIGN_VARIANCE`  | 1–10  | 7       | Symmetry vs asymmetry                    |
| `MOTION_INTENSITY` | 1–10  | 5       | Static vs cinematic                      |
| `VISUAL_DENSITY`   | 1–10  | 4       | Gallery air vs cockpit density           |

Presets:

| Brief                          | Variance | Motion | Density |
| ------------------------------ | -------- | ------ | ------- |
| SaaS landing                   | 7        | 6      | 4       |
| Premium consumer               | 7        | 6      | 3       |
| Editorial / portfolio          | 8        | 6      | 3       |
| Data-heavy product             | 5        | 3      | 7       |
| Trust-first / public sector    | 3        | 2      | 5       |
| Internal tool                  | 4        | 2      | 6       |

The starter app is light, typographic, low-motion, and already on brand tokens. Change the direction
only on purpose; do not drift off brand by accident.

## 3. Foundation

Pick one:

- **Real design system** when the brief names one: Fluent, Carbon, Material 3, Polaris, Primer,
  GOV.UK, USWDS, Radix Themes.
- **Tailwind + tokens + owned components** for most hackathon products. This repo starts here.
- **Aesthetic only** (brutalist, editorial, glass, bento): implement honestly with native CSS and
  Tailwind; do not pretend a trend is an official system.

One system per project. Do not mix Fluent with Carbon or shadcn with Material.

## 4. Tokens

Define tokens once, then use them everywhere.

### Color

The brand is locked. Full palette, roles, contrast pairs, and dark-surface mapping live in
[BRAND.md](BRAND.md); the app tokens are wired in `apps/web/src/app/globals.css`. Do not invent a
second accent or an off-palette hex.

- One accent: Hexaware blue `#3C2CDA`. Neutral base. No gradients.
- No pure `#000000`; text is `#040D43`. Snow `#FFFFFF` is brand-approved as a card surface only,
  never as the page canvas.
- One palette temperature per project. Do not mix warm and cool grays.
- Theme lock: all sections share one theme. No random light section inside a dark page.
- Contrast: WCAG AA minimum (4.5:1 body, 3:1 large text and UI boundaries).

Brand tokens (light):

| Token         | Value     | Use                          |
| ------------- | --------- | ---------------------------- |
| `canvas`      | `#F8F8F9` | Page background              |
| `surface`     | `#FFFFFF` | Cards, sheets                |
| `surface-2`   | `#EEEFF2` | Inset, skeleton, hover       |
| `line`        | `#CBD0E5` | Borders and dividers         |
| `fg`          | `#040D43` | Primary text                 |
| `muted`       | `#535983` | Secondary text               |
| `brand`       | `#3C2CDA` | Accent, CTAs, links, focus   |
| `brand-hover` | `#3224BD` | Hover and pressed            |
| `brand-ink`   | `#FFFFFF` | Text on the brand fill       |
| `danger`      | `#DA2D2C` | Error and destructive states |

Dark surfaces are defined in [BRAND.md](BRAND.md) and only used when the brief explicitly asks.

### Type

- Display: 1.05–1.15 line height, tight tracking, max two lines in the hero.
- Body: 1.5–1.7 line height, max 65ch.
- Mono: code, numbers, timestamps, IDs, terminal content, small labels. Never headlines or body.
- Sans: **Manrope only** (brand face), weights 300–600. No second sans, no serif.
- No mixed-family emphasis inside a headline. Use italic or a heavier Manrope weight.
- No 700 or 800 weights: brand rules forbid Bold and Extra-Bold.
- Fonts self-hosted via `@fontsource-variable/manrope` or `next/font`. No `<link>` to Google
  Fonts.

### Spacing and shape

- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Section padding: `py-16` to `py-24` for product pages; `py-24` to `py-32` for marketing.
- Radius lock: pick one rule and keep it. Example: cards 16px, buttons pill, inputs 12px.
- Shadows: tint to the background. No pure-black drop shadows on light surfaces.
- Cards only when elevation communicates hierarchy. Otherwise use dividers and space.

### Motion

- Animate `transform` and `opacity` only.
- 150–250 ms for UI feedback; 400–800 ms for entrances.
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` or a spring.
- Every animation has a reason: hierarchy, feedback, state change, or narrative.
- No infinite loops unless the element is genuinely live.
- Honor `prefers-reduced-motion`; collapse parallax, scroll hijack, and magnetic effects to static.
- Never use `window.addEventListener("scroll")` for animation. Use Motion, GSAP ScrollTrigger,
  IntersectionObserver, or CSS scroll-driven animations.

## 5. Layout rules

- Hero fits in the first viewport. Headline max two lines on desktop, subtext max 20 words.
- Hero top padding max `pt-24` at desktop.
- Navigation renders on one line on desktop, 64–72px tall.
- Use CSS Grid for layout, not percentage flex math.
- Full-height sections use `min-h-[100dvh]`, never `h-screen`.
- Bento grids have exactly as many cells as content. No empty tiles.
- No more than two consecutive image/text zigzags. Break the pattern.
- One section layout family appears at most once per page.
- Maximum one eyebrow per three sections. The hero counts as one.
- No split-header pattern (big headline left, filler paragraph right) as a default.
- Mobile collapse is explicit for every multi-column section.
- No horizontal scroll at 320px.

## 6. Content rules

- Real copy only. No lorem ipsum.
- No invented metrics, customers, testimonials, or benchmarks. Label mock data as mock.
- Buttons say what they do. No dead buttons or placeholder links.
- One label per intent. Do not use "Get started" and "Sign up free" for the same action.
- Primary CTA labels fit on one line and are ideally 1–3 words.
- Every visible string passes a copy self-audit: grammar, referents, tone, no AI-cute nonsense.
- Empty states explain how to populate. Error states explain how to recover.

## 7. UI states (mandatory)

Every data view:

- **Loading:** skeleton matching the final layout, not a generic spinner.
- **Empty:** composed, explains the next action.
- **Error:** inline or contextual, with a retry.
- **Unauthorized:** explains the boundary without leaking data.

Every action:

- Pending: disabled + progress indicator.
- Success: confirmation.
- Failure: actionable message.

Every button passes contrast and focus checks. No white text on a white button, no ghost button
without a visible boundary over an image.

## 8. Accessibility

- WCAG AA contrast.
- Full keyboard path for every flow.
- Visible focus ring on every interactive element.
- Labels above inputs. No placeholder-as-label.
- Errors announced and associated with the field.
- Images have meaningful alt text, or empty alt if decorative.
- Icon-only buttons have an accessible name.
- Target size at least 24×24 px, 44×44 preferred on touch.
- Reduced motion respected.
- No color-only status. Pair color with text or icon.
- Headings are hierarchical and unique.
- Skip link on every page.

## 9. Performance

- LCP < 2.5 s, INP < 200 ms, CLS < 0.1.
- Hero image uses `next/image` with priority or is preloaded.
- Reserve space for images, fonts, and embeds.
- No layout shift from late-loading fonts.
- Keep first-load JS under 250 kB gzipped on the main view.
- Lazy-load below-the-fold heavy components.
- No grain or noise on scrolling containers; fixed overlays only.

## 10. Anti-slop checklist

Reject these unless the brief explicitly asks:

- Purple or blue AI gradients as the default identity. Flat brand blue is required; gradients are
  not.
- Centered hero over a dark mesh with three equal feature cards.
- Glassmorphism on everything.
- Eyebrow above every section.
- Split header with filler text on the right.
- Six white cards on a cream background with only text inside.
- Div-based fake product screenshots.
- Hand-rolled SVG illustrations used as decoration.
- Multiple marquees or infinite micro-animations.
- Mixed icon families or inconsistent stroke widths.
- Pure black and pure white.
- Fake precision numbers.
- Testimonials longer than three lines or attributed to "Sarah".
- A light section in the middle of a dark page.
- Hover-only interactions with no keyboard path.

## 11. Visual pre-flight

Before declaring the UI done:

- [ ] Design read is written in `06-visual-direction.md`.
- [ ] Dials are recorded and match the output.
- [ ] One accent color, used consistently.
- [ ] One radius rule, used consistently.
- [ ] One icon family, consistent stroke width.
- [ ] Hero fits the first viewport; headline max two lines.
- [ ] Nav is one line on desktop.
- [ ] Section layout families vary.
- [ ] Eyebrow count ≤ ceil(section count / 3).
- [ ] Every data view has loading, empty, error, and unauthorized states.
- [ ] Every action has pending, success, and failure feedback.
- [ ] Keyboard path works end to end.
- [ ] Contrast passes AA.
- [ ] Reduced motion is honored.
- [ ] Mobile 320px, 390px, 768px, 1024px, 1440px checked.
- [ ] No lorem ipsum, dead buttons, fake metrics, or placeholder links.
- [ ] Copy self-audit passed.
- [ ] Lighthouse run recorded.

## 12. Skill map

| Need                          | Skill                                  |
| ----------------------------- | -------------------------------------- |
| Base frontend taste           | `design-taste-frontend`                |
| Section reference images      | `imagegen-frontend-web`                |
| Mobile screen references      | `imagegen-frontend-mobile`             |
| Advanced scroll motion        | `gpt-taste`                            |
| Premium agency polish         | `high-end-visual-design`               |
| Minimal editorial direction   | `minimalist-ui`                        |
| Brutalist / terminal direction| `industrial-brutalist-ui`              |
| Brand system and logo board   | `brandkit`                             |
| Screenshots supplied          | `screenshot-to-code`                   |
| Redesign of an existing app   | `redesign-existing-projects`           |
| Exhaustive code generation    | `full-output-enforcement`              |

## 13. Transactional email

Email is part of the product surface. It must look like the app, not like a default template.

- Use the same tokens as the app: background, surface, text, muted, one accent. Do not invent a
  second palette.
- Keep the shell simple: brand line, heading, one short paragraph, one primary CTA, quiet footer.
- One email, one job. Do not mix a receipt with a newsletter.
- Write a specific subject under ~60 characters and a preview line that adds information.
- Always ship a plain-text version. It is the fallback and the accessibility floor.
- Inline CSS only. No external stylesheets, web fonts, or JavaScript. Use the system sans stack
  (Arial/Helvetica); Manrope is not available in email.
- Table-based layout with a 600px max width; test at 320px.
- Buttons need a real URL and visible text; no image-only CTAs.
- Escape every variable. Never interpolate raw HTML or user URLs.
- No tracking pixels by default. If added, disclose it and make it opt-out.
- Transactional mail cannot be unsubscribed; product and marketing mail must link to preferences.
- Use Mailpit locally and inspect both desktop and mobile renders before the demo.
- The footer states why the recipient received the message and how to get help.
