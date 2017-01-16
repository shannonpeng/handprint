var mongoose = require('mongoose');

var challengeSchema = new mongoose.Schema({
	title: {type: String, required: true},
	start_date: {type: Number, required: true},
	end_date: {type: Number, required: true},
	description: {type: String, required: true},
	location_name: {type: String, required: true},
	location_zipcode: {type: Number, required: true},
	points: {type: Number, required: true},
	category_tags: String[]
});

var Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
