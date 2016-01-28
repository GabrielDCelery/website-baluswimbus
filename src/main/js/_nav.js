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

	function getContentId(navId){

		return navId.replace("nav-", "#content-");
		
	}

	function showContent(contentId){

		$contentBoxes.fadeOut("fast");

		if(contentId == '#content-news') events.emit('getPostsMenu');

		$contentBoxes.closest(contentId).fadeIn("fast");

	}

	function showSelectedContent(){

		var selectedContentId = getContentId($(this).attr('id'));

		showContent(selectedContentId);

		$appWindow.scrollTop(0);

		if($(window).width() < 700) events.emit('toggleMainMenu');

	}

}());



