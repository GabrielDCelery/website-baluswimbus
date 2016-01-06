var adminModule = angular.module('adminModule', [
	'ngRoute',
	'authController',
	'authFactory',
	'postListController',
	'addNewPostController',
	'detailedPostController',
	'postsFactory',
	'textEditorFactory'
]);


adminModule.config(['$routeProvider', function($routeProvider){

	$routeProvider.when('/', {
		templateUrl: 'custom_module_admin/templates/_main.html',
		controller: 'postListCtrl'
	}).when('/addnew', {
		templateUrl: 'custom_module_admin/templates/_addnew.html',
		controller: 'addNewPostCtrl'
	}).when('/:id', {
		templateUrl: 'custom_module_admin/templates/_post.html',
		controller: 'detailedPostCtrl'
	}).otherwise({
		redirectTo: '/'
	})

}]);

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


var postsFactory = angular.module('postsFactory', []);

/**********************************************************************************
FACTORY - VALIDATING PASSWORD
**********************************************************************************/

postsFactory.factory('connectToPostsDatabase', ['$http', function($http){

	function getList(callback){

		$http({
			method: 'GET',
			url: 'custom_module_admin/php/get-list-of-posts.php'
		}).then(callback);

	}

	function getPosts(arrayOfIds, callback){

		$http({
			method: 'POST',
			url: 'custom_module_admin/php/get-posts.php',
			data: {data: arrayOfIds}
		}).then(callback);

	}

	function updatePost(postData, callback){
		$http({
			method: 'PUT',
			url: 'custom_module_admin/php/update-post.php',
			data: {data: postData}
		}).then(callback)
	}

	function deletePost(id, callback){
		$http({
			method: 'DELETE',
			url: 'custom_module_admin/php/delete-post.php',
			data: {data: id}
		}).then(callback);
	}

	return {
		getList: getList,
		getPosts: getPosts,
		updatePost: updatePost,
		deletePost: deletePost
	}

}]);
var textEditorFactory = angular.module('textEditorFactory', []);

/**********************************************************************************
FACTORY - EDITING TEXT
**********************************************************************************/

textEditorFactory.factory('textEditor', ['$http', function($http){

	function HtmlString(string){
		this.string = string;
	}

	HtmlString.prototype.replaceAll = function(find, replace){
		this.string = this.string.replace(new RegExp(find, 'g'), replace);
		return this;
	}

	HtmlString.prototype.trimText = function(){
		this.string = this.string.trim();
		return this;
	}

	return {
		HtmlString: HtmlString
	}

}]);
var addNewPostController = angular.module('addNewPostController', []);

addNewPostController.controller('addNewPostCtrl', ['$scope', function($scope){

}]);


var detailedPostController = angular.module('detailedPostController', ['ngRoute']);

detailedPostController.controller('detailedPostCtrl', [
	'$scope', 
	'$routeParams',
	'connectToPostsDatabase',
	'textEditor',
	function(
		$scope, 
		$routeParams,
		connectToPostsDatabase,
		textEditor
	){

/**********************************************************************************
VARIABLES
**********************************************************************************/

	var id = [$routeParams.id];
	var textEditorContent = document.getElementById('textEditorContent');

	$scope.post = {
		id: 0,
		post_title: '',
		post_date: new Date(),
		post_content: '',
		post_status: 'active'
	}

/**********************************************************************************
CONTROLLER DEPENDENT FUNCTIONS ENCAPSULATING REPEATED CODE
**********************************************************************************/

	function convertTextForEditing(input){

		var editableText = new textEditor.HtmlString(input);
		editableText.replaceAll('<p></p>', '<div><br></div>')
					.replaceAll('<p>', '<div>')
					.replaceAll('</p>', '</div>');
		return editableText;

	}

	function convertTextForDatabase(input){
		var editableText = new textEditor.HtmlString(input);
		editableText.replaceAll('<div><br></div>', '<p></p>')
					.replaceAll('<div', '<p')
					.replaceAll('/div>', '/p>')
		return editableText;
	}

/**********************************************************************************
CONTROLLER DEPENDENT FUNCTIONS ENCAPSULATING REPEATED CODE
**********************************************************************************/

	function renderPage(id){
		connectToPostsDatabase.getPosts(id, function (response){

			$scope.post.id = response.data[0].id;
			$scope.post.post_title = response.data[0].post_title;
			$scope.post.post_date = new Date(response.data[0].post_date);
			$scope.post.post_status = response.data[0].post_status;

			var htmlString = response.data[0].post_content;
			htmlString = convertTextForEditing(htmlString).string;

			$scope.post.post_content = htmlString;
			textEditorContent.innerHTML = htmlString;

		});
	}

/**********************************************************************************
FUNCTIONS ON THE HTML PAGE
**********************************************************************************/

	$scope.saveIntoDatabase = function(input){

		$scope.post.post_status = input;

		var htmlString = textEditorContent.innerHTML;
		htmlString = convertTextForDatabase(htmlString).string;

		$scope.post.post_content = htmlString;
		
		var dataForTheDatabase = $scope.post;

		connectToPostsDatabase.updatePost(dataForTheDatabase, function (response){
			alert(response.data);
			renderPage(id);
		})

	}

/**********************************************************************************
DEFAULT FUNCTION INITIATED UPON LOADING
**********************************************************************************/	

	renderPage(id);


}]);


