const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const icons = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'dist', 'data', 'icons.json'), 'utf-8'));
const categories = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'dist', 'data', 'categories.json'), 'utf-8'));

// Group icons by category
const catGroups = {};
Object.keys(categories).forEach(cat => {
  catGroups[cat] = [];
});
icons.forEach(i => {
  const c = i.category || 'interface';
  if (!catGroups[c]) catGroups[c] = [];
  catGroups[c].push(i);
});

let categoryRowsHtml = '';
Object.keys(categories).sort().forEach(catKey => {
  const meta = categories[catKey];
  const list = catGroups[catKey] || [];

  let iconsListHtml = '';
  list.forEach(item => {
    iconsListHtml += `
      <div class="col-12 col-sm-6 col-md-4 col-xl-3">
        <div class="p-1 border rounded-3 bg-white d-flex align-items-center gap-1 reference-icon-item" 
             data-class="${item.class}" 
             data-name="${item.name}" 
             data-unicode="${item.content}"
             title="Click to copy <i class='${item.class}'></i>">
          <div class="reference-icon-icon-wrap d-flex align-items-center justify-content-center rounded-2 bg-light text-primary flex-shrink-0">
            <i class="${item.class} fs-3"></i>
          </div>
          <div class="overflow-hidden flex-grow-1">
            <div class="text-sm fw-semibold text-dark text-truncate icon-title-label" title="${item.name}">${item.name}</div>
            <div class="text-xs text-muted font-monospace d-flex align-items-center justify-content-between">
              <span>${item.content}</span>
              <span class="copy-hint text-primary fw-medium">Copy</span>
            </div>
          </div>
        </div>
      </div>`;
  });

  categoryRowsHtml += `
    <div class="category-reference-block mb-4 pb-5 border-bottom" id="cat-${catKey}">
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h3 class="h4 fw-bold text-dark mb-1 d-flex align-items-center gap-1">
            <span>${meta.name}</span>
            <span class="badge bg-primary-soft text-primary rounded-pill text-xs">${list.length} icons</span>
          </h3>
          <p class="text-muted text-sm mb-0">${meta.description}</p>
        </div>
        <div class="d-flex align-items-center gap-1">
          <span class="badge bg-light text-muted border font-monospace text-2xs">
            dist/css/categories/${catKey}.min.css
          </span>
        </div>
      </div>
      <div class="row g-2">
        ${iconsListHtml}
      </div>
    </div>`;
});

let categoryNavLinks = '';
Object.keys(categories).sort().forEach(catKey => {
  const meta = categories[catKey];
  const list = catGroups[catKey] || [];
  categoryNavLinks += `<a class="nav-link text-muted py-05 px-1 rounded hover-bg-light d-flex justify-content-between align-items-center" href="#cat-${catKey}">
    <span>${meta.name}</span>
    <span class="badge bg-light text-muted border rounded-pill">${list.length}</span>
  </a>`;
});

