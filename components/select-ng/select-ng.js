
var map = require('mout/array/map');
require('react-ng/react-ng')({
  Select: require('select/select')
});

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
      restrict: 'E',
      template: require('./select-ng.html'),
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
        selectedFormatter: '='
      },
      bindToController: true,
      controllerAs: 'selectCtrl',
      require: ['ngModel', 'rgSelect'],
      link: function (scope, iElement, iAttrs, ctrls) {
        ctrls[1].setNgModelCtrl(ctrls[0]);
      },
      controller: ['$scope', function ($scope) {
        /*eslint-disable consistent-this*/
        var ctrl = this;
        /*eslint-enable consistent-this*/

        /**
         * Properties
         */
        ctrl.selectModel = null;
        ctrl.selectOptions = [];
        ctrl.filter = ctrl.filter || true;
        ctrl.ngModelCtrl = null;
        ctrl.isLoading = false;
        ctrl.isLoaded = false;

        function setNgModelCtrl(ngModelCtrl) {
          ctrl.ngModelCtrl = ngModelCtrl;
        }

        function convertSelectToNgModel(selectModel) {
          return selectModel.originalModel;
        }

        function syncSelectToNgModel(selectedValue) {
          ctrl.ngModelCtrl.$setViewValue(convertSelectToNgModel(selectedValue));
          if (ctrl.onSelect) {
            ctrl.onSelect(selectedValue);
          }
        }

        function getKey() {
          return ctrl.keyField || defaultKey;
        }

        function getLabel() {
          return ctrl.labelField || defaultLabel;
        }

        function getSelectedLabel() {
          return ctrl.selectedLabelField || defaultSelectedLabel;
        }

        function convertNgModelToSelect(model) {
          return angular.extend({
            key: model[getKey()],
            label: model[getLabel()],
            selectedLabel: ctrl.selectedFormatter ? ctrl.selectedFormatter(model) : model[getSelectedLabel()],
            originalModel: model
          }, model);
        }

        function convertOptionsToSelectData(options) {
          return map(options, convertNgModelToSelect);
        }

        function startLoading() {
          var sourcePromise = ctrl.source();
          if (sourcePromise) {
            ctrl.isLoading = true;
            sourcePromise.then(function (results) {
              ctrl.selectOptions = convertOptionsToSelectData(results.data || results);
            }).catch(function () {
              //todo: catch error
            }).finally(function () {
              ctrl.isLoaded = true;
              ctrl.isLoading = false;
            });
          }
        }

        function onOpen() {
          if (!ctrl.isLoaded && !ctrl.isLoading) {
            startLoading();
          }
        }

        function syncOptions() {
          $scope.$watch('selectCtrl.options', function (newOptions) {
            ctrl.selectOptions = convertOptionsToSelectData(newOptions);
          });
        }

        function setSelectModel(newValue) {
          ctrl.selectModel = newValue ? convertNgModelToSelect(newValue) : newValue;
        }

        function syncNgModelToSelect() {
          $scope.$watch(function () {
            return ctrl.ngModelCtrl.$modelValue;
          }, setSelectModel);
        }

        function activate() {
          setSelectModel(ctrl.ngModel);
          ctrl.selectOptions = convertOptionsToSelectData(ctrl.options);
          syncNgModelToSelect();
          syncOptions();
        }
        activate();

        /**
         * Interface
         */
        ctrl.setNgModelCtrl = setNgModelCtrl;
        ctrl.startLoading = startLoading;
        ctrl.onOpen = onOpen;
        ctrl.syncSelectToNgModel = syncSelectToNgModel;
      }]
    };
  });
