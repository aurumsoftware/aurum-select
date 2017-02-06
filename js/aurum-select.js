(function() {

	'use strict';

	angular.module('aurum-select', [])
		.directive('aurumSelect', ['$filter', '$document', '$timeout', function ($filter, $document, $timeout) {

      return {
        restrict: 'AE',
        scope: {
          selectedModel: '=',
          options: '=',
          events: '=',
          search: '@',
          placeholder: '@',
          dynamicTitle: '@',
          ngDisabled: '='
        },

        template: function (element, attributes) {
          var template =  '<div class="select-parent btn-group dropdown-select" ng-class="{active: open}">';
	            template += '<button type="button" ng-disabled="ngDisabled" class="dropdown-toggle arButton" ng-class="settings.buttonClasses" ng-click="toggleDropdown()"><span class="arButtonLabel">{{getButtonText()}}&nbsp;</span><i class="caret"></i></button>';
	            template += '<ul class="dropdown-menu dropdown-menu-form" ng-style="{display: (open) ? \'block\' : \'none\' }" style="overflow: scroll" >';
              // Search
              template += '<li ng-show="enableSearch"><div class="dropdown-header"><input type="text" class="form-control" style="width: 100%;" ng-model="searchFilter" placeholder="{{texts.searchPlaceholder}}" /></li>';
              template += '<li class="presentation" role="presentation" ng-repeat="option in options | filter: searchFilter">';
              template += '<div class="menu-item" data-ng-class="{\'selected\': isChecked(getPropertyForObject(option,settings.idProp)), \'not-selected\': !isChecked(getPropertyForObject(option,settings.idProp))}">';              
              template += '<div class="menu-item-label" role="menuitem" tabindex="-1" ng-click="setSelectedItem(getPropertyForObject(option,settings.idProp))" title="{{getPropertyForObject(option, settings.displayProp)}}" >{{getPropertyForObject(option, settings.displayProp)}}</div>';
              template += '</li>';
              template += '</ul>';
              template += '</div>';

          return template;
        },


        link: function (scope, element, attributes) {

          if ( attributes.dynamicTitle === 'false' ) {
            scope.dynamicTitle = false;
          } else {
            scope.dynamicTitle = true;
          }

          scope.settings = {
            displayProp: 'label',
            idProp: 'id',
            externalIdProp: 'id',
            buttonClasses: 'btn btn-default',
            dynamicTitle: scope.dynamicTitle,
            smartButtonTextConverter: angular.noop
          };

          scope.texts = {
            searchPlaceholder: attributes.search,
            buttonDefaultText: attributes.placeholder || 'Select',
            dynamicButtonTextSuffix: 'checked'
          };

          scope.externalEvents = {
            onItemSelect: angular.noop,
            onInitDone: angular.noop
          };

          if ( attributes.search ) {
            scope.enableSearch = true;
          } else {
            scope.enableSearch = false;
          }

          var dropdownTrigger = element.children()[0];
          
          scope.toggleDropdown = function () {
            scope.open = !scope.open;
            
            $timeout( function(){
              element[0].querySelector('.form-control').focus();
            }, 200 );
          };

          scope.checkboxClick = function (event, id) {
              scope.setSelectedItem(id);
              event.stopImmediatePropagation();
          };

          scope.searchFilter = scope.searchFilter || '';

          angular.extend(scope.settings, scope.extraSettings || []);
          angular.extend(scope.externalEvents, scope.events || []);
          angular.extend(scope.texts, scope.translationTexts);

          scope.singleSelection = true;

          function getFindObj(id) {
              var findObj = {};

              if (scope.settings.externalIdProp === '') {
                  findObj[scope.settings.idProp] = id;
              } else {
                  findObj[scope.settings.externalIdProp] = id;
              }

              return findObj;
          }

          function clearObject(object) {
              for (var prop in object) {
                  delete object[prop];
              }
          }

          if (scope.singleSelection) {
            if (angular.isArray(scope.selectedModel) && scope.selectedModel.length === 0) {
              clearObject(scope.selectedModel);
            }
          }

          var handleCloseOnBlur = function (e) {
              var target = e.target.parentElement;
              var parentFound = false;

              while (angular.isDefined(target) && target !== null && !parentFound) {
                   if (_.contains(target.className.split(' '), 'select-parent') && !parentFound) {
                      if(target === dropdownTrigger) {
                          parentFound = true;
                      }
                  }
                  target = target.parentElement;
              }

              if (!parentFound) {
                  scope.$apply(function () {
                      scope.open = false;
                  });
              }
          };
          $document.on('click', handleCloseOnBlur);

          scope.$on('$destroy', function() {
            if (scope.settings.closeOnBlur) {
              $document.off('click', handleCloseOnBlur);
            }
          });

          scope.getButtonText = function () {
            if (scope.settings.dynamicTitle && angular.isObject(scope.selectedModel) && (scope.selectedModel.length > 0 || _.keys(scope.selectedModel).length > 0)) {
              var itemsText = [];

              angular.forEach(scope.options, function (optionItem) {
                if (scope.isChecked(scope.getPropertyForObject(optionItem, scope.settings.idProp))) {
                  var displayText = scope.getPropertyForObject(optionItem, scope.settings.displayProp);
                  var converterResponse = scope.settings.smartButtonTextConverter(displayText, optionItem);

                  itemsText.push(converterResponse ? converterResponse : displayText);
                }
              });

              if (scope.selectedModel.length > scope.settings.smartButtonMaxItems) {
                itemsText = itemsText.slice(0, scope.settings.smartButtonMaxItems);
                itemsText.push('...');
              }

              return itemsText.join(', ');
            } else {
              return scope.texts.buttonDefaultText;
            }
          };

          scope.getPropertyForObject = function (object, property) {
            if (angular.isDefined(object) && object.hasOwnProperty(property)) {
              return object[property];
            }
            return '';
          };

          scope.setSelectedItem = function (id, dontRemove) {
            var findObj = getFindObj(id);
            var finalObj = null;

            if (scope.settings.externalIdProp === '') {
              finalObj = _.find(scope.options, findObj);
            } else {
              finalObj = findObj;
            }

            clearObject(scope.selectedModel);
            angular.extend(scope.selectedModel, finalObj);
            scope.externalEvents.onItemSelect(finalObj);
            scope.open = false;

            dontRemove = dontRemove || false;

            var exists = _.findIndex(scope.selectedModel, findObj) !== -1;

            if (!dontRemove && exists) {
              scope.selectedModel.splice(_.findIndex(scope.selectedModel, findObj), 1);
            }
          };

          scope.isChecked = function (id) {
            if (scope.singleSelection) {
              return scope.selectedModel !== null && angular.isDefined(scope.selectedModel[scope.settings.idProp]) && scope.selectedModel[scope.settings.idProp] === getFindObj(id)[scope.settings.idProp];
            }
            return _.findIndex(scope.selectedModel, getFindObj(id)) !== -1;
          };

          scope.externalEvents.onInitDone();
        }
      };
	}]);
})();
