# ihor.me

Personal site of Ihor Ivanchenko, built with [Astro](https://astro.build) as a fully static site and deployed on Cloudflare.

## Commands

| Command           | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm install`     | Install dependencies                           |
| `npm run dev`     | Local dev server at `localhost:4321`           |
| `npm run build`   | Production build into `dist/`                  |
| `npm run preview` | Serve the production build locally             |
| `npm run check`   | Type-check `.astro` and `.ts` files            |

## Cloudflare

Cloudflare builds the site from this repo on every push.

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 20 or newer (set `NODE_VERSION=20` if the project uses an older default)

`public/_headers` sets long cache lifetimes for fonts, hashed build assets and media.

## Structure

```
src/
  pages/index.astro          The homepage: composes the sections in order
  pages/privacy.astro        Privacy policy  } both rendered by components/sections/Legal.astro
  pages/terms.astro          Terms           } from the copy in data/legal.ts
  layouts/BaseLayout.astro   <head>, SEO meta, JSON-LD (Person + FAQPage), global styles
  components/
    sections/                One component per homepage section
    ui/                      Shared pieces: Button (pill), Icon, Label
  data/                      All copy and lists: projects, stories, services, reviews, FAQ, socials
  scripts/                   Small client scripts, one per interactive feature
  styles/
    tokens.css               Colours, fonts and the --p layout unit
    base.css                 Base elements, buttons, labels, grid
    sections/*.css           Styles for each section, imported by that section's component
  assets/                    Images processed by Astro (resized, converted to WebP)
public/
  fonts/                     Mariupol, Nyght Serif Italic, Alpino (variable)
  media/                     Service and client-story videos
```

### Editing content

Copy lives in `src/data/`. To add a project, add an image to `src/assets/work/` and an entry to `src/data/projects.ts`; `featured: true` puts it in the large stacked list, otherwise it goes into the two-column grid. FAQ, reviews, client stories and social links work the same way.

### Design system

- Colours: `--white`, `--green`, `--sage`, `--red`, `--red-bright` (red used on dark backgrounds, for WCAG AA contrast), `--black`.
- Type: Mariupol for text, Nyght Serif Italic for accents, Alpino variable for the footer wordmark.
- `--p` is the layout unit: 1px at the 1440px design width, scaled with the viewport. Full-screen sections also cap it by height. Below 1024px it becomes a plain `1px` and the tablet/mobile rules take over.

### Interactivity

There is no UI framework: each interactive feature is a small TypeScript module in `src/scripts/`, loaded by the component that needs it (Astro bundles and defers them).

| Script          | Feature                                                                 |
| --------------- | ----------------------------------------------------------------------- |
| `hero-band.ts`  | WebGL curved band of project cards in the hero (drag, scroll-reactive), plus the page-load intro |
| `case-hover.ts` | WebGL smear on project images on hover (desktop only)                   |
| `stories.ts`    | Background video playback, play with sound, stacking cards              |
| `belief.ts`     | Line-by-line word reveal                                                |
| `faq.ts`        | One-at-a-time accordion                                                 |
| `clock.ts`      | Live Kharkiv time in the footer                                         |
| `wordmark.ts`   | Footer wordmark weight following the cursor                             |
| `legal-toc.ts`  | Highlights the current section in the legal pages' contents list        |

The services and process sections are animated with CSS scroll-driven animations (`animation-timeline`), so they need no JavaScript.