var postListController = angular.module('postListController', []);

postListController.controller('postListCtrl', [
	'$scope', 
	'connectToPostsDatabase', 
	function(
		$scope, 
		connectToPostsDatabase
	){

/**********************************************************************************
VARIABLES
**********************************************************************************/

	$scope.listOfIds = [];
	$scope.numberOfPostsPerPage = 3;
	
	$scope.listOfPages = [];
	$scope.listOfPosts = [];

	$scope.selectedPage;

/**********************************************************************************
PURE FUNCTIONS ENCAPSULATING REPEATED CODE
**********************************************************************************/

	function calculateMenu(listOfIds, numberOfPostsPerPage){

		var numberOfPosts = listOfIds.length;
		var numberOfPages = Math.ceil(numberOfPosts / numberOfPostsPerPage);
		var listOfPages = [];
		for(var i = 1; i <= numberOfPages; i++){
			listOfPages.push(i);
		}

		return listOfPages;
	}

	function calculatePosts(listOfIds, pageNumber, numberOfPostsPerPage){

		var arrayOfIds = [];
		var firstPost = (pageNumber - 1) * numberOfPostsPerPage;
		var lastPost = (pageNumber - 1) * numberOfPostsPerPage + numberOfPostsPerPage;

		for(var i = firstPost; i < lastPost; i++){
			if(typeof(listOfIds[i]) !== 'undefined'){
				arrayOfIds.push(listOfIds[i].id);
			}
		}

		return arrayOfIds;
	}

/**********************************************************************************
CONTROLLER DEPENDENT FUNCTIONS ENCAPSULATING REPEATED CODE
**********************************************************************************/

	function renderPosts(pageNumber){

		$scope.selectedPage = pageNumber;

		var arrayOfIds = calculatePosts($scope.listOfIds, $scope.selectedPage, $scope.numberOfPostsPerPage);

		connectToPostsDatabase.getPosts(arrayOfIds, function (response){
			$scope.listOfPosts = response.data;
		});

	}

	function renderOpeningPage(){

		connectToPostsDatabase.getList(function (response){

			$scope.listOfIds = response.data;
			$scope.listOfPages = calculateMenu($scope.listOfIds, $scope.numberOfPostsPerPage);

			renderPosts(1);
		
		});
	}

/**********************************************************************************
FUNCTIONS ON THE HTML PAGE
**********************************************************************************/

	$scope.switchPage = function(pageNumber){

		renderPosts(pageNumber);

	}

	$scope.deletePost = function(id){

		var confirmDelete = confirm("Biztosan törölni akarja a bejegyzést?");

		if(confirmDelete){

			connectToPostsDatabase.deletePost(id, function(response){

				alert(response.data);
				renderOpeningPage();

			});

		}

	}

/**********************************************************************************
DEFAULT FUNCTION INITIATED UPON LOADING
**********************************************************************************/

	renderOpeningPage();

}]);

