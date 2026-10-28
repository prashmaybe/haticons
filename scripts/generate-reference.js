const fs = require('fs');
const path = require('path');
const {
  ROOT_DIR,
  loadIcons,
  loadCategories,
  getHtmlHead,
  getAnnouncementBar,
  getNavbar,
  getFooter,
  getToast
} = require('./template.js');

const icons = loadIcons();
const categories = loadCategories();
const { ICON_ALIASES } = require('./categories.js');

// Invert aliases for easy lookup by target name
const targetToAliases = {};
Object.entries(ICON_ALIASES).forEach(([aliasName, targetName]) => {
  if (!targetToAliases[targetName]) targetToAliases[targetName] = [];
  targetToAliases[targetName].push(aliasName);
});

// Group icons by category
const catGroups = {};
Object.keys(categories).forEach(cat => {
  catGroups[cat] = [];
});
icons.forEach(i => {
  const c = i.category || 'interface';
  if (!catGroups[c]) catGroups[c] = [];
  catGroups[c].push(i);
});

let categoryRowsHtml = '';
Object.keys(categories).sort().forEach(catKey => {
  const meta = categories[catKey];
  const list = catGroups[catKey] || [];

  let iconsListHtml = '';
  list.forEach(item => {
    const itemAliases = targetToAliases[item.name] || [];
    const searchTerms = [item.name, item.class, ...itemAliases].join(' ');
    const aliasBadge = itemAliases.length > 0 
      ? `<span class="badge bg-light text-muted border text-2xs rounded-pill" title="Canonical alias: ${itemAliases.map(a => 'hi-' + a).join(', ')}">${itemAliases[0]}</span>`
      : '';

    iconsListHtml += `
      <div class="col-12 col-sm-6 col-md-4 col-xl-3">
        <div class="p-1 border rounded-3 bg-white d-flex align-items-center gap-1 reference-icon-item" 
             data-class="${item.class}" 
             data-name="${item.name}" 
             data-search="${searchTerms}"
             data-unicode="${item.content}"
             title="Click to copy <i class='${item.class}'></i>">
          <div class="reference-icon-icon-wrap d-flex align-items-center justify-content-center rounded-2 bg-light text-primary flex-shrink-0">
            <i class="${item.class} fs-3"></i>
          </div>
          <div class="overflow-hidden flex-grow-1">
            <div class="d-flex align-items-center justify-content-between gap-1">
              <div class="text-sm fw-semibold text-dark text-truncate icon-title-label" title="${item.name}">${item.name}</div>
              ${aliasBadge}
            </div>
            <div class="text-xs text-muted font-monospace d-flex align-items-center justify-content-between">
              <span>${item.content}</span>
              <span class="copy-hint text-primary fw-medium">Copy</span>
            </div>
          </div>
        </div>
      </div>`;
  });

  categoryRowsHtml += `
    <div class="category-reference-block mb-4 pb-5 border-bottom" id="cat-${catKey}">
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h3 class="h4 fw-bold text-dark mb-1 d-flex align-items-center gap-1">
            <span>${meta.name}</span>
            <span class="badge bg-primary-soft text-primary rounded-pill text-xs">${list.length} icons</span>
          </h3>
          <p class="text-muted text-sm mb-0">${meta.description}</p>
        </div>
        <div class="d-flex align-items-center gap-1">
          <span class="badge bg-light text-muted border font-monospace text-2xs">
            dist/css/categories/${catKey}.min.css
          </span>
        </div>
      </div>
      <div class="row g-2">
        ${iconsListHtml}
      </div>
    </div>`;
});

let categoryNavLinks = '';
Object.keys(categories).sort().forEach(catKey => {
  const meta = categories[catKey];
  const list = catGroups[catKey] || [];
  categoryNavLinks += `<a class="nav-link text-muted py-05 px-1 rounded hover-bg-light d-flex justify-content-between align-items-center" href="#cat-${catKey}">
    <span>${meta.name}</span>
    <span class="badge bg-light text-muted border rounded-pill">${list.length}</span>
  </a>`;
});

