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
    // triggered after each item is loaded
    function onProgress( imgLoad, image ) {
      var $item = $( image.img ).parent();
      $item.removeClass('is-loading');
      if ( !image.isLoaded ) {
        $item.addClass('is-broken');
      }
    }
    // Get encoded Cached Feed Url
    function ajaxCall() {
      var data = $('[data-api-url]').data();
      return $.getJSON('/api?url='+data.apiUrl).then(displayElements);
    }
    // Display Elements from feed.
    function displayElements(data) {
        var containerGrid = $('#feed');
        var containerVideo = $('#videos');
        var thumbGrid = '<div class="thumbs">';
        var videoOverlay = '<div class="videoSlider">';
        var len = data.length,
            i = 0;
            for (i; i < len; i++) {
              item = data[i];
              var thUrl = item.thumbnail[0].url;
              var videoObj = item.content[0].url;
              thumbGrid += '<article><a tabindex="1" id="slide-'+i+'" class="fancybox" href="#popup">';
              thumbGrid += '<figure class="is-loading">';
              thumbGrid += '<img src="' + thUrl + '" alt="' + item.title + '" title="' + item.title + '"/>';
              if ( typeof(item.credit) !== 'undefined'){
                var lenCredit = item.credit.length, j = 0;
                for (j; j < lenCredit; j++) {
                  if (item.credit[j].role == 'client') {
                    thumbGrid += '<div><figcaption>';
                    thumbGrid += '<h4>' + item.credit[j].content + '</h4>';
                    thumbGrid += '</figcaption></div>';
                  }
                }
              } else {
                thumbGrid += '<div><figcaption>';
                thumbGrid += '<h4>'+ item.title +'</h4>';
                thumbGrid += '</figcaption></div>';
              }
              thumbGrid += '</figure></a></article>';
              videoOverlay += '<div>';
              videoOverlay += '<h4 class="rsCaption">' + item.title + '</h4>';
              videoOverlay += '<video id="video-'+i+'" class="video-js vjs-sublime-skin vjs-big-play-centered"';
              videoOverlay += 'poster="' +thUrl+'" src="' + videoObj + '"></video>';
              videoOverlay += '</div>';
            }
        containerGrid.html(thumbGrid+ "</div>");
        containerGrid.imagesLoaded().progress(onProgress);
        containerVideo.html(videoOverlay+ "</div>");
    }
    ajaxCall().then(function(returndata){
      $('.loader').fadeOut();
      $('.wrap').fadeIn();
      // Check if work landing page
      var landing = $.inArray( "recent", window.location.pathname.split( '/' ));
      if (landing == -1) {
        $('#slide-1').fancybox({
          type: 'inline',
          padding   : 0,
          margin    : 0,
          closeClick  : false,
          openEffect  : 'none',
          closeEffect : 'none',
          autoSize:false,
          height:360,
          width:'100%',
          beforeLoad : function(){
            $('.video-js').each(function(index) {
              var myPlayer = videojs("video-"+index, {
                  "controls": true,
                  "autoplay": false,
                  "preload": "metadata",
                  "height":360,
                  "width": 640
              });
            });
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
            videojs("video-0").ready(function(){
              var myPlayer = this;
                setTimeout(function(){
                    myPlayer.play();
                }, 100);
            });
            slider.ev.on('rsBeforeMove', function(event) {
              current = slider.currSlideId;
              videojs("video-"+current).ready(function(){
              var myPlayer = this;
                  myPlayer.pause();
              });
            });
            slider.ev.on('rsAfterSlideChange', function(event) {
              current = slider.currSlideId;
              videojs("video-"+current).ready(function(){
              var myPlayer = this;
                  myPlayer.play();
              });
            });
            $('#slider-next').click(function() {
              slider.next();
            });
            $('#slider-prev').click(function() {
              slider.prev();
            });
          },
        }).trigger('click');
      }
      $('.fancybox').each(function(index){
        $(this).fancybox({
          type: 'inline',
          padding   : 0,
          margin    : 0,
          closeClick  : false,
          openEffect  : 'none',
          closeEffect : 'none',
          autoSize:false,
          height:360,
          width:'100%',
          beforeLoad : function(){
            $('.video-js').each(function(index) {
              var player = videojs("video-"+index, {
                  "controls": true,
                  "autoplay": false,
                  "preload": "metadata",
                  "height":360,
                  "width": 640
                });
            });
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
            $('#slider-next').click(function() {
              next = slider.currSlideId;
              slider.goTo(next);
              console.log(next);
            });
            $('#slider-prev').click(function() {
              prev = slider.currSlideId;
              slider.goTo(prev);
              console.log(prev);
            });
            videojs("video-"+index).ready(function(){
              var myPlayer = this;
                  myPlayer.play();
            });
            slider.ev.on('rsBeforeMove', function(event) {
              current = slider.currSlideId;
              videojs("video-"+current).ready(function(){
              var myPlayer = this;
                  myPlayer.pause();
              });
            });
            slider.ev.on('rsAfterSlideChange', function(event) {
              current = slider.currSlideId;
              videojs("video-"+current).ready(function(){
              var myPlayer = this;
                  myPlayer.play();
              });
            });
          },
        });
      });
    });
  });
}(jQuery));