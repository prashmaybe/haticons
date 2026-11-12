const fs = require('fs');
const path = require('path');
const {
    ROOT_DIR,
    loadIcons,
    getHtmlHead,
    getAnnouncementBar,
    getNavbar,
    getFooter,
    getToast,
    getSubsetModal
} = require('./template.js');
const PKG = require('../package.json');
const VERSION = PKG.version;

const icons = loadIcons();
const totalIcons = icons.length;

const html = `<!DOCTYPE html>
<html lang="en" data-boodoo-theme="light">
<head>
${getHtmlHead(
    'Interactive Icon Playground &amp; Studio | Haticons',
    'Test Haticons colors, sizes, animations, and get ready-to-use HTML, React JSX, inline SVG, and CSS snippets in real time.',
    'haticons playground, icon studio, live icon tester, svg customizer, font icon colors, react icons generator',
    '/playground.html'
)}
</head>

<body class="bg-light text-dark">

${getAnnouncementBar()}

${getNavbar('playground')}

    <!-- Page Header -->
    <header class="py-5 bg-white border-bottom">
        <div class="container text-center">
            <div class="d-inline-flex align-items-center gap-1 px-1 py-1 rounded-pill bg-primary-soft text-primary fw-semibold text-xs mb-3 border border-primary-subtle">
                <i class="hi-paintbox"></i>
                <span>Real-Time Icon Studio</span>
            </div>
            <h1 class="display-5 fw-extrabold text-dark mb-3">Interactive Playground</h1>
            <p class="lead text-muted mx-auto header-subtitle-constrained mb-0">
                Experiment with live icon colors, sizing, and keyframe animations. Grab production-ready snippets instantly formatted for HTML, React JSX, SVG, or pure CSS.
            </p>
        </div>
    </header>

    <!-- Interactive Studio Section -->
    <main class="py-5" id="playground">
        <div class="container">
            <div class="row g-4 align-items-stretch">
                <!-- Preview & Customization Controls -->
                <div class="col-12 col-lg-6">
                    <div class="card p-2 rounded-4 bg-white border shadow-2xs d-flex flex-column justify-content-between">
                        <div>
                            <div class="d-flex align-items-center justify-content-between mb-1">
                                <h2 class="h6 fw-bold text-dark mb-0">Live Canvas Stage</h2>
                                <span class="badge bg-primary-soft text-primary rounded-pill text-xs px-1 py-0.5">Interactive</span>
                            </div>

                            <!-- Canvas Stage -->
                            <div class="playground-canvas p-4 rounded-4 bg-light border text-center mb-4 d-flex flex-column align-items-center justify-content-center position-relative" style="min-height: 240px;">
                                <div id="pgIconWrap" class="d-flex align-items-center justify-content-center">
                                    <i id="pgIconDisplay" class="hi-haticons" style="font-size: 64px; color: #7c3aed;"></i>
                                </div>
                                <span class="badge bg-white text-muted border text-xs font-monospace mt-3 px-1 py-1 shadow-2xs" id="pgIconLabel">hi-haticons</span>
                            </div>

                            <!-- Icon Selection Quick Dropdown -->
                            <div class="mb-3">
                                <label class="form-label text-xs fw-semibold text-muted text-uppercase tracking-wider mb-1">Select Icon:</label>
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
                                <input type="range" class="form-range" id="pgSizeRange" min="16" max="112" value="64" step="4">
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
                                    <button type="button" class="btn btn-xs rounded-pill px-1 pg-anim-btn active" data-anim="">None</button>
                                    <button type="button" class="btn btn-xs rounded-pill px-1 btn-outline-secondary pg-anim-btn" data-anim="hi-spin">hi-spin</button>
                                    <button type="button" class="btn btn-xs rounded-pill px-1 btn-outline-secondary pg-anim-btn" data-anim="hi-pulse">hi-pulse</button>
                                    <button type="button" class="btn btn-xs rounded-pill px-1 btn-outline-secondary pg-anim-btn" data-anim="hi-bounce">hi-bounce</button>
                                    <button type="button" class="btn btn-xs rounded-pill px-1 btn-outline-secondary pg-anim-btn" data-anim="hi-shake">hi-shake</button>
                                </div>
                            </div>
                        </div>

                        <div class="pt-3 border-top mt-3">
                            <a href="/icons.html" class="btn btn-outline-secondary btn-sm rounded-pill w-100 d-inline-flex align-items-center justify-content-center gap-1">
                                <i class="hi-search"></i> <span>Pick from full library of ${totalIcons} icons</span>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Production Code Output -->
                <div class="col-12 col-lg-6">
                    <div class="card p-2 rounded-4 bg-white border shadow-2xs d-flex flex-column justify-content-between">
                        <div>
                            <div class="d-flex align-items-center justify-content-between mb-1">
                                <h2 class="h6 fw-bold text-dark mb-0">Production Snippets</h2>
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

                            <div class="p-1 bg-light rounded-3 border text-xs text-muted mb-2">
                                <strong>Tip:</strong> Haticons natively respects <code>currentColor</code> and standard CSS font sizes (e.g. <code>fs-1</code>, <code>text-primary</code>).
                            </div>
                        </div>

                        <div class="d-flex gap-2">
                            <button type="button" class="btn btn-primary rounded-pill btn-sm px-1 flex-fill" id="pgCopyPrimaryBtn">
                                <i class="hi-paste me-1"></i> Copy HTML Tag
                            </button>
                            <a href="/tutorial.html" class="btn btn-outline-secondary rounded-pill btn-sm px-1 flex-fill bg-white">
                                <i class="hi-bulb me-1"></i> View Integration Guide
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

${getSubsetModal()}

${getToast()}

${getFooter('playground')}

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/boodoo@1.3.0/dist/js/boodoo.min.js"></script>
    <script type="text/javascript" src="/assets/js/theme.js"></script>
    <script type="text/javascript" src="/assets/js/custom.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT_DIR, 'code', 'playground.html'), html);
console.log('code/playground.html generated successfully!');

