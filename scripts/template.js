const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const PKG = require('../package.json');
const VERSION = PKG.version;
const ICONS_PATH = path.join(ROOT_DIR, 'dist', 'data', 'icons.json');
const CATEGORIES_PATH = path.join(ROOT_DIR, 'dist', 'data', 'categories.json');

function loadIcons() {
    if (fs.existsSync(ICONS_PATH)) {
        return JSON.parse(fs.readFileSync(ICONS_PATH, 'utf-8'));
    }
    return JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'code', 'data', 'icons.json'), 'utf-8'));
}

function loadCategories() {
    if (fs.existsSync(CATEGORIES_PATH)) {
        return JSON.parse(fs.readFileSync(CATEGORIES_PATH, 'utf-8'));
    }
    return {};
}

/**
 * Common HTML Head
 */
function getHtmlHead(title, description, keywords, canonicalPath = '') {
    return `    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link href="/assets/images/favicon.png" rel="shortcut icon">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${description}">
    ${keywords ? `<meta name="keywords" content="${keywords}" />` : ''}
    <meta name="theme-color" content="#7c3aed">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

    <!-- boodoo CSS Framework -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boodoo@1.3.0/dist/css/boodoo.min.css">

    <!-- Haticons CSS -->
    <link rel="stylesheet" type="text/css" media="all" href="/assets/css/haticons.min.css" />
    <link rel="stylesheet" type="text/css" media="all" href="/assets/css/style.css?v=1.3.0" />
    <script>
        (function () {
            var t = localStorage.getItem('haticons_theme_preference') || 'system';
            var d = t === 'system' ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : t;
            document.documentElement.setAttribute('data-theme', d);
            document.documentElement.setAttribute('data-boodoo-theme', d);
            document.documentElement.setAttribute('data-theme-setting', t);
        })();
    </script>`;
}

/**
 * Top Announcement Bar
 */
function getAnnouncementBar() {
    const count = loadIcons().length;
    return `    <!-- Top Announcement Bar -->
    <div class="py-1 px-3 text-center bg-primary text-white text-sm fw-medium d-flex flex-wrap align-items-center justify-content-center gap-2 top-announcement-bar">
        <span class="badge bg-white text-primary rounded-pill px-2 py-05 fw-bold">v${VERSION}</span>
        <span>${count}+ Modular Vector &amp; Font Icons for Web, iOS, Android, and Desktop</span>
        <span class="d-none d-md-inline text-white-50">&bull;</span>
        <span class="d-none d-md-inline text-white-50">Free &amp; Open Source (GPL-3.0)</span>
    </div>`;
}

/**
 * Main Navigation Bar
 * @param {'home'|'icons'|'playground'|'tutorial'|'reference'|'changelogs'|'terms'|'privacy'|'license'|'other'} activePage
 */
