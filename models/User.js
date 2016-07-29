var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var shortId = require('shortid');

var User = new Schema({ 
	userid: {type: String, unique: true, default: shortId.generate},
	refid: Number,
	url: String,
	username: String,
	password: String,
	fullname: String,
	profile: {
		address1: String,
		address2: String,
		address3: String,
		number: String
	},
	store: {
		url: String,
		urlraw: String,
		name: String,
		lowername : String,
		description: String,
		theme: String,
		avatar: String
	},
	followed: [{
		userid: String,
		date: {type: Date, default: Date.now()}
	}],
	followers: [{
		userid: String,
		date: {type: Date, default: Date.now()}
	}],
	wishlist: [{
		productid: String,
		date: {type: Date, default: Date.now()}
	}],
	registrationToken: String,
	resetPasswordToken: String,
  	resetPasswordExpires: Date,
  	createdOn: {type: Date, default: Date.now()}
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);