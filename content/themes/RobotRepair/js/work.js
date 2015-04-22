(function($) {
  $(document).ready(function() {
    $(window).scroll(function() {
      var scrolled = $(window).scrollTop();
      if ( scrolled >= 10 ){
            $('header').addClass('scrolled');
            $('#trigger-overlay').addClass('white');
        } else {
            $('header').removeClass('scrolled');
            $('#trigger-overlay').removeClass('white');
        }
    });
    var data = $('[data-api-url]').data();
    $.getJSON('/api?url='+data.apiUrl, displayElements);
    function displayElements(data) {
      var thumbGrid = '<div class="thumbs">';
      var videoOverlay = '<div class="videoSlider">';
      $.each(data, function( i, item ) {
        thumbGrid += '<article><a tabindex="1" id="slide-'+i+'" class="fancybox" href="#popup">';
        thumbGrid += '<figure>';
        $.each(item.thumbnail, function(k, thumb){
          if (k === 0) {
            var thUrl = thumb.url;
            thumbGrid += '<img src="' + thUrl + '" alt="' + item.title + '" title="' + item.title + '"/>';
          }
        });
        $.each(item.credit, function(k, title){
          if( title.role == 'client'){
            var titleHover = title.content;
            thumbGrid += '<div><figcaption>';
            thumbGrid += '<h4>' + titleHover + '</h4>';
            thumbGrid += '</figcaption></div>';
          }
        });
        thumbGrid += '</figure></a></article>';
        videoOverlay += '<div>';
        videoOverlay += '<h4 class="rsCaption">' + item.title + '</h4>';
        var videoObj = item.content[0].url;
        videoOverlay += '<video id="video-'+i+'" class="video-js vjs-sublime-skin vjs-big-play-centered" src="' + videoObj + '"></video>';
        videoOverlay += '</div>';
      });
      $('section#feed').html(thumbGrid+ "</div>");
      $('#popup').html(videoOverlay+ "</div>");
      $('.video-js').each(function(index) {
        var myPlayer = videojs("video-"+index, {
          "controls": true,
          "autoplay": false,
          "preload": "auto",
          "height":360,
          "width": 640
        });
      });
    }
    $("#feed").on("focusin", function(){
      $('.fancybox').each(function(index){
        $(this).fancybox({
          type: 'inline',
          padding   : 0,
          margin    : 0,
          closeClick  : false,
          openEffect  : 'none',
          closeEffect : 'none',
          autoSize:false,
          height:410,
          width:'100%',
          tpl: {
            closeBtn :'<a title="Back to Thumbnails View" class="fancybox-item fancybox-close-logo" href="javascript:;"></a>'
          },
          afterShow : function() {
            var slider = $('.videoSlider').royalSlider({
              addActiveClass: true,
              controlNavigation : 'none',
              arrowsNav : false,
              loop: true,
              fadeinLoadedSlide:false,
              globalCaption: true,
              globalCaptionInside: false,
              keyboardNavEnabled: true,
              visibleNearby: {
                enabled: true,
                centerArea: 0.6,
                center: true,
                breakpoint: 640,
                breakpointCenterArea: 1,
                navigateByClick:true,
                navigateByCenterClick: false,
              },
            }).data('royalSlider');
            slider.goTo(index);
            $('video').bind('play', function() {
                activated = this;
                $('video').each(function() {
                    if(this != activated) this.pause();
                });
            });
            $(".video-js").click(function(){
                activated = this;
                $('.video-js').each(function() {
                    if(this != activated) _V_($(this).attr("id")).pause();
                });
            });
          },
        });
      });
    });
  });
}(jQuery));