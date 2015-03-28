google.load("feeds", "1" );

function initialize(callback) {
  var feed = new google.feeds.Feed("http://www.wdcdn.net/rss/presentation/library/client/robotrepair/id/a51a000c78e6997a1b7d422247cad813");
  feed.setNumEntries(99);
  feed.load(function(result) {
    if (!result.error) {
      var container = document.getElementById("feed");
      var iframe = document.getElementById("popup");
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
        setAttributes(video , {
            "class" : "video-js vjs-sublime-skin vjs-big-play-centered",
            "id" : "video-"+i,
            "width": "640",
            "height" : "360"
        });
        if (entry.mediaGroups) {
            var imgSrc = entry.mediaGroups[0].contents[0].thumbnails[0].url;
            var img = document.createElement('img');
            setAttributes( img , {
                "src" : imgSrc,
            });
            figure.appendChild(img);
            var mediaSrc = entry.mediaGroups[0].contents[0].url;
            var source = document.createElement('source');
            setAttributes( source , {
                "src" : mediaSrc,
                "type" : "video/mp4"
            });
            video.appendChild(source);
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
        iframe.appendChild(wrap);
        videojs("video-"+i, { "controls": true, "autoplay": false, "preload": "auto" });
      }
      callback();
    }
  });
}
google.setOnLoadCallback(function(){
    initialize(function(){
        $('.fancybox').fancybox({
          type: 'inline',
          padding   : 0,
          closeClick  : false,
          openEffect  : 'none',
          closeEffect : 'none',
        });
        $('.videoSlider').royalSlider({
            addActiveClass: true,
            controlNavigation : 'none',
            arrowsNav : false,
            autoScaleSlider: false,
            loop: true,
            fadeinLoadedSlide:false,
            globalCaption: true,
            globalCaptionInside: false,
            keyboardNavEnabled: true,
            visibleNearby: {
              enabled: true,
              centerArea: 0.5,
              center: true,
              breakpoint: 650,
              breakpointCenterArea: 0.64,
              navigateByClick:true,
              navigateByCenterClick: false,
            },
            deeplinking: {
              enabled: true,
              prefix: 'slider-'
            }
        });
    });
});

function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

$(document).ready(function() {
  $(window).scroll(function() {
    var scrolled = Math.max(0, $(window).scrollTop());
    if ( scrolled >= 10 ){
          $('header').addClass('scrolled');
          $('.trigger-wrapper').addClass('scrolled');
          $('#trigger-overlay').addClass('white');
      } else {
          $('header').removeClass('scrolled');
          $('.trigger-wrapper').removeClass('scrolled');
          $('#trigger-overlay').removeClass('white');
      }
  });
});