var events = {
	events: {},
	on: function(eventName, fn){
		this.events[eventName] = this.events[eventName] || [];
		this.events[eventName].push(fn);
	},
	emit: function(eventName, data){
		if(this.events[eventName]){
			this.events[eventName].forEach(function(fn){
				fn(data);
			})
		}
	}
};
(function(){

	console.log('_main.js is running');

/********************************************************************
VARIABLES
********************************************************************/

	var $appWindow = $(window);
	var $main = $('main');
	var $nav = $('nav');
	var $introContent = $('#content-intro');
	var $navCollapseButton = $('#nav-collapse');
	var $navSeparatorImages = $('#nav-collapse img');
	var $navSeparatorImagesArrowDown = $('#nav-collapse img:first-of-type');
	var $navSeparatorImagesArrowUp = $('#nav-collapse img:last-of-type');

/********************************************************************
EVENT BINDERS
********************************************************************/

	$navCollapseButton.on('click', toggleMainMenu);
	$introContent.on('click', toggleMainMenu);
	$appWindow.on('scroll', scrollToggleMainMenu);
	$appWindow.on('wheel', mousewheelToggleMainMenu);

	events.on('toggleMainMenu', toggleMainMenu);

/********************************************************************
FUNCTIONS
********************************************************************/

	function closeMainMenu(){
		$nav.addClass('navCollapse');
		$main.addClass('mainExtend');
		$navSeparatorImagesArrowDown.hide();
		$navSeparatorImagesArrowUp.show();
	}

	function openMainMenu(){
		$nav.removeClass('navCollapse');
		$main.removeClass('mainExtend');
		$navSeparatorImagesArrowDown.show();
		$navSeparatorImagesArrowUp.hide();
	}

	function toggleMainMenu(){
		$nav.toggleClass('navCollapse');
		$main.toggleClass('mainExtend');
		$navSeparatorImages.toggle();
	}

	function scrollToggleMainMenu(event){

		if ($appWindow.scrollTop() == 0){
			openMainMenu();
		} else {
			closeMainMenu();
		}

	}

	function mousewheelToggleMainMenu(event){

		var mouseDirection = event.originalEvent.deltaY;

		if (mouseDirection > 0){
			closeMainMenu();
		}

		if (mouseDirection < 0 && $appWindow.scrollTop() == 0){
			openMainMenu();
		}

	}


}());

(function(){
	
	console.log('_nav.js is running');

/********************************************************************
VARIABLES
********************************************************************/

	var $appWindow = $('window');
	var $navButtons = $('#mainPageNavBar li div[id^="nav-"]');
	var $contentBoxes = $('main div[id^="content-"]');

/********************************************************************
EVENT BINDERS
********************************************************************/

	$navButtons.on('click', showSelectedContent);

/********************************************************************
FUNCTIONS
********************************************************************/

	function getContentIdSelector(navId){

		return navId.replace("nav-", "#content-");

	}

	function showContent(contentIdSelector){

		$contentBoxes.fadeOut("fast");

		if(contentIdSelector == '#content-news') events.emit('getPostsMenu');

		$contentBoxes.closest(contentIdSelector).fadeIn("fast");

	}

	function showSelectedContent(){

		showContent(getContentIdSelector($(this).attr('id')));

		$appWindow.scrollTop(0);

		events.emit('toggleMainMenu');

	}

}());




(function(){

	console.log('_get-posts.js is running');

/********************************************************************
VARIABLES
********************************************************************/

	/* Selectors */

	var $newsContainer = $('#content-news');
	var $postsMenu = $('#content-news .postsMenu');
	var $postsContainer = $('#content-news .postsContainer');

	/* URLs */

	var urlToGetListOfPosts = 'php/get-list-of-posts.php';
	var urlToGetPosts = 'php/get-posts.php';

	/* Posts */

	var listOfPostIds = [];
	var numberOfPostsPerPage = 3;

/********************************************************************
EVENT BINDERS
********************************************************************/

	events.on('getPostsMenu', getPostsMenu);
	events.on('renderPostsMenu', renderPostsMenu);

	events.on('getPosts', getPosts);
	events.on('renderPosts', renderPosts);

	$postsMenu.on('click', 'li', function(){
		events.emit('getPosts', $(this).html());
	})

/********************************************************************
FUNCTIONS
********************************************************************/

function getPostsMenu(){
	$.ajax({
		type: 'GET',
		url: urlToGetListOfPosts,
		dataType: 'json',
		success: function(response){
			listOfPostIds = response;
			events.emit('renderPostsMenu', listOfPostIds);
		}
	});
}

function htmlStringForPostsMenu(numberOfPages){

	var htmlString = '';
	htmlString += '<select class="postsMenu-mobile">';
	for(var i = 1; i <= numberOfPages; i++){
		htmlString += '<option>' + i + '</option>';
	}
	htmlString += '</select>';
	htmlString += '<ul class="postsMenu-desktop">';
	for(var i = 1; i <= numberOfPages; i++){
		htmlString += '<li>' + i + '</li>';
	}
	htmlString += '</ul>';

	return htmlString;

}

function renderPostsMenu(listOfPostIds){

	var numberOfPages = Math.ceil(listOfPostIds.length / numberOfPostsPerPage);

	$postsMenu.html(htmlStringForPostsMenu(numberOfPages));

	events.emit('getPosts', 1);

}

function calculateWhichPostsToGet(listOfPostIds, pageNumber){

	var filteredListOfPostIds = [];
	var firstPost = (pageNumber - 1) * numberOfPostsPerPage;
	var lastPost = pageNumber * numberOfPostsPerPage;

	console.log(firstPost + ', ' + lastPost)

	for(var i = firstPost; i < lastPost; i++){
		if(typeof(listOfPostIds[i]) !== 'undefined'){
			filteredListOfPostIds.push(listOfPostIds[i].id);
		}
	}

	return filteredListOfPostIds;

}

function getPosts(pageNumber){

	var filteredListOfPostIds = calculateWhichPostsToGet(listOfPostIds, pageNumber);

	$.ajax({
		type: 'POST',
		data: {data: filteredListOfPostIds},
		url: urlToGetPosts,
		dataType: 'json',
		success: renderPosts
	});

}

function htmlStringForPosts(postData, titleProperty, dateProperty, contentProperty){

	var htmlString = '';

	for(var i = 0; i < postData.length; i++){
		htmlString += '<div class="row">';
		htmlString += '<div class="col-5-6--s content-padding">';
		htmlString += '<p class="post-title">';
		htmlString += postData[i][titleProperty];
		htmlString += '</p>';
		htmlString += '</div>';
		htmlString += '<div class="col-1-6--s content-padding">';
		htmlString += '<p>';
		htmlString += postData[i][dateProperty];
		htmlString += '</p>';
		htmlString += '</div>';
		htmlString += '</div>';
		htmlString += '<div class="row">';
		htmlString += '<div class="col-6-6--s content-padding">';
		htmlString += postData[i][contentProperty];
		htmlString += '</div>';
		htmlString += '</div>';
	}

	return htmlString;

}

function renderPosts(postData){

	$postsContainer.html(htmlStringForPosts(postData, 'post_title', 'post_date', 'post_content'));

}




}());

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

}());

