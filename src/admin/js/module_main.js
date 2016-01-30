var AdminApp = angular.module('AdminApp', [
	'ngRoute',
	'ngCookies',
	'AuthCtrl', 
	'AuthFactory',
	'AddNewCtrl',
	'PostsCtrl',
	'ui.tinymce',
	'DatabaseFactory',
	'TextEditorFactory',
	'AlertsFactory'
]);

AdminApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){

	$routeProvider
	.when('/posts', {
		templateUrl: 'templates/_posts.html',
		controller: 'PostsCtrl'
	})
	.when('/addnew', {
		templateUrl: 'templates/_addnew.html',
		controller: 'AddNewCtrl'
	})
	.when('/:id', {
		templateUrl: 'templates/_edit.html',
	})
	.otherwise({
		redirectTo: '/'
	})


}]);