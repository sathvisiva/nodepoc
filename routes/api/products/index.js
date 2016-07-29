var express = require('express');
var router = express.Router();
var Product = require('../../../models/Product');
var User = require('../../../models/User');
var crypto = require('crypto'); 
var async = require('async'); 
var passport = require('passport');
var nodemailer = require('nodemailer'); 
var jwt = require('jsonwebtoken');
var multer = require('multer');
var _ = require('lodash');
var secretmonster = 'meanstartedhahahaha';
var gm = require('gm').subClass({ imageMagick: true });
var fs = require('fs');
var mdWares = require('../../middlewares');


var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/uploads/'+req.decoded.user._id+'/products/c/')
	},
	filename: function (req, file, cb) {
		cb(null, new Date().getTime().toString() + '_' + file.fieldname + '-' + file.originalname)
	}
})
var upload = multer({ storage: storage });
var postImage = upload.fields([{name:'nProductImg1', maxCount:1}, {name:'nProductImg2', maxCount:1}, {name:'nProductImg3', maxCount:1}, {name:'nProductImg4', maxCount:1}])


router.get("/", mdWares.validateToken, function(req, res){
	Product.find({'store.id':req.decoded.user._id},{},{sort: '-createdOn'}, function(err, posts){
		if(err){
			response = {"success":false, "message":err};
		}else{
			response = {"success":true, "message":posts};
		} 
		res.json(response); 
	})
})

// get wishlist, requires req.decoded.user._id
router.get("/wishlist", mdWares.validateToken, function(req, res){
	var pageNum = req.query.pagenum ? req.query.pagenum : 1,
		limit = 28,
		skip = (parseInt(pageNum) * limit) - limit;

	Product.find({"wishlistedBy.userid":req.decoded.user._id, "status":{$ne:"draft"}},{},{skip:skip, limit:limit}, function(err, products){
		if(err){ 
			console.log(err)
			res.json({"success":false, "message":err}); 
		}else{ 
			response = {"success":true, "message":products}; 
		}  

		res.json(response);
	})
})

