var adminModule = angular.module('adminModule', [
	'authController',
	'authFactory'
]);

var authFactory = angular.module('authFactory', []);

/**********************************************************************************
FACTORY - ENCRRYPTING/DECRYPTING PASSWORD
**********************************************************************************/

authFactory.factory('passwordEncryption', function(){

	var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	function encode(input){

	    var output = "";

		if(typeof(input) !== 'undefined'){

		    var chr1, chr2, chr3 = "";
		    var enc1, enc2, enc3, enc4 = "";
		    var i = 0;

		    do {
		        chr1 = input.charCodeAt(i++);
		        chr2 = input.charCodeAt(i++);
		        chr3 = input.charCodeAt(i++);

		        enc1 = chr1 >> 2;
		        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		        enc4 = chr3 & 63;

		        if (isNaN(chr2)) {
		            enc3 = enc4 = 64;
		        } else if (isNaN(chr3)) {
		            enc4 = 64;
		        }

		        output = output +
		            keyStr.charAt(enc1) +
		            keyStr.charAt(enc2) +
		            keyStr.charAt(enc3) +
		            keyStr.charAt(enc4);
		        chr1 = chr2 = chr3 = "";
		        enc1 = enc2 = enc3 = enc4 = "";
		    } while (i < input.length);

		}

	    return output;

	}

	function decode(input){

        var output = "";

		if(typeof(input) !== 'undefined'){

	        var chr1, chr2, chr3 = "";
	        var enc1, enc2, enc3, enc4 = "";
	        var i = 0;

	        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
	        var base64test = /[^A-Za-z0-9\+\/\=]/g;
	        if (base64test.exec(input)) {
	            window.alert("There were invalid base64 characters in the input text.\n" +
	                "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
	                "Expect errors in decoding.");
	        }
	        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	        do {
	            enc1 = keyStr.indexOf(input.charAt(i++));
	            enc2 = keyStr.indexOf(input.charAt(i++));
	            enc3 = keyStr.indexOf(input.charAt(i++));
	            enc4 = keyStr.indexOf(input.charAt(i++));

	            chr1 = (enc1 << 2) | (enc2 >> 4);
	            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	            chr3 = ((enc3 & 3) << 6) | enc4;

	            output = output + String.fromCharCode(chr1);

	            if (enc3 != 64) {
	                output = output + String.fromCharCode(chr2);
	            }
	            if (enc4 != 64) {
	                output = output + String.fromCharCode(chr3);
	            }

	            chr1 = chr2 = chr3 = "";
	            enc1 = enc2 = enc3 = enc4 = "";

	        } while (i < input.length);
	        
		}

        return output;

	}

	return {
		encode: encode,
		decode: decode
	}


});

/**********************************************************************************
FACTORY - VALIDATING PASSWORD
**********************************************************************************/

authFactory.factory('passwordValidation', ['$http', function($http){

	function check(username, password, callback){

		$http({
			method: 'POST',
			data: {
				'username': username,
				'password': password
			},
			url: 'custom_module_admin/php/password-validation.php'
		}).then(callback);

	}

	return {
		check: check
	}

}]);
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

