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
          label: '@',
          ngDisabled: '='
        },

        template: function (element, attributes) {
          var template =  '<div class="select-parent btn-group dropdown-select" ng-class="{active: open}">';
	            template += '<button type="button" ng-disabled="ngDisabled" class="dropdown-toggle arButton" ng-class="settings.buttonClasses" ng-click="toggleDropdown()"><span class="arButtonLabel">{{getButtonText()}}&nbsp;</span><i class="caret"></i></button>';
	            template += '<ul class="dropdown-menu dropdown-menu-form" ng-style="{display: (open) ? \'block\' : \'none\' }" style="overflow: scroll" >';
              // Search
              template += '<li ng-show="enableSearch"><div class="dropdown-header"><input type="text" class="form-control" style="width: 100%;" ng-model="searchFilter" placeholder="{{texts.searchPlaceholder}}" /></li>';
              template += '<li class="presentation" role="presentation" ng-repeat="option in options | filter: searchFilter">';
              template += '<div class="menu-item" data-ng-class="{\'selected\': isChecked(getPropertyForObject(option)), \'not-selected\': !isChecked(getPropertyForObject(option))}">';              
              template += '<div class="menu-item-label" role="menuitem" tabindex="-1" ng-click="setSelectedItem(getPropertyForObject(option))" title="{{getPropertyForObjectLabel(option, settings.displayProp)}}" >{{getPropertyForObjectLabel(option, settings.displayProp)}}</div>';
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
            displayProp: attributes.label,
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

          scope.searchFilter = scope.searchFilter || '';

          angular.extend(scope.settings, scope.extraSettings || []);
          angular.extend(scope.externalEvents, scope.events || []);
          angular.extend(scope.texts, scope.translationTexts);

          // function getFindObj(id) {
          //   var findObj = {};

          //   if (scope.settings.externalIdProp === '') {
          //     findObj[scope.settings.idProp] = id;
          //   } else {
          //     findObj[scope.settings.externalIdProp] = id;
          //   }

          //   return findObj;
          // }

          function clearObject(object) {
              for (var prop in object) {
                  delete object[prop];
              }
          }

          if (angular.isArray(scope.selectedModel) && scope.selectedModel.length === 0) {
            clearObject(scope.selectedModel);
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
                if (scope.isChecked(scope.getPropertyForObject(optionItem))) {
                  var displayText = scope.getPropertyForObjectLabel(optionItem, scope.settings.displayProp);
                  var converterResponse = scope.settings.smartButtonTextConverter(displayText, optionItem);

                  itemsText.push(converterResponse ? converterResponse : displayText);
                }
              });
              return itemsText.join(', ');
            } else {
              return scope.texts.buttonDefaultText;
            }
          };

          scope.getPropertyForObject = function (object) {
            if (angular.isDefined(object)) {
              return object;
            }
            return '';
          };

          scope.getPropertyForObjectLabel = function (object, property) {
            if (angular.isDefined(object) && object.hasOwnProperty(property)) {
              return object[property];
            }
            return '';
          };

          scope.setSelectedItem = function (object) {
            clearObject(scope.selectedModel);
            angular.extend(scope.selectedModel, object);
            scope.externalEvents.onItemSelect(object);
            scope.open = false;
          };

          scope.isChecked = function (id) {
            return scope.selectedModel !== null && angular.isDefined(scope.selectedModel) && scope.selectedModel[scope.settings.displayProp] === id[scope.settings.displayProp];
          };

          scope.externalEvents.onInitDone();
        }
      };
	}]);
})();
