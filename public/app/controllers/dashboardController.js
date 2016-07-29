'use strict'

angular.module('starterApp')
	.controller('dashboardController', function($scope, $rootScope, $location, Auth){
		$rootScope.rs_isLoggedIn = Auth.isLoggedIn();

		if($rootScope.rs_isLoggedIn == false){
			$location.path('/login');
		}
	})