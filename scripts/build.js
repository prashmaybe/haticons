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
[DIST_DIR, DIST_CSS, DIST_CATEGORIES_CSS, DIST_FONTS, DIST_DATA, SCSS_DIR, SCSS_CATEGORIES].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 1. Load icon dataset and categorize
const rawData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const { icons, categorized, categories } = enrichIcons(rawData);
console.log(`Loaded ${icons.length} unique icons across ${Object.keys(categories).length} categories.`);

// Copy font assets
const fontFiles = ['haticons.eot', 'haticons.svg', 'haticons.ttf', 'haticons.woff'];
fontFiles.forEach(file => {
  const src = path.join(FONTS_SRC, file);
  const dest = path.join(DIST_FONTS, file);
  if (fs.existsSync(src)) fs.copyFileSync(src, dest);
});
console.log(`Copied ${fontFiles.length} font files to dist/fonts.`);

// Save enriched icons JSON & categorized metadata
fs.writeFileSync(path.join(DIST_DATA, 'icons.json'), JSON.stringify(icons, null, 2));
fs.writeFileSync(path.join(DIST_DATA, 'categories.json'), JSON.stringify(categories, null, 2));
fs.writeFileSync(path.join(ROOT_DIR, 'code', 'data', 'icons.json'), JSON.stringify(icons, null, 2));

console.log('Categories overview:');
Object.entries(categorized).forEach(([cat, list]) => {
  console.log(`  ${cat.padEnd(16)} : ${list.length} icons`);
});

// 2. Generate SCSS and compile CSS
generateScssFiles({ ROOT_DIR, SCSS_DIR, SCSS_CATEGORIES, categorized, categories, icons });
compileCssBundles({ ROOT_DIR, SCSS_DIR, DIST_CSS, DIST_CATEGORIES_CSS, categorized });

// 3. Generate npm module exports & TypeScript definition files
const distJsIndex = `/**
 * haticons - Modern SVG and Webfont Icon Pack by PebbleBenders
 */
const icons = require('./data/icons.json');
const categories = require('./data/categories.json');

module.exports = {
  icons,
  categories,
  getIcon(className) {
    return icons.find(i => i.class === className || i.name === className);
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

const icons = require(iconsPath);
const categories = require(categoriesPath);

module.exports = {
  icons,
  categories,
  getIcon(className) {
    return icons.find(i => i.class === className || i.name === className);
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
export declare function getIcon(className: string): Haticon | undefined;
export declare function getByCategory(category: string): Haticon[];

declare const _default: {
  icons: Haticon[];
  categories: Record<string, CategoryInfo>;
  getIcon: (className: string) => Haticon | undefined;
  getByCategory: (category: string) => Haticon[];
};
export default _default;
`;
fs.writeFileSync(path.join(DIST_DIR, 'index.d.ts'), dts);
fs.writeFileSync(path.join(ROOT_DIR, 'index.d.ts'), dts);

// 4. Generate HTML documentation & cheatsheets
console.log('Generating code/index.html...');
require('./generate-html.js');

console.log('Generating code/reference.html...');
require('./generate-reference.js');

console.log('Build completed successfully!');
