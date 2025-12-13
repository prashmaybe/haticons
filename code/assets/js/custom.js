function searchHaticons() {
    var q = ($('[name="search-haticon"]').val() || '').toLowerCase();
    $('.haticons-box').each(function () {
        var t = ($(this).attr('tags') || '').toLowerCase();
        (t.indexOf(q) < 0) ? $(this).addClass('hidden') : $(this).removeClass('hidden');
    });
}

$(function () {
    var debounce = function (fn, wait) {
        var timeout;
        return function () {
            var ctx = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () { fn.apply(ctx, args); }, wait);
        };
    };
    var onSearch = debounce(searchHaticons, 150);
    $(document).on('input', '[name="search-haticon"]', onSearch);
    $('.cheatsheet').on('click', function () {
        $('.cheatsheet-modal').addClass('open');
    });
    $('.close').on('click', function () {
        $('.modal').removeClass('open');
    });
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') $('.modal').removeClass('open');
    });
    $('.haticons-box').on('click', function () {
        $(this).toggleClass('open').siblings().removeClass('open');
    });
    $('.haticons-box .haticons-data').on('click', function (e) {
        e.stopPropagation();
    });
})
