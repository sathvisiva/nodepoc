'use strict'

angular.module('starterApp', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngTagsInput', 'localytics.directives', 'textAngular'])
	.run(function($rootScope, $location){
		$rootScope.$on('$routeChangeSuccess', function (e, current, pre) {
			var fullUrlPath = $location.path().replace(/^\/|\/$/g, '');
			var pageUrlPath = fullUrlPath.split("/");
			$rootScope.rs_pagePath = pageUrlPath[1] ? pageUrlPath[1] : ''; 

			if(!$rootScope.rs_me){ 
				if(pageUrlPath[0] == '' || pageUrlPath[0] == 'login' || pageUrlPath[0] == 'register') { 
					$rootScope.rs_isHidePublicHeader = true;
				}else{
					$rootScope.rs_isHidePublicHeader = false;
				}
			}else{
				$rootScope.rs_isHidePublicHeader = true;
			}

		});
	})
	.filter("sanitize", ['$sce', function($sce) {
		return function(htmlCode){
			return $sce.trustAsHtml(htmlCode);
		}
	}])
	
	
	
	
	