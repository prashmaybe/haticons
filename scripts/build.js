#!/usr/bin/env node
/**
 * build.js - Master Orchestrator for Haticons
 * Coordinates data enrichment, asset copies, SCSS generation, CSS compilation,
 * TypeScript definitions, and HTML pages.
 */

const fs = require('fs');
const path = require('path');
const { enrichIcons } = require('./categories.js');
const { generateScssFiles, compileCssBundles } = require('./compiler.js');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'code', 'data', 'icons.json');
const FONTS_SRC = path.join(ROOT_DIR, 'code', 'assets', 'fonts');

const DIST_DIR = path.join(ROOT_DIR, 'dist');
const DIST_CSS = path.join(DIST_DIR, 'css');
const DIST_CATEGORIES_CSS = path.join(DIST_CSS, 'categories');
const DIST_FONTS = path.join(DIST_DIR, 'fonts');
const DIST_DATA = path.join(DIST_DIR, 'data');

const SCSS_DIR = path.join(ROOT_DIR, 'scss');
const SCSS_CATEGORIES = path.join(SCSS_DIR, 'categories');

// Ensure output directories exist
const DIST_SVG = path.join(DIST_DIR, 'svg');
const DIST_ICONS = path.join(DIST_DIR, 'icons');
[DIST_DIR, DIST_CSS, DIST_CATEGORIES_CSS, DIST_FONTS, DIST_DATA, DIST_SVG, DIST_ICONS, SCSS_DIR, SCSS_CATEGORIES].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 1. Load icon dataset and categorize
const rawData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const { icons, categorized, categories, aliases } = enrichIcons(rawData);
console.log(`Loaded ${icons.length} unique icons across ${Object.keys(categories).length} categories with ${Object.keys(aliases).length} backward-compatible aliases.`);

// Parse SVG font to extract glyph path definitions
const svgFontContent = fs.readFileSync(path.join(FONTS_SRC, 'haticons.svg'), 'utf-8');
const glyphRe = /<glyph\s+([^>]+)>/g;
let m;
const glyphPaths = {};
while ((m = glyphRe.exec(svgFontContent)) !== null) {
  const attr = m[1];
  const nameM = attr.match(/glyph-name="([^"]+)"/);
  const dM = attr.match(/d="([^"]*)"/);
  if (nameM && dM && dM[1]) {
    glyphPaths[nameM[1]] = dM[1];
  }
}
console.log(`Parsed ${Object.keys(glyphPaths).length} vector SVG paths from font.`);

