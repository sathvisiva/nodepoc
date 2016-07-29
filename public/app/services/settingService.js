'use strict'

angular.module('starterApp')
	.factory('Setting', function($http, $q){
		var SettingFactory = {};

		SettingFactory.getStore = function(){
			return $http.get('/api/settings').success(function(data){
				return data;
			})
		}

		SettingFactory.setStore = function(inputs){
			return $http.post('/api/settings', inputs, {
				transformRequest:angular.identity,
				headers:{'Content-Type':undefined}
			}).success(function(data){
				return data;
			})
		}

		SettingFactory.checkStore = function(lowername){
			return $http.get('/api/settings/check/'+lowername).success(function(data){
				return data;
			})
		}

		SettingFactory.getProfile = function(){
			return $http.get('/api/settings/profile').success(function(data){
				return data;
			})
		}

		SettingFactory.setProfile = function(inputs){
			return $http.post('/api/settings/profile', inputs).success(function(data){
				return data;
			})
		} 

		return SettingFactory;
	}) 