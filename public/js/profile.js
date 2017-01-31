$(document).ready(function() {

	$("#profile .follow").click(function(event) {

		console.log('follow clicked');

		$.ajax({
            url: '/followUser',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            data: JSON.stringify({
                id: $(this).attr('name'),

            }),
            success: function(data) {
               	window.location.replace(window.location.href);
               	console.log(data);
            },
            error: function(error) {
                console.log(error);
            }
        });

	});

	$("#profile .unfollow").click(function(event) {

		console.log('unfollow clicked');

		$.ajax({
            url: '/followUser',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            data: JSON.stringify({
                id: $(this).attr('name'),
            }),
            success: function(data) {
               	window.location.replace(window.location.href);
               	console.log(data);
            },
            error: function(error) {
                console.log(error);
            }
        });

	});

});