// Generate standalone SVG files & individual JS/TS icon modules for tree-shaking
let svgGeneratedCount = 0;
icons.forEach(icon => {
  const d = glyphPaths[icon.name] || '';
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="24" height="24" fill="currentColor">
  <g transform="scale(1, -1) translate(0, -960)">
    <path d="${d}" />
  </g>
</svg>`;
  fs.writeFileSync(path.join(DIST_SVG, `${icon.name}.svg`), svgContent);

  // Individual JS module (CommonJS + ESM)
  const iconJs = `module.exports = {
  name: ${JSON.stringify(icon.name)},
  class: ${JSON.stringify(icon.class)},
  category: ${JSON.stringify(icon.category)},
  content: ${JSON.stringify(icon.content)},
  path: ${JSON.stringify(d)},
  svg: ${JSON.stringify(svgContent)}
};
`;
  const iconMjs = `export const name = ${JSON.stringify(icon.name)};
export const className = ${JSON.stringify(icon.class)};
export const category = ${JSON.stringify(icon.category)};
export const content = ${JSON.stringify(icon.content)};
export const path = ${JSON.stringify(d)};
export const svg = ${JSON.stringify(svgContent)};
export default { name, class: className, category, content, path, svg };
`;
  const iconDts = `export declare const name: string;
export declare const className: string;
export declare const category: string;
export declare const content: string;
export declare const path: string;
export declare const svg: string;
declare const _default: {
  name: string;
  class: string;
  category: string;
  content: string;
  path: string;
  svg: string;
};
export default _default;
`;
  fs.writeFileSync(path.join(DIST_ICONS, `${icon.name}.js`), iconJs);
  fs.writeFileSync(path.join(DIST_ICONS, `${icon.name}.mjs`), iconMjs);
  fs.writeFileSync(path.join(DIST_ICONS, `${icon.name}.d.ts`), iconDts);
  svgGeneratedCount++;
});

// Also create alias SVG files and icon modules so imports like `haticons/icons/snapchat` work smoothly
Object.entries(aliases).forEach(([aliasName, targetName]) => {
  const targetIcon = icons.find(i => i.name === targetName);
  if (targetIcon) {
    const d = glyphPaths[targetName] || '';
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="24" height="24" fill="currentColor">
  <g transform="scale(1, -1) translate(0, -960)">
    <path d="${d}" />
  </g>
</svg>`;
    fs.writeFileSync(path.join(DIST_SVG, `${aliasName}.svg`), svgContent);

    const aliasJs = `module.exports = {
  name: ${JSON.stringify(aliasName)},
  class: ${JSON.stringify(`hi-${aliasName}`)},
  category: ${JSON.stringify(targetIcon.category)},
  content: ${JSON.stringify(targetIcon.content)},
  path: ${JSON.stringify(d)},
  svg: ${JSON.stringify(svgContent)},
  target: ${JSON.stringify(targetName)}
};
`;
    const aliasMjs = `export const name = ${JSON.stringify(aliasName)};
export const className = ${JSON.stringify(`hi-${aliasName}`)};
export const category = ${JSON.stringify(targetIcon.category)};
export const content = ${JSON.stringify(targetIcon.content)};
export const path = ${JSON.stringify(d)};
export const svg = ${JSON.stringify(svgContent)};
export const target = ${JSON.stringify(targetName)};
export default { name, class: className, category, content, path, svg, target };
`;
    const aliasDts = `export declare const name: string;
export declare const className: string;
export declare const category: string;
export declare const content: string;
export declare const path: string;
export declare const svg: string;
export declare const target: string;
declare const _default: {
  name: string;
  class: string;
  category: string;
  content: string;
  path: string;
  svg: string;
  target: string;
};
export default _default;
`;
    fs.writeFileSync(path.join(DIST_ICONS, `${aliasName}.js`), aliasJs);
    fs.writeFileSync(path.join(DIST_ICONS, `${aliasName}.mjs`), aliasMjs);
    fs.writeFileSync(path.join(DIST_ICONS, `${aliasName}.d.ts`), aliasDts);
  }
});
console.log(`Generated ${svgGeneratedCount} individual SVG files and tree-shakeable icon modules (with ${Object.keys(aliases).length} alias modules).`);

// Copy & generate font assets (including ultra-compact WOFF2)
const fontFiles = ['haticons.eot', 'haticons.svg', 'haticons.ttf', 'haticons.woff'];
fontFiles.forEach(file => {
  const src = path.join(FONTS_SRC, file);
  const dest = path.join(DIST_FONTS, file);
  if (fs.existsSync(src)) fs.copyFileSync(src, dest);
});

// Generate WOFF2 font
try {
  const woff2 = require('woff2');
  const ttfBuffer = fs.readFileSync(path.join(FONTS_SRC, 'haticons.ttf'));
  const woff2Buffer = woff2.encode(ttfBuffer);
  fs.writeFileSync(path.join(DIST_FONTS, 'haticons.woff2'), woff2Buffer);
  fs.writeFileSync(path.join(FONTS_SRC, 'haticons.woff2'), woff2Buffer);
  console.log(`Generated ultra-compact WOFF2 font (${(woff2Buffer.length / 1024).toFixed(1)} KB)`);
} catch (err) {
  console.warn('woff2 generation skipped:', err.message);
}
console.log(`Copied and prepared font files in dist/fonts.`);

// Save enriched icons JSON, aliases, & categorized metadata (compact minified)
fs.writeFileSync(path.join(DIST_DATA, 'icons.json'), JSON.stringify(icons));
fs.writeFileSync(path.join(DIST_DATA, 'categories.json'), JSON.stringify(categories));
fs.writeFileSync(path.join(DIST_DATA, 'aliases.json'), JSON.stringify(aliases));
fs.writeFileSync(path.join(ROOT_DIR, 'code', 'data', 'icons.json'), JSON.stringify(icons, null, 2));

console.log('Categories overview:');
Object.entries(categorized).forEach(([cat, list]) => {
  console.log(`  ${cat.padEnd(16)} : ${list.length} icons`);
});

// 2. Generate SCSS and compile CSS
generateScssFiles({ ROOT_DIR, SCSS_DIR, SCSS_CATEGORIES, categorized, categories, icons, aliases });
compileCssBundles({ ROOT_DIR, SCSS_DIR, DIST_CSS, DIST_CATEGORIES_CSS, categorized });

