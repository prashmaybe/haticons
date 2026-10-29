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

// Parse SVG font to extract glyph path definitions for customizer
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

// Group icons by category for showcase cards
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

// Category Showcase Cards HTML
let categoryCardsHtml = '';
Object.keys(categories).sort().forEach(catKey => {
    const meta = categories[catKey];
    const list = catGroups[catKey] || [];
    const sampleIcons = list.slice(0, 4);

    categoryCardsHtml += `
            <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                <a href="/reference.html#cat-${catKey}" class="card category-card p-3 rounded-4 bg-white border text-decoration-none h-100 shadow-2xs">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <h4 class="h6 fw-bold text-dark mb-0">${meta.name}</h4>
                        <span class="badge bg-primary-soft text-primary rounded-pill text-xs fw-semibold">${list.length}</span>
                    </div>
                    <p class="text-muted text-xs mb-3 flex-grow-1">${meta.description}</p>
                    <div class="d-flex align-items-center justify-content-between pt-2 border-top">
                        <div class="d-flex align-items-center gap-2 text-muted">
                            ${sampleIcons.map(si => `<i class="${si.class} fs-5" title="${si.name}"></i>`).join('')}
                        </div>
                        <span class="text-primary text-xs fw-semibold d-inline-flex align-items-center gap-1">
                            Browse <i class="hi-arrow-right"></i>
                        </span>
                    </div>
                </a>
            </div>`;
});

