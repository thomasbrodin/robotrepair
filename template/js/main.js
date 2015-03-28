$(document).ready(function() {
	var gridHeight = $("#home"),
		headerHeight = $('header').outerHeight(true),
		windowHeight;
	$(window).on('resize',resize);
	resize();
	function resize(){
		windowHeight = Math.max($(window).height(),480);
		diffH = (windowHeight-headerHeight);
		paddingFooter = 50;
		gridHeight.css({ height: (diffH - paddingFooter)});
	}
	$('.slider').each(function(){
		$(this).royalSlider({
			controlNavigation : 'none',
			arrowsNav : false,
			transitionType : 'fade',
			imageScalePadding : 0,
			imageScaleMode:'fill',
			autoPlay: {
				enabled: true,
				pauseOnHover: true,
				delay:$(this).attr('data-speed'),
			},
		});
	});
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
	$("#jplayer-audio-1").jPlayer({
		ready: function(event) {
			$(this).jPlayer("setMedia", {
				title: "A Big Decision",
				mp3: "http://tb.local:5757/img/a_big_decision.mp3"
			});
		},
		play: function() { // Avoid multiple jPlayers playing together.
			$(this).jPlayer("pauseOthers");
		},
		timeFormat: {
			padMin: false
		},
		swfPath: "js",
		supplied: "mp3",
		cssSelectorAncestor: "#jp-container-audio-1",
		useStateClassSkin: true,
		autoBlur: false,
		smoothPlayBar: true,
		remainingDuration: false,
		keyEnabled: true,
		keyBindings: {
			// Disable some of the default key controls
			loop: null,
			muted: null,
			volumeUp: null,
			volumeDown: null
		},
		wmode: "window"
	});
	$('button.jp-download').click(function(event) {
		var player = $('.jp-jplayer');
		var ButtonAppend = player.next('div').find('.jp-download');
		var a_href = player.find('audio').attr('src');
		window.open(a_href);
    });
});