function openForm(evt, regTypeName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tab-content" and hide them
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tab-links" and remove the class "active"
    tablinks = document.getElementsByClassName("tab-links");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the a element that opened the tab
    document.getElementById(regTypeName).style.display = "block";
    evt.currentTarget.className += " active";
}

$(document).ready(function() {

    /* VOLUNTEER LOGIN */

    $("#volunteer .button.submit").click(function() {
        var username = $("#volunteer .username").val();
        var password = $("#volunteer .password").val();
        if (!(username && password)) {
            alert('Please fill out all required fields.');
        }
        else {
            $.ajax({
                url: '/login/user',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                datatype: 'json',
                data: JSON.stringify({
                    username: username,
                    password: password
                }),
                success: function(data) {
                    console.log("successful login");
                },
                error: function(error) {
                    alert(error);
                }
            });
        }   
    });

    /* ORGANIZATION LOGIN */

    $("#organization .button.submit").click(function() {
        var email = $("#organization .email").val();
        var password = $("#organization .password").val();
        if (!(email && password)) {
            alert('Please fill out all required fields.');
        }
        else {
            $.ajax({
                url: '/login/organization',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                datatype: 'json',
                data: JSON.stringify({
                    email: email,
                    password: password
                }),
                success: function(data) {
                    console.log("successful login");
                },
                error: function(error) {
                    alert(error);
                }
            });
        }
    })
});