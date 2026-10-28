# Haticons

<p align="center">
  <img src="code/assets/images/favicon.png" alt="Haticons Logo" width="64" height="64" />
</p>

<p align="center">
  <strong>A set of beautifully crafted, lightweight, modular Webfont and SVG Icons.</strong><br>
  An open-source project by <strong><a href="https://pebblebenders.com/">PebbleBenders</a></strong>.<br>
  Inspired by <em>Ionicons</em>, <em>FontAwesome</em>, and <em>Glyphicons</em> &middot; <strong>Made with <a href="https://www.boodooframework.com/">boodoo Framework</a></strong>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/haticons"><img src="https://img.shields.io/npm/v/haticons.svg?color=7c3aed" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/haticons"><img src="https://img.shields.io/npm/dm/haticons.svg" alt="npm downloads" /></a>
  <a href="https://www.boodooframework.com/"><img src="https://img.shields.io/badge/made%20with-boodoo-7c3aed.svg" alt="Made with boodoo" /></a>
  <a href="https://pebblebenders.com/"><img src="https://img.shields.io/badge/by-PebbleBenders-0f172a.svg" alt="by PebbleBenders" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0-blue.svg" alt="License" /></a>
</p>

<p align="center">
  <a href="https://haticons.com/"><strong>Homepage</strong></a> &middot;
  <a href="https://haticons.com/reference.html"><strong>Full Icon Reference</strong></a> &middot;
  <a href="https://haticons.com/tutorial.html"><strong>Tutorial &amp; Usage Guide</strong></a> &middot;
  <a href="https://haticons.com/changelogs.html"><strong>Changelogs</strong></a>
</p>

---

## 🚀 Features

