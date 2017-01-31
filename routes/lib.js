var Account = require('../schemas/account');
var Challenge = require('../schemas/challenge');

var lib = {

	/* Map points to level */
	pointsToLevel: function(points) {
		return Math.floor(points / 100) + 1;
	},

	/* Clean up volunteer data */

	exportVolunteer: function(v) {

		var volunteer = {};

		volunteer._id = v._id;
		volunteer.name = v.name;
		volunteer.username = v.username;
		volunteer.profile_pic_url = v.profile_pic_url;
		volunteer.cover_pic_url = v.cover_pic_url;
		volunteer.level = v.level;
		volunteer.points = v.points;

		return volunteer;

	},

	/* Convert dates in given Challenge object */

	formatChallenge: function(c, callback) {

		var challenge = {};

		challenge._id = c._id;
		challenge.title = c.title;
		challenge.start_date = (new Date(parseInt(c.start_date))).toDateString();
		challenge.end_date = (new Date(parseInt(c.end_date))).toDateString();
		challenge.description = c.description;
		challenge.location = c.location;
		challenge.points = c.points;
		challenge.category_tags = c.category_tags;

		Account.find({ _id: c.organization, mode: 'organization'}, function(err, orgs) {

			if (err) {
				console.log(err);
				return;
			}

			else if (orgs) {

				challenge.organization = orgs[0];
				
				Account.find({ _id: { $in: c.users }}, function(err, volunteers) {

					if (err) {
						console.log(err);
						return;
					}

					else if (volunteers) {

						challenge.users = [];

						for (var i = 0; i < volunteers.length; i++) {
							challenge.users.push(lib.exportVolunteer(volunteers[i]));
						}

						callback(challenge);

					}

				});

			}

		});

	},

	/* Get organizations list */

	getOrganizations: function(callback) {
		var orgs_list = [];
		Account.find({ mode: 'organization' }, function(err, orgs) {
			if (err) {
				console.log(err);
			}
			else {
				for (var i = 0; i < orgs.length; i++) {
					var org = {};
					org.name = orgs[i].name;
					org.username = orgs[i].username;
					org.bio = orgs[i].bio;
					org.location = orgs[i].location;
					org.profile_pic_url = orgs[i].profile_pic_url;
					orgs_list.push(org);
				}
				callback(orgs_list);
			}
		});
	},

	/* Get volunteers list */

	getVolunteers: function(callback) {
		var volunteers_list = [];
		Account.find({ mode: 'volunteer'}, function(err, volunteers) {
			if (err) {
				console.log(err);
			}
			else {
				for (var i = 0; i < volunteers.length; i++) {
					var volunteer = {};
					volunteer.username = volunteers[i].username;
					volunteer.bio = volunteers[i].bio;
					volunteer.location = volunteers[i].location;
					volunteer.points = volunteers[i].points;
					volunteer.level = volunteers[i].level;
					volunteers.push(volunteer);
				}
				callback(volunteers_list);
			}
		});
	},

	/* Get challenges list */

	getChallenges: function(callback) {
		

		Challenge.find({}, function(err, challenges) {

			if (err) {
				console.log(err);
				return;
			}

			else if (challenges) {

				var challenges_list = [];

				for (var i = 0; i < challenges.length; i++) {

					lib.formatChallenge(challenges[i], function(c) {

						challenges_list.push(c);

						if (i == challenges.length - 1) {
							callback(challenges_list);
						}


					});

					

				}


			}

		});

	},

	/* Add account
	ARGUMENTS:
	- account: object with account properties
	- callback: callback function
	RETURNS:
	- String: Error Message (undefined if no error)
	- String: Mongo ObjectID of newly created account
	*/
	addAccount: function(account, callback) {

		Account.find({ username: account.username }, function(err, accounts) {

			if (err) {
				console.log(err);
			}

			// if no account (either organization or volunteer) exists with the supplied username

			if (accounts.length == 0) {

				var newAccount = new Account({
					mode: account.mode,
					username: account.username,
					name: account.name,
					email: account.email,
					bio: account.bio,
					location: account.location,
					profile_pic_url: '/images/default_profile_picture.jpg',
					cover_pic_url: '/images/default_cover_picture.jpg',
					challenges: []
				});

				if (account.mode == 'volunteer') {

					/* TODO: GET FRIENDS FROM FACEBOOK */
					var friends = [];

					newAccount.friends = friends;
					newAccount.points = 1;
					newAccount.level = 1;

				}

				Account.register(newAccount, account.password, function(err) {

					if (err) {
						console.log(err);
					}

					console.log("ACCOUNT " + account.username + " CREATED");

					callback(null, newAccount._id);

				});
			}
			else {
				callback("ERROR: USERNAME ALREADY EXISTS", null);
			}
		});

	},


	/* Edit account
	ARGUMENTS:
	- u: object with account properties
	- callback: callback function
	RETURNS:
	- String: Error message (undefined if no error)
	- String: Mongo ObjectID of modified account
	*/
	editAccount: function(u, callback) {

		Account.findOne({ username: u.username }, function(err, account) {

			if (err) {
				console.log(err);
			}

			if (account == null) {
				callback("ERROR: NO ACCOUNT FOUND WITH USERNAME " + u.username, null);
			}

			else {
				account.name = u.name;
				account.email = u.email;
				account.bio = u.bio;
				account.location = u.location;
				account.profile_pic_url = u.profile_pic_url;
				account.cover_pic_url = u.cover_pic_url;
			}

			account.save(function(err, data) {
				if (err) {
					console.log(err);
				}
				console.log("ACCOUNT " + u.username + " UPDATED");
				callback(null, data);
			});

		});

	},

	/* Delete account
	ARGUMENTS:
	- u: object with account properties
	- callback: callback function
	RETURNS:
	- String: Error message (undefined if no error)
	- String: Mongo ObjectID of deleted account
	*/
	deleteAccount: function(u, callback) {

		Account.findOne({ username: u.username }, function(err, account) {

			if (err) {
				console.log(err);
			}

			if (account == null) {
				callback("ERROR: NO ACCOUNT FOUND WITH USERNAME " + u.username, null);
			}

			account.remove(function(err, data) {
				if (err) {
					console.log(err);
				}
				console.log("ACCOUNT " + u.username + "DELETED");
				callback(null, data);
			});

		});

	},

	/* Add challenge
	ARGUMENTS:
	- orgID: Mongo ObjectID of organization that created the challenge
	- challenge: object with challenge properties
	- callback: callback function
	RETURNS:
	- String: Error message (undefined if no error)
	- String: Mongo ObjectID of newly created challenge
	*/
	addChallenge: function(orgID, challenge, callback) {

		var c = new Challenge({
			organization: orgID,
			title: challenge.title,
			start_date: challenge.start_date,
			end_date: challenge.end_date,
			description: challenge.description,
			location: challenge.location,
			points: challenge.points,
			category_tags: challenge.category_tags,
		});

		c.save(function(err, c) {
			if (err) {
				console.log(err);
				callback(err, null);
			}
			callback(null, c._id);
		});

	},

	/* Edit challenge
	ARGUMENTS:
	- c: object with challenge properties
	- callback: callback function
	RETURNS:
	- String: Error message (undefined if no error)
	- String: Mongo ObjectID of modified challenge
	*/
	editChallenge: function(c, callback) {

		Challenge.findOne({ _id: c._id }, function(err, challenge) {

			if (err) {
				console.log(err);
			}

			if (challenge == null) {
				callback("ERROR: NO CHALLENGE FOUND WITH ID " + c._id, null);
			}

			challenge.title = c.title;
			challenge.start_date = c.start_date;
			challenge.end_date = c.end_date;
			challenge.description = c.description;
			challenge.location = c.location;
			challenge.points = c.points;
			challenge.category_tags = c.category_tags;

			challenge.save(function(err, data) {
				if (err) {
					console.log(err);
				}
				console.log("CHALLENGE " + c._id + " UPDATED");
				callback(null, data);
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
				callback("ERROR: NO CHALLENGE FOUND WITH ID " + c._id);
			}

			challenge.remove(function(err, data) {
				if (err) {
					console.log(err);
				}
				console.log("CHALLENGE " + c._id + " DELETED");
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

		Account.findOne({ _id: orgID }, function (err, org) {

			if (err) {
				console.log(err);
			}

			if (org == null) {
				callback("ERROR: NO ORGANIZATION FOUND WITH ID " + orgID);
			}

			else {

			  	var ids = [];

			  	if (challenges) {

			  		for (var i = 0; i < challenges.length; i++) {
						lib.addChallenge(orgID, challenges[i], function(err, id) {
							if (err) {
								console.log(err);
							}
							else {
								org.challenges.push(id);
								ids.push(id);
								org.save(function(err, data) {
									if (err) {
										console.log(err);
									}
								});
							}
						});
					}

			  	}
				callback(ids, org);
			}

		});

	}

};

module.exports = lib;