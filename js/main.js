
$(function() {
 "use strict";

// Run homepage slider
$(".home #carousel").owlCarousel({
	'pagination': false,
	'items': 6,
	'autoPlay': 5000,
	'mouseDrag' : false,
    'touchDrag' : false
});

$('.masonry').masonry({
	itemSelector: '.item'
});		
//var masonry = $('.masonry').data('masonry');

var feedHtml = $('#facebook').html();
var timeout = window.setInterval(function(){

	if (feedHtml !== 'Loading...'){
		$('.masonry').masonry('reloadItems');
		$('.masonry').masonry('layout');
	} else {
		clearInterval(timeout);
	}
}, 10);

// Run lightbox on links with .lightbox class
//$('.lightbox').magnificPopup({
//	type: 'image',
//	closeOnContentClick: true,
//	closeBtnInside: false,
//	fixedContentPos: true,
//	mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
//	image: {
//		verticalFit: true
//	},
//	zoom: {
//		enabled: true,
//		duration: 300 // don't foget to change the duration also in CSS
//	}
//});
$('.lightbox').each(function() {
	$(this).magnificPopup({
		type: "image",
		showCloseBtn: true,
		callbacks: {
			beforeOpen: function() {
				$("body").addClass("mfp-opened");
			},
			afterClose: function() {
				$("body").removeClass("mfp-opened");
			}
		}
	});
});


//
// magnific popup
//
(function() {
	//photos
	$(".categories .item .camera").each(function() {
		var $this = $(this),
			photos = [ ],
			$items = $this.parent().children(".photosBox").children("img");

		$items.each(function() {
			photos.push({ src: this.src, type: "image" });
		});

		$this.magnificPopup({
			type: "image",
			items: photos,
			showCloseBtn: true,
			gallery: {
				enabled: true
			},
			callbacks: {
				beforeOpen: function() {
					$("body").addClass("mfp-opened");
				},
				afterClose: function() {
					$("body").removeClass("mfp-opened");
				}
			}
		});
	});
	
	//pedigree
	$(".categories .item .pedigree").each(function() {
		var $this = $(this),
			$box = $this.parent().children(".pedigreeBox");

		$this.magnificPopup({
			type: "inline",
			items: {
				src: $box
			},
			showCloseBtn: true,
			callbacks: {
				beforeOpen: function() {
					$("body").addClass("mfp-opened");
				},
				afterClose: function() {
					$("body").removeClass("mfp-opened");
				}
			}
		});
	});
	
	//pedigree
	$(".categories .item .video").each(function() {
		var $this = $(this),
			$box = $this.parent().children(".videoBox");

		$this.magnificPopup({
			type: "inline",
			items: {
				src: $box
			},
			showCloseBtn: true,
			callbacks: {
				beforeOpen: function() {
					$("body").addClass("mfp-opened");
				},
				afterClose: function() {
					$("body").removeClass("mfp-opened");
				}
			}
		});
	});
}());

$(window).resize(function() {
	var $wrapper = $('#wrapper');

	$wrapper.css({'padding-bottom': $('.slider').height()});
	$('footer').css({'bottom': $('.slider').height()});

	var width = $(window).width();
	var height = $(window).height();

	if (height > 480) {

		// Show .sideMenu
		$('.toggleMenu .menu').click(function () {
			if ($wrapper.css('left') === '0px') {
				$wrapper.stop(true, true).animate({'left': '268px'});
			}
		});
		// Hide .sideMenu
		$('html').click(function (e) {
			if ($wrapper.css('left') === '268px') {
				if (!$(e.target).closest('.sideMenu').length) {
					$wrapper.animate({'left': 0});
				}
			}
		});
	} else {
		// Show .sideMenu
		$('.toggleMenu .menu').click(function () {
			$('.sideMenu').fadeIn();
		});
		// Hide .sideMenu
		$('html').click(function (e) {
			if (!$(e.target).closest('.sideMenu li, .toggleMenu .menu').length) {
				$('.sideMenu').fadeOut();
			}
		});
	}

	var $boxes = $('.boxes.special .item');
	if (width > 800) {
		// Set the same height for all Special Boxes
		$boxes.css("height", "auto");
		var highest = 0;
		$boxes.each(function () {
			var $elem = $(this);
			if ($elem.outerHeight() > highest) {
				highest = $elem.outerHeight();
			}
		});
		$boxes.each(function () {
			var $elem = $(this);
			$elem.css({'height': highest});
		});

		// Set the same height for all Category Boxes
		var $boxesC = $('.boxes.categories .item .inner');
		var highestC = 0;
		$boxesC.each(function () {
			var $elem = $(this);
			if ($elem.outerHeight() > highestC) {
				highestC = $elem.outerHeight();
			}
		});
		$boxesC.each(function () {
			var $elem = $(this);
			$elem.css({'height': highestC});
		});
	} else {
		$boxes.css("height", "auto");
	}
}).resize();

// Category hover
$('.categories .onHover').hover(function () {
	var $parent = $(this).parent();
	var cls = $(this).attr('class');
	cls = cls.replace('onHover ', '');
	$parent.addClass('hovered');	
	$parent.find('.'+cls).addClass('hovered');
	$parent.find('.hover-'+cls).addClass('hovered');
}, function () {
	var $parent = $(this).parent();
	var cls = $(this).attr('class');
	cls = cls.replace('onHover ', '.');	
	$parent.removeClass('hovered');		
	$parent.find('.hovered').removeClass('hovered');
});

});