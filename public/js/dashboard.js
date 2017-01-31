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

    $('.submit-search').click(function(event) {
        var searchItem = $('.input-search').val();
        console.log(searchItem);
        $.ajax({
            url: '/search/' + encodeURI(searchItem),
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            /*
            data: JSON.stringify({
                searchItem: searchItem
            }),
            */
            success: function(data) {
                console.log('success');
                /*
                if (data) {
                    window.location.replace('http://localhost:3000/search')
                }
                */
                //alert(data);
                /*
                if (data) {
                    window.location.replace('http://localhost:3000/search');
                }
                */
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    $('.delete').click(function(event) {
        $.ajax({
            url:'/delete',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json'

            success: function(data) {
                console.log('success');
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

    $('.challenges').click(function(event) {
        $.ajax({
            url:'/challenges',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json'

            success: function(data) {
                console.log('success');
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
});