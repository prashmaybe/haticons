/**
 * Haticons Global Interactivity Controller
 * 100% Vanilla JavaScript - Zero external runtime dependencies.
 * Handles:
 *  - Unified clipboard copying with button feedback and toasts
 *  - Mobile navbar collapse toggler
 *  - Setup Hub tabs switching
 *  - Homepage Icon Explorer (debounced search, category filter, style & animation modifiers)
 *  - Homepage Interactive Playground (live preview, size, color swatches, animations, code tabs)
 *  - Reference Catalog (category scrollspy, search, live style preview)
 *  - In-Browser Customizer Modal (HTML, Class, SVG, JSX copy, SVG download)
 *  - Custom Subset Tray & Standalone CSS/CLI Exporter with localStorage persistence
 *  - Tutorial Page Table of Contents Scrollspy & CodePen integration
 */

(function () {
    'use strict';

    // -------------------------------------------------------------
    // 1. Toast Notification Helper
    // -------------------------------------------------------------
    var toastTimeout = null;

    function getOrCreateToast() {
        var toast = document.getElementById('haticonsToast') ||
            document.getElementById('tutorialToast') ||
            document.getElementById('reference-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'haticonsToast';
            toast.className = 'copy-toast d-none';
            document.body.appendChild(toast);
        }
        return toast;
    }

    window.showHaticonsToast = function (message) {
        var toast = getOrCreateToast();
        toast.textContent = '';
        var icon = document.createElement('i');
        icon.className = 'hi-check-circle me-1 text-success';
        toast.appendChild(icon);
        toast.appendChild(document.createTextNode(' ' + (message || 'Copied to clipboard!')));
        toast.classList.remove('d-none');
        toast.style.display = 'block';

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(function () {
            toast.classList.add('d-none');
            toast.style.display = '';
        }, 2200);
    };

    // -------------------------------------------------------------
    // 2. Clipboard Copy Utility
    // -------------------------------------------------------------
    window.copyHaticonsText = function (text, message, onSuccess) {
        if (!text) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                window.showHaticonsToast(message);
                if (typeof onSuccess === 'function') onSuccess();
            }).catch(function () {
                fallbackCopy(text, message, onSuccess);
            });
        } else {
            fallbackCopy(text, message, onSuccess);
        }
    };

    function fallbackCopy(text, message, onSuccess) {
        var temp = document.createElement('textarea');
        temp.value = text;
        temp.style.position = 'fixed';
        temp.style.opacity = '0';
        document.body.appendChild(temp);
        temp.select();
        try {
            document.execCommand('copy');
            window.showHaticonsToast(message);
            if (typeof onSuccess === 'function') onSuccess();
        } catch (e) {
            console.error('Copy failed:', e);
        }
        document.body.removeChild(temp);
    }

    // -------------------------------------------------------------
    // 3. Custom Subset State & LocalStorage Persistence
    // -------------------------------------------------------------
    var SUBSET_STORAGE_KEY = 'haticons_selected_subset';
    var selectedSubset = new Set();

    try {
        var savedSubset = localStorage.getItem(SUBSET_STORAGE_KEY);
        if (savedSubset) {
            JSON.parse(savedSubset).forEach(function (name) {
                if (name) selectedSubset.add(name);
            });
        }
    } catch (e) {
        console.warn('Could not read saved subset from localStorage', e);
    }

    function saveSubsetToStorage() {
        try {
            localStorage.setItem(SUBSET_STORAGE_KEY, JSON.stringify(Array.from(selectedSubset)));
        } catch (e) {}
    }

    function updateAllSubsetCounts() {
        var count = selectedSubset.size;
        document.querySelectorAll('.nav-subset-count').forEach(function (badge) {
            badge.textContent = count;
        });

        var trayStatus = document.getElementById('subsetStatusText');
        if (trayStatus) {
            trayStatus.textContent = '';
            trayStatus.appendChild(document.createTextNode('Subset Tray: '));
            var countStrong = document.createElement('strong');
            countStrong.textContent = count;
            trayStatus.appendChild(countStrong);
            trayStatus.appendChild(document.createTextNode(' icons'));
        }

        var openBtn = document.getElementById('openSubsetModalBtn');
        if (openBtn) {
            openBtn.disabled = count === 0;
        }

        // Update modal subset count if open
        var modalCount = document.getElementById('subsetModalCount');
        if (modalCount) modalCount.textContent = count;
    }

    // -------------------------------------------------------------
    // 4. Modal Helpers (Bootstrap / boodoo / Pure JS Fallback)
    // -------------------------------------------------------------
    function openModalById(modalId) {
        var modalEl = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
        if (!modalEl) return;

        if (window.boodoo && window.boodoo.Modal) {
            try {
                var bModal = window.boodoo.Modal.getOrCreateInstance ?
                    window.boodoo.Modal.getOrCreateInstance(modalEl) : new window.boodoo.Modal(modalEl);
                bModal.show();
                return;
            } catch (err) {}
        }
        if (window.bootstrap && window.bootstrap.Modal) {
            try {
                var bsModal = window.bootstrap.Modal.getOrCreateInstance ?
                    window.bootstrap.Modal.getOrCreateInstance(modalEl) : new window.bootstrap.Modal(modalEl);
                bsModal.show();
                return;
            } catch (err) {}
        }

        // Pure JS fallback
        modalEl.classList.add('show');
        modalEl.style.display = 'block';
        document.body.classList.add('modal-open');
        var bd = document.getElementById('customBackdrop');
        if (!bd) {
            bd = document.createElement('div');
            bd.className = 'modal-backdrop fade show';
            bd.id = 'customBackdrop';
            document.body.appendChild(bd);
        }
    }

    function closeAllModals() {
        var modalIds = ['iconDetailModal', 'customizerModal', 'subsetExportModal'];
        modalIds.forEach(function (id) {
            var modal = document.getElementById(id);
            if (modal) {
                if (window.boodoo && window.boodoo.Modal) {
                    try {
                        var inst = window.boodoo.Modal.getInstance ? window.boodoo.Modal.getInstance(modal) : null;
                        if (inst && typeof inst.hide === 'function') inst.hide();
                    } catch (e) {}
                }
                if (window.bootstrap && window.bootstrap.Modal) {
                    try {
                        var bsInst = window.bootstrap.Modal.getInstance ? window.bootstrap.Modal.getInstance(modal) : null;
                        if (bsInst && typeof bsInst.hide === 'function') bsInst.hide();
                    } catch (e) {}
                }
                modal.classList.remove('show');
                modal.style.display = 'none';
            }
        });
        document.body.classList.remove('modal-open');
        var backdrop = document.getElementById('customBackdrop');
        if (backdrop) backdrop.remove();
        document.querySelectorAll('.modal-backdrop').forEach(function (bd) {
            bd.remove();
        });
    }

    // -------------------------------------------------------------
    // 5. DOM Initialization
    // -------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function () {
        // Initialize subset count badges
        updateAllSubsetCounts();

        // ---------------------------------------------------------
        // A. Copy Button Delegations (.copy-btn & .code-copy-btn)
        // ---------------------------------------------------------
        document.addEventListener('click', function (e) {
            // 1. Copy Buttons with data-copy attribute (.copy-btn)
            var copyBtn = e.target.closest('.copy-btn');
            if (copyBtn) {
                e.preventDefault();
                var text = copyBtn.getAttribute('data-copy');
                var origIcon = copyBtn.querySelector('i');
                var origClass = origIcon ? origIcon.className : '';

                window.copyHaticonsText(text, 'Copied to clipboard!', function () {
                    if (origIcon) {
                        origIcon.className = 'hi-check text-success';
                        setTimeout(function () {
                            origIcon.className = origClass;
                        }, 2000);
                    }
                });
                return;
            }

            // 2. Code Snippet Copy Buttons (.code-copy-btn)
            var codeCopyBtn = e.target.closest('.code-copy-btn');
            if (codeCopyBtn) {
                e.preventDefault();
                var codeText = codeCopyBtn.getAttribute('data-code');
                if (!codeText) {
                    var box = codeCopyBtn.closest('.code-snippet-box');
                    var codeEl = box ? box.querySelector('code') : null;
                    codeText = codeEl ? codeEl.innerText : '';
                }
                window.copyHaticonsText(codeText, 'Snippet copied to clipboard!', function () {
                    codeCopyBtn.classList.add('copied');
                    codeCopyBtn.textContent = '';
                    var chkIcon = document.createElement('i');
                    chkIcon.className = 'hi-check me-1';
                    var chkSpan = document.createElement('span');
                    chkSpan.textContent = 'Copied!';
                    codeCopyBtn.appendChild(chkIcon);
                    codeCopyBtn.appendChild(chkSpan);

                    setTimeout(function () {
                        codeCopyBtn.classList.remove('copied');
                        codeCopyBtn.textContent = '';
                        var pasteIcon = document.createElement('i');
                        pasteIcon.className = 'hi-paste me-1';
                        var pasteSpan = document.createElement('span');
                        pasteSpan.textContent = 'Copy';
                        codeCopyBtn.appendChild(pasteIcon);
                        codeCopyBtn.appendChild(pasteSpan);
                    }, 2000);
                });
                return;
            }

            // 3. CodePen Launch Buttons (.code-codepen-btn, .modal-codepen-btn)
            var codepenBtn = e.target.closest('.code-codepen-btn, .modal-codepen-btn');
            if (codepenBtn) {
                e.preventDefault();
                var title = codepenBtn.getAttribute('data-title') || 'Haticons Example';
                var htmlCode = codepenBtn.getAttribute('data-html');
                var cssCode = codepenBtn.getAttribute('data-css') || '';
                var jsCode = codepenBtn.getAttribute('data-js') || '';
                var cssExt = codepenBtn.getAttribute('data-css-external') ||
                    'https://cdn.jsdelivr.net/npm/haticons@1.0.2/dist/css/haticons.min.css;https://cdn.jsdelivr.net/npm/boodoo@1.2.2/dist/css/boodoo.min.css';

                if (!htmlCode) {
                    var pbox = codepenBtn.closest('.code-snippet-box');
                    var pcode = pbox ? pbox.querySelector('code') : null;
                    htmlCode = pcode ? pcode.innerText : '';
                }

                var penData = {
                    title: title,
                    description: 'Haticons interactive code example',
                    html: htmlCode,
                    css: cssCode,
                    js: jsCode,
                    css_external: cssExt,
                    editors: '100'
                };

                var form = document.createElement('form');
                form.action = 'https://codepen.io/pen/define';
                form.method = 'POST';
                form.target = '_blank';
                form.style.display = 'none';

                var input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'data';
                input.value = JSON.stringify(penData);

                form.appendChild(input);
                document.body.appendChild(form);
                form.submit();
                setTimeout(function () { form.remove(); }, 1000);
                return;
            }

            // 4. Mobile Navbar Toggler (.navbar-toggler)
            var navToggler = e.target.closest('.navbar-toggler');
            if (navToggler) {
                var targetSel = navToggler.getAttribute('data-boodoo-target') || navToggler.getAttribute('data-bs-target') || '#mainNavbarCollapse';
                var collapseEl = document.querySelector(targetSel);
                if (collapseEl) {
                    var isShown = collapseEl.classList.contains('show');
                    if (isShown) {
                        collapseEl.classList.remove('show');
                        navToggler.setAttribute('aria-expanded', 'false');
                    } else {
                        collapseEl.classList.add('show');
                        navToggler.setAttribute('aria-expanded', 'true');
                    }
                }
                return;
            }

            // 5. Setup Hub Tabs Switching (.start-method-tab)
            var tabBtn = e.target.closest('.start-method-tab');
            if (tabBtn) {
                e.preventDefault();
                var targetPaneSel = tabBtn.getAttribute('data-target');
                var allTabs = document.querySelectorAll('.start-method-tab');
                allTabs.forEach(function (t) {
                    t.classList.remove('active');
                    t.classList.add('text-muted');
                });
                tabBtn.classList.add('active');
                tabBtn.classList.remove('text-muted');

                var panes = document.querySelectorAll('.setup-tab-pane');
                panes.forEach(function (p) {
                    p.classList.add('d-none');
                });
                var activePane = document.querySelector(targetPaneSel);
                if (activePane) activePane.classList.remove('d-none');
                return;
            }

            // 6. Subset Tray Open Button (.nav-subset-btn, #openSubsetModalBtn)
            var subsetTrigger = e.target.closest('.nav-subset-btn, #openSubsetModalBtn');
            if (subsetTrigger) {
                e.preventDefault();
                renderSubsetModal();
                openModalById('subsetExportModal');
                return;
            }

            // 7. Icon Card Click -> Open Customizer
            var iconCard = e.target.closest('.haticon-card, .reference-icon-item');
            if (iconCard) {
                var cls = iconCard.getAttribute('data-class');
                var name = iconCard.getAttribute('data-name');
                var unicode = iconCard.getAttribute('data-unicode');
                var pathD = iconCard.getAttribute('data-path') || '';
                var category = iconCard.getAttribute('data-category') || '';

                if (window.openHaticonsCustomizer) {
                    window.openHaticonsCustomizer({
                        cls: cls,
                        name: name,
                        unicode: unicode,
                        path: pathD,
                        category: category
                    });
                } else {
                    var snippet = '<i class="' + cls + '"></i>';
                    window.copyHaticonsText(snippet, 'Copied: ' + snippet);
                }
                return;
            }

            // 8. Modal Dismiss Click Handlers
            if (e.target.closest('[data-bs-dismiss="modal"], [data-boodoo-dismiss="modal"], #customBackdrop')) {
                closeAllModals();
            }
        });

        // ESC key closes any open modal
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeAllModals();
            }
        });

        // ---------------------------------------------------------
        // B. Homepage Icon Explorer Controller
        // ---------------------------------------------------------
        var iconCards = document.querySelectorAll('.haticon-card');
        if (iconCards.length > 0) {
            var activeCategory = 'all';
            var activeStyle = 'all';
            var activeAnim = '';
            var searchQuery = '';
            var visibleCountEl = document.getElementById('visibleCount');
            var noResultsEl = document.getElementById('noResults');
            var searchInput = document.getElementById('iconSearchInput');
            var categoryButtons = document.querySelectorAll('.category-filter-btn');
            var styleButtons = document.querySelectorAll('.style-filter-btn');
            var animButtons = document.querySelectorAll('.anim-filter-btn');
            var resetBtn = document.getElementById('resetSearchBtn');

            function updateCardGlyphs() {
                iconCards.forEach(function (card) {
                    var baseCls = card.getAttribute('data-class') || '';
                    var iconEl = card.querySelector('.haticon-display-icon');
                    if (!iconEl) return;

                    var resolvedCls = baseCls;
                    if (activeStyle === 'outline') resolvedCls = baseCls + '-outline';
                    else if (activeStyle === 'fill') resolvedCls = baseCls + '-fill';
                    else if (activeStyle === 'sharp') resolvedCls = baseCls + '-sharp';

                    var classes = [resolvedCls, 'haticon-display-icon'];
                    if (activeAnim) classes.push('hi-' + activeAnim);
                    iconEl.className = classes.join(' ');
                });
            }

            function applyExplorerFilter() {
                var visibleCount = 0;
                var q = searchQuery.toLowerCase().trim();

                iconCards.forEach(function (card) {
                    var cardCat = card.getAttribute('data-category') || '';
                    var cardName = (card.getAttribute('data-name') || '').toLowerCase();
                    var cardClass = (card.getAttribute('data-class') || '').toLowerCase();
                    var cardSearch = (card.getAttribute('data-search') || '').toLowerCase();

                    var matchesCategory = (activeCategory === 'all' || cardCat === activeCategory);
                    var matchesSearch = (!q || cardName.indexOf(q) !== -1 || cardClass.indexOf(q) !== -1 || cardSearch.indexOf(q) !== -1);

                    if (matchesCategory && matchesSearch) {
                        card.classList.remove('d-none');
                        visibleCount++;
                    } else {
                        card.classList.add('d-none');
                    }
                });

                if (visibleCountEl) visibleCountEl.textContent = visibleCount;
                if (noResultsEl) {
                    if (visibleCount === 0) noResultsEl.classList.remove('d-none');
                    else noResultsEl.classList.add('d-none');
                }
            }

            // Search input with debounce
            if (searchInput) {
                var searchTimer = null;
                searchInput.addEventListener('input', function () {
                    var val = this.value;
                    clearTimeout(searchTimer);
                    searchTimer = setTimeout(function () {
                        searchQuery = val;
                        applyExplorerFilter();
                    }, 100);
                });
            }

            // Category filter pills
            categoryButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    activeCategory = this.getAttribute('data-category') || 'all';
                    categoryButtons.forEach(function (b) {
                        b.classList.remove('active', 'btn-primary');
                        b.classList.add('btn-outline-secondary', 'bg-white');
                    });
                    this.classList.add('active', 'btn-primary');
                    this.classList.remove('btn-outline-secondary', 'bg-white');
                    applyExplorerFilter();
                });
            });

            // Style filter buttons
            styleButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    activeStyle = this.getAttribute('data-style') || 'all';
                    styleButtons.forEach(function (b) {
                        b.classList.remove('active', 'btn-primary');
                        b.classList.add('btn-outline-secondary');
                    });
                    this.classList.add('active', 'btn-primary');
                    this.classList.remove('btn-outline-secondary');
                    updateCardGlyphs();
                });
            });

            // Animation filter buttons
            animButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var anim = this.getAttribute('data-anim') || '';
                    if (activeAnim === anim) {
                        activeAnim = '';
                        this.classList.remove('active', 'btn-primary');
                        this.classList.add('btn-outline-secondary');
                    } else {
                        activeAnim = anim;
                        animButtons.forEach(function (b) {
                            b.classList.remove('active', 'btn-primary');
                            b.classList.add('btn-outline-secondary');
                        });
                        this.classList.add('active', 'btn-primary');
                        this.classList.remove('btn-outline-secondary');
                    }
                    updateCardGlyphs();
                });
            });

            // Reset search button
            if (resetBtn) {
                resetBtn.addEventListener('click', function () {
                    searchQuery = '';
                    activeCategory = 'all';
                    activeStyle = 'all';
                    activeAnim = '';
                    if (searchInput) searchInput.value = '';

                    categoryButtons.forEach(function (b) {
                        b.classList.remove('active', 'btn-primary');
                        b.classList.add('btn-outline-secondary', 'bg-white');
                    });
                    var allBtn = document.querySelector('.category-filter-btn[data-category="all"]');
                    if (allBtn) {
                        allBtn.classList.add('active', 'btn-primary');
                        allBtn.classList.remove('btn-outline-secondary', 'bg-white');
                    }

                    styleButtons.forEach(function (b) {
                        b.classList.remove('active', 'btn-primary');
                        b.classList.add('btn-outline-secondary');
                    });
                    var allStyle = document.querySelector('.style-filter-btn[data-style="all"]');
                    if (allStyle) {
                        allStyle.classList.add('active', 'btn-primary');
                        allStyle.classList.remove('btn-outline-secondary');
                    }

                    animButtons.forEach(function (b) {
                        b.classList.remove('active', 'btn-primary');
                        b.classList.add('btn-outline-secondary');
                    });

                    updateCardGlyphs();
                    applyExplorerFilter();
                    if (searchInput) searchInput.focus();
                });
            }
        }

        // ---------------------------------------------------------
        // C. Homepage Interactive Playground Controller
        // ---------------------------------------------------------
        var pgIconDisplay = document.getElementById('pgIconDisplay');
        if (pgIconDisplay) {
            var pgIconSelect = document.getElementById('pgIconSelect');
            var pgIconLabel = document.getElementById('pgIconLabel');
            var pgSizeRange = document.getElementById('pgSizeRange');
            var pgSizeVal = document.getElementById('pgSizeVal');
            var pgColorPicker = document.getElementById('pgColorPicker');
            var pgColorHex = document.getElementById('pgColorHex');
            var pgColorButtons = document.querySelectorAll('.pg-color-btn');
            var pgAnimButtons = document.querySelectorAll('.pg-anim-btn');
            var pgCodeContent = document.getElementById('pgCodeContent');
            var pgCodeLangLabel = document.getElementById('pgCodeLangLabel');
            var pgSnippetTabButtons = document.querySelectorAll('.pg-tab-btn');
            var pgCopyCodeBtn = document.getElementById('pgCopyCodeBtn');
            var pgCopyPrimaryBtn = document.getElementById('pgCopyPrimaryBtn');

            var currentPgIcon = 'haticons';
            var currentPgSize = '64';
            var currentPgColor = '#7c3aed';
            var currentPgAnim = '';
            var currentPgMode = 'html';

            function updatePlayground() {
                var cls = 'hi-' + currentPgIcon;
                var animCls = currentPgAnim ? ' ' + currentPgAnim : '';
                pgIconDisplay.className = cls + animCls;
                pgIconDisplay.style.fontSize = currentPgSize + 'px';
                pgIconDisplay.style.color = currentPgColor;

                if (pgIconLabel) pgIconLabel.textContent = cls + (currentPgAnim ? ' (' + currentPgAnim + ')' : '');
                if (pgSizeVal) pgSizeVal.textContent = currentPgSize + 'px';
                if (pgColorHex) pgColorHex.textContent = currentPgColor;

                renderPlaygroundCode();
            }

            function renderPlaygroundCode() {
                if (!pgCodeContent) return;
                var cls = 'hi-' + currentPgIcon;
                var fullClass = cls + (currentPgAnim ? ' ' + currentPgAnim : '');
                var output = '';

                if (currentPgMode === 'html') {
                    if (pgCodeLangLabel) pgCodeLangLabel.innerHTML = '<i class="hi-html5"></i> HTML Markup';
                    output = '<i class="' + fullClass + '" style="font-size: ' + currentPgSize + 'px; color: ' + currentPgColor + ';"></i>';
                } else if (currentPgMode === 'react') {
                    if (pgCodeLangLabel) pgCodeLangLabel.innerHTML = '<i class="hi-react"></i> React JSX';
                    var compName = 'Hi' + currentPgIcon.split('-').map(function (w) {
                        return w.charAt(0).toUpperCase() + w.slice(1);
                    }).join('');
                    output = 'import { ' + compName + " } from 'haticons/react';\n\n<" + compName + ' size={' + currentPgSize + '} color="' + currentPgColor + '"' + (currentPgAnim ? ' className="' + currentPgAnim + '"' : '') + ' />';
                } else if (currentPgMode === 'svg') {
                    if (pgCodeLangLabel) pgCodeLangLabel.innerHTML = '<i class="hi-paintbox"></i> Vector SVG';
                    output = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="' + currentPgSize + '" height="' + currentPgSize + '" fill="' + currentPgColor + '">\n  <!-- ' + cls + ' vector path -->\n  <use href="/assets/fonts/haticons.svg#' + currentPgIcon + '" />\n</svg>';
                } else if (currentPgMode === 'css') {
                    if (pgCodeLangLabel) pgCodeLangLabel.innerHTML = '<i class="hi-css3"></i> Custom CSS';
                    output = '.' + cls + ':before {\n  font-family: "haticons";\n  font-size: ' + currentPgSize + 'px;\n  color: ' + currentPgColor + ';\n}';
                }

                pgCodeContent.textContent = output;
                if (pgCopyCodeBtn) pgCopyCodeBtn.setAttribute('data-code', output);
                if (pgCopyPrimaryBtn) pgCopyPrimaryBtn.setAttribute('data-copy', '<i class="' + fullClass + '"></i>');
            }

            if (pgIconSelect) {
                pgIconSelect.addEventListener('change', function () {
                    currentPgIcon = this.value;
                    updatePlayground();
                });
            }

            if (pgSizeRange) {
                pgSizeRange.addEventListener('input', function () {
                    currentPgSize = this.value;
                    updatePlayground();
                });
            }

            if (pgColorPicker) {
                pgColorPicker.addEventListener('input', function () {
                    currentPgColor = this.value;
                    updatePlayground();
                });
            }

            pgColorButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var col = this.getAttribute('data-color');
                    if (col) {
                        currentPgColor = col;
                        if (pgColorPicker) pgColorPicker.value = col;
                        updatePlayground();
                    }
                });
            });

            pgAnimButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    pgAnimButtons.forEach(function (b) {
                        b.classList.remove('active', 'btn-primary');
                        b.classList.add('btn-outline-secondary');
                    });
                    this.classList.add('active', 'btn-primary');
                    this.classList.remove('btn-outline-secondary');
                    currentPgAnim = this.getAttribute('data-anim') || '';
                    updatePlayground();
                });
            });

            pgSnippetTabButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    pgSnippetTabButtons.forEach(function (b) {
                        b.classList.remove('active');
                        b.classList.add('text-muted');
                    });
                    this.classList.add('active');
                    this.classList.remove('text-muted');
                    currentPgMode = this.getAttribute('data-mode') || 'html';
                    renderPlaygroundCode();
                });
            });

            updatePlayground();
        }

        // ---------------------------------------------------------
        // D. Shared Icon Customizer Modal Controller
        // ---------------------------------------------------------
        var currentCustomizerData = null;

        function updateCustomizerSubsetButton() {
            var toggleBtn = document.getElementById('custToggleSubsetBtn');
            var toggleText = document.getElementById('custSubsetText');
            if (currentCustomizerData && toggleBtn && toggleText) {
                if (selectedSubset.has(currentCustomizerData.name)) {
                    toggleBtn.classList.remove('btn-outline-info');
                    toggleBtn.classList.add('btn-info', 'text-white');
                    toggleText.textContent = 'In Subset (Remove)';
                } else {
                    toggleBtn.classList.remove('btn-info', 'text-white');
                    toggleBtn.classList.add('btn-outline-info');
                    toggleText.textContent = 'Add to Subset';
                }
            }
        }

        window.openHaticonsCustomizer = function (data) {
            currentCustomizerData = data;
            var modalEl = document.getElementById('customizerModal');
            if (!modalEl) {
                var fallbackSnippet = '<i class="' + data.cls + '"></i>';
                window.copyHaticonsText(fallbackSnippet, 'Copied ' + fallbackSnippet);
                return;
            }

            var modalTitle = document.getElementById('custModalTitle');
            var badgeName = document.getElementById('custBadgeName');
            var svgPath = document.getElementById('custSvgPath');
            var svgPreview = document.getElementById('custSvgPreview');
            var sizeRange = document.getElementById('custSizeRange');
            var sizeVal = document.getElementById('custSizeVal');
            var colorPicker = document.getElementById('custColorPicker');

            if (modalTitle) {
                modalTitle.textContent = '';
                var tIcon = document.createElement('i');
                tIcon.className = 'hi-paintbox text-primary me-2';
                var tSpan = document.createElement('span');
                tSpan.textContent = 'Icon Customizer: ' + (data && data.cls ? data.cls : '');
                modalTitle.appendChild(tIcon);
                modalTitle.appendChild(tSpan);
            }
            if (badgeName) {
                badgeName.textContent = data.cls + ' (' + (data.unicode || '') + ')';
            }
            if (svgPath) {
                svgPath.setAttribute('d', data.path || '');
            }

            var curColor = colorPicker ? colorPicker.value : '#7c3aed';
            var curSize = sizeRange ? sizeRange.value : '72';
            if (svgPreview) {
                svgPreview.setAttribute('width', curSize);
                svgPreview.setAttribute('height', curSize);
                svgPreview.setAttribute('fill', curColor);
            }
            if (sizeVal) {
                sizeVal.textContent = curSize + 'px';
            }

            updateCustomizerSubsetButton();
            openModalById(modalEl);
        };

        // Customizer Controls
        var custSizeRange = document.getElementById('custSizeRange');
        var custSizeVal = document.getElementById('custSizeVal');
        var custSvgPreview = document.getElementById('custSvgPreview');
        var custColorPicker = document.getElementById('custColorPicker');

        if (custSizeRange && custSvgPreview) {
            custSizeRange.addEventListener('input', function () {
                var sz = this.value;
                custSvgPreview.setAttribute('width', sz);
                custSvgPreview.setAttribute('height', sz);
                if (custSizeVal) custSizeVal.textContent = sz + 'px';
            });
        }

        if (custColorPicker && custSvgPreview) {
            custColorPicker.addEventListener('input', function () {
                custSvgPreview.setAttribute('fill', this.value);
            });
        }

        document.querySelectorAll('#customizerModal .quick-color').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var col = this.getAttribute('data-color');
                if (col && custColorPicker && custSvgPreview) {
                    custColorPicker.value = col;
                    custSvgPreview.setAttribute('fill', col);
                }
            });
        });

        // Copy HTML Button in Customizer
        var custCopyHtmlBtn = document.getElementById('custCopyHtmlBtn');
        if (custCopyHtmlBtn) {
            custCopyHtmlBtn.addEventListener('click', function () {
                if (!currentCustomizerData) return;
                var htmlTag = '<i class="' + currentCustomizerData.cls + '"></i>';
                window.copyHaticonsText(htmlTag, 'Copied ' + htmlTag);
            });
        }

        // Copy Class Button in Customizer
        var custCopyClassBtn = document.getElementById('custCopyClassBtn');
        if (custCopyClassBtn) {
            custCopyClassBtn.addEventListener('click', function () {
                if (!currentCustomizerData) return;
                window.copyHaticonsText(currentCustomizerData.cls, 'Copied class name: ' + currentCustomizerData.cls);
            });
        }

        // Copy JSX Button in Customizer
        var custCopyJsxBtn = document.getElementById('custCopyJsxBtn');
        if (custCopyJsxBtn) {
            custCopyJsxBtn.addEventListener('click', function () {
                if (!currentCustomizerData) return;
                var color = custColorPicker ? custColorPicker.value : '#7c3aed';
                var size = custSizeRange ? custSizeRange.value : '24';
                var path = currentCustomizerData.path || '';
                var jsx = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="' + size + '" height="' + size + '" fill="' + color + '">\n' +
                    '  <g transform="scale(1, -1) translate(0, -960)">\n' +
                    '    <path d="' + path + '" />\n' +
                    '  </g>\n' +
                    '</svg>';
                window.copyHaticonsText(jsx, 'Copied ' + currentCustomizerData.cls + ' JSX component code!');
            });
        }

        // Copy SVG Button in Customizer
        var custCopySvgBtn = document.getElementById('custCopySvgBtn');
        if (custCopySvgBtn) {
            custCopySvgBtn.addEventListener('click', function () {
                if (!currentCustomizerData) return;
                var color = custColorPicker ? custColorPicker.value : '#7c3aed';
                var size = custSizeRange ? custSizeRange.value : '24';
                var path = currentCustomizerData.path || '';
                var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="' + size + '" height="' + size + '" fill="' + color + '">\n' +
                    '  <g transform="scale(1, -1) translate(0, -960)">\n' +
                    '    <path d="' + path + '" />\n' +
                    '  </g>\n' +
                    '</svg>';
                window.copyHaticonsText(svg, 'Copied ' + currentCustomizerData.cls + ' SVG code!');
            });
        }

        // Download SVG Button in Customizer
        var custDownloadSvgBtn = document.getElementById('custDownloadSvgBtn');
        if (custDownloadSvgBtn) {
            custDownloadSvgBtn.addEventListener('click', function () {
                if (!currentCustomizerData) return;
                var color = custColorPicker ? custColorPicker.value : '#7c3aed';
                var size = custSizeRange ? custSizeRange.value : '1024';
                var path = currentCustomizerData.path || '';
                var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="' + size + '" height="' + size + '" fill="' + color + '">\n' +
                    '  <g transform="scale(1, -1) translate(0, -960)">\n' +
                    '    <path d="' + path + '" />\n' +
                    '  </g>\n' +
                    '</svg>';
                var blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = (currentCustomizerData.name || 'icon') + '.svg';
                document.body.appendChild(a);
                a.click();
                setTimeout(function () {
                    a.remove();
                    URL.revokeObjectURL(url);
                }, 100);
            });
        }

        // Toggle Subset Button in Customizer
        var custToggleSubsetBtn = document.getElementById('custToggleSubsetBtn');
        if (custToggleSubsetBtn) {
            custToggleSubsetBtn.addEventListener('click', function () {
                if (!currentCustomizerData) return;
                var name = currentCustomizerData.name;
                if (selectedSubset.has(name)) {
                    selectedSubset.delete(name);
                } else {
                    selectedSubset.add(name);
                }
                saveSubsetToStorage();
                updateAllSubsetCounts();
                updateCustomizerSubsetButton();
            });
        }

        // ---------------------------------------------------------
        // E. Custom Subset Exporter Modal Controller
        // ---------------------------------------------------------
        function renderSubsetModal() {
            var iconList = Array.from(selectedSubset);
            var subsetModalCount = document.getElementById('subsetModalCount');
            var subsetSelectedTags = document.getElementById('subsetSelectedTags');
            var subsetCliCmd = document.getElementById('subsetCliCmd');
            var subsetCssOutput = document.getElementById('subsetCssOutput');

            if (subsetModalCount) subsetModalCount.textContent = iconList.length;

            if (subsetSelectedTags) {
                subsetSelectedTags.textContent = '';
                if (iconList.length === 0) {
                    var emptyNotice = document.createElement('div');
                    emptyNotice.className = 'text-muted text-xs p-2 text-center w-100';
                    emptyNotice.textContent = 'Your subset tray is empty. Click any icon card and select "Add to Subset".';
                    subsetSelectedTags.appendChild(emptyNotice);
                } else {
                    iconList.forEach(function (ic) {
                        var badge = document.createElement('span');
                        badge.className = 'badge bg-white text-dark border rounded-pill px-2 py-1 d-inline-flex align-items-center gap-1';
                        var badgeIcon = document.createElement('i');
                        badgeIcon.className = 'hi-' + ic + ' text-primary';
                        badge.appendChild(badgeIcon);
                        badge.appendChild(document.createTextNode(' ' + ic));

                        var removeIcon = document.createElement('i');
                        removeIcon.className = 'hi-close ms-1 text-muted cursor-pointer';
                        removeIcon.style.cursor = 'pointer';
                        removeIcon.addEventListener('click', function (e) {
                            e.stopPropagation();
                            selectedSubset.delete(ic);
                            saveSubsetToStorage();
                            updateAllSubsetCounts();
                            renderSubsetModal();
                            updateCustomizerSubsetButton();
                        });
                        badge.appendChild(removeIcon);
                        subsetSelectedTags.appendChild(badge);
                    });
                }
            }

            // CLI command
            if (subsetCliCmd) {
                subsetCliCmd.value = iconList.length > 0 ?
                    'npx haticons subset --icons=' + iconList.join(',') :
                    'npx haticons subset --icons=cart,user,search';
            }

            // Standalone CSS
            if (subsetCssOutput) {
                var cssLines = [
                    '/* Haticons Custom Zero-Waste Subset (' + iconList.length + ' icons) */',
                    '@font-face {',
                    '  font-family: "haticons";',
                    '  src: url("https://cdn.jsdelivr.net/npm/haticons@1.0.2/dist/fonts/haticons.woff2") format("woff2");',
                    '  font-display: swap;',
                    '}',
                    '[class^="hi-"], [class*=" hi-"] {',
                    '  font-family: "haticons" !important;',
                    '  speak: never;',
                    '  font-style: normal;',
                    '  font-weight: normal;',
                    '  font-variant: normal;',
                    '  text-transform: none;',
                    '  line-height: 1;',
                    '  -webkit-font-smoothing: antialiased;',
                    '}'
                ];

                iconList.forEach(function (ic) {
                    var el = document.querySelector('[data-name="' + ic + '"]');
                    var code = el ? el.getAttribute('data-unicode') : '\\f101';
                    cssLines.push('.hi-' + ic + ':before { content: "' + code + '"; }');
                });

                subsetCssOutput.value = cssLines.join('\n');
            }
        }

        var copySubsetCliBtn = document.getElementById('copySubsetCliBtn');
        if (copySubsetCliBtn) {
            copySubsetCliBtn.addEventListener('click', function () {
                var cmdInput = document.getElementById('subsetCliCmd');
                if (cmdInput) window.copyHaticonsText(cmdInput.value, 'Copied CLI subset command!');
            });
        }

        var copySubsetCssBtn = document.getElementById('copySubsetCssBtn');
        if (copySubsetCssBtn) {
            copySubsetCssBtn.addEventListener('click', function () {
                var cssArea = document.getElementById('subsetCssOutput');
                if (cssArea) window.copyHaticonsText(cssArea.value, 'Copied standalone subset CSS!');
            });
        }

        var clearSubsetTrayBtn = document.getElementById('clearSubsetTrayBtn');
        if (clearSubsetTrayBtn) {
            clearSubsetTrayBtn.addEventListener('click', function () {
                selectedSubset.clear();
                saveSubsetToStorage();
                updateAllSubsetCounts();
                renderSubsetModal();
                updateCustomizerSubsetButton();
                window.showHaticonsToast('Subset tray cleared');
            });
        }

        // ---------------------------------------------------------
        // F. Reference Page Controller (Search, Styles, Sidebar Scrollspy)
        // ---------------------------------------------------------
        var refSearchInput = document.getElementById('referenceSearchInput');
        if (refSearchInput) {
            var refBlocks = document.querySelectorAll('.category-reference-block');
            var refCountEl = document.getElementById('refVisibleCount');
            var refNoResults = document.getElementById('refNoResults');
            var clearBtn = document.getElementById('clearRefSearch');

            function filterRefCatalog() {
                var query = refSearchInput.value.toLowerCase().trim();
                var totalVisible = 0;

                refBlocks.forEach(function (block) {
                    var blockItems = block.querySelectorAll('.reference-icon-item');
                    var blockVisible = 0;

                    blockItems.forEach(function (item) {
                        var searchData = (item.getAttribute('data-search') || item.getAttribute('data-name') || '').toLowerCase();
                        var cls = (item.getAttribute('data-class') || '').toLowerCase();
                        var unicode = (item.getAttribute('data-unicode') || '').toLowerCase();
                        var parentCol = item.closest('.col-12');

                        if (!query || searchData.indexOf(query) !== -1 || cls.indexOf(query) !== -1 || unicode.indexOf(query) !== -1) {
                            if (parentCol) parentCol.classList.remove('d-none');
                            blockVisible++;
                            totalVisible++;
                        } else {
                            if (parentCol) parentCol.classList.add('d-none');
                        }
                    });

                    var blockId = block.getAttribute('id');
                    var navLink = document.querySelector('#referenceCategoryNav a[href="#' + blockId + '"], .reference-category-nav a[href="#' + blockId + '"]');

                    if (blockVisible === 0 && query) {
                        block.classList.add('d-none');
                        if (navLink) navLink.classList.add('d-none');
                    } else {
                        block.classList.remove('d-none');
                        if (navLink) navLink.classList.remove('d-none');
                    }
                });

                if (refCountEl) refCountEl.textContent = totalVisible;
                if (refNoResults) {
                    if (totalVisible === 0) refNoResults.classList.remove('d-none');
                    else refNoResults.classList.add('d-none');
                }
            }

            var refSearchTimer = null;
            refSearchInput.addEventListener('input', function () {
                clearTimeout(refSearchTimer);
                refSearchTimer = setTimeout(filterRefCatalog, 100);
            });

            if (clearBtn) {
                clearBtn.addEventListener('click', function () {
                    refSearchInput.value = '';
                    filterRefCatalog();
                    refSearchInput.focus();
                });
            }
        }

        // Reference Page Style Buttons
        var refStyleButtons = document.querySelectorAll('.ref-style-btn');
        if (refStyleButtons.length > 0) {
            refStyleButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    refStyleButtons.forEach(function (b) {
                        b.classList.remove('active', 'btn-primary');
                        b.classList.add('btn-outline-secondary');
                    });
                    btn.classList.add('active', 'btn-primary');
                    btn.classList.remove('btn-outline-secondary');

                    var selectedStyle = btn.getAttribute('data-style');
                    var refIcons = document.querySelectorAll('.reference-icon-item i');

                    refIcons.forEach(function (icon) {
                        icon.classList.remove('hi-duotone', 'hi-spin', 'hi-pulse', 'hi-bounce', 'hi-shake');
                        if (selectedStyle && selectedStyle !== 'default') {
                            icon.classList.add('hi-' + selectedStyle);
                        }
                    });
                });
            });
        }

        // Reference Page Category Sidebar Scrollspy
        var refNavLinks = document.querySelectorAll('#referenceCategoryNav .nav-link, .reference-category-nav .nav-link');
        var refCatBlocks = document.querySelectorAll('.category-reference-block');
        if (refNavLinks.length > 0 && refCatBlocks.length > 0) {
            function setActiveRefCategory(targetId) {
                if (!targetId) return;
                var cleanId = targetId.replace(/^#/, '');

                refNavLinks.forEach(function (link) {
                    var href = link.getAttribute('href') || '';
                    var linkTarget = href.replace(/^#/, '');
                    var badge = link.querySelector('.badge');

                    if (linkTarget === cleanId) {
                        link.classList.add('active');
                        link.classList.remove('text-muted');
                        if (badge) {
                            badge.classList.remove('bg-light', 'text-muted');
                            badge.classList.add('bg-primary-soft', 'text-primary');
                        }
                    } else {
                        link.classList.remove('active');
                        link.classList.add('text-muted');
                        if (badge) {
                            badge.classList.add('bg-light', 'text-muted');
                            badge.classList.remove('bg-primary-soft', 'text-primary');
                        }
                    }
                });
            }

            refNavLinks.forEach(function (link) {
                link.addEventListener('click', function (e) {
                    var href = this.getAttribute('href');
                    if (!href || href.charAt(0) !== '#') return;
                    var targetId = href.substring(1);
                    var targetBlock = document.getElementById(targetId);
                    if (!targetBlock) return;

                    e.preventDefault();
                    setActiveRefCategory(targetId);
                    var headerOffset = 95;
                    var elementTop = targetBlock.getBoundingClientRect().top;
                    var targetScrollTop = elementTop + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: Math.max(0, targetScrollTop),
                        behavior: 'smooth'
                    });

                    if (window.history && window.history.pushState) {
                        window.history.pushState(null, null, href);
                    }
                });
            });

            function updateRefScrollspy() {
                var visibleBlocks = [];
                refCatBlocks.forEach(function (block) {
                    if (!block.classList.contains('d-none') && block.offsetParent !== null) {
                        visibleBlocks.push(block);
                    }
                });
                if (visibleBlocks.length === 0) return;

                var scrollPos = window.scrollY + 140;
                var isBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
                var activeId = '';

                if (isBottom) {
                    activeId = visibleBlocks[visibleBlocks.length - 1].getAttribute('id');
                } else if (scrollPos < visibleBlocks[0].offsetTop) {
                    activeId = visibleBlocks[0].getAttribute('id');
                } else {
                    for (var i = 0; i < visibleBlocks.length; i++) {
                        var block = visibleBlocks[i];
                        var top = block.offsetTop;
                        var height = block.offsetHeight;
                        if (scrollPos >= top && scrollPos < top + height) {
                            activeId = block.getAttribute('id');
                            break;
                        }
                    }
                }
                if (activeId) setActiveRefCategory(activeId);
            }

            window.addEventListener('scroll', updateRefScrollspy, { passive: true });
            if (window.location.hash && document.querySelector(window.location.hash)) {
                setActiveRefCategory(window.location.hash);
            } else {
                updateRefScrollspy();
            }
        }

        // ---------------------------------------------------------
        // G. Tutorial Page TOC Scrollspy
        // ---------------------------------------------------------
        var tocLinks = document.querySelectorAll('#tutorialToc .nav-link');
        var tutorialSections = document.querySelectorAll('.tutorial-section');
        if (tocLinks.length > 0 && tutorialSections.length > 0) {
            function updateTutorialScrollspy() {
                var scrollPos = window.scrollY + 140;
                var currentSectionId = '';

                tutorialSections.forEach(function (sec) {
                    var top = sec.offsetTop;
                    var height = sec.offsetHeight;
                    if (scrollPos >= top && scrollPos < top + height) {
                        currentSectionId = sec.getAttribute('id');
                    }
                });

                if (currentSectionId) {
                    tocLinks.forEach(function (link) {
                        if (link.getAttribute('href') === '#' + currentSectionId) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            }
            window.addEventListener('scroll', updateTutorialScrollspy, { passive: true });
            updateTutorialScrollspy();
        }
    });
})();
