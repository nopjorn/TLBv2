# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TLBv2** is a static marketing website for **T.L.B. Service** (tlbservice.com), a Thai welding and industrial machinery repair company. The site is deployed via GitHub Pages with a custom domain.

All user-facing content is written in **Thai language**.

## Local Development

There is no build step. The site must be served via HTTP (not `file://`) because `main.js` uses `fetch()` to load HTML partials. Start a local server from the repo root:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

There are no dependencies to install, no lint commands, and no test suite.

## Architecture

The site uses a **fetch-based partial loading** pattern to achieve modularity without a build system:

1. `index.html` — Entry point. Contains section placeholder `<div>` elements with `data-include="partials/<name>.html"` attributes and no actual content.
2. `js/main.js` — On `DOMContentLoaded`, calls `loadAllPartials()` which fetches every partial in parallel and injects their HTML. After all partials resolve, `initPage()` runs to wire up interactivity.
3. `partials/*.html` — Self-contained HTML sections (header, hero, stats, services, why, portfolio, quote, contact, footer). Each partial is one major page section.
4. `css/style.css` — All styles in a single file, grouped by section with comment headers.

**Adding a new section**: create `partials/<name>.html`, add a `<div data-include="partials/<name>.html"></div>` in `index.html` at the desired position, and add corresponding styles to `style.css`.

## CSS Conventions

Design tokens are defined as CSS custom properties on `:root` in `style.css`:

| Variable | Role |
|---|---|
| `--ink` | Primary dark text/background |
| `--gold` | Primary accent (CTA buttons, highlights) |
| `--ember` | Secondary accent |
| `--paper` | Light background |

Typography uses **Google Fonts**: Kanit (headings, nav) and Sarabun (body). Breakpoints are `980px` (tablet) and `560px` (mobile).

Decorative CSS classes `.weld-seam` and `.plate-texture` implement the industrial visual theme using pure CSS gradients.

## JavaScript Conventions

`main.js` exports no modules — it is a single IIFE-style script with named init functions:

- `loadAllPartials()` — fetches and injects all partials; returns a Promise
- `initPage()` — orchestrates all init calls after partials are loaded
- `initMobileMenu()` — hamburger toggle on `.mobile-menu` using the `.open` class
- `initRevealOnScroll()` — IntersectionObserver on `.reveal` elements (12% threshold)
- `initContactForm()` — generates a `mailto:` link from form fields; no backend
- `initYear()` — sets `#year` text to current year

No external JS libraries are used.

## Contact Form

The contact form in `partials/contact.html` has **no backend**. Submission builds a `mailto:` URL and opens the user's email client. There is no form validation beyond what the browser provides via `required` attributes.
