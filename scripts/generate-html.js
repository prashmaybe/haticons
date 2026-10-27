const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const icons = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'dist', 'data', 'icons.json'), 'utf-8'));
const categories = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'dist', 'data', 'categories.json'), 'utf-8'));

const catCounts = {};
icons.forEach(i => {
    const c = i.category || 'interface';
    catCounts[c] = (catCounts[c] || 0) + 1;
});

let categoryTabsHtml = `<button type="button" class="btn btn-sm rounded-pill category-filter-btn active btn-primary" data-category="all">All Icons (${icons.length})</button>\n`;
Object.keys(categories).sort().forEach(catKey => {
    const meta = categories[catKey];
    const cnt = catCounts[catKey] || 0;
    categoryTabsHtml += `<button type="button" class="btn btn-sm rounded-pill category-filter-btn btn-outline-secondary bg-white" data-category="${catKey}">${meta.name} (${cnt})</button>\n`;
});

let cardsHtml = '';
icons.forEach(i => {
    const cat = i.category || 'interface';
    const rawName = i.class.replace(/^hi-/, '');
    const contentEscaped = i.content.replace(/"/g, '&quot;');
    cardsHtml += `
    <div class="haticon-card text-center p-1 rounded-4 bg-white border" 
         data-class="${i.class}" 
         data-name="${rawName}" 
         data-category="${cat}" 
         data-unicode="${contentEscaped}"
         tags="${i.class.toLowerCase()} ${cat.toLowerCase()}"
         title="${i.class}">
        <div class="icon-glyph-wrap mb-2 d-flex align-items-center justify-content-center">
            <i class="${i.class} fs-2"></i>
        </div>
        <div class="icon-name-text text-truncate text-xs fw-medium text-dark">
            ${rawName}
        </div>
        <span class="badge bg-light text-muted border text-2xs mt-1 rounded-pill category-badge">
            ${cat}
        </span>
    </div>`;
});

const html = `<!DOCTYPE html>
<html lang="en" data-boodoo-theme="light">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link href="assets/images/favicon.png" rel="shortcut icon">
    <title>Haticons | Beautiful Free Vector &amp; Font Icons for Modern Apps</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="A set of 494+ beautifully crafted, modular free premium font icons and SVG icons for Web, iOS, Android, and Desktop apps. Styled with boodoo framework.">
    <meta name="keywords" content="haticons, haticon, font icons, icon fonts, web fonts, font awesome alternative, ionicons, glyphicons, svg icons, boodoo framework, boodoo css"/>
    <meta name="theme-color" content="#7c3aed">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

    <!-- boodoo CSS Framework -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boodoo@1.2.2/dist/css/boodoo.min.css">

    <!-- Haticons CSS -->
    <link rel="stylesheet" type="text/css" media="all" href="assets/css/haticons.min.css" />
    <link rel="stylesheet" type="text/css" media="all" href="assets/css/style.css" />
</head>

<body class="bg-light text-dark">

    <!-- Top Announcement Bar -->
    <div class="py-1 px-2 text-center bg-primary text-white text-sm fw-medium d-flex flex-wrap align-items-center justify-content-center gap-2">
        <span class="badge bg-white text-primary rounded-pill px-2 py-1 fw-bold">v1.0.0</span>
        <span>494+ Modular Vector &amp; Font Icons for Web, iOS, Android, and Desktop</span>
    </div>

    <!-- Main Navigation Header -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-1 shadow-xs">
        <div class="container d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-3">
                <a class="navbar-brand d-flex align-items-center gap-2 text-decoration-none me-0" href="#">
                    <span class="logo-icon-wrap d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-soft text-primary">
                        <i class="hi-haticons fs-4"></i>
                    </span>
                    <span class="fs-4 fw-bold text-dark tracking-tight">Haticons</span>
                </a>
            </div>
            <div class="d-flex align-items-center gap-2">
                <a href="#quickstart" class="btn btn-ghost text-muted d-none d-md-inline-flex align-items-center gap-1 ">
                    Quickstart
                </a>
                <a href="tutorial.html" class="btn btn-ghost text-muted d-inline-flex align-items-center gap-1 ">
                    <i class="hi-bulb"></i> Tutorial
                </a>
                <a href="reference.html" class="btn btn-ghost text-muted d-inline-flex align-items-center gap-1 ">
                    <i class="hi-document"></i> Reference
                </a>
                <a href="changelogs.html" class="btn btn-ghost text-muted d-none d-md-inline-flex align-items-center gap-1 ">
                    <i class="hi-time"></i> Changelogs
                </a>
                <a href="https://www.npmjs.com/package/haticons" target="_blank" rel="noopener" class="btn btn-primary btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-1 ">
                    <i class="hi-npm"></i>
                    <span>npm install</span>
                </a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section py-5 text-center position-relative overflow-hidden">
        <div class="container py-4 position-relative z-1">
            <div class="d-flex flex-wrap align-items-center justify-content-center gap-2 mb-3">
                <span class="px-3 py-1 rounded-pill bg-primary-soft text-primary fw-medium text-xs border border-primary-subtle d-inline-flex align-items-center gap-1 ">
                    <i class="hi-star"></i>
                    <span>494+ Modern Vector Icons</span>
                </span>
                <span class="px-3 py-1 rounded-pill bg-white text-muted fw-medium text-xs border shadow-2xs d-inline-flex align-items-center gap-1 ">
                    <i class="hi-check-circle text-success"></i>
                    <span>GPL-3.0 Open Source</span>
                </span>
            </div>
            
            <h1 class="display-4 fw-extrabold text-dark mb-3 hero-title">
                Beautifully Crafted <span class="text-gradient-purple">Font &amp; SVG Icons</span>
            </h1>
            
            <p class="lead text-muted mx-auto mb-4 hero-subtitle" style="max-width: 680px;">
                A super-optimized, modular icon suite for Web, iOS, Android, and Desktop apps. Inspired by <strong>Ionicons</strong>, <strong>FontAwesome</strong>, and <strong>Glyphicons</strong>.
            </p>

            <div class="d-flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                <a href="#cheatsheet" class="btn btn-primary btn-lg rounded-pill px-4 shadow-sm d-inline-flex align-items-center gap-2">
                    <i class="hi-search"></i>
                    <span>Browse 494 Icons</span>
                </a>
                <a href="download/haticons.zip" class="btn btn-outline-secondary btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2 bg-white">
                    <i class="hi-download"></i>
                    <span>Download ZIP</span>
                </a>
            </div>

            <!-- Install / CDN Pills -->
            <div class="install-bar mx-auto p-2 bg-white rounded-4 border shadow-sm d-flex flex-column flex-md-row align-items-center gap-2" style="max-width: 720px;">
                <div class="install-code-box flex-grow-1 px-3 py-2 text-start font-monospace text-xs text-dark w-100 rounded-3 bg-light d-flex align-items-center justify-content-between">
                    <span class="user-select-all" id="npmCmd">npm install haticons</span>
                    <button class="btn btn-sm btn-ghost text-muted py-0 px-2 copy-btn" data-copy="npm install haticons" title="Copy command">
                        <i class="hi-paste"></i>
                    </button>
                </div>
                <div class="install-code-box flex-grow-1 px-3 py-2 text-start font-monospace text-xs text-dark w-100 rounded-3 bg-light d-flex align-items-center justify-content-between">
                    <span class="user-select-all text-truncate" id="cdnUrl">https://cdn.jsdelivr.net/npm/haticons@1.0.0/dist/css/haticons.min.css</span>
                    <button class="btn btn-sm btn-ghost text-muted py-0 px-2 copy-btn" data-copy="https://cdn.jsdelivr.net/npm/haticons@1.0.0/dist/css/haticons.min.css" title="Copy CDN URL">
                        <i class="hi-paste"></i>
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Quickstart & Features Section -->
    <section id="quickstart" class="py-5 bg-white border-top border-bottom">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="h3 fw-bold text-dark">Why Haticons?</h2>
                <p class="text-muted">Modular like Ionicons &amp; FontAwesome, lightweight, customizable, and ready for any stack.</p>
            </div>

            <div class="row g-4">
                <div class="col-12 col-md-4">
                    <div class="card h-100 p-4 border rounded-4 feature-card shadow-xs">
                        <div class="feature-icon-badge rounded-3 bg-primary-soft text-primary mb-3 d-inline-flex align-items-center justify-content-center">
                            <i class="hi-stack fs-3"></i>
                        </div>
                        <h3 class="h5 fw-bold text-dark mb-2">Modular Category Imports</h3>
                        <p class="text-muted text-sm mb-3">
                            You don't need the entire icon set! Load only what your app uses—such as <code>commerce.min.css</code> (1.5 KB) or <code>directional.min.css</code> (1.5 KB).
                        </p>
                        <div class="p-2 bg-light rounded font-monospace text-xs text-dark">
                            @import "haticons/scss/categories/commerce";
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-4">
                    <div class="card h-100 p-4 border rounded-4 feature-card shadow-xs">
                        <div class="feature-icon-badge rounded-3 bg-purple-soft text-purple mb-3 d-inline-flex align-items-center justify-content-center">
                            <i class="hi-npm fs-3"></i>
                        </div>
                        <h3 class="h5 fw-bold text-dark mb-2">Full npm &amp; Sass Package</h3>
                        <p class="text-muted text-sm mb-3">
                            Includes TypeScript definitions (<code>index.d.ts</code>), icon querying utilities, raw SCSS partials, and production-minified bundles.
                        </p>
                        <div class="p-2 bg-light rounded font-monospace text-xs text-dark">
                            import { getIcon } from 'haticons';
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-4">
                    <div class="card h-100 p-4 border rounded-4 feature-card shadow-xs">
                        <div class="feature-icon-badge rounded-3 bg-green-soft text-success mb-3 d-inline-flex align-items-center justify-content-center">
                            <i class="hi-bulb fs-3"></i>
                        </div>
                        <h3 class="h5 fw-bold text-dark mb-2">Framework &amp; UI Friendly</h3>
                        <p class="text-muted text-sm mb-3">
                            Engineered to blend seamlessly with modern UI frameworks, responsive layouts, buttons, navbars, cards, modals, and search inputs.
                        </p>
                        <div class="p-2 bg-light rounded font-monospace text-xs text-dark">
                            &lt;button class="btn btn-primary"&gt;
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Interactive Cheatsheet Section -->
    <section id="cheatsheet" class="py-5">
        <div class="container">
            <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                <div>
                    <h2 class="h3 fw-bold text-dark mb-1">Interactive Icon Cheatsheet</h2>
                    <p class="text-muted text-sm mb-0">Search 494 icons by name, filter by category, or click any icon to copy HTML/CSS code.</p>
                </div>
                
                <!-- Search Input Bar -->
                <div class="search-input-wrap position-relative" style="min-width: 300px;">
                    <i class="hi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input type="text" id="iconSearchInput" name="search-haticon" class="form-control rounded-pill ps-5 pe-4 py-2" placeholder="Search by name, brand, action...">
                </div>
            </div>

            <!-- Categories Tabs -->
            <div id="categories" class="category-tabs-wrap mb-4 overflow-auto pb-2">
                <div class="d-flex align-items-center gap-2 category-pill-group">
                    ${categoryTabsHtml}
                </div>
            </div>

            <!-- Results Count & Active Category Info -->
            <div class="d-flex align-items-center justify-content-between text-xs text-muted mb-3 px-1">
                <div>
                    Showing <span id="visibleCount" class="fw-bold text-dark">${icons.length}</span> icons
                </div>
                <div>
                    <span class="text-muted">Click an icon card to inspect &amp; copy snippet</span>
                </div>
            </div>

            <!-- Icons Grid -->
            <div class="haticons-set-grid" id="iconsGrid">
                ${cardsHtml}
            </div>

            <div id="noResults" class="text-center py-5 d-none">
                <i class="hi-search fs-1 text-muted mb-3 d-block"></i>
                <h4 class="h5 text-dark fw-bold">No icons found</h4>
                <p class="text-muted text-sm">Try searching for keywords like "arrow", "cart", "play", or "mail".</p>
                <button class="btn btn-outline-primary btn-sm rounded-pill" id="resetSearchBtn">Reset Filters</button>
            </div>
        </div>
    </section>

    <!-- Icon Detail Modal (boodoo styled) -->
    <div class="modal fade" id="iconDetailModal" tabindex="-1" aria-labelledby="modalIconTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-4 border-0 shadow-lg">
                <div class="modal-header border-bottom px-4 pt-4 pb-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="modal-icon-preview rounded-3 bg-primary-soft text-primary d-inline-flex align-items-center justify-content-center" style="width: 56px; height: 56px;">
                            <i id="modalGlyph" class="hi-haticons fs-1"></i>
                        </div>
                        <div>
                            <h3 class="modal-title h5 fw-bold text-dark mb-0" id="modalIconTitle">hi-haticons</h3>
                            <span class="badge bg-primary-subtle text-primary rounded-pill text-xs" id="modalCategoryBadge">interface</span>
                        </div>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" data-boodoo-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body px-4 py-3">
                    <div class="mb-3">
                        <label class="form-label text-xs fw-bold text-muted text-uppercase tracking-wider">HTML Usage</label>
                        <div class="input-group">
                            <input type="text" class="form-control font-monospace text-xs bg-light" id="modalHtmlCode" readonly>
                            <button class="btn btn-outline-primary btn-sm copy-modal-btn" data-target="#modalHtmlCode">
                                <i class="hi-paste me-1"></i> Copy
                            </button>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label text-xs fw-bold text-muted text-uppercase tracking-wider">CSS Content / Codepoint</label>
                        <div class="input-group">
                            <input type="text" class="form-control font-monospace text-xs bg-light" id="modalCssCode" readonly>
                            <button class="btn btn-outline-primary btn-sm copy-modal-btn" data-target="#modalCssCode">
                                <i class="hi-paste me-1"></i> Copy
                            </button>
                        </div>
                    </div>

                    <div class="p-3 rounded-3 bg-light border text-xs">
                        <div class="fw-bold text-dark mb-1">Modular Category Import:</div>
                        <div class="text-muted font-monospace text-2xs mb-2" id="modalCategoryLink">
                            dist/css/categories/interface.min.css
                        </div>
                        <div class="text-muted">
                            Only need this category? Import <code>&lt;link rel="stylesheet" href=".../interface.min.css"&gt;</code> without loading the rest!
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-top px-4 py-3 bg-light rounded-bottom-4">
                    <button type="button" class="btn btn-primary btn-sm rounded-pill px-4" data-bs-dismiss="modal" data-boodoo-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notification for Copy -->
    <div id="copyToast" class="copy-toast d-none">
        <i class="hi-check-circle me-1"></i> Copied to clipboard!
    </div>

    <!-- Footer -->
    <footer class="py-5 bg-white border-top text-center">
        <div class="container">
            <div class="d-flex align-items-center justify-content-center gap-2 mb-2">
                <span class="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-soft text-primary" style="width: 32px; height: 32px;">
                    <i class="hi-haticons fs-5"></i>
                </span>
                <span class="fs-5 fw-bold text-dark">Haticons</span>
            </div>
            <p class="text-xs text-muted mb-3">
                An open-source icon system by <strong class="text-dark">PebbleBenders</strong> &middot; Made with <a href="https://www.boodooframework.com/" class="text-primary fw-semibold" target="_blank" rel="noopener">boodoo Framework</a>
            </p>
            <p class="text-muted text-sm mx-auto mb-3" style="max-width: 520px;">
                494 free vector font icons. Distributed as an npm package with modular category stylesheets and Sass sources.
            </p>
            <div class="d-flex flex-wrap align-items-center justify-content-center gap-3 text-sm text-muted mb-4">
                <a href="tutorial.html" class="text-decoration-none text-muted">
                    <i class="hi-bulb me-1"></i> Tutorial
                </a>
                <span>&bull;</span>
                <a href="reference.html" class="text-decoration-none text-muted">
                    <i class="hi-document me-1"></i> Reference
                </a>
                <span>&bull;</span>
                <a href="changelogs.html" class="text-decoration-none text-muted">
                    <i class="hi-time me-1"></i> Changelogs
                </a>
                <span>&bull;</span>
                <a href="https://www.npmjs.com/package/haticons" class="text-decoration-none text-muted" target="_blank" rel="noopener">
                    <i class="hi-npm me-1"></i> npm package
                </a>
                <span>&bull;</span>
                <a href="https://www.boodooframework.com/" class="text-decoration-none text-primary fw-semibold" target="_blank" rel="noopener">
                    <i class="hi-link me-1"></i> Made with boodoo
                </a>
                <span>&bull;</span>
                <span class="text-dark fw-medium">
                    <i class="hi-user me-1"></i> PebbleBenders
                </span>
                <span>&bull;</span>
                <a href="download/haticons.zip" class="text-decoration-none text-muted">
                    <i class="hi-download me-1"></i> Download ZIP
                </a>
            </div>
            <p class="text-xs text-muted mb-0">
                Released under GPL-3.0 License &middot; Designed &amp; Crafted by <strong class="text-dark">PebbleBenders</strong> &middot; Made with <a href="https://www.boodooframework.com/" class="text-primary fw-medium" target="_blank" rel="noopener">boodoo</a>
            </p>
        </div>
    </footer>

    <!-- boodoo JavaScript Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/boodoo@1.2.2/dist/js/boodoo.min.js"></script>
    <script type="text/javascript" src="assets/js/jquery.js"></script>
    <script type="text/javascript" src="assets/js/custom.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT_DIR, 'code', 'index.html'), html);
console.log('code/index.html generated successfully!');
