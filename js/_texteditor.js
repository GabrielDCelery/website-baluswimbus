(function(){

/******************************************************************************************
Declaring variables
******************************************************************************************/

	var $textEditorContent = $('#textEditorContent');
	var $functionButtons = $('.functionButton');
	var functionButtons = '.functionButton';
	var $functionSelects = $('.functionSelect');
	var functionSelects = '.functionSelect';

	var $saveIntoDatabase = $('#textEditorSaveIntoDatabase');
	var $saveAsDraft = $('#textEditorSaveAsDraft');

/******************************************************************************************
Binding events
******************************************************************************************/

	$(document).on('mousedown', functionButtons, buttonDown);
	$(document).on('mouseup', functionButtons, buttonUp);
	$(document).on('mouseleave', functionButtons, buttonUp);

	$(document).on('change', functionSelects, changeSelection);
	$(document).on('mouseleave', functionSelects, changeSelection);

/******************************************************************************************
Doc formatting functions
******************************************************************************************/

	function formatDoc(contentArea, commandName, argumentValue) {
		document.execCommand(commandName, false, argumentValue);
		contentArea.focus();
	}

	function buttonDown(){
		var clickedDiv = $(this);
		var id = clickedDiv.attr('id');
		id = id.replace('functionButton-', '');
		clickedDiv.addClass('clicked');
		formatDoc($textEditorContent, id);
	}

	function buttonUp(){
		var clickedDiv = $(this);
		clickedDiv.removeClass('clicked');
	}

	function changeSelection(){
		var selectedOption = $(this);
		var selectedSelect = selectedOption.closest('select');
		var id = selectedSelect.attr('id');
		id = id.replace('functionSelect-', '');
		var argumentValue = selectedOption.val();
		formatDoc($textEditorContent, id, argumentValue);
	}

}())

