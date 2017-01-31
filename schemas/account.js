var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var accountSchema = new mongoose.Schema({
    mode: {type:String, required: true},
    name: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    bio: {type: String},
    location: {type: String, required: true},
    profile_pic_url: {type: String, required: true},
    cover_pic_url: {type: String, required: true},
    friends: [String], // only for users
    challenges: [String],
    points: {type: Number}, // only for users
    level: {type: Number}   // only for users
});

accountSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
var accountSchema = mongoose.model('account', accountSchema);

module.exports = accountSchema;
