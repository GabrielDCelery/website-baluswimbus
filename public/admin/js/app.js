var AdminApp = angular.module('AdminApp', [
	'ngRoute',
	'ngCookies',
	'AuthCtrl', 
	'AuthFactory',
	'AddNewCtrl',
	'PostsCtrl',
	'EditCtrl',
	'ui.tinymce',
	'DatabaseFactory',
	'TextEditorFactory',
	'AlertsFactory'
]);

AdminApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){

	$routeProvider
	.when('/', {
		templateUrl: 'templates/_addnew.html',
		controller: 'AddNewCtrl'
	})
	.when('/posts', {
		templateUrl: 'templates/_posts.html',
		controller: 'PostsCtrl'
	})
	.when('/:id', {
		templateUrl: 'templates/_edit.html',
		controller: 'EditCtrl'
	})
	.otherwise({
		redirectTo: '/'
	})


}]);
var AuthCtrl = angular.module('AuthCtrl', []);

AuthCtrl.controller('AuthCtrl', ['$scope', 'AuthFactory', function ($scope, AuthFactory){

/****************************************************************************
VARIABLES
****************************************************************************/

	$scope.loggedIn = false;

/****************************************************************************
FUNCTIONS
****************************************************************************/

	function loginUser(username, password){
		AuthFactory.login(username, password, function (response){

			if(response.data){

				$scope.loggedIn = true;
				AuthFactory.setLoginCookie(username, password);

			} else {

				$scope.loggedIn = false;

			}

		});
	}

	function logoutUser(){
		$scope.loggedIn = false;
		AuthFactory.clearLoginCookie();
	}

	function loginWithCookie(callback){

		AuthFactory.getLoginCookie(callback)

	}

/****************************************************************************
CONTROLLER RELATED FUNCTIONS
****************************************************************************/

	$scope.login = loginUser;
	$scope.logout = logoutUser;

/****************************************************************************
INVOKED FUNCTION UPON LOADING
****************************************************************************/

	loginWithCookie(loginUser)

}]);
var AuthFactory = angular.module('AuthFactory', []);

AuthFactory.factory('AuthFactory', ['$http', '$cookies', function ($http, $cookies){

	function login(username, password, callback){
		$http.post('php/login.php', {username: username, password: password}).success(callback);
	}

	function setLoginCookie(username, password){
		var authUsername = Base64.encode(username);
		var authPassword = Base64.encode(password);

		var user = {
			username: authUsername,
			password: authPassword
		}

		$cookies.putObject('userCookie', user);
	}

	function clearLoginCookie(){
		$cookies.remove('userCookie');
	}

	function getLoginCookie(callback){
		var authCookie = $cookies.getObject('userCookie');
		if(authCookie){
			var username = Base64.decode(authCookie.username);
			var password = Base64.decode(authCookie.password);

			callback(username, password);
		}
	}

	// Base64 encoding service used by AuthenticationService
	var Base64 = {

		keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

		encode: function (input) {
			var output = "";
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
					this.keyStr.charAt(enc1) +
					this.keyStr.charAt(enc2) +
					this.keyStr.charAt(enc3) +
					this.keyStr.charAt(enc4);
				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";
			} while (i < input.length);

			return output;
		},

		decode: function (input) {
			var output = "";
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
				enc1 = this.keyStr.indexOf(input.charAt(i++));
				enc2 = this.keyStr.indexOf(input.charAt(i++));
				enc3 = this.keyStr.indexOf(input.charAt(i++));
				enc4 = this.keyStr.indexOf(input.charAt(i++));

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

			return output;
		}
	};


	return {
		login: login,
		setLoginCookie: setLoginCookie,
		clearLoginCookie: clearLoginCookie,
		getLoginCookie: getLoginCookie
	}


}]);
var AddNewCtrl = angular.module('AddNewCtrl', []);

AddNewCtrl.controller('AddNewCtrl', [
	'$scope', 
	'TextEditor', 
	'Database', 
	'Alerts',
	function (
		$scope, 
		TextEditor, 
		Database,
		Alerts
){

/****************************************************************************
VARIABLES
****************************************************************************/

	$scope.postData = {
		title: '',
		date: new Date(),
		input: '',
		status: ''
	}

/****************************************************************************
FUNCTIONS
****************************************************************************/

	function addNewPost(status){

		$scope.postData.input = TextEditor.checkInput($scope.tinymceModel);
		$scope.postData.status = status;

		Database.addNewPost($scope.postData, function (response){
			Alerts.checkSuccess(response.data);
		})

	}

/****************************************************************************
BINDING EVENTS
****************************************************************************/

	$scope.addNewPost = addNewPost;


}]);
var PostsCtrl = angular.module('PostsCtrl', []);

