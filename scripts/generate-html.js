const fs = require('fs');
const path = require('path');
const {
    ROOT_DIR,
    getHtmlHead,
    getAnnouncementBar,
    getNavbar,
    getFooter,
    getToast
} = require('./template.js');



const html = `<!DOCTYPE html>
<html lang="en" data-boodoo-theme="light">
<head>
${getHtmlHead(
    'Haticons | Beautiful Free Vector &amp; Font Icons for Modern Apps',
    'A set of 494+ beautifully crafted, modular free premium font icons and SVG icons for Web, iOS, Android, and Desktop apps. Styled with boodoo framework.',
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
                    <span>494+ Modern Vector Icons</span>
                </span>
                <span class="px-3 py-1 rounded-pill bg-white text-muted fw-medium text-xs border shadow-2xs d-inline-flex align-items-center gap-1">
                    <i class="hi-check-circle text-success"></i>
                    <span>GPL-3.0 Open Source</span>
                </span>
            </div>
            
            <h1 class="display-4 fw-extrabold text-dark mb-3 hero-title">
                Beautifully Crafted <span class="text-gradient-purple">Font &amp; SVG Icons</span>
            </h1>
            
            <p class="lead text-muted mx-auto mb-4 hero-subtitle">
                A super-optimized, modular icon suite for Web, iOS, Android, and Desktop apps. Inspired by <strong>Ionicons</strong>, <strong>FontAwesome</strong>, and <strong>Glyphicons</strong>.
            </p>

            <div class="d-flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
                <a href="/cheatsheet.html" class="btn btn-primary btn-lg rounded-pill px-4 shadow-sm d-inline-flex align-items-center gap-2">
                    <i class="hi-search"></i>
                    <span>Browse 494 Icons</span>
                </a>
                <a href="/download/haticons.zip" class="btn btn-outline-secondary btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2 bg-white">
                    <i class="hi-download"></i>
                    <span>Download ZIP</span>
                </a>
            </div>

            <!-- Install / CDN Pills -->
            <div class="install-bar mx-auto p-2 bg-white rounded-4 border shadow-sm d-flex flex-column flex-md-row align-items-stretch gap-2">
                <div class="install-code-box flex-fill px-3 py-2 text-start font-monospace text-xs text-dark rounded-3 bg-light d-flex align-items-center justify-content-between gap-2 overflow-hidden">
                    <span class="user-select-all text-truncate install-text" id="npmCmd">npm install haticons</span>
                    <button class="btn btn-sm btn-ghost text-muted py-0 px-2 copy-btn flex-shrink-0" data-copy="npm install haticons" title="Copy command">
                        <i class="hi-paste"></i>
                    </button>
                </div>
                <div class="install-code-box flex-fill px-3 py-2 text-start font-monospace text-xs text-dark rounded-3 bg-light d-flex align-items-center justify-content-between gap-2 overflow-hidden">
                    <span class="user-select-all text-truncate cdn-truncate install-text" id="cdnUrl">https://cdn.jsdelivr.net/npm/haticons@1.0.1/dist/css/haticons.min.css</span>
                    <button class="btn btn-sm btn-ghost text-muted py-0 px-2 copy-btn flex-shrink-0" data-copy="https://cdn.jsdelivr.net/npm/haticons@1.0.1/dist/css/haticons.min.css" title="Copy CDN URL">
                        <i class="hi-paste"></i>
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Quickstart Guide -->
    <section id="quickstart" class="py-5 bg-white border-top border-bottom">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="h3 fw-bold text-dark mb-2">Getting Started in 2 Minutes</h2>
                <p class="text-muted text-sm mx-auto mb-0 quickstart-subtitle-constrained">
                    Include the stylesheet and drop semantic icon elements right into your HTML, Vue, React, or Angular templates.
                </p>
            </div>

            <div class="row g-4 justify-content-center">
                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card p-2 rounded-4 border bg-light shadow-2xs">
                        <div class="d-flex align-items-center gap-1 mb-2">
                            <span class="step-badge rounded-circle bg-primary text-white fw-bold d-inline-flex align-items-center justify-content-center">1</span>
                            <h3 class="h5 fw-bold text-dark mb-0">Install or CDN</h3>
                        </div>
                        <p class="text-muted text-sm mb-1">Add Haticons to your project with npm or load directly via CDN link:</p>
                        <div class="bg-dark text-light p-2 rounded-3 font-monospace text-xs overflow-x-auto code-box">
                            <span class="text-muted">&lt;!-- via CDN --&gt;</span><br>
                            &lt;link rel="stylesheet"<br>
                            &nbsp;&nbsp;href="https://cdn.jsdelivr.net/npm/<br>
                            &nbsp;&nbsp;haticons@1.0.1/dist/css/<br>
                            &nbsp;&nbsp;haticons.min.css"&gt;
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card p-2 rounded-4 border bg-light shadow-2xs">
                        <div class="d-flex align-items-center gap-1 mb-2">
                            <span class="step-badge rounded-circle bg-primary text-white fw-bold d-inline-flex align-items-center justify-content-center">2</span>
                            <h3 class="h5 fw-bold text-dark mb-0">Insert Any Icon</h3>
                        </div>
                        <p class="text-muted text-sm mb-1">Use the standard <code>&lt;i&gt;</code> element with any <code>hi-[name]</code> class:</p>
                        <div class="bg-dark text-light p-2 rounded-3 font-monospace text-xs overflow-x-auto code-box">
                            <span class="text-muted">&lt;!-- Example usage --&gt;</span><br>
                            &lt;i class="hi-search"&gt;&lt;/i&gt;<br>
                            &lt;i class="hi-heart text-danger"&gt;&lt;/i&gt;<br>
                            &lt;i class="hi-cart text-primary"&gt;&lt;/i&gt;
                        </div>
                    </div>
                </div>

                <div class="col-12 col-md-6 col-lg-4">
                    <div class="card p-2 rounded-4 border bg-light shadow-2xs">
                        <div class="d-flex align-items-center gap-1 mb-2">
                            <span class="step-badge rounded-circle bg-primary text-white fw-bold d-inline-flex align-items-center justify-content-center">3</span>
                            <h3 class="h5 fw-bold text-dark mb-0">Scale &amp; Colorize</h3>
                        </div>
                        <p class="text-muted text-sm mb-1">Inherits CSS <code>font-size</code> and <code>color</code> seamlessly with built-in utility multipliers:</p>
                        <div class="bg-dark text-light p-2 rounded-3 font-monospace text-xs overflow-x-auto code-box">
                            <span class="text-muted">&lt;!-- Sizing classes --&gt;</span><br>
                            &lt;i class="hi-haticons hi-lg"&gt;&lt;/i&gt;<br>
                            &lt;i class="hi-haticons hi-2x"&gt;&lt;/i&gt;<br>
                            &lt;i class="hi-refresh hi-spin"&gt;&lt;/i&gt;
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

${getToast('copyToast')}

${getFooter('home')}

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/boodoo@1.2.2/dist/js/boodoo.min.js"></script>
    <script type="text/javascript" src="/assets/js/theme.js"></script>
    <script type="text/javascript" src="/assets/js/custom.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT_DIR, 'code', 'index.html'), html);
console.log('code/index.html generated successfully using shared templates!');
