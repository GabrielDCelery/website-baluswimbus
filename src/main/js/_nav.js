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

		if($(window).width() < 700){
			events.emit('toggleMainMenu');
		}
		
	}

}());



