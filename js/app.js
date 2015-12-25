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

(function(){
	
	console.log('_nav.js is running');

/********************************************************************
VARIABLES
********************************************************************/

	var navButtons = $('nav li div[id^="nav-"]');
	var contentBoxes = $('main div[id^="content-"]');

/********************************************************************
EVENT BINDERS
********************************************************************/

	navButtons.on('click', showSelectedContent);

/********************************************************************
FUNCTIONS
********************************************************************/

	function showSelectedContent(){

		var selectedButtonId = $(this).attr('id')
		selectedButtonId = selectedButtonId.replace("nav-", "");
		var selectedContentId = "content-" + selectedButtonId;

		contentBoxes.fadeOut("fast");

		contentBoxes.each(function(index){

			var contentBoxId = $(this).attr('id');

			if(contentBoxId === selectedContentId){
				$(this).fadeIn("fast");
			}

		});

		if($(window).width() < 700){
			events.emit('mobileNavSelectContent');
		}

	}

}());



