'use strict'

angular.module('starterApp')
	.factory('Category', function($http, $q){
		var CategoryFactory = {};

		var Category = {
			'appliances' : [ 
				'cooking', 
				'electrical', 
				'others' 
			],
			'cars' : [ 
				'accessories', 
				'auv', 
				'motorcycle',
				'parts', 
				'pick-up', 
				'suv', 
				'van',
				'others'
			],
			'clothes' : [ 
				'accessories', 
				'bag', 
				'footwear', 
				'jewelry', 
				'kids',
				'men', 
				'wallet', 
				'women', 
				'others'
			],
			'computers' : [ 
				'accessories', 
				'desktop', 
				'laptops', 
				'monitor', 
				'parts',
				'printer', 
				'scanner', 
				'software', 
				'storage', 
				'others'
			],
			'furniture' : [ 
				'kitchen', 
				'others'
			],
			'mobile' : [ 
				'accessories',
				'phone', 
				'tablet', 
				'others'
			],
			'pets' : [ 
				'accessories',
				'bird', 
				'cat', 
				'dog', 
				'reptile', 
				'others'
			],
			'real_states' : [ 
				'house_and_lot', 
				'farm', 
				'subdivisions', 
				'townhouse', 
				'others' 
			],
			'service' : [ 
				'advertising', 
				'engineering', 
				'others' 
			]
		};

		CategoryFactory.all = function(){
			return Category;
		}

		CategoryFactory.main = function(inputs){
			return _.keys(Category);
		}

		CategoryFactory.sub = function(main){ 
			return Category[main];
		}

		return CategoryFactory;
	}) 