/**
 * SCSS Generator & CSS Compiler Module for Haticons
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function generateScssFiles({ ROOT_DIR, SCSS_DIR, SCSS_CATEGORIES, categorized, categories, icons, aliases = {} }) {
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
       url('#{$hi-font-path}/haticons.woff2?#{$hi-font-version}') format('woff2'),
       url('#{$hi-font-path}/haticons.woff?#{$hi-font-version}') format('woff'),
       url('#{$hi-font-path}/haticons.ttf?#{$hi-font-version}') format('truetype'),
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

// Style Variant Modifiers
.#{$hi-prefix}fill {
  font-weight: normal;
}
.#{$hi-prefix}outline {
  -webkit-text-stroke: 1.1px currentColor;
  paint-order: stroke fill;
}
.#{$hi-prefix}sharp {
  font-feature-settings: "ss01" on;
  letter-spacing: -0.05em;
  transform: scale(0.98);
  display: inline-block;
}
.#{$hi-prefix}duotone {
  opacity: var(--hi-duotone-opacity, 0.45);
  filter: drop-shadow(0 0 0.5px currentColor);
  display: inline-block;
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.85;
  }
}

// Optional utility sizing & transforms
.#{$hi-prefix}sm { font-size: 0.875em; }
.#{$hi-prefix}md { font-size: 1.15em; }
.#{$hi-prefix}lg { font-size: 1.33333em; line-height: 0.75em; vertical-align: -0.0667em; }
.#{$hi-prefix}xl { font-size: 1.75em; }
.#{$hi-prefix}2x { font-size: 2em; }
.#{$hi-prefix}3x { font-size: 3em; }
.#{$hi-prefix}4x { font-size: 4em; }
.#{$hi-prefix}5x { font-size: 5em; }
.#{$hi-prefix}fw { text-align: center; width: 1.25em; display: inline-block; }

// Animation Micro-interactions
.#{$hi-prefix}spin {
  animation: hi-spin 2s infinite linear;
  display: inline-block;
}
.#{$hi-prefix}pulse {
  animation: hi-pulse 1.6s infinite ease-in-out;
  display: inline-block;
}
.#{$hi-prefix}bounce {
  animation: hi-bounce 1.4s infinite ease-in-out;
  display: inline-block;
}
.#{$hi-prefix}shake {
  animation: hi-shake 0.8s infinite ease-in-out;
  display: inline-block;
}
.#{$hi-prefix}hover-rotate {
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  &:hover {
    transform: rotate(90deg) scale(1.1);
  }
}

@keyframes hi-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(359deg); }
}
@keyframes hi-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.82; }
}
@keyframes hi-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-22%); }
}
@keyframes hi-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-3px); }
  40%, 80% { transform: translateX(3px); }
}
`;
  fs.writeFileSync(path.join(SCSS_DIR, '_core.scss'), coreScss);

  // Invert aliases to easily find all aliases that target an icon name
  const targetToAliases = {};
  Object.entries(aliases).forEach(([aliasName, targetName]) => {
    if (!targetToAliases[targetName]) targetToAliases[targetName] = [];
    targetToAliases[targetName].push(aliasName);
  });

  // 2. Generate category SCSS partial files (_cat.scss)
  const categoryImports = [];
  Object.entries(categorized).forEach(([cat, list]) => {
    let catScss = `// Haticons - Category: ${categories[cat].name} (${list.length} icons)\n`;
    list.forEach(icon => {
      const contentVal = icon.content.startsWith('\\') ? icon.content : `\\${icon.content}`;
      const iconAliases = targetToAliases[icon.name] || [];
      const classSelectors = [
        `.${icon.class}:before`,
        `.${icon.class}-fill:before`,
        `.${icon.class}-outline:before`,
        `.${icon.class}-sharp:before`
      ];
      iconAliases.forEach(alias => {
        classSelectors.push(`.hi-${alias}:before`);
        classSelectors.push(`.hi-${alias}-fill:before`);
        classSelectors.push(`.hi-${alias}-outline:before`);
        classSelectors.push(`.hi-${alias}-sharp:before`);
      });
      catScss += `${classSelectors.join(',\n')} { content: "${contentVal}"; }\n`;
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
}

function generateLessFiles({ ROOT_DIR, LESS_DIR, LESS_CATEGORIES, categorized, categories, icons, aliases = {} }) {
  // 1. Generate LESS variables
  const varsLess = `// Haticons LESS Variables
@hi-font-path: "../fonts";
@hi-font-name: "haticons";
@hi-font-version: "5zss7";
@hi-prefix: ~"hi-";
`;
  fs.writeFileSync(path.join(LESS_DIR, 'variables.less'), varsLess);

  // 2. Generate LESS core font-face & utilities
  const coreLess = `// Haticons Core & @font-face
@font-face {
  font-family: '@{hi-font-name}';
  src: url('@{hi-font-path}/haticons.eot?@{hi-font-version}');
  src: url('@{hi-font-path}/haticons.eot?@{hi-font-version}#iefix') format('embedded-opentype'),
       url('@{hi-font-path}/haticons.woff2?@{hi-font-version}') format('woff2'),
       url('@{hi-font-path}/haticons.woff?@{hi-font-version}') format('woff'),
       url('@{hi-font-path}/haticons.ttf?@{hi-font-version}') format('truetype'),
       url('@{hi-font-path}/haticons.svg?@{hi-font-version}#haticons') format('svg');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

[class^="@{hi-prefix}"], [class*=" @{hi-prefix}"] {
  font-family: '@{hi-font-name}' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// Style Variant Modifiers
.@{hi-prefix}fill {
  font-weight: normal;
}
.@{hi-prefix}outline {
  -webkit-text-stroke: 1.1px currentColor;
  paint-order: stroke fill;
}
.@{hi-prefix}sharp {
  font-feature-settings: "ss01" on;
  letter-spacing: -0.05em;
  transform: scale(0.98);
  display: inline-block;
}
.@{hi-prefix}duotone {
  opacity: var(--hi-duotone-opacity, 0.45);
  filter: drop-shadow(0 0 0.5px currentColor);
  display: inline-block;
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.85;
  }
}

// Optional utility sizing & transforms
.@{hi-prefix}sm { font-size: 0.875em; }
.@{hi-prefix}md { font-size: 1.15em; }
.@{hi-prefix}lg { font-size: 1.33333em; line-height: 0.75em; vertical-align: -0.0667em; }
.@{hi-prefix}xl { font-size: 1.75em; }
.@{hi-prefix}2x { font-size: 2em; }
.@{hi-prefix}3x { font-size: 3em; }
.@{hi-prefix}4x { font-size: 4em; }
.@{hi-prefix}5x { font-size: 5em; }
.@{hi-prefix}fw { text-align: center; width: 1.25em; display: inline-block; }

// Animation Micro-interactions
.@{hi-prefix}spin {
  animation: hi-spin 2s infinite linear;
  display: inline-block;
}
.@{hi-prefix}pulse {
  animation: hi-pulse 1.6s infinite ease-in-out;
  display: inline-block;
}
.@{hi-prefix}bounce {
  animation: hi-bounce 1.4s infinite ease-in-out;
  display: inline-block;
}
.@{hi-prefix}shake {
  animation: hi-shake 0.8s infinite ease-in-out;
  display: inline-block;
}
.@{hi-prefix}hover-rotate {
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  &:hover {
    transform: rotate(90deg) scale(1.1);
  }
}

@keyframes hi-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(359deg); }
}
@keyframes hi-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.82; }
}
@keyframes hi-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-22%); }
}
@keyframes hi-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-3px); }
  40%, 80% { transform: translateX(3px); }
}
`;
  fs.writeFileSync(path.join(LESS_DIR, 'core.less'), coreLess);

  // Invert aliases to easily find all aliases that target an icon name
  const targetToAliases = {};
  Object.entries(aliases).forEach(([aliasName, targetName]) => {
    if (!targetToAliases[targetName]) targetToAliases[targetName] = [];
    targetToAliases[targetName].push(aliasName);
  });

  // 3. Generate category LESS files
  const categoryImports = [];
  Object.entries(categorized).forEach(([cat, list]) => {
    let catLess = `// Haticons - Category: ${categories[cat].name} (${list.length} icons)\n`;
    list.forEach(icon => {
      const contentVal = icon.content.startsWith('\\') ? icon.content : `\\${icon.content}`;
      const iconAliases = targetToAliases[icon.name] || [];
      const classSelectors = [
        `.${icon.class}:before`,
        `.${icon.class}-fill:before`,
        `.${icon.class}-outline:before`,
        `.${icon.class}-sharp:before`
      ];
      iconAliases.forEach(alias => {
        classSelectors.push(`.hi-${alias}:before`);
        classSelectors.push(`.hi-${alias}-fill:before`);
        classSelectors.push(`.hi-${alias}-outline:before`);
        classSelectors.push(`.hi-${alias}-sharp:before`);
      });
      catLess += `${classSelectors.join(',\n')} { content: "${contentVal}"; }\n`;
    });

    const catFilePath = path.join(LESS_CATEGORIES, `${cat}.less`);
    fs.writeFileSync(catFilePath, catLess);
    categoryImports.push(`@import "categories/${cat}.less";`);
  });

  // 4. Generate main haticons.less
  const mainLess = `// Haticons Full Bundle (${icons.length} icons) - LESS
@import "variables.less";
@import "core.less";

// Categories
${categoryImports.join('\n')}
`;
  fs.writeFileSync(path.join(LESS_DIR, 'haticons.less'), mainLess);
}

function compileCssBundles({ ROOT_DIR, SCSS_DIR, DIST_CSS, DIST_CATEGORIES_CSS, categorized }) {
  const SASS_BIN = path.join(ROOT_DIR, 'node_modules', '.bin', 'sass');
  const CLEANCSS_BIN = path.join(ROOT_DIR, 'node_modules', '.bin', 'cleancss');

  console.log('Compiling full haticons CSS...');
  execSync(`"${SASS_BIN}" "${path.join(SCSS_DIR, 'haticons.scss')}" "${path.join(DIST_CSS, 'haticons.css')}" --no-source-map --quiet-deps --silence-deprecation=import`, { stdio: 'inherit' });
  execSync(`"${CLEANCSS_BIN}" -o "${path.join(DIST_CSS, 'haticons.min.css')}" "${path.join(DIST_CSS, 'haticons.css')}"`, { stdio: 'inherit' });

  // Compile core alone
  const coreStandalone = `@import "variables";\n@import "core";\n`;
  const coreScssFile = path.join(SCSS_DIR, '_core_standalone.scss');
  fs.writeFileSync(coreScssFile, coreStandalone);
  execSync(`"${SASS_BIN}" "${coreScssFile}" "${path.join(DIST_CSS, 'core.css')}" --no-source-map --quiet-deps --silence-deprecation=import`, { stdio: 'inherit' });
  execSync(`"${CLEANCSS_BIN}" -o "${path.join(DIST_CSS, 'core.min.css')}" "${path.join(DIST_CSS, 'core.css')}"`, { stdio: 'inherit' });
  fs.unlinkSync(coreScssFile);

  console.log('Compiling partial category CSS files...');
  const TEMP_SCSS_DIR = path.join(ROOT_DIR, '.tmp_scss');
  if (!fs.existsSync(TEMP_SCSS_DIR)) fs.mkdirSync(TEMP_SCSS_DIR, { recursive: true });

  Object.keys(categorized).forEach(cat => {
    // Standalone bundle: includes variables, core font-face, and category icons
    const bundleContent = `$hi-font-path: "../../fonts";\n@import "../scss/variables";\n@import "../scss/core";\n@import "../scss/categories/${cat}";\n`;
    const bundleFile = path.join(TEMP_SCSS_DIR, `bundle_${cat}.scss`);
    fs.writeFileSync(bundleFile, bundleContent);
    const destCss = path.join(DIST_CATEGORIES_CSS, `${cat}.css`);
    const destMinCss = path.join(DIST_CATEGORIES_CSS, `${cat}.min.css`);
    execSync(`"${SASS_BIN}" "${bundleFile}" "${destCss}" --no-source-map --quiet-deps --silence-deprecation=import`, { stdio: 'inherit' });
    execSync(`"${CLEANCSS_BIN}" -o "${destMinCss}" "${destCss}"`, { stdio: 'inherit' });

    // Pure icon-only: includes variables and category icons only (no @font-face repeat)
    const pureContent = `@import "../scss/variables";\n@import "../scss/categories/${cat}";\n`;
    const pureFile = path.join(TEMP_SCSS_DIR, `pure_${cat}.scss`);
    fs.writeFileSync(pureFile, pureContent);
    const destPureCss = path.join(DIST_CATEGORIES_CSS, `${cat}-only.css`);
    const destPureMinCss = path.join(DIST_CATEGORIES_CSS, `${cat}-only.min.css`);
    execSync(`"${SASS_BIN}" "${pureFile}" "${destPureCss}" --no-source-map --quiet-deps --silence-deprecation=import`, { stdio: 'inherit' });
    execSync(`"${CLEANCSS_BIN}" -o "${destPureMinCss}" "${destPureCss}"`, { stdio: 'inherit' });
  });

  fs.rmSync(TEMP_SCSS_DIR, { recursive: true, force: true });

  // Sync to code/assets/css for website usage
  fs.copyFileSync(path.join(DIST_CSS, 'haticons.css'), path.join(ROOT_DIR, 'code', 'assets', 'css', 'haticons.css'));
  if (fs.existsSync(path.join(DIST_CSS, 'haticons.min.css'))) {
    fs.copyFileSync(path.join(DIST_CSS, 'haticons.min.css'), path.join(ROOT_DIR, 'code', 'assets', 'css', 'haticons.min.css'));
  }
  if (fs.existsSync(path.join(DIST_CSS, 'core.css'))) {
    fs.copyFileSync(path.join(DIST_CSS, 'core.css'), path.join(ROOT_DIR, 'code', 'assets', 'css', 'core.css'));
  }
  if (fs.existsSync(path.join(DIST_CSS, 'core.min.css'))) {
    fs.copyFileSync(path.join(DIST_CSS, 'core.min.css'), path.join(ROOT_DIR, 'code', 'assets', 'css', 'core.min.css'));
  }

  const codeCategoriesCss = path.join(ROOT_DIR, 'code', 'assets', 'css', 'categories');
  if (!fs.existsSync(codeCategoriesCss)) {
    fs.mkdirSync(codeCategoriesCss, { recursive: true });
  }
  if (fs.existsSync(DIST_CATEGORIES_CSS)) {
    fs.readdirSync(DIST_CATEGORIES_CSS).forEach(file => {
      fs.copyFileSync(path.join(DIST_CATEGORIES_CSS, file), path.join(codeCategoriesCss, file));
    });
  }
}

module.exports = {
  generateScssFiles,
  generateLessFiles,
  compileCssBundles
};
