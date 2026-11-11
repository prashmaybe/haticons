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
    getToast,
    getSubsetModal
} = require('./template.js');
const { ICON_ALIASES } = require('./categories.js');
const PKG = require('../package.json');
const VERSION = PKG.version;

const icons = loadIcons();
const categories = loadCategories();
const totalIcons = icons.length;

// Group icons by category
const catGroups = {};
Object.keys(categories).forEach(cat => { catGroups[cat] = []; });
icons.forEach(i => {
    const c = i.category || 'interface';
    if (!catGroups[c]) catGroups[c] = [];
    catGroups[c].push(i);
});

// Curated popular icons for the clean showcase
const featuredIconNames = [
    { name: 'claude', label: 'Claude', tag: 'AI' },
    { name: 'gemini', label: 'Gemini', tag: 'AI' },
    { name: 'antigravity', label: 'Antigravity', tag: 'AI' },
    { name: 'cursor', label: 'Cursor', tag: 'AI' },
    { name: 'react', label: 'React', tag: 'Framework' },
    { name: 'vue-js', label: 'Vue 3', tag: 'Framework' },
    { name: 'javascript', label: 'JavaScript', tag: 'Language' },
    { name: 'github', label: 'GitHub', tag: 'Brand' },
    { name: 'cart', label: 'Cart', tag: 'Commerce' },
    { name: 'heart-fill', label: 'Heart', tag: 'UI' },
    { name: 'star', label: 'Star', tag: 'Rating' },
    { name: 'search', label: 'Search', tag: 'UI' },
    { name: 'settings', label: 'Settings', tag: 'UI' },
    { name: 'shield', label: 'Shield', tag: 'Security' },
    { name: 'download', label: 'Download', tag: 'Action' },
    { name: 'refresh', label: 'Refresh', tag: 'Controls' }
];

let featuredIconsHtml = '';
featuredIconNames.forEach(item => {
    featuredIconsHtml += `
            <a href="/icons.html" class="featured-icon-card p-3 rounded-4 bg-white border text-center text-decoration-none shadow-2xs d-flex flex-column align-items-center justify-content-center">
                <i class="hi-${item.name} fs-2 text-dark mb-2"></i>
                <span class="text-xs fw-semibold text-dark text-truncate w-100">${item.label}</span>
                <span class="text-3xs text-muted text-uppercase tracking-wider">${item.tag}</span>
            </a>`;
});

