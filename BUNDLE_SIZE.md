# Haticons Bundle Size & Performance Benchmark

**Version**: 1.0.2  
**Generated**: 2026-11-05  
**Architecture**: Modular Category Subsets, Core Font Sharing, & Zero-Waste Tree-Shaking  

---

## ⚡ Performance Summary

- **Single Tree-Shaken Icon**: **~800 bytes** gzipped (Zero webfont download required).
- **Core CSS Framework**: **~780 bytes** gzipped (`core.min.css`).
- **Category Glyphs Only**: **300 B - 1 KB** gzipped when paired with `core.min.css`.
- **Full 569-Icon Webfont**: **~100 KB** raw WOFF2 covering all 14 categories.

---

## 📊 Detailed Size Breakdown

### 1. Core & Full Bundle Suite

| Asset / Bundle | Target Description | Raw Size | Gzip Size | Brotli Size |
| :--- | :--- | :---: | :---: | :---: |
| **Full Webfont (`haticons.woff2`)** | Complete 569-icon vector font | 100.24 KB | **100.28 KB** | 100.24 KB |
| **Full CSS Minified (`haticons.min.css`)** | All 569 icon classes + utilities | 75.40 KB | **12.16 KB** | 8.97 KB |
| **Core CSS (`core.min.css`)** | @font-face + base sizing & animations | 2.40 KB | **855 B** | 767 B |

### 2. Standalone Category Bundles (Includes Font-Face)

| Asset / Bundle | Target Description | Raw Size | Gzip Size | Brotli Size |
| :--- | :--- | :---: | :---: | :---: |
| **Category: brands (`brands.min.css`)** | Self-contained brands bundle | 41.84 KB | **7.15 KB** | 5.27 KB |
| **Category: commerce (`commerce.min.css`)** | Self-contained commerce bundle | 4.81 KB | **1.24 KB** | 1.08 KB |
| **Category: communication (`communication.min.css`)** | Self-contained communication bundle | 4.17 KB | **1.13 KB** | 1006 B |
| **Category: devices (`devices.min.css`)** | Self-contained devices bundle | 3.94 KB | **1.14 KB** | 986 B |
| **Category: directional (`directional.min.css`)** | Self-contained directional bundle | 4.88 KB | **1.19 KB** | 1.02 KB |
| **Category: editor (`editor.min.css`)** | Self-contained editor bundle | 4.64 KB | **1.22 KB** | 1.05 KB |
| **Category: feedback (`feedback.min.css`)** | Self-contained feedback bundle | 6.04 KB | **1.38 KB** | 1.19 KB |
| **Category: files (`files.min.css`)** | Self-contained files bundle | 4.21 KB | **1.13 KB** | 997 B |
| **Category: interface (`interface.min.css`)** | Self-contained interface bundle | 14.26 KB | **2.74 KB** | 2.17 KB |
| **Category: media (`media.min.css`)** | Self-contained media bundle | 4.15 KB | **1.15 KB** | 1023 B |
| **Category: navigation (`navigation.min.css`)** | Self-contained navigation bundle | 3.35 KB | **1.02 KB** | 904 B |
| **Category: security (`security.min.css`)** | Self-contained security bundle | 3.55 KB | **1.05 KB** | 938 B |
| **Category: time (`time.min.css`)** | Self-contained time bundle | 3.35 KB | **1.00 KB** | 902 B |
| **Category: users (`users.min.css`)** | Self-contained users bundle | 3.59 KB | **1.04 KB** | 913 B |

### 3. Zero-Waste Category-Only Stylesheets (Paired with core.min.css)

| Asset / Bundle | Target Description | Raw Size | Gzip Size | Brotli Size |
| :--- | :--- | :---: | :---: | :---: |
| **Glyphs Only: brands (`brands-only.min.css`)** | Zero-waste glyphs for brands | 39.43 KB | **6.24 KB** | 4.50 KB |
| **Glyphs Only: commerce (`commerce-only.min.css`)** | Zero-waste glyphs for commerce | 2.40 KB | **442 B** | 370 B |
| **Glyphs Only: communication (`communication-only.min.css`)** | Zero-waste glyphs for communication | 1.75 KB | **339 B** | 287 B |
| **Glyphs Only: devices (`devices-only.min.css`)** | Zero-waste glyphs for devices | 1.53 KB | **341 B** | 263 B |
| **Glyphs Only: directional (`directional-only.min.css`)** | Zero-waste glyphs for directional | 2.47 KB | **391 B** | 309 B |
| **Glyphs Only: editor (`editor-only.min.css`)** | Zero-waste glyphs for editor | 2.23 KB | **431 B** | 339 B |
| **Glyphs Only: feedback (`feedback-only.min.css`)** | Zero-waste glyphs for feedback | 3.62 KB | **582 B** | 485 B |
| **Glyphs Only: files (`files-only.min.css`)** | Zero-waste glyphs for files | 1.80 KB | **334 B** | 266 B |
| **Glyphs Only: interface (`interface-only.min.css`)** | Zero-waste glyphs for interface | 11.85 KB | **1.89 KB** | 1.44 KB |
| **Glyphs Only: media (`media-only.min.css`)** | Zero-waste glyphs for media | 1.74 KB | **363 B** | 292 B |
| **Glyphs Only: navigation (`navigation-only.min.css`)** | Zero-waste glyphs for navigation | 955 B | **232 B** | 186 B |
| **Glyphs Only: security (`security-only.min.css`)** | Zero-waste glyphs for security | 1.13 KB | **257 B** | 230 B |
| **Glyphs Only: time (`time-only.min.css`)** | Zero-waste glyphs for time | 963 B | **218 B** | 187 B |
| **Glyphs Only: users (`users-only.min.css`)** | Zero-waste glyphs for users | 1.18 KB | **247 B** | 201 B |

### 4. Individual Tree-Shakeable Modules (No Webfont Required)

| Asset / Bundle | Target Description | Raw Size | Gzip Size | Brotli Size |
| :--- | :--- | :---: | :---: | :---: |
| **Standalone Vector SVG (`cart.svg`)** | Single vector icon asset | 2.72 KB | **858 B** | 773 B |
| **Tree-Shaken JS Module (`cart.js`)** | Individual icon JS metadata + path | 5.39 KB | **989 B** | 852 B |
| **Tree-Shaken React Component (`HiCart.js`)** | Individual React SVG component | 3.28 KB | **1.11 KB** | 971 B |
| **Tree-Shaken Vue Component (`HiCart.js`)** | Individual Vue 3 render component | 3.27 KB | **1.11 KB** | 993 B |

---

## 💡 Recommended Integration Strategies for Minimum Bundle Footprint

1. **For Modern SPA (React, Vue, Next.js, Vite)**:
   Import individual components:
   ```tsx
   import { HiCart, HiSearch } from 'haticons/react';
   // Total payload: ~1.5 KB gzipped, 0 KB font files!
   ```

2. **For Multi-Category Web Applications**:
   Load `core.min.css` once, then import only required category glyphs:
   ```html
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/haticons@1.0.2/dist/css/core.min.css">
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/haticons@1.0.2/dist/css/categories/commerce-only.min.css">
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/haticons@1.0.2/dist/css/categories/interface-only.min.css">
   ```

3. **For High-Traffic General Websites**:
   Use the compressed `haticons.min.css` and pre-connect your CDN:
   ```html
   <link rel="preload" href="https://cdn.jsdelivr.net/npm/haticons@1.0.2/dist/fonts/haticons.woff2" as="font" type="font/woff2" crossorigin>
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/haticons@1.0.2/dist/css/haticons.min.css">
   ```
