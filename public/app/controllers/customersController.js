'use strict'

angular.module('starterApp') 
	.controller('customersController', function($scope, $location, Auth){
		Auth.restrict(); 
	})
	.controller('customersViewController', function($scope, $location, $routeParams, Auth){
		Auth.restrict(); 
	})
	.controller('customersAddController', function($scope, $location, Auth){
		Auth.restrict(); 
	})
	.controller('customersEditController', function($scope, $location, Auth, $routeParams){
		Auth.restrict(); 
	})
	.controller('customersDeleteController', function($scope, $location, Auth, $routeParams){
		Auth.restrict();  
	})