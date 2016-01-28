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
	var $navCollapse = $('#nav-collapse');
	var $navSeparatorImages = $('#nav-collapse img');
	var $navSeparatorImagesArrowDown = $('#nav-collapse img:first-of-type');
	var $navSeparatorImagesArrowUp = $('#nav-collapse img:last-of-type');

	var lastScrollTop = 0;


/********************************************************************
EVENT BINDERS
********************************************************************/

	$navCollapse.on('click', toggleMainMenu);
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

		if ($appWindow.scrollTop() != lastScrollTop && $appWindow.scrollTop() != 0){
			closeMainMenu();
		}

		if ($appWindow.scrollTop() != lastScrollTop && $appWindow.scrollTop() == 0 && $appWindow.width() > 700){
			openMainMenu();
		}


		lastScrollTop = $appWindow.scrollTop();

	}

	function mousewheelToggleMainMenu(event){

		var mouseDirection = event.originalEvent.deltaY;

		if (mouseDirection > 0){
			closeMainMenu();
		}

		if (mouseDirection < 0 && lastScrollTop == 0){
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

	var $newsContainer = $('#content-news');
	var $postsMenu = $('#content-news .postsMenu');
	var $postsContainer = $('#content-news .postsContainer');

	var getListOfPostsUrl = 'php/get-list-of-posts.php';
	var getPostsUrl = 'php/get-posts.php';

	var listOfIds = [];
	var numberOfPostsPerPage = 3;

/********************************************************************
EVENT BINDERS
********************************************************************/

	events.on('getPostsMenu', getPostsMenu);
	events.on('renderPostsMenu', renderPostsMenu);

	events.on('getPosts', getPosts);
	events.on('renderPosts', renderPosts);

	$postsMenu.on('click', 'li', function(){
		var $li = $(this);
		var data = $li.html();
		events.emit('getPosts', data);
	})

	$postsMenu.on('click', 'select', function(){
		var $select = $(this);
		var data = $select.val();
		events.emit('getPosts', data);
	})

/********************************************************************
FUNCTIONS
********************************************************************/

function getPostsMenu(){
	$.ajax({
		type: 'GET',
		url: getListOfPostsUrl,
		dataType: 'json',
		success: renderPostsMenu
	});
}

function renderPostsMenu(arrayOfIds){

	listOfIds = arrayOfIds;

	var numberOfPosts = listOfIds.length;
	var numberOfPages = Math.ceil(numberOfPosts / numberOfPostsPerPage);

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

	$postsMenu.html(htmlString);

	events.emit('getPosts', 1);

}


function getPosts(pageNumber){

	var arrayofIds = [];
	var firstPost = (pageNumber - 1) * numberOfPostsPerPage;
	var lastPost = (pageNumber - 1) * numberOfPostsPerPage + numberOfPostsPerPage;

	for(var i = firstPost; i < lastPost; i++){
		if(typeof(listOfIds[i]) !== 'undefined'){
			arrayofIds.push(listOfIds[i].id);
		}
	}

	$.ajax({
		type: 'POST',
		data: {data: arrayofIds},
		url: getPostsUrl,
		dataType: 'json',
		success: renderPosts
	});

}

function renderPosts(postData){

	var htmlString = '';

	for(var i = 0; i < postData.length; i++){

		htmlString += '<div class="row">';
		htmlString += '<div class="col-5-6--s content-padding">';
		htmlString += '<p class="post-title">';
		htmlString += postData[i]['post_title'];
		htmlString += '</p>';
		htmlString += '</div>';
		htmlString += '<div class="col-1-6--s content-padding">';
		htmlString += '<p>';
		htmlString += postData[i]['post_date'];
		htmlString += '</p>';
		htmlString += '</div>';
		htmlString += '</div>';
		htmlString += '<div class="row">';
		htmlString += '<div class="col-6-6--s content-padding">';
		htmlString += postData[i]['post_content'];
		htmlString += '</div>';
		htmlString += '</div>';

	}

	$postsContainer.html(htmlString);
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

