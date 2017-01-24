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

/* Passport */
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

/* Convert dates in Challenge object */

function formatChallenge(c) {

	var challenge = new Object();
	challenge._id = c._id;
	challenge.title = c.title;
	challenge.start_date = (new Date(parseInt(c.start_date))).toDateString();
	challenge.end_date = (new Date(parseInt(c.end_date))).toDateString();
	challenge.description = c.description;
	challenge.location_name = c.location_name;
	challenge.location_zipcode = c.location_zipcode;
	challenge.points = c.points;
	challenge.category_tags = c.category_tags;
	return challenge;

}

/* Get organizations list */

function getOrganizations(callback) {
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
	var users_list = [];
	User.find({}, function(err, users) {
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
				users_list.push(user);
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

/* Get challenges list */

function getChallenges(callback) {
	var challenges_list = [];
	Challenge.find({}, function(err, challenges) {
		if (err) {
			console.log(err);
		}
		else {
			for (var i = 0; i < challenges.length; i++) {
				var challenge = formatChallenge(challenges[i]);
				challenges_list.push(challenge);
			}
			callback(challenges_list);
		}
	});
}
router.get('/challenges-list', function(req, res, next) {
	getChallenges(function(data) {
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
- u: object with user properties
- callback: callback function
RETURNS:
- String: Mongo ObjectID of modified user
*/
function editUser(u, callback) {

	User.findOne({ username: u.username }, function(err, user) {

		if (err) {
			console.log(err);
		}

		if (user == null) {
			console.log("err: No user found with username " + u.username);
		}

		user.name = u.name;
		user.email = u.email;
		user.bio = u.bio;
		user.location_name = u.location_name;
		user.location_zipcode = u.location_zipcode;
		user.profile_pic_url = u.profile_pic_url;
		user.cover_pic_url = u.cover_pic_url;

		user.save(function(err, data) {
			if (err) {
				console.log(err);
			}
			console.log("user " + u.username + " updated!");
			callback(data);
		});

	});

}

/* Delete user
ARGUMENTS:
- u: object with user properties
- callback: callback function
RETURNS:
- String: Mongo ObjectID of deleted user
*/
function deleteUser(u, callback) {

	User.findOne({ username: u.username }, function(err, user) {

		if (err) {
			console.log(err);
		}

		if (user == null) {
			console.log("err: No user found with username " + u.username);
		}

		user.remove(function(err, data) {
			if (err) {
				console.log(err);
			}
			console.log("user " + u.username + "deleted!");
			callback(data);
		});

	});

}

/* Add challenge
ARGUMENTS:
- challenge: object with challenge properties
- callback: callback function
RETURNS:
- String: Mongo ObjectID of newly created challenge
*/
function addChallenge(challenge, callback) {

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
- c: object with challenge properties
- callback: callback function
RETURNS:
- String: Mongo ObjectID of modified challenge
*/
function editChallenge(c, callback) {

	Challenge.findOne({ _id: c._id }, function(err, challenge) {

		if (err) {
			console.log(err);
		}

		if (challenge == null) {
			console.log("err: No challenge found with id " + c._id);
		}

		challenge.title = c.title;
		challenge.start_date = c.start_date;
		challenge.end_date = c.end_date;
		challenge.description = c.description;
		challenge.location_name = c.location_name;
		challenge.location_zipcode = c.location_zipcode;
		challenge.points = c.points;
		challenge.category_tags = c.category_tags;

		challenge.save(function(err, data) {
			if (err) {
				console.log(err);
			}
			console.log("challenge " + c._id + " updated!");
			callback(data);
		});

	});

}

/* Delete challenge
ARGUMENTS:
- c: object with challenge properties
- callback: callback function
RETURNS:
- String: Mongo ObjectID of deleted challenge
*/
function deleteChallenge(c, callback) {

	Challenge.findOne({ _id: c._id }, function(err, challenge) {

		if (err) {
			console.log(err);
		}

		if (challenge == null) {
			console.log("err: No challenge found with id " + c._id);
		}

		challenge.remove(function(err, data) {
			if (err) {
				console.log(err);
			}
			console.log("challenge " + c._id + "deleted!");
			callback(data);
		});

	});

}

/* Add challenges to organization
ARGUMENTS:
- orgID: objectID of organization
- challenges: array of objects, each with challenge properties
- callback: callback function
RETURNS:
- String[]: Array of Mongo ObjectIDs of newly added challenges
- Object: updated Organization object
*/
function addChallengesToOrg(orgID, challenges, callback) {

	Organization.findById(orgID, function (err, org) {

		if (err) {
			console.log(err);
		}

		if (org == null) {
			console.log("err: No org found with org._id " + orgID);
		}

		else {

		  	var ids = [];

			for (var i = 0; i < challenges.length; i++) {
				addChallenge(challenges[i], function(id) {
					org.challenges.push(id);
					org.save();
					ids.push(id);
				});
			}

			callback(ids, org);

		}

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
- o: object with organization properties
- callback: callback function
RETURNS:
- String: Mongo ObjectID of modified organization
*/
function editOrganization(o, callback) {

	Organization.findOne({ orgname: o.orgname }, function(err, org) {

		if (err) {
			console.log(err);
		}

		if (org == null) {
			console.log("err: No org found with orgname " + o.orgname);
		}

		org.name = o.name;
		org.email = o.email;
		org.description = o.description;
		org.location_name = o.location_name;
		org.location_zipcode = o.location_zipcode;
		org.profile_pic_url = o.profile_pic_url;
		org.cover_pic_url = o.cover_pic_url;

		org.save(function(err, data) {
			if (err) {
				console.log(err);
			}
			console.log("org " + o.orgname + " updated!");
			callback(data);
		});

	});
}

/* Delete organization
ARGUMENTS:
- o: object with organization properties
- callback: callback function
RETURNS:
- String: Mongo ObjectID of deleted organization
*/
function deleteOrganization(o, callback) {

	Organization.findOne({ orgname: o.orgname }, function(err, org) {

		if (err) {
			console.log(err);
		}

		if (org == null) {
			console.log("err: No org found with orgname " + o.orgname);
		}

		org.remove(function(err, data) {
			if (err) {
				console.log(err);
			}
			console.log("org " + o.orgname + "deleted!");
			callback(data);
		});

	});

}

/* GET dashboard. */
router.get('/dashboard', function(req, res, next) {

	/* TODO: determine if organization or user */

    /*var reqFields = [];

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
    });*/

    /*

    var username = "tim";

    var challenges = [];

    User.findOne({ username : username },
	    function(err, user) {
	    	getChallenges(function(c) {
		    	challenges = c;
		    	res.render('dashboard', {
			    	user: user,
			    	challenges: challenges
			    });
		    });
		}    	
	);

	*/
	

	var orgname = "bch";

    var challenges = [];

    Organization.findOne({ orgname : orgname },
	    function(err, org) {
	    	getChallenges(function(c) {
		    	res.render('org-dashboard', {
			    	org: org,
			    	challenges: c
			    });
		    });
		}    	
	);
	

    
});

/* GET profile page. */
router.get('/users/:id', function(req, res, next) {

	User.findOne({ username : req.params.id }, function(err, user) {

		if (err) {
			console.log(err);
		}

		if (user == null) {
			Organization.findOne({ orgname: req.params.id }, function(err, org) {
				if (org != null) {
					res.redirect('/organizations/' + req.params.id);
				}
				else {
					res.render('error', { message: 'Not Found'});
				}
				return;
			});
		}

		else {
			var challenges = [];

			for (var i = 0; i < user.challenges.length; i++) {
				Challenge.findOne({ _id: user.challenges[i] }, function(err, challenge) {
					if (err) {
						console.log(err);
					}
					else {
						var c = formatChallenge(challenge);
						challenges.push(c);
					}
				})
			}

			/* HARD CODE FRIENDS FOR NOW */
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

			res.render('profile', {
				user: user,
				challenges: challenges,
				friends: friends
		 	});
		}
		
	});
});

/* GET org profile page. */
router.get('/organizations/:id', function(req, res, next) {

	Organization.findOne({ orgname : req.params.id }, function(err, org) {

		if (err) {
			console.log(err);
		}

		if (org == null) {
			User.findOne({ username: req.params.id }, function(err, user) {
				if (user != null) {
					res.redirect('/users/' + req.params.id);
				}
				else {
					res.render('error', { message: 'Not Found'});
				}
				return;
			});
		}

		else {

			var challenges = [];

			for (var i = 0; i < org.challenges.length; i++) {
				Challenge.findOne({ _id: org.challenges[i] }, function(err, challenge) {
					if (err) {
						console.log(err);
					}
					else if (challenge != null) {
						var c = formatChallenge(challenge);
						challenges.push(c);
					}
				})
			}

			res.render('org-profile', {
				org: org,
				challenges: challenges
		 	});
		}
		
	});
});

/* POST to edit profile. */
router.post('/edit-profile', function(req, res, next) {

	if (req.body.mode == "user") {

		editUser(req.body, function(data) {
			res.render('profile', {
				user: user
  			});
		});

	}

	else if (req.body.mode == "organization") {

		editOrganization(req.body, function(data) {
			res.render('org-profile', {
				org: org
  			});
		});
		
	}
 	
});

/* POST to createChallenge. */
router.post('/createChallenge', function(req, res, next) {

	var c = [req.body.challenge];

	Organization.findOne({ orgname: req.body.orgname }, function(err, org) {
		addChallengesToOrg(org._id, c, function(ids, org) {
	    	getChallenges(function(c) {
		    	res.render('org-dashboard', {
			    	org: org,
			    	challenges: c
			    });
		    });
	    	
		});
	});

});


/* GET login page. */

router.get('/login', function(req, res, next) {
	res.render('login');
})

/* POST to login page. */

router.post('/login/user', passport.authenticate('user', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: false
}));

router.post('/login/organization', passport.authenticate('org', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: false
}));


/* GET register page. */
router.get('/register', function(req, res, next) {
 	res.render('register');
});


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

/* GET home page. */
router.get('/', function(req, res, next) {

    /* TODO: If logged in, send to /dashboard. If not logged in, load standard landing page */
    getOrganizations(function(data) {
    	res.render('index', {
    	organizations: data
    	});
    });

});

module.exports = router;
