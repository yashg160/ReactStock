var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    googleId: String,
    name: {
        given: String,
        family: String
    },
    imageUrl: String,
    email: String,
    pictures: [String],
    accessToken: String
});

var User = mongoose.model('User', UserSchema, 'Users');

module.exports = User;