/**
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
