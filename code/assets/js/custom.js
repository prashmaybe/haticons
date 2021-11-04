function searchHaticons() {
    $('.haticons-box').each(function(){
        ($(this).attr('tags').search($('[name="search-haticon"]').val().toLowerCase())<0)?$(this).addClass('hidden'):$(this).removeClass('hidden');
    });
}

$(function() {
    $('.cheatsheet').click(function(e) {
        $('.cheatsheet-modal').addClass('open')
    })
    $('.cdn').click(function(e) {
        $('.cdn-modal').addClass('open')
    })
    $('.close').click(function(e) {
        $('.modal').removeClass('open')
    })
    $('.haticons-box').click(function(e){
    	$(this).toggleClass('open').siblings().removeClass('open');
    })
    $('.haticons-box .haticons-data').click(function(e){
    	e.stopPropagation();
    })
})