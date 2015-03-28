google.load("feeds", "1");

function initialize() {
  var feed = new google.feeds.Feed("http://www.wdcdn.net/rss/presentation/library/client/robotrepair/id/a51a000c78e6997a1b7d422247cad813");
  feed.setNumEntries(1);
  feed.load(function(result) {
    if (!result.error) {
      var container = document.getElementById("feed");
      for (var i = 0; i < result.feed.entries.length; i++) {
        var entry = result.feed.entries[i];
        var video = document.createElement('video');
        setAttributes(video , {
            "class" : "video-js vjs-sublime-skin vjs-big-play-centered",
            "id" : "video-"+i,
            "width": "640",
            "height" : "360"
        });
       if (entry.mediaGroups) {
            var mediaSrc = entry.mediaGroups[0].contents[0].url;
            var source = document.createElement('source');
            setAttributes( source , {
                "src" : mediaSrc,
                "type" : "video/mp4"
            });
            video.appendChild(source);
        }
        container.appendChild(video);
        videojs("video-"+i, { "controls": true, "autoplay": false, "preload": "auto" });
      }
    }
  });
}
google.setOnLoadCallback(initialize);

function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}