var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var shortId = require('shortid');

var Product = new Schema({
	prodid: {type: String, unique: true, default: shortId.generate},
	url: String,
	urlraw: String,
	name: String,
	lowername : String,
	desc: String, 
	price: Number,
	images: Array,
	store: {
		id: String,
		name: String,
		url: String
	},
	category: {
		main: String,
		sub: String
	},
	sale: { 
		off: String,
		start: Date,
		end: Date
	},
	wishlistedBy: [{
		userid: String,
		date: {type: Date, default: Date.now()}
	}],
	tags: Array,
	related: Array,
	createdOn: {type: Date, default: Date.now()},
	status: {type: String, default: "active"}
});
 
module.exports = mongoose.model('Product', Product);