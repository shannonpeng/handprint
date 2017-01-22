var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//get the User model
var User = require('../schemas/user');
//get the Challenge model
var Challenge = require('../schemas/challenge');
//get the Organization model
var Organization = require('../schemas/organization');

passport.use('user', User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use('org', Organization.createStrategy());
passport.serializeUser(Organization.serializeUser());
passport.deserializeUser(Organization.deserializeUser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));
router.use(session({ secret: 'my super secret secret', resave: 'false', 
    saveUninitialized: 'true'}));
router.use(passport.initialize());
router.use(passport.session());

/* Get organizations list */

function getOrganizations(callback) {
	var Organization = require('../schemas/organization.js');
	var orgs_list = [];
	Organization.find({}, function(err, orgs) {
		if (err) {
			console.log(err);
		}
		else {
			for (var i = 0; i < orgs.length; i++) {
				var org = {};
				org.orgname = orgs[i].orgname;
				org.name = orgs[i].name;
				org.profile_pic_url = orgs[i].profile_pic_url;
				org.location_name = orgs[i].location_name;
				orgs_list.push(org);
			}
			callback(orgs_list);
		}
	});
}

router.get('/organizations-list', function(req, res, next) {
	getOrganizations(function(data) {
		res.send(data);
	})
});

/* Get users list */

