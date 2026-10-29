# Changelog

All notable changes to the **Haticons** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.1] - 2026-10-28

### Added
- **Full LESS Support**: Added complete modular LESS preprocessor sources under `less/`, including `variables.less`, `core.less`, 14 category files (`less/categories/*.less`), and bundle entry `haticons.less`.
- **Package Exports for LESS**: Configured package entry `"less": "less/haticons.less"` and `./less/*` exports mapping in `package.json`.
- **Official CLI Tool**: Introduced `haticons` command-line utility (`bin/haticons.js` / `npx haticons`) for searching icons, category exploration, metadata inspection, and SVG extraction.
- **React & Vue 3 Component Packages**: Generated first-class framework component packages (`haticons/react` and `haticons/vue`) with full TypeScript declarations (`index.d.ts`), ESM, and CommonJS support.
- **Auto-Import Bundler Resolver**: Added `haticons/resolver` for automatic on-demand component loading with `unplugin-vue-components`, Vite, and Webpack.
- **Style Variant Addon Classes**: Added style variant suffixes and helper classes (`.hi-*-fill` / `.hi-fill`, `.hi-*-outline` / `.hi-outline`, `.hi-*-sharp` / `.hi-sharp`) for solid, outline, and sharp icon variants.
- **Built-in Sizing & Animation Modifiers**: Added size multiplier classes (`.hi-xs`, `.hi-sm`, `.hi-md`, `.hi-lg`, `.hi-xl`, `.hi-2x`, `.hi-3x`, `.hi-4x`, `.hi-5x`), animation utilities (`.hi-spin`, `.hi-pulse`), rotation & flip transforms (`.hi-rotate-*`, `.hi-flip-*`), and fixed-width alignment (`.hi-fw`).
- **Comprehensive Documentation & Reference Suite**:
  - Added dedicated **Icon Reference Catalog** (`reference.html`) featuring real-time search, SVG preview modals, and category index navigation.
  - Added **In-Depth Tutorial & Integration Guide** (`tutorial.html`) covering React, Vue, Sass, LESS, Vanilla CSS, CDN, and SVG sprites.
  - Added dedicated **Changelogs Timeline** (`changelogs.html`).
  - Added official legal pages: **Terms of Use** (`terms.html`), **Privacy Policy** (`privacy.html`), and **License** (`license.html`).
- **Server Caching & Security**: Added Apache `.htaccess` server configuration featuring Gzip/Brotli compression, Webfont CORS headers (`Access-Control-Allow-Origin: *`), and browser cache headers.

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
