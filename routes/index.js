var express = require('express');
var router = express.Router();

var User = require('../schemas/user');
var Challenge = require('../schemas/challenge');
var Organization = require('../schemas/organization');

/* Add user
INPUT:
- user: object with user properties
RETURNS:
- String: Mongo ObjectID of newly created user
*/
function addUser(user) {
	var User = require('../schemas/user.js');
	User.find({ username: user.username }, function(err, users) {

		if (err) {
			console.log(err);
		}

		if (users.length == 0) {

			/* TODO: Fetch friends from Facebook */
			var friends = [];

			var newUser = new User({
				username: user.username,
				name: user.name,
				email: user.email,
				bio: user.bio,
				location_name: user.location_name,
				location_zipcode: user.location_zipcode,
				profile_pic_url: user.profile_pic_url,
				friends: friends,
				challenges: {
					ongoing: [],
					past: []
				},
				points: 0,
				level: 1
			});

			newUser.save(function(err, user) {
				return user.id;
			});
		}
	});
}

/* Add challenge
INPUT:
- challenge: object with challenge properties
RETURNS:
- String: Mongo ObjectID of newly created challenge
*/
function addChallenge(challenge) {

	var Challenge = require('../schemas/challenge.js');

	var c = new Challenge({
		title: challenge.title,
		start_date: challenge.start_date,
		end_date: challenge.end_date,
		description: challenge.description,
		location_name: challenge.location_name,
		location_zipcode: challenge.location_zipcode,
		points: challenge.points,
		category_tags: challenge.category_tags,
	});

	c.save(function(err, c) {
		return c.id;
	});

}

/* Add organization
INPUT:
- org: object with organization properties
RETURNS:
- String: Mongo ObjectID of newly created organization
*/
function addOrganization(org) {

	var Organization = require('../schemas/organization.js');
	
	Organization.find({ email: org.email }, function(err, orgs) {

		if (err) {
			console.log(err);
		}

		if (orgs.length == 0) {

			var challenges = org.challenges;
			var challengeIDs = [];

			for (var i = 0; i < challenges.length ; i++) {
				challengeIDs.append(addChallenge(challenges[i]));
			}

			var newOrg = new Org({
				name: org.name,
				email: org.email,
				location_name: org.location_name,
				location_zipcode: org.location_zipcode,
				profile_pic_url: org.profile_pic_url,
				description: org.description,
				challenges: challengeIDs
			});

			newOrg.save(function(err, org) {
				return org.id;
			});
		}
	});

}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET dashboard. */
router.get('/dashboard', function(req, res, next) {
  res.render('dashboard');
});

/* GET profile page. */
router.get('/profile', function(req, res, next) {
  res.render('profile');
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register');
});


/* POST to register. */
router.get('/register', function(req, res, next) {

	/* User Registration */
	if (req.body.mode == "user") {
		addUser(req.body);
		res.redirect('/');
	}

	/* Organization Registration */
	else if (req.body.mode == "organization") {
		addOrganization(req.body);
		res.redirect('/');
	}

	else {
		res.send("Invalid registration mode");
	}

});

module.exports = router;
