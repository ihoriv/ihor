# Migration: ihor.me (Webflow export → Astro)

**Source:** Webflow static export ZIP, unzipped at
`/private/tmp/claude-501/-Users-ihor-ShipStudio-ihor/94964cae-73c0-4e3d-9895-bd0a746f6ab0/scratchpad/webflow-export/`
(not a live URL — treated as the crawl target).
**Target:** `/Users/ihor/ShipStudio/ihor`, an Astro starter (plain HTML + CSS,
no Tailwind/framework — see `src/styles/main.css`'s one-class-one-rule
convention, which the rebuilt CSS must follow).

Page title in the export is "Ihor Draft Site" and the footer copyright reads
"©2026 ihor.me" — this is a **draft/WIP** site, not a finished one. A few
things below reflect that (duplicated FAQ content, an apparently-inert menu
button) and are called out rather than silently fixed.

## Status

- [x] Phase 0 — Survey (this document)
- [x] Phase 1 — Design system (tokens → `src/styles/main.css`, style guide route)
- [x] Phase 2 — Homepage build + verify
- [x] Phase 3 — N/A (single-page site, no other templates)
- [x] Phase 4 — Name the remainder (see below)

**Currently doing:** nothing — build complete, and re-verified against the
live published site (https://ihor-me.webflow.io/) on 2026-09-13 after the
user reported visible differences. See "Live-site verification pass" and
"Remainder" below.

## Live-site verification pass (2026-09-13)

The user pointed at the live URL and asked for a side-by-side check. Compared
every section against it directly (browser automation) rather than relying on
the static export alone. Found and fixed six real bugs:

1. **`.hero_logo` was visible at desktop width** — a duplicate "IHOR"
   wordmark under the hero icon that shouldn't render above 479px (the
   source only shows it at mobile as a header-logo substitute). Was
   `display: flex` unconditionally; fixed to `display: none` by default,
   `flex` only in the ≤479px media query.
2. **Missing `.from-word` icon** — a small decorative squiggle between
   "Premium Partner" and "Kharkiv, Ukraine" in the About section that was
   defined in CSS but never placed in the markup. Added.
3. **`.text-link__label` hover-reveal showed doubled text** ("Menu" appeared
   twice, stacked) — the text-shadow duplicate-copy trick needs
   `display: inline-block` + a tight `height: 1em` clip on `.text-link` for
   the shadow copy to actually get clipped off; it was `overflow: clip` on
   an inline element, which has no effect.
4. **Two undefined CSS spacing tokens** (`--space-36`, `--space-42`) were
   referenced but never declared, silently resolving to nothing — this
   collapsed the "Premium Partner" icon's fixed-width constraint, so the
   browser fell back to an SVG's default intrinsic size (~300px), blowing up
   a small icon into a giant one with overlapping text next to it. Added
   both tokens to the scale.
5. **No general scroll-reveal system** — the live site fades+rises nearly
   every heading, photo, and card into view on scroll (confirmed via
   `getComputedStyle`/inline transform inspection — driven by the site's own
   runtime, not anything in the readable custom `<script>` blocks, so
   rebuilt rather than ported). Added `[data-reveal]` + a small
   IntersectionObserver in `site.js`, applied to headings, the hero, the
   about photo, the video-block icons, and client cards. Deliberately NOT
   applied to `.project-card`/`.approach-card`/`.faq_card-wrap`, since those
   already use opacity for open/closed accordion state and a generic reveal
   would conflict with it.
6. **Native HLS false-positive breaking video playback in some browsers** —
   `HlsCore` detected native HLS support via `canPlayType(...)` being
   truthy, but some Chromium builds answer `"maybe"` (technically true, but
   playback then hangs forever) instead of `""`. Only Safari's `"probably"`
   is a real signal. Tightened the check to `=== 'probably'`.

Also fixed: the standalone video block's clickable wrapper was a `<button>`
with a `<video>` appended inside it once its background-preview video loads
(added this session, see below) — nesting a video inside a button is
non-standard and risked focus/interaction quirks, so it's now a
`div[role="button"][tabindex="0"]` with explicit `Enter`/`Space` handling in
`site.js`, matching the accessible-custom-control pattern.

