var AlertsFactory = angular.module('AlertsFactory', []);

AlertsFactory.factory('Alerts', ['$http', function ($http){

	function checkSuccess(input){
		if(input == true){
			alert('Feladat sikeresen végrehajtva!');
		} else {
			alert('Nem sikerült a feladatot végehajtani!');
		}
	}

	return {
		checkSuccess: checkSuccess
	}

}]);