function getUsers(callback) {
	var User = require('../schemas/user.js');
	var users_list = [];
	Organization.find({}, function(err, users) {
		if (err) {
			console.log(err);
		}
		else {
			for (var i = 0; i < users.length; i++) {
				var user = {};
				user.name = users[i].name;
				user.username = users[i].username;
				user.bio = users[i].bio;
				user.profile_pic_url = users[i].profile_pic_url;
				user.location_name = users[i].location_name;
				user.points = users[i].points;
				user.level = users[i].level;
				users_list.push(org);
			}
			callback(users_list);
		}
	});
}
router.get('/users-list', function(req, res, next) {
	getUsers(function(data) {
		res.send(data);
	})
}) 

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
			var friends = [];

			var newUser = new User({
				username: user.username,
				name: user.name,
				email: user.email,
				bio: user.bio,
				location_name: user.location_name,
				location_zipcode: user.location_zipcode,
				profile_pic_url: user.profile_pic_url,
				cover_pic_url: user.cover_pic_url,
				friends: friends,
				challenges: [],
				points: 0,
				level: 1
			});

			User.register(newUser, user.password, function(err) {
				if (err) {
					console.log(err);
				}
				callback(newUser._id);
			});
		}
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
		if (err) {
			console.log(err);
		}
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

		if (err) {
			console.log(err);
		}

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
				orgname: org.orgname,
				email: org.email,
				location_name: org.location_name,
				location_zipcode: org.location_zipcode,
				profile_pic_url: org.profile_pic_url,
				cover_pic_url: org.cover_pic_url,
				description: org.description,
				challenges: []
			});

			Organization.register(newOrg, org.password, function(err) {
				if (err) {
					console.log(err);
				}
				addChallengesToOrg(newOrg._id, org.challenges, function (ids) {});
				callback(newOrg._id);
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

/* GET dashboard. */
router.get('/dashboard', function(req, res, next) {

	/* TODO: determine if organization or user */

 	var Organization = require('../schemas/organization');
    var Challenge = require('../schemas/challenge');
    var reqFields = [];

    Organization.find({}, function(err, organizations) {
        if (organizations.length > 0) {
            var challengeIds = organizations[0].challenges;
            var ongoingChallenges = [];
            var pastChallenges = [];
                Challenge.find({}, function(err, challenges) {
                    for (var i = 0; i < challenges.length; i++) {
                        // push all challenges
                        if (challengeIds.indexOf(challenges[i]._id) > -1) {
                            // check dates of challenges
                            if (challenges[i].end_date > Date.now()) {
                                ongoingChallenges.push(challenges[i].title);
                            }
                            else if (challenges[i].end_date < Date.now()) {
                                //check for past challenges
                                pastChallenges.push(challenges[i].title);
                            }
                        }
                    }
                    if (pastChallenges.length < 0) {
                        pastChallenges = 'There are no past challenges';
                    }
                    if (ongoingChallenges.length < 0) {
                        ongoingChallenges = 'There are no ongoing challenges'; 
                    }
                    res.send(' ONGOING CHALLENGES: ' + 
                        ongoingChallenges + ' PAST CHALLENGES: ' + pastChallenges);
                });
        }
        else {
            res.render('Your organization has no challenges');
        }
    });
});

/* GET profile page. */
router.get('/users/:id', function(req, res, next) {

	var User = require('../schemas/user.js');
	var Challenge = require('../schemas/challenge.js');

	User.findOne({ username : req.params.id }, function(err, user) {

		if (err) {
			console.log(err);
		}

		if (user == null) {
			res.redirect('/organizations/' + req.params.id);
			return;
		}

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

		/* HARD CODE FRIENDS AND CHALLENGES FOR NOW */
		friends = [{
			name: 'Shannon Peng',
			username: 'shannon',
			profile_pic_url: '/images/shannon.jpg'
		},
		{
			name: 'Ramya Nagarajan',
			username: 'ramya',
			profile_pic_url: '/images/ramya.jpg'
		
		},
		{
			name: 'Jennifer Zou',
			username: 'jennifer',
			profile_pic_url: '/images/jennifer.jpg'
		}
		];

		challenges = [
			{
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
			}
		];

		res.render('profile', {
			user: user,
			challenges: challenges,
			friends: friends
	 	});
	});
});

/* GET org profile page. */
router.get('/organizations/:id', function(req, res, next) {

	var Organization = require('../schemas/organization.js');
	var Challenge = require('../schemas/challenge.js');

	Organization.findOne({ orgname : req.params.id }, function(err, org) {

		if (err) {
			console.log(err);
		}

		if (org == null) {
			res.redirect('/users/' + req.params.id);
			return;
		}

		var challenges = [];

		for (var i = 0; i < org.challenges.length; i++) {
			Challenge.findOne({ _id: org.challenges[i] }, function(err, challenge) {
				if (err) {
					console.log(err);
				}
				else {
					challenges.push(challenge);
				}
			})
		}

		res.render('org-profile', {
			org: org,
			challenges: challenges
	 	});
	});
});

/* POST to edit profile. */
router.post('/edit-profile', function(req, res, next) {

 	res.render('profile', {

  	});
});


/* GET register page.
router.get('/register', function(req, res, next) {
 	res.render('register');
});
*/

/* POST to register. */
router.post('/register/:mode', function(req, res, next) {

	/* User Registration */
	if (req.params.mode == "user") {
		addUser(req.body, function(id) {
			res.redirect('/');
		});
	}

	/* Organization Registration */
	else if (req.params.mode == "organization") {
		addOrganization(req.body, function(id) {
			res.redirect('/');
		});
	}

	else {
		res.send("Invalid registration mode");
	}

});

/* GET user registration page
router.get('/userreg', function(req, res, next) {
    res.render('userreg');
});

/* POST to user registration page
router.post('/userreg', function(req, res, next) {
    if (req.body.mode == 'user') {
        addUser(req.body, function(id) {
            res.redirect('/');
        //res.send('added User');
        });
    }
    else {
        res.send("Invalid registration mode");
    }
});

/* GET organization registration page
router.get('/orgreg', function(req, res, next) {
    res.render('orgreg');
});

router.post('/orgreg', function(req, res, next) {
    if (req.body.mode == 'organization') {
        addOrganization(req.body, function(id) {
            res.redirect('/');
        });
    }
    else {
        res.send("Invalid registration mode");
    }

});

/* GET user login page
router.get('/userlogin', function(req, res, next) {
    res.send('<form action="/userlogin" method="post"> <div>' + 
            '<label>Username:</label> <input type="text"'+ 
            'name="username"/> </div> <div> <label>Password:</label>'+ 
            '<input type="password" name="password"/> </div>' +
            '<div> <input type="submit" value="Log In"/> </div></form>');
    //res.render('login');
});

/* POST user login
router.post('/userlogin', passport.authenticate('user', {
    successRedirect: '/',
    failureRedirect: '/userlogin'
    //should create failureFlash message telling users wrong password/username
    //combo or someting
}));

/* GET organization login page
router.get('/orglogin', function(req, res, next) {
    res.send('<form action="/orglogin" method="post"> <div>' + 
            '<label>email:</label> <input type="text"'+ 
            'name="email"/> </div> <div> <label>Password:</label>'+ 
            '<input type="password" name="password"/> </div>' +
            '<div> <input type="submit" value="Log In"/> </div></form>');
});

/* POST organization login page
router.post('/orglogin', passport.authenticate('org', {
    successRedirect: '/',
    failureRedirect: '/orglogin'
    //should create failureFlash message telling users wrong password/username
    //combo or someting
}));

*/

/* GET home page. */
router.get('/', function(req, res, next) {
    /*console.log('here');
    //res.render('index');
    if (req.isAuthenticated()) {
        console.log(req.user);
        //res.send("Super secret text!");
        res.render('index');
    }
    else {
        //res.redirect('/login');
        res.render('error', { message: 'r1p y0u br0k3 0ur w3bs1te :('});
    }
    */

    getOrganizations(function(data) {
    	res.render('index', {
    	organizations: data
    	});
    });

});

module.exports = router;
