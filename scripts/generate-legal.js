const fs = require('fs');
const path = require('path');
const {
    ROOT_DIR,
    getHtmlHead,
    getAnnouncementBar,
    getNavbar,
    getFooter
} = require('./template.js');

// 1. Terms of Use
const termsHtml = `<!DOCTYPE html>
<html lang="en" data-boodoo-theme="light">
<head>
${getHtmlHead(
    'Terms of Use | Haticons by PebbleBenders',
    'Terms of Use and conditions for downloading, using, and embedding Haticons icon suite and web components.',
    'haticons terms, open source terms of use, haticons licensing terms'
)}
</head>

<body class="bg-light text-dark">

${getAnnouncementBar()}

${getNavbar('other')}

    <!-- Header Banner -->
    <header class="py-5 bg-white border-bottom text-center">
        <div class="container">
            <div class="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill bg-primary-soft text-primary fw-medium text-xs mb-2 border border-primary-subtle">
                <i class="hi-document"></i>
                <span>Legal Agreement</span>
            </div>
            <h1 class="display-5 fw-extrabold text-dark mb-2">Terms of Use</h1>
            <p class="lead text-muted mx-auto header-subtitle-constrained mb-0">
                Effective Date: October 27, 2026 &middot; Maintained by <a href="https://pebblebenders.com/" class="text-dark fw-bold text-decoration-none" target="_blank" rel="noopener">PebbleBenders</a>
            </p>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container py-5 changelogs-main-container">
        <div class="card p-4 p-md-5 rounded-4 border bg-white shadow-xs">
            <h2 class="fw-bold text-dark mb-2">1. Acceptance of Terms</h2>
            <p class="text-muted text-sm mb-2">
                By accessing, browsing, downloading, or integrating <strong>Haticons</strong> (including our SVG assets, web fonts, stylesheets, JavaScript modules, documentation, and website at haticons.com), you agree to be bound by these Terms of Use and the associated GNU General Public License v3.0 (GPL-3.0). If you do not agree to these terms, please do not use Haticons.
            </p>

            <h2 class="fw-bold text-dark mb-2">2. Open Source License &amp; Permitted Uses</h2>
            <p class="text-muted text-sm mb-2">
                Haticons is distributed as free, open-source software under the <strong>GNU General Public License v3.0</strong>. You are welcome to:
            </p>
            <ul class="text-muted text-sm mb-2">
                <li>Integrate Haticons webfonts, CSS stylesheets, and SVGs into personal, educational, non-profit, or commercial web and mobile applications.</li>
                <li>Distribute, bundle, compile, or fork the repository in accordance with the terms of the GPL-3.0 license.</li>
                <li>Use CDN links (e.g., jsDelivr, unpkg) or package managers (npm, yarn, pnpm) to install and bundle the library.</li>
            </ul>

            <h2 class="fw-bold text-dark mb-2">3. Brand &amp; Trademark Notice</h2>
            <p class="text-muted text-sm mb-2">
                The "Haticons" name and logo are trademarks of <a href="https://pebblebenders.com/" class="text-dark fw-bold text-decoration-none" target="_blank" rel="noopener">PebbleBenders</a>. Icons within the <code>brands</code> category are trademarks and copyrighted properties of their respective trademark owners (such as Apple, Google, GitHub, Twitter/X, etc.). Haticons does not claim ownership or endorsement from third-party trademark holders. You are responsible for ensuring that your usage of brand logos complies with each respective brand's guidelines.
            </p>

            <h2 class="fw-bold text-dark mb-2">4. Disclaimer of Warranties</h2>
            <p class="text-muted text-sm mb-2">
                Haticons is provided "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS, PEBBLEBENDERS, OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE.
            </p>

            <h2 class="fw-bold text-dark mb-2">5. Changes &amp; Contact</h2>
            <p class="text-muted text-sm mb-0">
                We reserve the right to revise these Terms of Use from time to time. For any licensing inquiries, issues, or contributions, please open an issue on our official GitHub repository at <a href="https://github.com/prashmaybe/haticons" target="_blank" rel="noopener" class="text-primary fw-medium">github.com/prashmaybe/haticons</a>.
            </p>
        </div>
    </main>

${getFooter('terms')}

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/boodoo@1.2.2/dist/js/boodoo.min.js"></script>
    <script type="text/javascript" src="/assets/js/theme.js"></script>
    <script type="text/javascript" src="/assets/js/custom.js"></script>
</body>
</html>`;

