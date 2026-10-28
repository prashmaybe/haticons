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

// Parse SVG font to extract glyph path definitions
const FONTS_SRC = path.join(ROOT_DIR, 'code', 'assets', 'fonts');
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

let categoryRowsHtml = '';
Object.keys(categories).sort().forEach(catKey => {
    const meta = categories[catKey];
    const list = catGroups[catKey] || [];

    let iconsListHtml = '';
    list.forEach(item => {
        const itemAliases = targetToAliases[item.name] || [];
        const searchTerms = [item.name, item.class, ...itemAliases].join(' ');
        const pathD = (glyphPaths[item.name] || '').replace(/"/g, '&quot;');
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
             data-path="${pathD}"
             title="Click to customize &amp; copy <i class='${item.class}'></i>">
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

            <!-- Search and Controls bar -->
            <div class="mx-auto" style="max-width: 680px;">
                <div class="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border mb-3">
                    <span class="input-group-text bg-white border-0 ps-3 text-muted">
                        <i class="hi-search fs-5"></i>
                    </span>
                    <input type="text" id="referenceSearchInput" class="form-control border-0 ps-2" placeholder="Search by name, class, alias (e.g. calendar, snapchat, pencil)..." aria-label="Search icons">
                    <button class="btn btn-light border-0 text-muted px-3" type="button" id="clearRefSearch" title="Clear search">
                        <i class="hi-close"></i>
                    </button>
                </div>

                <!-- Interactive Filters: Animations & Variants -->
                <div class="d-flex flex-wrap align-items-center justify-content-center gap-2 mb-2">
                    <span class="text-xs fw-semibold text-muted text-uppercase tracking-wider me-1">Style Preview:</span>
                    <button type="button" class="btn btn-sm btn-primary rounded-pill px-3 ref-style-btn active" data-style="default">Normal</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 ref-style-btn" data-style="duotone">Duotone</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 ref-style-btn" data-style="spin">Spin</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 ref-style-btn" data-style="pulse">Pulse</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 ref-style-btn" data-style="bounce">Bounce</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 ref-style-btn" data-style="shake">Shake</button>
                </div>

                <div class="d-flex align-items-center justify-content-between text-xs text-muted px-2">
                    <span>Showing <strong id="refVisibleCount" class="text-primary">${icons.length}</strong> of ${icons.length} icons</span>
                    <div class="d-flex align-items-center gap-2">
                        <span id="subsetStatusText" class="badge bg-light text-dark border rounded-pill">Subset Tray: <strong>0</strong> icons</span>
                        <button type="button" id="openSubsetModalBtn" class="btn btn-xs btn-outline-primary rounded-pill px-2" disabled>
                            <i class="hi-download me-1"></i> Export Subset
                        </button>
                    </div>
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

    <!-- Interactive Icon Customizer Modal -->
    <div class="modal fade" id="customizerModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content rounded-4 border shadow-lg overflow-hidden">
                <div class="modal-header bg-light border-bottom p-3">
                    <h5 class="modal-title fw-bold text-dark d-flex align-items-center gap-2" id="custModalTitle">
                        <i class="hi-paintbox text-primary"></i>
                        <span>Icon Customizer &amp; Exporter</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" data-boodoo-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4">
                    <div class="row g-4 align-items-center">
                        <div class="col-12 col-md-5 text-center">
                            <div class="p-4 bg-light rounded-4 border d-flex flex-column align-items-center justify-content-center position-relative" style="min-height: 240px;">
                                <div id="custPreviewWrap" class="mb-3 d-flex align-items-center justify-content-center" style="width: 120px; height: 120px;">
                                    <svg id="custSvgPreview" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="72" height="72" fill="#7c3aed">
                                        <g transform="scale(1, -1) translate(0, -960)">
                                            <path id="custSvgPath" d="" />
                                        </g>
                                    </svg>
                                </div>
                                <span class="badge bg-white text-muted border text-xs font-monospace px-3 py-1" id="custBadgeName">hi-cart</span>
                            </div>
                        </div>

                        <div class="col-12 col-md-7">
                            <h6 class="fw-bold text-dark text-sm mb-3">Live Customization Controls</h6>
                            
                            <!-- Size Slider -->
                            <div class="mb-3">
                                <div class="d-flex justify-content-between text-xs text-muted mb-1">
                                    <span>Size:</span>
                                    <strong id="custSizeVal" class="text-dark">72px</strong>
                                </div>
                                <input type="range" class="form-range" id="custSizeRange" min="16" max="144" value="72" step="4">
                            </div>

                            <!-- Color Pickers -->
                            <div class="row g-2 mb-3">
                                <div class="col-6">
                                    <label class="form-label text-xs text-muted mb-1">Fill Color:</label>
                                    <input type="color" class="form-control form-control-color w-100 rounded-3 border p-1" id="custColorPicker" value="#7c3aed">
                                </div>
                                <div class="col-6">
                                    <label class="form-label text-xs text-muted mb-1">Quick Color:</label>
                                    <div class="d-flex gap-1 pt-1">
                                        <button type="button" class="btn btn-xs rounded-circle p-2 border quick-color" style="background:#7c3aed;" data-color="#7c3aed"></button>
                                        <button type="button" class="btn btn-xs rounded-circle p-2 border quick-color" style="background:#0284c7;" data-color="#0284c7"></button>
                                        <button type="button" class="btn btn-xs rounded-circle p-2 border quick-color" style="background:#10b981;" data-color="#10b981"></button>
                                        <button type="button" class="btn btn-xs rounded-circle p-2 border quick-color" style="background:#ef4444;" data-color="#ef4444"></button>
                                        <button type="button" class="btn btn-xs rounded-circle p-2 border quick-color" style="background:#0f172a;" data-color="#0f172a"></button>
                                    </div>
                                </div>
                            </div>

                            <!-- Export Actions -->
                            <div class="d-flex flex-wrap gap-2 pt-2 border-top">
                                <button type="button" class="btn btn-sm btn-primary rounded-pill px-3 d-inline-flex align-items-center gap-1" id="custCopyJsxBtn">
                                    <i class="hi-paste"></i> Copy JSX
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 d-inline-flex align-items-center gap-1" id="custCopySvgBtn">
                                    <i class="hi-paste"></i> Copy SVG
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 d-inline-flex align-items-center gap-1" id="custDownloadSvgBtn">
                                    <i class="hi-download"></i> Download SVG
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-info rounded-pill px-3 d-inline-flex align-items-center gap-1" id="custToggleSubsetBtn">
                                    <i class="hi-star"></i> <span id="custSubsetText">Add to Subset</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Subset Exporter Modal -->
    <div class="modal fade" id="subsetExportModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-4 border shadow-lg">
                <div class="modal-header bg-light border-bottom p-3">
                    <h5 class="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                        <i class="hi-archive text-primary"></i>
                        <span>Export Custom Subset</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" data-boodoo-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-4">
                    <p class="text-muted text-sm">
                        You have selected <strong id="subsetModalCount" class="text-primary">0</strong> icons for your custom zero-waste bundle.
                    </p>
                    <div id="subsetSelectedTags" class="d-flex flex-wrap gap-1 p-3 bg-light rounded-3 border mb-3 text-xs" style="max-height: 140px; overflow-y: auto;"></div>
                    
                    <h6 class="text-xs fw-bold text-muted text-uppercase tracking-wider mb-2">CLI / npm Command:</h6>
                    <div class="input-group input-group-sm mb-3">
                        <input type="text" id="subsetCliCmd" class="form-control font-monospace text-xs" readonly>
                        <button class="btn btn-outline-secondary" type="button" id="copySubsetCliBtn">Copy</button>
                    </div>

                    <h6 class="text-xs fw-bold text-muted text-uppercase tracking-wider mb-2">Standalone Subset CSS:</h6>
                    <textarea id="subsetCssOutput" class="form-control font-monospace text-xs mb-3" rows="4" readonly></textarea>

                    <div class="d-flex justify-content-between align-items-center">
                        <button type="button" class="btn btn-sm btn-outline-danger rounded-pill px-3" id="clearSubsetTrayBtn">
                            Clear Tray
                        </button>
                        <button type="button" class="btn btn-sm btn-primary rounded-pill px-4" id="copySubsetCssBtn">
                            <i class="hi-paste me-1"></i> Copy Subset CSS
                        </button>
                    </div>
                </div>
            </div>
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
