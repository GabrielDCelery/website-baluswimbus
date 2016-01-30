var DatabaseFactory = angular.module('DatabaseFactory', []);

DatabaseFactory.factory('Database', ['$http', function ($http){

	function getListOfPosts(callback){
		$http.get('php/get_list_of_posts.php').then(callback);
	}

	function addNewPost(input, callback){
		$http.post('php/save_post.php', input).then(callback);
	}

	function deletePost(id, callback){
		$http.post('php/delete_post.php', id).then(callback);
	}

	return {
		getListOfPosts: getListOfPosts,
		addNewPost: addNewPost,
		deletePost: deletePost
	}

}]);