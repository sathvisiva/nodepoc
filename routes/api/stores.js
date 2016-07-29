var express = require('express');
var router = express.Router(); 
var User = require('../../models/User');
var Product = require('../../models/Product');
var async = require('async'); 
var _ = require('lodash');
var mdWares = require('../middlewares');

router.get("/url/:storeUrl", function(req, res){ 
	User.findOne(
		{'store.url':req.params.storeUrl},
		{'username':false, 'profile':false, 'createdOn':false, 'hash':false, 'salt':false},
		{}, 
		function(err, user){ 
			if(err){ 
				res.json({"success":false, "message":err}); 
			}else{ 
				response = {"success":true, "message":user}; 
			}  

			res.json(response);
		}
	);
})
 

router.get("/:storeId/products", function(req, res){ 
	Product.find({'store.id':req.params.storeId},{},{sort: '-createdOn'}, function(err, products){
		if(err){
			response = {"success":false, "message":err};
		}else{
			response = {"success":true, "message":products};
		} 
		res.json(response); 
	})
})

router.get("/getbyproductid/:productid", function(req, res){ 
	User.findOne(
		{'_id':req.params.productid},
		{'username':false, 'profile':false, 'createdOn':false, 'hash':false, 'salt':false},
		{}, 
		function(err, user){ 
			if(err){ 
				res.json({"success":false, "message":err}); 
			}else{ 
				response = {"success":true, "message":user}; 
			}  

			res.json(response);
		}
	);
})

router.post("/follow", mdWares.validateToken, function(req, res){ 
	async.series([
		function(callback){
			User.findOneAndUpdate(
				{_id: req.decoded.user._id}, 
				{$push: {followed: {"userid":req.body.storeId}}}, 
				function(err, userObj){
					if(err){
						console.log(err)
						callback(err);
					}else{
						callback(null, 'followed')
					}
				}
			)
		},
		function(callback){
			User.findOneAndUpdate(
				{_id: req.body.storeId}, 
				{$push: {followers: {"userid":req.decoded.user._id}}}, 
				function(err, userObj){
					if(err){
						console.log(err)
						callback(err);
					}else{
						callback(null, 'followed')
					}
				}
			)
		}
	], function(err, result){
		if(err){ 
			console.log(err)
			res.json({"success":false, "message":err}); 
		}else{ 
			response = {"success":true, "message":result}; 
		}  

		res.json(response);
	}) 
})

router.post("/unfollow", mdWares.validateToken, function(req, res){
	async.series([
		function(callback){
			User.findOneAndUpdate(
				{_id: req.decoded.user._id}, 
				{$pull: {followed: {"userid":req.body.storeId}}}, 
				function(err, userObj){
					if(err){
						console.log(err)
						callback(err);
					}else{
						callback(null, 'unfollowed')
					}
				}
			)
		},
		function(callback){
			User.findOneAndUpdate(
				{_id: req.body.storeId}, 
				{$pull: {followers: {"userid":req.decoded.user._id}}}, 
				function(err, userObj){
					if(err){
						console.log(err)
						callback(err);
					}else{
						callback(null, 'unfollowers')
					}
				}
			)
		}
	], function(err, result){
		if(err){ 
			console.log(err)
			res.json({"success":false, "message":err}); 
		}else{ 
			response = {"success":true, "message":result}; 
		}  

		res.json(response);
	}) 
})

module.exports = router;
