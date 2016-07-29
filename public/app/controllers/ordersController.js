'use strict'

angular.module('starterApp') 
	.controller('ordersController', function($scope, $location, Auth){
		Auth.restrict(); 
	})
	.controller('ordersViewController', function($scope, $location, $routeParams, Auth){
		Auth.restrict(); 
	})
	.controller('ordersAddController', function($scope, $location, Auth){
		Auth.restrict(); 
	})
	.controller('ordersEditController', function($scope, $location, Auth, $routeParams){
		Auth.restrict(); 
	})
	.controller('ordersDeleteController', function($scope, $location, Auth, $routeParams){
		Auth.restrict();  
	})