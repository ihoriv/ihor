# Design tokens extracted from ihor.me Webflow export

Source: `css/ihor-me.webflow.css` `:root` block + inline fluid-type `<style>`
in `index.html` (~line 138). Target project uses plain CSS custom properties
in `src/styles/main.css` (no Tailwind) — these values map directly into that
file's `:root` block.

## Colors

Only 3 real colors; everything else is `color-mix()` derived from these.

| Role | Value | Webflow token name |
|---|---|---|
| Base dark / "black" | `#080807` | `--color--black` |
| Base light / "white" | `#e8e8e3` (off-white, not pure white) | `--color--white` |
| Accent | `#ea4e42` (red-orange) | `--color--accent` |

Semantic aliases layered on top of the 3 base colors:

| Semantic token | Resolves to |
|---|---|
| `--_token---bg-main` | `--color--white` (#e8e8e3) — default page background |
| `--_token---text-main` | `--color--black` (#080807) — default text |
| `--_token---bg-black` | `--color--black` — used as *foreground* bg in `.section-black` |
| `--_token---text-white` | `--color--white` — used as text color in `.section-black` |
| `--_token---accent-main` | `--color--accent` — links, icons, `<em>` in headings |
| `--_token---white-12` | `color-mix(in srgb, white 12%, transparent)` — subtle overlay on dark bg |
| `--_token---black-20` | `color-mix(in srgb, black 20%, transparent)` — modal/overlay scrim |

**Section banding**: `.section-black` swaps bg↔text (dark bg, light text) —
there is no separate dark-mode palette, just two sections of the same 2
colors used in opposite roles. Model this as one light/dark pair of tokens
rather than duplicating the whole palette.

## Typography

**Font families** (both self-hosted, single-weight-only woff2 files already
in the export — no licensing question, just copy the files):

| Family | File | Weight/style | Used for |
|---|---|---|---|
| Mariupol | `Mariupol-Regular.woff2` | 400 normal | Body text, all headings by default |
| Nyght Serif | `NyghtSerif-RegularItalic.woff2` | 400 italic only | `<em>` inside headings/rich text (accent word treatment) |

Both declared with `font-display: swap`. Fallback stacks in source:
`Mariupol, Arial, sans-serif` / `Nyght Serif, Times New Roman, sans-serif`.

**Fluid root font-size** (drives all `rem`-based sizes below): the page root
`font-size` scales linearly with viewport width via a `clamp`-style
calc formula, re-anchored at each breakpoint:

| Viewport range | font-from → font-to (px) |
|---|---|
| > 1920px | 18 → 20 (scales up to 2640px vw reference) |
| 1200–1920px | 16 → 18 |
| 991–1200px | 13 → 16 |
| 479–991px | 14 → 16 |
| < 479px | 12 → 16 |

(Formula: `--base` and `--coefficient` computed from those from/to pairs,
applied as `font-size: calc(var(--base) * 1rem + var(--coefficient) * 1vw)`
on `html`. Reproduce as an equivalent CSS `clamp()` per breakpoint band, which
is simpler to express without custom-property arithmetic and matches
visually.)

**Type scale** (all values are `rem`, computed off the fluid root):

| Token | Value | Notes |
|---|---|---|
| `--size--104` (h1 / heading-1) | 6.5rem | |
| `--size--32` (heading-3-big) | 2rem | used by `.u---heading` "h-big" variant, Nyght Serif |
| `--size--28` (heading-3) | 1.75rem | |
| `--size--24` (heading-2, default `.u---heading`) | 1.5rem | |
| `--size--22` (heading-4) | 1.375rem | |
| paragraph "standard" | `clamp(12px, 1rem, 2rem)` | body default |
| paragraph "small" | `clamp(12px, .875rem, 2rem)` | |
| paragraph "medium" | `clamp(12px, 1.125rem, 2rem)` | |
| paragraph "big" | `clamp(14px, 1.25rem, 2rem)` | |

**Heading line-heights**: h1 90%, h2 90%, h3 100%, "h-big" variant 80%.
**Letter-spacing**: h1 -0.01em, h2/h3 -0.02em, "h-big" -0.01em.
**Paragraph line-height**: default 128%; "small" variant 120%.

## Spacing scale

Base unit 16px = 1rem. Full scale found in `:root` (rem):
`0, .0625(1), .125(2), .25(4), .375(6), .5(8), .625(10), .75(12), .875(14),
1(16), 1.125(18), 1.25(20), 1.375(22), 1.5(24), 1.75(28), 2(32), 2.25(36),
2.5(40), 2.625(42), 2.75(44), 3(48), 3.25(52), 3.5(56), 3.75(60), 4(64),
4.5(72), 5(80), 5.375(86), 5.5(88), 6(96), 6.25(100), 7(112), 7.5(120),
8(128), 8.75(140), 10(160)`.

Semantic spacing aliases: `--_gaps---block-half` = 5rem (80px, half section
gap), `--_gaps---block-full` = 10rem (160px, full section gap) — these are
the two `.u---spacer` heights used between every section.

Container widths: content column max-width `82.5rem` (12-column reference,
`--_gaps---12-columns`), with named column-count widths from 1 to 11 columns
(19.5rem–75.5rem) used for constraining text blocks (e.g. hero description at
"4 columns" = 26.5rem). Webflow's `.w-layout-blockcontainer` outer max-width:
940px desktop → 728px at 991px → none (full-width) at 767px.

## Radii

Only two radius values used anywhere in the stylesheet:

| Value | Used for |
|---|---|
| `0.75rem` (12px) | Cards (video popup dialog, etc.) |
| `1000rem` (effectively `9999px`) | Pills — buttons, pagination dots, fully-rounded shapes |

## Shadows

Only one box-shadow found in the whole stylesheet: `inset 0 1px 5px #fff9`
(subtle inner highlight, translucent white ~60% alpha) — used sparingly on
`.shadows` class elements (footer social icons).

## Breakpoints

Media queries actually used in the stylesheet: **991px, 767px, 479px**
(all `max-width`). Treat 991 as tablet, 767 as mobile-landscape, 479 as
mobile-portrait.

## Motion

All transitions in the stylesheet are short and consistent:

| Duration/easing | Used for |
|---|---|
| `.35s` (default ease) | Almost everything — links, buttons, icon rotation, text-link hover slide |
| `.6s cubic-bezier(.68, -.55, .265, 1.55)` (overshoot/bounce) | One specific interactive element (check against build — likely a toggle/expand affordance) |

Hand-written JS (not CSS) animation timings found in inline scripts:
- Mosaic reveal effect: 350ms overlay lifetime, 150ms per-cell fade, random
  per-cell delay.
- Video-popup dialog open/close: 400ms `cubic-bezier(.16,1,.3,1)` transform +
  300ms opacity.
- Accordion expand/collapse (FAQ, project cards, approach cards): 350ms
  height transition.
- Hero image trail: GSAP `fromTo` 0.2s appear, `to` 0.8s `expo.out` fade-out;
  trail spawns when pointer moves more than `viewportWidth/15` px since last
  spawn, images despawn after 300–600ms idle.
