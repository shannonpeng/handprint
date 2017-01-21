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

/* Maybe move below passport lines to the top later */
//Oauth stuff isn't working I need we need to create constructors for functions?
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
                //password: user.password,
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

            User.register(newUser, user.password, function(err) {
                console.log(err);
                //ask Shannon what this callback was being used for
				callback();
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
                // below line was added
                //password: org.password,
				email: org.email,
				location_name: org.location_name,
				location_zipcode: org.location_zipcode,
				profile_pic_url: org.profile_pic_url,
				description: org.description,
				challenges: []
			});

            Organization.register(newOrg, org.password, function(err) {
                console.log(err);
                //addChallengesToOrg(o._id, org.challenges, function(ids){});
                /* how do we deal with adding challenges directly in this case ???*/
                callback();
            });
            /*
            newOrg.save(function(err, o) {
				addChallengesToOrg(o._id, org.challenges, function (ids){} );
				callback(o._id);
		    });
            */
        }
    });
}


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

/*GET organization dashboard*/

router.get('/dashboard', function(req, res, next) {
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
router.get('/profile', function(req, res, next) {
  res.render('profile');
});

/* GET user registration page */ 
router.get('/userreg', function(req, res, next) {
    res.render('userreg');
});

/* POST to user registration page */
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

/* GET organization registration page */
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

/* GET user login page */
router.get('/userlogin', function(req, res, next) {
    res.send('<form action="/userlogin" method="post"> <div>' + 
            '<label>Username:</label> <input type="text"'+ 
            'name="username"/> </div> <div> <label>Password:</label>'+ 
            '<input type="password" name="password"/> </div>' +
            '<div> <input type="submit" value="Log In"/> </div></form>');
    //res.render('login');
});


/* POST user login */
router.post('/userlogin', passport.authenticate('user', {
    successRedirect: '/',
    failureRedirect: '/userlogin'
    //should create failureFlash message telling users wrong password/username
    //combo or someting
}));

/* GET org login page */
router.get('/orglogin', function(req, res, next) {
    res.send('<form action="/orglogin" method="post"> <div>' + 
            '<label>email:</label> <input type="text"'+ 
            'name="email"/> </div> <div> <label>Password:</label>'+ 
            '<input type="password" name="password"/> </div>' +
            '<div> <input type="submit" value="Log In"/> </div></form>');
});

router.post('/orglogin', passport.authenticate('org', {
    successRedirect: '/',
    failureRedirect: '/orglojhbugin'
    //should create failureFlash message telling users wrong password/username
    //combo or someting
}));



/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('here');
    //res.render('index');
    if (req.isAuthenticated()) {
        console.log(req.user);
        //res.send("Super secret text!");
        res.render('index');
    }
    else {
        //res.redirect('/login');
        res.send('rip');
    }
});

module.exports = router;
