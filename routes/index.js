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

/* GET challenges page */		
router.get('/challenges', function(req, res, next) {		
	lib.getChallenges( function(challenges) {		
		if (err) {		
			console.log(err);		
		}		
		if (challenges) {			
			res.render('challenges', {challenges: challenges});		
		}		
	})		
})				

/* GET dashboard. */
router.get('/dashboard', function(req, res, next) {

	if (req.user) {

		if (req.user.mode == 'volunteer') {

			var username = req.user.username;

			Account.findOne({ username: username }, 

				function(err, user) {

					if (err) {
						console.log(err);
					}

					Challenge.find({users: { $elemMatch: { $in : req.user.friends } }}, function(err, challenges) {

						if (err) {
							console.log(err);
						}

						else if (challenges) {

							if (challenges.length == 0) {
								res.render('dashboard', {
									account: req.user,
									user: user,
									challenges: []
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

							else {

							var challenges_list = [];

							for (var i = 0; i < challenges.length; i++) {

								challenges[i].completed = challenges[i].users.indexOf(req.user._id.toString()) >= 0;

								lib.formatChallenge(challenges[i], function(c) {
									
									challenges_list.push(c);

									if (challenges_list.length == challenges.length) {

										console.log(challenges_list);

										res.render('dashboard', {
											account: req.user,
											user: user,
											challenges: challenges_list
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

						}
							
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

			    		if (challenges.length == 0) {
							res.render('org-dashboard', {
								account: req.user,
								org: org,
								challenges: []
							}, function(err, data) {
								if (err) {
									console.log(err);
								}
								else {
									res.send(data);
									console.log("ORGANIZATION DASHBOARD RENDERED");
								}
							});
						}

			    		var challenges_list = [];

			    		for (var i = 0; i < challenges.length; i++) {

								lib.formatChallenge(challenges[i], function(c) {

									challenges_list.push(c);

									if (challenges_list.length == challenges.length) {

										res.render('org-dashboard', {
							    			account: req.user,
									    	org: org,
									    	challenges: challenges_list
									    }, function(err, data) {
									    	if (err) {
												console.log(err);
											}
											else {
												res.send(data);
												console.log("ORGANIZATION DASHBOARD RENDERED");
											}
									    });

									}

								});

							}

			    		
						
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

							lib.formatChallenge(challenge, function(c) {
								challenges.push(c);
							});
							
						}

					});
				}
			}

			var friends = [];

			if (account.friends.length > 0) {

				for (var i = 0; i < account.friends.length; i++) {


					Account.findOne({ _id: account.friends[i] }, function(err, friend) {

						//console.log(friend);

						if (err) {
							console.log(err);
						}

						else if (friend) {

							console.log(friend);

							var f = lib.exportVolunteer(friend);

							friends.push(f);
							
						}

					});
				}

			}

			if (req.user) {

				var following = req.user.friends.indexOf(account._id) >= 0;
				var notSelf = !(account.username == req.user.username);
				console.log(account.username + " vs " + req.user.username);
				if (account.mode == "volunteer") {
					res.render('profile', {
						account: req.user,
						user: account,
						challenges: challenges,
						friends: friends,
						following: following,
						notSelf: notSelf
			 		});
				}
				else if (account.mode == "organization") {
					res.render('org-profile', {
						account: req.user,
						org: account,
						challenges: challenges,
						notSelf: notSelf
			 		});
				}
			}
			else {

				if (account.mode == "volunteer") {
					res.render('profile', {
						account: req.user,
						user: account,
						challenges: challenges,
						friends: friends,
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
			
		}
		
	});
});

/* GET edit profile. */

router.get('/edit-profile', function(req, res, next) {
	if (!(req.user)) {
		res.redirect('/');
	}
	else {
		res.render('edit-profile', {
			account: req.user
		});
	}
});


/* POST to edit profile. */
router.post('/edit-profile', function(req, res, next) {

	var o = req.body.profile;
	o.username = req.user.username;

	console.log(o);

	lib.editAccount(o, function(err, data) {

		if (err) {
			console.log(err);
		}

		else {
			res.redirect('/');
		}

	})
 	
});

/* POST to delete account */
router.post('/delete-account', function(req, res, next) {

	lib.deleteAccount(req.user, function(err, data) {
		res.redirect('/');
	});

})


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

	var cID = req.body.id; // challenge ID
	var awardPoints = 0; //initialize awardPoints

	console.log(req.user.username + ' has completed challenge ' + cID);

	Challenge.findOne({_id: cID }, function(err, challenge) {

		if (challenge == null) {
			console.log("ERROR: NO CHALLENGE FOUND WITH ID " + cID);
			return;
		}

		else {

			if (challenge.users.indexOf(req.user._id) >= 0) { // check if user already completed this challenge
				res.send('You have already completed this challenge!');
				return;
			}

			challenge.users.push(req.user._id); // add user's ID to list of users that completed the challenge then save challenge

			challenge.save(function(err, data) {
				if (err) {
					console.log(err);
				}
			});

			Account.findOne({ _id: req.user._id }, function(err, user) { // proceed to find user that is logged in

				if (err) {
					console.log(err);
				}

				if (user == null) {
					console.log("NO USER FOUND WITH USERNAME " + req.user.username);
					return;
				}

				else {

					awardPoints = parseInt(challenge.points); // set awardPoints to challenge's points

					user.points = user.points + awardPoints; // add points to user
					user.level = lib.pointsToLevel(user.points); // update user level

					user.challenges.push(cID); // add challengeID to user's list of completed challenges

					user.save(function(err) {
						if (err) {
							console.log(err);
						}
						else {
							res.send('Challenge marked as complete!');
						}
					})

				}
			});
		}
	});
	
		
});

/* POST to follow user. */
router.post('/followUser', function(req, res, next) {

	var targetId = req.body.id;

	Account.findOne({ _id: req.user._id }, function(err, account) {

		if (err) {
			console.log(err);
		}
		else if (account) {

			var index = account.friends.indexOf(targetId);
			if (index >= 0) { // user is already following this target user, proceed to unfollow
				account.friends.splice(index, 1);
			}
			else {
				account.friends.push(targetId);
			}
			account.save(function(err, data) {
				if (err) {
					console.log(err);
				}
				else {
					res.send('Following status updated!');
				}
			})

		}
	})

});

/* POST to delete challenge. */
router.post('/deleteChallenge', function(req, res, next) {

	var id = req.body.id;

	Challenge.findOne({ _id: id}, function(err, challenge) {

		if (err) {
			console.log(err);
		}
		else if (challenge) {

			if (!(challenge.organization == req.user._id)) {
				res.send('Error: Delete challenge not authorized');
			}

			else {
				lib.deleteChallenge(challenge, function(data) {
					res.send('Challenge deleted!');
				})
			}
			
		}
	})

});

/* GET login page. */
router.get('/login', function(req, res, next) {
	res.render('login');
})

/* POST to login page */
router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
  	res.redirect('/dashboard');
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
});

/* POST to search users page */

router.post('/search', function(req, res, next) {

	Account.find({ $and: [ { mode: 'volunteer'}, { $or: [ { username: {$regex : ".*" + req.body.searchItem + ".*"} }, { name: {$regex : ".*" + req.body.searchItem + ".*"} } ] }] }
, function(err, volunteers) {

		if (err) {
			console.log(err);
		}

		else if (volunteers) {

			Account.find({ $and: [ { mode: 'organization'}, { $or: [ { username: {$regex : ".*" + req.body.searchItem + ".*"} }, { name: {$regex : ".*" + req.body.searchItem + ".*"} } ] }] }
, function(err, organizations) {

				if (err) {
					console.log(err);
				}

				else if (organizations) {
					console.log(req.user);
					res.render('search', {
						account: req.user,
						searchItem: req.body.searchItem,
						volunteers: volunteers,
						organizations: organizations
					});

				}

			});

		}

	});

});

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
