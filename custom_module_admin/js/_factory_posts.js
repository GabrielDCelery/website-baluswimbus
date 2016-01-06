var postsFactory = angular.module('postsFactory', []);

/**********************************************************************************
FACTORY - VALIDATING PASSWORD
**********************************************************************************/

postsFactory.factory('connectToPostsDatabase', ['$http', function($http){

	function getList(callback){

		$http({
			method: 'GET',
			url: 'custom_module_admin/php/get-list-of-posts.php'
		}).then(callback);

	}

	function getPosts(arrayOfIds, callback){

		$http({
			method: 'POST',
			url: 'custom_module_admin/php/get-posts.php',
			data: {data: arrayOfIds}
		}).then(callback);

	}

	function addNewPost(postData, callback){
		$http({
			method: 'POST',
			url: 'custom_module_admin/php/addnew-post.php',
			data: {data: postData}
		}).then(callback)
	}

	function updatePost(postData, callback){
		$http({
			method: 'PUT',
			url: 'custom_module_admin/php/update-post.php',
			data: {data: postData}
		}).then(callback)
	}

	function deletePost(id, callback){
		$http({
			method: 'DELETE',
			url: 'custom_module_admin/php/delete-post.php',
			data: {data: id}
		}).then(callback);
	}

	return {
		getList: getList,
		getPosts: getPosts,
		addNewPost: addNewPost,
		updatePost: updatePost,
		deletePost: deletePost
	}

}]);