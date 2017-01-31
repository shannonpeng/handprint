$(document).ready(function() {

	$('.challenge-complete').click(function(event){
		if ($(this).hasClass("completed")) {
            return;
		}
		else {
			$(this).addClass("completed");
            var challengeId = $(this).attr('id');

            $.ajax({
                url: '/completeChallenge',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                datatype: 'json',
                data: JSON.stringify({
                    id: challengeId
                }),
                success: function(data) {
                    console.log(data);
                    window.location.replace('/dashboard');
                },
                error: function(err) {
                    console.log(err);
                }
            });
		}
	});

    $('.browse-challenges').click(function(event) {
        $.ajax({
            url:'/challenges',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            success: function(data) {
                console.log('success');
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
    
});