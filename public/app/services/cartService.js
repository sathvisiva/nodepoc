'use strict'

angular.module('starterApp')
	.factory('Cart', function($http, $q){
		var CartFactory = {};

		CartFactory.all = function(){
			return $http.get('/api/carts').success(function(data){
				return data;
			})
		}  

		CartFactory.add = function(productId, quantity){
			return $http.post('/api/carts', {productId:productId, quantity:quantity}).success(function(data){
				return data;
			})
		} 

		CartFactory.view = function(cartId){
			return $http.get('/api/carts/'+cartId).success(function(data){
				return data;
			})
		} 

		CartFactory.store = function(storeId){
			return $http.get('/api/carts/store/'+storeId).success(function(data){
				return data;
			})
		}

		CartFactory.update = function(cartId, quantity){
			return $http.put('/api/carts/'+cartId, {quantity:quantity}).success(function(data){
				return data;
			})
		} 

		CartFactory.delete = function(cartId){
			return $http.delete('/api/carts/'+cartId).success(function(data){
				return data;
			})
		} 

		return CartFactory;
	}) 