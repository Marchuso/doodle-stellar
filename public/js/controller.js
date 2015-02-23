var doctorsController = angular.module('doctorsController',['ngCookies']);

doctorsController.loggedIn = false ;

//===================================================================================================================//
doctorsController.controller('ListController',['$scope', '$http', '$location', function($scope , $http, $location){
	console.log(doctorsController.loggedIn) ;
	if(doctorsController.loggedIn == false){
		console.log("Trying to authenticate... ") ;
		window.location = '#/signin' ;
	}
	else{
		$http.get('js/data-doctors1.json').success(function(data){
			$scope.doctors = data ;
		});
	}
}]);
//===================================================================================================================//

//===================================================================================================================//
doctorsController.controller('ProfileViewController',['$scope', '$http', '$routeParams', '$location' , function($scope , $http ,$routeParams, $location){
	if(doctorsController.loggedIn == true){
	   $http.get('js/data-doctors1.json').success(function(data){
		  $scope.doctors = data[0] ;
		  $scope.whichItem = routeParams.itemId ;
	   });
    }
    else{
        window.location = "#/signin" ;
    }
}]);
//===================================================================================================================//
doctorsController.controller('SearchController', ['$scope', '$http', '$routeParams', '$location' , function($scope , $http ,$routeParams, $location){
    if(doctorsController.loggedIn == false){
        window.location = '#/signin' ;
    }
    else{

    }
}]) ;
//===================================================================================================================//
doctorsController.controller('AuthenticationController',  function($scope, $http, $routeParams, $location, $cookieStore){

	if(doctorsController.loggedIn == true){
		window.location = "#/" ;
	}
	else{
		$scope.userData = {} ;

    	console.log($cookieStore.get("loggedIn")) ;
    /*
    if($cookieStore.get("loggedIn") === "true"){
        console.log("Caching available ... ") ;
        $scope.loggedIn = true ;
        $scope.userData.user_name = $cookieStore.get("user") ;
    }
    else{
        console.log("Caching not available") ;
    }*/

    	$scope.logIn = function() {
        	var send_data = {"userName" : $scope.logInData.userName, "password": $scope.logInData.password } ;
        	doctorsController.loggedIn = true ;
        	console.log(send_data) ;
        	$http.post('api/v1/LogInUser', send_data)
            	.success(function(data){
                	$scope.loggedIn = true ;
                	$cookieStore.put("loggedIn","true") ;
                    $cookieStore.put("userEmail", data.emailID) ;
                    window.location = '#/' ;
                	//console.log(data[0].password + data.user_name) ;
            	})

            	.error(function(){
                	console.log("Error : "+ data) ;
            	}) ;
    	} ;

    	$scope.logUserOut = function(){
        	$cookieStore.put("loggedIn","false") ;
        	$scope.loggedIn = false ;
    	} ;

        $scope.subscribeUser = function(){
            console.log("Subscribed") ;
        } ;
	}
}).$inject = ['$scope', '$http', '$routeParams', '$location', '$cookieStore' ] ;
//===================================================================================================================//


//doctorsController.controller('LoginController',['$scope', '$http']) ;