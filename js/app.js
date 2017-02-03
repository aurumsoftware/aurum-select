(function () {

	'use strict';
	var dependencies = ['aurum-select'];
	angular.module('aurumSelectDemo', dependencies)

		/* @ngInject */
		.controller('aurumSelectDemoCtrl', function ($scope) {

			$scope.mydata = [
				{id: 1, label: 'Allan'},
				{id: 2, label: 'André'},
				{id: 3, label: 'Felipe'},
				{id: 4, label: 'Gustavo'},
				{id: 5, label: 'Idmar Ramos Junior'},
				{id: 6, label: 'Marcela'}
			];

			$scope.mymodel = {};
		});
})();