// Category quick cards
let categoryCardsHtml = '';
const featuredCategories = ['brands', 'interface', 'commerce', 'editor', 'security', 'media', 'devices', 'files'];
featuredCategories.forEach(catKey => {
    const meta = categories[catKey] || { name: catKey, description: '' };
    const list = catGroups[catKey] || [];
    const sampleIcons = list.slice(0, 3);

    categoryCardsHtml += `
            <div class="col-12 col-sm-6 col-lg-3">
                <a href="/icons.html" class="card category-card p-3 rounded-4 bg-white border text-decoration-none shadow-2xs h-100 d-flex flex-column justify-content-between">
                    <div>
                        <div class="d-flex align-items-center justify-content-between mb-2">
                            <h3 class="h6 fw-bold text-dark mb-0">${meta.name}</h3>
                            <span class="badge bg-primary-soft text-primary rounded-pill text-xs fw-semibold">${list.length}</span>
                        </div>
                        <p class="text-muted text-xs mb-3">${meta.description}</p>
                    </div>
                    <div class="d-flex align-items-center justify-content-between pt-2 border-top">
                        <div class="d-flex align-items-center gap-2 text-muted">
                            ${sampleIcons.map(si => `<i class="${si.class} fs-6" title="${si.name}"></i>`).join('')}
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
    `A set of ${totalIcons}+ beautifully crafted, modular free vector and font icons for Web, React, Vue, iOS, Android, and Desktop apps. Styled with boodoo framework.`,
    'haticons, haticon, font icons, icon fonts, web fonts, font awesome alternative, ionicons, glyphicons, svg icons, boodoo framework, boodoo css',
    '/'
)}
</head>

<body class="bg-light text-dark">

${getAnnouncementBar()}

${getNavbar('home')}

    <!-- Hero Section -->
    <header class="hero-section py-5 text-center position-relative overflow-hidden">
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
            
            <p class="lead text-muted mx-auto mb-4 hero-subtitle" style="max-width: 680px;">
                A super-optimized, modular icon suite engineered for Web, React, Vue, iOS, Android, and Desktop apps. Clean, minimal, and framework-agnostic.
            </p>

            <!-- Main Action CTAs -->
            <div class="d-flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                <a href="/icons.html" class="btn btn-primary btn-lg rounded-pill px-4 shadow-sm d-inline-flex align-items-center gap-2">
                    <i class="hi-search"></i>
                    <span>Explore All ${totalIcons} Icons</span>
                </a>
                <a href="/playground.html" class="btn btn-outline-primary btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2 bg-white">
                    <i class="hi-paintbox"></i>
                    <span>Live Studio Playground</span>
                </a>
                <a href="/download/haticons.zip" class="btn btn-outline-secondary btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2 bg-white">
                    <i class="hi-download"></i>
                    <span>Download ZIP (~1.3MB)</span>
                </a>
            </div>

            <!-- Quick Copy Command Bar -->
            <div class="install-bar mx-auto p-2 bg-white rounded-4 border shadow-sm d-flex flex-column flex-md-row align-items-stretch gap-2 mb-4" style="max-width: 640px;">
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

            <!-- Quick Search Input that routes to full explorer -->
            <form action="/icons.html" method="get" class="mx-auto" style="max-width: 540px;">
                <div class="input-group shadow-sm rounded-pill overflow-hidden border">
                    <span class="input-group-text bg-white border-0 ps-3 text-muted">
                        <i class="hi-search"></i>
                    </span>
                    <input type="text" name="q" class="form-control border-0 ps-2" placeholder="Search 569+ icons (press Enter)..." aria-label="Search icons">
                    <button class="btn btn-primary px-3 fw-medium" type="submit">
                        Search
                    </button>
                </div>
            </form>
        </div>
    </header>

    <!-- Popular Featured Icons Preview Section -->
    <section class="py-5 bg-white border-top border-bottom">
        <div class="container">
            <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                <div>
                    <h2 class="h4 fw-bold text-dark mb-1">Popular &amp; Modern Icons</h2>
                    <p class="text-muted text-sm mb-0">From AI pioneer logos to everyday UI, shopping, and security symbols.</p>
                </div>
                <div>
                    <a href="/icons.html" class="btn btn-outline-primary btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-1">
                        <span>Browse full library (${totalIcons} icons)</span>
                        <i class="hi-arrow-right"></i>
                    </a>
                </div>
            </div>

            <!-- Grid of 16 Featured Icon Cards -->
            <div class="featured-icons-grid mb-4">
${featuredIconsHtml}
            </div>

            <div class="text-center">
                <a href="/icons.html" class="btn btn-primary rounded-pill px-4 shadow-sm d-inline-flex align-items-center gap-2">
                    <i class="hi-search"></i>
                    <span>Open Icon Explorer (${totalIcons} icons)</span>
                </a>
            </div>
        </div>
    </section>

    <!-- Why Haticons - 4 Key Highlights -->
    <section class="py-5 bg-light border-bottom">
        <div class="container">
            <div class="text-center mb-5">
                <div class="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill bg-primary-soft text-primary fw-medium text-xs mb-2 border border-primary-subtle">
                    <i class="hi-star"></i>
                    <span>Engineered for Production</span>
                </div>
                <h2 class="display-6 fw-extrabold text-dark mb-2">Designed for Simplicity &amp; Speed</h2>
                <p class="lead text-muted mx-auto header-subtitle-constrained" style="max-width: 620px;">
                    Zero bloat, pixel precision, and effortless integration across web and mobile platforms.
                </p>
            </div>

            <div class="row g-4">
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="card p-4 rounded-4 bg-white border shadow-2xs h-100">
                        <div class="feature-icon-badge rounded-circle bg-primary-soft text-primary d-inline-flex align-items-center justify-content-center mb-3">
                            <i class="hi-star fs-4"></i>
                        </div>
                        <h3 class="h6 fw-bold text-dark mb-2">${totalIcons}+ Vector Glyphs</h3>
                        <p class="text-muted text-xs mb-0">
                            Crafted on a 1024-unit coordinate grid. Crisp display on high-DPI, Retina, and mobile screens.
                        </p>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-lg-3">
                    <div class="card p-4 rounded-4 bg-white border shadow-2xs h-100">
                        <div class="feature-icon-badge rounded-circle bg-primary-soft text-primary d-inline-flex align-items-center justify-content-center mb-3">
                            <i class="hi-archive fs-4"></i>
                        </div>
                        <h3 class="h6 fw-bold text-dark mb-2">14 Modular Bundles</h3>
                        <p class="text-muted text-xs mb-0">
                            Include only what you need. E.g. <code>commerce.min.css</code> (4KB) or <code>interface.min.css</code> (13KB) independently.
                        </p>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-lg-3">
                    <div class="card p-4 rounded-4 bg-white border shadow-2xs h-100">
                        <div class="feature-icon-badge rounded-circle bg-primary-soft text-primary d-inline-flex align-items-center justify-content-center mb-3">
                            <i class="hi-javascript fs-4"></i>
                        </div>
                        <h3 class="h6 fw-bold text-dark mb-2">React &amp; Vue 3 Native</h3>
                        <p class="text-muted text-xs mb-0">
                            Pre-built React and Vue 3 modules with full TypeScript types and unplugin auto-import support.
                        </p>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-lg-3">
                    <div class="card p-4 rounded-4 bg-white border shadow-2xs h-100">
                        <div class="feature-icon-badge rounded-circle bg-primary-soft text-primary d-inline-flex align-items-center justify-content-center mb-3">
                            <i class="hi-check-circle fs-4 text-success"></i>
                        </div>
                        <h3 class="h6 fw-bold text-dark mb-2">100% Free &amp; Open Source</h3>
                        <p class="text-muted text-xs mb-0">
                            GPL-3.0 licensed for open-source, client, SaaS, and enterprise commercial applications.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Quick Start Preview & Section Hub -->
    <section class="py-5 bg-white border-bottom">
        <div class="container">
            <div class="row g-4 align-items-center">
                <div class="col-12 col-lg-5">
                    <div class="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill bg-primary-soft text-primary fw-medium text-xs mb-2 border border-primary-subtle">
                        <i class="hi-play"></i>
                        <span>Simple Setup</span>
                    </div>
                    <h2 class="display-6 fw-extrabold text-dark mb-3">Drop In and Start Creating</h2>
                    <p class="text-muted text-sm mb-4">
                        Add Haticons with one line of CDN code or via your package manager. Icons automatically inherit font size and color.
                    </p>
                    <div class="d-flex flex-wrap gap-2">
                        <a href="/tutorial.html" class="btn btn-primary rounded-pill px-4 shadow-sm d-inline-flex align-items-center gap-2">
                            <i class="hi-bulb"></i>
                            <span>View Full Docs &amp; Setup Guide</span>
                        </a>
                        <a href="/playground.html" class="btn btn-outline-secondary rounded-pill px-4 bg-white d-inline-flex align-items-center gap-2">
                            <i class="hi-paintbox"></i>
                            <span>Open Studio Playground</span>
                        </a>
                    </div>
                </div>

                <div class="col-12 col-lg-7">
                    <div class="card p-4 rounded-4 bg-light border shadow-2xs">
                        <h3 class="h6 fw-bold text-dark mb-2"><i class="hi-cloudflare text-warning me-1"></i> Quick CDN Embed:</h3>
                        <div class="code-snippet-box mb-3">
                            <div class="code-snippet-header">
                                <span class="code-lang-label">&lt;head&gt; stylesheet</span>
                                <button type="button" class="code-copy-btn" data-code='&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/haticons@${VERSION}/dist/css/haticons.min.css"&gt;'>
                                    <i class="hi-paste"></i> <span>Copy</span>
                                </button>
                            </div>
                            <pre class="code-snippet-body"><code><span class="code-token-punct">&lt;</span><span class="code-token-tag">link</span> <span class="code-token-attr">rel</span><span class="code-token-punct">=</span><span class="code-token-string">"stylesheet"</span> <span class="code-token-attr">href</span><span class="code-token-punct">=</span><span class="code-token-string">"https://cdn.jsdelivr.net/npm/haticons@${VERSION}/dist/css/haticons.min.css"</span><span class="code-token-punct">&gt;</span></code></pre>
                        </div>

                        <h3 class="h6 fw-bold text-dark mb-2"><i class="hi-html5 text-primary me-1"></i> HTML Usage:</h3>
                        <div class="code-snippet-box">
                            <div class="code-snippet-header">
                                <span class="code-lang-label">Icon markup</span>
                                <button type="button" class="code-copy-btn" data-code='&lt;i class="hi-cart"&gt;&lt;/i&gt;
&lt;i class="hi-heart-fill text-danger fs-3"&gt;&lt;/i&gt;
&lt;i class="hi-refresh hi-spin text-primary"&gt;&lt;/i&gt;'>
                                    <i class="hi-paste"></i> <span>Copy</span>
                                </button>
                            </div>
                            <pre class="code-snippet-body"><code><span class="code-token-punct">&lt;</span><span class="code-token-tag">i</span> <span class="code-token-attr">class</span><span class="code-token-punct">=</span><span class="code-token-string">"hi-cart"</span><span class="code-token-punct">&gt;&lt;/</span><span class="code-token-tag">i</span><span class="code-token-punct">&gt;</span>
<span class="code-token-punct">&lt;</span><span class="code-token-tag">i</span> <span class="code-token-attr">class</span><span class="code-token-punct">=</span><span class="code-token-string">"hi-heart-fill text-danger fs-3"</span><span class="code-token-punct">&gt;&lt;/</span><span class="code-token-tag">i</span><span class="code-token-punct">&gt;</span>
<span class="code-token-punct">&lt;</span><span class="code-token-tag">i</span> <span class="code-token-attr">class</span><span class="code-token-punct">=</span><span class="code-token-string">"hi-refresh hi-spin text-primary"</span><span class="code-token-punct">&gt;&lt;/</span><span class="code-token-tag">i</span><span class="code-token-punct">&gt;</span></code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Category Showcase Grid -->
    <section class="py-5 bg-light border-bottom">
        <div class="container">
            <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                <div>
                    <h2 class="h4 fw-bold text-dark mb-1">Browse by Category</h2>
                    <p class="text-muted text-sm mb-0">Organized across 14 dedicated domains with modular bundle options.</p>
                </div>
                <div>
                    <a href="/reference.html" class="btn btn-outline-secondary btn-sm rounded-pill px-3 bg-white">
                        <i class="hi-document me-1"></i> Full Codepoints Reference
                    </a>
                </div>
            </div>

            <div class="row g-4">
${categoryCardsHtml}
            </div>
        </div>
    </section>

${getSubsetModal()}

${getToast()}

${getFooter('home')}

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/boodoo@1.2.2/dist/js/boodoo.min.js"></script>
    <script type="text/javascript" src="/assets/js/theme.js"></script>
    <script type="text/javascript" src="/assets/js/custom.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT_DIR, 'code', 'index.html'), html);
console.log('code/index.html generated successfully (minimal & clean)!');
