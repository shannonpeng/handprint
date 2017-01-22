var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
	username: {type: String, required: true, index: { unique: true }},
	name: {type: String, required: true},
	email: {type: String, required: true},
	bio: String,
	location_name: String,
	location_zipcode: String,
	profile_pic_url: {type: String, required: true},
	cover_pic_url: {type: String, required: true},
	friends: [String],
	challenges: [String],
	points: {type: Number, required: true},
	level: {type: Number, required: true}
});

userSchema.plugin(passportLocalMongoose);
var User = mongoose.model('User', userSchema);

module.exports = User;
