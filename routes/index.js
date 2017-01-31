var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Challenge = require('../schemas/challenge');
var Account = require('../schemas/account');

var lib = require('./lib');

/* Passport */
passport.use('local', Account.createStrategy());
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));
router.use(session({ secret: 'mydeepestdarkestsecret', resave: 'false', 
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

	if (req.user) {

		if (req.user.mode == 'volunteer') {

			var username = req.user.username;

			var challenges = [];

			Account.findOne({ username: username }, 
				function(err, user) {

					Challenge.find( { /*users: { $any: req.user.friends }  */} , function(err, challenges) {

						if (challenges) {

							var c = [];

				    		for (var i = 0; i < challenges.length; i++ ) {
				    			c.push(lib.formatChallenge(challenges[i]));
				    		}

							res.render('dashboard', {
								account: req.user,
								user: user,
								challenges: c
							}, function(err, data) {
								if (err) {
									console.log(err);
								}
								else {
									res.send(data);
									console.log("VOLUNTEER DASHBOARD RENDERED");
								}
							});
						}

					});
				}
			);
		}

		else if (req.user.mode == 'organization') {

			var username = req.user.username;

			var challenges = [];

			Account.findOne({ username : username },
			    function(err, org) {

			    	Challenge.find( { organization: org._id }, function(err, challenges) {

			    		var c = [];

			    		for (var i = 0; i < challenges.length; i++ ) {
			    			c.push(lib.formatChallenge(challenges[i]));
			    		}

			    		res.render('org-dashboard', {
			    			account: req.user,
					    	org: org,
					    	challenges: c
					    }, function(err, data) {
					    	if (err) {
								console.log(err);
							}
							else {
								res.send(data);
								console.log("ORGANIZATION DASHBOARD RENDERED");
							}
					    });
						
					});

			});
		}
	}

	else {
		res.redirect('/');
	}
    
});

/* GET profile page. */
router.get('/profile/:id', function(req, res, next) {

	Account.findOne({ username : req.params.id }, function(err, account) {

		if (err) {
			console.log(err);
		}

		if (account == null) {
			res.render('error', { message: 'Not Found'});
		}

		else {

			var challenges = [];

			if (account.challenges.length > 0) {

				for (var i = 0; i < account.challenges.length; i++) {

					Challenge.findOne({ _id: account.challenges[i] }, function(err, challenge) {

						if (err) {
							console.log(err);
						}

						else if (challenge) {
							var c = lib.formatChallenge(challenge);
							challenges.push(c);
						}

					});
				}
			}

			if (account.mode == "volunteer") {
				res.render('profile', {
					account: req.user,
					user: account,
					challenges: challenges,
					friends: account.friends
		 		});
			}

			else if (account.mode == "organization") {
				res.render('org-profile', {
					account: req.user,
					org: account,
					challenges: challenges
		 		});
			}

			
		}
		
	});
});

/* POST to edit profile. */
router.post('/edit-profile', function(req, res, next) {

	lib.editAccount(req.body, function(err, data) {
		if (err) {
			console.log(err);
		}
		else {
			res.render('profile', {
				account: req.user,
				user: user
			});
		}
	});

});

/* POST to createChallenge. */
router.post('/createChallenge', function(req, res, next) {

	var org_id = req.user._id;
	var c = [req.body.challenge];

	Account.findOne({ _id: org_id }, function(err, org) {

		lib.addChallengesToOrg(org._id, c, function(ids, org) {
	    	lib.getChallenges(function(c) {
		    	res.render('org-dashboard', {
		    		account: req.user,
			    	org: org,
			    	challenges: c
			    });
		    });
		});

	});

});

/* POST to completeChallenge. */
router.post('/completeChallenge', function(req, res, next) {

	var cID = req.body.id;
	var awardPoints = 0;

	Challenge.findOne({_id: cID }, function(err, challenge) {

		if (challenge == null) {
			console.log("ERROR: NO CHALLENGE FOUND WITH ID " + cID);
			return;
		}


		else {

			if ($.inArray(req.user._id, challenge.users ) >= 0) {
				// then user already completed this challenge
				res.send('You have already completed this challenge!');
			}

			awardPoints = parseInt(challenge.points);

			challenge.users.push(req.user._id);
			challenge.save(function(err, data) {
				if (err) {
					console.log(err);
				}
			});

			Account.findOne({ username: req.user.username }, function(err, user) {

				if (err) {
					console.log(err);
				}

				if (user == null) {
					console.log("NO USER FOUND WITH USERNAME " + req.user.username);
					return;
				}

				else {

					user.points = user.points + awardPoints;
					user.challenges.push(cID);

					user.save(function(err) {
						if (err) {
							console.log(err);
						}
						else {
							res.send('Challenge marked as complete!')
						}
					})

				}
			});
		}
	});
	
		
});

/* GET login page. */
router.get('/login', function(req, res, next) {
	res.render('login');
})

/* POST to login page */
router.post('/login',
  passport.authenticate('local', { failureRedirect: '/' }), function(req, res) {
  	res.redirect('/dashboard')
  });

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

/* POST to register. */
router.post('/register', function(req, res, next) {
	lib.addAccount(req.body, function(err, data) {
		if (err) {
			console.log(err);
		}
		else {
			res.render('login', { message: 'Your account has been created! Login below to continue.'});
		}
	});
})

/* GET home page. */
router.get('/', function(req, res, next) {

	if (req.user) {
		res.redirect('/dashboard');
	}
	else { 
		lib.getOrganizations(function(orgs) {
			res.render('index', {
				organizations: orgs
			});
		});
	}
    
});

module.exports = router;
