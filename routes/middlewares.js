var jwt = require('jsonwebtoken');
var secretmonster = 'meanstartedhahahaha';

module.exports = {

	validateToken : function(req, res, next){
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		if(token){
			jwt.verify(token, secretmonster, function(err, decoded){
				if(err){
					return res.status(403).json({
						'status':'error',
						'message':'Failed to authenticate token.'
					});
				}else{ 
					req.decoded = decoded;
					next();
				}
			})
		}else{
			return res.status(403).json({
				'status':'error',
				'message':'No token provided.'
			});
		}
	}

}; 