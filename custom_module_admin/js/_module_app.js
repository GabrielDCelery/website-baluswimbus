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
