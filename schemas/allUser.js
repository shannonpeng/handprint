var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var allUserSchema = new mongoose.Schema({
    mode: {type:String, required:true},
    name: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    bio: {type: String}, // only for users
    location_name: String, 
    location_zipcode: String,
    profile_pic_url: {type: String, required: false},
    cover_pic_url: {type: String, required: false},
    friends: [String], // only for users
    description: String, // only for organizations
    challenges: [String],
    points: {type: Number}, /* only for users, need to put check in code
                             * to make sure its given */
    level: {type: Number} /* only for users, need to put check in code
                           * to make sure its given */
});

allUserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
var allUser = mongoose.model('allUser', allUserSchema);

module.exports = allUser;
