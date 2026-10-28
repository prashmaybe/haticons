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
                    document.getElementById('copyToast') ||
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

            // C. Reference Page Icon Item Click
            var refItem = e.target.closest('.reference-icon-item');
            if (refItem) {
                var cls = refItem.getAttribute('data-class');
                var snippet = '<i class="' + cls + '"></i>';
                window.copyHaticonsText(snippet, 'Copied: &lt;i class="' + cls + '"&gt;&lt;/i&gt;');
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

            // E. Modal Close Dismiss Fallbacks
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
        // 4. Homepage Cheatsheet Controller (Search & Category filter)
        // ---------------------------------------------------------
        var iconCards = document.querySelectorAll('.haticon-card');
        if (iconCards.length > 0) {
            var activeCategory = 'all';
            var searchQuery = '';
            var visibleCountEl = document.getElementById('visibleCount');
            var noResultsEl = document.getElementById('noResults');
            var searchInput = document.getElementById('iconSearchInput') || document.querySelector('[name="search-haticon"]');

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
                var cssCodeEl = document.getElementById('modalCssCode');
                var catLinkEl = document.getElementById('modalCategoryLink');

                if (glyphEl) glyphEl.className = cls + ' fs-1';
                if (titleEl) titleEl.textContent = cls;
                if (badgeEl) badgeEl.textContent = cat;
                if (htmlCodeEl) htmlCodeEl.value = '<i class="' + cls + '"></i>';
                if (cssCodeEl) cssCodeEl.value = 'content: "' + unicode + '";';
                if (catLinkEl) catLinkEl.textContent = 'dist/css/categories/' + cat + '.min.css';

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
    });
})();
