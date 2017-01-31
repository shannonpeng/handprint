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
});