- **494+ Crisp Vector Icons**: Specially tuned for clean rendering at 16px, 24px, 32px, 48px, and high-DPI displays.
- **📦 Modular & Zero Waste**: Don't want the full bundle? Import only the categories you need (e.g. `commerce.css`, `arrows.css`) or use raw SCSS partials.
- **⚡ boodoo Framework Ready**: Designed to pair seamlessly with [boodoo CSS Framework](https://www.boodooframework.com/) utilities, buttons, badges, modals, and flexbox layout.
- **🎯 14 Categorized Collections**:
  - `brands` (257 icons) - Tech stacks, social platforms, and developer brands
  - `commerce` (17 icons) - Carts, payment cards, wallets, and checkout symbols
  - `directional` (16 icons) - Chevrons, arrows, directions, and turns
  - `media` (13 icons) - Players, volumes, cameras, music, and multimedia
  - `editor` (17 icons) - Text alignment, lists, editing, tags, and markers
  - `feedback` (20 icons) - Badges, checks, alerts, warnings, and notifications
  - `files` (14 icons) - Files, folders, archives, and attachments
  - `devices` (10 icons) - Screens, phones, networks, and hardware
  - `communication` (11 icons) - Chat, messages, mails, and paper planes
  - `users` (9 icons) - Profiles, teams, roles, and contacts
  - `navigation` (9 icons) - Maps, pins, locations, cars, and vehicles
  - `security` (8 icons) - Locks, unlocks, keys, and privacy
  - `time` (6 icons) - Clocks, calendars, alarms, and dates
  - `interface` (87 icons) - Menus, ratings, stars, hearts, controls, and UI symbols

---

## 📦 Installation

```bash
# via npm
npm install haticons

# via yarn
yarn add haticons

# via pnpm
pnpm add haticons
```

Or use directly via CDN (jsDelivr / unpkg):

```html
<!-- Full bundle -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/haticons@1.0.1/dist/css/haticons.min.css">
```

---

## 💡 Modular Usage (Import Only What You Need)

Users do not need to import the complete CSS bundle! You can import only specific categories or use Sass/SCSS partials.

### 1. Precompiled Category CSS (CDN or Bundler)

Every category is available as a standalone CSS file (including font definitions):

```html
<!-- Load only Commerce & Payment icons (~1.5 KB minified) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/haticons@1.0.1/dist/css/categories/commerce.min.css">

<!-- Load only Directional & Arrow icons (~1.5 KB minified) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/haticons@1.0.1/dist/css/categories/directional.min.css">

<!-- Load only Media icons (~1.4 KB minified) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/haticons@1.0.1/dist/css/categories/media.min.css">
```

### 2. Shared Core + Category-Only CSS (Optimal for Multi-Category Sites)

If you use multiple categories, load `core.min.css` once, then load only the icon definitions:

```html
<!-- Core webfont & sizing classes (less than 1 KB) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/haticons@1.0.1/dist/css/core.min.css">

<!-- Then add category glyphs without duplicate font-face declarations -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/haticons@1.0.1/dist/css/categories/commerce-only.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/haticons@1.0.1/dist/css/categories/communication-only.min.css">
```

### 3. Modular SCSS / Sass & LESS

If your project uses SCSS or LESS, customize font paths and import only required modules:

#### SCSS / Sass:
```scss
// Override variables if needed
$hi-font-path: "~haticons/dist/fonts";
$hi-prefix: "hi-";

// Import core font-face & utilities
@import "haticons/scss/variables";
@import "haticons/scss/core";

// Import only the categories you need
@import "haticons/scss/categories/commerce";
@import "haticons/scss/categories/communication";
@import "haticons/scss/categories/directional";
```

#### LESS:
```less
// Override variables if needed
@hi-font-path: "~haticons/dist/fonts";
@hi-prefix: ~"hi-";

// Import core font-face & utilities
@import "haticons/less/variables.less";
@import "haticons/less/core.less";

// Import only the categories you need
@import "haticons/less/categories/commerce.less";
@import "haticons/less/categories/communication.less";
@import "haticons/less/categories/directional.less";
```

---

## 🎨 Using with boodoo Framework

Haticons pairs naturally with **[boodoo Framework](https://www.boodooframework.com/)**:

```html
<!-- Include boodoo CSS & Haticons -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boodoo@latest/dist/css/boodoo.min.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/haticons@1.0.1/dist/css/haticons.min.css">

<!-- Button with Haticon -->
<button class="btn btn-primary d-inline-flex align-items-center gap-1">
  <i class="hi-download"></i>
  <span>Download</span>
</button>

<!-- Navigation link with Haticon -->
<a href="#settings" class="nav-link d-flex align-items-center gap-1">
  <i class="hi-settings text-primary"></i>
  <span>Account Settings</span>
</a>

<!-- Input search group -->
<div class="input-group">
  <span class="input-group-text"><i class="hi-search"></i></span>
  <input type="text" class="form-control" placeholder="Search icons...">
</div>
```

---

## 🔍 JavaScript & TypeScript API

Haticons also exports icon metadata, unicode codepoints, and category querying utilities:

```javascript
import { icons, categories, getIcon, getByCategory } from 'haticons';

// Find icon by name or class
const icon = getIcon('hi-cart');
console.log(icon);
// { class: 'hi-cart', name: 'cart', content: '\\f063', category: 'commerce' }

// Get all icons in a category
const commerceIcons = getByCategory('commerce');
console.log(commerceIcons.length); // 17
```

---

## 🛠️ Build & Development

```bash
# Install dependencies
npm install

# Run full compilation & category generation
npm run build

# Run tests
npm test
```

---

## 📖 Documentation, Examples & Reference
 
Visit the official documentation website for live examples, cheat sheets, and integration guides:

- 🌐 **[Official Website](https://haticons.com/)** - Overview, CDN links, and 2-minute quickstart.
- 📚 **[Full Icon Reference Catalog](https://haticons.com/reference.html)** - Comprehensive categorization index with quick-copy tags, unicode values, and category sidebar scrollspy.
- 💡 **[Step-by-Step Tutorial](https://haticons.com/tutorial.html)** - In-depth examples for vanilla HTML, boodoo UI components, Vue, React, Angular, Sass customization, and tree-shaking individual SVG modules.
- 📝 **[Changelogs](https://haticons.com/changelogs.html)** - Version history, migration guides, and release notes.

---

## 📋 Changelog

Detailed release notes and migration guides can be found in [CHANGELOG.md](CHANGELOG.md) or online at [haticons.com/changelogs.html](https://haticons.com/changelogs.html).

---

## 📄 License

GPL-3.0 License. See [LICENSE](LICENSE) for details.
HatIcons by [PebbleBenders](https://pebblebenders.com/) &middot; Made with boodoo Framework.
