(function(){

	console.log('_main.js is running');

/********************************************************************
VARIABLES
********************************************************************/

	var $appWindow = $(window);
	var $main = $('main');
	var $nav = $('nav');
	var $navCollapse = $('#nav-collapse');
	var $navSeparatorImages = $('#nav-collapse img');
	var $navSeparatorImagesArrowDown = $('#nav-collapse img:first-of-type');
	var $navSeparatorImagesArrowUp = $('#nav-collapse img:last-of-type');

	var lastScrollTop = 0;


/********************************************************************
EVENT BINDERS
********************************************************************/

	$navCollapse.on('click', toggleMainMenu);
	$appWindow.on('scroll', scrollToggleMainMenu);
	$appWindow.on('mousewheel', mousewheelToggleMainMenu);

	events.on('toggleMainMenu', toggleMainMenu);

/********************************************************************
FUNCTIONS
********************************************************************/

	function toggleMainMenu(){
		$nav.toggleClass('navCollapse');
		$main.toggleClass('mainExtend');
		$navSeparatorImages.toggle();
	}

	function scrollToggleMainMenu(event){

		if ($appWindow.scrollTop() != lastScrollTop && $appWindow.scrollTop() != 0){
			closeMainMenu();
		}

		if ($appWindow.scrollTop() != lastScrollTop && $appWindow.scrollTop() == 0){
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


}());
