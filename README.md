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

- **549+ Crisp Vector Icons**: Specially tuned for clean rendering at 16px, 24px, 32px, 48px, and high-DPI displays.
- **📦 Modular & Zero Waste**: Don't want the full bundle? Import only the categories you need (e.g. `commerce.css`, `arrows.css`) or use raw SCSS partials.
- **⚡ boodoo Framework Ready**: Designed to pair seamlessly with [boodoo CSS Framework](https://www.boodooframework.com/) utilities, buttons, badges, modals, and flexbox layout.
- **🎯 14 Categorized Collections**:
  - `brands` (293 icons) - Tech stacks, social platforms, AI tools, and developer brands
  - `commerce` (18 icons) - Carts, payment cards, wallets, QR codes, and checkout symbols
  - `directional` (16 icons) - Chevrons, arrows, directions, and turns
  - `media` (15 icons) - Players, pause/stop, volumes, cameras, music, and multimedia
  - `editor` (19 icons) - Text alignment, lists, editing, code, copy, tags, and markers
  - `feedback` (21 icons) - Badges, checks, alerts, warnings, spinners, and notifications
  - `files` (14 icons) - Files, folders, archives, and attachments
  - `devices` (14 icons) - Screens, phones, networks, CPUs, terminals, databases, wifi, and hardware
  - `communication` (11 icons) - Chat, messages, mails, and paper planes
  - `users` (9 icons) - Profiles, teams, roles, and contacts
  - `navigation` (9 icons) - Maps, pins, locations, cars, and vehicles
  - `security` (10 icons) - Locks, unlocks, keys, shields, and privacy
  - `time` (7 icons) - Clocks, calendars, alarms, history, and dates
  - `interface` (93 icons) - Menus, ratings, stars, hearts, moon, sparkles, bolt, globe, controls, and UI symbols

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

## 💡 Modular & Partial Usage (Zero Waste)

Users never need to bundle the entire library! Haticons is designed from the ground up for extreme optimization:

### 1. Partial CSS Imports (Bundler or CDN)

You can import **only** the categories you need (e.g. commerce, directional) without the rest of the 549 icons:

```javascript
// In your JS / React / Vue / Vite entry:
import 'haticons/categories/commerce.min.css';
import 'haticons/categories/directional.min.css';
```
Or via HTML / CDN:
```html
<!-- Load only Commerce & Payment icons (~1.5 KB minified) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/haticons@1.0.1/dist/css/categories/commerce.min.css">
```

### 2. Shared Core + Category Glyphs (Maximum Multi-Category Performance)

If your app uses several categories, import `core.min.css` once (sets up font-face & utilities), then import only the `-only.min.css` files with zero duplicate `@font-face` overhead:

```javascript
import 'haticons/dist/css/core.min.css';
import 'haticons/categories/commerce-only.min.css';
import 'haticons/categories/communication-only.min.css';
```

### 3. Tree-Shakeable Individual Icon Imports (Zero Font Overhead)

If you only use 3 or 4 icons in a React, Vue, Svelte, or Next.js app, import **individual icon modules** directly. You don't even need to load a webfont!

```javascript
// Imports ONLY the 'cart' and 'heart' icons (few bytes each!)
import cart from 'haticons/icons/cart';
import heart from 'haticons/icons/heart';

console.log(cart.svg);     // Raw optimized SVG string
console.log(cart.path);    // SVG path 'd' attribute
console.log(cart.content); // Unicode codepoint

// In React / JSX:
function CartButton() {
  return (
    <button>
      <span dangerouslySetInnerHTML={{ __html: cart.svg }} />
      <span>Checkout</span>
    </button>
  );
}
```

### 4. Direct Standalone SVG Files

Every icon is also exported as an optimized standalone `.svg` file ready for SVG loaders, `<img>` tags, or build pipelines:

```html
<!-- In Vite / Webpack / Next.js -->
<img src="node_modules/haticons/dist/svg/cart.svg" alt="Cart" width="24" height="24" />
```

Or via CDN:
```html
<img src="https://cdn.jsdelivr.net/npm/haticons@1.0.1/dist/svg/cart.svg" alt="Cart" />
```

---

## ⚛️ React & Vue Component Packages

Haticons includes first-class, fully typed component packages for React and Vue 3 with zero runtime overhead and automatic tree-shaking:

### React (`haticons/react`)
```tsx
import { HiCart, HiHeart, HiSearch } from 'haticons/react';

export function CartWidget() {
  return (
    <button className="btn btn-primary">
      <HiCart size={20} color="#fff" />
      <span>Checkout</span>
    </button>
  );
}
```

### Vue 3 (`haticons/vue`)
```vue
<script setup>
import { HiCart, HiHeart } from 'haticons/vue';
</script>

<template>
  <button class="btn btn-primary">
    <HiCart :size="20" color="#fff" />
    <span>Checkout</span>
  </button>
</template>
```

---

## 🔌 Modern Bundler Auto-Import Resolver (`unplugin`)

Use the bundled `HaticonsResolver` with `unplugin-vue-components` or `unplugin-auto-import` to use Haticons components anywhere in your templates without manual import statements!

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { HaticonsResolver } from 'haticons/resolver';

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [
        HaticonsResolver({ framework: 'vue', prefix: 'Hi' })
      ]
    })
  ]
});
```

---

## ⚡ Custom Subsetting & Codebase Scanner CLI

Create hyper-optimized, zero-waste font and CSS subsets containing **only the icons your project actually uses**:

```bash
# 1. Generate a custom subset from a list of icons
npx haticons subset --icons=cart,heart,search,bell --out=./src/assets/haticons-subset

