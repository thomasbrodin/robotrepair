(function($) {
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
		if ($("#best-tracks").length) {
			var arrayLength = rrPlaylist.length;
			for( i = 0; i < arrayLength; i++){
					rrPlaylist[i].free = Boolean ;
			}
			var myPlaylist = new jPlayerPlaylist({
				jPlayer: "#top-tracks",
				cssSelectorAncestor: "",
				cssSelector: {
				play: '.jp-play',
				next: 'jp-next',
				seekBar: '.jp-playlist-current .jp-seek-bar',
				playBar: '.jp-playlist-current .jp-play-bar',
				title: '.jp-title',
				gui: '.jp-flat-audio',
				noSolution: '.jp-no-solution',
				currentTime: ".jp-current-time",
				duration: ".jp-duration",
			 },
			}, rrPlaylist, {
				timeFormat: {
					padMin: false
				},
				playlistOptions: {
					autoPlay: true,
					loopOnPrevious: true,
					shuffleOnLoop: true,
					enableRemoveControls: false,
					displayTime: 'fast',
				},
				swfPath: "js",
				supplied: "mp3",
				preload: 'metadata',
				free: Boolean,
				useStateClassSkin: true,
				autoBlur: false,
				smoothPlayBar: true,
				keyEnabled: true,
				audioFullScreen: false,
				remainingDuration: false,
				keyEnabled: true,
				keyBindings: {
					muted: null,
					volumeUp: null,
					volumeDown: null
				},
				wmode: "window",
				ready: function() {
					var trackContainer = $('.jp-playlist li');
					trackContainer.prepend($('<div class="jp-bar"><div class="jp-seek-bar jp-seek-bar-display"></div>	<div class="jp-seek-bar"><div class="jp-play-bar"></div></div></div>'));
					trackContainer.prepend($('<button class="jp-download jp-button" role="button" aria-label="download" tabindex="0"></button>'));
					$.each( rrPlaylist, function( i, v ) {
						color = v.mp3_color;
						trackContainer.eq(i).prepend('<div class="track-color" style="background-color:'+color+'"></div>');
					});
					$("#top-tracks").jPlayer("option", "cssSelector", {
						seekBar: '.jp-playlist li:first-child .jp-seek-bar',
						playBar: '.jp-playlist li:first-child .jp-play-bar',
					});
					$('button.jp-download').click(function() {
						var $a_href = ($(this).closest('li').find('a.jp-playlist-item-free').attr('href'));
						event.preventDefault();  //stop the browser from following
						window.location.href = $a_href;
					});
				},
				ended: function() {
					$("#top-tracks").jPlayer("option", "cssSelector", {
						seekBar: 'li.jp-playlist-current .jp-seek-bar',
						playBar: 'li.jp-playlist-current .jp-play-bar',
					});
				},
				play: function(){
					$("#top-tracks").jPlayer("option", "cssSelector", {
						seekBar: 'li.jp-playlist-current .jp-seek-bar',
						playBar: 'li.jp-playlist-current .jp-play-bar',
					});
				}
			});
		}
		if ($('#collaborator').length) {
			$('.jp-jplayer').each(function(index){
				var count = index+1;
				$("#jplayer-audio-"+count).jPlayer({
					ready: function(event) {
						$(this).jPlayer("setMedia", {
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
					preload:'metadata',
					keyBindings: {
						// Disable some of the default key controls
						loop: null,
						muted: null,
						volumeUp: null,
						volumeDown: null
					},
					wmode: "window"
				});
			});
		}
}(jQuery));
