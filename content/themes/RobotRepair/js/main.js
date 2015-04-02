(function($) {
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
		var player = $('.jp-jplayer');
		player.each(function(index){
			var count = index+1;
			$(this).jPlayer({
				ready: function(event) {
					$(this).jPlayer("setMedia", {
						title: $(this).attr('data-title'),
						mp3: $(this).attr('data-url')
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
				cssSelectorAncestor: "#jp-container-audio-"+count,
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
			$('button.file-'+count).click(function(event) {
				var a_href = $('#jplayer-audio-'+count).attr('data-url');
				window.open(a_href);
			});
		});
	});
}(jQuery));