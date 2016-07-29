var express = require('express');
var router = express.Router(); 
var User = require('../../models/User');
var Product = require('../../models/Product');
var Cart = require('../../models/Cart');
var async = require('async'); 
var _ = require('lodash');

router.get("/", function(req, res){  
	async.waterfall([
		function(callback){
			Cart.find({"userid":req.decoded.user._id},{},{sort:"-createdOn"}, function(err, objCartsRaw){
				if(err || !objCartsRaw || !objCartsRaw.length){
					callback(new Error("No item in cart"));
				}else{
					callback(null, objCartsRaw);
				}  
			})  
		},
		function(objCartsRaw, callback){
			var objProductIds = _.map(objCartsRaw, 'productid');  
			Product.find({_id: { $in:objProductIds }, "status":{$ne:"draft"}}, {'desc':false, "wishlistedBy":false, "tags":false, "category":false, "related":false}, {}, function(err, objProductsRaw){
				if(err || !objProductsRaw || !objProductsRaw.length){
					callback(new Error("No products found"));
				}else{  
					callback(null, objProductsRaw, objCartsRaw)
				}   
			}) 
		},
		function(objProductsRaw, objCartsRaw, callback){
			var objStoreIds = _.uniq(_.map(objProductsRaw, 'store.id'));  
			User.find({_id: {$in:objStoreIds}}, {"followed":false, "followers":false, "wishlist":false, "hash":false, "salt":false, "username":false, "store.description":false}, {}, function(err, objStoresRaw){
				if(err || !objStoresRaw || !objStoresRaw.length){
					callback(new Error("No Stores found"));
				}else{  
					callback(null, objStoresRaw, objProductsRaw, objCartsRaw)
				} 
			}) 
		}
	], function(err, objStoresRaw, objProductsRaw, objCartsRaw){
		if(err){
			response = {"success":false, "message":err};
		}else{ 
			var objResult = {"prods":objProductsRaw, "carts":objCartsRaw, "stores":objStoresRaw}
			response = {"success":true, "message":objResult};
		} 
		res.json(response); 
	}) 
})

router.get("/store/:storeid", function(req, res){  
	async.waterfall([
		function(callback){
			Cart.find({"userid":req.decoded.user._id},{},{sort:"-createdOn"}, function(err, objCartsRaw){
				if(err || !objCartsRaw || !objCartsRaw.length){
					callback(new Error("No item in cart"));
				}else{
					callback(null, objCartsRaw);
				}  
			})  
		},
		function(objCartsRaw, callback){
			var objProductIds = _.map(objCartsRaw, 'productid');  
			Product.find({_id: { $in:objProductIds }, "store.id":req.params.storeid}, {'desc':false, "wishlistedBy":false, "tags":false, "category":false, "related":false}, {}, function(err, objProductsRaw){
				if(err || !objProductsRaw || !objProductsRaw.length){
					callback(new Error("No products found"));
				}else{  
					callback(null, objProductsRaw, objCartsRaw)
				}   
			}) 
		}, 
		function(objProductsRaw, objCartsRaw, callback){
			User.findById(req.params.storeid, function(err, objStoreRaw){
				if(err || !objStoreRaw){
					callback(new Error("No store found"));
				}else{  
					callback(null, objStoreRaw, objProductsRaw, objCartsRaw)
				}  
			})
		}
	], function(err, objStoreRaw, objProductsRaw, objCartsRaw){
		if(err || !objStoreRaw || !objProductsRaw || !objCartsRaw){
			console.log(err)
			response = {"success":false, "message":err};
		}else{  
			var objResult = {"prods":objProductsRaw, "store":objStoreRaw, "carts":objCartsRaw}
			response = {"success":true, "message":objResult};
		} 
		res.json(response); 
	}) 
})
 
router.post("/", function(req, res){ 
	Cart.create({
		userid: req.decoded.user._id,
		productid: req.body.productId,
		quantity: req.body.quantity,
		status: 'new'
	}, function(err, cart){
		if(err){
			response = {"success":false, "message":err};
		}else{
			response = {"success":true, "message":cart};
		} 
		res.json(response); 
	})
})

router.get("/:cartid", function(req, res){ 
	res.json({"success":true, "message":"get one cart"});
})

router.put("/:cartid", function(req, res){ 
	console.log(req.body)

	Cart.findByIdAndUpdate(
		req.params.cartid,
		{ quantity: req.body.quantity },
		function(err, cart){
			if(err || !cart){
				res.json({"success":false, "message":err}); 
			}else{
				response = {"success":true, "message":"Cart item was updated successfully"};
			}
			res.json(response); 
		}
	) 
})

router.delete("/:cartid", function(req, res){ 
	Cart.remove({
		_id:req.params.cartid
	}, function(err, post){
		if(err){ 
			res.json({"success":false, "message":err}); 
		}else{ 
			response = {"success":true, "message":"Cart item was deleted successfully"};
		}  
        res.json(response); 
	}); 
})





module.exports = router;
