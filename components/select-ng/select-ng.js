
var map = require('mout/array/map');
require('react-ng/react-ng')({
  Select: require('select/select')
});

/* global angular: false */
angular.module('Ring.select', [])
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
        onFilter: '&',
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
              ctrl.options = convertOptionsToSelectData(results.data || results);
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
