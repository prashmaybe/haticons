# Changelog

All notable changes to the **Haticons** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.2] - 2026-10-29

### Added
- **55 New Brand and Required Icons**: Expanded icon set from 494 to 549 icons (+55 icons across 8 categories):
  - **Modern Brands, AI & Tech Stacks (36 new icons)**: Added `react`, `x-twitter` (with `x` and `twitter-x` aliases), `threads`, `discord`, `telegram`, `bluesky`, `openai` (`chatgpt`), `anthropic` (`claude`), `gemini`, `figma`, `canva`, `notion`, `linear`, `supabase`, `firebase`, `vercel`, `nextjs` (`next-js`), `tailwind` (`tailwindcss`), `svelte`, `bun`, `docker`, `kubernetes` (`k8s`), `stripe`, `zoom`, `signal`, `pinterest`, `patreon`, `postman`, `google-cloud` (`gcp`), `pnpm`, `vite`, `graphql`, `postgresql` (`postgres`), `mongodb` (`mongo`), `redis`, and `golang` (`go`).
  - **Essential Media Controls**: Added `pause` and `stop` to complete the multimedia player set alongside `play`.
  - **Modern UI & Theme Controls**: Added `moon` (with `dark-mode` alias) for night/dark theme switchers, `sparkles` (`ai`, `magic` aliases) for modern AI enhancements, `bolt` (`lightning`), and `globe` (`web`).
  - **Developer, System & Hardware**: Added `code`, `terminal`, `database`, `cpu`, and `wifi`.
  - **Security & Commerce**: Added `shield`, `shield-check`, and `qrcode` (`qr-code`).
  - **Workflow & Productivity**: Added `copy` (clipboard companion to `paste`), `external-link`, `filter`, `history`, and `spinner` (`loading`).
- **Automated Webfont Compilation**: Integrated build step that synchronizes and generates TTF, WOFF, EOT, and WOFF2 webfonts directly from SVG font sources.
- **Convenient Modern Aliases**: Added aliases including `dark-mode`, `ai`, `magic`, `x`, `chatgpt`, `claude`, `arrow-up`, `arrow-down`, `chevron-up`, and `chevron-down`.

---

## [1.0.1] - 2026-10-28

### Added
- **Full LESS Support**: Added complete modular LESS preprocessor sources under `less/`, including `variables.less`, `core.less`, 14 category files (`less/categories/*.less`), and bundle entry `haticons.less`.
- **Package Exports for LESS**: Configured package entry `"less": "less/haticons.less"` and `./less/*` exports mapping in `package.json`.

### Fixed
- **Clean Build Output**: Silenced Dart Sass `@import` deprecation warnings during standalone and category bundle compilation pipelines (`scripts/compiler.js`).
- **CDN Version References**: Updated documentation and interactive snippets to reference version 1.0.1.

---

## [1.0.0] - 2026-10-27

### Added
- **Official npm Package Publishing**: Published as [`haticons`](https://www.npmjs.com/package/haticons) with full TypeScript type definitions (`index.d.ts`), CJS (`index.js`), and ESM (`index.mjs`) module entry points.
- **Tree-Shakable Icon Components & Vector SVGs**: Individual JavaScript and ESM icon modules generated in `dist/icons/` and standalone SVG assets in `dist/svg/`.
- **14 Granular Icon Categories**: Grouped all 494 icons into focused collections:
  - `brands` (257 icons)
  - `interface` (87 icons)
  - `feedback` (20 icons)
  - `commerce` (17 icons)
  - `editor` (17 icons)
  - `directional` (16 icons)
  - `files` (14 icons)
  - `media` (13 icons)
  - `communication` (11 icons)
  - `devices` (10 icons)
  - `users` (9 icons)
  - `navigation` (9 icons)
  - `security` (8 icons)
  - `time` (6 icons)
- **Modular CSS & SCSS Architecture**:
  - Independent category stylesheets (e.g. `dist/css/categories/commerce.min.css`) bundling core font-face and icons.
  - Zero-waste glyph-only styles (`commerce-only.min.css`) designed to accompany `core.min.css`.
  - Full SCSS source files and mixins in `scss/` and `scss/categories/`.
- **Programmatic Query API**: Helper methods `getIcon(className)` and `getByCategory(categoryName)` to query icon definitions and unicode glyph points dynamically.
- **Modern Documentation & Web Application**:
  - High-performance multi-page documentation website deployed with dedicated pages:
    - **[Homepage](https://haticons.com/)** (`index.html`): Hero quickstart, CDN & npm installation pill, and 2-minute starter tutorial.
    - **[Interactive Cheat Sheet](https://haticons.com/cheatsheet.html)** (`cheatsheet.html`): Dedicated searchable cheatsheet featuring live keyword filtering across 494 icons, category tabs, and interactive detail modals.
    - **[Icon Reference Catalog](https://haticons.com/reference.html)** (`reference.html`): Categorized list of all 14 icon groups with click-to-copy HTML classes, CSS Unicode codepoints, and sticky sidebar navigation.
    - **[Tutorial & Integration Guide](https://haticons.com/tutorial.html)** (`tutorial.html`): Real-world examples with boodoo UI, Vanilla CSS, Sass customization, React, Vue, and standalone SVG imports.
    - **[Changelogs](https://haticons.com/changelogs.html)** (`changelogs.html`): Detailed timeline and release notes.
  - Integrated [boodoo CSS Framework](https://www.boodooframework.com/) design system tokens, responsive navigation, search modals, and toasts.
  - Interactive theme switcher supporting System, Light, and Dark modes.
  - Automated link validation and sitemap indexation (`sitemap.xml`, `llms.txt`).
- **Governance & Open Source Identity**: Established repository licensing under GNU General Public License v3.0, maintained by **[PebbleBenders](https://pebblebenders.com/)**.

---

## [0.9.0] - Historical Legacy

### Added
- Initial webfont generator for Haticons icon suite.
- Monolithic `haticons.css` stylesheet and basic webfont bundles (`.eot`, `.woff`, `.ttf`, `.svg`).
- Single-page PHP cheatsheet previewer.
