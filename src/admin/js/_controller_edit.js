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