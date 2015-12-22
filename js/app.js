(function(){

$(document).ready(function(){
	console.log('jquery is running...');	

/********************************************************************
VARIABLES
********************************************************************/
	var main = $('main');
	var nav = $('nav')
	var navCollapse = $('#nav-collapse');
	var navCollapseImages = $('#nav-collapse img');

/********************************************************************
EVENT BINDERS
********************************************************************/

	navCollapse.on('click', toggleMenu);

/********************************************************************
FUNCTIONS
********************************************************************/

	function toggleMenu(){
		nav.toggleClass('navCollapse');
		main.toggleClass('mainExtend');
		navCollapseImages.toggle();
	}

});

}());
