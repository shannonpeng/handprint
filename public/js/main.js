$(document).ready(function() {

	/* Hardcode adding user for testing purposes */

	$.ajax({
		url: '/register',
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		datatype: 'json',
		data: JSON.stringify({
			'mode': 'user',
			'username': 'ramya',
			'password': 'blah',
			'name': 'Tim Beaver',
			'email': 'tim@mit.edu',
			'bio': 'I am Tim Beaver',
			'location_name': 'Cambridge, MA',
			'location_zipcode': '02139',
			'profile_pic_url': 'http://web.mit.edu/graphicidentity/images/examples/tim-the-beaver-2.png',
		}),
		success: function(data) {
			console.log(data);
		},
		error: function(error) {
			console.log(error);
		}
	});

	$.ajax({
		url: '/register',
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		datatype: 'json',
		data: JSON.stringify({
			mode: 'organization',
			name: 'Boston Children\'s Hospital',
			password: 'hospitalPassword',
			email: 'boston@childrenshospital.org',
			location_name: 'Boston, MA',
			location_zipcode: '02115',
			description: 'Children\'s hospital in Boston, MA.',
			profile_pic_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/89/Boston_Children\'s_Hospital_logo.svg/1280px-Boston_Children\'s_Hospital_logo.svg.png',
			challenges: [{
				title: 'Paint a room',
				start_date: 1484283600000,
				end_date: 1484974800000,
				description: 'Decorate a child\'s room at the Boston Children\'s Hospital.',
				location_name: 'Boston Children\'s Hospital',
				location_zipcode: '02115',
				points: 140,
				category_tags: ['art', 'kids']
			}, {
				title: 'Read a book to kids',
				start_date: 1484197200000,
				end_date: 1485579600000,
				description: 'Read stories to kids at the Boston Children\'s Hospital.',
				location_name: 'Boston Children\'s Hospital',
				location_zipcode: '02115',
				points: 80,
				category_tags: ['books', 'reading', 'kids']
			}]
		}),
		success: function(data) {
			console.log(data);
		},
		error: function(error) {
			console.log(error);
		}
	});
	
	//need to finish hardcoding login ajax call

});