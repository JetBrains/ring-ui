
var map = require('mout/array/map');
var Select = require('select/select');
var React = require('react');

var isArray = require('mout/lang/isArray');

/**
 * @name Select-ng.
 * @description Angular wrapper for React select
 * @example
 *
<example name="Select-ng">
  <file name="index.html">
    <div ng-app="test" ng-controller="testCtrl as ctrl">
      <rg-select ng-model="ctrl.selectedItem" options="ctrl.options" key-field="id" label-field="text" label="Select item"></rg-select>
      <div>Selected item: {{ctrl.selectedItem | json}}</div>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('angular/angular.min.js');
    require('select-ng/select-ng');

    angular.module('test', ['Ring.select']).controller('testCtrl', function() {
      var ctrl = this;

      ctrl.options = [
        {id: 1, text: '11111'},
        {id: 2, text: '22222'},
        {id: 3, text: '33333'}
      ];

      ctrl.selectedItem = ctrl.options[1];

    });
  </file>
</example>

 <example name="Select-ng-promise">
   <file name="index.html">
     <h4>Getting items from promise on click</h4>
     <div ng-app="test" ng-controller="testCtrl as ctrl">
      <rg-select ng-model="ctrl.selectedItem" source="ctrl.getItems()" label="Select item"></rg-select>
      <div>Selected item: {{ctrl.selectedItem | json}}</div>
     </div>
   </file>
   <file name="index.js" webpack="true">
     require('angular/angular.min.js');
     require('select-ng/select-ng');

     angular.module('test', ['Ring.select']).controller('testCtrl', function($timeout, $q) {
          var ctrl = this;

          ctrl.options = [
            {key: 1, label: '11111'},
            {key: 2, label: '22222'},
            {key: 3, label: '33333'}
          ];

          ctrl.selectedItem = ctrl.options[1];

          ctrl.getItems = function(){
            var defer = $q.defer();
            $timeout(function(){
              defer.resolve(ctrl.options);
            }, 1000);
            return defer.promise;
          };
      });
   </file>
 </example>

  <example name="Select-ng-dropdown">
    <file name="index.html">
      <h4>Select-ng as dropdown</h4>
      <div ng-app="test" ng-controller="testCtrl as ctrl">
        <button rg-select ng-model="ctrl.nothing" options="ctrl.options" label="Select item" type="dropdown" filter="true">Click Me &#9660;</button>
      </div>
    </file>
    <file name="index.js" webpack="true">
      require('angular/angular.min.js');
      require('select-ng/select-ng');

      angular.module('test', ['Ring.select']).controller('testCtrl', function() {
      var ctrl = this;

      ctrl.options = [
        {key: 1, label: '11111'},
        {key: 2, label: '22222'},
        {key: 3, label: '33333'}
      ];

    });
    </file>
  </example>

  <example name="Select-ng-multiple">
    <file name="index.html">
      <h4>Multiple select</h4>
      <div ng-app="test" ng-controller="testCtrl as ctrl">
        <rg-select ng-model="ctrl.selectedItems" options="ctrl.options" label="Select item" config="ctrl.selectConfig"></rg-select>
        <div>Selected items: {{ctrl.selectedItems | json}}</div>
        <button ng-click="ctrl.selectedItems.splice(0, 1)">Deselect first item</button>
      </div>
    </file>
    <file name="index.js" webpack="true">
      require('angular/angular.min.js');
      require('select-ng/select-ng');

      angular.module('test', ['Ring.select']).controller('testCtrl', function() {
      var ctrl = this;

      ctrl.selectConfig = {
        multiple: true,
      };

      ctrl.options = [
        {key: 1, label: '11111'},
        {key: 2, label: '22222'},
        {key: 3, label: '33333'},
        {key: 4, label: '4444444'},
        {key: 5, label: '5555'}
      ];

      ctrl.selectedItems = [ctrl.options[1], ctrl.options[2]];
    });
    </file>
  </example>
*/
/* global angular: false */
angular.module('Ring.select', [])
  .directive('rgSelect', function () {
    var defaultKey = 'key';
    var defaultLabel = 'label';
    var defaultSelectedLabel = 'selectedLabel';

    var types = {
      input: Select.Type.INPUT,
      button: Select.Type.BUTTON,
      dropdown: Select.Type.CUSTOM
    };

    return {
      restrict: 'EA',
      scope: {
        ngModel: '=',
        type: '@',
        options: '=?',
        source: '&',
        filter: '=?',
        onFilter: '=',
        onSelect: '=',
        label: '@',
        labelField: '@',
        selectedLabelField: '@',
        keyField: '@',
        selectedFormatter: '=',
        config: '=?'
      },
      bindToController: true,
      controllerAs: 'selectCtrl',
      require: ['ngModel', 'rgSelect'],
      link: function (scope, iElement, iAttrs, ctrls) {
        var ngModelCtrl = ctrls[0];
        var rgSelectCtrl = ctrls[1];

        rgSelectCtrl.setNgModelCtrl(ngModelCtrl);
      },
      controller: function ($scope, $element) {
        /*eslint-disable consistent-this*/
        var ctrl = this;
        /*eslint-enable consistent-this*/
        var element = $element[0];

        /**
         * Properties
         */
        ctrl.selectInstance = null;
        ctrl.ngModelCtrl = null;
        ctrl.isLoading = false;
        ctrl.isLoaded = false;

        ctrl.setNgModelCtrl = function(ngModelCtrl) {
          ctrl.ngModelCtrl = ngModelCtrl;
        };

        ctrl.syncSelectToNgModel = function (selectedValue) {
          if (isArray(selectedValue)) {
            ctrl.ngModelCtrl.$setViewValue(selectedValue.map(function (val) {
              return val.originalModel;
            }));
          } else {
            ctrl.ngModelCtrl.$setViewValue(selectedValue.originalModel);
          }
        };

        ctrl.convertNgModelToSelect = function(model) {
          var convertItem = function (item) {
            return angular.extend({
              key: item[ctrl.keyField || defaultKey],
              label: item[ctrl.labelField || defaultLabel],
              selectedLabel: ctrl.selectedFormatter ? ctrl.selectedFormatter(item) : item[ctrl.selectedLabelField || defaultSelectedLabel],
              originalModel: item
            }, item);
          };

          if (model) {
            if (isArray(model)) {
              return model.map(convertItem);
            } else {
              return convertItem(model);
            }
          }
        };

        ctrl.startLoading = function() {
          var sourcePromise = ctrl.source();
          if (sourcePromise) {
            ctrl.selectInstance.setProps({
              loading: true
            });
            sourcePromise.then(function (results) {
              ctrl.options = results.data || results;
            }).catch(function () {
              //todo: catch error
            }).finally(function () {
              ctrl.isLoaded = true;
              ctrl.selectInstance.setProps({
                loading: false
              });
            });
          }
        };

        ctrl.loadIfNotLoaded = function() {
          if (!ctrl.isLoaded && !ctrl.isLoading) {
            ctrl.startLoading();
          }
        };

        function syncOptions() {
          $scope.$watch('selectCtrl.options', function (newOptions) {
            ctrl.selectInstance.setProps({
              data: map(newOptions, ctrl.convertNgModelToSelect)
            });
          }, true);
        }

        function setSelectModel(newValue) {
          ctrl.selectInstance.setProps({
            selected: newValue ? ctrl.convertNgModelToSelect(newValue) : newValue
          });
        }

        function syncNgModelToSelect() {
          $scope.$watch(function () {
            return ctrl.ngModelCtrl.$modelValue;
          }, setSelectModel, true);
        }

        function attachDropdownIfNeeded() {
          if (ctrl.type === 'dropdown') {
            element.addEventListener('click', function () {
              ctrl.selectInstance._showPopup();
            });
          }
        }

        function getSelectType() {
          return types[ctrl.type] || types.button;
        }

        function activate() {
          ctrl.config = angular.extend({}, {
            selected: ctrl.convertNgModelToSelect(ctrl.ngModel),
            data: map(ctrl.options, ctrl.convertNgModelToSelect),
            label: ctrl.label,
            filter: ctrl.filter,
            type: getSelectType(),
            targetElement: ctrl.type === 'dropdown' ? $element[0] : null,
            onOpen: function () {
              $scope.$evalAsync(function () {
                ctrl.loadIfNotLoaded();
                if (ctrl.onOpen){
                  ctrl.onOpen();
                }
              });
            },
            onSelect: function (item) {
              $scope.$evalAsync(function () {
                if (ctrl.onSelect) {
                  ctrl.onSelect(item);
                }
              });
            },
            onChange: function (selected) {
              $scope.$evalAsync(function () {
                ctrl.syncSelectToNgModel(selected);
              });
            },
            onFilter: function (query) {
              if (ctrl.onFilter){
                $scope.$evalAsync(function () {
                  ctrl.onFilter(query);
                });
              }
            }
          }, ctrl.config || {});

          /**
           * Render select in appended div to save any exist content of directive
           */
          var container = document.createElement('span');
          element.appendChild(container);

          ctrl.selectInstance = React.renderComponent(new Select(ctrl.config), container);
          syncNgModelToSelect();
          syncOptions();
          attachDropdownIfNeeded();
        }
        activate();
      }
    };
  });
