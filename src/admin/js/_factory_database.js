var DatabaseFactory = angular.module('DatabaseFactory', []);

DatabaseFactory.factory('Database', ['$http', function ($http){

	function addNewPost(input, callback){
		$http.post('php/save_post.php', input).then(callback);
	}

	return {
		addNewPost: addNewPost
	}

}]);