function getNavbar(activePage = 'home') {
    const isHome = activePage === 'home';
    const isIcons = activePage === 'icons';
    const isPlayground = activePage === 'playground';
    const isTutorial = activePage === 'tutorial';
    const isReference = activePage === 'reference';
    const isChangelogs = activePage === 'changelogs';

    return `    <!-- Main Navigation Header -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-2 shadow-xs" id="mainHeaderNav">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center gap-2 text-decoration-none me-3 me-xl-4 flex-shrink-0" href="/">
                <span class="logo-icon-wrap d-inline-flex align-items-center justify-content-center rounded-3 bg-primary-soft text-primary">
                    <i class="hi-haticons fs-4"></i>
                </span>
                <span class="fs-4 fw-bold text-dark tracking-tight">Haticons</span>
            </a>

            <!-- Mobile Controls (Subset + Theme Toggle + Navbar Toggler) -->
            <div class="d-flex align-items-center gap-1 d-lg-none">
                <button type="button" class="btn btn-ghost p-1 text-muted nav-subset-btn" aria-label="Open custom subset tray" title="Subset tray">
                    <i class="hi-archive fs-5"></i>
                    <span class="badge bg-primary text-white rounded-pill px-1 text-2xs nav-subset-count">0</span>
                </button>
                <button type="button" class="theme-toggle-btn" aria-label="Toggle color theme" title="Toggle theme (System / Light / Dark)">
                    <i class="hi-sun theme-toggle-icon fs-5"></i>
                </button>
                <button class="navbar-toggler border-0 p-2" type="button" data-boodoo-toggle="collapse" data-boodoo-target="#mainNavbarCollapse" aria-controls="mainNavbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>

            <!-- Collapsible Navigation Menu -->
            <div class="collapse navbar-collapse justify-content-between mt-2 mt-lg-0" id="mainNavbarCollapse">
                <div class="navbar-nav d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-lg-2 gap-xl-3 py-2 py-lg-0">
                    <a href="/icons.html" class="nav-link-btn btn btn-ghost ${isIcons ? 'text-primary fw-semibold' : 'text-muted'} d-inline-flex align-items-center justify-content-start justify-content-lg-center gap-2">
                        <i class="hi-search"></i>
                        <span>Icons</span>
                    </a>
                    <a href="/playground.html" class="nav-link-btn btn btn-ghost ${isPlayground ? 'text-primary fw-semibold' : 'text-muted'} d-inline-flex align-items-center justify-content-start justify-content-lg-center gap-2">
                        <i class="hi-paintbox"></i>
                        <span>Playground</span>
                    </a>
                    <a href="/tutorial.html" class="nav-link-btn btn btn-ghost ${isTutorial ? 'text-primary fw-semibold' : 'text-muted'} d-inline-flex align-items-center justify-content-start justify-content-lg-center gap-2">
                        <i class="hi-bulb"></i>
                        <span>Docs &amp; Setup</span>
                    </a>
                    <a href="/reference.html" class="nav-link-btn btn btn-ghost ${isReference ? 'text-primary fw-semibold' : 'text-muted'} d-inline-flex align-items-center justify-content-start justify-content-lg-center gap-2">
                        <i class="hi-document"></i>
                        <span>Reference</span>
                    </a>
                    <a href="/changelogs.html" class="nav-link-btn btn btn-ghost ${isChangelogs ? 'text-primary fw-semibold' : 'text-muted'} d-inline-flex align-items-center justify-content-start justify-content-lg-center gap-2">
                        <i class="hi-time"></i>
                        <span>Changelogs</span>
                    </a>
                </div>

                <!-- Desktop Actions -->
                <div class="d-none d-lg-flex align-items-center gap-2 ms-lg-auto">
                    <button type="button" class="btn btn-ghost text-muted px-2 py-1 nav-subset-btn d-inline-flex align-items-center gap-1" title="Open custom subset tray" aria-label="Open custom subset tray">
                        <i class="hi-archive fs-5"></i>
                        <span class="badge bg-primary text-white rounded-pill px-2 py-05 text-2xs nav-subset-count">0</span>
                    </button>
                    <button type="button" class="theme-toggle-btn" aria-label="Toggle color theme" title="Toggle theme (System / Light / Dark)">
                        <i class="hi-sun theme-toggle-icon fs-5"></i>
                    </button>
                    <a href="https://github.com/prashmaybe/haticons" target="_blank" rel="noopener" class="btn btn-ghost text-muted p-2 rounded-circle d-inline-flex align-items-center justify-content-center" title="View on GitHub" aria-label="View on GitHub">
                        <i class="hi-github fs-5"></i>
                    </a>
                    <a href="https://www.npmjs.com/package/haticons" target="_blank" rel="noopener" class="btn btn-primary btn-sm rounded-pill px-3 py-1 d-inline-flex align-items-center justify-content-center gap-1 ms-1">
                        <i class="hi-npm"></i>
                        <span>npm</span>
                    </a>
                </div>

                <!-- Mobile-Only Extra Actions in Dropdown -->
                <div class="d-flex d-lg-none align-items-center gap-2 pt-2 mt-2 border-top">
                    <a href="https://github.com/prashmaybe/haticons" target="_blank" rel="noopener" class="btn btn-outline-secondary btn-sm rounded-pill flex-fill d-inline-flex align-items-center justify-content-center gap-1">
                        <i class="hi-github"></i> GitHub
                    </a>
                    <a href="https://www.npmjs.com/package/haticons" target="_blank" rel="noopener" class="btn btn-primary btn-sm rounded-pill flex-fill d-inline-flex align-items-center justify-content-center gap-1">
                        <i class="hi-npm"></i> npm
                    </a>
                </div>
            </div>
        </div>
    </nav>`;
}

/**
 * Shared Global Footer
 * @param {'home'|'tutorial'|'reference'|'changelogs'|'terms'|'privacy'|'license'|'other'} activePage
 */
