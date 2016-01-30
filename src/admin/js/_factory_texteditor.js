var TextEditorFactory = angular.module('TextEditorFactory', []);

TextEditorFactory.factory('TextEditor', ['$http', function ($http){

	function checkInput(input){

		if(!input){
			input = tinyMCE.activeEditor.getContent();
		}

		return input;
	}


	return {
		checkInput: checkInput
	}

}])