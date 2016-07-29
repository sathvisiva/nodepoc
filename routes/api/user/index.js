var express = require('express');
var router = express.Router();
var User = require('../../../models/User');
var Cart = require('../../../models/Cart');
var crypto = require('crypto'); 
var async = require('async'); 
var passport = require('passport');
var nodemailer = require('nodemailer'); 
var jwt = require('jsonwebtoken');
var secretmonster = 'meanstartedhahahaha';
var User = require('../../../models/User');  
var _ = require('lodash');

router.get('/me', function(req, res){  
	res.json(req.decoded) 
}); 

router.get('/refresh', function(req, res){  
	User.findById(req.decoded.user._id, function(err, objUser){  
		if(err){
			res.json({'status':'error'})
		}else{

			Cart.find({"userid":objUser._id}, function(err, carts){
				if(carts){
					console.log(carts)
					objUser["cart"] = carts;
				} 

				// setup the token 
				var usertoken = jwt.sign({
					user : objUser,
					cart : _.map(carts, 'productid')
				}, secretmonster, {
					expiresIn : 86400
				});

				res.json({'status':'success', 'message' : 'Successfully logged in.', token:usertoken})
			});
		}
	})
}); 

module.exports = router;