// 2. Privacy Policy
const privacyHtml = `<!DOCTYPE html>
<html lang="en" data-boodoo-theme="light">
<head>
${getHtmlHead(
    'Privacy Policy | Haticons by PebbleBenders',
    'Privacy Policy regarding user data, cookies, and privacy practices on Haticons website.',
    'haticons privacy policy, user privacy, cookies notice'
)}
</head>

<body class="bg-light text-dark">

${getAnnouncementBar()}

${getNavbar('other')}

    <!-- Header Banner -->
    <header class="py-5 bg-white border-bottom text-center">
        <div class="container">
            <div class="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill bg-primary-soft text-primary fw-medium text-xs mb-2 border border-primary-subtle">
                <i class="hi-lock"></i>
                <span>Privacy &amp; Data Protection</span>
            </div>
            <h1 class="display-5 fw-extrabold text-dark mb-2">Privacy Policy</h1>
            <p class="lead text-muted mx-auto header-subtitle-constrained mb-0">
                Your privacy is paramount. Haticons is a client-side open-source project with zero tracking.
            </p>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container py-5 changelogs-main-container">
        <div class="card p-4 p-md-5 rounded-4 border bg-white shadow-xs">
            <h2 class="fw-bold text-dark mb-2">1. Information We Do Not Collect</h2>
            <p class="text-muted text-sm mb-2">
                <strong>Haticons does not collect, sell, rent, or monetize your personal data.</strong> We do not require accounts, sign-ups, email addresses, phone numbers, or credit card information to use Haticons, browse the icons, or download our ZIP packages.
            </p>

            <h2 class="fw-bold text-dark mb-2">2. Local Storage &amp; Cookies</h2>
            <p class="text-muted text-sm mb-2">
                Haticons does not use advertising or tracking cookies. We utilize standard browser <code>localStorage</code> solely for saving your client-side UI preferences:
            </p>
            <ul class="text-muted text-sm mb-2">
                <li><code>haticons_theme_preference</code>: Saves your preferred theme setting (<code>system</code>, <code>light</code>, or <code>dark</code>) so the website remembers your visual preference upon return.</li>
            </ul>

            <h2 class="fw-bold text-dark mb-2">3. Third-Party CDNs &amp; Infrastructure</h2>
            <p class="text-muted text-sm mb-2">
                When you load Haticons via public Content Delivery Networks (such as <strong>jsDelivr</strong> or <strong>Google Fonts</strong> for web typography), your browser directly contacts those third-party networks. Those services operate under their own independent privacy policies (e.g., <a href="https://www.jsdelivr.com/terms/privacy-policy-jsdelivr-net" target="_blank" rel="noopener" class="text-primary">jsDelivr Privacy Policy</a>).
            </p>

            <h2 class="fw-bold text-dark mb-2">4. External Links &amp; Sandboxes</h2>
            <p class="text-muted text-sm mb-2">
                Our documentation contains buttons to launch live interactive demos on external developer platforms such as <strong>CodePen</strong>. Launching an interactive pen transmits standard HTML/CSS code snippet data to CodePen under CodePen's Terms of Service and Privacy Policy.
            </p>

            <h2 class="fw-bold text-dark mb-2">5. Contact Information</h2>
            <p class="text-muted text-sm mb-0">
                If you have any questions or feedback regarding this Privacy Policy, please contact the <a href="https://pebblebenders.com/" class="text-primary fw-medium" target="_blank" rel="noopener">PebbleBenders</a> maintainers via GitHub at <a href="https://github.com/prashmaybe/haticons" target="_blank" rel="noopener" class="text-primary fw-medium">github.com/prashmaybe/haticons</a>.
            </p>
        </div>
    </main>

${getFooter('privacy')}

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/boodoo@1.2.2/dist/js/boodoo.min.js"></script>
    <script type="text/javascript" src="/assets/js/theme.js"></script>
    <script type="text/javascript" src="/assets/js/custom.js"></script>
</body>
</html>`;

