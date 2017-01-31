$(document).ready(function() {

    /* LOGIN */

    /*$("#login-form .button.submit").click(function() {
        var email = $("#login-form .email").val();
        var password = $("#login-form .password").val();
        if (!(email && password)) {
            alert('Please fill out all required fields.');
        }
        else {
            $.ajax({
                url: '/login',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                datatype: 'json',
                data: JSON.stringify({
                    email: email,
                    password: password
                }),
                success: function(data) {
                    window.location.replace(data.redirect);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }   
    }); */
    

});