var addNewPostController = angular.module('addNewPostController', []);

addNewPostController.controller('addNewPostCtrl', [
	'$scope',
	'$location',
	'connectToPostsDatabase',
	'textEditor',
	function(
		$scope,
		$location,
		connectToPostsDatabase,
		textEditor
	){

/**********************************************************************************
VARIABLES
**********************************************************************************/

	var textEditorContent = document.getElementById('textEditorContent');

	$scope.post = {
		post_title: '',
		post_date: new Date(),
		post_content: '',
		post_status: 'draft'
	}

/**********************************************************************************
CONTROLLER DEPENDENT FUNCTIONS ENCAPSULATING REPEATED CODE
**********************************************************************************/

	function convertTextForDatabase(input){
		var editableText = new textEditor.HtmlString(input);
		editableText.trimText()
					.replaceAll('"', '&quot;')
					.replaceAll('<div><br></div>', '<p></p>')
					.replaceAll('<div', '<p')
					.replaceAll('/div>', '/p>')
		return editableText;
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

		connectToPostsDatabase.addNewPost(dataForTheDatabase, function (response){
			alert(response.data);
			$location.path('/');
		});
		
	}


}]);

