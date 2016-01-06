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

