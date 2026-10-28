const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const htmlFiles = ['index.html', 'tutorial.html', 'reference.html', 'changelogs.html', 'terms.html', 'privacy.html', 'license.html'];
const issues = [];

htmlFiles.forEach(file => {
  const filePath = path.join(ROOT_DIR, 'code', file);
  if (!fs.existsSync(filePath)) {
    issues.push('Missing file: ' + file);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check hrefs
  const hrefMatches = content.match(/href="([^"#]+)"/g) || [];
  hrefMatches.forEach(m => {
    const h = m.slice(6, -1);
    if (h.startsWith('http://') || h.startsWith('https://') || h.startsWith('mailto:')) return;
    if (h === '/' || h === '') return;
    const clean = h.split('?')[0];
    const targetPath = path.join(ROOT_DIR, 'code', clean.startsWith('/') ? clean.slice(1) : clean);
    if (!fs.existsSync(targetPath)) {
      issues.push(file + ' broken link -> ' + h);
    }
  });

  // Check srcs
  const srcMatches = content.match(/src="([^"#]+)"/g) || [];
  srcMatches.forEach(m => {
    const s = m.slice(5, -1);
    if (s.startsWith('http://') || s.startsWith('https://')) return;
    const clean = s.split('?')[0];
    const targetPath = path.join(ROOT_DIR, 'code', clean.startsWith('/') ? clean.slice(1) : clean);
    if (!fs.existsSync(targetPath)) {
      issues.push(file + ' broken script/img -> ' + s);
    }
  });
});

if (issues.length) {
  console.error('Validation issues found:\n' + issues.join('\n'));
  process.exit(1);
} else {
  console.log('SUCCESS: All internal links and resources in HTML files exist!');
}
