$(document).ready(function() {
	$('.challenge-complete').click(function(event){
		if ($(this).hasClass("completed")) {
			$(this).removeClass("completed");
            var challengeId = $(this).attr("id")
		}
		else {
			$(this).addClass("completed");
            var points = document.getElementById('')
            var challengeId = $(this).attr("id");

            $.ajax({
                url: '/addPoints',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                datatype: 'json',
                data: JSON.stringify({
                    _id: challengeId
                }),
                success: function(data) {
                    console.log('success');
                },
                error: function(err) {
                    console.log(err);
                }
            });
		}
	});
});