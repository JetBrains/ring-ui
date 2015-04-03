var React = require('react');

var map = require('mout/array/map');
var isArray = require('mout/lang/isArray');

var Select = require('select/select');
require('./select-ng__options');

/**
 * @name Select-ng.
 * @description Angular wrapper for React select
 * @example
 *
<example name="Select-ng">
  <file name="index.html">
    <div ng-app="test" ng-controller="testCtrl as ctrl">
      <rg-select ng-model="ctrl.selectedItem" options="item as item.text for item in ctrl.options track by item.id" label="Select item" ng-disabled="ctrl.disabled"></rg-select>
      <div>Selected item: {{ctrl.selectedItem | json}}</div>
      <div><button ng-click="ctrl.disabled = true">Disable</button><button ng-click="ctrl.disabled = false">Enable</button></div>
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
     <h4>Getting items from promise on click with external filtering. (Filter value should be equal to label, not just part)</h4>
     <div ng-app="test" ng-controller="testCtrl as ctrl">
      <rg-select ng-model="ctrl.selectedItem" options="item in ctrl.getItems(query)" label="Select item" external-filter="true"></rg-select>
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

          ctrl.getItems = function(query){
            var defer = $q.defer();
            $timeout(function(){
              defer.resolve(ctrl.options.filter(function(op) {
                 return query ? op.label === query : true;
              }));
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
        <button rg-select options="item in ctrl.options" type="dropdown" filter="true" on-select="ctrl.onSelect(selected)">Click Me &#9660;</button>
        <ol><li ng-repeat="click in ctrl.clicks track by $index">{{click.label}}</li></ol>
      </div>
    </file>
    <file name="index.js" webpack="true">
      require('angular/angular.min.js');
      require('select-ng/select-ng');

      angular.module('test', ['Ring.select']).controller('testCtrl', function() {
      var ctrl = this;

      ctrl.clicks = [];

      ctrl.options = [
        {key: 1, label: '11111'},
        {key: 2, label: '22222'},
        {key: 3, label: '33333'}
      ];

      ctrl.onSelect = function(item) {
          ctrl.clicks.push(item);
      };

    });
    </file>
  </example>

  <example name="Select-ng-multiple">
    <file name="index.html">
      <h4>Multiple select</h4>
      <div ng-app="test" ng-controller="testCtrl as ctrl">
        <rg-select ng-model="ctrl.selectedItems" options="item in ctrl.options" label="Select item" config="ctrl.selectConfig"></rg-select>
        <div>Selected items: {{ctrl.selectedItems | json}}</div>
        <button ng-click="ctrl.selectedItems.splice(0, 1)">Deselect first item</button>
        <button ng-click="ctrl.options.splice(0, 1)">Remove first option</button>
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
  <example name="Select-ng-form">
    <file name="index.html">
      <h4>Form with validation</h4>

      <div ng-app="test" ng-controller="testCtrl as ctrl">
        <form name="testForm" class="ring-form ring-form_border" novalidate>
          <div class="ring-form__wrap">
            <div class="ring-form__control">
              <label class="ring-form__label" translate>Required item:</label>
              <rg-select ng-model="ctrl.item1" options="item as item for item in ctrl.options"
                         label="Select item" required name="requiredSelect"></rg-select>

               <div class="installer-form__error-hint ring-input__error-bubble active" ng-if="testForm.requiredSelect.$invalid">
                  Error {{testForm.requiredSelect.$error}}
               </div>
            </div>
            <button ng-disabled="testForm.$invalid">Submit</button>
            </div>
            <div>Errors: {{testForm.$error}}</div>
          </form>
        </div>

      </file>
      <file name="index.js" webpack="true">
        require('angular/angular.min.js');
        require('select-ng/select-ng');
        require('form/form');
        require('form-ng/form-ng');

        angular.module('test', ['Ring.select', 'Ring.form']).controller('testCtrl', function() {
        var ctrl = this;

        //It is not required to use array of strings. Just for example
        ctrl.options = ['1','22','333', '4444'];

        ctrl.selectedItem = null;
      });
      </file>
    </example>
 */
