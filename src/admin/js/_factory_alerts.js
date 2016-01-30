var AlertsFactory = angular.module('AlertsFactory', []);

AlertsFactory.factory('Alerts', ['$http', function ($http){

	function confirmChange(callback){
		var confirmed = confirm('Biztosan végre szeretné hajtani a változtatásokat?');
		if(confirmed){
			callback();
		}
	}

	function checkSuccess(input){
		if(input == true){
			alert('Feladat sikeresen végrehajtva!');
		} else {
			alert('Nem sikerült a feladatot végehajtani!');
		}
	}

	return {
		checkSuccess: checkSuccess,
		confirmChange: confirmChange
	}

}]);