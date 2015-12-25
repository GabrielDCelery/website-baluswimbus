(function(){

	console.log('_main.js is running');

/********************************************************************
VARIABLES
********************************************************************/
	var appWindow = $(window);
	var main = $('main');
	var nav = $('nav');
	var navCollapse = $('#nav-collapse');
	var navSeparatorImages = $('#nav-collapse img');

	var lastScrollTop = 0;

/********************************************************************
EVENT BINDERS
********************************************************************/

	navCollapse.on('click', toggleMenu);
	appWindow.on('scroll', scrollCloseMenu);

	events.on('mobileNavSelectContent', toggleMenu);

/********************************************************************
FUNCTIONS
********************************************************************/

	function toggleMenu(){
		nav.toggleClass('navCollapse');
		main.toggleClass('mainExtend');
		navSeparatorImages.toggle();
	}

	function scrollCloseMenu(event){
		if (appWindow.scrollTop() > lastScrollTop){
			nav.addClass('navCollapse');
			main.addClass('mainExtend');
		}
	}


}());
