#!/usr/bin/env node
// bin/haticons.js - Haticons CLI Tool
// Commands:
//   haticons subset --icons=cart,heart,search --out=./custom-haticons
//   haticons scan   --src=./src --out=./haticons-subset
//   haticons list

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0] || 'help';

function parseFlags() {
  const flags = {};
  args.slice(1).forEach(arg => {
    if (arg.startsWith('--')) {
      const [k, v] = arg.slice(2).split('=');
      flags[k] = v || true;
    }
  });
  return flags;
}

const flags = parseFlags();
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'dist', 'data', 'icons.json');
const icons = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

if (command === 'list') {
  console.log(`Haticons v1.0.1 - ${icons.length} available icons:`);
  icons.forEach(i => console.log(`  - hi-${i.name} [${i.category}] (${i.content})`));
  process.exit(0);
}

if (command === 'subset') {
  const iconList = (flags.icons || '').split(',').map(s => s.trim().replace(/^hi-/, '')).filter(Boolean);
  if (iconList.length === 0) {
    console.error('Error: Please provide icons to subset. Example: npx haticons subset --icons=cart,heart,search --out=./subset');
    process.exit(1);
  }

  const outDir = path.resolve(process.cwd(), flags.out || './haticons-subset');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const matched = [];
  const svgDir = path.join(ROOT_DIR, 'dist', 'svg');

  iconList.forEach(name => {
    const icon = icons.find(i => i.name === name || i.class === 'hi-' + name);
    if (icon) {
      matched.push(icon);
      const svgSrc = path.join(svgDir, `${icon.name}.svg`);
      if (fs.existsSync(svgSrc)) {
        fs.copyFileSync(svgSrc, path.join(outDir, `${icon.name}.svg`));
      }
    } else {
      console.warn(`Warning: Icon "${name}" not found in catalogue.`);
    }
  });

  // Generate lightweight CSS for subset
  let css = `/* Custom Haticons Subset (${matched.length} icons) */\n`;
  matched.forEach(icon => {
    css += `.${icon.class}:before { content: "${icon.content}"; }\n`;
  });
  fs.writeFileSync(path.join(outDir, 'haticons-subset.css'), css);

  console.log(`\x1b[32m✔ Successfully created subset with ${matched.length} icons at:\x1b[0m ${outDir}`);
  console.log(`  - ${matched.length} standalone SVG files`);
  console.log(`  - haticons-subset.css (${(css.length / 1024).toFixed(2)} KB)`);
  process.exit(0);
}

if (command === 'scan') {
  const scanPattern = flags.src || './src';
  console.log(`Scanning project files in "${scanPattern}" for used "hi-*" classes...`);
  
  const foundIcons = new Set();
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const stat = fs.statSync(dir);
    if (stat.isFile()) {
      const content = fs.readFileSync(dir, 'utf8');
      const matches = content.matchAll(/hi-([a-z0-9_-]+)/g);
      for (const m of matches) {
        const name = m[1].replace(/-(fill|outline|sharp|duotone|spin|pulse|bounce|shake|sm|md|lg|xl|2x|3x|4x|5x|fw)$/, '');
        if (icons.some(i => i.name === name)) {
          foundIcons.add(name);
        }
      }
    } else if (stat.isDirectory() && !dir.includes('node_modules') && !dir.includes('.git') && !dir.includes('dist')) {
      fs.readdirSync(dir).forEach(file => walk(path.join(dir, file)));
    }
  }

  walk(path.resolve(process.cwd(), scanPattern));
  const list = [...foundIcons];
  console.log(`Found ${list.length} used Haticons: ${list.join(', ')}`);

  if (list.length > 0) {
    const outDir = path.resolve(process.cwd(), flags.out || './haticons-subset');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    let css = `/* Auto-Scanned Haticons Subset (${list.length} icons) */\n`;
    list.forEach(name => {
      const icon = icons.find(i => i.name === name);
      css += `.${icon.class}:before { content: "${icon.content}"; }\n`;
      const svgSrc = path.join(ROOT_DIR, 'dist', 'svg', `${icon.name}.svg`);
      if (fs.existsSync(svgSrc)) {
        fs.copyFileSync(svgSrc, path.join(outDir, `${icon.name}.svg`));
      }
    });
    fs.writeFileSync(path.join(outDir, 'haticons-subset.css'), css);
    console.log(`\x1b[32m✔ Auto-generated zero-waste subset in:\x1b[0m ${outDir}`);
  }
  process.exit(0);
}

// Help
console.log(`
Haticons CLI - Zero-Waste Icon Subsetting & Tooling

Usage:
  npx haticons subset --icons=cart,heart,search --out=./subset
  npx haticons scan   --src=./src --out=./subset
  npx haticons list
`);
