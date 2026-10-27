#!/usr/bin/env node
/**
 * build-haticons.js
 * Generates categorized SCSS, compiles all CSS bundles and minified versions,
 * outputs metadata, font assets, and exports.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

[DIST_DIR, DIST_CSS, DIST_CATEGORIES_CSS, DIST_FONTS, DIST_DATA, SCSS_DIR, SCSS_CATEGORIES].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Load icon dataset and deduplicate
const rawData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const seen = new Set();
const icons = [];
for (const item of rawData) {
  if (!seen.has(item.class)) {
    seen.add(item.class);
    icons.push(item);
  }
}

console.log(`Loaded ${icons.length} unique icons.`);

// Copy font files
const fontFiles = ['haticons.eot', 'haticons.svg', 'haticons.ttf', 'haticons.woff'];
fontFiles.forEach(file => {
  const src = path.join(FONTS_SRC, file);
  const dest = path.join(DIST_FONTS, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
});
console.log(`Copied ${fontFiles.length} font files to dist/fonts.`);

// Exact brands lookup
const BRAND_EXACT = new Set([
  'ad-block-plus', 'adobe', 'allo', 'amazon', 'amd', 'android', 'angellist', 'angular', 'appboxlab', 
  'apple', 'applemusic', 'archlinux', 'artstation', 'asana', 'at-and-t', 'atlassian', 'atom', 'aurelia', 
  'autotask', 'aws', 'azurepipelines', 'basecamp', 'behance', 'bing', 'bitbucket', 'bitly', 'blackberry', 
  'blender', 'book-my-show', 'bootstrap', 'bower', 'cakephp', 'campaignmonitor', 'chrome', 'cloudflare', 
  'coffeescript', 'conda-forge', 'coop', 'creative-cloud', 'css3', 'csswizardry', 'dailymotion', 'debian', 
  'dell', 'deno', 'dependabot', 'digg', 'digitalocean', 'dihadiwala', 'dream11', 'dribbble', 'drive', 
  'dropbox', 'duo', 'ebay', 'eclipseide', 'edge', 'elastic-cloud', 'eventbrite', 'evernote', 'everplaces', 
  'f-secure', 'facebook', 'favro', 'fedora', 'filezilla', 'finder', 'firefox', 'flutter', 'git', 'github', 
  'gitlab', 'gmail', 'gnu', 'gnusocial', 'google', 'google-assistant', 'google-plus', 'googlehangoutschat', 
  'grafana', 'gravatar', 'grofers', 'hackaday', 'hackster', 'hangout', 'haticons', 'hootsuite', 'html5', 
  'hubspot', 'icloud', 'iconjar', 'indane', 'inkscape', 'instagram', 'intel', 'internetexplorer', 'invision', 
  'ionic', 'jabber', 'javascript', 'jenkins', 'kadam', 'kaios', 'keybase', 'kibana', 'klout', 'kotlin', 
  'laravel', 'laravelhorizon', 'launchpad', 'letterboxd', 'letterboxd1', 'line', 'linewebtoon', 'linkedin', 
  'linuxmint', 'lucifer', 'magento', 'magisk', 'mailchimp', 'mailru', 'mastodon', 'mathworks', 'mediafire', 
  'medium', 'messenger', 'meteor', 'microblog', 'microgenetics', 'microsoft', 'microsoft-access', 
  'microsoft-one-note', 'microsoft-outlook', 'microsoft-power-point', 'microsoft-word', 'microsoftexcel', 
  'mixcloud', 'mysql', 'netflix', 'npm', 'odnoklassniki', 'ojook', 'ola-cabs', 'opensuse', 'pacman', 
  'pakpak', 'periscope', 'php', 'picasa', 'plangrid', 'play-station', 'player-dot-me', 'plugin', 'plurk', 
  'pocket', 'powershell', 'prismic', 'probot', 'processwire', 'producthunt', 'programmerindia', 'protonmail', 
  'python', 'reason', 'redbubble', 'reddit', 'redhat', 'redux', 'riot', 'ruby', 'runkeeper', 'rust', 
  'salesforce', 'samsung', 'sass', 'sega', 'shazam', 'shopify', 'sinaweibo', 'skyliner', 'skype', 'slack', 
  'soundcloud', 'sourceforge', 'spanchat', 'spotify', 'statamic', 'staticman', 'steam', 'steemit', 'stylus', 
  'superuser', 'support', 'suru', 'swarm', 'swift', 'swiggy', 'symfony', 'teamviewer', 'ted', 'teespring', 
  'tencentqq', 'tiktok', 'tinder-icon', 'todoist', 'toggl', 'tor', 'treehouse', 'trello', 'tumblr', 'tux', 
  'twilio', 'twitch', 'twitter', 'twitter-font', 'typescript', 'typo3', 'uber', 'uber-driver', 'uber-freight', 
  'ubuntu', 'udacity', 'udemy', 'unity', 'upwork', 'viadeo', 'viber-icon', 'vim', 'vimeo', 'vine', 
  'visualstudiocode', 'vk', 'vlcmediaplayer', 'vue-js', 'webstorm', 'wechat', 'whatsapp', 'wheniwork', 
  'wholensole', 'wikipedia', 'windows', 'wix', 'wordpress', 'xbox', 'xcode', 'xing', 'yammer', 'yandex', 
  'yarn', 'yash-raj', 'ycombinator', 'youtube-play', 'zendesk', 'zerply', 'zillow', 'zomato', 'zorin'
]);

const CATEGORY_META = {
  brands: { name: 'Brands & Social', description: 'Logos, tech stacks, social networks and services' },
  commerce: { name: 'Commerce & Payments', description: 'Shopping carts, bags, cards, and payment services' },
  communication: { name: 'Communication', description: 'Chat bubbles, mail, envelopes, and messaging' },
  devices: { name: 'Devices & Hardware', description: 'Monitors, phones, chips, storage, and appliances' },
  directional: { name: 'Directional & Arrows', description: 'Navigation chevrons, arrows, directions, and turns' },
  editor: { name: 'Editor & Formatting', description: 'Text alignment, lists, pens, markers, and tools' },
  feedback: { name: 'Feedback & Status', description: 'Alerts, checks, close, questions, and verification' },
  files: { name: 'Files & Folders', description: 'Documents, folders, archives, and attachments' },
  interface: { name: 'UI & Interface', description: 'Menus, controls, ratings, sliders, and general UI icons' },
  media: { name: 'Media & Audio', description: 'Play, pause, volume, cameras, music, and multimedia' },
  navigation: { name: 'Navigation & Places', description: 'Maps, pins, locations, cars, and vehicles' },
  security: { name: 'Security & Access', description: 'Locks, unlocks, keys, privacy, and restrictions' },
  time: { name: 'Time & Calendar', description: 'Clocks, dates, calendars, and alarms' },
  users: { name: 'Users & People', description: 'User avatars, teams, roles, and profiles' }
};

function classifyIcon(cls) {
  const c = cls.replace(/^hi-/, '');
  if (BRAND_EXACT.has(c)) return 'brands';
  if (['credit-card', 'credit-card1', 'cart', 'fill-bag', 'empty-bag', 'fat-bag', 'bean-bag', 'wallet', 'master-card', 'visa', 'paypal', 'paytm', 'applepay', 'googlepay', 'samsungpay', 'bitcoin', 'maestro'].includes(c)) return 'commerce';
  if (/arrow|chevron|turn-|next|previous/.test(c)) return 'directional';
  if (/play|music|camera|mic|volume|speaker|mute|video|presentation|game|gaming-console/.test(c)) return 'media';
  if (/file|folder|document|archive|paste|attachment/.test(c)) return 'files';
  if (/align-|list|edit|pencil|quotes|cut|copy|tag|paint-bucket|paintbox|marker/.test(c)) return 'editor';
  if (/monitor|hard-disk|sim_card|landline|phone|electric|power|washing-machine|robot|network/.test(c)) return 'devices';
  if (/chat|message|envelope|mail|paper-plane|speech-bubble|share/.test(c)) return 'communication';
  if (/user|users|profile|doctor|hand-index/.test(c)) return 'users';
  if (/map|location|pin|pinned|nav|compass|bus|car/.test(c)) return 'navigation';
  if (/lock|unlock|key|incognito|ban|block/.test(c)) return 'security';
  if (/clock|time|calendar|date|alarm/.test(c)) return 'time';
  if (/warning|info|help|question|check|cross|close|bell/.test(c)) return 'feedback';
  return 'interface';
}

// Group icons
const categorized = {};
Object.keys(CATEGORY_META).forEach(cat => { categorized[cat] = []; });

const enrichedIcons = icons.map(item => {
  const category = classifyIcon(item.class);
  const name = item.class.replace(/^hi-/, '');
  const enriched = {
    ...item,
    name,
    category
  };
  categorized[category].push(enriched);
  return enriched;
});

// Save enriched icons JSON & categorized JSON
fs.writeFileSync(path.join(DIST_DATA, 'icons.json'), JSON.stringify(enrichedIcons, null, 2));
fs.writeFileSync(path.join(DIST_DATA, 'categories.json'), JSON.stringify(CATEGORY_META, null, 2));
fs.writeFileSync(path.join(ROOT_DIR, 'code', 'data', 'icons.json'), JSON.stringify(enrichedIcons, null, 2));

console.log('Categories overview:');
Object.entries(categorized).forEach(([cat, list]) => {
  console.log(`  ${cat.padEnd(16)} : ${list.length} icons`);
});

// 1. Generate SCSS variables & core font-face
const varsScss = `// Haticons Variables
$hi-font-path: "../fonts" !default;
$hi-font-name: "haticons" !default;
$hi-font-version: "5zss7" !default;
$hi-prefix: "hi-" !default;
`;
fs.writeFileSync(path.join(SCSS_DIR, '_variables.scss'), varsScss);

const coreScss = `// Haticons Core & @font-face
@font-face {
  font-family: '#{$hi-font-name}';
  src: url('#{$hi-font-path}/haticons.eot?#{$hi-font-version}');
  src: url('#{$hi-font-path}/haticons.eot?#{$hi-font-version}#iefix') format('embedded-opentype'),
       url('#{$hi-font-path}/haticons.ttf?#{$hi-font-version}') format('truetype'),
       url('#{$hi-font-path}/haticons.woff?#{$hi-font-version}') format('woff'),
       url('#{$hi-font-path}/haticons.svg?#{$hi-font-version}#haticons') format('svg');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

[class^="#{$hi-prefix}"], [class*=" #{$hi-prefix}"] {
  font-family: '#{$hi-font-name}' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// Optional utility sizing & transforms
.#{$hi-prefix}lg { font-size: 1.33333em; line-height: 0.75em; vertical-align: -0.0667em; }
.#{$hi-prefix}2x { font-size: 2em; }
.#{$hi-prefix}3x { font-size: 3em; }
.#{$hi-prefix}4x { font-size: 4em; }
.#{$hi-prefix}5x { font-size: 5em; }
.#{$hi-prefix}fw { text-align: center; width: 1.25em; display: inline-block; }
.#{$hi-prefix}spin {
  animation: hi-spin 2s infinite linear;
  display: inline-block;
}
@keyframes hi-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(359deg); }
}
`;
fs.writeFileSync(path.join(SCSS_DIR, '_core.scss'), coreScss);

// 2. Generate category SCSS partial files (_cat.scss)
const categoryImports = [];
Object.entries(categorized).forEach(([cat, list]) => {
  let catScss = `// Haticons - Category: ${CATEGORY_META[cat].name} (${list.length} icons)\n`;
  list.forEach(icon => {
    // Escape backslash properly for content: "\xxxx"
    const contentVal = icon.content.startsWith('\\') ? icon.content : `\\${icon.content}`;
    catScss += `.${icon.class}:before { content: "${contentVal}"; }\n`;
  });

  const catFilePath = path.join(SCSS_CATEGORIES, `_${cat}.scss`);
  fs.writeFileSync(catFilePath, catScss);
  categoryImports.push(`@import "categories/${cat}";`);
});

// 3. Generate main haticons.scss
const mainScss = `// Haticons Full Bundle (${icons.length} icons)
@import "variables";
@import "core";

// Categories
${categoryImports.join('\n')}
`;
fs.writeFileSync(path.join(SCSS_DIR, 'haticons.scss'), mainScss);

console.log('Generated SCSS files successfully.');

// Compile SCSS using sass CLI
const SASS_BIN = path.join(ROOT_DIR, 'node_modules', '.bin', 'sass');
const CLEANCSS_BIN = path.join(ROOT_DIR, 'node_modules', '.bin', 'cleancss');

console.log('Compiling full haticons CSS...');
execSync(`"${SASS_BIN}" "${path.join(SCSS_DIR, 'haticons.scss')}" "${path.join(DIST_CSS, 'haticons.css')}" --no-source-map`, { stdio: 'inherit' });
execSync(`"${CLEANCSS_BIN}" -o "${path.join(DIST_CSS, 'haticons.min.css')}" "${path.join(DIST_CSS, 'haticons.css')}"`, { stdio: 'inherit' });

// Also compile core alone
const coreStandalone = `@import "variables";\n@import "core";\n`;
const coreScssFile = path.join(SCSS_DIR, '_core_standalone.scss');
fs.writeFileSync(coreScssFile, coreStandalone);
execSync(`"${SASS_BIN}" "${coreScssFile}" "${path.join(DIST_CSS, 'core.css')}" --no-source-map`, { stdio: 'inherit' });
execSync(`"${CLEANCSS_BIN}" -o "${path.join(DIST_CSS, 'core.min.css')}" "${path.join(DIST_CSS, 'core.css')}"`, { stdio: 'inherit' });
fs.unlinkSync(coreScssFile);

console.log('Compiling partial category CSS files...');
const TEMP_SCSS_DIR = path.join(ROOT_DIR, '.tmp_scss');
if (!fs.existsSync(TEMP_SCSS_DIR)) fs.mkdirSync(TEMP_SCSS_DIR, { recursive: true });

Object.keys(categorized).forEach(cat => {
  // Standalone bundle: includes variables, core font-face, and category icons
  const bundleContent = `@import "../scss/variables";\n@import "../scss/core";\n@import "../scss/categories/${cat}";\n`;
  const bundleFile = path.join(TEMP_SCSS_DIR, `bundle_${cat}.scss`);
  fs.writeFileSync(bundleFile, bundleContent);
  const destCss = path.join(DIST_CATEGORIES_CSS, `${cat}.css`);
  const destMinCss = path.join(DIST_CATEGORIES_CSS, `${cat}.min.css`);
  execSync(`"${SASS_BIN}" "${bundleFile}" "${destCss}" --no-source-map`, { stdio: 'inherit' });
  execSync(`"${CLEANCSS_BIN}" -o "${destMinCss}" "${destCss}"`, { stdio: 'inherit' });

  // Pure icon-only: includes variables and category icons only (no @font-face repeat)
  const pureContent = `@import "../scss/variables";\n@import "../scss/categories/${cat}";\n`;
  const pureFile = path.join(TEMP_SCSS_DIR, `pure_${cat}.scss`);
  fs.writeFileSync(pureFile, pureContent);
  const destPureCss = path.join(DIST_CATEGORIES_CSS, `${cat}-only.css`);
  const destPureMinCss = path.join(DIST_CATEGORIES_CSS, `${cat}-only.min.css`);
  execSync(`"${SASS_BIN}" "${pureFile}" "${destPureCss}" --no-source-map`, { stdio: 'inherit' });
  execSync(`"${CLEANCSS_BIN}" -o "${destPureMinCss}" "${destPureCss}"`, { stdio: 'inherit' });
});

// Clean up temp scss dir
fs.rmSync(TEMP_SCSS_DIR, { recursive: true, force: true });

// End of SCSS compilation

// Copy compiled full CSS to code/assets/css as well to keep legacy code updated
fs.copyFileSync(path.join(DIST_CSS, 'haticons.css'), path.join(ROOT_DIR, 'code', 'assets', 'css', 'haticons.css'));
if (fs.existsSync(path.join(DIST_CSS, 'haticons.min.css'))) {
  fs.copyFileSync(path.join(DIST_CSS, 'haticons.min.css'), path.join(ROOT_DIR, 'code', 'assets', 'css', 'haticons.min.css'));
}

// Generate CJS index.js for dist (packaged inside dist/ with dist/data)
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

// Generate root index.js (for local repo testing and direct require)
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
`;
fs.writeFileSync(path.join(DIST_DIR, 'index.d.ts'), dts);
fs.writeFileSync(path.join(ROOT_DIR, 'index.d.ts'), dts);

console.log('Generating code/index.html...');
require('./generate-html.js');

console.log('Generating code/reference.html...');
require('./generate-reference.js');

console.log('Build completed successfully!');
