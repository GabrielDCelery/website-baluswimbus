(function(){
	
	console.log('_nav.js is running');

/********************************************************************
VARIABLES
********************************************************************/

	var $appWindow = $('window');
	var $navButtons = $('nav li div[id^="nav-"]');
	var $contentBoxes = $('main div[id^="content-"]');

/********************************************************************
EVENT BINDERS
********************************************************************/

	$navButtons.on('click', showSelectedContent);

/********************************************************************
FUNCTIONS
********************************************************************/

	function showSelectedContent(){

		var selectedButtonId = $(this).attr('id')
		selectedButtonId = selectedButtonId.replace("nav-", "");
		var selectedContentId = "content-" + selectedButtonId;

		$contentBoxes.fadeOut("fast");

		$contentBoxes.each(function(index){

			var contentBoxId = $(this).attr('id');

			if(contentBoxId === selectedContentId){
				$(this).fadeIn("fast");
			}

		});

		$appWindow.scrollTop(0);

		if($(window).width() < 700){
			events.emit('toggleMainMenu');
		}


		if(selectedButtonId == 'news'){
			events.emit('getPostsMenu');
		}

	}

}());



