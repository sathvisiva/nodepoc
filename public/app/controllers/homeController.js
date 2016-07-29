'use strict'

angular.module('starterApp')
	.controller('homeController', function($scope, Product, $rootScope, $window, $location, $cacheFactory, Auth){  
		$scope.boolIsHomeLoading = true;

	 	if($rootScope.rs_isLoggedIn && !$rootScope.rs_isManage && $scope.$parent.homeProducts.length == 0){  
			Product.homeProducts($scope.$parent.homePageNum).success(function(data){ 
					if(data.success){  
						$scope.$parent.homeProductsEnd = data.message.length < 28 ? true : false;
						$scope.$parent.homeProducts = _.map(data.message, function(objProduct){
							objProduct['isWishListed'] = $scope.$parent.isWishlisted(objProduct['_id']); 
							objProduct['inCartItem'] = $scope.$parent.isOnCart(objProduct['_id']);  
							return objProduct;
						});  
					}

					$scope.boolIsHomeLoading = false;
					$scope.$parent.homePageNum++; 
				});
	 	}else{
	 		$scope.boolIsHomeLoading = false;
	 	} 

		$scope.addToWishlist = function(prodId){ 
			Product.addWishlist(prodId)
				.success(function(data){
					if(data.success){
 						// refresh the token since we updated our profile
						var httpCache = $cacheFactory.get('$http'); 
						httpCache.remove('/api/user/me');
						Auth.refreshToken()  
 						var intProDuctIndex = _.indexOf($scope.$parent.homeProducts, _.find($scope.$parent.homeProducts, {_id: prodId}));
						$scope.$parent.homeProducts[intProDuctIndex]['isWishListed'] = true;
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
 						var intProDuctIndex = _.indexOf($scope.$parent.homeProducts, _.find($scope.$parent.homeProducts, {_id: prodId}));
						$scope.$parent.homeProducts[intProDuctIndex]['isWishListed'] = false;
 					}
				})
		} 

	 	$window.onscroll = function(){  
			if(!$scope.boolIsHomeLoading && angular.element('#homeProducts').length && !$scope.$parent.homeProductsEnd){  
		 		var intOffset = this.pageYOffset + this.outerHeight;
		 		var intPageHeight = angular.element('body')[0].clientHeight;
		 		var intDistance = intPageHeight - intOffset; 

		 		if(intDistance < 500){
		 			$scope.boolIsHomeLoading = true;
		 			Product.homeProducts($scope.$parent.homePageNum).success(function(data){ 
						if(data.success){
							$scope.$parent.homeProductsEnd = data.message.length < 28 ? true : false;
							_.map(data.message, function(objProd){ 
								objProd['isWishListed'] = $scope.$parent.isWishlisted(objProd['_id']); 
								objProd['inCartItem'] = $scope.$parent.isOnCart(objProd['_id']);  
								$scope.$parent.homeProducts.push(objProd);
							})
						} 
						$scope.boolIsHomeLoading = false;
						$scope.$parent.homePageNum++; 
					});
		 		}
		 	} 
	 	}
	})