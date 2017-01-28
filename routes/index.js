var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../schemas/user');
var Challenge = require('../schemas/challenge');
var Organization = require('../schemas/organization');
var allUser = require('../schemas/allUser');

var lib = require('./lib');

/* Passport */
passport.use('local', allUser.createStrategy());
passport.serializeUser(allUser.serializeUser());
passport.deserializeUser(allUser.deserializeUser());

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

/* GET organizations list. */
router.get('/organizations-list', function(req, res, next) {
	lib.getOrganizations(function(data) {
		res.send(data);
	})
});

/* GET users list. */
router.get('/users-list', function(req, res, next) {
	lib.getUsers(function(data) {
		res.send(data);
	})
});

/* GET challenges list. */
router.get('/challenges-list', function(req, res, next) {
	lib.getChallenges(function(data) {
		res.send(data);
	})
});

/* GET dashboard. */
router.get('/dashboard', function(req, res, next) {
	console.log('in dashboard');
	console.log(req.user);
	if (req.user) {
		if (req.user.mode == 'volunteer') {
			var username = req.user.username;

			var challenges = [];

			allUser.findOne({username: username}, 
				function(err, user) {
					lib.getChallenges(function(c) {
						challenges = c;
						res.render('dashboard', {
							user: user,
							challenges: challenges
						}, console.log('callback of res.render'));
					});
				}
			);
		}

		else if (req.user.mode == 'organization') {
			var orgname = req.user.name;

			var challenges = [];

			allUser.findOne({ name : orgname },
		    function(err, org) {
		    	lib.getChallenges(function(c) {
			    	res.render('org-dashboard', {
				    	org: org,
				    	challenges: c
				    });
			    });
			});
		}

		else {
			res.send('user could not be found');
		}
	}
	
	/* OLD REG STUFF; THIS IS FUCKED UP BUT I DIDN'T WANNA DELETE */
	/*
	if (req.local) {
		console.log('req.user is ' + req.local);
		console.log('req.user.username is ' + req.local.username);
		var username = req.local.username;

	    var challenges = [];

	    User.findOne({ username : username },
		    function(err, user) {
		    	console.log('in callback function');
		    	lib.getChallenges(function(c) {
		    		console.log('in lib.getChallenges');
			    	challenges = c;
			    	res.render('dashboard', {
				    	user: user,
				    	challenges: challenges
				    }, console.log('callback of res.render'));
					//res.render('dashboard');
			    });
			}    	
		);
		
	}

	else if (req.org) {

		var orgname = req.org;

	    var challenges = [];

	    Organization.findOne({ orgname : orgname },
		    function(err, org) {
		    	lib.getChallenges(function(c) {
			    	res.render('org-dashboard', {
				    	org: org,
				    	challenges: c
				    });
			    });
			}    	
		);

	}

	else {
		res.redirect('/');
	}
	*/

    
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
						var c = lib.formatChallenge(challenge);
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
						var c = lib.formatChallenge(challenge);
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

		lib.editUser(req.body, function(data) {
			res.render('profile', {
				user: user
  			});
		});

	}

	else if (req.body.mode == "organization") {

		lib.editOrganization(req.body, function(data) {
			res.render('org-profile', {
				org: org
  			});
		});
		
	}
 	
});

/* POST to createChallenge. */
router.post('/createChallenge', function(req, res, next) {
	console.log(req.org);
	var c = [req.body.challenge];

	Organization.findOne({ orgname: req.body.orgname }, function(err, org) {
		lib.addChallengesToOrg(org._id, c, function(ids, org) {
	    	lib.getChallenges(function(c) {
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

/* POST to login page */
router.post('/login', passport.authenticate('local', {
	successRedirect: '/dashboard',
	failureRedirect: '/register',
	failureFlash: false
}));

/* OLD POST to login page. */

/*
router.post('/login/user', passport.authenticate('user'), function(req, res) {
	//accountName = req.body.username;
	console.log('from /login/user req.user is ' + req.user);
    res.redirect('/dashboard');
	//console.log(accountName);
});
*/

/*
router.post('/login/user', passport.authenticate('user'), function(req, res) {
	//accountName = req.body.username;
	console.log('from /login/user req.user is ' + req.user);
    res.redirect('/dashboard');
	//console.log(accountName);
});
*/


/* OLD POST to login page */
/*
router.post('/login/user', function(req, res, next) {
  	passport.authenticate('user', function(err, user, info) {
    if (err) { 
    	return next(err); 
    }
    if (!user) {
    	return res.redirect('/login'); 
    }
    req.logIn(user, function(err) {
      if (err) { 
      	return next(err); 
      }
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});

router.post('/login/organization', passport.authenticate('org'), function(req, res) {
	console.log('as;dkfja;sdjk');
	console.log('req is' + req.org);
	//accountName = req.body.email;
    res.redirect('/dashboard');
	//console.log(accountName);
});
*/

/* GET logout */
router.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		res.redirect('/');
	});
});

/* GET register page. */
router.get('/register', function(req, res, next) {
 	res.render('register');
});

router.post('/register', function(req, res, next) {
	// moved here from lib.js
	console.log('signed up');
	var newUser = new allUser({
		mode: req.body.mode,
		name: req.body.name,
		username: req.body.username,
		email: req.body.email
	});

	allUser.register(newUser, req.body.password, function(err) {
	});
	//should redirect to login after login starts working
	res.redirect('/login');
	//lib.addAllUser(req.body, function(id) {
		//console.log(req.body);
		//return res.redirect('/dashboard');
		//accountEmail = req.user.email;
	//});
})


/* OLD POST to register. */
/*
router.post('/register/:mode', function(req, res, next) {

	/* User Registration
	if (req.params.mode == "user") {
		lib.addUser(req.body, function(id) {
			accountName = req.body.username;
			res.redirect('/dashboard');
		});
	}

	/* Organization Registration
	else if (req.params.mode == "organization") {
		lib.addOrganization(req.body, function(id) {
			accountName = req.body.email;
			res.redirect('/dashboard');
		});
	}

	else {
		res.send("Invalid registration mode");
	}

});
*/


/* GET home page. */
router.get('/', function(req, res, next) {

	if (req.user || req.org) {
		res.redirect('/dashboard');
	}
	else {
		lib.getOrganizations(function(data) {
			res.render('index', {
				organizations:data
			});
		});
	}
    

});

module.exports = router;
