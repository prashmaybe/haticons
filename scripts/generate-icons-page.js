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
const { ICON_ALIASES } = require('./categories.js');
const PKG = require('../package.json');
const VERSION = PKG.version;

const icons = loadIcons();
const categories = loadCategories();
const totalIcons = icons.length;

// Invert aliases for easy search lookup
const targetToAliases = {};
Object.entries(ICON_ALIASES).forEach(([aliasName, targetName]) => {
    if (!targetToAliases[targetName]) targetToAliases[targetName] = [];
    targetToAliases[targetName].push(aliasName);
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

// Group icons by category
const catGroups = {};
Object.keys(categories).forEach(cat => { catGroups[cat] = []; });
icons.forEach(i => {
    const c = i.category || 'interface';
    if (!catGroups[c]) catGroups[c] = [];
    catGroups[c].push(i);
});

// Generate Icon Grid Cards HTML
let iconGridCardsHtml = '';
icons.forEach(item => {
    const itemAliases = targetToAliases[item.name] || [];
    const searchTerms = [item.name, item.class, item.category, ...itemAliases].join(' ').toLowerCase();
    const pathD = (glyphPaths[item.name] || '').replace(/"/g, '&quot;');

    iconGridCardsHtml += `
            <div class="haticon-card text-center p-2 rounded-4 bg-white border"
                 data-class="${item.class}"
                 data-name="${item.name}"
                 data-category="${item.category}"
                 data-unicode="${item.content}"
                 data-path="${pathD}"
                 data-search="${searchTerms}"
                 title="Click to customize &amp; copy ${item.name}">
                <div class="icon-glyph-wrap mx-auto d-flex align-items-center justify-content-center mb-2">
                    <i class="${item.class} haticon-display-icon"></i>
                </div>
                <div class="icon-name-text text-truncate w-100 mb-1" title="${item.name}">${item.name}</div>
                <div class="d-flex align-items-center justify-content-between text-2xs text-muted w-100">
                    <span class="category-badge text-truncate">${item.category}</span>
                    <span class="copy-hint text-primary fw-medium"><i class="hi-paste"></i></span>
                </div>
            </div>`;
});

const html = `<!DOCTYPE html>
<html lang="en" data-boodoo-theme="light">
<head>
${getHtmlHead(
    'Icon Explorer | Search 569+ Free Vector &amp; Font Icons - Haticons',
    `Search, customize, and filter ${totalIcons}+ vector and font icons with outline, fill, and sharp styles. Export SVGs, JSX, or build custom zero-waste subsets.`,
    'haticons icons, icon search, svg icons, font icons explorer, vector glyphs, react icons, vue icons',
    '/icons.html'
)}
</head>

<body class="bg-light text-dark">

${getAnnouncementBar()}

${getNavbar('icons')}

    <!-- Page Header -->
    <header class="py-5 bg-white border-bottom">
        <div class="container text-center">
            <div class="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill bg-primary-soft text-primary fw-semibold text-xs mb-3 border border-primary-subtle">
                <i class="hi-search"></i>
                <span>${totalIcons} Vector &amp; Font Icons</span>
            </div>
            <h1 class="display-5 fw-extrabold text-dark mb-3">Icon Explorer</h1>
            <p class="lead text-muted mx-auto header-subtitle-constrained mb-4">
                Instant search across all icons by keyword, alias, or category. Click any icon card to inspect, customize color &amp; size, copy HTML / JSX / SVG code, or add to your custom bundle.
            </p>

            <!-- Search Bar -->
            <div class="mx-auto" style="max-width: 680px;">
                <div class="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border mb-3">
                    <span class="input-group-text bg-white border-0 ps-3 text-muted">
                        <i class="hi-search fs-5"></i>
                    </span>
                    <input type="text" id="iconSearchInput" class="form-control border-0 ps-2" placeholder="Search ${totalIcons}+ icons by name, alias, category (e.g. cart, heart, claude, react)..." aria-label="Search icons" autofocus>
                    <button class="btn btn-light border-0 text-muted px-3" type="button" id="resetSearchBtn" title="Clear search">
                        <i class="hi-close"></i>
                    </button>
                </div>

                <!-- Style Variants & Animation Modifiers -->
                <div class="d-flex flex-wrap align-items-center justify-content-center gap-2 mb-3">
                    <span class="text-xs fw-semibold text-muted text-uppercase tracking-wider me-1">Variants:</span>
                    <button type="button" class="btn btn-sm btn-primary rounded-pill px-3 style-filter-btn active" data-style="all">All Styles</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 style-filter-btn" data-style="outline">Outline</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 style-filter-btn" data-style="fill">Fill</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-3 style-filter-btn" data-style="sharp">Sharp</button>

                    <span class="text-xs fw-semibold text-muted text-uppercase tracking-wider ms-2 me-1">Animations:</span>
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-2 anim-filter-btn" data-anim="spin"><i class="hi-refresh hi-spin me-1"></i>Spin</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-2 anim-filter-btn" data-anim="pulse"><i class="hi-heart-fill hi-pulse me-1 text-danger"></i>Pulse</button>
                    <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-2 anim-filter-btn" data-anim="bounce"><i class="hi-arrow-up hi-bounce me-1 text-primary"></i>Bounce</button>
                </div>

                <!-- Category Filter Pills -->
                <div class="d-flex flex-wrap align-items-center justify-content-center gap-1 category-tabs-wrap">
                    <button type="button" class="btn btn-xs category-filter-btn rounded-pill px-2 active" data-category="all">
                        All (${totalIcons})
                    </button>
                    <button type="button" class="btn btn-xs category-filter-btn rounded-pill px-2 btn-outline-secondary bg-white" data-category="brands">
                        Brands (${catGroups.brands ? catGroups.brands.length : 0})
                    </button>
                    <button type="button" class="btn btn-xs category-filter-btn rounded-pill px-2 btn-outline-secondary bg-white" data-category="interface">
                        UI &amp; Interface (${catGroups.interface ? catGroups.interface.length : 0})
                    </button>
                    <button type="button" class="btn btn-xs category-filter-btn rounded-pill px-2 btn-outline-secondary bg-white" data-category="commerce">
                        Commerce (${catGroups.commerce ? catGroups.commerce.length : 0})
                    </button>
                    <button type="button" class="btn btn-xs category-filter-btn rounded-pill px-2 btn-outline-secondary bg-white" data-category="editor">
                        Editor (${catGroups.editor ? catGroups.editor.length : 0})
                    </button>
                    <button type="button" class="btn btn-xs category-filter-btn rounded-pill px-2 btn-outline-secondary bg-white" data-category="feedback">
                        Feedback (${catGroups.feedback ? catGroups.feedback.length : 0})
                    </button>
                    <button type="button" class="btn btn-xs category-filter-btn rounded-pill px-2 btn-outline-secondary bg-white" data-category="directional">
                        Directional (${catGroups.directional ? catGroups.directional.length : 0})
                    </button>
                    <button type="button" class="btn btn-xs category-filter-btn rounded-pill px-2 btn-outline-secondary bg-white" data-category="media">
                        Media (${catGroups.media ? catGroups.media.length : 0})
                    </button>
                    <button type="button" class="btn btn-xs category-filter-btn rounded-pill px-2 btn-outline-secondary bg-white" data-category="devices">
                        Devices (${catGroups.devices ? catGroups.devices.length : 0})
                    </button>
                    <button type="button" class="btn btn-xs category-filter-btn rounded-pill px-2 btn-outline-secondary bg-white" data-category="files">
                        Files (${catGroups.files ? catGroups.files.length : 0})
                    </button>
                    <button type="button" class="btn btn-xs category-filter-btn rounded-pill px-2 btn-outline-secondary bg-white" data-category="security">
                        Security (${catGroups.security ? catGroups.security.length : 0})
                    </button>
                    <button type="button" class="btn btn-xs category-filter-btn rounded-pill px-2 btn-outline-secondary bg-white" data-category="communication">
                        Communication (${catGroups.communication ? catGroups.communication.length : 0})
                    </button>
                    <button type="button" class="btn btn-xs category-filter-btn rounded-pill px-2 btn-outline-secondary bg-white" data-category="users">
                        Users (${catGroups.users ? catGroups.users.length : 0})
                    </button>
                    <button type="button" class="btn btn-xs category-filter-btn rounded-pill px-2 btn-outline-secondary bg-white" data-category="navigation">
                        Navigation (${catGroups.navigation ? catGroups.navigation.length : 0})
                    </button>
                    <button type="button" class="btn btn-xs category-filter-btn rounded-pill px-2 btn-outline-secondary bg-white" data-category="time">
                        Time (${catGroups.time ? catGroups.time.length : 0})
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Explorer Grid Section -->
    <main class="py-5" id="explore">
        <div class="container">
            <!-- Counter & Helper Bar -->
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 px-1 text-xs text-muted">
                <div>Showing <strong id="visibleCount" class="text-primary">${totalIcons}</strong> of ${totalIcons} icons</div>
                <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-white text-muted border rounded-pill">Click card to customize &amp; copy</span>
                    <a href="/playground.html" class="text-primary text-decoration-none fw-semibold d-inline-flex align-items-center gap-1">
                        Open Studio Playground <i class="hi-arrow-right"></i>
                    </a>
                </div>
            </div>

            <!-- No Results Alert -->
            <div id="noResults" class="alert alert-warning text-center rounded-4 border d-none my-4">
                <i class="hi-warning fs-3 d-block mb-2 text-warning"></i>
                <h4 class="h5 fw-bold text-dark mb-1">No matching icons found</h4>
                <p class="text-muted text-sm mb-0">Try searching for broader keywords like "arrow", "cart", "user", "star", or select another category.</p>
            </div>

            <!-- Icons Grid -->
            <div class="haticons-set-grid haticon-grid mb-5" id="iconGrid">
${iconGridCardsHtml}
            </div>

            <!-- Footer Help Box -->
            <div class="card p-4 rounded-4 bg-white border text-center shadow-2xs">
                <h3 class="h5 fw-bold text-dark mb-2">Looking for Unicode Codepoints or CSS Category Bundles?</h3>
                <p class="text-muted text-sm mx-auto mb-3" style="max-width: 600px;">
                    Check out our comprehensive Reference catalog with unicode codepoints for every icon, plus individual CSS stylesheets for each category.
                </p>
                <div class="d-flex flex-wrap justify-content-center gap-2">
                    <a href="/reference.html" class="btn btn-primary rounded-pill px-4 shadow-sm d-inline-flex align-items-center gap-2">
                        <i class="hi-document"></i>
                        <span>Codepoint Reference Table</span>
                    </a>
                    <a href="/tutorial.html#modular-css" class="btn btn-outline-secondary rounded-pill px-4 bg-white d-inline-flex align-items-center gap-2">
                        <i class="hi-archive"></i>
                        <span>Modular Category Stylesheets</span>
                    </a>
                </div>
            </div>
        </div>
    </main>

    <!-- Customizer Modal -->
    <div class="modal fade" id="customizerModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content rounded-4 border shadow-lg overflow-hidden">
                <div class="modal-header bg-light border-bottom px-3 py-2">
                    <h5 class="modal-title fw-bold text-dark d-flex align-items-center gap-2" id="custModalTitle">
                        <i class="hi-paintbox text-primary"></i>
                        <span>Icon Customizer &amp; Exporter</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" data-boodoo-dismiss="modal" aria-label="Close">
                        <i class="hi-close" aria-hidden="true"></i>
                    </button>
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

                            <!-- Color Picker & Quick Swatches -->
                            <div class="mb-3">
                                <label class="form-label text-xs text-muted mb-1">Fill Color:</label>
                                <input type="color" class="form-control form-control-color w-100 rounded-3 border p-1 mb-2" id="custColorPicker" value="#7c3aed" style="height: 38px;">
                                <label class="form-label text-xs text-muted mb-1 d-block">Quick Colors:</label>
                                <div class="quick-colors-grid">
                                    <button type="button" class="btn p-0 rounded-circle quick-color" style="background:#7c3aed;" data-color="#7c3aed" title="Purple (#7c3aed)"></button>
                                    <button type="button" class="btn p-0 rounded-circle quick-color" style="background:#0284c7;" data-color="#0284c7" title="Sky Blue (#0284c7)"></button>
                                    <button type="button" class="btn p-0 rounded-circle quick-color" style="background:#10b981;" data-color="#10b981" title="Emerald (#10b981)"></button>
                                    <button type="button" class="btn p-0 rounded-circle quick-color" style="background:#f59e0b;" data-color="#f59e0b" title="Amber (#f59e0b)"></button>
                                    <button type="button" class="btn p-0 rounded-circle quick-color" style="background:#ef4444;" data-color="#ef4444" title="Red (#ef4444)"></button>
                                    <button type="button" class="btn p-0 rounded-circle quick-color" style="background:#6366f1;" data-color="#6366f1" title="Indigo (#6366f1)"></button>
                                    <button type="button" class="btn p-0 rounded-circle quick-color" style="background:#06b6d4;" data-color="#06b6d4" title="Cyan (#06b6d4)"></button>
                                    <button type="button" class="btn p-0 rounded-circle quick-color" style="background:#ec4899;" data-color="#ec4899" title="Pink (#ec4899)"></button>
                                    <button type="button" class="btn p-0 rounded-circle quick-color" style="background:#64748b;" data-color="#64748b" title="Slate Gray (#64748b)"></button>
                                    <button type="button" class="btn p-0 rounded-circle quick-color" style="background:#0f172a;" data-color="#0f172a" title="Dark Slate (#0f172a)"></button>
                                </div>
                            </div>

                            <!-- Export Actions -->
                            <div class="d-grid gap-2 pt-2 border-top cust-export-actions">
                                <button type="button" class="btn btn-sm btn-primary rounded-pill px-2 d-inline-flex align-items-center justify-content-center gap-1" id="custCopyHtmlBtn">
                                    <i class="hi-paste"></i> Copy HTML
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-2 d-inline-flex align-items-center justify-content-center gap-1" id="custCopyClassBtn">
                                    <i class="hi-paste"></i> Copy Class
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-2 d-inline-flex align-items-center justify-content-center gap-1" id="custCopyJsxBtn">
                                    <i class="hi-paste"></i> Copy JSX
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-2 d-inline-flex align-items-center justify-content-center gap-1" id="custCopySvgBtn">
                                    <i class="hi-paste"></i> Copy SVG
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill px-2 d-inline-flex align-items-center justify-content-center gap-1" id="custDownloadSvgBtn">
                                    <i class="hi-download"></i> Download SVG
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-info rounded-pill px-2 d-inline-flex align-items-center justify-content-center gap-1" id="custToggleSubsetBtn">
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
                <div class="modal-header bg-light border-bottom px-3 py-2">
                    <h5 class="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                        <i class="hi-archive text-primary"></i>
                        <span>Export Custom Subset</span>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" data-boodoo-dismiss="modal" aria-label="Close">
                        <i class="hi-close" aria-hidden="true"></i>
                    </button>
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

${getToast()}

${getFooter('icons')}

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/boodoo@1.2.2/dist/js/boodoo.min.js"></script>
    <script type="text/javascript" src="/assets/js/theme.js"></script>
    <script type="text/javascript" src="/assets/js/custom.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT_DIR, 'code', 'icons.html'), html);
console.log('code/icons.html generated successfully!');

