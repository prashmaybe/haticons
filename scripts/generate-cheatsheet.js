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
${getHtmlHead(
    'Haticons Cheat Sheet | Interactive Icon Search & Explorer',
    'Interactive cheatsheet for all 494+ Haticons vector & web font icons. Live search, category filtering, copy HTML code, and Unicode values.',
    'haticons cheatsheet, icon search, copy icons, haticons glyphs, vector icons, boodoo icons'
)}
</head>

<body class="bg-light text-dark">

${getAnnouncementBar()}

${getNavbar('cheatsheet')}

    <!-- Header Banner -->
    <header class="py-5 bg-white border-bottom text-center">
        <div class="container">
            <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-soft text-primary fw-medium text-xs mb-3 border border-primary-subtle">
                <i class="hi-search"></i>
                <span>Interactive Icon Explorer</span>
            </div>
            <h1 class="display-5 fw-extrabold text-dark mb-2">Haticons Cheat Sheet</h1>
            <p class="lead text-muted mx-auto header-subtitle-constrained mb-0">
                Search all <strong>${icons.length} icons</strong> by keyword or filter by category. Click any icon to view details, copy HTML, and grab CSS codes.
            </p>
        </div>
    </header>

    <!-- Main Cheatsheet Section -->
    <section id="cheatsheet" class="py-5">
        <div class="container">
            <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
                <div>
                    <h2 class="h3 fw-bold text-dark mb-1">Explore Icon Library</h2>
                    <p class="text-muted text-sm mb-0">
                        Showing <span id="visibleCount" class="fw-bold text-primary">${icons.length}</span> of ${icons.length} icons
                    </p>
                </div>

                <!-- Live Search Bar -->
                <div class="search-input-wrap flex-grow-1 max-w-md">
                    <div class="input-group">
                        <span class="input-group-text bg-white border-end-0 text-muted">
                            <i class="hi-search"></i>
                        </span>
                        <input type="text" id="iconSearchInput" class="form-control border-start-0 ps-0" placeholder="Search 494 icons (e.g. arrow, user, chat)..." aria-label="Search icons">
                    </div>
                </div>
            </div>

            <!-- Category Filter Pills -->
            <div class="category-tabs-wrap d-flex flex-wrap gap-1 mb-4 pb-2">
                ${categoryTabsHtml}
            </div>

            <!-- Empty Search State -->
            <div id="noResults" class="text-center py-5 d-none">
                <i class="hi-warning text-muted fs-1 mb-3 d-inline-block"></i>
                <h3 class="h5 text-dark fw-bold">No icons found</h3>
                <p class="text-muted text-sm">Try searching for a different keyword or select another category filter.</p>
                <button type="button" class="btn btn-outline-primary btn-sm rounded-pill mt-2" id="resetSearchBtn">
                    Reset Filter
                </button>
            </div>

            <!-- Icon Grid -->
            <div class="haticon-grid" id="iconGrid">
                ${cardsHtml}
            </div>
        </div>
    </section>

    <!-- Icon Detail Modal (boodoo component) -->
    <div class="modal fade" id="iconDetailModal" tabindex="-1" aria-labelledby="modalIconTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4">
                <div class="modal-header border-bottom px-4 py-3 bg-light rounded-top-4">
                    <div class="d-flex align-items-center gap-3">
                        <div class="modal-glyph-box d-flex align-items-center justify-content-center rounded-3 bg-white border text-primary shadow-2xs">
                            <i id="modalGlyph" class="hi-haticons fs-1"></i>
                        </div>
                        <div>
                            <h3 class="modal-title h5 fw-bold text-dark mb-0 font-monospace" id="modalIconTitle">hi-haticons</h3>
                            <span class="badge bg-primary-soft text-primary rounded-pill text-2xs" id="modalCategoryBadge">interface</span>
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
                            Only need this category? Import <code>&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/haticons@1.0.0/dist/css/categories/interface.min.css"&gt;</code> without loading the rest!
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-top px-3 py-2 bg-light rounded-bottom-4 d-flex justify-content-between align-items-center">
                    <button type="button" class="btn btn-outline-secondary btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-1 modal-codepen-btn" id="modalCodePenBtn">
                        <i class="hi-codepen"></i> <span>Open in CodePen</span>
                    </button>
                    <button type="button" class="btn btn-primary btn-sm rounded-pill px-4" data-bs-dismiss="modal" data-boodoo-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

${getToast('copyToast')}

${getFooter('cheatsheet')}

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/boodoo@1.2.2/dist/js/boodoo.min.js"></script>
    <script type="text/javascript" src="/assets/js/theme.js"></script>
    <script type="text/javascript" src="/assets/js/custom.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT_DIR, 'code', 'cheatsheet.html'), html);
console.log('code/cheatsheet.html generated successfully using shared templates!');