**New behavior added, not just fixed:** the standalone video block had no
background preview (`.video_bg-wrap` was an empty decorative div in the
source), but the live site clearly showed the actual video's first frame
playing behind the "Watch Video" button — matching the pattern already used
for approach-card and client-testimonial previews. Extended that same
lazy-autoplay-muted-preview mechanism to the video block (`data-bg-video` +
`initVideoBlockPreview` in `site.js`, sharing the `previewVideosBySrc` map
so the popup reuses the exact same `<video>` instead of starting a second
HLS session).

**Important infrastructure finding — not a bug in this rebuild:** all
bunny.net HLS video (video block, approach cards, client testimonials) is
protected by referer-based hotlink protection on the CDN account, allowlisted
only for the production domain. Verified directly with `curl`: every
manifest/key/segment request returns `403 Forbidden` with no `Referer`
header or a mismatched one, and `200 OK` with
`Referer: https://ihor-me.webflow.io/`. This means **video previews will not
play from `localhost` during development** (except when a response happens
to already be browser-cached from a prior real visit) but will work
correctly once deployed to a domain bunny.net's Pull Zone allows. Confirmed
by A/B testing: swapping the video block's source to a different (also
referer-protected) video ID from the same account made it play instantly in
the same dev environment — so the underlying assets and code are both fine,
only the referer check blocks local dev.

## Build summary

All 11 sections are built in `src/pages/index.astro`, `src/components/`
(Header, Footer, VideoPopup) and `public/scripts/site.js`, styled via
`src/styles/main.css` following the project's one-class-one-rule convention.
Verified visually at desktop (1440px), the "full" pane width (1280px), and
mobile (375px) — full-page screenshots compared section by section against
the design intent from the source, plus interactive checks (menu toggle, FAQ
accordion, project/approach accordions) confirmed via DOM inspection since
this environment's screenshot tool doesn't reliably capture post-interaction
state (it appears to reflect a fresh load rather than the live page — a
tooling quirk, not a site bug; the underlying JS was confirmed correct via
`preview_query` after each click).

Two real bugs were caught and fixed during verification:
- The `text-link__label` hover-reveal (a text-shadow duplicate trick) needs
  `display:inline-block` + a tightly clipped box to hide the duplicate copy —
  initially showed "Menu" doubled.
- Two spacing tokens (`--space-36`, `--space-42`) were referenced in CSS but
  never defined, which silently collapsed to browser-default sizing and blew
  up the "Premium Partner" icon to ~300px with overlapping text next to it.
  Also added missing responsive overrides for the type-scale tokens
  (`--text-h1` etc.) per breakpoint — without them the H1 overflowed
  horizontally on mobile.

## Remainder — what didn't come across 1:1

- **Apple Music playlist embed** — the iframe markup matches the source
  exactly, but this sandboxed preview never issued the network request for it
  (no entry in `preview_network`, no console error either) — likely this
  environment blocks third-party iframes outright. Worth checking in a real
  browser after deploying; nothing in the code looks wrong.
- **bunny.net HLS video** (video block, approach cards, client testimonials)
  — depends on the user's live bunny.net CDN account. Confirmed the `hls.js`
  wiring and shared-player logic are correct, but actual playback couldn't be
  verified end-to-end in this sandbox.
- **Duplicated FAQ content** (items 01/04/06) and **identical project-card
  copy** (all 7 "Corporate Website for the Construction Company...") carried
  over verbatim per the resolved `needsYou` decision — real per-project and
  per-FAQ copy is still needed from the user.
- **Privacy Policy / Terms & Conditions** — left as `href="#"` stubs, no real
  pages, per the resolved decision.
- **GSAP SplitText line-reveal** — built as a real effect (line-by-line
  fade/slide-up on scroll) on the `data-text-appear="line"` elements, since
  the source loaded the plugin but never wired it up. This is new behavior
  relative to the draft export, not a literal port — flagging it as such.

## Templates

This is a **single-page site** — one real template, the homepage
(`index.html`). `system-elements.html` is Webflow's auto-generated style-guide
page, not linked from navigation, not part of the real site — skipped.

