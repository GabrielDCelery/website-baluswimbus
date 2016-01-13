var textEditorFactory = angular.module('textEditorFactory', []);

/**********************************************************************************
FACTORY - EDITING TEXT
**********************************************************************************/

textEditorFactory.factory('textEditor', ['$http', function($http){

	function HtmlString(string){
		this.string = string;
	}

	HtmlString.prototype.replaceAll = function(find, replace){
		this.string = this.string.replace(new RegExp(find, 'g'), replace);
		return this;
	}

	HtmlString.prototype.trimText = function(){
		this.string = this.string.trim();
		return this;
	}

	return {
		HtmlString: HtmlString
	}

}]);