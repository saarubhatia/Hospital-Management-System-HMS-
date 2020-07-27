$(document).ready(function(){
    $('.def').css('z-index','0');
    $(".def").hover(function(){
        $(this).css({"height": "320px","width": "35%","z-index":"2"});
    }, 
    function () {
        $(this).css({"height": "310px","width": "33.33%","z-index":"0"});
    });
});