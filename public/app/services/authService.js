'use strict'

angular.module('starterApp')
	.factory('Register', function($http, $q){
		var RegisterFactory = {};

		RegisterFactory.send = function(username, password, storename, fullname){
			return $http.post('/api/auth/register', {
				username: username,
				password: password,
				storename: storename,
				fullname: fullname
			}).success(function(data){
				return data;
			})
		}

		return RegisterFactory;
	})
	.factory('Auth', function($http, $q, AuthToken, $location){
		var AuthFactory = {};

		// login
		AuthFactory.login = function(username, password){
			return $http.post('/api/auth/login', {
				username: username,
				password: password
			}).success(function(data){
				AuthToken.setToken(data.token);
				return data;
			});
		};

		// logout
		AuthFactory.logout = function(){
			AuthToken.setToken();
		};

		// check if user login
		AuthFactory.isLoggedIn = function(){
			if(AuthToken.getToken()){
				return true;
			}else{
				return false;
			}
		}

		// restrict the page
		AuthFactory.restrict = function(){  
			if(AuthFactory.isLoggedIn() == false){
				$location.path('/login');
			} 
		}

		// get user info
		AuthFactory.getUser = function(){
			if(AuthToken.getToken()){ 
				return $http.get('/api/user/me', { cache: true });
			}else{ 
				return $q.reject({'message':'User has no token'})
			}
		}

		// refresh token
		AuthFactory.refreshToken = function(){
			return $http.get('/api/user/refresh').success(function(data){
				if(data.status){
					AuthToken.setToken(data.token);
				}
			});
		}

		return AuthFactory;
	})
	.factory('AuthToken', function($window){
		var AuthTokenFactory = {};

		// get token
		AuthTokenFactory.getToken = function(){
			return $window.localStorage.getItem('token');
		};

		// set/clear token
		AuthTokenFactory.setToken = function(token){
			if(token){
				$window.localStorage.setItem('token', token);
			}else{
				$window.localStorage.removeItem('token');
			}
		} 

		return AuthTokenFactory;
	})
	.factory('AuthInterceptor', function($q, AuthToken, $location){
		var InterceptorFactory = {}

		// attach token to every request
		InterceptorFactory.request = function(config){
			var token = AuthToken.getToken();

			if(token){
				config.headers['x-access-token'] = token;
			}

			return config;
		}

		// redirect if token doesnt authenticate
		InterceptorFactory.responseError = function(response){
			if(response.status = 403){ 
				AuthToken.setToken();
				var redirectPath = $location.path();
				$location.path('/login').search('r', redirectPath);
			}

			return $q.reject(response);
		}

		return InterceptorFactory;
	})