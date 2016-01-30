(function(){

	console.log('_get-posts.js is running');

/********************************************************************
VARIABLES
********************************************************************/

	/* Selectors */

	var $newsContainer = $('#content-news');
	var $postsMenu = $('#content-news .postsMenu');
	var $postsContainer = $('#content-news .postsContainer');

	/* URLs */

	var urlToGetListOfPosts = 'php/get-list-of-posts.php';
	var urlToGetPosts = 'php/get-posts.php';

	/* Posts */

	var listOfPostIds = [];
	var numberOfPostsPerPage = 3;

/********************************************************************
EVENT BINDERS
********************************************************************/

	events.on('getPostsMenu', getPostsMenu);
	events.on('renderPostsMenu', renderPostsMenu);

	events.on('getPosts', getPosts);
	events.on('renderPosts', renderPosts);

	$postsMenu.on('click', 'li', function(){
		events.emit('getPosts', $(this).html());
	})

/********************************************************************
FUNCTIONS
********************************************************************/

function getPostsMenu(){
	$.ajax({
		type: 'GET',
		url: urlToGetListOfPosts,
		dataType: 'json',
		success: function(response){
			listOfPostIds = response;
			events.emit('renderPostsMenu', listOfPostIds);
		}
	});
}

function htmlStringForPostsMenu(numberOfPages){

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

	return htmlString;

}

function renderPostsMenu(listOfPostIds){

	var numberOfPages = Math.ceil(listOfPostIds.length / numberOfPostsPerPage);

	$postsMenu.html(htmlStringForPostsMenu(numberOfPages));

	events.emit('getPosts', 1);

}

function calculateWhichPostsToGet(listOfPostIds, pageNumber){

	var filteredListOfPostIds = [];
	var firstPost = (pageNumber - 1) * numberOfPostsPerPage;
	var lastPost = pageNumber * numberOfPostsPerPage;

	for(var i = firstPost; i < lastPost; i++){
		if(typeof(listOfPostIds[i]) !== 'undefined'){
			filteredListOfPostIds.push(listOfPostIds[i].id);
		}
	}

	return filteredListOfPostIds;

}

function getPosts(pageNumber){

	var filteredListOfPostIds = calculateWhichPostsToGet(listOfPostIds, pageNumber);

	$.ajax({
		type: 'POST',
		data: {data: filteredListOfPostIds},
		url: urlToGetPosts,
		dataType: 'json',
		success: renderPosts
	})
	
}

function htmlStringForPosts(postData, titleProperty, dateProperty, contentProperty){

	var htmlString = '';

	for(var i = 0; i < postData.length; i++){
		htmlString += '<div class="row">';
		htmlString += '<div class="col-5-6--s content-padding">';
		htmlString += '<p class="post-title">';
		htmlString += postData[i][titleProperty];
		htmlString += '</p>';
		htmlString += '</div>';
		htmlString += '<div class="col-1-6--s content-padding">';
		htmlString += '<p>';
		htmlString += postData[i][dateProperty];
		htmlString += '</p>';
		htmlString += '</div>';
		htmlString += '</div>';
		htmlString += '<div class="row">';
		htmlString += '<div class="col-6-6--s content-padding">';
		htmlString += postData[i][contentProperty];
		htmlString += '</div>';
		htmlString += '</div>';
	}

	return htmlString;

}

function renderPosts(postData){

	$postsContainer.html(htmlStringForPosts(postData, 'post_title', 'post_date', 'post_content'));

}



}());