const html = `<!DOCTYPE html>
<html lang="en" data-boodoo-theme="light">
<head>
${getHtmlHead(
    'Haticons | Beautiful Free Vector &amp; Font Icons for Modern Apps',
    `A set of ${totalIcons}+ beautifully crafted, modular free premium font icons and SVG icons for Web, iOS, Android, and Desktop apps. Styled with boodoo framework.`,
    'haticons, haticon, font icons, icon fonts, web fonts, font awesome alternative, ionicons, glyphicons, svg icons, boodoo framework, boodoo css'
)}
</head>

<body class="bg-light text-dark">

${getAnnouncementBar()}

${getNavbar('home')}

    <!-- Hero Section -->
    <section class="hero-section py-5 text-center position-relative overflow-hidden">
        <div class="container py-4 position-relative z-1">
            <div class="d-flex flex-wrap align-items-center justify-content-center gap-2 mb-3">
                <span class="px-3 py-1 rounded-pill bg-primary-soft text-primary fw-medium text-xs border border-primary-subtle d-inline-flex align-items-center gap-1">
                    <i class="hi-star"></i>
                    <span>${totalIcons}+ Modern Vector Icons</span>
                </span>
                <span class="px-3 py-1 rounded-pill bg-white text-muted fw-medium text-xs border shadow-2xs d-inline-flex align-items-center gap-1">
                    <i class="hi-check-circle text-success"></i>
                    <span>GPL-3.0 Open Source</span>
                </span>
                <span class="px-3 py-1 rounded-pill bg-white text-muted fw-medium text-xs border shadow-2xs d-inline-flex align-items-center gap-1">
                    <i class="hi-archive text-warning"></i>
                    <span>14 Modular CSS Bundles</span>
                </span>
            </div>
            
            <h1 class="display-4 fw-extrabold text-dark mb-3 hero-title">
                Beautifully Crafted <span class="text-gradient-purple">Vector &amp; Font Icons</span>
            </h1>
            
            <p class="lead text-muted mx-auto mb-4 hero-subtitle">
                A super-optimized, modular icon suite engineered for Web, React, Vue, iOS, Android, and Desktop apps. Inspired by <strong>Ionicons</strong>, <strong>FontAwesome</strong>, and <strong>Glyphicons</strong>.
            </p>

            <div class="d-flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                <a href="#explore" class="btn btn-primary btn-lg rounded-pill px-4 shadow-sm d-inline-flex align-items-center gap-2">
                    <i class="hi-search"></i>
                    <span>Explore ${totalIcons} Icons</span>
                </a>
                <a href="/download/haticons.zip" class="btn btn-outline-secondary btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2 bg-white">
                    <i class="hi-download"></i>
                    <span>Download ZIP (~1.3MB)</span>
                </a>
                <a href="/reference.html" class="btn btn-outline-primary btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2">
                    <i class="hi-document"></i>
                    <span>Codepoint Reference</span>
                </a>
            </div>

            <!-- Install / CDN Pills -->
            <div class="install-bar mx-auto p-2 bg-white rounded-4 border shadow-sm d-flex flex-column flex-md-row align-items-stretch gap-2 mb-4">
                <div class="install-code-box flex-fill px-3 py-2 text-start font-monospace text-xs text-dark rounded-3 bg-light d-flex align-items-center justify-content-between gap-1 overflow-hidden">
                    <span class="user-select-all text-truncate install-text" id="npmCmd">npm install haticons</span>
                    <button class="btn btn-sm btn-ghost text-muted copy-btn flex-shrink-0" data-copy="npm install haticons" title="Copy command">
                        <i class="hi-paste"></i>
                    </button>
                </div>
                <div class="install-code-box flex-fill px-3 py-2 text-start font-monospace text-xs text-dark rounded-3 bg-light d-flex align-items-center justify-content-between gap-1 overflow-hidden">
                    <span class="user-select-all text-truncate cdn-truncate install-text" id="cdnUrl">https://cdn.jsdelivr.net/npm/haticons@${VERSION}/dist/css/haticons.min.css</span>
                    <button class="btn btn-sm btn-ghost text-muted copy-btn flex-shrink-0" data-copy="https://cdn.jsdelivr.net/npm/haticons@${VERSION}/dist/css/haticons.min.css" title="Copy CDN URL">
                        <i class="hi-paste"></i>
                    </button>
                </div>
            </div>

            <!-- Hero Highlights Icon Ribbon -->
            <div class="hero-highlights-ribbon d-flex flex-wrap align-items-center justify-content-center gap-2 py-2">
                <span class="badge bg-white text-muted border rounded-pill px-3 py-1 text-xs d-inline-flex align-items-center gap-1">
                    <i class="hi-claude text-warning"></i> Claude
                </span>
                <span class="badge bg-white text-muted border rounded-pill px-3 py-1 text-xs d-inline-flex align-items-center gap-1">
                    <i class="hi-gemini text-primary"></i> Gemini
                </span>
                <span class="badge bg-white text-muted border rounded-pill px-3 py-1 text-xs d-inline-flex align-items-center gap-1">
                    <i class="hi-antigravity text-info"></i> Antigravity
                </span>
                <span class="badge bg-white text-muted border rounded-pill px-3 py-1 text-xs d-inline-flex align-items-center gap-1">
                    <i class="hi-cursor text-dark"></i> Cursor
                </span>
                <span class="badge bg-white text-muted border rounded-pill px-3 py-1 text-xs d-inline-flex align-items-center gap-1">
                    <i class="hi-react text-info"></i> React
                </span>
                <span class="badge bg-white text-muted border rounded-pill px-3 py-1 text-xs d-inline-flex align-items-center gap-1">
                    <i class="hi-vue-js text-success"></i> Vue 3
                </span>
                <span class="badge bg-white text-muted border rounded-pill px-3 py-1 text-xs d-inline-flex align-items-center gap-1">
                    <i class="hi-cart text-primary"></i> Commerce
                </span>
                <span class="badge bg-white text-muted border rounded-pill px-3 py-1 text-xs d-inline-flex align-items-center gap-1">
                    <i class="hi-refresh hi-spin text-success"></i> hi-spin
                </span>
            </div>
        </div>
    </section>

    <!-- Interactive Icon Explorer Section -->
    <section id="explore" class="py-5 bg-white border-top border-bottom">
        <div class="container">
            <div class="text-center mb-4">
                <div class="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill bg-primary-soft text-primary fw-medium text-xs mb-2 border border-primary-subtle">
                    <i class="hi-search"></i>
                    <span>Live Icon Explorer</span>
                </div>
                <h2 class="display-6 fw-extrabold text-dark mb-2">Explore the Icon Library</h2>
                <p class="lead text-muted mx-auto header-subtitle-constrained mb-4">
                    Search through all <strong>${totalIcons} icons</strong> in real time. Click any card to customize color, size, animation, copy HTML/JSX/SVG code, or add to your custom subset.
                </p>

                <!-- Search & Filter Controls -->
                <div class="mx-auto mb-4" style="max-width: 720px;">
                    <div class="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border mb-3">
                        <span class="input-group-text bg-white border-0 ps-3 text-muted">
                            <i class="hi-search fs-5"></i>
                        </span>
                        <input type="text" id="iconSearchInput" class="form-control border-0 ps-2" placeholder="Search ${totalIcons}+ icons by name, category, alias (e.g. cart, heart, claude, react, arrow)..." aria-label="Search icons">
                        <button class="btn btn-light border-0 text-muted px-3" type="button" id="resetSearchBtn" title="Clear search">
                            <i class="hi-close"></i>
                        </button>
                    </div>

                    <!-- Style Variant Toggles & Animation Preview Buttons -->
                    <div class="d-flex flex-wrap align-items-center justify-content-center gap-2 mb-2">
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

                    <!-- Category Pills -->
                    <div class="d-flex flex-wrap align-items-center justify-content-center gap-1 pt-2 category-tabs-wrap">
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

                    <div class="d-flex align-items-center justify-content-between text-xs text-muted px-2 mt-3">
                        <span>Showing <strong id="visibleCount" class="text-primary">${totalIcons}</strong> of ${totalIcons} icons</span>
                        <div class="d-flex align-items-center gap-2">
                            <span class="badge bg-light text-dark border rounded-pill">Click any card to customize</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- No Results Alert -->
            <div id="noResults" class="alert alert-warning text-center rounded-4 border d-none my-4">
                <i class="hi-warning fs-3 d-block mb-2 text-warning"></i>
                <h4 class="h5 fw-bold text-dark mb-1">No matching icons found</h4>
                <p class="text-muted text-sm mb-0">Try searching for broader keywords like "arrow", "cart", "user", "star", or pick a category.</p>
            </div>

            <!-- Icons Grid -->
            <div class="haticons-set-grid haticon-grid mb-5" id="iconGrid">
${iconGridCardsHtml}
            </div>

            <div class="text-center py-4 bg-light rounded-4 border">
                <h3 class="h5 fw-bold text-dark mb-2">Need full codepoint tables or modular category stylesheets?</h3>
                <p class="text-muted text-sm mb-3">Browse all icons with CSS unicode values, partial category files, and canonical aliases in our Reference catalog.</p>
                <a href="/reference.html" class="btn btn-primary rounded-pill px-4 shadow-sm d-inline-flex align-items-center gap-2">
                    <i class="hi-document"></i>
                    <span>Open Detailed Reference Catalog</span>
                </a>
            </div>
        </div>
    </section>

    <!-- Interactive Live Playground Section -->
    <section id="playground" class="py-5 bg-light border-bottom">
        <div class="container">
            <div class="text-center mb-5">
                <div class="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill bg-primary-soft text-primary fw-medium text-xs mb-2 border border-primary-subtle">
                    <i class="hi-paintbox"></i>
                    <span>Real-Time Studio</span>
                </div>
                <h2 class="display-6 fw-extrabold text-dark mb-2">Interactive Icon Playground</h2>
                <p class="lead text-muted mx-auto header-subtitle-constrained mb-4">
                    Test colors, sizes, and animations live. Grab copy-paste snippets ready for HTML, React, SVG, or Sass.
                </p>
            </div>

            <div class="row g-4 align-items-stretch">
                <!-- Preview & Customization Canvas -->
                <div class="col-12 col-lg-6">
                    <div class="card p-4 rounded-4 bg-white border h-100 shadow-2xs d-flex flex-column justify-content-between">
                        <div>
                            <!-- Canvas Stage -->
                            <div class="playground-canvas p-4 rounded-4 bg-light border text-center mb-4 d-flex flex-column align-items-center justify-content-center position-relative" style="min-height: 220px;">
                                <div id="pgIconWrap" class="d-flex align-items-center justify-content-center">
                                    <i id="pgIconDisplay" class="hi-haticons" style="font-size: 64px; color: #7c3aed;"></i>
                                </div>
                                <span class="badge bg-white text-muted border text-xs font-monospace mt-3 px-3 py-1" id="pgIconLabel">hi-haticons</span>
                            </div>

                            <!-- Icon Selection Quick Dropdown -->
                            <div class="mb-3">
                                <label class="form-label text-xs fw-semibold text-muted text-uppercase tracking-wider mb-1">Select Sample Icon:</label>
                                <select class="form-select form-select-sm rounded-pill" id="pgIconSelect">
                                    <option value="haticons">hi-haticons (Logo)</option>
                                    <option value="claude">hi-claude (AI Brand)</option>
                                    <option value="gemini">hi-gemini (AI Brand)</option>
                                    <option value="antigravity">hi-antigravity (AI Brand)</option>
                                    <option value="cursor">hi-cursor (AI Editor)</option>
                                    <option value="react">hi-react (Framework)</option>
                                    <option value="vue-js">hi-vue-js (Framework)</option>
                                    <option value="cart">hi-cart (Commerce)</option>
                                    <option value="heart-fill">hi-heart-fill (UI)</option>
                                    <option value="star">hi-star (Rating)</option>
                                    <option value="search">hi-search (UI)</option>
                                    <option value="refresh">hi-refresh (Controls)</option>
                                    <option value="shield">hi-shield (Security)</option>
                                    <option value="code">hi-code (Editor)</option>
                                    <option value="download">hi-download (Action)</option>
                                </select>
                            </div>

                            <!-- Size Slider -->
                            <div class="mb-3">
                                <div class="d-flex justify-content-between text-xs text-muted mb-1">
                                    <span class="fw-semibold text-uppercase tracking-wider">Icon Size:</span>
                                    <strong id="pgSizeVal" class="text-primary font-monospace">64px</strong>
                                </div>
                                <input type="range" class="form-range" id="pgSizeRange" min="16" max="96" value="64" step="4">
                            </div>

                            <!-- Color Controls -->
                            <div class="mb-3">
                                <div class="d-flex justify-content-between text-xs text-muted mb-1">
                                    <span class="fw-semibold text-uppercase tracking-wider">Color:</span>
                                    <span id="pgColorHex" class="font-monospace text-dark">#7c3aed</span>
                                </div>
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <input type="color" class="form-control form-control-color border rounded-3 p-1" id="pgColorPicker" value="#7c3aed" style="width: 48px; height: 38px;">
                                    <div class="quick-colors-grid flex-grow-1">
                                        <button type="button" class="btn p-0 rounded-circle quick-color pg-color-btn" style="background:#7c3aed;" data-color="#7c3aed" title="Purple"></button>
                                        <button type="button" class="btn p-0 rounded-circle quick-color pg-color-btn" style="background:#0284c7;" data-color="#0284c7" title="Sky Blue"></button>
                                        <button type="button" class="btn p-0 rounded-circle quick-color pg-color-btn" style="background:#10b981;" data-color="#10b981" title="Emerald"></button>
                                        <button type="button" class="btn p-0 rounded-circle quick-color pg-color-btn" style="background:#f59e0b;" data-color="#f59e0b" title="Amber"></button>
                                        <button type="button" class="btn p-0 rounded-circle quick-color pg-color-btn" style="background:#ef4444;" data-color="#ef4444" title="Red"></button>
                                        <button type="button" class="btn p-0 rounded-circle quick-color pg-color-btn" style="background:#6366f1;" data-color="#6366f1" title="Indigo"></button>
                                        <button type="button" class="btn p-0 rounded-circle quick-color pg-color-btn" style="background:#06b6d4;" data-color="#06b6d4" title="Cyan"></button>
                                        <button type="button" class="btn p-0 rounded-circle quick-color pg-color-btn" style="background:#ec4899;" data-color="#ec4899" title="Pink"></button>
                                        <button type="button" class="btn p-0 rounded-circle quick-color pg-color-btn" style="background:#64748b;" data-color="#64748b" title="Slate"></button>
                                        <button type="button" class="btn p-0 rounded-circle quick-color pg-color-btn" style="background:#0f172a;" data-color="#0f172a" title="Dark"></button>
                                    </div>
                                </div>
                            </div>

                            <!-- Animation Controls -->
                            <div>
                                <label class="form-label text-xs fw-semibold text-muted text-uppercase tracking-wider mb-1">Animation Modifier:</label>
                                <div class="d-flex flex-wrap gap-1" id="pgAnimGroup">
                                    <button type="button" class="btn btn-xs rounded-pill px-3 pg-anim-btn active" data-anim="">None</button>
                                    <button type="button" class="btn btn-xs rounded-pill px-3 btn-outline-secondary pg-anim-btn" data-anim="hi-spin">hi-spin</button>
                                    <button type="button" class="btn btn-xs rounded-pill px-3 btn-outline-secondary pg-anim-btn" data-anim="hi-pulse">hi-pulse</button>
                                    <button type="button" class="btn btn-xs rounded-pill px-3 btn-outline-secondary pg-anim-btn" data-anim="hi-bounce">hi-bounce</button>
                                    <button type="button" class="btn btn-xs rounded-pill px-3 btn-outline-secondary pg-anim-btn" data-anim="hi-shake">hi-shake</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Code Output & Ready-to-use snippets -->
                <div class="col-12 col-lg-6">
                    <div class="card p-4 rounded-4 bg-white border h-100 shadow-2xs d-flex flex-column justify-content-between">
                        <div>
                            <div class="d-flex align-items-center justify-content-between mb-3">
                                <h3 class="h6 fw-bold text-dark mb-0">Production Snippets</h3>
                                <div class="d-inline-flex p-0.5 rounded-pill bg-light border gap-0.5" id="pgSnippetTabs">
                                    <button type="button" class="btn btn-xs rounded-pill px-2 active pg-tab-btn" data-mode="html">HTML</button>
                                    <button type="button" class="btn btn-xs rounded-pill px-2 text-muted pg-tab-btn" data-mode="react">React</button>
                                    <button type="button" class="btn btn-xs rounded-pill px-2 text-muted pg-tab-btn" data-mode="svg">SVG</button>
                                    <button type="button" class="btn btn-xs rounded-pill px-2 text-muted pg-tab-btn" data-mode="css">CSS</button>
                                </div>
                            </div>

                            <div class="code-snippet-box mb-3">
                                <div class="code-snippet-header">
                                    <span class="code-lang-label" id="pgCodeLangLabel"><i class="hi-html5"></i> HTML Markup</span>
                                    <div class="d-flex align-items-center gap-1">
                                        <button type="button" class="code-copy-btn" id="pgCopyCodeBtn">
                                            <i class="hi-paste"></i> <span>Copy Snippet</span>
                                        </button>
                                    </div>
                                </div>
                                <pre class="code-snippet-body"><code id="pgCodeContent">&lt;i class="hi-haticons" style="font-size: 64px; color: #7c3aed;"&gt;&lt;/i&gt;</code></pre>
                            </div>

                            <div class="p-3 bg-light rounded-3 border text-xs text-muted mb-3">
                                <strong>Tip:</strong> Haticons natively respects <code>currentColor</code> and standard CSS font sizes (e.g. <code>fs-1</code>, <code>text-primary</code>).
                            </div>
                        </div>

                        <div class="d-flex gap-2">
                            <button type="button" class="btn btn-primary rounded-pill btn-sm px-3 flex-fill" id="pgCopyPrimaryBtn">
                                <i class="hi-paste me-1"></i> Copy HTML Tag
                            </button>
                            <a href="/tutorial.html" class="btn btn-outline-secondary rounded-pill btn-sm px-3 flex-fill bg-white">
                                <i class="hi-bulb me-1"></i> View Tutorial Guide
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Key Features & Benefits Section -->
    <section id="features" class="py-5 bg-white border-bottom">
        <div class="container">
            <div class="text-center mb-5">
                <div class="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill bg-primary-soft text-primary fw-medium text-xs mb-2 border border-primary-subtle">
                    <i class="hi-star"></i>
                    <span>Engineered for Production</span>
                </div>
                <h2 class="display-6 fw-extrabold text-dark mb-2">Why Developers Choose Haticons</h2>
                <p class="lead text-muted mx-auto header-subtitle-constrained">
                    Built from the ground up for modern web development. Modular, lightweight, framework-agnostic, and completely open source.
                </p>
            </div>

            <div class="row g-4">
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card feature-card p-4 rounded-4 border h-100 shadow-2xs">
                        <div class="feature-icon-badge rounded-circle bg-primary-soft text-primary d-inline-flex align-items-center justify-content-center mb-3">
                            <i class="hi-star fs-3"></i>
                        </div>
                        <h3 class="h5 fw-bold text-dark mb-2">569+ Vector Glyphs</h3>
                        <p class="text-muted text-sm mb-0">
                            Crafted on a 1024-unit coordinate grid. Every curve and stroke is mathematically optimized for crisp display on high-DPI and Retina screens.
                        </p>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card feature-card p-4 rounded-4 border h-100 shadow-2xs">
                        <div class="feature-icon-badge rounded-circle bg-primary-soft text-primary d-inline-flex align-items-center justify-content-center mb-3">
                            <i class="hi-archive fs-3"></i>
                        </div>
                        <h3 class="h5 fw-bold text-dark mb-2">14 Modular Category CSS Files</h3>
                        <p class="text-muted text-sm mb-0">
                            Don't load 80KB if you only need 3KB. Include category stylesheets like <code>commerce.min.css</code> (4KB) or <code>interface.min.css</code> (13KB) independently.
                        </p>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card feature-card p-4 rounded-4 border h-100 shadow-2xs">
                        <div class="feature-icon-badge rounded-circle bg-primary-soft text-primary d-inline-flex align-items-center justify-content-center mb-3">
                            <i class="hi-bulb fs-3"></i>
                        </div>
                        <h3 class="h5 fw-bold text-dark mb-2">Modern AI &amp; Tech Brands</h3>
                        <p class="text-muted text-sm mb-0">
                            Built-in vector icons for Claude, Gemini, Antigravity, Cursor, Trae, Windsurf, React, Vue, Vite, TypeScript, and modern developer tooling.
                        </p>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card feature-card p-4 rounded-4 border h-100 shadow-2xs">
                        <div class="feature-icon-badge rounded-circle bg-primary-soft text-primary d-inline-flex align-items-center justify-content-center mb-3">
                            <i class="hi-javascript fs-3"></i>
                        </div>
                        <h3 class="h5 fw-bold text-dark mb-2">React &amp; Vue 3 Native</h3>
                        <p class="text-muted text-sm mb-0">
                            Pre-built React and Vue 3 component modules with complete TypeScript types, zero runtime dependencies, and automatic unplugin resolver support.
                        </p>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card feature-card p-4 rounded-4 border h-100 shadow-2xs">
                        <div class="feature-icon-badge rounded-circle bg-primary-soft text-primary d-inline-flex align-items-center justify-content-center mb-3">
                            <i class="hi-monitor fs-3"></i>
                        </div>
                        <h3 class="h5 fw-bold text-dark mb-2">Multi-Format Suite</h3>
                        <p class="text-muted text-sm mb-0">
                            Shipped with WOFF2, WOFF, TTF, and EOT webfonts, individual tree-shakeable SVG files, SCSS mixins, and Less source files.
                        </p>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card feature-card p-4 rounded-4 border h-100 shadow-2xs">
                        <div class="feature-icon-badge rounded-circle bg-primary-soft text-primary d-inline-flex align-items-center justify-content-center mb-3">
                            <i class="hi-check-circle fs-3 text-success"></i>
                        </div>
                        <h3 class="h5 fw-bold text-dark mb-2">100% Free &amp; Open Source</h3>
                        <p class="text-muted text-sm mb-0">
                            Published under the permissive GPL-3.0 license. Free to use in personal, open-source, client, and enterprise commercial applications.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Categories Showcase Grid Section -->
    <section id="categories" class="py-5 bg-light border-bottom">
        <div class="container">
            <div class="text-center mb-5">
                <div class="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill bg-primary-soft text-primary fw-medium text-xs mb-2 border border-primary-subtle">
                    <i class="hi-bullet-list"></i>
                    <span>Categorized Architecture</span>
                </div>
                <h2 class="display-6 fw-extrabold text-dark mb-2">Browse by Category</h2>
                <p class="lead text-muted mx-auto header-subtitle-constrained">
                    Each category is organized with dedicated documentation, CSS bundle, and SCSS source file.
                </p>
            </div>

            <div class="row g-4">
${categoryCardsHtml}
            </div>
        </div>
    </section>

    <!-- Start & Setup Hub Section (Inspired by FontAwesome /start) -->
    <section id="start" class="py-5 bg-white border-bottom">
        <div class="container">
            <div class="text-center mb-5">
                <div class="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill bg-primary-soft text-primary fw-medium text-xs mb-2 border border-primary-subtle">
                    <i class="hi-play"></i>
                    <span>Quickstart Guide</span>
                </div>
                <h2 class="display-6 fw-extrabold text-dark mb-2">Set Up Haticons in Seconds</h2>
                <p class="lead text-muted mx-auto mb-4 header-subtitle-constrained">
                    Choose the workflow that fits your project. Embed with a single line of CDN code, install via your package manager, or use offline vector assets in Figma.
                </p>

                <!-- Method Switcher Pills -->
                <div class="d-inline-flex flex-wrap p-1 rounded-pill bg-light border shadow-2xs gap-1" id="setupTabGroup">
                    <button type="button" class="btn btn-sm rounded-pill px-3 start-method-tab active" data-target="#tab-npm">
                        <i class="hi-npm me-1"></i> npm Package
                    </button>
                    <button type="button" class="btn btn-sm rounded-pill px-3 start-method-tab text-muted" data-target="#tab-cdn">
                        <i class="hi-cloudflare me-1"></i> Web CDN
                    </button>
                    <button type="button" class="btn btn-sm rounded-pill px-3 start-method-tab text-muted" data-target="#tab-frameworks">
                        <i class="hi-javascript me-1"></i> React &amp; Vue
                    </button>
                    <button type="button" class="btn btn-sm rounded-pill px-3 start-method-tab text-muted" data-target="#tab-desktop">
                        <i class="hi-monitor me-1"></i> Desktop &amp; SVG
                    </button>
                </div>
            </div>

            <!-- Tab 1: npm Package Manager -->
            <div class="setup-tab-pane" id="tab-npm">
                <div class="row g-4">
                    <div class="col-12 col-md-4">
                        <div class="card p-3 rounded-4 bg-light border start-setup-card shadow-2xs">
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <i class="hi-npm fs-2 text-danger"></i>
                                <h3 class="h5 fw-bold text-dark mb-0">npm</h3>
                            </div>
                            <p class="text-muted text-xs mb-2">Install in any Node, Webpack, or Vite project:</p>
                            <div class="install-code-box p-2 rounded-3 bg-white font-monospace text-xs text-dark d-flex align-items-center justify-content-between mb-2 border">
                                <span>npm install haticons</span>
                                <button class="btn btn-sm btn-ghost text-muted copy-btn" data-copy="npm install haticons">
                                    <i class="hi-paste"></i>
                                </button>
                            </div>
                            <div class="text-muted text-2xs">Includes TypeScript <code>index.d.ts</code> declarations out of the box.</div>
                        </div>
                    </div>

                    <div class="col-12 col-md-4">
                        <div class="card p-3 rounded-4 bg-light border start-setup-card shadow-2xs">
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <i class="hi-yarn fs-2 text-info"></i>
                                <h3 class="h5 fw-bold text-dark mb-0">Yarn</h3>
                            </div>
                            <p class="text-muted text-xs mb-2">Add as project dependency using Yarn:</p>
                            <div class="install-code-box p-2 rounded-3 bg-white font-monospace text-xs text-dark d-flex align-items-center justify-content-between mb-2 border">
                                <span>yarn add haticons</span>
                                <button class="btn btn-sm btn-ghost text-muted copy-btn" data-copy="yarn add haticons">
                                    <i class="hi-paste"></i>
                                </button>
                            </div>
                            <div class="text-muted text-2xs">Fast, reproducible dependencies with package lock support.</div>
                        </div>
                    </div>

                    <div class="col-12 col-md-4">
                        <div class="card p-3 rounded-4 bg-light border start-setup-card shadow-2xs">
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <i class="hi-archive fs-2 text-warning"></i>
                                <h3 class="h5 fw-bold text-dark mb-0">pnpm</h3>
                            </div>
                            <p class="text-muted text-xs mb-2">Disk-space efficient symlinked install:</p>
                            <div class="install-code-box p-2 rounded-3 bg-white font-monospace text-xs text-dark d-flex align-items-center justify-content-between mb-2 border">
                                <span>pnpm add haticons</span>
                                <button class="btn btn-sm btn-ghost text-muted copy-btn" data-copy="pnpm add haticons">
                                    <i class="hi-paste"></i>
                                </button>
                            </div>
                            <div class="text-muted text-2xs">Saves gigabytes of node_modules disk space across monorepos.</div>
                        </div>
                    </div>
                </div>

                <div class="mt-4 p-4 rounded-4 bg-white border shadow-2xs">
                    <h4 class="h6 fw-bold text-dark mb-2">Bundler &amp; Framework Integration (Vite, Webpack, Next.js):</h4>
                    <p class="text-muted text-sm">
                        Import CSS or individual tree-shakeable SVG icons directly in your JavaScript / TypeScript files:
                    </p>
                    <div class="row g-3">
                        <div class="col-12 col-lg-6">
                            <div class="code-snippet-box">
                                <div class="code-snippet-header">
                                    <span class="code-lang-label"><i class="hi-css3"></i> CSS / Webfont Import</span>
                                    <button type="button" class="code-copy-btn" data-code="import 'haticons/dist/css/haticons.min.css';">
                                        <i class="hi-paste"></i> <span>Copy</span>
                                    </button>
                                </div>
                                <pre class="code-snippet-body"><code><span class="code-token-comment">// In your index.js / main.ts entry:</span>
<span class="code-token-keyword">import</span> <span class="code-token-string">'haticons/dist/css/haticons.min.css'</span>;</code></pre>
                            </div>
                        </div>
                        <div class="col-12 col-lg-6">
                            <div class="code-snippet-box">
                                <div class="code-snippet-header">
                                    <span class="code-lang-label"><i class="hi-html5"></i> Tree-Shakeable SVG</span>
                                    <button type="button" class="code-copy-btn" data-code="import cart from 'haticons/icons/cart';">
                                        <i class="hi-paste"></i> <span>Copy</span>
                                    </button>
                                </div>
                                <pre class="code-snippet-body"><code><span class="code-token-comment">// Zero webfont overhead:</span>
<span class="code-token-keyword">import</span> cart <span class="code-token-keyword">from</span> <span class="code-token-string">'haticons/icons/cart'</span>;
<span class="code-token-comment">// cart.svg &amp; cart.path available</span></code></pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab 2: Web CDN -->
            <div class="setup-tab-pane d-none" id="tab-cdn">
                <div class="row g-4 align-items-stretch">
                    <div class="col-12 col-lg-7">
                        <div class="card p-4 rounded-4 bg-light border shadow-2xs">
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <span class="start-step-number bg-primary text-white d-inline-flex align-items-center justify-content-center shadow-xs">1</span>
                                <h3 class="h5 fw-bold text-dark mb-0">Add Stylesheet to &lt;head&gt;</h3>
                            </div>
                            <p class="text-muted text-sm">
                                Paste this single line inside your HTML <code>&lt;head&gt;</code> to immediately access all ${totalIcons} icons:
                            </p>
                            <div class="code-snippet-box mb-4">
                                <div class="code-snippet-header">
                                    <span class="code-lang-label"><i class="hi-cloudflare"></i> HTML Head</span>
                                    <button type="button" class="code-copy-btn" data-code='&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/haticons@${VERSION}/dist/css/haticons.min.css"&gt;'>
                                        <i class="hi-paste"></i> <span>Copy Snippet</span>
                                    </button>
                                </div>
                                <pre class="code-snippet-body"><code><span class="code-token-punct">&lt;</span><span class="code-token-tag">link</span> <span class="code-token-attr">rel</span><span class="code-token-punct">=</span><span class="code-token-string">"stylesheet"</span> <span class="code-token-attr">href</span><span class="code-token-punct">=</span><span class="code-token-string">"https://cdn.jsdelivr.net/npm/haticons@${VERSION}/dist/css/haticons.min.css"</span><span class="code-token-punct">&gt;</span></code></pre>
                            </div>

                            <div class="d-flex align-items-center gap-2 mb-2">
                                <span class="start-step-number bg-primary text-white d-inline-flex align-items-center justify-content-center shadow-xs">2</span>
                                <h3 class="h5 fw-bold text-dark mb-0">Drop Icons into HTML</h3>
                            </div>
                            <p class="text-muted text-sm">
                                Place icon tags anywhere in your layout. Supports default, Fill, Outline, and Sharp styles:
                            </p>
                            <div class="code-snippet-box">
                                <div class="code-snippet-header">
                                    <span class="code-lang-label"><i class="hi-html5"></i> HTML Body</span>
                                    <button type="button" class="code-copy-btn" data-code='&lt;i class="hi-cart"&gt;&lt;/i&gt;
&lt;i class="hi-heart-fill text-danger fs-2"&gt;&lt;/i&gt;
&lt;i class="hi-search-outline text-primary fs-2"&gt;&lt;/i&gt;
&lt;i class="hi-refresh hi-spin"&gt;&lt;/i&gt;'>
                                        <i class="hi-paste"></i> <span>Copy</span>
                                    </button>
                                </div>
                                <pre class="code-snippet-body"><code><span class="code-token-punct">&lt;</span><span class="code-token-tag">i</span> <span class="code-token-attr">class</span><span class="code-token-punct">=</span><span class="code-token-string">"hi-cart"</span><span class="code-token-punct">&gt;&lt;/</span><span class="code-token-tag">i</span><span class="code-token-punct">&gt;</span>
<span class="code-token-punct">&lt;</span><span class="code-token-tag">i</span> <span class="code-token-attr">class</span><span class="code-token-punct">=</span><span class="code-token-string">"hi-heart-fill text-danger fs-2"</span><span class="code-token-punct">&gt;&lt;/</span><span class="code-token-tag">i</span><span class="code-token-punct">&gt;</span>
<span class="code-token-punct">&lt;</span><span class="code-token-tag">i</span> <span class="code-token-attr">class</span><span class="code-token-punct">=</span><span class="code-token-string">"hi-search-outline text-primary fs-2"</span><span class="code-token-punct">&gt;&lt;/</span><span class="code-token-tag">i</span><span class="code-token-punct">&gt;</span>
<span class="code-token-punct">&lt;</span><span class="code-token-tag">i</span> <span class="code-token-attr">class</span><span class="code-token-punct">=</span><span class="code-token-string">"hi-refresh hi-spin"</span><span class="code-token-punct">&gt;&lt;/</span><span class="code-token-tag">i</span><span class="code-token-punct">&gt;</span></code></pre>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-lg-5">
                        <div class="card p-4 rounded-4 bg-white border d-flex flex-column justify-content-between shadow-2xs">
                            <div>
                                <div class="d-flex align-items-center gap-1 mb-2">
                                    <span class="badge bg-primary text-white rounded-pill px-3 py-1 text-xs fw-bold">Live Preview</span>
                                </div>
                                <h4 class="h5 fw-bold text-dark mb-2">Interactive Icon Demo</h4>
                                <p class="text-muted text-sm mb-3">
                                    Icons render crisp vector typography instantly, inheriting currentColor and font sizing.
                                </p>
                                <div class="p-3 rounded-4 bg-light border text-center mb-3">
                                    <div class="d-flex align-items-center justify-content-center gap-3 mb-2">
                                        <div class="text-center">
                                            <i class="hi-cart fs-1 text-primary d-block mb-1"></i>
                                            <span class="text-2xs text-muted font-monospace">hi-cart</span>
                                        </div>
                                        <div class="text-center">
                                            <i class="hi-heart-fill fs-1 text-danger d-block mb-1"></i>
                                            <span class="text-2xs text-muted font-monospace">hi-heart-fill</span>
                                        </div>
                                        <div class="text-center">
                                            <i class="hi-star-outline fs-1 text-warning d-block mb-1"></i>
                                            <span class="text-2xs text-muted font-monospace">hi-star-outline</span>
                                        </div>
                                        <div class="text-center">
                                            <i class="hi-refresh hi-spin fs-1 text-success d-block mb-1"></i>
                                            <span class="text-2xs text-muted font-monospace">hi-spin</span>
                                        </div>
                                    </div>
                                    <span class="badge bg-white text-muted border text-2xs rounded-pill px-3 py-1">Auto-rendered via Haticons webfont</span>
                                </div>
                            </div>
                            <div class="d-flex gap-2">
                                <a href="/reference.html" class="btn btn-primary rounded-pill btn-sm px-2 flex-fill text-center">
                                    <i class="hi-search me-1"></i> Browse Reference
                                </a>
                                <a href="/tutorial.html" class="btn btn-outline-secondary rounded-pill btn-sm px-2 flex-fill text-center bg-white">
                                    <i class="hi-bulb me-1"></i> Full Tutorial
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab 3: Frameworks (React, Vue, Angular) -->
            <div class="setup-tab-pane d-none" id="tab-frameworks">
                <div class="row g-4">
                    <div class="col-12 col-md-4">
                        <div class="card p-3 rounded-4 bg-light border shadow-2xs">
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <i class="hi-visualstudiocode fs-2 text-info"></i>
                                <h3 class="h5 fw-bold text-dark mb-0">React / Next.js</h3>
                            </div>
                            <p class="text-muted text-xs mb-2">Add to your root <code>pages/_app.js</code> or <code>app/layout.tsx</code>:</p>
                            <pre class="p-2 rounded bg-white border font-monospace text-2xs text-dark mb-2 user-select-all"><code>import 'haticons/dist/css/haticons.min.css';

export default function App() {
  return &lt;i className="hi-cart" /&gt;;
}</code></pre>
                            <span class="badge bg-primary-soft py-1 text-primary rounded-pill text-2xs">SSR &amp; Hydration Safe</span>
                        </div>
                    </div>

                    <div class="col-12 col-md-4">
                        <div class="card p-3 rounded-4 bg-light border shadow-2xs">
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <i class="hi-vue-js fs-2 text-success"></i>
                                <h3 class="h5 fw-bold text-dark mb-0">Vue 3 / Nuxt / Vite</h3>
                            </div>
                            <p class="text-muted text-xs mb-2">Include in your <code>main.js</code> or <code>nuxt.config.ts</code>:</p>
                            <pre class="p-2 rounded bg-white border font-monospace text-2xs text-dark mb-2 user-select-all"><code>import { createApp } from 'vue';
import 'haticons/css';
import App from './App.vue';

createApp(App).mount('#app');</code></pre>
                            <span class="badge bg-white py-1 text-success rounded-pill text-2xs border">Zero Config Needed</span>
                        </div>
                    </div>

                    <div class="col-12 col-md-4">
                        <div class="card p-3 rounded-4 bg-light border shadow-2xs">
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <i class="hi-angular fs-2 text-danger"></i>
                                <h3 class="h5 fw-bold text-dark mb-0">Angular</h3>
                            </div>
                            <p class="text-muted text-xs mb-2">Add stylesheet reference in <code>angular.json</code>:</p>
                            <pre class="p-2 rounded bg-white border font-monospace text-2xs text-dark mb-2 user-select-all"><code>"styles": [
  "node_modules/haticons/dist/css/haticons.min.css",
  "src/styles.css"
]</code></pre>
                            <span class="badge bg-white py-1 text-danger rounded-pill text-2xs border">Built into Angular CLI</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab 4: Desktop & Offline SVG Assets -->
            <div class="setup-tab-pane d-none" id="tab-desktop">
                <div class="row g-4">
                    <div class="col-12 col-md-6">
                        <div class="card p-4 rounded-4 bg-light border shadow-2xs">
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <i class="hi-download fs-2 text-primary"></i>
                                <h3 class="h5 fw-bold text-dark mb-0">Download Offline Bundle</h3>
                            </div>
                            <p class="text-muted text-sm">
                                Complete bundle containing all individual vector SVG files, compiled web fonts (WOFF2, TTF, EOT, WOFF), Sass sources, and minified CSS stylesheets.
                            </p>
                            <div class="d-flex flex-wrap gap-2 mb-3">
                                <a href="/download/haticons.zip" class="btn btn-primary rounded-pill px-3 d-inline-flex align-items-center gap-1 shadow-sm">
                                    <i class="hi-download"></i>
                                    <span>Download ZIP (~1.3MB)</span>
                                </a>
                            </div>
                            <div class="text-muted text-2xs">Version ${VERSION} &bull; Released under GPL-3.0 License</div>
                        </div>
                    </div>

                    <div class="col-12 col-md-6">
                        <div class="card p-4 rounded-4 bg-light border shadow-2xs">
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <i class="hi-paintbox fs-2 text-purple"></i>
                                <h3 class="h5 fw-bold text-dark mb-0">Figma, Sketch &amp; Illustrator</h3>
                            </div>
                            <p class="text-muted text-sm">
                                Install <code>dist/fonts/haticons.ttf</code> into macOS Font Book or Windows Fonts. Type icon glyphs directly or drag-and-drop vector SVGs into your design canvases.
                            </p>
                            <div class="p-2 bg-white rounded-3 border text-xs text-muted mb-2">
                                <strong>Tip:</strong> Copy Unicode codepoints directly from the <a href="/reference.html" class="text-primary fw-semibold">Reference</a> catalog to paste into design text layers.
                            </div>
                            <a href="/reference.html" class="btn btn-outline-secondary btn-sm rounded-pill px-3 bg-white">
                                <i class="hi-search me-1"></i> Open Reference
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>

    <!-- Interactive Icon Customizer Modal -->
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

${getFooter('home')}

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/boodoo@1.2.2/dist/js/boodoo.min.js"></script>
    <script type="text/javascript" src="/assets/js/theme.js"></script>
    <script type="text/javascript" src="/assets/js/custom.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT_DIR, 'code', 'index.html'), html);
console.log('code/index.html generated successfully using shared templates!');
