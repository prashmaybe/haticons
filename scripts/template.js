const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
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
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boodoo@1.2.2/dist/css/boodoo.min.css">

    <!-- Haticons CSS -->
    <link rel="stylesheet" type="text/css" media="all" href="/assets/css/haticons.min.css" />
    <link rel="stylesheet" type="text/css" media="all" href="/assets/css/style.css" />
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
    <div class="py-1 px-2 text-center bg-primary text-white text-sm fw-medium d-flex flex-wrap align-items-center justify-content-center gap-2">
        <span class="badge bg-white text-primary rounded-pill px-1 py-0.5 fw-bold">v1.0.1</span>
        <span>${count}+ Modular Vector &amp; Font Icons for Web, iOS, Android, and Desktop</span>
    </div>`;
}

/**
 * Main Navigation Bar
 * @param {'home'|'tutorial'|'reference'|'changelogs'|'terms'|'privacy'|'license'|'other'} activePage
 */
function getNavbar(activePage = 'home') {
    const isHome = activePage === 'home';
    const isTutorial = activePage === 'tutorial';
    const isReference = activePage === 'reference';
    const isChangelogs = activePage === 'changelogs';

    return `    <!-- Main Navigation Header -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-1 shadow-xs">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center gap-1 text-decoration-none me-0" href="/">
                <span class="logo-icon-wrap d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-soft text-primary">
                    <i class="hi-haticons fs-4"></i>
                </span>
                <span class="fs-4 fw-bold text-dark tracking-tight">Haticons</span>
            </a>

            <!-- Mobile Controls (Theme Toggle + Navbar Toggler) -->
            <div class="d-flex align-items-center gap-1 d-lg-none">
                <button type="button" class="theme-toggle-btn" aria-label="Toggle color theme" title="Toggle theme (System / Light / Dark)">
                    <i class="hi-sun theme-toggle-icon fs-5"></i>
                </button>
                <button class="navbar-toggler border-0 p-2" type="button" data-boodoo-toggle="collapse" data-boodoo-target="#mainNavbarCollapse" aria-controls="mainNavbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>

            <!-- Collapsible Navigation Menu -->
            <div class="collapse navbar-collapse justify-content-end mt-2 mt-lg-0" id="mainNavbarCollapse">
                <div class="navbar-nav d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-1 py-2 py-lg-0">
                    <a href="${isHome ? '#start' : '/#start'}" class="btn btn-ghost text-muted d-inline-flex align-items-center justify-content-start justify-content-lg-center gap-1">
                        <i class="hi-play"></i> Set Up
                    </a>
                    <a href="/reference.html" class="btn btn-ghost ${isReference ? 'text-primary fw-semibold' : 'text-muted'} d-inline-flex align-items-center justify-content-start justify-content-lg-center gap-1">
                        <i class="hi-document"></i> Reference
                    </a>
                    <a href="/tutorial.html" class="btn btn-ghost ${isTutorial ? 'text-primary fw-semibold' : 'text-muted'} d-inline-flex align-items-center justify-content-start justify-content-lg-center gap-1">
                        <i class="hi-bulb"></i> Tutorial
                    </a>
                    <a href="/changelogs.html" class="btn btn-ghost ${isChangelogs ? 'text-primary fw-semibold' : 'text-muted'} d-inline-flex align-items-center justify-content-start justify-content-lg-center gap-1">
                        <i class="hi-time"></i> Changelogs
                    </a>
                    <button type="button" class="theme-toggle-btn ms-lg-1 d-none d-lg-inline-flex" aria-label="Toggle color theme" title="Toggle theme (System / Light / Dark)">
                        <i class="hi-sun theme-toggle-icon fs-5"></i>
                    </button>
                    <a href="https://www.npmjs.com/package/haticons" target="_blank" rel="noopener" class="btn btn-primary btn-sm rounded-pill px-3 d-inline-flex align-items-center justify-content-center gap-1 mt-2 mt-lg-0">
                        <i class="hi-npm"></i>
                        <span>npm</span>
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
    <footer class="py-5 bg-white border-top text-center">
        <div class="container">
            <div class="d-flex align-items-center justify-content-center gap-2 mb-2">
                <span class="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-soft text-primary icon-badge-sm">
                    <i class="hi-haticons fs-5"></i>
                </span>
                <span class="fs-5 fw-bold text-dark">Haticons</span>
            </div>
            <p class="text-xs text-muted mb-3">
                An open-source icon system by <a href="https://pebblebenders.com/" class="text-dark fw-bold text-decoration-none" target="_blank" rel="noopener">PebbleBenders</a> &middot; Made with <a href="https://www.boodooframework.com/" class="text-primary fw-semibold" target="_blank" rel="noopener">boodoo Framework</a>
            </p>
            <p class="text-muted text-sm mx-auto mb-3 footer-desc-constrained">
                ${count} free vector font icons. Distributed as an npm package with modular category stylesheets and Sass sources.
            </p>
            <div class="d-flex flex-wrap align-items-center justify-content-center gap-1 text-sm text-muted mb-4">
                <a href="/download/haticons.zip" class="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1 bg-white text-muted d-inline-flex align-items-center gap-1 shadow-2xs">
                    <i class="hi-download"></i>
                    <span>Download ZIP</span>
                </a>
            </div>
            <div class="d-flex flex-wrap align-items-center justify-content-center gap-1 text-xs text-muted mb-3 pt-2 border-top">
                <a href="/terms.html" class="text-decoration-none ${activePage === 'terms' ? 'text-primary fw-semibold' : 'text-muted'}">Terms of Use</a>
                <span>&bull;</span>
                <a href="/privacy.html" class="text-decoration-none ${activePage === 'privacy' ? 'text-primary fw-semibold' : 'text-muted'}">Privacy Policy</a>
                <span>&bull;</span>
                <a href="/license.html" class="text-decoration-none ${activePage === 'license' ? 'text-primary fw-semibold' : 'text-muted'}">License (GPL-3.0)</a>
            </div>
            <p class="text-xs text-muted mb-0">
                Released under GPL-3.0 License &middot; Designed &amp; Crafted by <a href="https://pebblebenders.com/" class="text-dark fw-bold text-decoration-none" target="_blank" rel="noopener">PebbleBenders</a>
            </p>
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

module.exports = {
    ROOT_DIR,
    loadIcons,
    loadCategories,
    getHtmlHead,
    getAnnouncementBar,
    getNavbar,
    getFooter,
    getToast
};
