function openForm(evt, regTypeName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(regTypeName).style.display = "block";
    evt.currentTarget.className += " active";
}

$(document).ready(function() {
    $(".submit").click(function() {
        if ($("#volusername").val().length > 0) {
            var mode = 'user';
            var name = $("#volname").val();
            var username = $("#volusername").val();
            var email = $("#volemail").val();
            var password = $("#volpassword").val();
            // need to build city list dropdown before storing city
            /*var location = $("#vollocation").val();*/
            var bio = $("#bio").val();
            $.ajax({
                url: '/register/user',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                datatype: 'json',
                data: JSON.stringify({
                    //mode: 'user',
                    username: username,
                    email: email,
                    password: password,
                    name: name,
                    bio: bio,
                    profile_pic_url: '/images/tim.jpg',
                    cover_pic_url: '/images/killian.jpg'
                }),
                success: function(data) {
                    console.log(data);
                    window.location.replace('/');
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }
        else if ($("#orgname").val().length > 0) {
            var mode = 'organization';
            var name = $("#orgname").val();
            var username = $("#orgusername").val();
            var email = $("#orgemail").val();
            var password = $("#orgpassword").val();
            // need to add location drop down before storing locaitons
            //var location = $("#orglocation").val();
            var description = $("#orgdescription").val();
            $.ajax({
                url: '/register/organization',
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                datatype: 'json',
                data: JSON.stringify({
                    //mode: 'organization',
                    name: name,
                    orgname: username,
                    email: email,
                    //password: password,
                    description: description,
                    profile_pic_url: '/images/bch.jpg',
                    cover_pic_url: '/images/bch.jpg'
                }),
                success: function(data) {
                    console.log(data);
                    window.location.replace('/');
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }
    })
})