$(document).ready(function() {

    ("#edit-profile-button").click(function(event) {
        var p = {};
        if ($(".name")) {
            p.name = $(".name");
        }
        if ($(".email")) {
            p.name = $(".email");
        }
        if ($(".location")) {
            p.name = $(".location");
        }
        if ($(".bio")) {
            p.name = $(".bio");
        }
        $.ajax({
            url: '/editProfile',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            datatype: 'json',
            data: JSON.stringify({
                profile: p
            }),
            success: function(data) {
                window.location.replace('/dashboard')
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
})