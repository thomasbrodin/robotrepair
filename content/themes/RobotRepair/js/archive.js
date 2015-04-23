function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

function initialize(callback) {
  var container = document.getElementById("feed");
  var FeedUrl = container.getAttribute("data-feed");
  var feed = new google.feeds.Feed(FeedUrl);
  feed.setNumEntries(30);
  feed.load(function(result) {
    if (!result.error) {
      var videoSlider = document.getElementById("videos");
      for (var i = 0; i < result.feed.entries.length; i++) {
        var entry = result.feed.entries[i];
        var article = document.createElement("article");
        var link = document.createElement("a");
        setAttributes(link , {
            "id" : "slide-"+i,
            "class" : "fancybox",
             "href": "#popup",
        });
        var figure = document.createElement("figure");
        var video = document.createElement('video');
        if (entry.mediaGroups) {
            var imgSrc = entry.mediaGroups[0].contents[0].thumbnails[0].url;
            var img = document.createElement('img');
            img.setAttribute(  "src", imgSrc);
            figure.appendChild(img);
            var mediaSrc = entry.mediaGroups[0].contents[0].url;
            setAttributes(video , {
                "class" : "video-js vjs-sublime-skin vjs-big-play-centered",
                "id" : "video-"+i,
                "width": "640",
                "height" : "360",
                "src" : mediaSrc,
            });
        }
        var fragment = document.createDocumentFragment();
        var contents = fragment.appendChild(document.createElement("div"));
            contents = contents.appendChild(document.createElement("figcaption"));
            contents = contents.appendChild(document.createElement("h4"));
            contents = contents.appendChild(document.createTextNode(entry.title));
        article.appendChild(link);
        link.appendChild(figure);
        figure.appendChild(fragment);
        container.appendChild(article);
        var caption = document.createElement("h4");
        caption.className ='rsCaption';
        caption.appendChild(document.createTextNode(entry.title));
        var wrap = document.createElement("div");
        wrap.appendChild(caption);
        wrap.appendChild(video);
        videoSlider.appendChild(wrap);
        videojs("video-"+i, { "controls": true, "autoplay": false, "preload": "metadata" });
      }
      callback();
    }
  });
}

(function($) {
  $(document).ready(function() {
    google.setOnLoadCallback(function(){
      initialize(function(){
        $('.fancybox').each(function(index){
          $(this).fancybox({
            type: 'inline',
            padding   : 0,
            margin    : 0,
            closeClick  : false,
            openEffect  : 'none',
            closeEffect : 'none',
            autoSize:false,
            width:'100%',
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
                  centerArea: 0.45,
                  center: true,
                  breakpoint: 650,
                  breakpointCenterArea: 0.7,
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
    $(window).scroll(function() {
      var scrolled = Math.max(0, $(window).scrollTop());
      if ( scrolled >= 10 ){
            $('header').addClass('scrolled');
            $('#trigger-overlay').addClass('white');
        } else {
            $('header').removeClass('scrolled');
            $('#trigger-overlay').removeClass('white');
        }
    });
  });
}(jQuery));