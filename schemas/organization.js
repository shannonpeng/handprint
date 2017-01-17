var mongoose = require('mongoose');

var orgSchema = new mongoose.Schema({
	name: {type: String, required: true},
	email: {type: String, required: true},
	location_name: String,
	location_zipcode: Number,
	profile_pic_url: {type: String, required: true},
	description: String,
	challenges: [String]
});

var Organization = mongoose.model('Organization', orgSchema);

module.exports = Organization;