function getFooter(activePage = 'home') {
    const count = loadIcons().length;
    return `    <!-- Footer -->
    <footer class="py-5 bg-white border-top">
        <div class="container">
            <div class="row g-4 mb-4">
                <div class="col-12 col-md-4">
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <span class="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-soft text-primary icon-badge-sm">
                            <i class="hi-haticons fs-5"></i>
                        </span>
                        <span class="fs-5 fw-bold text-dark">Haticons</span>
                    </div>
                    <p class="text-muted text-sm mb-3">
                        A beautifully crafted, modular open-source icon suite featuring ${count}+ vector and webfont icons for modern Web, iOS, Android, and Desktop apps.
                    </p>
                    <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
                        <a href="https://github.com/prashmaybe/haticons" target="_blank" rel="noopener" class="btn btn-outline-secondary btn-sm rounded-pill px-2 d-inline-flex align-items-center gap-1" title="GitHub Repository">
                            <i class="hi-github"></i> GitHub
                        </a>
                        <a href="https://www.npmjs.com/package/haticons" target="_blank" rel="noopener" class="btn btn-outline-secondary btn-sm rounded-pill px-2 d-inline-flex align-items-center gap-1" title="npm Package">
                            <i class="hi-npm text-danger"></i> npm
                        </a>
                        <a href="/download/haticons.zip" class="btn btn-primary btn-sm rounded-pill px-2 d-inline-flex align-items-center gap-1">
                            <i class="hi-download"></i> Download ZIP
                        </a>
                    </div>
                </div>
                <div class="col-6 col-md-2 offset-md-1">
                    <h6 class="fw-bold text-dark text-xs text-uppercase tracking-wider mb-3">Documentation</h6>
                    <ul class="list-unstyled text-sm mb-0 d-flex flex-column gap-2">
                        <li><a href="/icons.html" class="text-decoration-none ${activePage === 'icons' ? 'text-primary fw-semibold' : 'text-muted'}">Icon Explorer</a></li>
                        <li><a href="/playground.html" class="text-decoration-none ${activePage === 'playground' ? 'text-primary fw-semibold' : 'text-muted'}">Live Playground</a></li>
                        <li><a href="/reference.html" class="text-decoration-none ${activePage === 'reference' ? 'text-primary fw-semibold' : 'text-muted'}">Codepoints Reference</a></li>
                        <li><a href="/tutorial.html" class="text-decoration-none ${activePage === 'tutorial' ? 'text-primary fw-semibold' : 'text-muted'}">Integration Guide</a></li>
                        <li><a href="/changelogs.html" class="text-decoration-none ${activePage === 'changelogs' ? 'text-primary fw-semibold' : 'text-muted'}">Changelogs</a></li>
                    </ul>
                </div>
                <div class="col-6 col-md-2">
                    <h6 class="fw-bold text-dark text-xs text-uppercase tracking-wider mb-3">Ecosystem</h6>
                    <ul class="list-unstyled text-sm mb-0 d-flex flex-column gap-2">
                        <li><a href="https://www.npmjs.com/package/haticons" target="_blank" rel="noopener" class="text-decoration-none text-muted">npm Package</a></li>
                        <li><a href="/tutorial.html#framework-components" class="text-decoration-none text-muted">React &amp; Vue 3</a></li>
                        <li><a href="https://cdn.jsdelivr.net/npm/haticons@${VERSION}/dist/css/haticons.min.css" target="_blank" rel="noopener" class="text-decoration-none text-muted">jsDelivr CDN</a></li>
                        <li><a href="https://www.boodooframework.com/" target="_blank" rel="noopener" class="text-decoration-none text-muted">boodoo Framework</a></li>
                    </ul>
                </div>
                <div class="col-12 col-md-3">
                    <h6 class="fw-bold text-dark text-xs text-uppercase tracking-wider mb-3">Legal &amp; Open Source</h6>
                    <ul class="list-unstyled text-sm mb-0 d-flex flex-column gap-2">
                        <li><a href="/license.html" class="text-decoration-none ${activePage === 'license' ? 'text-primary fw-semibold' : 'text-muted'}">License (GPL-3.0)</a></li>
                        <li><a href="/terms.html" class="text-decoration-none ${activePage === 'terms' ? 'text-primary fw-semibold' : 'text-muted'}">Terms of Use</a></li>
                        <li><a href="/privacy.html" class="text-decoration-none ${activePage === 'privacy' ? 'text-primary fw-semibold' : 'text-muted'}">Privacy Policy</a></li>
                        <li><a href="https://pebblebenders.com/" target="_blank" rel="noopener" class="text-decoration-none text-muted">PebbleBenders Studio</a></li>
                    </ul>
                </div>
            </div>
            <div class="pt-3 border-top d-flex flex-column flex-md-row align-items-center justify-content-between gap-2 text-xs text-muted">
                <div>
                    Released under <strong>GPL-3.0 License</strong> &middot; Designed &amp; Crafted by <a href="https://pebblebenders.com/" class="text-dark fw-bold text-decoration-none" target="_blank" rel="noopener">PebbleBenders</a>
                </div>
                <div>
                    Powered by <a href="https://www.boodooframework.com/" class="text-primary fw-semibold text-decoration-none" target="_blank" rel="noopener">boodoo CSS Framework</a>
                </div>
            </div>
        </div>
    </footer>`;
}

/**
 * Standard Toast markup
 */
function getToast(toastId = 'haticonsToast') {
    return `    <!-- Toast Notification -->
    <div id="${toastId}" class="copy-toast d-none">
        <i class="hi-check-circle me-1"></i> Copied to clipboard!
    </div>`;
}

/**
 * Shared Subset Exporter Modal
 */
function getSubsetModal() {
    return `    <!-- Subset Exporter Modal -->
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
    </div>`;
}

module.exports = {
    ROOT_DIR,
    loadIcons,
    loadCategories,
    getHtmlHead,
    getAnnouncementBar,
    getNavbar,
    getFooter,
    getToast,
    getSubsetModal
};
