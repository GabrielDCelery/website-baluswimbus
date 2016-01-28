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
