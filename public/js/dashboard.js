$(document).ready(function() {
	$('.challenge-complete').click(function(event){
		if ($(this).hasClass("completed")) {
			$(this).removeClass("completed");
		}
		else {
			$(this).addClass("completed");
		}
	});
});