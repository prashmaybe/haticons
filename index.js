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