// 3. License Page
const licenseFileText = fs.readFileSync(path.join(ROOT_DIR, 'LICENSE'), 'utf-8');
const escapedLicense = licenseFileText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const licenseHtml = `<!DOCTYPE html>
<html lang="en" data-boodoo-theme="light">
<head>
${getHtmlHead(
    'License (GPL-3.0) | Haticons by PebbleBenders',
    'Open source license details for Haticons - GNU General Public License v3.0.',
    'haticons license, gpl 3.0, open source icon license, pebblebenders'
)}
</head>

<body class="bg-light text-dark">

${getAnnouncementBar()}

${getNavbar('other')}

    <!-- Header Banner -->
    <header class="py-5 bg-white border-bottom text-center">
        <div class="container">
            <div class="d-inline-flex align-items-center gap-1 px-2 py-1 rounded-pill bg-primary-soft text-primary fw-medium text-xs mb-2 border border-primary-subtle">
                <i class="hi-check-circle"></i>
                <span>GNU General Public License v3.0</span>
            </div>
            <h1 class="display-5 fw-extrabold text-dark mb-2">Open Source License</h1>
            <p class="lead text-muted mx-auto header-subtitle-constrained mb-0">
                Haticons is 100% free and open-source software, maintained with pride by <a href="https://pebblebenders.com/" class="text-dark fw-bold text-decoration-none" target="_blank" rel="noopener">PebbleBenders</a>.
            </p>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container py-5 changelogs-main-container">
        <!-- Quick Summary Card -->
        <div class="card p-4 rounded-4 border bg-white shadow-xs mb-4">
            <h2 class="h5 fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                <i class="hi-bulb text-primary"></i>
                <span>GPL-3.0 License Summary</span>
            </h2>
            <div class="row g-3 text-sm">
                <div class="col-12 col-md-4">
                    <div class="p-3 bg-light rounded-3 border">
                        <strong class="text-success d-block mb-1"><i class="hi-check-circle me-1"></i> Permissions</strong>
                        <span class="text-muted text-xs">Commercial use, modification, distribution, private use, and patent use.</span>
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="p-3 bg-light rounded-3 border">
                        <strong class="text-primary d-block mb-1"><i class="hi-document me-1"></i> Conditions</strong>
                        <span class="text-muted text-xs">Disclose source, license and copyright notice, state changes, same license (GPLv3).</span>
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="p-3 bg-light rounded-3 border">
                        <strong class="text-danger d-block mb-1"><i class="hi-warning me-1"></i> Limitations</strong>
                        <span class="text-muted text-xs">No liability, no warranty. Software provided "as is".</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Font & Asset Embedding Exception -->
        <div class="card p-4 rounded-4 border bg-white shadow-xs mb-4">
            <h2 class="h6 fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i class="hi-shield text-success"></i>
                <span>Font &amp; Asset Embedding Exception (Commercial &amp; Proprietary Safe)</span>
            </h2>
            <p class="text-muted text-xs mb-2">
                Embedding Haticons webfonts (<code>.woff2</code>, <code>.woff</code>, <code>.ttf</code>), SVGs, or precompiled React and Vue components into commercial, proprietary, or closed-source web, mobile, and desktop applications does <strong>not</strong> trigger GPL-3.0 copyleft obligations on your host application or proprietary source code.
            </p>
            <div class="p-3 bg-light rounded-3 text-xs font-monospace text-dark border">
                As a special exception, if you create a document, web application, mobile application (iOS, Android, React Native, Flutter), desktop application (Electron, Tauri), or digital artwork which uses this font or its compiled vector assets, and embed this font or compiled vector assets into the resulting application, bundle, or document, this font and vector assets do not by themselves cause the resulting application, document, or host source code to be covered by the GNU General Public License.
            </div>
        </div>

        <!-- Third-Party Trademarks & Brand Icons Notice -->
        <div class="card p-4 rounded-4 border bg-white shadow-xs mb-4">
            <h2 class="h6 fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                <i class="hi-lock text-primary"></i>
                <span>Brand Icons &amp; Third-Party Trademarks</span>
            </h2>
            <p class="text-muted text-xs mb-0">
                All third-party company, product, and service brand logos included in the <code>brands</code> category (e.g. Apple, Google, GitHub, Twitter/X, Cursor, Trae, Antigravity, Boodoo, Claude, etc.) are trademarks or registered trademarks of their respective owners. Their inclusion in Haticons does not constitute or imply any affiliation, sponsorship, or endorsement. The GNU General Public License applies to the Haticons font library engine, build tooling, and original vector paths. When embedding brand logos, you are responsible for complying with the respective trademark owner's brand asset and usage guidelines. For a complete audited category inventory, see the <a href="https://github.com/prashmaybe/haticons/blob/release/1.0.2/PROVENANCE.md" target="_blank" rel="noopener" class="text-primary fw-medium">Asset Provenance Manifest</a>.
            </p>
        </div>

        <!-- Full License Text -->
        <div class="card p-4 p-md-5 rounded-4 border bg-white shadow-xs">
            <div class="d-flex align-items-center justify-content-between mb-3">
                <h3 class="h5 fw-bold text-dark mb-0 font-monospace">GNU GENERAL PUBLIC LICENSE (GPL-3.0)</h3>
                <a href="/download/haticons.zip" class="btn btn-sm btn-outline-primary rounded-pill d-inline-flex align-items-center gap-1">
                    <i class="hi-download"></i> Download Sources
                </a>
            </div>
            <pre class="bg-light p-3 rounded-3 text-xs font-monospace text-dark overflow-auto mb-0" style="max-height: 480px; white-space: pre-wrap; line-height: 1.5;">${escapedLicense}</pre>
        </div>
    </main>

${getFooter('license')}

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/boodoo@1.2.2/dist/js/boodoo.min.js"></script>
    <script type="text/javascript" src="/assets/js/theme.js"></script>
    <script type="text/javascript" src="/assets/js/custom.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT_DIR, 'code', 'terms.html'), termsHtml);
fs.writeFileSync(path.join(ROOT_DIR, 'code', 'privacy.html'), privacyHtml);
fs.writeFileSync(path.join(ROOT_DIR, 'code', 'license.html'), licenseHtml);

console.log('Legal pages generated successfully: code/terms.html, code/privacy.html, code/license.html');
