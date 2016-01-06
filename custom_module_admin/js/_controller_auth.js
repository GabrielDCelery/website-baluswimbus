var authController = angular.module('authController', ['ngCookies']);

authController.controller('authCtrl', [
	'$scope', 
	'$cookies', 
	'passwordEncryption', 
	'passwordValidation',
	function(
		$scope, 
		$cookies, 
		passwordEncryption, 
		passwordValidation
	){

/**********************************************************************************
VARIABLES
**********************************************************************************/

	$scope.display = {
		login: false,
		content: false
	};

	$scope.username = $cookies.get('loginUser');
	$scope.password = $cookies.get('loginPassword');

/**********************************************************************************
FUNCTIONS
**********************************************************************************/

	function setLoginStatus (response){
		if(response.data == 'true'){
			$scope.display.login = false;
			$scope.display.content = true;
		} else {
			$scope.display.login = true;
			$scope.display.content = false;		
		}	
	}

	function login (username, password){
		var encodedPassword = passwordEncryption.encode(password);
		passwordValidation.check(username, encodedPassword, setLoginStatus);

		$cookies.put('loginUser', $scope.username);
		$cookies.put('loginPassword', $scope.password);
	}

	function logout(){
		$scope.display.login = true;
		$scope.display.content = false;
		$cookies.remove('loginUser');
		$cookies.remove('loginPassword');	
	}

/**********************************************************************************
LOGIN
**********************************************************************************/

	login($scope.username, $scope.password);

	$scope.login = login;

	$scope.logout = logout;

}]);