// 3. Generate npm module exports & TypeScript definition files
const distJsIndex = `/**
 * haticons - Modern SVG and Webfont Icon Pack by PebbleBenders
 */
const icons = require('./data/icons.json');
const categories = require('./data/categories.json');
const aliases = require('./data/aliases.json');

module.exports = {
  icons,
  categories,
  aliases,
  getIcon(className) {
    const raw = className.replace(/^hi-/, '');
    const resolvedName = aliases[raw] || raw;
    return icons.find(i => i.class === className || i.name === className || i.name === resolvedName || i.class === 'hi-' + resolvedName);
  },
  getByCategory(category) {
    return icons.filter(i => i.category === category);
  }
};
`;
fs.writeFileSync(path.join(DIST_DIR, 'index.js'), distJsIndex);

const distMjsIndex = `/**
 * haticons - Modern SVG and Webfont Icon Pack by PebbleBenders (ESM)
 */
import cjs from './index.js';

export const icons = cjs.icons;
export const categories = cjs.categories;
export const aliases = cjs.aliases;
export const getIcon = cjs.getIcon;
export const getByCategory = cjs.getByCategory;

export default cjs;
`;
fs.writeFileSync(path.join(DIST_DIR, 'index.mjs'), distMjsIndex);

const rootJsIndex = `/**
 * haticons - Modern SVG and Webfont Icon Pack by PebbleBenders
 */
const fs = require('fs');
const path = require('path');

let iconsPath = path.join(__dirname, 'dist', 'data', 'icons.json');
if (!fs.existsSync(iconsPath)) {
  iconsPath = path.join(__dirname, 'data', 'icons.json');
}
let categoriesPath = path.join(__dirname, 'dist', 'data', 'categories.json');
if (!fs.existsSync(categoriesPath)) {
  categoriesPath = path.join(__dirname, 'data', 'categories.json');
}
let aliasesPath = path.join(__dirname, 'dist', 'data', 'aliases.json');
if (!fs.existsSync(aliasesPath)) {
  aliasesPath = path.join(__dirname, 'data', 'aliases.json');
}

const icons = require(iconsPath);
const categories = require(categoriesPath);
const aliases = fs.existsSync(aliasesPath) ? require(aliasesPath) : {};

module.exports = {
  icons,
  categories,
  aliases,
  getIcon(className) {
    const raw = className.replace(/^hi-/, '');
    const resolvedName = aliases[raw] || raw;
    return icons.find(i => i.class === className || i.name === className || i.name === resolvedName || i.class === 'hi-' + resolvedName);
  },
  getByCategory(category) {
    return icons.filter(i => i.category === category);
  }
};
`;
fs.writeFileSync(path.join(ROOT_DIR, 'index.js'), rootJsIndex);

const rootMjsIndex = `/**
 * haticons - Modern SVG and Webfont Icon Pack by PebbleBenders (ESM)
 */
import cjs from './index.js';

export const icons = cjs.icons;
export const categories = cjs.categories;
export const aliases = cjs.aliases;
export const getIcon = cjs.getIcon;
export const getByCategory = cjs.getByCategory;

export default cjs;
`;
fs.writeFileSync(path.join(ROOT_DIR, 'index.mjs'), rootMjsIndex);

const dts = `export interface Haticon {
  class: string;
  name: string;
  content: string;
  category: string;
}

export interface CategoryInfo {
  name: string;
  description: string;
}

export declare const icons: Haticon[];
export declare const categories: Record<string, CategoryInfo>;
export declare const aliases: Record<string, string>;
export declare function getIcon(className: string): Haticon | undefined;
export declare function getByCategory(category: string): Haticon[];

declare const _default: {
  icons: Haticon[];
  categories: Record<string, CategoryInfo>;
  aliases: Record<string, string>;
  getIcon: (className: string) => Haticon | undefined;
  getByCategory: (category: string) => Haticon[];
};
export default _default;
`;
fs.writeFileSync(path.join(DIST_DIR, 'index.d.ts'), dts);
fs.writeFileSync(path.join(ROOT_DIR, 'index.d.ts'), dts);

// 4. Generate HTML documentation
console.log('Generating code/index.html...');
require('./generate-html.js');

console.log('Generating code/reference.html...');
require('./generate-reference.js');

console.log('Generating legal pages (terms, privacy, license)...');
require('./generate-legal.js');

console.log('Build completed successfully!');
