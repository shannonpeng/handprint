$(document).ready(function() {

	/* Hardcode adding user for testing purposes */

	$.ajax({
		url: '/register',
		type: 'POST',
		data: {
			mode: 'user',
			username: 'tim',
			name: 'Tim Beaver',
			email: 'tim@mit.edu',
			bio: 'I am Tim Beaver',
			location_name: 'Cambridge, MA',
			location_zipcode: '02139',
			profile_pic_url: 'http://web.mit.edu/graphicidentity/images/examples/tim-the-beaver-2.png',
		},
		success: function(data) {
			console.log(data);
		},
		error: function(error) {
			console.log(error);
		}
	});

});