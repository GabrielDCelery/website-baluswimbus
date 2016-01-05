var postListController = angular.module('postListController', []);

postListController.controller('postListCtrl', [
	'$scope', 
	'connectToPostsDatabase', 
	function(
		$scope, 
		connectToPostsDatabase
	){

/**********************************************************************************
VARIABLES
**********************************************************************************/

	$scope.listOfIds = [];
	$scope.numberOfPostsPerPage = 3;
	
	$scope.listOfPages = [];
	$scope.listOfPosts = [];

	$scope.selectedPage;

/**********************************************************************************
PURE FUNCTIONS ENCAPSULATING REPEATED CODE
**********************************************************************************/

	function calculateMenu(listOfIds, numberOfPostsPerPage){

		var numberOfPosts = listOfIds.length;
		var numberOfPages = Math.ceil(numberOfPosts / numberOfPostsPerPage);
		var listOfPages = [];
		for(var i = 1; i <= numberOfPages; i++){
			listOfPages.push(i);
		}

		return listOfPages;
	}

	function calculatePosts(listOfIds, pageNumber, numberOfPostsPerPage){

		var arrayOfIds = [];
		var firstPost = (pageNumber - 1) * numberOfPostsPerPage;
		var lastPost = (pageNumber - 1) * numberOfPostsPerPage + numberOfPostsPerPage;

		for(var i = firstPost; i < lastPost; i++){
			if(typeof(listOfIds[i]) !== 'undefined'){
				arrayOfIds.push(listOfIds[i].id);
			}
		}

		return arrayOfIds;
	}

/**********************************************************************************
CONTROLLER DEPENDENT FUNCTIONS ENCAPSULATING REPEATED CODE
**********************************************************************************/

	function renderPosts(pageNumber){

		$scope.selectedPage = pageNumber;

		var arrayOfIds = calculatePosts($scope.listOfIds, $scope.selectedPage, $scope.numberOfPostsPerPage);

		connectToPostsDatabase.getPosts(arrayOfIds, function (response){
			$scope.listOfPosts = response.data;
		});

	}

	function renderOpeningPage(){

		connectToPostsDatabase.getList(function (response){

			$scope.listOfIds = response.data;
			$scope.listOfPages = calculateMenu($scope.listOfIds, $scope.numberOfPostsPerPage);

			renderPosts(1);
		
		});
	}

/**********************************************************************************
FUNCTIONS ON THE HTML PAGE
**********************************************************************************/

	$scope.switchPage = function(pageNumber){

		renderPosts(pageNumber);

	}

	$scope.deletePost = function(id){

		var confirmDelete = confirm("Biztosan törölni akarja a bejegyzést?");

		if(confirmDelete){

			connectToPostsDatabase.deletePost(id, function(response){

				alert(response.data);
				renderOpeningPage();

			});

		}

	}

/**********************************************************************************
DEFAULT FUNCTION INITIATED UPON LOADING
**********************************************************************************/

	renderOpeningPage();

}]);

