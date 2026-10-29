/**
 * Haticons Global Interactivity Controller
 * Unified clipboard handling, global toast notifications, code block copy,
 * cheatsheet search & category filtering, modal inspector, and table-of-contents scrollspy.
 */

(function () {
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
        toast.innerHTML = '<i class="hi-check-circle me-1"></i> ' + (message || 'Copied to clipboard!');
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
    // 3. Document-Level Event Delegations
    // -------------------------------------------------------------
    document.addEventListener('DOMContentLoaded', function () {
        // A. Copy Buttons (.copy-btn) with data-copy
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('.copy-btn');
            if (btn) {
                e.preventDefault();
                var text = btn.getAttribute('data-copy');
                window.copyHaticonsText(text, 'Copied to clipboard!');
                return;
            }

            // B. Code Snippet Copy Buttons (.code-copy-btn)
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
                    var origHtml = codeCopyBtn.innerHTML;
                    codeCopyBtn.classList.add('copied');
                    codeCopyBtn.innerHTML = '<i class="hi-check"></i> <span>Copied!</span>';
                    setTimeout(function () {
                        codeCopyBtn.classList.remove('copied');
                        codeCopyBtn.innerHTML = origHtml;
                    }, 2000);
                });
                return;
            }

            // B2. CodePen Launch Buttons (.code-codepen-btn / .modal-codepen-btn)
            var codepenBtn = e.target.closest('.code-codepen-btn, .modal-codepen-btn');
            if (codepenBtn) {
                e.preventDefault();
                var title = codepenBtn.getAttribute('data-title') || 'Haticons Example';
                var htmlCode = codepenBtn.getAttribute('data-html');
                var cssCode = codepenBtn.getAttribute('data-css') || '';
                var jsCode = codepenBtn.getAttribute('data-js') || '';
                var cssExt = codepenBtn.getAttribute('data-css-external') || 'https://cdn.jsdelivr.net/npm/haticons@1.0.1/dist/css/haticons.min.css;https://cdn.jsdelivr.net/npm/boodoo@1.2.2/dist/css/boodoo.min.css';

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
                setTimeout(function () {
                    form.remove();
                }, 1000);
                return;
            }

            // C. Reference Page Icon Item Click
            var refItem = e.target.closest('.reference-icon-item');
            if (refItem) {
                var cls = refItem.getAttribute('data-class');
                var name = refItem.getAttribute('data-name');
                var unicode = refItem.getAttribute('data-unicode');
                var pathD = refItem.getAttribute('data-path') || '';

                if (window.openHaticonsCustomizer) {
                    window.openHaticonsCustomizer({ cls: cls, name: name, unicode: unicode, path: pathD });
                } else {
                    var snippet = '<i class="' + cls + '"></i>';
                    window.copyHaticonsText(snippet, 'Copied: &lt;i class="' + cls + '"&gt;&lt;/i&gt;');
                }
                return;
            }

            // D. Modal Copy Buttons (.copy-modal-btn)
            var modalCopyBtn = e.target.closest('.copy-modal-btn');
            if (modalCopyBtn) {
                var targetId = modalCopyBtn.getAttribute('data-target');
                var targetInput = document.querySelector(targetId);
                var val = targetInput ? targetInput.value : '';
                window.copyHaticonsText(val, 'Copied snippet!');
                return;
            }

            // E. Setup Hub Tab Switching (.start-method-tab)
            var tabBtn = e.target.closest('.start-method-tab');
            if (tabBtn) {
                e.preventDefault();
                var targetSelector = tabBtn.getAttribute('data-target');
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
                var activePane = document.querySelector(targetSelector);
                if (activePane) activePane.classList.remove('d-none');
                return;
            }

            // F. Modal Close Dismiss Fallbacks
            if (e.target.closest('[data-bs-dismiss="modal"], [data-boodoo-dismiss="modal"], #customBackdrop')) {
                closeDetailModal();
            }
        });

        // ESC key closes modal fallback
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeDetailModal();
            }
        });

        function closeDetailModal() {
            var modal = document.getElementById('iconDetailModal');
            if (modal) {
                modal.classList.remove('show');
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
                var backdrop = document.getElementById('customBackdrop');
                if (backdrop) backdrop.remove();
            }
        }

        // ---------------------------------------------------------
        // 4. Homepage Cheatsheet Controller (Search, Category & Style filter)
        // ---------------------------------------------------------
        var iconCards = document.querySelectorAll('.haticon-card');
        if (iconCards.length > 0) {
            var activeCategory = 'all';
            var activeStyle = 'all';
            var searchQuery = '';
            var visibleCountEl = document.getElementById('visibleCount');
            var noResultsEl = document.getElementById('noResults');
            var searchInput = document.getElementById('iconSearchInput') || document.querySelector('[name="search-haticon"]');

            function updateCardGlyphs() {
                iconCards.forEach(function (card) {
                    var baseCls = card.getAttribute('data-class') || '';
                    var iconEl = card.querySelector('.haticon-display-icon') || card.querySelector('i');
                    if (!iconEl) return;

                    // Reset to base display
                    if (activeStyle === 'all') {
                        iconEl.className = baseCls + ' haticon-display-icon';
                    } else if (activeStyle === 'fill') {
                        iconEl.className = baseCls + '-fill haticon-display-icon hi-fill';
                    } else if (activeStyle === 'outline') {
                        iconEl.className = baseCls + '-outline haticon-display-icon hi-outline';
                    } else if (activeStyle === 'sharp') {
                        iconEl.className = baseCls + '-sharp haticon-display-icon hi-sharp';
                    }
                });
            }

            function applyFilter() {
                var visibleCount = 0;
                var q = searchQuery.toLowerCase().trim();

                iconCards.forEach(function (card) {
                    var cardCat = card.getAttribute('data-category') || '';
                    var cardName = card.getAttribute('data-name') || '';
                    var cardClass = card.getAttribute('data-class') || '';
                    var tags = card.getAttribute('tags') || '';

                    var matchesCategory = (activeCategory === 'all' || cardCat === activeCategory);
                    var matchesSearch = (!q || cardName.indexOf(q) >= 0 || cardClass.indexOf(q) >= 0 || tags.indexOf(q) >= 0);

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

            // Style Variant Buttons
            var styleButtons = document.querySelectorAll('.style-filter-btn');
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

            // Search input with debounce
            if (searchInput) {
                var searchTimer = null;
                searchInput.addEventListener('input', function () {
                    var val = this.value;
                    clearTimeout(searchTimer);
                    searchTimer = setTimeout(function () {
                        searchQuery = val;
                        applyFilter();
                    }, 120);
                });
            }

            // Category filter buttons
            var categoryButtons = document.querySelectorAll('.category-filter-btn');
            categoryButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    activeCategory = this.getAttribute('data-category') || 'all';
                    categoryButtons.forEach(function (b) {
                        b.classList.remove('active', 'btn-primary');
                        b.classList.add('btn-outline-secondary', 'bg-white');
                    });
                    this.classList.add('active', 'btn-primary');
                    this.classList.remove('btn-outline-secondary', 'bg-white');
                    applyFilter();
                });
            });

            // Reset Search Button
            var resetBtn = document.getElementById('resetSearchBtn');
            if (resetBtn) {
                resetBtn.addEventListener('click', function () {
                    searchQuery = '';
                    activeCategory = 'all';
                    activeStyle = 'all';
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
                    var allStyleBtn = document.querySelector('.style-filter-btn[data-style="all"]');
                    if (allStyleBtn) {
                        allStyleBtn.classList.add('active', 'btn-primary');
                        allStyleBtn.classList.remove('btn-outline-secondary');
                    }
                    updateCardGlyphs();
                    applyFilter();
                });
            }

            // Icon card click -> Open icon detail modal
            document.addEventListener('click', function (e) {
                var card = e.target.closest('.haticon-card');
                if (!card) return;

                var cls = card.getAttribute('data-class');
                var name = card.getAttribute('data-name');
                var cat = card.getAttribute('data-category');
                var unicode = card.getAttribute('data-unicode');

                var glyphEl = document.getElementById('modalGlyph');
                var titleEl = document.getElementById('modalIconTitle');
                var badgeEl = document.getElementById('modalCategoryBadge');
                var htmlCodeEl = document.getElementById('modalHtmlCode');
                var htmlFillEl = document.getElementById('modalHtmlFill');
                var htmlOutlineEl = document.getElementById('modalHtmlOutline');
                var htmlSharpEl = document.getElementById('modalHtmlSharp');
                var cssCodeEl = document.getElementById('modalCssCode');
                var catLinkEl = document.getElementById('modalCategoryLink');

                if (glyphEl) {
                    if (activeStyle === 'outline') {
                        glyphEl.className = cls + '-outline fs-1 hi-outline';
                    } else if (activeStyle === 'sharp') {
                        glyphEl.className = cls + '-sharp fs-1 hi-sharp';
                    } else if (activeStyle === 'fill') {
                        glyphEl.className = cls + '-fill fs-1 hi-fill';
                    } else {
                        glyphEl.className = cls + ' fs-1';
                    }
                }
                if (titleEl) titleEl.textContent = cls;
                if (badgeEl) badgeEl.textContent = cat;
                if (htmlCodeEl) htmlCodeEl.value = '<i class="' + cls + '"></i>';
                if (htmlFillEl) htmlFillEl.value = '<i class="' + cls + '-fill"></i>';
                if (htmlOutlineEl) htmlOutlineEl.value = '<i class="' + cls + '-outline"></i>';
                if (htmlSharpEl) htmlSharpEl.value = '<i class="' + cls + '-sharp"></i>';
                if (cssCodeEl) cssCodeEl.value = 'content: "' + unicode + '";';
                if (catLinkEl) catLinkEl.textContent = 'dist/css/categories/' + cat + '.min.css';

                var cpBtn = document.getElementById('modalCodePenBtn');
                if (cpBtn) {
                    cpBtn.setAttribute('data-title', 'Haticons - ' + cls);
                    cpBtn.setAttribute('data-html', '<div class="p-5 text-center">\n  <i class="' + cls + ' fs-1 text-primary"></i>\n  <i class="' + cls + '-outline fs-1 text-primary ms-3"></i>\n  <i class="' + cls + '-sharp fs-1 text-primary ms-3"></i>\n  <h2 class="mt-3 font-monospace h4">' + cls + '</h2>\n  <p class="text-muted">Unicode codepoint: <code>' + unicode + '</code></p>\n</div>');
                }

                var modalEl = document.getElementById('iconDetailModal');
                if (!modalEl) return;

                if (window.boodoo && window.boodoo.Modal) {
                    var bModal = window.boodoo.Modal.getOrCreateInstance ? window.boodoo.Modal.getOrCreateInstance(modalEl) : new window.boodoo.Modal(modalEl);
                    bModal.show();
                } else if (window.bootstrap && window.bootstrap.Modal) {
                    var bsModal = new window.bootstrap.Modal(modalEl);
                    bsModal.show();
                } else {
                    modalEl.classList.add('show');
                    modalEl.style.display = 'block';
                    document.body.classList.add('modal-open');
                    var bd = document.createElement('div');
                    bd.className = 'modal-backdrop fade show';
                    bd.id = 'customBackdrop';
                    document.body.appendChild(bd);
                }
            });
        }

        // ---------------------------------------------------------
        // 5. Scrollspy for Tutorial Table of Contents
        // ---------------------------------------------------------
        var tocLinks = document.querySelectorAll('#tutorialToc .nav-link');
        var sections = document.querySelectorAll('.tutorial-section');
        if (tocLinks.length > 0 && sections.length > 0) {
            function updateScrollspy() {
                var scrollPos = window.scrollY + 140;
                var currentSectionId = '';

                sections.forEach(function (sec) {
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

            window.addEventListener('scroll', updateScrollspy, { passive: true });
            updateScrollspy();
        }

        // ---------------------------------------------------------
        // 6. Live Search on Reference Page
        // ---------------------------------------------------------
        var refSearchInput = document.getElementById('referenceSearchInput');
        if (refSearchInput) {
            var refItems = document.querySelectorAll('.reference-icon-item');
            var refBlocks = document.querySelectorAll('.category-reference-block');
            var refCountEl = document.getElementById('refVisibleCount');
            var refNoResults = document.getElementById('refNoResults');
            var clearBtn = document.getElementById('clearRefSearch');

            function filterRefItems() {
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

                    // Hide the category header block if no icons match in that category
                    if (blockVisible === 0 && query) {
                        block.classList.add('d-none');
                    } else {
                        block.classList.remove('d-none');
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
                refSearchTimer = setTimeout(filterRefItems, 100);
            });

            if (clearBtn) {
                clearBtn.addEventListener('click', function () {
                    refSearchInput.value = '';
                    filterRefItems();
                    refSearchInput.focus();
                });
            }
        }

        // ---------------------------------------------------------
        // 7. Interactive Style Preview Filter (Normal, Duotone, Spin, Pulse, Bounce, Shake)
        // ---------------------------------------------------------
        var stylePreviewButtons = document.querySelectorAll('.ref-style-btn');
        if (stylePreviewButtons.length > 0) {
            stylePreviewButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    stylePreviewButtons.forEach(function (b) {
                        b.classList.remove('active', 'btn-primary');
                        b.classList.add('btn-outline-secondary');
                    });
                    btn.classList.add('active', 'btn-primary');
                    btn.classList.remove('btn-outline-secondary');

                    var selectedStyle = btn.getAttribute('data-style');
                    var refIcons = document.querySelectorAll('.reference-icon-item i');

                    refIcons.forEach(function (icon) {
                        // Remove all dynamic modifier classes
                        icon.classList.remove('hi-duotone', 'hi-spin', 'hi-pulse', 'hi-bounce', 'hi-shake');
                        if (selectedStyle && selectedStyle !== 'default') {
                            icon.classList.add('hi-' + selectedStyle);
                        }
                    });
                });
            });
        }

        // ---------------------------------------------------------
        // 8. In-Browser SVG Customizer & Subset Tray Manager
        // ---------------------------------------------------------
        var selectedSubset = new Set();
        var currentCustomizerData = null;

        function updateSubsetUI() {
            var count = selectedSubset.size;
            var statusEl = document.getElementById('subsetStatusText');
            var exportBtn = document.getElementById('openSubsetModalBtn');
            var toggleBtn = document.getElementById('custToggleSubsetBtn');
            var toggleText = document.getElementById('custSubsetText');

            if (statusEl) {
                statusEl.innerHTML = 'Subset Tray: <strong>' + count + '</strong> icons';
            }
            if (exportBtn) {
                exportBtn.disabled = count === 0;
            }
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
                // Fallback copy if modal is not present
                var snippet = '<i class="' + data.cls + '"></i>';
                window.copyHaticonsText(snippet, 'Copied: &lt;i class="' + data.cls + '"&gt;&lt;/i&gt;');
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
                modalTitle.innerHTML = '<i class="hi-paintbox text-primary"></i> <span>Customizer: ' + data.cls + '</span>';
            }
            if (badgeName) {
                badgeName.textContent = data.cls + ' (' + data.unicode + ')';
            }
            if (svgPath) {
                svgPath.setAttribute('d', data.path || '');
            }

            // Sync controls
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

            updateSubsetUI();

            // Open Modal
            if (window.boodoo && window.boodoo.Modal) {
                var bModal = window.boodoo.Modal.getOrCreateInstance ? window.boodoo.Modal.getOrCreateInstance(modalEl) : new window.boodoo.Modal(modalEl);
                bModal.show();
            } else if (window.bootstrap && window.bootstrap.Modal) {
                var bsModal = new window.bootstrap.Modal(modalEl);
                bsModal.show();
            } else {
                modalEl.classList.add('show');
                modalEl.style.display = 'block';
                document.body.classList.add('modal-open');
                var bd = document.createElement('div');
                bd.className = 'modal-backdrop fade show';
                bd.id = 'customBackdrop';
                document.body.appendChild(bd);
            }
        };

        // Live Controls Event Listeners
        var sizeRange = document.getElementById('custSizeRange');
        var sizeVal = document.getElementById('custSizeVal');
        var svgPreview = document.getElementById('custSvgPreview');
        var colorPicker = document.getElementById('custColorPicker');

        if (sizeRange && svgPreview) {
            sizeRange.addEventListener('input', function () {
                var sz = sizeRange.value;
                svgPreview.setAttribute('width', sz);
                svgPreview.setAttribute('height', sz);
                if (sizeVal) sizeVal.textContent = sz + 'px';
            });
        }

        if (colorPicker && svgPreview) {
            colorPicker.addEventListener('input', function () {
                svgPreview.setAttribute('fill', colorPicker.value);
            });
        }

        document.querySelectorAll('.quick-color').forEach(function (qbtn) {
            qbtn.addEventListener('click', function () {
                var col = qbtn.getAttribute('data-color');
                if (colorPicker) colorPicker.value = col;
                if (svgPreview) svgPreview.setAttribute('fill', col);
            });
        });

        // Copy JSX button
        var copyJsxBtn = document.getElementById('custCopyJsxBtn');
        if (copyJsxBtn) {
            copyJsxBtn.addEventListener('click', function () {
                if (!currentCustomizerData) return;
                var color = colorPicker ? colorPicker.value : '#7c3aed';
                var size = sizeRange ? sizeRange.value : '24';
                var path = currentCustomizerData.path || '';
                var jsx = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="' + size + '" height="' + size + '" fill="' + color + '">\n' +
                    '  <g transform="scale(1, -1) translate(0, -960)">\n' +
                    '    <path d="' + path + '" />\n' +
                    '  </g>\n' +
                    '</svg>';
                window.copyHaticonsText(jsx, 'Copied ' + currentCustomizerData.cls + ' JSX component code!');
            });
        }

        // Copy SVG button
        var copySvgBtn = document.getElementById('custCopySvgBtn');
        if (copySvgBtn) {
            copySvgBtn.addEventListener('click', function () {
                if (!currentCustomizerData) return;
                var color = colorPicker ? colorPicker.value : '#7c3aed';
                var size = sizeRange ? sizeRange.value : '24';
                var path = currentCustomizerData.path || '';
                var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="' + size + '" height="' + size + '" fill="' + color + '">\n' +
                    '  <g transform="scale(1, -1) translate(0, -960)">\n' +
                    '    <path d="' + path + '" />\n' +
                    '  </g>\n' +
                    '</svg>';
                window.copyHaticonsText(svg, 'Copied ' + currentCustomizerData.cls + ' SVG code!');
            });
        }

        // Download SVG button
        var downloadSvgBtn = document.getElementById('custDownloadSvgBtn');
        if (downloadSvgBtn) {
            downloadSvgBtn.addEventListener('click', function () {
                if (!currentCustomizerData) return;
                var color = colorPicker ? colorPicker.value : '#7c3aed';
                var size = sizeRange ? sizeRange.value : '1024';
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

        // Toggle Subset button in customizer
        var toggleSubsetBtn = document.getElementById('custToggleSubsetBtn');
        if (toggleSubsetBtn) {
            toggleSubsetBtn.addEventListener('click', function () {
                if (!currentCustomizerData) return;
                var name = currentCustomizerData.name;
                if (selectedSubset.has(name)) {
                    selectedSubset.delete(name);
                } else {
                    selectedSubset.add(name);
                }
                updateSubsetUI();
            });
        }

        // Export Subset Modal Triggers & Handlers
        var openSubsetModalBtn = document.getElementById('openSubsetModalBtn');
        var subsetExportModal = document.getElementById('subsetExportModal');
        var subsetSelectedTags = document.getElementById('subsetSelectedTags');
        var subsetModalCount = document.getElementById('subsetModalCount');
        var subsetCliCmd = document.getElementById('subsetCliCmd');
        var subsetCssOutput = document.getElementById('subsetCssOutput');
        var clearSubsetTrayBtn = document.getElementById('clearSubsetTrayBtn');
        var copySubsetCliBtn = document.getElementById('copySubsetCliBtn');
        var copySubsetCssBtn = document.getElementById('copySubsetCssBtn');

        if (openSubsetModalBtn && subsetExportModal) {
            openSubsetModalBtn.addEventListener('click', function () {
                var iconList = Array.from(selectedSubset);
                if (subsetModalCount) subsetModalCount.textContent = iconList.length;

                // Render tags
                if (subsetSelectedTags) {
                    subsetSelectedTags.innerHTML = iconList.map(function (ic) {
                        return '<span class="badge bg-white text-dark border rounded-pill px-2 py-1"><i class="hi-' + ic + ' me-1 text-primary"></i>' + ic + '</span>';
                    }).join(' ');
                }

                // CLI command
                var cliCmd = 'npx haticons subset --icons=' + iconList.join(',');
                if (subsetCliCmd) subsetCliCmd.value = cliCmd;

                // Generate standalone subset CSS
                var cssLines = [
                    '/* Haticons Custom Subset (' + iconList.length + ' icons) */',
                    '@font-face {',
                    '  font-family: "haticons";',
                    '  src: url("https://cdn.jsdelivr.net/npm/haticons@1.0.1/dist/fonts/haticons.woff2") format("woff2");',
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
                    var el = document.querySelector('.reference-icon-item[data-name="' + ic + '"]');
                    var code = el ? el.getAttribute('data-unicode') : '\\f101';
                    cssLines.push('.hi-' + ic + ':before { content: "' + code + '"; }');
                });

                if (subsetCssOutput) subsetCssOutput.value = cssLines.join('\n');

                if (window.boodoo && window.boodoo.Modal) {
                    var bModal = window.boodoo.Modal.getOrCreateInstance ? window.boodoo.Modal.getOrCreateInstance(subsetExportModal) : new window.boodoo.Modal(subsetExportModal);
                    bModal.show();
                } else if (window.bootstrap && window.bootstrap.Modal) {
                    var bsModal = new window.bootstrap.Modal(subsetExportModal);
                    bsModal.show();
                } else {
                    subsetExportModal.classList.add('show');
                    subsetExportModal.style.display = 'block';
                    document.body.classList.add('modal-open');
                }
            });
        }

        if (copySubsetCliBtn && subsetCliCmd) {
            copySubsetCliBtn.addEventListener('click', function () {
                window.copyHaticonsText(subsetCliCmd.value, 'Copied CLI subset command!');
            });
        }

        if (copySubsetCssBtn && subsetCssOutput) {
            copySubsetCssBtn.addEventListener('click', function () {
                window.copyHaticonsText(subsetCssOutput.value, 'Copied standalone subset CSS!');
            });
        }

        if (clearSubsetTrayBtn) {
            clearSubsetTrayBtn.addEventListener('click', function () {
                selectedSubset.clear();
                updateSubsetUI();
                if (subsetExportModal) {
                    if (window.boodoo && window.boodoo.Modal) {
                        var bModal = window.boodoo.Modal.getInstance(subsetExportModal);
                        if (bModal) bModal.hide();
                    } else if (window.bootstrap && window.bootstrap.Modal) {
                        var bsModal = window.bootstrap.Modal.getInstance(subsetExportModal);
                        if (bsModal) bsModal.hide();
                    } else {
                        subsetExportModal.classList.remove('show');
                        subsetExportModal.style.display = 'none';
                        document.body.classList.remove('modal-open');
                    }
                }
            });
        }
    });
})();
