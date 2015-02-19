var doctorsController = angular.module('doctorsController',[]);

doctorsController.controller('ListController',['$scope', '$http', function($scope , $http){
	$http.get('js/data-doctors1.json').success(function(data){
		$scope.doctors = data;
	});
}]);


doctorsController.controller('ProfileViewController',['$scope', '$http', '$routeParams' , function($scope , $http ,$routeParams){
	$http.get('js/data-doctors1.json').success(function(data){
		$scope.doctors = data;
		$scope.whichItem = routeParams.itemId;
	});
}]);


doctorsController.controller('LoginController',[]);