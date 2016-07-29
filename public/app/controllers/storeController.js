'use strict'

angular.module('starterApp') 
	.controller('storeController', function($scope, Auth){
		Auth.restrict();
	}) 
	.controller('storeReveiwsController', function($scope, Auth){
		Auth.restrict();
	}) 
	.controller('storeProductsController', function($scope, Auth){
		Auth.restrict();
	}) 
	.controller('storeUrlController', function($scope, Auth, $location, Store, $rootScope, $cacheFactory, Product, Cart){ 
		$scope.objStore = null;
		$scope.objStoreProducts = []
		$scope.storeImg = '/uploads/none.jpg'
		$scope.isfollowed = false;
		$scope.cartItemInStore = null;

		var fullUrlPath = $location.path().replace(/^\/|\/$/g, '');
		var pageUrlPath = fullUrlPath.split("/")[0];
		var isStoreUrl = _.startsWith(pageUrlPath, '@')
 		
 		if(isStoreUrl){  
 			Store.getStoreByUrl(pageUrlPath.substring(1))
 				.success(function(dataStore){
 					if(dataStore.message){
 						$scope.objStore = dataStore.message ? dataStore.message : null; 
 						$scope.storeImg = $scope.objStore.store.avatar != 'none.jpg' ? '/uploads/'+$scope.objStore._id+'/'+$scope.objStore.store.avatar : '/uploads/none.jpg';
 						
 						if($rootScope.rs_me != null){ 
 							$scope.isfollowed = _.find($rootScope.rs_me.followed, {userid:$scope.objStore._id}) ? true : false;
 						}
 					
 						Store.getStoreProducts($scope.objStore._id)
 							.success(function(dataProducts){
 								if(dataProducts.success && dataProducts.message){ 
 									$scope.objStoreProducts = _.map(dataProducts.message, function(objProduct){
										objProduct['isWishListed'] = $scope.$parent.isWishlisted(objProduct['_id']); 
										objProduct['inCartItem'] = $scope.$parent.isOnCart(objProduct['_id']); 
										return objProduct;
									});   
 								} 
 							})

 						if($rootScope.rs_me != null){ 
	 						Cart.store($scope.objStore._id).success(function(data){
	 							if(data.success && data.message){
	 								$scope.cartItemInStore = data.message
	 							} 
							})
						}
 					} 
 				})
 		}

 		$scope.followStore = function(ev){
 			Store.follow($scope.objStore._id)
 				.success(function(data){
 					if(data.success){
 						// refresh the token since we updated our profile
						var httpCache = $cacheFactory.get('$http'); 
						httpCache.remove('/api/user/me');
						Auth.refreshToken() 
 						$scope.isfollowed = true;  
 						$scope.objStore.followers.push({userid:$rootScope.rs_me._id});  
 					}
 				})
 			return false;
 		}

 		$scope.unfollowStore = function(ev){
 			Store.unfollow($scope.objStore._id)
 				.success(function(data){
 					if(data.success){
 						// refresh the token since we updated our profile
						var httpCache = $cacheFactory.get('$http'); 
						httpCache.remove('/api/user/me');
						Auth.refreshToken() 
 						$scope.isfollowed = false; 
 						_.remove($scope.objStore.followers, _.find($scope.objStore.followers, {"userid":$rootScope.rs_me._id}))
 					}
 				})
 			return false;
 		}

 		$scope.addToWishlist = function(prodId){ 
			Product.addWishlist(prodId)
				.success(function(data){
					if(data.success){
 						// refresh the token since we updated our profile
						var httpCache = $cacheFactory.get('$http'); 
						httpCache.remove('/api/user/me');
						Auth.refreshToken()  
 						var intProDuctIndex = _.indexOf($scope.objStoreProducts, _.find($scope.objStoreProducts, {_id: prodId}));
						$scope.objStoreProducts[intProDuctIndex]['isWishListed'] = true;
 					}
				})
		}

		$scope.removeFromWishlist = function(prodId){ 
			Product.removeWishlist(prodId)
				.success(function(data){
					if(data.success){
 						// refresh the token since we updated our profile
						var httpCache = $cacheFactory.get('$http'); 
						httpCache.remove('/api/user/me');
						Auth.refreshToken() 
 						var intProDuctIndex = _.indexOf($scope.objStoreProducts, _.find($scope.objStoreProducts, {_id: prodId}));
						$scope.objStoreProducts[intProDuctIndex]['isWishListed'] = false;
 					}
				})
		}
	})  