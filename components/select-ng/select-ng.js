import {render} from 'react-dom';
import {createElement} from 'react';

import Select from 'select/select';
import './select-ng__options';
import 'message-bundle-ng/message-bundle-ng';

/**
 * @name Select Ng
 * @description Angular wrapper for React select
 * @example
 *
<example name="Select-ng">
  <file name="index.html">
    <div ng-app="test" ng-controller="testCtrl as ctrl">
      <rg-select ng-model="ctrl.selectedItem" options="item.text for item in ctrl.options track by item.id" label="Select item" ng-disabled="ctrl.disabled"></rg-select>
      <div>Selected item: {{ctrl.selectedItem | json}}</div>
      <div><button ng-click="ctrl.disabled = true">Disable</button><button ng-click="ctrl.disabled = false">Enable</button></div>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('angular');
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

<example name="Select-ng-as-model">
  <file name="index.html">
    <div ng-app="test" ng-controller="testCtrl as ctrl">
      <rg-select ng-model="ctrl.selectedItem" options="item.id as item.text for item in ctrl.options track by item.id" label="Select item" ng-disabled="ctrl.disabled"></rg-select>
      <div>Selected item: {{ctrl.selectedItem}}</div>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('angular');
    require('select-ng/select-ng');

    angular.module('test', ['Ring.select']).controller('testCtrl', function() {
      var ctrl = this;

      ctrl.options = [
        {id: 1, text: '11111'},
        {id: 2, text: '22222'},
        {id: 3, text: '33333'}
      ];

      ctrl.selectedItem = ctrl.options[1].id;
    });
  </file>
</example>

<example name="Select-ng-as-model-lazy">
  <file name="index.html">
    <div ng-app="test" ng-controller="testCtrl as ctrl">
      <p>Be carefully using <b>lazy=false</b> may significantly decrease your performance</p>
      <p>This case decribe when we take from server ng-model and then asynchronous take options for this model</p>

      <rg-select
        ng-model="ctrl.selectedItem"
        lazy="false"
        options="item.id as item.text for item in ctrl.options"></rg-select>
      <div>Selected item: {{ctrl.selectedItem}}</div>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('angular');
    require('select-ng/select-ng');

    angular.module('test', ['Ring.select']).controller('testCtrl', function($timeout) {
      var ctrl = this;

      ctrl.selectedItem = 2

      $timeout(function(){
        ctrl.options = [
          {id: 1, text: '11111'},
          {id: 2, text: '22222'},
          {id: 3, text: '33333'}
        ];
      }, 1000);

    });
  </file>
</example>

 <example name="Select-ng-promise">
   <file name="index.html">
     <h4>Getting items from promise on click with external filtering. (Filter value should be equal to label, not just part)</h4>
     <div ng-app="test" ng-controller="testCtrl as ctrl">
      <rg-select ng-model="ctrl.selectedItem" options="item in ctrl.getItems(query)" label="Select item" external-filter="true" loading-message="Hey! I'm loading!"></rg-select>
      <div>Selected item: {{ctrl.selectedItem | json}}</div>
     </div>
   </file>
   <file name="index.js" webpack="true">
     require('angular');
     require('select-ng/select-ng');

     angular.module('test', ['Ring.select']).controller('testCtrl', function($timeout, $q) {
          var ctrl = this;

          ctrl.options = [
            {key: 1, label: '1'},
            {key: 2, label: '2'},
            {key: 3, label: '3'},
            {key: 4, label: '4'},
            {key: 5, label: '5'}
          ];

          ctrl.selectedItem = ctrl.options[1];

          ctrl.getItems = function(query){
            var defer = $q.defer();
            $timeout(function(){
              defer.resolve(ctrl.options.filter(function(op) {
                 return query ? op.label === query : true;
              }));
            }, 1000 * Math.random());
            return defer.promise;
          };
      });
   </file>
 </example>

  <example name="Select-ng-dropdown">
    <file name="index.html">
      <h4>Select-ng as dropdown</h4>
      <div ng-app="test" ng-controller="testCtrl as ctrl">
        <button rg-select options="item in ctrl.options" select-type="dropdown" filter="true" on-change="ctrl.onSelect(selected)">Click Me &#9660;</button>
        <ol><li ng-repeat="click in ctrl.clicks track by $index">{{click.label}}</li></ol>
      </div>
    </file>
    <file name="index.js" webpack="true">
      require('angular');
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

   <example name="Select-ng-inside-dialog">
    <file name="index.html">
      <div ng-app="test" ng-controller="testCtrl as ctrl">
        <div>
          <h1>Text content to make scroll</h1>
          <div id="textContent"></div>
        <rg-dialog></rg-dialog>
      </div>
    </file>
    <file name="index.js" webpack="true">
      require('angular');
      require('select-ng/select-ng');
      require('dialog-ng/dialog-ng');

      function fillScrollableContent() {
        var html = '<h2>Text to scroll</h2>';
        for (var i = 0; i < 100; i++) {
          html += 'Text<br/>'
        }
        document.getElementById('textContent').innerHTML = html;
      }

      fillScrollableContent();

      angular.module('test', ['Ring.select', 'Ring.dialog'])
      .run(function($templateCache) {
        $templateCache.put('test-tpl.html', '<rg-select ng-model="data.selectedItem" options="item in data.options"></rg-select>');
      })
      .controller('testCtrl', function($timeout, dialog) {
        var data = {
          options: [
            {key: 1, label: '11111'},
            {key: 2, label: '22222'}
          ]
        }

        $timeout(function(){
          dialog.show({
            title: 'Select in dialog demo',
            description: 'Select popup should not scroll with background page content',
            data: data,
            content: 'test-tpl.html'
          });
        }, 100);
      });
    </file>
  </example>

  <example name="Select-ng-multiple">
    <file name="index.html">
      <h4>Multiple select</h4>
      <div ng-app="test" ng-controller="testCtrl as ctrl">
        <rg-select ng-model="ctrl.selectedItems" options="item in ctrl.options" label="Select item" multiple="ctrl.multiple"></rg-select>
        <div>Selected items: {{ctrl.selectedItems | json}}</div>
        <button ng-click="ctrl.selectedItems.splice(0, 1)">Deselect first item</button>
        <button ng-click="ctrl.options.splice(0, 1)">Remove first option</button>
        <button ng-click="ctrl.multiple = !ctrl.multiple">Toggle multiple</button>
      </div>
    </file>
    <file name="index.js" webpack="true">
      require('angular');
      require('select-ng/select-ng');

      angular.module('test', ['Ring.select']).controller('testCtrl', function() {
      var ctrl = this;
      ctrl.multiple = true;

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
        require('angular');
        require('select-ng/select-ng');
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
let ringSelectModule = angular.module('Ring.select', ['Ring.select.options', 'Ring.message-bundle']);

ringSelectModule.directive('rgSelect', function () {
  const types = {
    input: Select.Type.INPUT,
    button: Select.Type.BUTTON,
    dropdown: Select.Type.CUSTOM,
    suggest: Select.Type.INPUT
  };

  return {
    restrict: 'EA',
    /**
     * @property {Object} scope
     * @property {Object} scope.ngModel
     * @property {String} scope.selectType - select type. Can be "button" (default), "input" or "dropdown"
     * @property {String} scope.lazy - Load options lazy. Can be "true" (default) or "false"
     * @property {String} scope.options - query for options. Can look like this:
     * `item in items`
     * `item in dataSource(query)`
     * `item.text for item in items
     * `item.text for item in items track by item.id`
     * `item.text select as item.fullText describe as item.fullDescription for item in items track by item.id`
     * `item as item.text select as makeFullText(item) for item in items`
     * Where:
     * `as` - what object will be set to ng-model
     * `select as` - label for selected item to display in button
     * `describe as` - description of item to display in list
     * `for item in items`, `for item in dataSource(query)` - data source or array
     * `track by item.id` - field to use as key for list
     * @property {Boolean} scope.externalFilter - whether or not select use options function as filter.
     * "filter" property scope.should not be passed in that case.
     * @property {Boolean} scope.multiple - If true then you can select more then one value
     * @property {Function} scope.onSelect - callback to call on items selecting.
     * Receives "selected" property (<rg-select on-select='doSomethingWith(selected)'>)
     * @property {Function} scope.onDeselect - callback to call on item deselecting.
     * Receives "deselected" property (<rg-select on-deselect='doSomethingWith(deselected)'>)
     * @property {Function} scope.onOpen - callback to call on select popup opening
     * @property {Function} scope.onClose - callback to call on select popup closing
     * @property {Function} scope.onChange - callback to call on selected items change.
     * Receives "selected" property (<rg-select on-change='doSomethingWith(selected)'>)
     * @property {String} scope.label - Label to place on empty select button
     * @property {String} scope.selectedLabel - Label to replace any selected item/items
     * with constant text on select button
     * @property {String} scope.notFoundMessage - message to display if no options found
     * @property {String} scope.loadingMessage - message to display while loading
     * @property {Object} scope.config - hash to pass to react select component.
     */
    scope: {
      ngModel: '=',

      selectType: '@',
      lazy: '=?',

      options: '@',
      label: '@',
      selectedLabel: '@',
      externalFilter: '=',
      filter: '=?',
      multiple: '=?',
      clear: '=?',
      onSelect: '&',
      onDeselect: '&',
      onOpen: '&',
      onClose: '&',
      onChange: '&',
      notFoundMessage: '@',
      loadingMessage: '@',
      config: '=?'
    },
    bindToController: true,
    controllerAs: 'selectCtrl',
    require: ['?ngModel', 'rgSelect'],
    link: function (scope, iElement, iAttrs, ctrls) {
      let ngModelCtrl = ctrls[0];
      let rgSelectCtrl = ctrls[1];

      rgSelectCtrl.setNgModelCtrl(ngModelCtrl);
    },
    controller: function ($q, $scope, $element, $attrs, SelectOptions, RingMessageBundle) {
      /*eslint-disable consistent-this*/
      let ctrl = this;
      /*eslint-enable consistent-this*/
      let element = $element[0];
      let container = document.createElement('span');

      /**
       * Properties
       */
      ctrl.selectInstance = null;
      ctrl.ngModelCtrl = null;
      ctrl.query = null;
      ctrl.optionsParser = new SelectOptions($scope.$parent, ctrl.options);
      ctrl.lazy = ctrl.hasOwnProperty('lazy') ? ctrl.lazy : true;

      ctrl.setNgModelCtrl = ngModelCtrl => {
        ctrl.ngModelCtrl = ngModelCtrl;
      };

      /**
       * @param {Array} options
       */
      function memorizeOptions(options) {
        ctrl.loadedOptions = options;
      }

      ctrl.syncSelectToNgModel = selectedValue => {
        function valueOf(option) {
          if (option && option.originalModel) {
            option = option.originalModel;
          }

          return ctrl.optionsParser.getValue(option);
        }

        if (ctrl.ngModelCtrl) {
          if (Array.isArray(selectedValue)) {
            ctrl.ngModelCtrl.$setViewValue(selectedValue.map(valueOf));
          } else if (selectedValue && selectedValue.originalModel) {
            ctrl.ngModelCtrl.$setViewValue(valueOf(selectedValue));
          } else {
            ctrl.ngModelCtrl.$setViewValue(valueOf(selectedValue));
          }
        }
      };

      ctrl.convertNgModelToSelect = model => {
        function convertItem(modelValue) {
          let item = ctrl.optionsParser.getOptionByValue(modelValue, ctrl.loadedOptions || []);

          /**
           * NOTE:
           * If ng-model does not exist in list of options
           * for example when lazy fetch data from the server
           */
          if (item === undefined) {
            item = modelValue;
          }

          return angular.extend({
            key: ctrl.optionsParser.getKey(item),
            label: ctrl.optionsParser.getLabel(item),
            selectedLabel: ctrl.optionsParser.getSelectedLabel(item),
            description: ctrl.optionsParser.getDescription(item),
            originalModel: item
          }, typeof item === 'object' ? item : null);
        }

        if (model !== undefined && model !== null) {
          if (Array.isArray(model)) {
            return model.map(convertItem);
          } else {
            return convertItem(model);
          }
        }
      };

      function getType() {
        //$attrs.type as fallback, not recommended to use because of native "type" attribute
        return ctrl.selectType || $attrs.type;
      }

      let lastQuery = null;
      ctrl.getOptions = query => {
        return $q.when(ctrl.optionsParser.getOptions(query));
      };

      ctrl.loadOptionsToSelect = query => {
        lastQuery = query;
        ctrl.selectInstance.rerender({loading: getType() !== 'suggest'});

        ctrl.getOptions(query).then(results => {
          if (query !== lastQuery) {
            return; // skip results if query doesn't match
          }

          memorizeOptions(results);

          let items = (results.data || results).map(ctrl.convertNgModelToSelect);
          ctrl.selectInstance.rerender({
            data: items,
            loading: false
          }, () => {
            if (getType() === 'suggest') {
              ctrl.selectInstance._showPopup();
            }
          });
        }).catch(() => {
          ctrl.selectInstance.rerender({
            loading: false
          });
        });
      };

      function setSelectModel(newValue) {
        ctrl.selectInstance.rerender({
          selected: ctrl.convertNgModelToSelect(newValue)
        });
      }

      function syncNgModelToSelect() {
        $scope.$watch(() => {
          if (ctrl.ngModelCtrl) {
            return ctrl.ngModelCtrl.$modelValue;
          }
          return null;
        }, setSelectModel, true);
      }

      function syncDisabled() {
        $attrs.$observe('disabled', newValue => {
          ctrl.selectInstance.rerender({disabled: newValue});
        });
      }

      function syncMultiple() {
        $scope.$watch(() => {
          return ctrl.multiple;
        }, () => {
          if (angular.isDefined(ctrl.multiple)) {
            ctrl.selectInstance.rerender({multiple: ctrl.multiple});
          }
        });
      }

      function attachDropdownIfNeeded() {
        if (getType() === 'dropdown') {
          element.addEventListener('click', () => {
            ctrl.selectInstance._clickHandler();
          });
        }
      }

      function listenToRouteChanges() {
        $scope.$on('$locationChangeSuccess', () => {
          ctrl.selectInstance._hidePopup();
        });
      }

      function getSelectType() {
        return types[getType()] || types.button;
      }

      /**
       * @param {newValue} newValue New value of options
       * @param {value} value Previous value of options
       */
      function optionsWatcher(newValue, value) {
        memorizeOptions(newValue);

        if (newValue === value) {
          return;
        }

        setSelectModel(ctrl.ngModelCtrl.$modelValue);
      }

      function activate() {
        /**
         * Provide specific filter function if externalFilter is enabled
         */
        if (ctrl.externalFilter) {
          ctrl.filter = {fn: () => {
            return true;
          }};
        }

        if (!ctrl.lazy) {
          $scope.$watch(() => {
            return ctrl.optionsParser.getOptions(ctrl.query);
          }, optionsWatcher, true);
        }
        ctrl.config = angular.extend({}, {
          selected: ctrl.convertNgModelToSelect(ctrl.ngModel),
          label: ctrl.label || RingMessageBundle.select_label(),
          selectedLabel: ctrl.selectedLabel,
          filter: ctrl.filter,
          multiple: ctrl.multiple,
          clear: ctrl.clear,
          type: getSelectType(),
          loadingMessage: ctrl.loadingMessage || RingMessageBundle.select_loading(),
          notFoundMessage: ctrl.notFoundMessage || RingMessageBundle.select_options_not_found(),
          targetElement: getType() === 'dropdown' ? element : null,
          onBeforeOpen: () => {
            $scope.$evalAsync(() => {
              ctrl.loadOptionsToSelect(ctrl.query);
            });
          },
          onOpen: () => {
            $scope.$evalAsync(() => {
              ctrl.onOpen();
            });
          },
          onClose: () => {
            $scope.$evalAsync(() => {
              ctrl.onClose();
            });
          },
          onSelect: item => {
            $scope.$evalAsync(() => {
              ctrl.onSelect({selected: item});
            });
          },
          onDeselect: item => {
            $scope.$evalAsync(() => {
              ctrl.onDeselect({deselected: item});
            });
          },
          onChange: selected => {
            ctrl.syncSelectToNgModel(selected);

            $scope.$evalAsync(() => {
              ctrl.onChange({selected: selected});
            });
          },
          onFilter: query => {
            $scope.$evalAsync(() => {
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
         * Render select in appended div to save any existing content of the directive
         */
        element.appendChild(container);

        ctrl.selectInstance = render(createElement(Select, ctrl.config), container);
        syncNgModelToSelect();
        syncDisabled();
        syncMultiple();
        attachDropdownIfNeeded();
        listenToRouteChanges();
      }

      activate();
    }
  };
});