const html = `<!DOCTYPE html>
<html lang="en" data-boodoo-theme="light">
<head>
${getHtmlHead(
  'Icon Reference &amp; Cheat Sheet | Haticons by PebbleBenders',
  'Browse the full categorized icon catalog of 494+ vector icons, copy HTML snippets, Unicode values, and reference partial bundle paths.',
  'haticons reference, icon catalog, css unicode, icon cheatsheet, vector icons list'
)}
</head>

<body class="bg-light text-dark">

${getAnnouncementBar()}

${getNavbar('reference')}

    <!-- Header Banner -->
    <header class="py-5 bg-white border-bottom">
        <div class="container text-center">
            <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-soft text-primary fw-medium text-xs mb-3 border border-primary-subtle">
                <i class="hi-document"></i>
                <span>Complete Icon Catalog &amp; Codepoint Reference</span>
            </div>
            <h1 class="display-5 fw-extrabold text-dark mb-3">Haticons Reference</h1>
            <p class="lead text-muted mx-auto header-subtitle-constrained mb-4">
                Direct reference for all <strong>${icons.length} icons</strong> organized by category, including CSS unicode values, partial files, canonical aliases, and class names.
            </p>

            <!-- Search input bar -->
            <div class="mx-auto" style="max-width: 520px;">
                <div class="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border">
                    <span class="input-group-text bg-white border-0 ps-3 text-muted">
                        <i class="hi-search fs-5"></i>
                    </span>
                    <input type="text" id="referenceSearchInput" class="form-control border-0 ps-2" placeholder="Search by name, class, alias (e.g. calendar, snapchat, pencil)..." aria-label="Search icons">
                    <button class="btn btn-light border-0 text-muted px-3" type="button" id="clearRefSearch" title="Clear search">
                        <i class="hi-close"></i>
                    </button>
                </div>
                <div class="d-flex align-items-center justify-content-between text-xs text-muted mt-2 px-2">
                    <span>Showing <strong id="refVisibleCount" class="text-primary">${icons.length}</strong> of ${icons.length} icons</span>
                    <span>Supports canonical aliases &amp; legacy names</span>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Container -->
    <div class="container pt-5">
        <div id="refNoResults" class="alert alert-warning text-center rounded-4 border d-none my-4">
            <i class="hi-warning fs-3 d-block mb-2 text-warning"></i>
            <h4 class="h5 fw-bold text-dark mb-1">No matching icons found</h4>
            <p class="text-muted text-sm mb-0">Try searching for broader terms like "arrow", "cart", "user", "star", or a category name.</p>
        </div>
        <div class="row g-5">
            <!-- Sidebar Navigation -->
            <aside class="col-12 col-lg-3">
                <div class="sticky-top sticky-top-nav">
                    <div class="card p-1 rounded-4 border bg-white shadow-xs">
                        <div class="text-xs fw-bold text-muted text-uppercase tracking-wider mb-1 px-1">Categories (${Object.keys(categories).length})</div>
                        <nav class="nav flex-column gap-0.5 text-sm">
                            ${categoryNavLinks}
                        </nav>
                        <hr class="my-2">
                        <a href="/tutorial.html" class="btn btn-outline-primary btn-sm rounded-pill w-100 d-inline-flex align-items-center justify-content-center gap-1">
                            <i class="hi-bulb"></i>
                            <span>View Tutorial Guide</span>
                        </a>
                    </div>
                </div>
            </aside>

            <!-- Main Content Area -->
            <main class="col-12 col-lg-9">
                ${categoryRowsHtml}
            </main>
        </div>
    </div>

${getToast('reference-toast')}

${getFooter('reference')}

    <!-- boodoo & Haticons JavaScript Bundles -->
    <script src="https://cdn.jsdelivr.net/npm/boodoo@1.2.2/dist/js/boodoo.min.js"></script>
    <script src="/assets/js/theme.js"></script>
    <script src="/assets/js/custom.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT_DIR, 'code', 'reference.html'), html);
console.log('code/reference.html generated successfully using shared templates!');
