var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var User = require('../../../models/User');  
var Product = require('../../../models/Product');  
var multer = require('multer');
var _ = require('lodash');
var secretmonster = 'meanstartedhahahaha';
var gm = require('gm').subClass({ imageMagick: true });


var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/uploads/'+req.decoded.user._id+'/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
});
var upload = multer({ storage: storage });
var postAvatarImage = upload.fields([{name:'nAvatarImg', maxCount:1}])



router.get("/", function(req, res){
	User.findById(req.decoded.user._id, function(err, user){
		if(err){ 
			res.json({"success":false, "message":err}); 
		}else{ 
			console.log(user.store.length)
			response = {"success":true, "message":user.store}; 
		}  

		res.json(response);
	});
})

router.post("/", postAvatarImage, function(req, res){
	User.findById(req.decoded.user._id, function(err, userObj){
		if(err){ 
			res.json({"success":false, "message":err}); 
		}else{  
 			if(!userObj.store.name){
 				console.log('no store yet')
				var prettyUrlRaw = req.body.name.trim()
					.replace(/ñ/g, 'n')
					.replace(/'/g, '')
					.replace(/"/g, '')
					.replace(/[^a-zA-Z0-9]/g,"")
					.toLowerCase()
					.replace(/--/g, '');
	 
				User.find({"store.urlraw":prettyUrlRaw, "username": {$ne:userObj.username}}, {}, {sort: 'createdOn'}, function(err, users){
					var strPrettyUrl = prettyUrlRaw
					
					if(users.length > 0){
						strPrettyUrl = prettyUrlRaw + "." + users.length;
					} 

					userObj.store.url = strPrettyUrl;
					userObj.store.urlraw = prettyUrlRaw;
					userObj.store.name = req.body.name;
					userObj.store.lowername = req.body.name.toLowerCase();
					userObj.store.description = req.body.description;
					userObj.store.theme = req.body.theme ? req.body.theme : 'default';
					userObj.store.avatar = 'none.jpg';
   
	 				if(req.files && req.files['nAvatarImg'] && req.files['nAvatarImg'][0] && req.files['nAvatarImg'][0]['size']){ 
						userObj.store.avatar = req.files['nAvatarImg'][0]['filename']; 

						var imgPath = __dirname + "/../../../public/uploads/"+req.decoded.user._id+"/"+userObj.store.avatar;
						gm(imgPath)
						.noProfile()
						.gravity('center')
						.resize('200', '200', "^>")
						.quality(70)
						.crop('200', '200')
						.write(imgPath, function (err) {
							var msg = userObj.store.avatar + ' : done';
							if (err){
								msg = err
							}
							console.log(msg)
						});
					}

					userObj.save(function(err){
						if(err){
							console.log('unable to update store name', err)
							res.json({"success":false, "message":err}); 
						}else{
							// update req.decoded 
							req.decoded.user.store = userObj.store  
							res.json({"success":true, "message":userObj.store}); 
						}
					}); 
					
				})
			}else{
				console.log('has store')
				userObj.store.name = req.body.name;
				userObj.store.lowername = req.body.name.toLowerCase();
				userObj.store.description = req.body.description;
				userObj.store.theme = req.body.theme;
				userObj.store.avatar = req.body.avatar;
   
 				if(req.files && req.files['nAvatarImg'] && req.files['nAvatarImg'][0] && req.files['nAvatarImg'][0]['size']){
					userObj.store.avatar = req.files['nAvatarImg'][0]['filename']; 

					var imgPath = __dirname + "/../../../public/uploads/"+req.decoded.user._id+"/"+userObj.store.avatar;
					gm(imgPath)
					.noProfile()
					.gravity('center')
					.resize('200', '200', "^>")
					.quality(70)
					.crop('200', '200')
					.write(imgPath, function (err) {
						var msg = userObj.store.avatar + ' : done';
						if (err){
							msg = err
						} 
						console.log(msg)
					});
				}

				userObj.save(function(err){
					if(err){
						console.log('unable to update store name', err)
						res.json({"success":false, "message":err}); 
					}else{

						// update the product store details
						Product.update(
							{'store.id':userObj._id}, 
							{'store.name':req.body.name}, 
							{upsert:false, multi:true}, 
							function(err, prods){
								if(err){
									console.log(err)
								}
							}
						)
						res.json({"success":true, "message":userObj.store}); 
					}
				}); 
			} 
		}  
	});
}); 

router.get("/check/:lowername", function(req, res){
	User.findOne({'store.lowername':req.params.lowername}, function(err, users){
		if(err){ 
			res.json({"success":false, "message":err}); 
		}else{
			response = {"success":true, "message":users}; 
		}   
		res.json(response);
	});
})


router.get("/profile", function(req, res){
	User.findById(req.decoded.user._id, function(err, user){
		if(err){ 
			res.json({"success":false, "message":err}); 
		}else{ 
			response = {"success":true, "message":user.profile}; 
		}  

		res.json(response);
	});
});

router.post("/profile", function(req, res){
	User.findById(req.decoded.user._id, function(err, user){ 
		if(err || !user){ 
			res.json({"success":false, "message":err}); 
		}else{
			user.profile.address1 = req.body.address1 ? req.body.address1 : '';
			user.profile.address2 = req.body.address2 ? req.body.address2 : '';
			user.profile.address3 = req.body.address3 ? req.body.address3 : '';
			user.profile.number = req.body.number ? req.body.number : '';

			user.save(function(err){
				if(err){ 
					res.json({"success":false, "message":err}); 
				}else{
					res.json({"success":true, "message":user.profile}); 
				}
			});  
		}
	});
})

module.exports = router;
