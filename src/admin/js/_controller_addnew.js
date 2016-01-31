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
			$location.path('/');
		})

	}

/****************************************************************************
BINDING EVENTS
****************************************************************************/

	$scope.addNewPost = addNewPost;


}]);