$(document).ready(function() {

    /* REGISTRATION */

    /*$("#reg-form .button.submit").click(function() {

        var name = $("#reg-form .name").val();
        var username = $("#reg-form .username").val();
        var email = $("#reg-form .email").val();
        var password = $("#reg-form .password").val();
        var location = $("#reg-form .location").val();
        var bio = $("#reg-form .bio").val();
        var mode = null;
            var modes = document.getElementsByName("mode");
            for(var i = 0; i < modes.length; i++) {
                if(modes[i].checked) {
                    mode = modes[i].value;
                }
            }

        if (!(name && username && email && password && location && mode)) {
            alert('Please fill out all required fields.');
        }
        else {
            $.ajax({
                url: '/register',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                datatype: 'json',
                data: JSON.stringify({
                    mode: mode,
                    name: name,
                    username: username,
                    email: email,
                    password: password,
                    location: location,
                    bio: bio,
                    profile_pic_url: '/images/tim.jpg',
                    cover_pic_url: '/images/killian.jpg'
                }),
                success: function(data) {
                    window.location.replace(data.redirect);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }


    })
    */

    /* TOGGLE PLACEHOLDERS */

    $("#reg-form input.mode").click(function(event) {

        var mode = $(this).val();

        console.log(mode);

        if (mode == "volunteer") {
            $("#reg-form .username").attr('placeholder', 'tim');
            $("#reg-form .name").attr('placeholder', 'Tim Beaver');
            $("#reg-form .email").attr('placeholder', 'tim@mit.edu');
            $("#reg-form .password").attr('placeholder', 'Password');
            $("#reg-form .location").attr('placeholder', 'Cambridge, MA');
            $("#reg-form .bio").attr('placeholder', 'Hello! I\'m Tim Beaver.');
        }

        else if (mode == "organization") {
            $("#reg-form .username").attr('placeholder', 'bch');
            $("#reg-form .name").attr('placeholder', 'Boston Children\'s Hospital');
            $("#reg-form .email").attr('placeholder', 'bch@bch.org');
            $("#reg-form .password").attr('placeholder', 'Password');
            $("#reg-form .location").attr('placeholder', 'Boston, MA');
            $("#reg-form .bio").attr('placeholder', 'We\'re Boston Children\'s Hospital.');
        }

    });


});