var express = require('express');
var router = express.Router();

//get the User model
var User = require('../schemas/user');
//get the Challenge model
var Challenge = require('../schemas/challenge');
//get the Organization model
var Organization = require('../schemas/organization');

/* Add user
INPUT:
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
				callback(user._id);
			});
		}
	});
}

/* Add challenge
INPUT:
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

/* Add challenges to organization
INPUT:
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
INPUT:
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
//Organization Dashboard Code
/*
Parts of the page:
- Profile
- List of Challenges
*/
/*Pseudocode/Features of Challenge List
1. Grab all challenges under organization name
2. Sort challenges into current and complete
3. Button/bar for "adding a new challenge"
*/
/*var orgSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    location_name: String,
    location_zipcode: Number,
    profile_pic_url: {type: String, required: true},
    description: String,
    profile_pic_url: {type: String, required: true},
    friends: [String],
    challenges: [String]
});
var challengeSchema = new mongoose.Schema({
    title: {type: String, required: true},
    start_date: {type: Number, required: true},
    end_date: {type: Number, required: true},
    description: {type: String, required: true},
    location_name: {type: String, required: true},
    location_zipcode: {type: String, required: true},
    points: {type: Number, required: true},
    category_tags: [String]
});
*/


/*GET organization dashboard*/
/*
function checkChallengeDate(challengeDate) {
    var currentTime = Date.now();
    if currentTime > challengeDate
}
*/
router.get('/dashboard', function(req, res, next) {
    var Organization = require('../schemas/organization');
    var Challenge = require('../schemas/challenge');
    Organization.find({}, function(err, organizations) {
        if (organizations.length > 0) {
            var challengeIds = organizations[0].challenges;
            var challengeNames = [];
            var ongoingChallenges = [];
            var pastChallenges = [];
                Challenge.find({}, function(err, challenges) {
                    for (var i = 0; i < challenges.length; i++) {
                        // push all challenges
                        if (challengeIds.indexOf(challenges[i]._id) > -1) {
                            challengeNames.push(challenges[i].title);
                            // check dates of challenges
                            if (challenges[i].end_date > Date.now()) {
                                //check for ongoing challenges
                                console.log('IN ONGOING CHALLENGES IF STATEMENT');
                                /* I think this is correct, but if not flip with the 
                                 * else if statement
                                 */
                                ongoingChallenges.push(challenges[i].title);
                            }
                            else if (challenges[i].end_date < Date.now()) {
                                //check for past challenges
                                pastChallenges.push(challenges[i].title);
                            }
                        }
                    }
                    res.send('ALL CHALLENGES: ' + challengeNames + ' ONGOING CHALLENGES: ' + 
                        ongoingChallenges + ' PAST CHALLENGES ' + pastChallenges);
                });
        }
        else {
            res.render('Your organization has no challenges');
        }
    });
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
router.post('/register', function(req, res, next) {
    console.log(req.body["mode"]);

	/* User Registration */
	if (req.body.mode == "user") {
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
