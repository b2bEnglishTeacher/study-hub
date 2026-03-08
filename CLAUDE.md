# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bia Business English** is a static HTML website — a study hub for Business English learners. There is no build system, no package manager, and no framework. All pages are plain HTML with inline CSS and JavaScript.

## Architecture

- `index.html` — Landing page / study hub listing all available modules
- `pages/` — Individual lesson pages (one HTML file per topic, e.g. `email-etiquette.html`, `negotiation-language.html`)
- `assets/` — Static assets (logo image)

Each lesson page is self-contained with inline `<style>` and `<script>` tags. Pages follow a consistent structure: nav → hero → theory section → vocabulary → quiz → practice exercises → footer.

## Development

No build or install step. Open any HTML file directly in a browser, or use a local server:

```
python3 -m http.server 8000
```

## Design System (CSS Custom Properties)

The index page uses a warm palette with `--accent: #C45D3E`. Lesson pages use a different accent (`--accent: #6366F1` indigo) with additional color tokens (`--c1` through `--c4`) for card theming and category labels.

Shared conventions across all pages:
- **Fonts**: DM Serif Display (headings), DM Sans (body), JetBrains Mono (code/labels) — loaded via Google Fonts
- **Layout**: Max-width containers (740–860px), centered content
- **Components**: `.theory-card`, `.quiz-container`, `.exercise-card`, `.vocab-grid`, `.tips-box`
- **Fixed nav** with logo image, site name, and section anchor links
- **Responsive**: Media query at 640px breakpoint

## Conventions

- All content is in English (language attribute `lang="en"`)
- Branding: "Bia Business English" — logo at `assets/logo.png`
- Lesson pages link back to hub via `../index.html` and reference assets with `../assets/`
- Interactive quizzes are implemented with vanilla JavaScript inline in each page
