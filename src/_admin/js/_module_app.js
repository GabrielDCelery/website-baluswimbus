var adminModule = angular.module('adminModule', [
	'ngRoute',
	'authController',
	'authFactory',
	'postListController',
	'addNewPostController',
	'detailedPostController',
	'postsFactory',
	'TextEditorFactory'
]);


adminModule.config(['$routeProvider', function($routeProvider){

	$routeProvider.when('/', {
		templateUrl: 'admin/templates/_main.html',
		controller: 'postListCtrl'
	}).when('/addnew', {
		templateUrl: 'admin/templates/_addnew.html',
		controller: 'addNewPostCtrl'
	}).when('/:id', {
		templateUrl: 'admin/templates/_post.html',
		controller: 'detailedPostCtrl'
	}).otherwise({
		redirectTo: '/'
	})

}]);
