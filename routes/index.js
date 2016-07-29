var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Product = require('../models/Product');
var async = require('async');
var _ = require('lodash');
var gm = require('gm').subClass({ imageMagick: true });

var meta = {
	title: '7 Eleven',
	description: 'This is 711',
	keywords: 'Online,store,ads,buy and sell,shop,shopping',
	author: '711'
};

/* GET home page. */
router.get('/', function(req, res, next) {  
	meta.title = '711';
	meta.author = '711';
	res.render('index', { meta:meta });
});
 
router.get('/manage/*', function(req, res, next) { 
	meta.title = req.decoded ? req.decoded.user.username + ' | 711' : meta.title;
	meta.author = req.decoded ? req.decoded.user.username + ' | 711' : meta.author;
	res.render('index', { meta:meta });
});  

router.get('/my/*', function(req, res, next) {
	meta.title = req.decoded ? req.decoded.user.username + ' | 711' : meta.title;
	meta.author = req.decoded ? req.decoded.user.username + ' | 711' : meta.author;
	res.render('index', { meta:meta });
});  

router.get('/p/*', function(req, res, next) {
	var fullUrlPath = req.path.replace(/^\/|\/$/g, '');
	var strProdId = fullUrlPath.split("/")[1]; 

	Product.findOne({"prodid":strProdId},{},{}, function(err, product){
		console.log(product);
		if(err){
			//response = {"success":false, "message":err};
		}else{
			//response = {"success":true, "message":product};
			meta.title = _.capitalize(product.name) + ' | ' + '711 Store';
			meta.author = _.capitalize(product.store.name);
		} 
		res.render('index', { meta:meta });
	}) 
}); 

router.get('/s/*', function(req, res, next) {
	res.render('index', { meta:meta });
});  

router.get('/@*', function(req, res, next) {
	var fullUrlPath = req.path.replace(/^\/|\/$/g, '');
	var pageUrlPath = fullUrlPath.split("/")[0];
	var isStoreUrl = _.startsWith(pageUrlPath, '@');

	User.findOne(
		{'store.url':pageUrlPath.substring(1)},
		{'username':false, 'profile':false, 'createdOn':false, 'hash':false, 'salt':false},
		{}, 
		function(err, user){  
			if(err){ 
				//res.json({"success":false, "message":err}); 
			}else{ 
				//response = {"success":true, "message":user};  
				meta.title = _.capitalize(user.store.name) + ' | ' + '711 Store';
				meta.author = _.capitalize(user.store.name);
			}   
			//res.json(response);
			res.render('index', { meta:meta });
		}
	);
});  

/* GET login page. */
router.get('/login', function(req, res, next) {
	res.render('index', { meta:meta });
}); 

/* GET login page. */
router.get('/logout', function(req, res, next) {
	res.render('index', { meta:meta });
}); 

/* GET register page. */
router.get('/register', function(req, res, next) {
	res.render('index', { meta:meta });
}); 
 
/* GET store page.  
router.get('/:storeurl', function(req, res, next) { 
	async.waterfall([
		function(callback){
			User.findOne({"store.url":req.params.storeurl}, function(err, user){
				if(err || !user){
					var user = null;
				}else{
					var user = user;
				} 
				callback(null, user);
			})
		},
		function(user, callback){ 
			if(user != null){ 
				Product.find({"store.id":user._id }, function(err, products){ 
					if(err || !products){
						var products = null;
					}else{
						var products = products;
					}
					callback(null, user, products);
				})
			}else{
				callback(null, null, null);
			}
		}
	], function(err, user, products){  
		if(err || !user){
			// display to error page
			res.render('index', { meta:meta }); 
		}else{  
			var strTitle = user && user.store.name ? 'onMarket - '+user.store.name : "Store Not Found"; 
			res.render('themes/'+user.store.theme+'/index', { title: strTitle, objUser:user, objProducts:products });
		}
	}) 
});
 
  GET product page.  
router.get('/:storeurl/:producturl', function(req, res, next) {
	async.waterfall([
		function(callback){
			User.findOne({"store.url":req.params.storeurl}, function(err, user){
				if(err || !user){
					var user = null;
				}else{
					var user = user;
				} 
				callback(null, user);
			})
		},
		function(user, callback){ 
			if(user != null){ 
				Product.findOne({"url":req.params.producturl, "store.id":user._id }, function(err, product){ 
					if(err || !product){
						var product = null;
					}else{
						var product = product;
					}
					callback(null, user, product);
				})
			}else{
				callback(null, null, null);
			}
		}
	], function(err, user, product){   
		if(err || !user){
			// display to error page
			res.render('index', { meta:meta }); 
		}else{ 
			var strTitle = product && product.name ? 'onMarket - '+product.name : "Product Not Found";   
			res.render('themes/'+user.store.theme+'/product', { title: strTitle, objUser:user, objProduct:product });
		}
	}) 
});
*/
 
// catch all other routes and pass it to angular app
router.get('*', function(req, res) {   
	res.render('index', { meta:meta }); 
}); 

module.exports = router;
