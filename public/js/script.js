var myApp = angular.module('myApp',[
	'ngRoute',
	'doctorsController'
]);

myApp.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider.
	when('/', {
		templateUrl : 'partials/search.html',
		controller: 'SearchController'
	}).
	when('/list' , {
		templateUrl : 'partials/list.html',
		controller : 'ListController'
	}).
	when('/doctorprofile/:itemId', {
		templateUrl : 'partials/doctorprofile.html' , 
		controller : 'ProfileViewController'
	}).
	when('/signin', {
		templateUrl: 'partials/login.html' ,
		controller: 'AuthenticationController'
	}).
	otherwise({
		redirectTo : '/'
	});

	//$locationProvider.html5Mode(true) ;
}]);