'use strict'

var mongoose = require('mongoose');
//var	Schema = Schema;

var UserSchema = mongoose.Schema({
	name: String,
	surname: String,
	email: String,
	password: String,
	role: String,
	image: String
});
var UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel
