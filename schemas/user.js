var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: {type: String, required: true, index: { unique: true }},
	name: {type: String, required: true},
	email: {type: String, required: true},
	bio: String,
	location_name: String,
	location_zipcode: Number,
	profile_pic_url: {type: String, required: true},
	friends: [String],
	challenges: {
		ongoing: [String],
		past: [String]
	},
	points: {type: Number, required: true},
	level: {type: Number, required: true}
});

var User = mongoose.model('User', userSchema);

module.exports = User;