PostsCtrl.controller('PostsCtrl', ['$scope', 'Alerts', 'Database', function ($scope, Alerts, Database){

/*****************************************************************************************
VARIABLES
*****************************************************************************************/

	$scope.listOfPosts;
	$scope.sortField = 'date';
	$scope.reverseOrder = true;

/*****************************************************************************************
FUNCTIONS
*****************************************************************************************/

	function getListOfPosts(){
		Database.getListOfPosts(function(response){
			$scope.listOfPosts = response.data;
		})
	}

	function deletePost(id){
		Alerts.confirmChange(function(){
			Database.deletePost(id, function(response){
				Alerts.checkSuccess(response.data);
				getListOfPosts();
			})
		});
	}

/*****************************************************************************************
BINDING FUNCTIONS
*****************************************************************************************/

	$scope.deletePost = deletePost;

/*****************************************************************************************
INITIATING FUNCTION UPON LOADING
*****************************************************************************************/

	getListOfPosts();

}]);
var EditCtrl = angular.module('EditCtrl', ['ui.tinymce']);

EditCtrl.controller('EditCtrl', [
	'$scope', 
	'$location', 
	'$routeParams', 
	'TextEditor',
	'Alerts', 
	'Database', 
	function (
		$scope, 
		$location,
		$routeParams, 
		TextEditor, 
		Alerts, 
		Database
){

/****************************************************************************
VARIABLES
****************************************************************************/

	$scope.postData = {
		id: $routeParams.id,
		title: '',
		date: new Date(),
		input: '',
		status: ''
	}

/****************************************************************************
FUNCTION
****************************************************************************/

	function getPost(id){

		Database.getPost(id, function (response){
			var data = response.data[0];
			$scope.postData.title = data['post_title'];
			$scope.postData.date = new Date(data['post_date']);
			$scope.postData.input = data['post_content'];
			$scope.postData.status = data['post_status'];
		})

	}

	function editPost(){

		Database.editPost($scope.postData, function (response){
			Alerts.checkSuccess(response.data);
			$location.path('/posts');
		})

	}

/****************************************************************************
BINDING EVENTS
****************************************************************************/

	$scope.editPost = editPost;

/****************************************************************************
INITITATING FUNCTIONS
****************************************************************************/

	getPost($scope.postData.id);


}]);
var DatabaseFactory = angular.module('DatabaseFactory', []);

DatabaseFactory.factory('Database', ['$http', function ($http){

	function getListOfPosts(callback){
		$http.get('php/get_list_of_posts.php').then(callback);
	}

	function getPost(id, callback){
		$http.post('php/get_post.php', id).then(callback);
	}

	function addNewPost(input, callback){
		$http.post('php/save_post.php', input).then(callback);
	}

	function deletePost(id, callback){
		$http.post('php/delete_post.php', id).then(callback);
	}

	function editPost(input, callback){
		$http.post('php/edit_post.php', input).then(callback);
	}

	return {
		getListOfPosts: getListOfPosts,
		getPost: getPost, 
		addNewPost: addNewPost,
		deletePost: deletePost,
		editPost: editPost
	}

}]);
var TextEditorFactory = angular.module('TextEditorFactory', []);

TextEditorFactory.factory('TextEditor', ['$http', function ($http){

	function checkInput(input){

		if(!input){
			input = tinyMCE.activeEditor.getContent();
		}

		return input;
	}


	return {
		checkInput: checkInput
	}

}])
var AlertsFactory = angular.module('AlertsFactory', []);

AlertsFactory.factory('Alerts', ['$http', function ($http){

	function confirmChange(callback){
		var confirmed = confirm('Biztosan végre szeretné hajtani a változtatásokat?');
		if(confirmed){
			callback();
		}
	}

	function checkSuccess(input){
		if(input == true){
			alert('Feladat sikeresen végrehajtva!');
		} else {
			alert('Nem sikerült a feladatot végehajtani!');
		}
	}

	return {
		checkSuccess: checkSuccess,
		confirmChange: confirmChange
	}

}]);