There is no separate "About" page despite an "About" link in the nav menu;
"About", "Portfolio", "Services", "Approach", "Client Reviews", "FAQ" are all
anchor-style menu items presumably meant to scroll-link to the matching
section on this same page (the hrefs are currently all bare `href="#"` —
they don't yet target section ids, see needsYou).

### Homepage sections, in order

1. **Header / nav** — logo (inline SVG monogram), a "Menu" button with an
   animated hamburger (two lines), a `.menu-wrap` overlay panel already in the
   DOM (Portfolio / About / Services / Approach / Client Reviews / FAQ links),
   and a "Start a project" button linking to
   `https://cal.com/ihor.me/project-discussion`. **No JS currently opens the
   menu overlay** — there's no click handler on `.menu-button` anywhere in the
   page's scripts. Likely unfinished in the draft.

2. **Hero** (`section-hero section-overflow`, full `100svh`) — eyebrow copy
   with an icon: *"From positioning and structure to visual design and
   Webflow development — one specialist handles the full project, start to
   finish, with no handoffs to create you an"* (sentence appears cut off
   mid-thought — draft content, verbatim as found), logo mark, and H1:
   *"Enterprise level **websites** built to convert visitors into **clients.**"*
   Background: a **cursor-follow image trail** (`data-trail`) of 6
   "Work-Mockup" screenshots that spawn near the pointer and fade out,
   GSAP-animated, desktop-only (disabled under 992px width), gated by
   `ScrollTrigger` (only runs while the hero is in view). A `progressive-blur`
   stack (10 layered panels, `--blur:3rem`) sits fixed over the whole page —
   looks like a bottom-of-viewport blur gradient effect used globally, not
   hero-specific.

3. **"How I think about your website" video block** — icon row, a line of
   copy with italic emphasis spans, and a click-to-play HLS video
   (bunny.net `.m3u8`) that opens in a shared modal/lightbox with full custom
   controls (play/pause, scrubber with drag + arrow-key seek, volume,
   time display, focus trap, Escape to close).

4. **Recent projects** (`section-black is--projects`, dark, full `100svh`) —
   H2 *"Recent **projects**, currently live."* An accordion-style tab list on
   the left (7 `project-card`s) with a single shared image panel on the right;
   clicking/Enter-ing a card expands its category+description and swaps the
   shared image with a "mosaic" cell-by-cell reveal transition (built by hand
   in JS, not GSAP). Each card links out to a real client site. Content is
   **identical boilerplate copy repeated on all 7 cards** (all say "Corporate
   Website for the Construction Company..." verbatim) — only the project name,
   category badge, and thumbnail differ:

   | Project name | Category | External link | Thumbnail |
   |---|---|---|---|
   | Marsanz Built. | Construction | marsanzbuilt.com | Work-Mockup |
   | NoticeZero | Construction | noticezero.webflow.io | Work-Mockup-2 |
   | BrightLabs | Construction | brightlabs.nl | Work-Mockup-3 |
   | BlueLight | Construction | bluelightairlines.org | Work-Mockup-5 |
   | BreskulPeak | Construction | breskulpeak.webflow.io | Work-Mockup-4 |
   | MGR Holding | Construction | mgrholding.nl | Work-Mockup-1 |
   | SPS Kitchen | Construction | spskitchen.com | Work-Mockup-SPS |

   (This looks like placeholder/templated content pending real per-project
   copy — flagged in needsYou.)

5. **About / "Behind the Projects"** — portrait photo (Ihor-Image) with a
   text badge overlay, "Behind / the / Projects" stacked label, a "Premium
   Partner" badge + Webflow wordmark SVG + "Kharkiv, Ukraine" with a small
   flag/city logo, then two paragraphs of real bio copy: *"My name is Ihor and
   I create websites. I am not just a designer or a developer; I am a business
   analyst, an art director, and a certified Premium Webflow Partner."* / *"My
   clients recoup their website development costs within months after
   launch..."*

6. **Services** (`services-section section-black`, dark) — H2 *"Different
   **services,** same result"*, a Swiper carousel (fade + crossfade effect,
   autoplay every 6s but only while in viewport via IntersectionObserver,
   pagination dots) with 5 real slides:
   1. Website Build
   2. Webflow Development
   3. Migration to Webflow
   4. SEO / GEO
   5. Website Audit

   each with a heading, a numbered tag `(01)`–`(05)`, a paragraph, and a
   full-bleed background image (`Service-Image` through `Service-Image-4`).

