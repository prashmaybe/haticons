/**
 * SCSS Generator & CSS Compiler Module for Haticons
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function generateScssFiles({ ROOT_DIR, SCSS_DIR, SCSS_CATEGORIES, categorized, categories, icons }) {
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
    let catScss = `// Haticons - Category: ${categories[cat].name} (${list.length} icons)\n`;
    list.forEach(icon => {
      const contentVal = icon.content.startsWith('\\') ? icon.content : `\\${icon.content}`;
      catScss += `.${icon.class}:before,\n.${icon.class}-fill:before,\n.${icon.class}-outline:before,\n.${icon.class}-sharp:before { content: "${contentVal}"; }\n`;
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
    const bundleContent = `@import "../scss/variables";\n@import "../scss/core";\n@import "../scss/categories/${cat}";\n`;
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
}

module.exports = {
  generateScssFiles,
  compileCssBundles
};
