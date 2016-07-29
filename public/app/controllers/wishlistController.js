'use strict'

angular.module('starterApp')
	.controller('wishlistController', function($scope, $location, Auth, Product, $cacheFactory, $window){
		Auth.restrict();

		$scope.arrWishlists = null;
		$scope.wishlistProducts = []
		$scope.wishlistPageNum = 1;
		$scope.wishlistProductsEnd = false;
		$scope.boolIsWishlistLoading = false;

		Product.getWishlist($scope.wishlistPageNum).success(function(data){
			if(data.success && data.message && data.message.length){
				$scope.wishlistProductsEnd = data.message.length < 28 ? true : false;
				$scope.arrWishlists = data.message;
			} 
			$scope.wishlistPageNum++; 
		}); 

		$scope.removeFromWishlist = function(prodId){ 
			Product.removeWishlist(prodId)
				.success(function(data){
					if(data.success){
 						// refresh the token since we updated our profile
						var httpCache = $cacheFactory.get('$http'); 
						httpCache.remove('/api/user/me');
						Auth.refreshToken() 
 						
 						_.remove($scope.arrWishlists, _.find($scope.arrWishlists, {"_id":prodId}))
 					}
				})

			return false;
		}

		$window.onscroll = function(){  
			if(!$scope.boolIsWishlistLoading && angular.element('#wishlistProducts').length && !$scope.wishlistProductsEnd){  
		 		var intOffset = this.pageYOffset + this.outerHeight;
		 		var intPageHeight = angular.element('body')[0].clientHeight;
		 		var intDistance = intPageHeight - intOffset; 

		 		if(intDistance < 300){ 
		 			$scope.boolIsWishlistLoading = true;
		 			Product.getWishlist($scope.wishlistPageNum).success(function(data){ 
						if(data.success){
							$scope.wishlistProductsEnd = data.message.length < 28 ? true : false;
							_.map(data.message, function(objProd){  
								$scope.wishlistProducts.push(objProd);
							})
						} 
						$scope.boolIsWishlistLoading = false;
						$scope.wishlistPageNum++; 
					});
		 		}
		 	} 
	 	}
	}) 