7. **Approach** (`section-approach`) — H2 *"A **website** is six different
   jobs. I do all six properly."* Six numbered accordion cards (same
   open-one-at-a-time + shared-video-placeholder pattern as Projects, but here
   all 6 cards share **the same** bunny.net video, so opening any of them just
   restarts the same clip):
   1. Business positioning before design
   2. Information architecture and content logic
   3. Design that supports the message, not replaces it
   4. Clean, scalable Webflow build
   5. Accessibility and legal compliance
   6. Performance and search visibility

   Full real copy for all 6 (two paragraphs each) — this section's content is
   complete and not placeholder.

8. **Client reviews** — H2 *"The **clients** say it better than I can."* 3
   cards, each with a client logo, a "Play Video" button (opens the same
   video-popup lightbox), background preview video that autoplays muted
   in-card once scrolled into view, a quote, name, and title:
   - Antoine-Raphael J. Doummar — Director at DOUMMAR MEP Contractors
   - Emanuel Tsiris — Founding Head of Growth & GTM at Optimal AI
   - Brendan Kelly — Marketing Vice President at MS Transver

9. **FAQ** — H2 *"The **questions** clients usually ask before signing"*. 11
   accordion cards, first one open by default. **Items (01), (04), and (06)
   are the exact same question and answer verbatim** ("How do projects start,
   and what's the payment structure?") — looks like a duplication artifact in
   the draft rather than intentional. Real, distinct content on the other 8:
   pricing (~$3,000 minimum), timeline (3–8 weeks), scope/what's included,
   AI-in-workflow disclosure, working within existing brand, IP/file
   ownership on final payment, post-launch changes (14-day support window),
   progress tracking via a ClickUp workspace.

10. **"Feel the vibe of the work"** — H2 + an embedded Apple Music playlist
    iframe (`embed.music.apple.com/us/playlist/working/pl.u-PDb4zE5teDZzKGM`).

11. **Footer** — globe icon, H2 *"Even difficult work becomes easy with me"*,
    5 social icon links (Instagram, WhatsApp, Telegram, email, YouTube),
    "Start a project" button (same cal.com link), Privacy Policy / Terms &
    Conditions links (both `href="#"`, no real pages), a **live clock** showing
    current time in `Europe/Kyiv`, "Kharkiv, Ukraine", and "©2026 ihor.me / All
    rights reserved".

## Design system input

Full token extraction is in `MIGRATION-tokens.md`. Summary: 2 colors + 1
accent (near-black `#080807`, off-white `#e8e8e3`, red-orange accent
`#ea4e42`), sections alternate between the light page background and a fully
inverted dark (`section-black`) variant using the same two tokens swapped.
Two typefaces: **Mariupol** (sans, body + most headings, self-hosted
regular-weight-only woff2) and **Nyght Serif** (self-hosted italic-only
woff2, used exclusively for `<em>` emphasis words inside headings/rich text —
this is a deliberate serif-italic accent word treatment, not a general
second typeface). A fluid type scale driven by `clamp()` plus a page-root
`font-size` that scales with viewport width (see tokens doc). One spacing
scale in rem steps from 0 to 10rem. Two border-radius values used site-wide:
`0.75rem` (cards) and `1000rem` (pills/dots/fully-rounded). Breakpoints:
991px, 767px, 479px.

## External dependencies

- **cal.com** — "Start a project" button booking link
  (`cal.com/ihor.me/project-discussion`), used in header + footer.
- **bunny.net HLS video CDN** — 3 distinct `.m3u8` streams: the standalone
  video block, the (shared, single) approach-card video, and 3 distinct
  client-testimonial videos. Played via `hls.js` (CDN, `swiper@12` sibling
  script) with native-HLS fallback for Safari.
- **Swiper 12** (CDN JS + CSS) — services carousel.
- **GSAP 3.15** + ScrollTrigger + SplitText + Observer (CDN) — only
  confirmed *actual* use found is the hero image-trail (`ScrollTrigger` gate +
  `gsap.fromTo`/`gsap.to` for fade in/out). `SplitText` and `Observer` are
  registered but no call site was found in the page's inline scripts — likely
  either dead weight in the draft or used by Webflow's own compiled
  interactions that didn't make it into this export cleanly. Flagged as a gap,
  not silently dropped.
- **Apple Music embed** (`embed.music.apple.com`) — playlist iframe, no API
  key needed, just an iframe src.
- **Social links**: Instagram (`instagram.com/notihor`), WhatsApp
  (`wa.me/380931155129`), Telegram (`t.me/ihoriv_design`), YouTube
  (`youtube.com/@notihor`), email (`hello@ihor.me`).
- **Client project links** (external, real businesses): marsanzbuilt.com,
  noticezero.webflow.io, brightlabs.nl, bluelightairlines.org,
  breskulpeak.webflow.io, mgrholding.nl, spskitchen.com.
- **jQuery 3.5.1** + Webflow's own `webflow.js` runtime — boilerplate the
  export ships with; not needed once rebuilt outside Webflow (no `data-w-id`
  IX2 interactions exist in this export to depend on it for).

## Images (grouped; 83 files → 20 logical assets)

Real photography/screenshots (need real `<picture>`/responsive srcset
treatment):
- `Work-Mockup` (+ `-1` … `-5`, `-SPS`) — 7 project screenshot mockups, each
  with 5 generated widths (500/800/1080/1600/2600 or up to 2880 for
  Service-Image). Reused between the hero trail and the projects section.
- `Service-Image` (+ `-1` … `-4`) — 5 full-bleed service-slide backgrounds,
  widths up to 2880px (2x of 1440 display width).
- `Ihor-Image` (2 variants: a hashed-prefix one and a plain one — same photo,
  likely a duplicate from a Webflow asset re-upload) — the about-section
  portrait, 648×680.

Icons/decorative (candidates for inlined SVG or small PNG, no responsive
srcset needed):
- `about-icon.svg`, `svg-globe.svg`, `Icons.avif` (86×56), `kharkiv-logo.png`
  (36×32), `Client-Logo.svg` / `Client-Logo.png` / `Client-Logo-1.svg`
  (3 distinct client logos for the 3 testimonial cards), `favicon.ico`,
  `webclip.png` (apple-touch-icon).

## Cannot come across as-is

- **HLS video via bunny.net** — the rebuild can keep pointing at the same
  bunny.net URLs (they're the user's own CDN account, not a Webflow-hosted
  asset), but this is an external live dependency, not something bundled in
  the export. If that bunny.net account ever goes away, all 5 videos break.
- **Swiper, GSAP, hls.js as CDN scripts** — fine to keep as dependencies,
  but they're runtime JS the export references rather than anything
  transferable as static assets.
- **Apple Music playlist embed** — same, a live third-party iframe.
- **Webflow's own IX2/interactions runtime** (`webflow.js`) — not needed;
  everything interactive on this page turned out to be hand-written JS, not
  Webflow's visual interactions panel, so there's nothing Webflow-proprietary
  actually being dropped.
- **The `system-elements.html` Webflow style-guide page** — Webflow
  boilerplate, not a real site page, not being rebuilt.

## needsYou — resolved

1. **Menu overlay wiring** → build it working: hamburger opens the panel,
   Escape/outside-click closes it, each nav link scrolls to its matching
   section id.

2. **Duplicated FAQ content** (01/04/06) → carry over as-is for now; user has
   no real copy yet for 04/06.

3. **Identical project-card boilerplate copy** → carry over as-is for now;
   user has no real per-project blurbs yet.

4. **GSAP SplitText/Observer** → keep. The `text-appear="line"` attribute on
   the video-block paragraph, plus the CSS rule hiding `[text-appear="line"]`
   elements until JS runs (see index.html head), is almost certainly the
   intended hook for a SplitText-driven line-reveal — build that rather than
   shipping the scripts as dead weight.

5. **Video hosting** → keep bunny.net HLS CDN as-is.

6. **Services carousel** → keep Swiper as a dependency.

7. **Privacy/Terms links** → leave as placeholder stubs (consistent with #2/#3
   — not inventing legal copy), same disposition as the other placeholder
   content.
