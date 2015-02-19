var myApp = angular.module('myApp',[
	'ngRoute',
	'doctorsController'
]);

myApp.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when('/', {
		templateUrl : 'partials/login.html'
	}).
	when('/list' , {
		templateUrl : 'partials/list.html',
		controller : 'ListController'
	}).
	when('/doctorprofile/:itemId', {
		templateUrl : 'partials/doctorprofile.html' , 
		controller : 'ProfileViewController'
	}).
	otherwise({
		redirectTo : '/'
	});
}]);