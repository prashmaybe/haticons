# Changelog

All notable changes to the **Haticons** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.2] - 2026-10-29

### Added
- **75 New Icons Across 8 Categories (Total 569 Icons)**: Expanded library from 494 to 569 vector icons (+75 icons across categories):
  - **20 AI & Developer Brand Icons**:
    - **Cursor** (`hi-cursor`, alias `cusror`): Cursor AI code editor icon.
    - **Trae** (`hi-trae`): Trae adaptive AI IDE by ByteDance icon.
    - **Antigravity** (`hi-antigravity`, aliases `antogravity`, `google-antigravity`, `googleantigravity`, `agy`): Google Antigravity agentic coding platform icon.
    - **Boodoo** (`hi-boodoo`, aliases `boodooframework`, `boodoo-framework`): Boodoo Design Framework official emblem (https://boodooframework.com/).
    - **Windsurf** (`hi-windsurf`, aliases `codeium`, `codeium-windsurf`): Codeium Windsurf AI IDE icon.
    - **Claude** (`hi-claude`, aliases `claude-ai`, `claudecode`): Anthropic Claude AI starburst emblem.
    - **Copilot** (`hi-copilot`, aliases `github-copilot`, `githubcopilot`): GitHub Copilot developer icon.
    - **DeepSeek** (`hi-deepseek`, alias `deepseek-ai`): DeepSeek AI icon.
    - **Ollama** (`hi-ollama`): Ollama local AI platform icon.
    - **Perplexity** (`hi-perplexity`, alias `perplexity-ai`): Perplexity AI search icon.
    - **Mistral** (`hi-mistral`, alias `mistral-ai`): Mistral AI pixel cat emblem.
    - **Groq** (`hi-groq`): Groq LPU high-speed AI inference icon.
    - **Replit** (`hi-replit`): Replit development environment icon.
    - **Hugging Face** (`hi-huggingface`, aliases `hugging-face`, `hf`): Hugging Face open-source AI icon.
    - **v0** (`hi-v0`, alias `v0-dev`): Vercel v0 generative UI platform icon.
    - **LangChain** (`hi-langchain`): LangChain AI orchestration framework icon.
    - **Astro** (`hi-astro`): Astro web framework icon.
    - **Prisma** (`hi-prisma`): Prisma modern ORM icon.
    - **Resend** (`hi-resend`): Resend modern email API icon.
    - **shadcn/ui** (`hi-shadcn`, aliases `shadcn-ui`, `shadcnui`): shadcn/ui UI component library icon.
    - **Gemini Enhancements** (`hi-gemini`, aliases `google-gemini`, `googlegemini`): Added canonical aliases for Google Gemini.
  - **Modern Brands, AI & Tech Stacks (36 icons)**: Added `react`, `x-twitter` (`x`, `twitter-x`), `threads`, `discord`, `telegram`, `bluesky`, `openai` (`chatgpt`), `anthropic` (`claude`), `gemini`, `figma`, `canva`, `notion`, `linear`, `supabase`, `firebase`, `vercel`, `nextjs` (`next-js`), `tailwind` (`tailwindcss`), `svelte`, `bun`, `docker`, `kubernetes` (`k8s`), `stripe`, `zoom`, `signal`, `pinterest`, `patreon`, `postman`, `google-cloud` (`gcp`), `pnpm`, `vite`, `graphql`, `postgresql` (`postgres`), `mongodb` (`mongo`), `redis`, and `golang` (`go`).
  - **Essential Media Controls**: Added `pause` and `stop` to complete the multimedia player set alongside `play`.
  - **Modern UI & Theme Controls**: Added `moon` (`dark-mode` alias) for night/dark theme switchers, `sparkles` (`ai`, `magic` aliases) for AI enhancements, `bolt` (`lightning`), and `globe` (`web`).
  - **Developer, System & Hardware**: Added `code`, `terminal`, `database`, `cpu`, and `wifi`.
  - **Security & Commerce**: Added `shield`, `shield-check`, and `qrcode` (`qr-code`).
  - **Workflow & Productivity**: Added `copy` (clipboard companion to `paste`), `external-link`, `filter`, `history`, and `spinner` (`loading`).
- **Asset Provenance & Intellectual Property Manifest (`PROVENANCE.md`)**:
  - Published comprehensive 3-tier IP manifest documenting all 14 categories, authorships, and commercial redistribution rights.
  - Added **Font & Asset Embedding Exception** to `LICENSE`, guaranteeing that embedding Haticons webfonts, SVGs, or components in commercial and proprietary software does not subject the host application to GPL copyleft.
  - Formulated clear Nominative Fair Use and Trademark Guidelines for all 313 brand logos.
- **Dynamic `<Haticon />` Component for React & Vue 3**:
  - Introduced generic `<Haticon name="search" size={24} />` component for both `haticons/react` and `haticons/vue` with full TypeScript definitions and alias resolution.
  - Enhanced `HaticonsResolver` (`haticons/resolver`) with `{ framework: 'vue' | 'react' }` support for automated bundler component imports.
- **Cross-Platform Support Matrix**:
  - Documented first-class integration paths and code examples for Web, React, Vue, React Native (`react-native-svg`), iOS (SwiftUI/UIKit), Android (Compose/XML), Flutter, and Desktop.
- **Automated Production Quality Gate & Testing**:
  - Added `scripts/verify-release.js` test suite verifying all 569 icons, aliases, CSS font path resolution, CJS/ESM modules, framework components, and npm tarball contents.
  - Added automated bundle size benchmarking (`scripts/bundle-size.js` and `BUNDLE_SIZE.md`).

### Fixed
- **Category CSS Font Path Resolution**: Corrected relative font URL path (`../../fonts/`) in all standalone category stylesheets (`dist/css/categories/*.css`), ensuring webfonts resolve correctly from category entry points.
- **Release Synchronization**: Synchronized package version (1.0.2), README, CDN snippets, changelogs, and website documentation into lockstep.

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
