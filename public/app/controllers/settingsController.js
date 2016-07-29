'use strict'

angular.module('starterApp') 
	.controller('settingsController', function($scope, $rootScope, $location, $cookies, $cacheFactory, Auth, Setting){
		Auth.restrict();

		$scope.settings = null;
		$scope.isSettingsSuccess = false;
		$scope.isSettingsError = false
		$scope.nAvatarImg = "";
		$scope.isNameAvailable = false;

		Setting.getStore()
			.success(function(data){
				$scope.settings = data.message; 
			});

		$scope.checkStore = function(){ 
			if($scope.settings.name && $scope.settings.name.trim()){ 
				Setting.checkStore($scope.settings.name.trim().toLowerCase())
					.success(function(data){ 
						if(data.success && data.message){ 
							$scope.settingsForm.$invalid = true;
							$scope.isNameAvailable =  true; 
						}else{
							$scope.settingsForm.$invalid = false;
							$scope.isNameAvailable =  false;
						}
					})
			}
		}

		// this needs refactoring!!!!
		$scope.editAvatarImage = function(el){ 
			$scope.nAvatarImg = el.files;

			var reader = new FileReader();
			reader.onload = function(e) {
				$scope.$apply(function() { 
					angular.element(el).parent('div').css('background-image', 'url('+reader.result+')')
				});
			};

			// get <input> element and the selected file  
			var imgData = el.files[0];
			reader.readAsDataURL(imgData); 


			angular.element(el).parent('div').addClass('hasImage'); 
			$scope.$apply(); 
		} 

		$scope.removeAvatarImage = function(e){
			angular.element(e.target).parent('div').css('background-image', 'url(/assets/images/add.png)').removeClass('hasImage');
			$scope.nAvatarImg = "";
			$scope.settings.avatar = null
		}

		$scope.submitSettings = function(){ 
			var formData = new FormData(); 
 			formData.append('url', $scope.settings.url)
 			formData.append('urlraw', $scope.settings.urlraw)
 			formData.append('name', $scope.settings.name)
 			formData.append('description', $scope.settings.description)
 			formData.append('theme', $scope.settings.theme)
 			formData.append('avatar', $scope.settings.avatar)

 			angular.forEach($scope.nAvatarImg, function(file){
 				formData.append('nAvatarImg', file)
 			});

			Setting.setStore(formData)
				.success(function(data){
					if(data.success){
						$scope.isSettingsSuccess = true;
						$scope.isSettingsError = false; 

						// check if creating a store - redirect to manage
						if(!$rootScope.rs_isManage){ 
							// turn manage mode
							$rootScope.rs_isManage = true;
							$cookies.put('omp_isManage', true); 

							// refresh the token since we updated our profile
							var httpCache = $cacheFactory.get('$http'); 
							httpCache.remove('/api/user/me');
							Auth.refreshToken() 
							
							// redirect to manage page
							$location.path('/manage/products'); 
						}
					}else{
						$scope.isSettingsSuccess = false;
						$scope.isSettingsError = true;
					}
				});			
		}
	}) 