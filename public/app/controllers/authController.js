'use strict'

angular.module('starterApp')
	.controller('loginController', function($scope, $location, Auth, $rootScope, $cookies, $cacheFactory, $routeParams){
		$rootScope.rs_isLoggedIn = Auth.isLoggedIn(); 
		$scope.loginError = '';

		if($rootScope.rs_isLoggedIn){ 
			$location.path('/');
		}

		var strRedirectPath = $routeParams.r ? $routeParams.r : '/';
		console.log(strRedirectPath);

		$scope.submitLogin = function(){
			$rootScope.rs_isManage = false;
			$cookies.remove('omp_isManage');

			var httpCache = $cacheFactory.get('$http');  
			httpCache.remove('/api/user/me');   

			Auth.logout();
			$scope.user = {};

			Auth.login($scope.login.username, $scope.login.password)
				.success(function(data){  
					if(data.status == 'success'){  
						$scope.homeProducts = [];
						$location.path(strRedirectPath).search('r','');
					}else{
						$scope.loginError = data.message;
					} 
				})
		}
	}) 
	.controller('registerController', function($scope, $rootScope, $location, Auth, Register){
		$rootScope.rs_isLoggedIn = Auth.isLoggedIn();
		$scope.registerError = '';
		$scope.registerSuccess = false;

		if($rootScope.rs_isLoggedIn){
			$location.path('/manage/dashboard');
		}

		$scope.submitRegister = function(){
			Register.send($scope.register.username, $scope.register.password, $scope.register.fullname)
				.success(function(data){ 
					if(data.status == 'success'){ 
						//$location.path('/login');
						$scope.registerSuccess = true;
						$scope.registerError = '';
						$scope.register.username = ''; 
						$scope.register.password = '';
						$scope.register.fullname = '';
					}else{
						$scope.registerError = data.message;
					}
				})
		}
	})
	.controller('logoutController', function($scope, $rootScope, $location, $cookies, $cacheFactory, Auth){ 
		$rootScope.rs_isManage = false;
		$scope.homeProducts = [];
		$cookies.remove('omp_isManage');

		var httpCache = $cacheFactory.get('$http');  
		httpCache.remove('/api/user/me');   

		Auth.logout();
		$scope.user = {}; 
		//$location.path('/login');
		window.location.href = '/login';
	})