// Add to wishlist, requires productid
router.post("/wishlist", mdWares.validateToken, function(req, res){
	async.series([
		function(callback){
			User.findOneAndUpdate(
				{_id: req.decoded.user._id}, 
				{$push: {wishlist: {"productid":req.body.prodId}}}, 
				function(err, userObj){
					if(err){
						console.log(err)
						callback(err);
					}else{
						callback(null, 'wishlist')
					}
				}
			)
		},
		function(callback){
			Product.findOneAndUpdate(
				{_id: req.body.prodId, "status":{$ne:"draft"}}, 
				{$push: {wishlistedBy: {"userid":req.decoded.user._id}}}, 
				function(err, userObj){
					if(err){
						console.log(err)
						callback(err);
					}else{
						callback(null, 'wishlisted')
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

// Delete product image
router.post("/deleteimage", mdWares.validateToken, function(req, res){  
	var setQuery = {}; 

	switch(req.body.field){
		case "img1":
			setQuery = {"images.0.img1":null}
			break;
		case "img2":
			setQuery = {"images.0.img2":null}
			break;
		case "img3":
			setQuery = {"images.0.img3":null}
			break;
		case "img4":
			setQuery = {"images.0.img4":null}
			break;
	};

	Product.findOneAndUpdate(
		{_id: req.body.prodId}, 
		{$set: setQuery}, 
		function(err, prodObj){
			if(err){
				console.log(err)
				res.json({"success":false, "message":err});
			}else{
				async.parallel([
					function(callback){
						var imgPathC = 'public/uploads/'+req.decoded.user._id+'/products/c/'+req.body.name;
						fs.stat(imgPathC, function(err, stats){
							if(err){
								var result = {"success":false, "message":err}; 
							}else{ 
								var result = {"success":true, "message":req.body.name + " : image is deleted in C"};
								fs.unlink(imgPathC);
							}
							callback(null, result);
						})
					},
					function(callback){
						var imgPathMD = 'public/uploads/'+req.decoded.user._id+'/products/md/'+req.body.name;
						fs.stat(imgPathMD, function(err, stats){
							if(err){
								var result = {"success":false, "message":err}; 
							}else{ 
								var result = {"success":true, "message":req.body.name + " : image is deleted in md"};
								fs.unlink(imgPathMD);
							}
							callback(null, result);
						})
					},
					function(callback){
						var imgPathSM = 'public/uploads/'+req.decoded.user._id+'/products/sm/'+req.body.name;
						fs.stat(imgPathSM, function(err, stats){
							if(err){
								var result = {"success":false, "message":err}; 
							}else{ 
								var result = {"success":true, "message":req.body.name + " : image is deleted in sm"};
								fs.unlink(imgPathSM);
							}
							callback(null, result);
						})
					},
					function(callback){
						var imgPathXS = 'public/uploads/'+req.decoded.user._id+'/products/xs/'+req.body.name;
						fs.stat(imgPathXS, function(err, stats){
							if(err){
								var result = {"success":false, "message":err}; 
							}else{ 
								var result = {"success":true, "message":req.body.name + " : image is deleted in xs"};
								fs.unlink(imgPathXS);
							}
							callback(null, result);
						})
					}
				], function(err, results){
					res.json(results);
				})
			}
		}
	)  

})

// Remove from wishlist, requires productid
router.post("/unwishlist", mdWares.validateToken, function(req, res){
	async.series([
		function(callback){
			User.findOneAndUpdate(
				{_id: req.decoded.user._id}, 
				{$pull: {wishlist: {"productid":req.body.prodId}}}, 
				function(err, userObj){
					if(err){
						console.log(err)
						callback(err);
					}else{
						callback(null, 'unwishlist')
					}
				}
			)
		},
		function(callback){
			Product.findOneAndUpdate(
				{_id: req.body.prodId}, 
				{$pull: {wishlistedBy: {"userid":req.decoded.user._id}}}, 
				function(err, userObj){
					if(err){
						console.log(err)
						callback(err);
					}else{
						callback(null, 'unwishlisted')
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

router.get("/home", function(req, res){
	var pageNum = req.query.pagenum ? req.query.pagenum : 1,
		limit = 28,
		skip = (parseInt(pageNum) * limit) - limit;

	Product.find({"status":{$ne:"draft"}},{},{skip:skip, limit:limit, sort:'-createdOn'}, function(err, posts){
		if(err){
			response = {"success":false, "message":err};
		}else{
			response = {"success":true, "message":posts};
		} 
		res.json(response); 
	})
})

router.get("/get", mdWares.validateToken, function(req, res){  
	Product.find({'store.id':req.decoded.user._id, "status":{$ne:"draft"}}, {'prodid':1, 'name':1}, {}, function(err, product){
		if(err){
			response = {"success":false, "message":err};
		}else{
			response = {"success":true, "message":product};
		} 
		res.json(response); 
	})
})

router.post('/add', mdWares.validateToken, postImage, function(req, res){   

	// this needs refactoring!!!!
	var strProductImg1 = null
	var strProductImg2 = null
	var strProductImg3 = null
	var strProductImg4 = null

	// let's add image1  
	if(req.files && req.files['nProductImg1'] && req.files['nProductImg1'][0] && req.files['nProductImg1'][0]['size']){
		strProductImg1 = req.files['nProductImg1'][0]['filename']; 
	}  

	// let's add image2  
	if(req.files && req.files['nProductImg2'] && req.files['nProductImg2'][0] && req.files['nProductImg2'][0]['size']){
		strProductImg2 = req.files['nProductImg2'][0]['filename']; 
	}  

	// let's add image3  
	if(req.files && req.files['nProductImg3'] && req.files['nProductImg3'][0] && req.files['nProductImg3'][0]['size']){
		strProductImg3 = req.files['nProductImg3'][0]['filename'];
	}  

	// let's add image4  
	if(req.files && req.files['nProductImg4'] && req.files['nProductImg4'][0] && req.files['nProductImg4'][0]['size']){
		strProductImg4 = req.files['nProductImg4'][0]['filename'];
	}  

	async.forEachOfSeries([strProductImg1, strProductImg2, strProductImg3, strProductImg4], function(value, i, callback){ 
		if(value){
			var imgPath = __dirname + "/../../../public/uploads/"+req.decoded.user._id+"/products/c/"+value;
			var xsthumbPath = __dirname + "/../../../public/uploads/"+req.decoded.user._id+"/products/xs/"+value;
			var smthumbPath = __dirname + "/../../../public/uploads/"+req.decoded.user._id+"/products/sm/"+value;
			var mdthumbPath = __dirname + "/../../../public/uploads/"+req.decoded.user._id+"/products/md/"+value;
	 		
	 		async.series([
	 			function(cb){
	 				gm(imgPath)
						.noProfile()
						.gravity('center')
						.resize('50', '50', "^>")
						.quality(70)
						.crop('50', '50')
						.write(xsthumbPath, function (err) {
							var msg = value + ' : c done';
							if (err){
								msg = err
							}
							cb(null, msg);
						});
	 			},
	 			function(cb){
	 				gm(imgPath)
						.noProfile()
						.gravity('center')
						.resize('50', '50', "^>")
						.quality(70)
						.crop('50', '50')
						.write(xsthumbPath, function (err) {
							var msg = value + ' : xs done';
							if (err){
								msg = err
							}
							cb(null, msg);
						});
	 			},
	 			function(cb){
	 				gm(imgPath)
						.noProfile()
						.gravity('center')
						.resize('200', '200', "^>")
						.quality(80)
						.crop('200', '200')
						.write(smthumbPath, function (err) {
							var msg = value + ' : sm done';
							if (err){
								msg = err
							}
							cb(null, msg);
						});
	 			},
	 			function(cb){
	 				gm(imgPath)
						.noProfile()
						.gravity('center')
						.resize('400', '400', "^>")
						.quality(90)
						.crop('400', '400')
						.write(mdthumbPath, function (err) {
							var msg = value + ' : md done';
							if (err){
								msg = err
							}
							cb(null, msg);
						});
	 			}
	 		], function(err, result){
	 			console.log(result)
	 			callback()
	 		}) 
		}else{
			callback()
		}
	}, function(err){
		if(err){
			console.log(err)
		}else{
			console.log('DONE') 
		}
	})

	Product.create({
		name: req.body.name,
		lowername: req.body.name.toLowerCase(),
		desc: req.body.desc,
		price: req.body.price,
		image: req.files && req.files['images'] ? req.files['images'][0]['filename'] : 'none.jpg',
		images: {
			img1: strProductImg1,
			img2: strProductImg2,
			img3: strProductImg3,
			img4: strProductImg4
		},
		store: {
			id: req.decoded.user._id,
			name: req.decoded.user.store['name'],
			url: req.decoded.user.store['url']
		},
		category: {
			main: req.body.maincat,
			sub: req.body.subcat
		},
		sale: {
			off: req.body.saleOff,
			start: req.body.saleStart ? new Date(req.body.saleStart) : '',
			end: req.body.saleEnd ? new Date(req.body.saleEnd) : ''
		},
		tags: req.body.tags && JSON.parse(req.body.tags) ? JSON.parse(req.body.tags) : [],
		related: req.body.related && JSON.parse(req.body.related) ? JSON.parse(req.body.related) : [],
		status: req.body.status
	}, function(err, product){ 
		if(err){
			response = {"success":false, "message":err};
		}else{
			var prettyUrlRaw = req.body.name.trim()
				.replace(/ñ/g, 'n')
				.replace(/'/g, '')
				.replace(/"/g, '')
				.replace(/[^a-zA-Z0-9]/g,"")
				.toLowerCase()
				.replace(/--/g, '');

			Product.find({"urlraw":prettyUrlRaw, "_id": {$ne:product._id}}, {}, {sort: 'createdOn'}, function(err, products){
				var strPrettyUrl = prettyUrlRaw
				
				if(products.length > 0){
					strPrettyUrl = prettyUrlRaw + "-" + products.length;
				}
 
				product.url = strPrettyUrl;
				product.urlraw = prettyUrlRaw;
				product.save(function(err){
					if(err){
						console.log('unable to update store name', err)
					}
				})
				
			});

			response = {"success":true, "message":product};
		} 
		res.json(response); 
	}); 
}); 

router.get("/:id", function(req, res){  
	Product.findById(req.params.id, function(err, product){
		if(err){
			response = {"success":false, "message":err};
		}else{
			response = {"success":true, "message":product};
		} 
		res.json(response); 
	})
})

router.get("/:id/related", function(req, res){  
	Product.findById(req.params.id, function(err, product){
		if(err && !product){
			response = {"success":false, "message":err};
		}else{ 
			Product.find({"status":{$ne:'draft'}})
				.where('_id')
				.in(product.related)
				.exec(function(err, related){
					if(err && !product){
						response = {"success":false, "message":err};
					}else{
						response = {"success":true, "message":related};
					}

					res.json(response); 
				});
		}  
	})
})

router.get("/:id/prodid", function(req, res){  
	Product.findOne({"prodid":req.params.id},{},{}, function(err, product){
		if(err){
			response = {"success":false, "message":err};
		}else{
			response = {"success":true, "message":product};
		} 
		res.json(response); 
	})
})

router.put("/:id", mdWares.validateToken, postImage, function(req, res){  
  
	// this needs refactoring!!!!
	var productImages = []; 
	var imgs = [];

	var strProductImg1 = req.body.productImg1 ? req.body.productImg1 : null;
	var strProductImg2 = req.body.productImg2 ? req.body.productImg2 : null;
	var strProductImg3 = req.body.productImg3 ? req.body.productImg3 : null;
	var strProductImg4 = req.body.productImg4 ? req.body.productImg4 : null;

	var strResizeImg1 = null
	var strResizeImg2 = null
	var strResizeImg3 = null
	var strResizeImg4 = null

	// let's add image1  
	if(req.files && req.files['nProductImg1'] && req.files['nProductImg1'][0] && req.files['nProductImg1'][0]['size']){ 
		strProductImg1 = req.files['nProductImg1'][0]['filename'];
		strResizeImg1 = req.files['nProductImg1'][0]['filename'];
	}  

	// let's add image2 
	if(req.files && req.files['nProductImg2'] && req.files['nProductImg2'][0] && req.files['nProductImg2'][0]['size']){ 
		strProductImg2 = req.files['nProductImg2'][0]['filename'];
		strResizeImg2 = req.files['nProductImg2'][0]['filename']; 
	} 

	// let's add image3  
	if(req.files && req.files['nProductImg3'] && req.files['nProductImg3'][0] && req.files['nProductImg3'][0]['size']){ 
		strProductImg3 = req.files['nProductImg3'][0]['filename']; 
		strResizeImg3 = req.files['nProductImg3'][0]['filename']; 		
	}  

	// let's add image4  
	if(req.files && req.files['nProductImg4'] && req.files['nProductImg4'][0] && req.files['nProductImg4'][0]['size']){ 
		strProductImg4 = req.files['nProductImg4'][0]['filename'];
		strResizeImg4 = req.files['nProductImg4'][0]['filename'];
	}  

 
	async.forEachOfSeries([strResizeImg1, strResizeImg2, strResizeImg3, strResizeImg4], function(value, i, callback){ 
		if(value){
			var imgPath = __dirname + "/../../../public/uploads/"+req.decoded.user._id+"/products/c/"+value;
			var xsthumbPath = __dirname + "/../../../public/uploads/"+req.decoded.user._id+"/products/xs/"+value;
			var smthumbPath = __dirname + "/../../../public/uploads/"+req.decoded.user._id+"/products/sm/"+value;
			var mdthumbPath = __dirname + "/../../../public/uploads/"+req.decoded.user._id+"/products/md/"+value;
	 		
	 		async.series([
	 			function(cb){
	 				gm(imgPath)
						.noProfile()
						.gravity('center')
						.resize('50', '50', "^>")
						.quality(70)
						.crop('50', '50')
						.write(xsthumbPath, function (err) {
							var msg = value + ' : c done';
							if (err){
								msg = err
							}
							cb(null, msg);
						});
	 			},
	 			function(cb){
	 				gm(imgPath)
						.noProfile()
						.gravity('center')
						.resize('50', '50', "^>")
						.quality(70)
						.crop('50', '50')
						.write(xsthumbPath, function (err) {
							var msg = value + ' : xs done';
							if (err){
								msg = err
							}
							cb(null, msg);
						}); 
	 			},
	 			function(cb){
	 				gm(imgPath)
						.noProfile()
						.gravity('center')
						.resize('200', '200', "^>")
						.quality(80)
						.crop('200', '200')
						.write(smthumbPath, function (err) {
							var msg = value + ' : sm done';
							if (err){
								msg = err
							}
							cb(null, msg);
						});
	 			},
	 			function(cb){
	 				gm(imgPath)
						.noProfile()
						.gravity('center')
						.resize('400', '400', "^>")
						.quality(90)
						.crop('400', '400')
						.write(mdthumbPath, function (err) {
							var msg = value + ' : md done';
							if (err){
								msg = err
							}
							cb(null, msg);
						});
	 			}
	 		], function(err, result){
	 			console.log(result)
	 			callback()
	 		}) 
		}else{
			callback()
		}
	}, function(err){
		if(err){
			console.log(err)
		}else{
			console.log('DONE') 
		}
	})   
 
	Product.findById(req.params.id, function(err, post){
		if(err){ 
			res.json({"success":false, "message":err}); 
		}else{ 
			if(post.store.id == req.decoded.user._id){ 
				post.name = req.body.name;
				post.lowername = req.body.name.toLowerCase(),
				post.desc = req.body.desc;
				post.price = req.body.price;  
				post.status = req.body.status; 
				post.images = {
					img1: strProductImg1,
					img2: strProductImg2,
					img3: strProductImg3,
					img4: strProductImg4
				};
				post.category = {
					main: req.body.maincat,
					sub: req.body.subcat 
				}; 

				post.sale = {
					off: req.body.saleOff,
					start: req.body.saleStart,
					end: req.body.saleEnd 
				}; 

				post.tags = req.body.tags && JSON.parse(req.body.tags) ? JSON.parse(req.body.tags) : [];
				post.related = req.body.related && JSON.parse(req.body.related) ? JSON.parse(req.body.related) : [];

				post.save(function(err) {
	                if(err){
	                	response = {"success":true, "message":err}; 
	                }else{
	                	response = {"success":true, "message":post};
	                } 
	                res.json(response); 
	            });
	        }else{
	        	return res.status(403).json({
					'status':'error',
					'message':'Forbidden.'
				});
	        }
		}  
	})
})

router.delete("/:id", mdWares.validateToken, function(req, res){ 
	Product.remove({
		_id:req.params.id
	}, function(err, post){
		if(err){ 
			res.json({"success":false, "message":err}); 
		}else{ 
			response = {"success":true, "message":"Product was deleted successfully"};
		}  
        res.json(response); 
	});
}) 
 

module.exports = router;
