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

		if(selectedButtonId == 'news'){
			events.emit('getPostsMenu');
		}

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
	console.log(listOfIds)
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

	console.log(arrayofIds)

	$.ajax({
		type: 'POST',
		data: {data: arrayofIds},
		url: getPostsUrl,
		dataType: 'json',
		success: renderPosts
	});

}

function renderPosts(postData){

	console.log(postData);

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
