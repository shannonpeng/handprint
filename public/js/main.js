$(document).ready(function() {

	$(window).scroll(function() {
		var top  = window.pageYOffset || document.documentElement.scrollTop;
		console.log(top);
		if (top >= 200) {
			$("nav").addClass("scrolled");
		}
		else {
			$("nav").removeClass("scrolled");
		}
	});

});