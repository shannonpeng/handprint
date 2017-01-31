var User = require('../schemas/user');
var Challenge = require('../schemas/challenge');
var Organization = require('../schemas/organization');
var allUser = require('../schemas/allUser');

var lib = {

	/* Convert dates in Challenge object */

	formatChallenge: function(c) {

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

	},

	/* Get organizations list */

	getOrganizations: function(callback) {
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
	},

	/* Get users list */

	getUsers: function(callback) {
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
	},

	/* Get challenges list */

	getChallenges: function(callback) {
		var challenges_list = [];
		Challenge.find({}, function(err, challenges) {
			if (err) {
				console.log(err);
			}
			else {
				for (var i = 0; i < challenges.length; i++) {
					var challenge = lib.formatChallenge(challenges[i]);
					challenges_list.push(challenge);
				}
				callback(challenges_list);
			}
		});
	},

	/* Add user
	ARGUMENTS:
	- user: object with user properties
	- callback: callback function
	RETURNS:
	- String: Mongo ObjectID of newly created user
	*/
	addUser: function(user, callback) {
		allUser.find({ username: user.username }, function(err, users) {

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
					points: 1,
					level: 1
				});

				allUser.register(newUser, user.password, function(err) {
					if (err) {
						console.log(err);
					}
					callback(newUser._id);
				});
			}
		});
	},

	/* Edit user
	ARGUMENTS:
	- u: object with user properties
	- callback: callback function
	RETURNS:
	- String: Mongo ObjectID of modified user
	*/
	editUser: function(username, u, callback) {

		var username = req.user.username;
		User.findOne({username:username}, function(err, user) {
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

		/*
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
		*/

	},

	/* Delete user
	ARGUMENTS:
	- u: object with user properties
	- callback: callback function
	RETURNS:
	- String: Mongo ObjectID of deleted user
	*/
	deleteUser: function(u, callback) {

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

	},

	/* Add challenge
	ARGUMENTS:
	- challenge: object with challenge properties
	- callback: callback function
	RETURNS:
	- String: Mongo ObjectID of newly created challenge
	*/
	addChallenge: function(challenge, callback) {

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

	},

	/* Edit challenge
	ARGUMENTS:
	- c: object with challenge properties
	- callback: callback function
	RETURNS:
	- String: Mongo ObjectID of modified challenge
	*/
	editChallenge: function(c, callback) {

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

	},

	/* Delete challenge
	ARGUMENTS:
	- c: object with challenge properties
	- callback: callback function
	RETURNS:
	- String: Mongo ObjectID of deleted challenge
	*/
	deleteChallenge: function(c, callback) {

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

	},

	/* Add challenges to organization
	ARGUMENTS:
	- orgID: objectID of organization
	- challenges: array of objects, each with challenge properties
	- callback: callback function
	RETURNS:
	- String[]: Array of Mongo ObjectIDs of newly added challenges
	- Object: updated Organization object
	*/
	addChallengesToOrg: function(orgID, challenges, callback) {

		allUser.findById(orgID, function (err, org) {

			if (err) {
				console.log(err);
			}

			if (org == null) {
				console.log("err: No org found with org._id " + orgID);
			}

			else {

			  	var ids = [];

			  	if (challenges) {
			  		for (var i = 0; i < challenges.length; i++) {
						lib.addChallenge(challenges[i], function(id) {
							org.challenges.push(id);
							org.save();
							ids.push(id);
						});
					}
			  	}

				callback(ids, org);

			}

		});

	},

	/* Add organization
	ARGUMENTS:
	- org: object with organization properties
	- callback: callback function
	RETURNS:
	- String: Mongo ObjectID of newly created organization
	*/
	addOrganization: function(org, callback) {
		
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
					lib.addChallengesToOrg(newOrg._id, org.challenges, function (ids) {});
					callback(newOrg._id);
				});
			}
		});

	},

	/* Edit organization
	ARGUMENTS:
	- o: object with organization properties
	- callback: callback function
	RETURNS:
	- String: Mongo ObjectID of modified organization
	*/
	editOrganization: function(o, callback) {

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
	},

	/* Delete organization
	ARGUMENTS:
	- o: object with organization properties
	- callback: callback function
	RETURNS:
	- String: Mongo ObjectID of deleted organization
	*/
	deleteOrganization: function(o, callback) {

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

};

module.exports = lib;