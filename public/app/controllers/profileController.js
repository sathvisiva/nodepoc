'use strict'

angular.module('starterApp')
	.controller('profileController', function($scope, $location, Auth, Setting, $rootScope, $cacheFactory){
		Auth.restrict();

		$scope.profile = null;
		$scope.isProfileSuccess = false;
		$scope.isProfileError = false

		Setting.getProfile()
			.success(function(data){
				$scope.profile = data.message; 
			});

		$scope.submitProfile = function(){ 
			Setting.setProfile($scope.profile)
				.success(function(data){
					if(data.success){
						$scope.isProfileSuccess = true;
						$scope.isProfileError = false; 
						$rootScope.rs_hasProfile = true;

						var httpCache = $cacheFactory.get('$http'); 
						httpCache.remove('/api/user/me');
						Auth.refreshToken(); 
					}else{
						$scope.isProfileSuccess = false;
						$scope.isProfileError = true;
					}
				});			
		}
	}) 