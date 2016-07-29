'use strict'

angular.module('starterApp')
	.controller('cartController', function($scope, $location, Auth, Cart, $rootScope, $cacheFactory){
		Auth.restrict();

		$scope.objCartlist = null;

		Cart.all().success(function(data){   
			if(data.message && data.message.prods){ 
				var objProducts = data.message.prods;
				var objCarts = data.message.carts;
				var objStores = data.message.stores;

				_.map(objProducts, function(objProd){
					var cartItem = _.find(objCarts, function(c){ return c.productid == objProd._id; }); 
					objProd['isOnSale'] = $scope.$parent.isOnSale(objProd.sale); 
					objProd['saleprice'] = $scope.$parent.getSalePrice(objProd);
					objProd['quantity'] = cartItem.quantity; 
					objProd['cartid'] = cartItem._id; 
					return objProd;
				})    
 
				_.map(objStores, function(objStore){
					objStore['cartItems'] = _.filter(objProducts, {store:{id:objStore._id}});  
					objStore['totalCartPrice'] = _.reduce(objStore['cartItems'], function(total, item){ return total + item.saleprice }, 0)
					return objStore;
				})

				$scope.objCartlist = objStores; 
			}
		});

		$scope.updateCartItem = function(intCartQnty, cartid){
			if(intCartQnty){ 
				Cart.update(cartid, intCartQnty)
					.success(function(data){
						//console.log(data)
					})
			}
		}

		$scope.removeCartItem = function(objCart, $parentIndex, $index){  
			Cart.delete(objCart.cartid).success(function(data){
				if(data.success){ 
					$scope.$parent.homeProductsCartRemove(objCart._id);
					_.remove($scope.objCartlist[$parentIndex]['cartItems'], _.find($scope.objCartlist[$parentIndex]['cartItems'], {"cartid":objCart.cartid}));

					// refresh the token since we updated our profile
					var httpCache = $cacheFactory.get('$http'); 
					httpCache.remove('/api/user/me');
					Auth.refreshToken() 
				}
			}) 
			return false;
		} 
	}) 
	.controller('cartViewController', function($scope, $location, Auth, Cart, $routeParams, $rootScope, $cacheFactory){
		Auth.restrict(); 
		$scope.objCartItems = null;
		$scope.objStore = null;

		Cart.store($routeParams.id)
			.success(function(data){
				if(data.success && data.message){
					$scope.objStore = data.message.store;

					_.map(data.message.prods, function(objProd){
						var cartItem = _.find(data.message.carts, function(c){ return c.productid == objProd._id; }); 
						objProd['quantity'] = cartItem.quantity; 
						objProd['cartid'] = cartItem._id; 
						return objProd;
					})
					$scope.objCartItems = data.message.prods;  
				} 
			})

		$scope.updateCartItem = function(intCartQnty, cartid){
			if(intCartQnty){ 
				Cart.update(cartid, intCartQnty)
					.success(function(data){
						//console.log(data)
					})
			}
		}

		$scope.removeCartItem = function(objCart, $parentIndex, $index){
			Cart.delete(objCart.cartid).success(function(data){
				if(data.success){ 
					_.remove($scope.objCartItems, _.find($scope.objCartItems, {"cartid":objCart.cartid})) 
					$scope.$parent.homeProductsCartRemove(objCart._id); 

					// refresh the token since we updated our profile
					var httpCache = $cacheFactory.get('$http'); 
					httpCache.remove('/api/user/me');
					Auth.refreshToken() 
				}
			}) 
			return false;
		} 
	})




/*
* create cart model 
* add [add to cart] button on product page
* create cart service 
* create Cart route API
* create cart/add cart method in cart api
* create addToCart functionality in productctrl
* create getcart method in cart api
* display carts in cart page
* create sale checker
  display products in cart when viewing a store
* cart page per store
* add remove button in cart item
* add removeFromCart functionality in cartctrl
* update cart item in product page if product exist in cart
* update quantity in cart page
* add updateCart functionality in cartCtrl
* create updatecart method in cart  api
  add submit button
  add submit functionality in cartCtrl
  add submitCart method in cart api

* create is in cart checker in mainctrl
* include cart items in /me api 
* add cart icon in product card 
 */