$(document).ready(function() {

	/* Hardcode adding user for testing purposes */

	$.ajax({
		url: '/register/user',
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		datatype: 'json',
		data: JSON.stringify({
			mode: 'user',
			username: 'tim',
			password: 'wowthisissosecure',
			name: 'Tim Beaver',
			email: 'tim@mit.edu',
			bio: 'I am Tim Beaver',
			location_name: 'Cambridge, MA',
			location_zipcode: '02139',
			profile_pic_url: '/images/tim.jpg',
			cover_pic_url: '/images/killian.jpg'
		}),
		success: function(data) {
			console.log(data);
		},
		error: function(error) {
			console.log(error);
		}
	});

	$.ajax({
		url: '/register/organization',
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		datatype: 'json',
		data: JSON.stringify({
			mode: 'organization',
			name: 'Boston Children\'s Hospital',
			orgname: 'bch',
			email: 'boston@childrenshospital.org',
			password: 'wowthisissosecure',
			location_name: 'Boston, MA',
			location_zipcode: '02115',
			description: 'Children\'s hospital in Boston, MA.',
			profile_pic_url: '/images/bch.jpg',
			cover_pic_url: '/images/bch.jpg',
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

	/* NAV BAR TRANSITION
	$(window).scroll(function() {
		var top  = window.pageYOffset || document.documentElement.scrollTop;
		if (top >= 200) {
			$("nav").addClass("scrolled");
			$("nav .logo img").attr("src", "/images/logo-blue.png");
		}
		else {
			$("nav").removeClass("scrolled");
			$("nav .logo img").attr("src", "/images/logo-white.png");
		}
	});
	*/

	$('.challenge-complete').click(function(event){
		if ($(this).hasClass("completed")) {
			$(this).removeClass("completed");
		}
		else {
			$(this).addClass("completed");
		}
	})

});