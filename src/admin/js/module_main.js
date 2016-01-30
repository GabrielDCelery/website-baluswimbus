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