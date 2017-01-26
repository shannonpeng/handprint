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

    /* VOLUNTEER REGISTRATION */

    $("#volunteer .button.submit").click(function() {
        var name = $("#volunteer .name").val();
        var username = $("#volunteer .username").val();
        var email = $("#volunteer .email").val();
        var password = $("#volunteer .password").val();
        // need to build city list dropdown before storing city
        /*var location = $("#volunteer .location").val();*/
        var bio = $("#volunteer .bio").val();
        if (!(name && username && email && password)) {
            alert('Please fill out all required fields.');
        }
        else {
            $.ajax({
                url: '/register/user',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                datatype: 'json',
                data: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    name: name,
                    bio: bio,
                    profile_pic_url: '/images/tim.jpg',
                    cover_pic_url: '/images/killian.jpg'
                }),
                success: function(data) {
                    window.location.replace('/');
                },
                error: function(error) {
                    alert(error);
                }
            });
        }   
    });

    /* ORGANIZATION REGISTRATION */

    $("#organization .button.submit").click(function() {
        var name = $("#organization .name").val();
        var username = $("#organization .username").val();
        var email = $("#organization .email").val();
        var password = $("#organization .password").val();
        // need to add location drop down before storing locaitons
        // var location = $("#organization .location").val();
        var description = $("#organization .description").val();
        if (!(name && username && email && password)) {
            alert('Please fill out all required fields.');
        }
        else {
            $.ajax({
                url: '/register/organization',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                datatype: 'json',
                data: JSON.stringify({
                    name: name,
                    orgname: username,
                    email: email,
                    password: password,
                    description: description,
                    profile_pic_url: '/images/tim.jpg',
                    cover_pic_url: '/images/killian.jpg'
                }),
                success: function(data) {
                    window.location.replace('/');
                },
                error: function(error) {
                    alert(error);
                }
            });
        }
    })
})