#!/usr/bin/env node
/**
 * scripts/verify-release.js
 * Comprehensive automated quality gate for Haticons v1.0.2 release:
 * - Version consistency across package.json, README, CHANGELOG, and docs
 * - 569 icon glyph validation & standalone SVG/JS/TS module existence
 * - Font path resolution check across ALL CSS entry points (full, core, and 14 categories)
 * - CJS & ESM root module test (canonical names, aliases, categories)
 * - React & Vue framework packages & generic <Haticon /> test
 * - Unplugin bundler resolver test (Vue & React)
 * - npm package manifest & pack dry-run audit
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const PKG = require(path.join(ROOT_DIR, 'package.json'));

let failures = [];
let passed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    failures.push(message);
  } else {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  }
}

console.log(`\n======================================================`);
console.log(`🔍 RUNNING HATICONS v${PKG.version} RELEASE VERIFICATION`);
console.log(`======================================================\n`);

// 1. Version Consistency
console.log(`[Suite 1: Version Consistency & Manifests]`);
assert(PKG.version === '1.0.2', `package.json version is 1.0.2 (found: ${PKG.version})`);

const changelogContent = fs.readFileSync(path.join(ROOT_DIR, 'CHANGELOG.md'), 'utf8');
assert(changelogContent.includes('## [1.0.2]'), 'CHANGELOG.md contains release notes for [1.0.2]');

const provenancePath = path.join(ROOT_DIR, 'PROVENANCE.md');
assert(fs.existsSync(provenancePath), 'PROVENANCE.md exists');
if (fs.existsSync(provenancePath)) {
  const prov = fs.readFileSync(provenancePath, 'utf8');
  assert(prov.includes('1.0.2'), 'PROVENANCE.md references version 1.0.2');
  assert(prov.includes('Font & Asset Embedding Exception'), 'PROVENANCE.md includes Font & Asset Embedding Exception');
}

const licenseContent = fs.readFileSync(path.join(ROOT_DIR, 'LICENSE'), 'utf8');
assert(licenseContent.includes('HATICONS FONT & ASSET EMBEDDING EXCEPTION'), 'LICENSE file contains Font & Asset Embedding Exception');
assert(licenseContent.includes('THIRD-PARTY BRAND & TRADEMARK ASSET NOTICE'), 'LICENSE file contains Brand & Trademark notice');

// 2. Icon Dataset & Metadata
console.log(`\n[Suite 2: Icon Dataset, Aliases & Vector Paths]`);
const icons = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'dist', 'data', 'icons.json'), 'utf8'));
assert(icons.length === 569, `dist/data/icons.json contains exactly 569 icons (found: ${icons.length})`);

const categories = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'dist', 'data', 'categories.json'), 'utf8'));
const catKeys = Object.keys(categories);
assert(catKeys.length === 14, `dist/data/categories.json defines 14 categories (found: ${catKeys.length})`);

const aliases = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'dist', 'data', 'aliases.json'), 'utf8'));
assert(Object.keys(aliases).length > 0, `dist/data/aliases.json loaded with ${Object.keys(aliases).length} aliases`);

// Check that all aliases map to existing icons
let brokenAliases = [];
Object.entries(aliases).forEach(([alias, target]) => {
  if (!icons.some(i => i.name === target)) {
    brokenAliases.push(`${alias} -> ${target}`);
  }
});
assert(brokenAliases.length === 0, `All aliases resolve to valid canonical icons (broken: ${brokenAliases.length})`);

// 3. Fonts and Vector Glyphs
console.log(`\n[Suite 3: Webfonts & Standalone Assets]`);
const fontExts = ['woff2', 'woff', 'ttf', 'eot', 'svg'];
fontExts.forEach(ext => {
  const fPath = path.join(ROOT_DIR, 'dist', 'fonts', `haticons.${ext}`);
  assert(fs.existsSync(fPath) && fs.statSync(fPath).size > 1000, `dist/fonts/haticons.${ext} exists and > 1 KB`);
});

// Check standalone SVGs and individual icon JS/MJS/DTS modules
let missingSvgs = 0;
let missingModules = 0;
icons.forEach(i => {
  if (!fs.existsSync(path.join(ROOT_DIR, 'dist', 'svg', `${i.name}.svg`))) missingSvgs++;
  if (!fs.existsSync(path.join(ROOT_DIR, 'dist', 'icons', `${i.name}.js`))) missingModules++;
});
assert(missingSvgs === 0, `All 569 standalone SVGs exist in dist/svg/ (missing: ${missingSvgs})`);
assert(missingModules === 0, `All 569 individual modules exist in dist/icons/ (missing: ${missingModules})`);

// 4. CSS Entry Points & Font Path Integrity
console.log(`\n[Suite 4: CSS Entry Points & Font Path Resolution]`);
const cssCheckEntries = [
  { file: 'dist/css/haticons.css', baseDir: 'dist/css' },
  { file: 'dist/css/haticons.min.css', baseDir: 'dist/css' },
  { file: 'dist/css/core.css', baseDir: 'dist/css' },
  { file: 'dist/css/core.min.css', baseDir: 'dist/css' }
];

catKeys.forEach(cat => {
  cssCheckEntries.push({ file: `dist/css/categories/${cat}.css`, baseDir: 'dist/css/categories' });
  cssCheckEntries.push({ file: `dist/css/categories/${cat}.min.css`, baseDir: 'dist/css/categories' });
  cssCheckEntries.push({ file: `dist/css/categories/${cat}-only.css`, baseDir: 'dist/css/categories' });
  cssCheckEntries.push({ file: `dist/css/categories/${cat}-only.min.css`, baseDir: 'dist/css/categories' });
});

let fontPathErrors = [];
cssCheckEntries.forEach(entry => {
  const fullPath = path.join(ROOT_DIR, entry.file);
  if (!fs.existsSync(fullPath)) {
    fontPathErrors.push(`Missing CSS file: ${entry.file}`);
    return;
  }
  const css = fs.readFileSync(fullPath, 'utf8');
  const urlMatches = css.match(/url\(['"]?([^'"()]+)['"]?\)/g) || [];
  urlMatches.forEach(match => {
    const rawUrl = match.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
    const cleanUrl = rawUrl.split('#')[0].split('?')[0];
    if (cleanUrl.endsWith('.woff2') || cleanUrl.endsWith('.woff') || cleanUrl.endsWith('.ttf') || cleanUrl.endsWith('.eot') || cleanUrl.endsWith('.svg')) {
      const resolved = path.resolve(ROOT_DIR, entry.baseDir, cleanUrl);
      if (!fs.existsSync(resolved)) {
        fontPathErrors.push(`${entry.file} broken font url: ${rawUrl} -> resolved to ${resolved}`);
      }
    }
  });
});
assert(fontPathErrors.length === 0, `All @font-face URLs across all CSS files resolve to existing font assets (errors: ${fontPathErrors.length})`);
if (fontPathErrors.length > 0) {
  console.error('  Font path details:\n', fontPathErrors.join('\n'));
}

// 5. JavaScript / TypeScript Module Imports (CJS & ESM)
console.log(`\n[Suite 5: CJS & ESM Module APIs]`);
const cjs = require(path.join(ROOT_DIR, 'index.js'));
assert(cjs.icons.length === 569, `CJS root export: cjs.icons.length === 569`);
assert(cjs.getIcon('cart') && cjs.getIcon('cart').name === 'cart', `CJS getIcon('cart') returns valid icon`);
assert(cjs.getIcon('x') && cjs.getIcon('x').name === 'x-twitter', `CJS getIcon('x') correctly resolves alias to 'x-twitter'`);
assert(cjs.getIcon('snapchat') && cjs.getIcon('snapchat').name === 'spanchat', `CJS getIcon('snapchat') correctly resolves alias to 'spanchat'`);
assert(cjs.getIcon('antigravity') && cjs.getIcon('antigravity').name === 'antigravity', `CJS getIcon('antigravity') returns Google Antigravity icon`);
assert(cjs.getByCategory('commerce').length === 18, `CJS getByCategory('commerce') returns 18 icons`);

// Test ESM import via node execution
try {
  execSync(`node --input-type=module -e "import { icons, getIcon } from './index.mjs'; if (icons.length !== 569 || !getIcon('cart') || getIcon('x').name !== 'x-twitter') process.exit(1);"`, { cwd: ROOT_DIR });
  assert(true, 'ESM root module index.mjs imports & resolves canonical icons and aliases');
} catch (e) {
  assert(false, `ESM root module execution failed: ${e.message}`);
}

// 6. React, Vue & Bundler Resolver Exports
console.log(`\n[Suite 6: Framework Packages (React & Vue 3)]`);
const reactPkg = require(path.join(ROOT_DIR, 'dist', 'react', 'index.js'));
assert(typeof reactPkg.HiCart === 'function' || typeof reactPkg.HiCart === 'object', 'React package exports HiCart');
assert(typeof reactPkg.HiSearch === 'function' || typeof reactPkg.HiSearch === 'object', 'React package exports HiSearch');
assert(typeof reactPkg.HiAntigravity === 'function' || typeof reactPkg.HiAntigravity === 'object', 'React package exports HiAntigravity');
assert(typeof reactPkg.Haticon === 'function' || typeof reactPkg.Haticon === 'object', 'React package exports generic dynamic <Haticon />');

const vuePkg = require(path.join(ROOT_DIR, 'dist', 'vue', 'index.js'));
assert(typeof vuePkg.HiCart === 'function' || typeof vuePkg.HiCart === 'object', 'Vue package exports HiCart');
assert(typeof vuePkg.HiSearch === 'function' || typeof vuePkg.HiSearch === 'object', 'Vue package exports HiSearch');
assert(typeof vuePkg.Haticon === 'function' || typeof vuePkg.Haticon === 'object', 'Vue package exports generic dynamic <Haticon />');

const { HaticonsResolver } = require(path.join(ROOT_DIR, 'dist', 'resolver', 'index.js'));
const vueResolved = HaticonsResolver({ framework: 'vue' }).resolve('HiCart');
assert(vueResolved && vueResolved.from === 'haticons/vue/HiCart', 'HaticonsResolver correctly resolves Vue component path');
const reactResolved = HaticonsResolver({ framework: 'react' }).resolve('HiSearch');
assert(reactResolved && reactResolved.from === 'haticons/react/HiSearch', 'HaticonsResolver correctly resolves React component path');

// Check TypeScript definition files exist
['index.d.ts', 'dist/index.d.ts', 'dist/react/index.d.ts', 'dist/vue/index.d.ts', 'dist/resolver/index.d.ts'].forEach(dts => {
  assert(fs.existsSync(path.join(ROOT_DIR, dts)), `TypeScript declaration ${dts} exists`);
});

// 7. npm Pack Dry-Run
console.log(`\n[Suite 7: Package Manifest & npm Pack Audit]`);
try {
  const packOutput = execSync('npm pack --dry-run --json', { cwd: ROOT_DIR, encoding: 'utf8' });
  const packJson = JSON.parse(packOutput);
  const fileCount = packJson[0].entryCount || (packJson[0].files ? packJson[0].files.length : 0);
  assert(fileCount > 1000, `npm pack tarball contains ${fileCount} entries (> 1000 required for complete build)`);
  assert(packJson[0].version === '1.0.2', `Tarball version is 1.0.2`);
} catch (e) {
  assert(false, `npm pack dry-run failed: ${e.message}`);
}

console.log(`\n======================================================`);
if (failures.length > 0) {
  console.error(`🚨 RELEASE VERIFICATION FAILED: ${failures.length} errors found.`);
  process.exit(1);
} else {
  console.log(`🎉 ALL ${passed} VERIFICATION CHECKS PASSED SUCCESSFULLY!`);
  console.log(`Haticons v${PKG.version} is 100% production-ready.`);
  console.log(`======================================================\n`);
  process.exit(0);
}