const html = `<!DOCTYPE html>
<html lang="en" data-boodoo-theme="light">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link href="/assets/images/favicon.png" rel="shortcut icon">
    <title>Icon Reference &amp; Cheat Sheet | Haticons by PebbleBenders</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Complete reference for all 494 Haticons classes, CSS unicode codepoints, modular files, and categories.">
    <meta name="keywords" content="haticons reference, font icons reference, icon cheatsheet, unicode codepoints, boodoo icons"/>
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
      (function(){
        var t=localStorage.getItem('haticons_theme_preference')||'system';
        var d=t==='system'?(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):t;
        document.documentElement.setAttribute('data-theme',d);
        document.documentElement.setAttribute('data-boodoo-theme',d);
        document.documentElement.setAttribute('data-theme-setting',t);
      })();
    </script>
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
            <div class="d-flex align-items-center">
                <a class="navbar-brand d-flex align-items-center gap-1 text-decoration-none me-0" href="/">
                    <span class="logo-icon-wrap d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-soft text-primary">
                        <i class="hi-haticons fs-4"></i>
                    </span>
                    <span class="fs-4 fw-bold text-dark tracking-tight">Haticons</span>
                </a>
            </div>
            <div class="d-flex align-items-center gap-1">
                <a href="/" class="btn btn-ghost text-muted d-none d-md-inline-flex align-items-center gap-1 ">
                    <i class="hi-home"></i> Home
                </a>
                <a href="/tutorial.html" class="btn btn-ghost text-muted d-inline-flex align-items-center gap-1 ">
                    <i class="hi-bulb"></i> Tutorial
                </a>
                <a href="/reference.html" class="btn btn-ghost text-primary fw-semibold d-inline-flex align-items-center gap-1 ">
                    <i class="hi-document"></i> Reference
                </a>
                <a href="/changelogs.html" class="btn btn-ghost text-muted d-none d-md-inline-flex align-items-center gap-1 ">
                    <i class="hi-time"></i> Changelogs
                </a>
                <button type="button" class="theme-toggle-btn ms-1" aria-label="Toggle color theme" title="Toggle theme (System / Light / Dark)">
                    <i class="hi-sun theme-toggle-icon fs-5"></i>
                </button>
                <a href="https://www.npmjs.com/package/haticons" target="_blank" rel="noopener" class="btn btn-primary btn-sm rounded-pill px-2 d-inline-flex align-items-center gap-1">
                    <i class="hi-npm"></i>
                    <span>npm</span>
                </a>
            </div>
        </div>
    </nav>

    <!-- Header Banner -->
    <header class="py-5 bg-white border-bottom">
        <div class="container text-center">
            <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-soft text-primary fw-medium text-xs mb-3 border border-primary-subtle">
                <i class="hi-document"></i>
                <span>Complete Icon Catalog &amp; Codepoint Reference</span>
            </div>
            <h1 class="display-5 fw-extrabold text-dark mb-3">Haticons Reference</h1>
            <p class="lead text-muted mx-auto header-subtitle-constrained">
                Direct reference for all <strong>494 icons</strong> organized by category, including CSS unicode values, partial files, and class names.
            </p>
        </div>
    </header>

    <!-- Main Container -->
    <div class="container pt-5">
        <div class="row g-5">
            <!-- Sidebar Navigation -->
            <aside class="col-12 col-lg-3">
                <div class="sticky-top sticky-top-nav">
                    <div class="card p-1 rounded-4 border bg-white shadow-xs">
                        <div class="text-xs fw-bold text-muted text-uppercase tracking-wider mb-1 px-1">Categories (14)</div>
                        <nav class="nav flex-column gap-0.5 text-sm">
                            ${categoryNavLinks}
                        </nav>
                        <hr class="my-1">
                        <a href="/tutorial.html" class="btn btn-outline-primary btn-sm rounded-pill w-100 d-inline-flex align-items-center justify-content-center gap-1 ">
                            <i class="hi-bulb"></i>
                            <span>View Tutorial Guide</span>
                        </a>
                    </div>
                </div>
            </aside>

            <!-- Main Categories List -->
            <main class="col-12 col-lg-9">
                ${categoryRowsHtml}
            </main>
        </div>
    </div>

    <!-- Footer -->
    <footer class="py-5 bg-white border-top text-center mt-5">
        <div class="container">
            <div class="d-flex align-items-center justify-content-center gap-2 mb-2">
                <span class="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-soft text-primary icon-badge-sm">
                    <i class="hi-haticons fs-5"></i>
                </span>
                <span class="fs-5 fw-bold text-dark">Haticons</span>
            </div>
            <p class="text-xs text-muted mb-3">
                An open-source icon system by <strong class="text-dark">PebbleBenders</strong> &middot; Made with <a href="https://www.boodooframework.com/" class="text-primary fw-semibold" target="_blank" rel="noopener">boodoo Framework</a>
            </p>
            <div class="d-flex flex-wrap align-items-center justify-content-center gap-1 text-sm text-muted mb-4">
                <a href="/" class="text-decoration-none text-muted">Homepage</a>
                <span>&bull;</span>
                <a href="/tutorial.html" class="text-decoration-none text-muted">Tutorial</a>
                <span>&bull;</span>
                <a href="/reference.html" class="text-decoration-none text-primary fw-semibold">Reference</a>
                <span>&bull;</span>
                <a href="https://www.npmjs.com/package/haticons" class="text-decoration-none text-muted" target="_blank" rel="noopener">npm package</a>
                <span>&bull;</span>
                <a href="https://www.boodooframework.com/" class="text-decoration-none text-primary" target="_blank" rel="noopener">boodoo UI</a>
            </div>
            <p class="text-xs text-muted mb-0">
                Released under GPL-3.0 License &middot; Designed &amp; Crafted by <strong class="text-dark">PebbleBenders</strong>
            </p>
        </div>
    </footer>

    <!-- boodoo JavaScript Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/boodoo@1.2.2/dist/js/boodoo.min.js"></script>
    <script src="/assets/js/theme.js"></script>
    <script>
      function showToast(message) {
        let toast = document.getElementById('reference-toast');
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'reference-toast';
          toast.className = 'copy-toast';
          document.body.appendChild(toast);
        }
        toast.innerHTML = '<i class="hi-check-circle me-1 text-success"></i> ' + message;
        toast.style.display = 'block';
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => {
          toast.style.display = 'none';
        }, 2200);
      }

      document.addEventListener('click', function(e) {
        const item = e.target.closest('.reference-icon-item');
        if (!item) return;
        const iconClass = item.getAttribute('data-class');
        const iconName = item.getAttribute('data-name');
        const snippet = '<i class="' + iconClass + '"></i>';

        navigator.clipboard.writeText(snippet).then(() => {
          showToast('Copied: &lt;i class="' + iconClass + '"&gt;&lt;/i&gt;');
        }).catch(() => {
          const textarea = document.createElement('textarea');
          textarea.value = snippet;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          showToast('Copied: &lt;i class="' + iconClass + '"&gt;&lt;/i&gt;');
        });
      });
    </script>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT_DIR, 'code', 'reference.html'), html);
console.log('code/reference.html generated successfully!');
