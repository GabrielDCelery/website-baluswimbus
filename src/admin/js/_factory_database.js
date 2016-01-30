var DatabaseFactory = angular.module('DatabaseFactory', []);

DatabaseFactory.factory('Database', ['$http', function ($http){

	function getListOfPosts(callback){
		$http.get('php/get_list_of_posts.php').then(callback);
	}

	function getPost(id, callback){
		$http.post('php/get_post.php', id).then(callback);
	}

	function addNewPost(input, callback){
		$http.post('php/save_post.php', input).then(callback);
	}

	function deletePost(id, callback){
		$http.post('php/delete_post.php', id).then(callback);
	}

	function editPost(input, callback){
		$http.post('php/edit_post.php', input).then(callback);
	}

	return {
		getListOfPosts: getListOfPosts,
		getPost: getPost, 
		addNewPost: addNewPost,
		deletePost: deletePost,
		editPost: editPost
	}

}]);