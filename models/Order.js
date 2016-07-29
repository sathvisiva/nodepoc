var mongoose = require('mongoose');
var shortId = require('shortid');
var Schema = mongoose.Schema; 

var Order = new Schema({
	orderId: {type: String, unique: true, default: shortId.generate},
	createdOn: {type: Date, default: Date.now()}, 
});
 
module.exports = mongoose.model('Order', Order);