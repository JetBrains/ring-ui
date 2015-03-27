
var map = require('mout/array/map');
var Select = require('select/select');
var React = require('react');

/**
 * @name Select-ng.
 * @description Angular wrapper for React select
 * @example
 *
<example name="Select-ng">
  <file name="index.html">
    <div ng-app="test" ng-controller="testCtrl as ctrl">
      <rg-select ng-model="ctrl.selectedItem" options="ctrl.options" key-field="id" label-field="text" label="Select item"></rg-select>
      <div>Selected item: {{ctrl.selectedItem}}</div>
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
      <div>Selected item: {{ctrl.selectedItem}}</div>
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
*/

/* global angular: false */
angular.module('Ring.select', ['Ring.react-ng'])
  .directive('rgSelect', function () {
    var defaultKey = 'key';
    var defaultLabel = 'label';
    var defaultSelectedLabel = 'selectedLabel';

    return {
      restrict: 'EA',
      scope: {
        ngModel: '=',
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

        ctrl.syncSelectToNgModel = function(selectedValue) {
          ctrl.ngModelCtrl.$setViewValue(selectedValue.originalModel);
        };

        ctrl.convertNgModelToSelect = function(model) {
          if (model) {
            return angular.extend({
              key: model[ctrl.keyField || defaultKey],
              label: model[ctrl.labelField || defaultLabel],
              selectedLabel: ctrl.selectedFormatter ? ctrl.selectedFormatter(model) : model[ctrl.selectedLabelField || defaultSelectedLabel],
              originalModel: model
            }, model);
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
          });
        }

        function setSelectModel(newValue) {
          ctrl.selectInstance.setProps({
            selected: newValue ? ctrl.convertNgModelToSelect(newValue) : newValue
          });
        }

        function syncNgModelToSelect() {
          $scope.$watch(function () {
            return ctrl.ngModelCtrl.$modelValue;
          }, setSelectModel);
        }

        function activate() {
          ctrl.config = angular.extend({}, {
            selected: ctrl.convertNgModelToSelect(ctrl.ngModel),
            data: map(ctrl.options, ctrl.convertNgModelToSelect),
            label: ctrl.label,
            filter: ctrl.filter,
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
                ctrl.syncSelectToNgModel(item);
                if (ctrl.onSelect) {
                  ctrl.onSelect(item);
                }
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
          var container = $element.append('<div/>');

          ctrl.selectInstance = React.renderComponent(new Select(ctrl.config), container[0]);

          syncNgModelToSelect();
          syncOptions();
        }
        activate();
      }
    };
  });
