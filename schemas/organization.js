var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

var orgSchema = new mongoose.Schema({
	name: {type: String, required: true},
	orgname: {type: String, required: true},
	email: {type: String, required: true},
	location_name: String,
	location_zipcode: String,
	profile_pic_url: {type: String, required: false},
	cover_pic_url: {type: String, required: false},
	description: String,
	challenges: [String]
});

orgSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
var Organization = mongoose.model('Organization', orgSchema);

module.exports = Organization;
