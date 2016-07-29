'use strict'

angular.module('starterApp')
	.factory('Store', function($http, $q){
		var StoreFactory = {};

		StoreFactory.getStoreByUrl = function(storeUrl){
			return $http.get('/api/stores/url/'+storeUrl).success(function(data){
				return data;
			})
		} 

		StoreFactory.getStoreByProductId = function(productId){
			return $http.get('/api/stores/getbyproductid/'+productId).success(function(data){
				return data;
			})
		} 

		StoreFactory.getStoreProducts = function(storeId){
			return $http.get('/api/stores/'+storeId+'/products').success(function(data){
				return data;
			})
		} 

		StoreFactory.follow = function(storeId){
			return $http.post('/api/stores/follow', {storeId:storeId}).success(function(data){
				return data;
			})
		}

		StoreFactory.unfollow = function(storeId){
			return $http.post('/api/stores/unfollow', {storeId:storeId}).success(function(data){
				return data;
			})
		}

		StoreFactory.followers = function(storeId){
			return $http.get('/api/stores/'+storeId+'/followers').success(function(data){
				return data;
			})
		}

		StoreFactory.followed = function(storeId){
			return $http.get('/api/stores/'+storeId+'/followed').success(function(data){
				return data;
			})
		}

		return StoreFactory;
	}) 