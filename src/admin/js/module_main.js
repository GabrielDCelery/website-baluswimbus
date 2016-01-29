var AdminApp = angular.module('AdminApp', [
	'ngRoute',
	'ngCookies',
	'AuthCtrl', 
	'AuthFactory'
]);

AdminApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){

	$routeProvider
	.when('/posts', {
		templateUrl: 'templates/_posts.html'
	})
	.when('/addnew', {
		templateUrl: 'templates/_addnew.html'
	})
	.otherwise({
		redirectTo: '/'
	})


}]);