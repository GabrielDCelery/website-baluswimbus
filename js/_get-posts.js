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
