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