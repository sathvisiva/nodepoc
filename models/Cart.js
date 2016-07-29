var mongoose = require('mongoose');
var shortId = require('shortid');
var Schema = mongoose.Schema; 

var Cart = new Schema({ 
	createdOn: {type: Date, default: Date.now()}, 
	userid: String,
	productid: String,
	quantity: Number,
	status: String
});
 
module.exports = mongoose.model('Cart', Cart);