/* global angular: false */
angular.module('Ring.select', ['Ring.select.options'])
  .directive('rgSelect', function () {

    var types = {
      input: Select.Type.INPUT,
      button: Select.Type.BUTTON,
      dropdown: Select.Type.CUSTOM
    };

    return {
      restrict: 'EA',
      /**
       * @property {Object} scope
       * @property {Object} scope.ngModel
       * @property {String} scope.type - select type. Can be "button" (default), "input" or "dropdown"
       * @property {String} scope.options - query for options. Can look like this:
       * `item in items`
       * `item in dataSource(query)`
       * `item as item.text for item in items
       * `item as item.text for item in items track by item.id`
       * `item as item.text select as item.fullText describe as item.fullDescription for item in items track by id`
       * `item as item.text select as makeFullText(item) for item in items`
       * Where:
       * `as` - label of item in select list
       * `select as` - label for selected item to display in button
       * `describe as` - description of item to display in list
       * `for item in items`, `for item in dataSource(query)` - data source or array
       * `track by item.id` - field to use as key for list
       * @property {Boolean} scope.externalFilter - whether or not select use options function as filter.
       * "filter" property scope.should not be passed in that case.
       * @property {Function} scope.onSelect - callback to call on items selecting.
       * Receives "selected" property (<rg-select on-select='doSomethingWith(selected)'>)
       * @property {Function} scope.onOpen - callback to call on select popup opening
       * @property {Function} scope.onClose - callback to call on select popup closing
       * @property {String} scope.label - Label to place on empty select button
       * @property {Object} scope.config - hash to pass to react select component.
       */
      scope: {
        ngModel: '=',
        type: '@',
        options: '@',
        externalFilter: '=',
        filter: '=?',
        onSelect: '&',
        onOpen: '&',
        onClose: '&',
        config: '=?'
      },
      bindToController: true,
      controllerAs: 'selectCtrl',
      require: ['?ngModel', 'rgSelect'],
      link: function (scope, iElement, iAttrs, ctrls) {
        var ngModelCtrl = ctrls[0];
        var rgSelectCtrl = ctrls[1];

        rgSelectCtrl.setNgModelCtrl(ngModelCtrl);
      },
      controller: function ($q, $scope, $element, $attrs, SelectOptions) {
        /*eslint-disable consistent-this*/
        var ctrl = this;
        /*eslint-enable consistent-this*/
        var element = $element[0];

        /**
         * Properties
         */
        ctrl.selectInstance = null;
        ctrl.ngModelCtrl = null;
        ctrl.query = null;
        ctrl.optionsParser = new SelectOptions($scope.$parent, ctrl.options);

        ctrl.setNgModelCtrl = function(ngModelCtrl) {
          ctrl.ngModelCtrl = ngModelCtrl;
        };

        ctrl.syncSelectToNgModel = function (selectedValue) {
          if (ctrl.ngModelCtrl) {
            if (isArray(selectedValue)) {
              ctrl.ngModelCtrl.$setViewValue(selectedValue.map(function (val) {
                return val.originalModel;
              }));
            } else {
              ctrl.ngModelCtrl.$setViewValue(selectedValue.originalModel);
            }
          }
        };

        ctrl.convertNgModelToSelect = function(model) {
          var convertItem = function (item) {
            return angular.extend({
              key: ctrl.optionsParser.getKey(item),
              label: ctrl.optionsParser.getLabel(item),
              selectedLabel: ctrl.optionsParser.getSelectedLabel(item),
              description: ctrl.optionsParser.getDescription(item),
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

        ctrl.getOptions = function (query) {
          return $q.when(ctrl.optionsParser.getOptions(query));
        };

        ctrl.loadOptionsToSelect = function(query) {
          ctrl.selectInstance.setProps({
            loading: true
          });

          ctrl.getOptions(query).then(function (results) {
            ctrl.selectInstance.setProps({
              data: map(results.data || results, ctrl.convertNgModelToSelect)
            });
          }).catch(function () {
            //todo: catch error
          }).finally(function () {
            ctrl.selectInstance.setProps({
              loading: false
            });
          });
        };

        function setSelectModel(newValue) {
          ctrl.selectInstance.setProps({
            selected: newValue ? ctrl.convertNgModelToSelect(newValue) : newValue
          });
        }

        function syncNgModelToSelect() {
          $scope.$watch(function () {
            if (ctrl.ngModelCtrl) {
              return ctrl.ngModelCtrl.$modelValue;
            }
            return null;
          }, setSelectModel, true);
        }

        function syncDisabled() {
          $attrs.$observe('disabled', function (newValue) {
            ctrl.selectInstance.setProps({disabled: newValue});
          });
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
          /**
           * Provide specific filter function if externalFilter enabled
           */
          if (ctrl.externalFilter) {
            ctrl.filter = {fn: function () {
              return true;
            }};
          }

          ctrl.config = angular.extend({}, {
            selected: ctrl.convertNgModelToSelect(ctrl.ngModel),
            label: ctrl.label,
            filter: ctrl.filter,
            type: getSelectType(),
            targetElement: ctrl.type === 'dropdown' ? $element[0] : null,
            onOpen: function () {
              $scope.$evalAsync(function () {
                ctrl.loadOptionsToSelect(ctrl.query);
                ctrl.onOpen();
              });
            },
            onClose: function () {
              $scope.$evalAsync(function () {
                ctrl.onClose();
              });
            },
            onSelect: function (item) {
              $scope.$evalAsync(function () {
                ctrl.onSelect({selected: item});
              });
            },
            onChange: function (selected) {
              $scope.$evalAsync(function () {
                ctrl.syncSelectToNgModel(selected);
              });
            },
            onFilter: function (query) {
              $scope.$evalAsync(function () {
                ctrl.query = query;
                if (ctrl.externalFilter) {
                  ctrl.loadOptionsToSelect(query);
                }
                if (ctrl.onFilter) {
                  ctrl.onFilter(query);
                }
              });
            }
          }, ctrl.config || {});

          /**
           * Render select in appended div to save any exist content of directive
           */
          var container = document.createElement('span');
          element.appendChild(container);

          ctrl.selectInstance = React.renderComponent(new Select(ctrl.config), container);
          syncNgModelToSelect();
          syncDisabled();
          attachDropdownIfNeeded();
        }
        activate();
      }
    };
  });
