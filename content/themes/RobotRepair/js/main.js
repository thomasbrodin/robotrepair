(function($) {
	$(document).ready(function() {
		var gridHeight = $("#home"),
			headerHeight = $('header').outerHeight(true),
			windowHeight;
		$(window).on('resize',resize);
		resize();
		function resize(){
			windowHeight = $(window).height();
			diffH = (windowHeight-headerHeight);
			paddingFooter = 40;
			gridHeight.css({ height: (diffH - paddingFooter)});
		}
		$(window).load(function() {
			$('.loader').fadeOut();
			$('.wrap').fadeIn();
			$('#best-tracks').fadeIn();
			var slider = $('.slider').royalSlider({
				controlNavigation : 'none',
				arrowsNav : false,
				transitionType : 'fade',
				imageScalePadding : 0,
				imageScaleMode:'fill',
				autoPlay: {
					enabled: true,
				},
				block: {
					fadeEffect: true,
					moveEffect: 'none',
					speed: 400,
					delay:100,
				}
			}).data('royalSlider');
		});
		$('article.friend').click(function(e) {
			e.preventDefault();
			$('figure').removeClass('hide');
			$('.grow').removeClass('open');
			$(this).children("figure").addClass('hide');
			$(this).children(".grow").addClass('open');
				});
				$('.grow').mouseleave(function() {
			$(this).removeClass('open');
			$('figure').removeClass('hide');
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
				preload:"none",
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
