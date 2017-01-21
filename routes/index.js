var express = require('express');
var router = express.Router();

var User = require('../schemas/user');
var Challenge = require('../schemas/challenge');
var Organization = require('../schemas/organization');

/* Add user
ARGUMENTS:
- user: object with user properties
- callback: callback function
RETURNS:
- String: Mongo ObjectID of newly created user
*/
function addUser(user, callback) {
	var User = require('../schemas/user.js');
	User.find({ username: user.username }, function(err, users) {

		if (err) {
			console.log(err);
		}

		if (users.length == 0) {

			/* TODO: Fetch friends from Facebook */
			//var friends = [];

			var newUser = new User({
				username: user.username,
				password: user.password,
				name: user.name,
				email: user.email,
				bio: user.bio,
				location_name: user.location_name,
				location_zipcode: user.location_zipcode,
				profile_pic_url: user.profile_pic_url,
				friends: [],
				challenges: {
					ongoing: [],
					past: []
				},
				points: 0,
				level: 1
			});

			newUser.save(function(err, u) {
				addFriendsToUser(u._id, user.friends, function (ids){} );
				callback(u._id);
			});
		}
	});
}

/* Add friends to user
ARGUMENTS:
- userID: objectID of user
- friends: array of objects, each with user properties
- callback: callback function
RETURNS:
- String: Array of Mongo ObjectIDs of newly added challenges
*/
function addFriendsToUser(userID, friends, callback) {

	var User = require('../schemas/user.js');

	User.findById(userID, function (err, user) {

	  	var ids = [];

		for (var i = 0; i < friends.length; i++) {
				user.friends.push(friends[i]);
				user.save();
				ids.push(friends[i]);
			};

		callback(ids);

	});

}

/* Edit user
ARGUMENTS:
- user: object with user properties
- callback: callback function
RETURNS:
- String: Mongo ObjectID of modified user
*/
function editUser(user, callback) {

}

/* Delete user
ARGUMENTS:
- user: object with user properties
- callback: callback function
RETURNS:
- String: Mongo ObjectID of deleted user
*/
function deleteUser(user, callback) {

}

/* Add challenge
ARGUMENTS:
- challenge: object with challenge properties
- callback: callback function
RETURNS:
- String: Mongo ObjectID of newly created challenge
*/
function addChallenge(challenge, callback) {

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
		callback(c._id);
	});

}

/* Edit challenge
ARGUMENTS:
- challenge: object with challenge properties
- callback: callback function
RETURNS:
- String: Mongo ObjectID of modified challenge
*/
function editChallenge(challenge, callback) {

}

/* Delete challenge
ARGUMENTS:
- challenge: object with challenge properties
- callback: callback function
RETURNS:
- String: Mongo ObjectID of deleted challenge
*/
function deleteChallenge(challenge, callback) {

}

/* Add challenges to organization
ARGUMENTS:
- orgID: objectID of organization
- challenges: array of objects, each with challenge properties
- callback: callback function
RETURNS:
- String: Array of Mongo ObjectIDs of newly added challenges
*/
function addChallengesToOrg(orgID, challenges, callback) {

	var Organization = require('../schemas/organization.js');

	Organization.findById(orgID, function (err, org) {

	  	var ids = [];

		for (var i = 0; i < challenges.length; i++) {
			addChallenge(challenges[i], function(id) {
				org.challenges.push(id);
				org.save();
				ids.push(id);
			});
		}

		callback(ids);

	});

}

/* Add organization
ARGUMENTS:
- org: object with organization properties
- callback: callback function
RETURNS:
- String: Mongo ObjectID of newly created organization
*/
function addOrganization(org, callback) {

	var Organization = require('../schemas/organization.js');
	
	Organization.find({ email: org.email }, function(err, orgs) {

		if (err) {
			console.log(err);
		}

		if (orgs.length == 0) {

			var newOrg = new Organization({
				name: org.name,
				email: org.email,
				location_name: org.location_name,
				location_zipcode: org.location_zipcode,
				profile_pic_url: org.profile_pic_url,
				description: org.description,
				challenges: []
			});

			newOrg.save(function(err, o) {
				addChallengesToOrg(o._id, org.challenges, function (ids){} );
				callback(o._id);
			});
		}
	});

}

/* Edit organization
ARGUMENTS:
- org: object with organization properties
- callback: callback function
RETURNS:
- String: Mongo ObjectID of modified organization
*/
function editOrganization(org, callback) {

}

/* Delete organization
ARGUMENTS:
- org: object with organization properties
- callback: callback function
RETURNS:
- String: Mongo ObjectID of deleted organization
*/
function deleteOrganization(org, callback) {

}


/* GET home page. */
router.get('/', function(req, res, next) {
 	res.render('index');
});

/* GET dashboard. */
router.get('/dashboard', function(req, res, next) {
 	
	/* TODO: get identity of user from oauth */
 	var orgID = '';
 	var userID = '5882c6dc92693e136f7e7768';

 	var User = require('../schemas/user.js');
	var Challenge = require('../schemas/challenge.js');

	User.findOne({ _id: userID}, function(err, user) {

		var challenges = [];

		for (var i = 0; i < user.challenges.length; i++) {
			Challenge.findOne({ _id: user.challenges[i] }, function(err, challenge) {
				if (err) {
					console.log(err);
				}
				else {
					challenges.push(challenge);
				}
			})
		}

		res.render('dashboard', {
			user: user,
			challenges: challenges,
			friends: user.friends
		})
	})

 	//res.render('dashboard');
});

/* GET profile page. */
router.get('/profile', function(req, res, next) {

	/* TODO: Figure out the ID of the user that's logged in */
	var userID = '5882c6dc92693e136f7e7768';

	var User = require('../schemas/user.js');
	var Challenge = require('../schemas/challenge.js');

	User.findOne({ _id : userID }, function(err, user) {

		var challenges = [];

		for (var i = 0; i < user.challenges.length; i++) {
			Challenge.findOne({ _id: user.challenges[i] }, function(err, challenge) {
				if (err) {
					console.log(err);
				}
				else {
					challenges.push(challenge);
				}
			})
		}

		res.render('profile', {
			user: user,
			challenges: challenges
	 	});
	});
});

/* POST profile page. */
router.post('/edit-profile', function(req, res, next) {

	
 	res.render('profile', {

  });
});

/* GET register page. */
router.get('/register', function(req, res, next) {
 	res.render('register');
});


/* POST to register. */
router.post('/register', function(req, res, next) {

	/* User Registration */
	if (req.body.mode == "user") {
		console.log(req.body.friends);
		addUser(req.body, function(id) {
			res.redirect('/');
		});
	}

	/* Organization Registration */
	else if (req.body.mode == "organization") {
		addOrganization(req.body, function(id) {
			res.redirect('/');
		});
	}

	else {
		res.send("Invalid registration mode");
	}	

});

module.exports = router;
