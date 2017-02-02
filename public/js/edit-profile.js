$(document).ready(function() {

    $("#edit-profile-button").click(function(event) {
        console.log("clicked");
        var p = {};
        if ($(".name").val()) {
            p.name = $(".name").val();
        }
        if ($(".email").val()) {
            p.email = $(".email").val();
        }
        if ($(".location").val()) {
            p.location = $(".location").val();
        }
        if ($(".bio").val()) {
            p.bio = $(".bio").val();
        }
        $.ajax({
            url: '/edit-profile',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            data: JSON.stringify({
                profile: p
            }),
            success: function(data) {
                window.location.replace('/dashboard');
            },
            error: function(err) {
                console.log(err);
            }
        });
    });

     $('.button.delete').click(function(event) {
        $.ajax({
            url:'/delete-account',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            success: function(data) {
                window.location.replace('/');
            },
            error: function(err) {
                console.log(err);
            }
        });
    });


})