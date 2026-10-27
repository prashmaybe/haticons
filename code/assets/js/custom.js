/**
 * Haticons Interactivity & Cheatsheet Controller
 * Supports real-time debounced search, category filtering, boodoo modal display, and clipboard copy.
 */

$(function () {
    var activeCategory = 'all';
    var searchQuery = '';
    var toastTimeout = null;

    function showToast(message) {
        var $toast = $('#copyToast');
        $toast.html('<i class="hi-check-circle me-1"></i> ' + (message || 'Copied to clipboard!'));
        $toast.removeClass('d-none');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(function () {
            $toast.addClass('d-none');
        }, 2200);
    }

    function copyToClipboard(text, message) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function () {
                showToast(message);
            }).catch(function () {
                fallbackCopy(text, message);
            });
        } else {
            fallbackCopy(text, message);
        }
    }

    function fallbackCopy(text, message) {
        var $temp = $('<textarea>');
        $('body').append($temp);
        $temp.val(text).select();
        try {
            document.execCommand('copy');
            showToast(message);
        } catch (e) {
            console.error('Copy failed', e);
        }
        $temp.remove();
    }

    // Filter icons by category and search text
    function applyFilter() {
        var visibleCount = 0;
        var q = searchQuery.toLowerCase().trim();

        $('.haticon-card').each(function () {
            var $card = $(this);
            var cardCat = $card.attr('data-category') || '';
            var cardName = $card.attr('data-name') || '';
            var cardClass = $card.attr('data-class') || '';
            var tags = $card.attr('tags') || '';

            var matchesCategory = (activeCategory === 'all' || cardCat === activeCategory);
            var matchesSearch = (!q || cardName.indexOf(q) >= 0 || cardClass.indexOf(q) >= 0 || tags.indexOf(q) >= 0);

            if (matchesCategory && matchesSearch) {
                $card.removeClass('d-none');
                visibleCount++;
            } else {
                $card.addClass('d-none');
            }
        });

        $('#visibleCount').text(visibleCount);
        if (visibleCount === 0) {
            $('#noResults').removeClass('d-none');
        } else {
            $('#noResults').addClass('d-none');
        }
    }

    // Debounced search
    var searchTimer = null;
    $('#iconSearchInput, [name="search-haticon"]').on('input', function () {
        var val = $(this).val();
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () {
            searchQuery = val;
            applyFilter();
        }, 120);
    });

    // Category button click
    $('.category-filter-btn').on('click', function () {
        var cat = $(this).attr('data-category');
        activeCategory = cat;
        $('.category-filter-btn').removeClass('active btn-primary').addClass('btn-outline-secondary bg-white');
        $(this).addClass('active btn-primary').removeClass('btn-outline-secondary bg-white');
        applyFilter();
    });

    // Reset filters button
    $('#resetSearchBtn').on('click', function () {
        searchQuery = '';
        activeCategory = 'all';
        $('#iconSearchInput').val('');
        $('.category-filter-btn').removeClass('active btn-primary').addClass('btn-outline-secondary bg-white');
        $('.category-filter-btn[data-category="all"]').addClass('active btn-primary').removeClass('btn-outline-secondary bg-white');
        applyFilter();
    });

    // Copy buttons in hero (npm command / cdn url)
    $('.copy-btn').on('click', function (e) {
        e.preventDefault();
        var text = $(this).attr('data-copy');
        copyToClipboard(text, 'Copied to clipboard!');
    });

    // Icon card click -> Open boodoo detail modal
    $(document).on('click', '.haticon-card', function () {
        var cls = $(this).attr('data-class');
        var name = $(this).attr('data-name');
        var cat = $(this).attr('data-category');
        var unicode = $(this).attr('data-unicode');

        $('#modalGlyph').attr('class', cls + ' fs-1');
        $('#modalIconTitle').text(cls);
        $('#modalCategoryBadge').text(cat);
        $('#modalHtmlCode').val('<i class="' + cls + '"></i>');
        $('#modalCssCode').val('content: "' + unicode + '";');
        $('#modalCategoryLink').text('dist/css/categories/' + cat + '.min.css');

        // Trigger boodoo modal or fallback
        var modalEl = document.getElementById('iconDetailModal');
        if (window.boodoo && window.boodoo.Modal) {
            var boodooModal = boodoo.Modal.getOrCreateInstance ? boodoo.Modal.getOrCreateInstance(modalEl) : new boodoo.Modal(modalEl);
            boodooModal.show();
        } else if (window.bootstrap && window.bootstrap.Modal) {
            var bsModal = new bootstrap.Modal(modalEl);
            bsModal.show();
        } else {
            // Native fallback
            $('#iconDetailModal').addClass('show').css('display', 'block');
            $('body').addClass('modal-open').append('<div class="modal-backdrop fade show" id="customBackdrop"></div>');
        }
    });

    // Copy button inside modal
    $('.copy-modal-btn').on('click', function () {
        var targetInput = $(this).attr('data-target');
        var val = $(targetInput).val();
        copyToClipboard(val, 'Copied snippet!');
    });

    // Modal close fallback
    $(document).on('click', '[data-bs-dismiss="modal"], [data-boodoo-dismiss="modal"], #customBackdrop', function () {
        $('#iconDetailModal').removeClass('show').css('display', 'none');
        $('body').removeClass('modal-open');
        $('#customBackdrop').remove();
    });

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            $('#iconDetailModal').removeClass('show').css('display', 'none');
            $('body').removeClass('modal-open');
            $('#customBackdrop').remove();
        }
    });
});
