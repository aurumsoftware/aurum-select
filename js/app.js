(function () {

	'use strict';
	var dependencies = ['aurum-select'];
	angular.module('aurumSelectDemo', dependencies)

		.controller('aurumSelectDemoCtrl', ['$scope', function ($scope) {
			$scope.mydata = [
				{id: 1, label: 'Allan'},
				{id: 2, label: 'André'},
				{id: 3, label: 'Felipe'},
				{id: 4, label: 'Gustavo'},
				{id: 5, label: 'Idmar Ramos Junior'},
				{id: 6, label: 'Marcela'}
			];

			$scope.customData = [
				{"documentText":"${Logo_escritório}","label":"Logo","group":0,"positionInTheGroup":0},
				{"documentText":"${Nome_escritório}","label":"Nome","group":0,"positionInTheGroup":1},
				{"documentText":"${CPF/CNPJ_escritório}","label":"CPF/CNPJ","group":0,"positionInTheGroup":2},
				{"documentText":"${CCM_escritório}","label":"CCM","group":0,"positionInTheGroup":3},
				{"documentText":"${OAB_escritório}","label":"OAB","group":0,"positionInTheGroup":4},
				{"documentText":"${Telefone_escritório}","label":"Telefone","group":0,"positionInTheGroup":5},
				{"documentText":"${Email_escritório}","label":"Email","group":0,"positionInTheGroup":6},
				{"documentText":"${Site_escritório}","label":"Site","group":0,"positionInTheGroup":7},
				{"documentText":"${Endereço_escritório}","label":"Endereço","group":0,"positionInTheGroup":8}
			];

			$scope.mymodel = {};
		}]);
})();