# 2. Automatically scan your project source files (jsx, tsx, vue, html, svelte) and build a subset
npx haticons scan --src=./src --out=./src/assets/haticons-subset

# 3. List all available 549 icons and categories
npx haticons list
```

---

## 🎬 Micro-Animations & Duotone Engine

Haticons provides built-in CSS animations and duotone variants out of the box:

```html
<!-- Spinning / Loading -->
<i class="hi-refresh hi-spin"></i>

<!-- Soft pulse -->
<i class="hi-heart hi-pulse"></i>

<!-- Attention bounce -->
<i class="hi-bell hi-bounce"></i>

<!-- Alert shake -->
<i class="hi-warning hi-shake"></i>

<!-- Hover rotate -->
<i class="hi-settings hi-hover-rotate"></i>

<!-- Modern Duotone Variant -->
<i class="hi-cart hi-duotone"></i>
```

You can customize the secondary opacity of duotone icons using CSS variables:
```css
:root {
  --hi-duotone-opacity: 0.35;
}
```

---

### 5. Modular SCSS / Sass & LESS

Customize font paths and compile only the categories you need:

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

## ♿ Accessibility & Screen Readers

Icons should be made accessible depending on whether they are **decorative** or **meaningful**:

### 1. Decorative Icons (With Visible Text)
When an icon is accompanied by visible text, hide it from assistive technologies using `aria-hidden="true"`:
```html
<button class="btn btn-primary">
  <i class="hi-cart" aria-hidden="true"></i>
  <span>Add to Cart</span>
</button>
```

### 2. Meaningful / Icon-Only Buttons
When a button or link has no visible text, supply an accessible label via `aria-label` or a `.visually-hidden` text span:
```html
<!-- Accessible icon-only button -->
<button class="btn btn-outline-secondary" aria-label="Search icon catalog">
  <i class="hi-search" aria-hidden="true"></i>
</button>
```

---

## 🔄 Canonical Names & Backward-Compatible Aliases

To standardize icon naming without breaking existing code:
- Legacy suffixes with `1` (such as `pencil1`, `search1`, `bell1`, `calendar1`, `check1`) now have standard canonical aliases (`pencil-alt`, `search-alt`, `bell-alt`, `calendar-alt`, `check-alt`).
- Typo corrections like `snapchat` are supported as aliases pointing to `spanchat`.
- The original classes and glyph Unicode codepoints remain 100% intact and functional for existing deployments.

---

## 📱 Cross-Platform Integration

Haticons is engineered for modern cross-platform development:
- **Web (HTML, React, Vue, Next.js, Vite)**: Use the compact CSS webfont (`haticons.woff2`, ~34 KB) or modular category stylesheets.
- **Modern JavaScript Tree-Shaking**: Import standalone SVG icon modules from `haticons/icons/*` with zero webfont payload.
- **Mobile (React Native)**: Import path data via `import cart from 'haticons/icons/cart'` and render using `react-native-svg`.
- **Flutter & Native Android/iOS**: Place `haticons.ttf` in your app font assets or import standalone SVGs into Android Vector Drawables / iOS Asset Catalogs.

---

## 🔍 JavaScript & TypeScript API

For dynamic apps, search bars, or metadata inspect:

```javascript
import { icons, categories, aliases, getIcon, getByCategory } from 'haticons';

// Find icon by name, class, or alias
const icon = getIcon('hi-cart');
console.log(icon);
// { class: 'hi-cart', name: 'cart', content: '\\e918', category: 'commerce' }

// Resolves canonical aliases seamlessly
const snapchat = getIcon('snapchat'); // Resolves to 'spanchat'

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

# Run automated tests
npm test
```

---

## 📖 Documentation, Examples & Reference
 
Visit the official documentation website for live examples, cheat sheets, and integration guides:

- 🌐 **[Official Website](https://haticons.com/)** - Overview, npm installation, and live interactive previews.
- 📚 **[Full Icon Reference Catalog](https://haticons.com/reference.html)** - Comprehensive categorization index with quick-copy tags, live search, and Unicode codepoints.
- 💡 **[Step-by-Step Tutorial](https://haticons.com/tutorial.html)** - Accessibility guidance, native platform integration, React, Vue, Sass customization, and tree-shaking individual SVG modules.
- 📝 **[Changelogs](https://haticons.com/changelogs.html)** - Version history, migration guides, and release notes.

---

## 📋 Changelog

Detailed release notes and migration guides can be found in [CHANGELOG.md](CHANGELOG.md) or online at [haticons.com/changelogs.html](https://haticons.com/changelogs.html).

---

## 📄 License & Trademark Notice

- **Software & Artwork**: Distributed under the **GNU General Public License v3.0 (GPL-3.0)**. See [LICENSE](LICENSE) for details.
- **Third-Party Trademarks**: All company, product, and service logos in the `brands` category are trademarks of their respective owners. Their inclusion in Haticons does not imply endorsement or affiliation.
- Crafted with pride by **[PebbleBenders](https://pebblebenders.com/)** &middot; Built with **[boodoo Framework](https://www.boodooframework.com/)**.

