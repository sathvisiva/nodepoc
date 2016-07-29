var express = require('express');
var router = express.Router();
var User = require('../../../models/User');
var Cart = require('../../../models/Cart');
var crypto = require('crypto'); 
var async = require('async'); 
var passport = require('passport');
var nodemailer = require('nodemailer'); 
var jwt = require('jsonwebtoken');
var mkdirp = require('mkdirp');
var fs = require('fs-extra'); 
var secretmonster = 'meanstartedhahahaha';
var _ = require('lodash');

router.post('/register', function(req, res){ 
	User.findOne(
		{username : req.body.username},
		function(err, user){
			if(err){
				res.json({"status":"error", "message":"Unable to process registration. Please try again later."})
			}else if(user){
				res.json({"status":"error", "message":"Email is already used."})
			}else{
				User.register( new User({ username:req.body.username, fullname:req.body.fullname, store:null, profile:null }), req.body.password, function(err, userObj){
					if(err){
						res.json({"status":"error", "message": err.message});
					}else{  
						async.parallel([
							function(callback){
								mkdirp(__dirname+'/../../../public/uploads/'+userObj._id+'/products/c', function (err) {
								    if(err){
								    	console.error(err)
								    	callback(null, err);
								    }else{
								    	fs.copy(__dirname+'/../../../public/uploads/none.jpg', __dirname+'/../../../public/uploads/'+userObj._id+'/products/c/none.jpg', function (err) {
											if (err) {
												console.error(err) 
												callback(null, err);
											}else{
												callback(null, 'C Directory - ok');
								    			console.log('Directory "/uploads/'+userObj._id+'/products/c" has been created');
											}
										})  
								    }
								});
							},
							function(callback){
								mkdirp(__dirname+'/../../../public/uploads/'+userObj._id+'/products/xs', function (err) {
								    if(err){
								    	console.error(err)
								    	callback(null, err);
								    }else{
								    	fs.copy(__dirname+'/../../../public/uploads/none.jpg', __dirname+'/../../../public/uploads/'+userObj._id+'/products/xs/none.jpg', function (err) {
											if (err) {
												console.error(err) 
												callback(null, err);
											}else{
												callback(null, 'C Directory - ok');
								    			console.log('Directory "/uploads/'+userObj._id+'/products/xs" has been created');
											}
										})  
								    }
								});
							},
							function(callback){
								mkdirp(__dirname+'/../../../public/uploads/'+userObj._id+'/products/sm', function (err) {
								    if(err){
								    	console.error(err)
								    	callback(null, err);
								    }else{
								    	fs.copy(__dirname+'/../../../public/uploads/none.jpg', __dirname+'/../../../public/uploads/'+userObj._id+'/products/sm/none.jpg', function (err) {
											if (err) {
												console.error(err) 
												callback(null, err);
											}else{
												callback(null, 'C Directory - ok');
								    			console.log('Directory "/uploads/'+userObj._id+'/products/sm" has been created');
											}
										})  
								    }
								});
							},
							function(callback){
								mkdirp(__dirname+'/../../../public/uploads/'+userObj._id+'/products/md', function (err) {
								    if(err){
								    	console.error(err)
								    	callback(null, err);
								    }else{
								    	fs.copy(__dirname+'/../../../public/uploads/none.jpg', __dirname+'/../../../public/uploads/'+userObj._id+'/products/md/none.jpg', function (err) {
											if (err) {
												console.error(err) 
												callback(null, err);
											}else{
												callback(null, 'C Directory - ok');
								    			console.log('Directory "/uploads/'+userObj._id+'/products/md" has been created');
											}
										})  
								    }
								});
							}
						], function(err, result){
							if(err){
								console.log(err)
							}else{
								console.log(result)
							}
						}) 

						res.json({'status':'success','message':'Registration is successful.'});
					}
				});
			}
		}
	);
});

router.post('/login', function(req, res, next){
	passport.authenticate('local', function(err, objUser, info){  
		if(err || !objUser){ 
			res.json({'status':'error', 'message' : info.message})
		} else { 

			var safeUser = {
				id : objUser['id'],
				username : objUser['username'],
				fullname : objUser['fullname'] 
			}

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
			}) 
		};
	})(req, res, next);
})

module.exports = router;
