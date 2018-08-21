window.source = {
  "title": "Select Ng",
  "url": "select-ng.html",
  "type": "js",
  "content": "import angular from 'angular';\nimport React from 'react';\nimport {render, unmountComponentAtNode} from 'react-dom';\n\nimport getEventKey from '../global/get-event-key';\nimport Select, {RerenderableSelect} from '../select/select';\nimport MessageBundle from '../message-bundle-ng/message-bundle-ng';\n\nimport SelectNgOptions from './select-ng__options';\nimport SelectLazy from './select-ng__lazy';\n\nconst LOADER_DELAY = 150; // delay to show loader in ms\nconst INFINITE_SCROLL_PACK_SIZE = 50;\nconst DIALOG_NG_SELECTOR = '[data-anchor=dialog-container][data-in-sidebar=false]';\n/**\n * @name Select Ng\n * @category Legacy Angular\n * @tags Ring UI Language\n * @description Provides an Angular wrapper for Select.\n * Options argument has one of the following forms:\n * * `label` **`in`** `items`\n * * `label` **`for`** `item` **`in`** `items`\n * * `label` **`for`** `item` **`in`** `items` **`track by`** `trackexpr`\n * * `label` **`select as`** `buttontext` **`describe as`** `description` **`for`** `item` **`in`** `items` **`track by`** `trackexpr`\n * * `select` **`as`** `label` **`select as`** `buttontext` **`for`** `item` **`in`** `items`\n *\n * Where:\n * * `items` is an expression that evaluates to a datasource containing data to iterate over. Datasource can be an array or a function that accepts the `query` parameter and returns a promise of an array filtered by the query.\n * * `item` is a local variable that will refer to each item in the items.\n * * `label` – the result of this expression will be the label for &lt;option&gt; element. The expression will most likely refer to the value variable (e.g. item.name).\n * * `select` – the result of this expression will be bound to the model of the parent &lt;select&gt; element. If not specified, select expression will default to item.\n * * `trackexpr` is used when working with an array of objects. The result of this expression will be used to identify the objects in the array. The trackexpr will most likely refer to the item variable (e.g. item.id). Used to preserve selection even when the options are recreated (e.g. reloaded from the server).\n * * `buttontext` – label for the selected item to be displayed on the button.\n * * `description` – description of an item to display in the option list.\n *\n * Examples:\n * * `item in items`\n * * `item in dataSource(query)`\n * * `item.text for item in items`\n * * `item.text for item in items track by item.id`\n * * `item.text select as item.fullText describe as item.fullDescription for item in items track by item.id`\n * * `item as item.text select as makeFullText(item) for item in items`\n *\n * @example-file ./select-ng.examples.html\n */\n\nconst angularModule = angular.module('Ring.select', [SelectNgOptions, MessageBundle]);\n\nangularModule.directive('rgSelect', function rgSelectDirective() {\n  const types = {\n    input: Select.Type.INPUT,\n    button: Select.Type.BUTTON,\n    material: Select.Type.MATERIAL,\n    dropdown: Select.Type.CUSTOM,\n    suggest: Select.Type.INPUT\n  };\n\n  const sizes = {\n    FULL: Select.Size.FULL,\n    S: Select.Size.S,\n    M: Select.Size.M,\n    L: Select.Size.L\n  };\n\n  return {\n    /**\n     * @property {Object} scope\n     * @property {Object} scope.ngModel\n     * @property {String} scope.selectType - select type. Can be \"button\" (default), \"input\" or \"dropdown\"\n     * @property {String} scope.lazy - Load options lazily. \"true\" by default.\n     * @property {Boolean} scope.withInfiniteScroll - If true, rgSelect calls getOptions with skip parameter when the list is scrolled to the bottom\n     * @property {String} scope.options - query for options\n     * @property {Boolean} scope.externalFilter - whether or not to use the options function as a filter.\n     * \"filter\" property should not be passed in that case.\n     * @property {Boolean} scope.multiple - toggles multiple selection\n     * @property {Function} scope.onSelect - callback to call on item selection\n     * Receives \"selected\" property (<rg-select on-select='doSomethingWith(selected)'>)\n     * @property {Function} scope.onDeselect - callback to call on item deselection\n     * Receives \"deselected\" property (<rg-select on-deselect='doSomethingWith(deselected)'>)\n     * @property {Function} scope.onOpen - callback to call on select popup opening\n     * @property {Function} scope.onClose - callback to call on select popup closing\n     * @property {Function} scope.onChange - callback to call on selection change\n     * Receives \"selected\" property (<rg-select on-change='doSomethingWith(selected)'>)\n     * @property {String} scope.label - Label to place on empty select button\n     * @property {String} scope.selectedLabel - Label to replace any selected item/items with\n     * @property {String} scope.notFoundMessage - message to display if no options found\n     * @property {String} scope.loadingMessage - message to display while loading\n     * @property {Object} scope.config - hash to pass to react select component\n     * @property {Boolean} scope.configAutoUpdate - whether or not to watch for configuration updates\n     * @property {String} scope.size - select size. Can be \"S\", \"M\" (default), or \"L\".\n     */\n    scope: {\n      ngModel: '=',\n\n      selectType: '@',\n      lazy: '=?',\n      withInfiniteScroll: '=?', // NB: Deprecated! Use infinite-scroll-pack-size=\"50\" instead\n      infiniteScrollPackSize: '@',\n\n      options: '@',\n      optionsScope: '=',\n      label: '@',\n      selectedLabel: '@',\n      externalFilter: '=?',\n      filter: '=?',\n      tags: '=?',\n      multiple: '=?',\n      clear: '=?',\n      onSelect: '&',\n      onDeselect: '&',\n      onOpen: '&',\n      onClose: '&',\n      onChange: '&',\n      notFoundMessage: '@',\n      loadingMessage: '@',\n      config: '=?',\n      configAutoUpdate: '=',\n      selectInstance: '=?',\n      size: '@'\n    },\n    bindToController: true,\n    controllerAs: 'selectCtrl',\n    require: ['?ngModel', 'rgSelect'],\n    link: function link(scope, iElement, iAttrs, ctrls) {\n      const ngModelCtrl = ctrls[0];\n      const rgSelectCtrl = ctrls[1];\n\n      rgSelectCtrl.setNgModelCtrl(ngModelCtrl);\n    },\n    // eslint-disable-next-line max-len\n    controller: function controller($q, $scope, $element, $attrs, $timeout, SelectOptions, RingMessageBundle) {\n      /*eslint-disable consistent-this*/\n      const ctrl = this;\n      /*eslint-enable consistent-this*/\n      const element = $element[0];\n      const container = document.createElement('span');\n      const infiniteScrollPackSize =\n        Number(ctrl.infiniteScrollPackSize) ||\n        (ctrl.withInfiniteScroll ? INFINITE_SCROLL_PACK_SIZE : 0);\n\n      /**\n       * Properties\n       */\n      ctrl.selectInstance = null;\n      ctrl.ngModelCtrl = null;\n      ctrl.query = null;\n      ctrl.dataReceived = false;\n\n      const scope = ctrl.optionsScope ? ctrl.optionsScope : $scope.$parent;\n\n      ctrl.setNgModelCtrl = ngModelCtrl => {\n        ctrl.ngModelCtrl = ngModelCtrl;\n      };\n\n      /**\n       * @param {Array} options\n       */\n      function memorizeOptions(options, skip) {\n        if (ctrl.loadedOptions && skip > 0) {\n          ctrl.loadedOptions = ctrl.loadedOptions.concat(options);\n          ctrl.stopLoadingNewOptions = options.length === 0 && infiniteScrollPackSize;\n        } else {\n          ctrl.loadedOptions = options;\n        }\n        ctrl.lastSkip = skip;\n        return ctrl.loadedOptions;\n      }\n\n      function resetMemorizedOptions() {\n        ctrl.lastSkip = -1;\n        ctrl.loadedOptions = [];\n        ctrl.stopLoadingNewOptions = false;\n      }\n\n      function getType() {\n        // $attrs.type as fallback, not recommended to use because of native \"type\" attribute\n        return ctrl.selectType || $attrs.type;\n      }\n\n      function getCurrentSkipParameter(query, prevQuery) {\n        if (!infiniteScrollPackSize || query !== prevQuery || !ctrl.loadedOptions) {\n          return 0;\n        }\n        return ctrl.lastSkip < 0 ? 0 : ctrl.lastSkip + infiniteScrollPackSize;\n      }\n\n      function isInDialog() {\n        const dialogContainer = document.querySelector(DIALOG_NG_SELECTOR);\n        return dialogContainer && dialogContainer.contains(element);\n      }\n\n\n      ctrl.syncSelectToNgModel = selectedValue => {\n        function valueOf(option) {\n          if (option && option.originalModel) {\n            return ctrl.optionsParser.getValue(option.originalModel);\n          }\n\n          return ctrl.optionsParser.getValue(option);\n        }\n\n        if (ctrl.ngModelCtrl) {\n          if (getType() === 'suggest') {\n            ctrl.ngModelCtrl.$setViewValue(selectedValue.label);\n          } else if (Array.isArray(selectedValue)) {\n            ctrl.ngModelCtrl.$setViewValue(selectedValue.map(valueOf));\n          } else {\n            ctrl.ngModelCtrl.$setViewValue(valueOf(selectedValue));\n          }\n        }\n      };\n\n      ctrl.convertNgModelToSelect = model => {\n        function convertItem(modelValue) {\n          let item = ctrl.optionsParser.getOptionByValue(modelValue, ctrl.loadedOptions || []);\n\n          // could happen when lazily fetching the data\n          if (item === undefined) {\n            item = modelValue;\n          }\n\n          return angular.extend({\n            key: ctrl.optionsParser.getKey(item),\n            label: ctrl.optionsParser.getLabel(item),\n            selectedLabel: ctrl.optionsParser.getSelectedLabel(item),\n            description: ctrl.optionsParser.getDescription(item),\n            originalModel: item\n          }, typeof item === 'object' ? item : null);\n        }\n\n        if (model !== undefined && model !== null) {\n          if (Array.isArray(model)) {\n            return model.map(convertItem);\n          } else {\n            return convertItem(model);\n          }\n        }\n\n        return undefined;\n      };\n\n      let lastQuery = null;\n      let inProcessQueries = 0;\n      ctrl.getOptions = (query, skip) => $q.when(ctrl.optionsParser.getOptions(query, skip));\n\n      let loaderDelayTimeout = null;\n      ctrl.showLoader = () => {\n        if (getType() !== 'suggest') {\n          reRenderSelect({loading: true});\n        }\n      };\n\n      ctrl.loadOptionsToSelect = query => {\n        if (ctrl.stopLoadingNewOptions && query === lastQuery) {\n          return $q.resolve();\n        }\n\n        ctrl.stopLoadingNewOptions = false;\n        const skip = getCurrentSkipParameter(query, lastQuery);\n        lastQuery = query;\n\n        $timeout.cancel(loaderDelayTimeout);\n\n        // Delay loader only when there is some data\n        // Otherwise, user can notice the \"not found\" message\n        if (ctrl.dataReceived) {\n          loaderDelayTimeout = $timeout(ctrl.showLoader, LOADER_DELAY);\n        } else {\n          ctrl.showLoader();\n        }\n\n        inProcessQueries++;\n        return ctrl.getOptions(query, skip).then(results => {\n          inProcessQueries--;\n          if (query !== lastQuery) {\n            return; // do not process the result if queries don't match\n          }\n\n          const items = memorizeOptions(results.data || results, skip).\n            map(ctrl.convertNgModelToSelect);\n          $timeout.cancel(loaderDelayTimeout);\n          ctrl.dataReceived = true;\n          reRenderSelect({\n            data: items,\n            loading: false\n          });\n        }).catch(error => {\n          inProcessQueries--;\n          $timeout.cancel(loaderDelayTimeout);\n          reRenderSelect({\n            loading: false\n          });\n          return $q.reject(error);\n        });\n      };\n\n      function setSelectModel(newValue) {\n        if (ctrl.ngModelCtrl) {\n          reRenderSelect({\n            selected: ctrl.convertNgModelToSelect(newValue)\n          });\n        }\n      }\n\n      function syncNgModelToSelect() {\n        $scope.$watch(() => ctrl.ngModelCtrl && ctrl.ngModelCtrl.$modelValue, setSelectModel, true);\n      }\n\n      function syncDisabled() {\n        $attrs.$observe('disabled', newValue => {\n          reRenderSelect({disabled: newValue});\n        });\n      }\n\n      function syncMultiple() {\n        $scope.$watch(() => ctrl.multiple, () => {\n          if (angular.isDefined(ctrl.multiple)) {\n            reRenderSelect({multiple: ctrl.multiple});\n          }\n        });\n      }\n\n      function syncConfig() {\n        $scope.$watchCollection(() => ctrl.config, (config, old) => {\n          if (config !== old) {\n            reRenderSelect(config);\n          }\n        });\n      }\n\n      function isSelectPopupOpen() {\n        return ctrl.selectInstance._popup.isVisible();\n      }\n\n      function attachDropdownIfNeeded() {\n        if (getType() === 'dropdown') {\n          const handler = () => {\n            ctrl.selectInstance._clickHandler();\n          };\n          element.addEventListener('click', handler);\n          element.addEventListener('keydown', event => {\n            const key = getEventKey(event);\n            const modifier = event.ctrlKey || event.altKey || event.metaKey || event.shiftKey;\n\n            if (\n              (key === 'Enter' && !modifier || key === ' ')\n            ) {\n              if (!isSelectPopupOpen()) {\n                handler();\n\n                // XXX: preventDefault is needed because some controls (button, input, etc)\n                // have an activation behaviour which fires a `click` event on `keypress`\n                // @see https://www.w3.org/TR/2017/PR-html51-20170803/editing.html#activation\n                event.preventDefault();\n\n                // XXX: stopPropagation is needed because when a React component is rendered with\n                // shortcuts, document-level handlers are added. For example, `enter` that leads\n                // to this handler being called right after current function's call, which\n                // leads to the popup being closed immediately after opening.\n                // @see https://www.w3.org/TR/uievents/#Event_dispatch_and_DOM_event_flow\n                event.stopPropagation();\n              }\n            }\n          });\n        }\n      }\n\n      function listenToRouteChanges() {\n        $scope.$on('$locationChangeSuccess', () => {\n          if (isSelectPopupOpen()) {\n            ctrl.selectInstance._hidePopup();\n          }\n        });\n      }\n\n      function getSelectType() {\n        return types[getType()] || types.material;\n      }\n\n      function getSelectSize() {\n        return sizes[ctrl.size] || sizes.FULL;\n      }\n\n      function reRenderSelect(props) {\n        if (ctrl.selectInstance.node) {\n          ctrl.selectInstance.rerender(props);\n        }\n      }\n\n      /**\n       * @param {newValue} newValue New value of options\n       * @param {value} value Previous value of options\n       */\n      function optionsWatcher(newValue, value) {\n        memorizeOptions(newValue, 0);\n\n        if (newValue === value) {\n          return;\n        }\n\n        if (ctrl.ngModelCtrl) {\n          setSelectModel(ctrl.ngModelCtrl.$modelValue);\n        }\n      }\n\n\n      function createDefaultConfig() {\n        const defaultConfig = {\n          label: ctrl.label || RingMessageBundle.select_label(),\n          selectedLabel: ctrl.selectedLabel,\n          allowAny: getType() === 'suggest',\n          hideArrow: getType() === 'suggest',\n          filter: ctrl.filter,\n          tags: ctrl.tags,\n          multiple: ctrl.multiple,\n          popupClassName: $attrs.popupClass,\n          clear: ctrl.clear,\n          ringPopupTarget: isInDialog() ? 'dialog-ng-popup-container' : null,\n          renderOptimization: getType() !== 'dropdown',\n          type: getSelectType(),\n          loadingMessage: ctrl.loadingMessage || RingMessageBundle.select_loading(),\n          notFoundMessage: ctrl.notFoundMessage || RingMessageBundle.select_options_not_found(),\n          targetElement: getType() === 'dropdown' ? element : null,\n          size: getSelectSize(),\n          onBeforeOpen: () => {\n            resetMemorizedOptions();\n            ctrl.loadOptionsToSelect(ctrl.query);\n            $scope.$evalAsync(() => {});\n          },\n          onOpen: () => {\n            $scope.$evalAsync(() => {\n              ctrl.onOpen();\n            });\n          },\n          onClose: () => {\n            ctrl.query = null;\n            $scope.$evalAsync(() => {\n              ctrl.onClose();\n            });\n          },\n          onSelect: (selected, event) => {\n            $scope.$evalAsync(() => {\n              ctrl.onSelect({selected, event});\n            });\n          },\n          onDeselect: (deselected, event) => {\n            $scope.$evalAsync(() => {\n              ctrl.onDeselect({deselected, event});\n            });\n          },\n          onChange: (selected, event) => {\n            ctrl.syncSelectToNgModel(selected);\n\n            $scope.$evalAsync(() => {\n              ctrl.onChange({selected, event});\n            });\n          },\n          onFilter: query => {\n            $scope.$evalAsync(() => {\n              ctrl.query = query;\n              if (ctrl.externalFilter) {\n                ctrl.loadOptionsToSelect(query);\n              }\n              if (ctrl.onFilter) {\n                ctrl.onFilter(query);\n              }\n            });\n          },\n          reloadOptions: query => {\n            $scope.$evalAsync(() => {\n              ctrl.loadOptionsToSelect(query || ctrl.query);\n            });\n          },\n          getLoadedOptions: () => ctrl.loadedOptions\n        };\n\n        if (infiniteScrollPackSize) {\n          defaultConfig.onLoadMore = () => {\n            if (inProcessQueries === 0) {\n              $scope.$evalAsync(() => {\n                ctrl.loadOptionsToSelect(ctrl.query);\n              });\n            }\n          };\n        }\n\n        return defaultConfig;\n      }\n\n      function removeDefaultConfigPropFromUserConfig() {\n        if (!ctrl.defaultConfig || !ctrl.config) {\n          return;\n        }\n\n        Object.keys(ctrl.defaultConfig).filter(propName =>\n          ctrl.config[propName] === ctrl.defaultConfig[propName]\n        ).forEach(propName => {\n          delete ctrl.config[propName];\n        });\n      }\n\n      ctrl.$onDestroy = () => {\n        unmountComponentAtNode(container);\n        removeDefaultConfigPropFromUserConfig();\n      };\n\n      ctrl.$onInit = () => {\n        ctrl.optionsParser = new SelectOptions(scope, ctrl.options);\n\n        ctrl.lazy = ctrl.hasOwnProperty('lazy') ? ctrl.lazy : true;\n\n        /**\n         * Provide specific filter function if externalFilter is enabled\n         */\n        if (ctrl.externalFilter) {\n          ctrl.filter = ctrl.filter || {};\n          ctrl.filter.fn = () => true;\n        }\n\n        ctrl.defaultConfig = createDefaultConfig();\n        ctrl.config = angular.extend({}, ctrl.defaultConfig, ctrl.config || {});\n\n        if (getType() === 'suggest' || getType() === 'input') {\n          ctrl.selectInstance = render(<RerenderableSelect {...ctrl.config}/>, container);\n        } else {\n          ctrl.selectInstance = new SelectLazy(container, ctrl.config, ctrl, getType());\n        }\n\n        // Preserve existing contents of the directive\n        element.appendChild(container);\n\n        if (!ctrl.lazy) {\n          if (!ctrl.optionsParser.datasourceIsFunction) {\n            $scope.$watch(() => ctrl.optionsParser.getOptions(ctrl.query, 0), optionsWatcher, true);\n          } else {\n            ctrl.loadOptionsToSelect(ctrl.query);\n          }\n        }\n\n        syncNgModelToSelect();\n        syncDisabled();\n        syncMultiple();\n        if (ctrl.configAutoUpdate) {\n          syncConfig();\n        }\n        attachDropdownIfNeeded();\n        listenToRouteChanges();\n      };\n    }\n  };\n});\n\nexport default angularModule.name;\n",
  "examples": [
    {
      "name": "Select-ng",
      "url": "examples/select-ng/select-ng.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as ctrl\">\n  <rg-select ng-model=\"ctrl.selectedItem\"\n    size=\"M\"\n    config=\"ctrl.config\"\n    select-type=\"button\"\n    clear=\"true\"\n    options=\"item.text for item in ctrl.options track by item.id\"\n    label=\"Select item\" ng-disabled=\"ctrl.disabled\"></rg-select>\n  <div>Selected item: {{ctrl.selectedItem | json}}</div>\n  <div>\n    <button ng-click=\"ctrl.disabled = true\">Disable</button>\n    <button ng-click=\"ctrl.disabled = false\">Enable</button>\n    <button ng-click=\"ctrl.rerender()\"}>Update model</button>\n  </div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport SelectNG from '@jetbrains/ring-ui/components/select-ng/select-ng';\n\nangular.module('test', [SelectNG]).controller('testCtrl', function () {\n  var ctrl = this;\n\n  ctrl.options = [\n    {id: 1, text: '11111'},\n    {id: 2, text: '22222'},\n    {id: 3, text: '33333'}\n  ];\n\n  ctrl.rerender = () => {\n    ctrl.selectedItem = ctrl.options[2];\n  };\n\n  ctrl.selectedItem = ctrl.options[1];\n});\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select-ng-in-rg-tabs",
      "url": "examples/select-ng/select-ng-in-rg-tabs.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as ctrl\">\n  <rg-tabs>\n    <rg-tabs-pane x-title=\"With select\">\n      <div>tab 1</div>\n      <rg-select ng-model=\"ctrl.selectedItem\" config=\"ctrl.selectConfig\"\n        size=\"M\"\n        options=\"item.text for item in ctrl.options track by item.id\"\n        label=\"Select item\"></rg-select>\n    </rg-tabs-pane>\n    <rg-tabs-pane x-title=\"Another tab\" counter=\"7\">Tab 2</rg-tabs-pane>\n  </rg-tabs>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport SelectNG from '@jetbrains/ring-ui/components/select-ng/select-ng';\nimport 'angular-route';\nimport TabsNG from '@jetbrains/ring-ui/components/tabs-ng/tabs-ng';\n\nangular.module('test', [SelectNG, TabsNG]).\n  controller('testCtrl', function () {\n    var ctrl = this;\n\n    ctrl.options = [\n      {id: 1, text: '11111'},\n      {id: 2, text: '22222'},\n      {id: 3, text: '33333'}\n    ];\n\n    ctrl.selectConfig = {};\n\n    ctrl.selectedItem = ctrl.options[1];\n  });\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select-ng-as-input",
      "url": "examples/select-ng/select-ng-as-input.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as ctrl\">\n  <rg-select ng-model=\"ctrl.selectedItem\" size=\"M\"\n    options=\"item.text for item in ctrl.options track by item.id\"\n    label=\"Select item\" ng-disabled=\"ctrl.disabled\"\n    type=\"input\"></rg-select>\n  <div>Selected item: {{ctrl.selectedItem | json}}</div>\n  <div>\n    <button ng-click=\"ctrl.disabled = true\">Disable</button>\n    <button ng-click=\"ctrl.disabled = false\">Enable</button>\n  </div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport SelectNG from '@jetbrains/ring-ui/components/select-ng/select-ng';\n\nangular.module('test', [SelectNG]).controller('testCtrl', function () {\n  var ctrl = this;\n\n  ctrl.options = [\n    {id: 1, text: '11111'},\n    {id: 2, text: '22222'},\n    {id: 3, text: '33333'}\n  ];\n\n  ctrl.selectedItem = ctrl.options[1];\n});\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select-ng-as-model",
      "url": "examples/select-ng/select-ng-as-model.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as ctrl\">\n  <rg-select ng-model=\"ctrl.selectedItem\" size=\"M\"\n    options=\"item.id as item.text for item in ctrl.options track by item.id\"\n    label=\"Select item\" ng-disabled=\"ctrl.disabled\"></rg-select>\n  <div>Selected item: {{ctrl.selectedItem}}</div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport SelectNG from '@jetbrains/ring-ui/components/select-ng/select-ng';\n\nangular.module('test', [SelectNG]).controller('testCtrl', function () {\n  var ctrl = this;\n\n  ctrl.options = [\n    {id: 1, text: '11111'},\n    {id: 2, text: '22222'},\n    {id: 3, text: '33333'}\n  ];\n\n  ctrl.selectedItem = ctrl.options[1];\n});\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select-ng-as-model-lazy",
      "url": "examples/select-ng/select-ng-as-model-lazy.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as ctrl\">\n  <p>Be carefully using <b>lazy=false</b> may significantly decrease your\n    performance</p>\n  <p>This case describe when we take from server ng-model and then\n    asynchronous take options for this model</p>\n\n  <rg-select\n    ng-model=\"ctrl.selectedItem\"\n    size=\"M\"\n    lazy=\"false\"\n    options=\"item.id as item.text for item in ctrl.options track by item.id\"></rg-select>\n  <div>Selected item: {{ctrl.selectedItem}}</div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport SelectNG from '@jetbrains/ring-ui/components/select-ng/select-ng';\n\nangular.module('test', [SelectNG]).\n  controller('testCtrl', function ($timeout) {\n    var ctrl = this;\n\n    ctrl.selectedItem = 2\n\n    $timeout(function () {\n      ctrl.options = [\n        {id: 1, text: '11111'},\n        {id: 2, text: '22222'},\n        {id: 3, text: '33333'}\n      ];\n    }, 1000);\n\n  });\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select-ng-promise",
      "url": "examples/select-ng/select-ng-promise.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<h4>Getting items from promise on click with external filtering. (Filter\n  value should be equal to label, not just part)</h4>\n<div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as ctrl\">\n  <rg-select ng-model=\"ctrl.selectedItem\"\n    size=\"M\"\n    options=\"item in ctrl.getItems(query)\" label=\"Select item\"\n    external-filter=\"true\" loading-message=\"Hey! I'm loading!\"></rg-select>\n  <div>Selected item: {{ctrl.selectedItem | json}}</div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport SelectNG from '@jetbrains/ring-ui/components/select-ng/select-ng';\n\nangular.module('test', [SelectNG]).\n  controller('testCtrl', function ($timeout, $q) {\n    var ctrl = this;\n\n    ctrl.options = [\n      {key: 1, label: '1'},\n      {key: 2, label: '2'},\n      {key: 3, label: '3'},\n      {key: 4, label: '4'},\n      {key: 5, label: '5'}\n    ];\n\n    ctrl.selectedItem = ctrl.options[1];\n\n    ctrl.getItems = function (query) {\n      var defer = $q.defer();\n      $timeout(function () {\n        defer.resolve(ctrl.options.filter(function (op) {\n          return query ? op.label === query : true;\n        }));\n      }, 1000 * Math.random());\n      return defer.promise;\n    };\n  });\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select-ng-dropdown",
      "url": "examples/select-ng/select-ng-dropdown.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<h4>Select-ng as dropdown</h4>\n<div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as ctrl\">\n  <button rg-select options=\"item in ctrl.options\" select-type=\"dropdown\"\n    on-change=\"ctrl.onSelect(selected)\" size=\"M\">Click Me\n    &#9660;</button>\n  <ol>\n    <li ng-repeat=\"click in ctrl.clicks track by $index\">{{click.label}}\n    </li>\n  </ol>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport SelectNG from '@jetbrains/ring-ui/components/select-ng/select-ng';\n\nangular.module('test', [SelectNG]).controller('testCtrl', function () {\n  var ctrl = this;\n\n  ctrl.clicks = [];\n\n  ctrl.options = [\n    {key: 1, label: '11111'},\n    {key: 2, label: '22222'},\n    {key: 3, label: '33333'}\n  ];\n\n  ctrl.onSelect = function (item) {\n    ctrl.clicks.push(item);\n  };\n\n});\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select-ng-inside-dialog",
      "url": "examples/select-ng/select-ng-inside-dialog.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as ctrl\">\n  <div>\n    <h1>Text content to make scroll</h1>\n    <div id=\"textContent\"></div>\n    <rg-dialog></rg-dialog>\n  </div>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport SelectNG from '@jetbrains/ring-ui/components/select-ng/select-ng';\nimport DialogNG from '@jetbrains/ring-ui/components/dialog-ng/dialog-ng';\n\nfunction fillScrollableContent() {\n  let html = '<h2>Text to scroll</h2>';\n  for (var i = 0; i < 100; i++) {\n    html += 'Text<br/>'\n  }\n  document.getElementById('textContent').innerHTML = html;\n}\n\nfillScrollableContent();\n\nangular.module('test', [SelectNG, DialogNG])\n.run(function($templateCache) {\n  const tpl = `\n    <rg-select\n      ng-model=\"data.selectedItem\"\n      filter=\"true\"\n      size=\"M\"\n      options=\"item in data.getOptions()\"\n    ></rg-select>\n  `;\n  $templateCache.put('test-tpl.html', tpl);\n})\n.controller('testCtrl', function($timeout, dialog) {\nconst data = {\n  getOptions: () => {\n    return $timeout(function() {\n      return [\n        {key: 1, label: '11111'},\n        {key: 2, label: '22222'}\n      ];\n    }, 1000);\n  }\n}\n\n$timeout(() =>{\n  dialog.show({\n    title: 'Select in dialog demo',\n    description: 'Select popup should not scroll with background page content',\n    data: data,\n    content: 'test-tpl.html'\n  });\n}, 100);\n});\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select-ng-multiple",
      "url": "examples/select-ng/select-ng-multiple.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<h4>Multiple select</h4>\n<div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as ctrl\">\n  <rg-select ng-model=\"ctrl.selectedItems\" options=\"item in ctrl.options\"\n    size=\"M\"\n    label=\"Select item\" multiple=\"ctrl.multiple\"></rg-select>\n  <div>Selected items: {{ctrl.selectedItems | json}}</div>\n  <button ng-click=\"ctrl.selectedItems.splice(0, 1)\">Deselect first item\n  </button>\n  <button ng-click=\"ctrl.options.splice(0, 1)\">Remove first option</button>\n  <button ng-click=\"ctrl.multiple = !ctrl.multiple\">Toggle multiple</button>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport SelectNG from '@jetbrains/ring-ui/components/select-ng/select-ng';\n\nangular.module('test', [SelectNG]).controller('testCtrl', function () {\n  var ctrl = this;\n  ctrl.multiple = true;\n\n  ctrl.options = [\n    {key: 1, label: '11111'},\n    {key: 2, label: '22222'},\n    {key: 3, label: '33333'},\n    {key: 4, label: '4444444'},\n    {key: 5, label: '5555'}\n  ];\n\n  ctrl.selectedItems = [ctrl.options[1], ctrl.options[2]];\n});\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select-ng-form",
      "url": "examples/select-ng/select-ng-form.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<h4>Form with validation</h4>\n\n<div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as ctrl\">\n  <form name=\"testForm\" class=\"ring-form ring-form_border\" novalidate>\n    <div class=\"ring-form__wrap\">\n      <div class=\"ring-form__control\">\n        <label class=\"ring-form__label\" translate>Required item:</label>\n        <rg-select ng-model=\"ctrl.item1\"\n          options=\"item as item for item in ctrl.options\"\n          size=\"M\"\n          label=\"Select item\" required name=\"requiredSelect\"></rg-select>\n\n        <div class=\"installer-form__error-hint ring-error-bubble active\"\n          ng-if=\"testForm.requiredSelect.$invalid\">\n          Error {{testForm.requiredSelect.$error}}\n        </div>\n      </div>\n      <button ng-disabled=\"testForm.$invalid\">Submit</button>\n    </div>\n    <div>Errors: {{testForm.$error}}</div>\n  </form>\n</div>\n\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport SelectNG from '@jetbrains/ring-ui/components/select-ng/select-ng';\nimport FormNG from '@jetbrains/ring-ui/components/form-ng/form-ng';\n\nangular.module('test', [SelectNG, FormNG]).\n  controller('testCtrl', function () {\n    var ctrl = this;\n\n    //It is not required to use array of strings. Just for example\n    ctrl.options = ['1', '22', '333', '4444'];\n\n    ctrl.selectedItem = null;\n  });\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select-ng-load-more-on-scroll",
      "url": "examples/select-ng/select-ng-load-more-on-scroll.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<h4>Load more elements on scroll</h4>\n\n<div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as ctrl\">\n  <rg-select ng-model=\"ctrl.selectedItem\"\n    external-filter=\"true\"\n    size=\"M\"\n    with-infinite-scroll=\"true\"\n    infinite-scroll-pack-size=\"20\"\n    options=\"item as item for item in ctrl.getOptions(skip, query)\"></rg-select>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport SelectNG from '@jetbrains/ring-ui/components/select-ng/select-ng';\nimport FormNG from '@jetbrains/ring-ui/components/form-ng/form-ng';\n\nangular.module('test', [SelectNG, FormNG]).\n  controller('testCtrl', function ($q, $timeout) {\n    var ctrl = this;\n    var PAGE_SIZE = 20;\n\n    // Result array is increasing after each method call\n    ctrl.getOptions = function (skip, query) {\n      console.log('query = ', query, 'skip = ', skip);\n      var arr = [];\n      if (skip < 50) {\n        for (var i = 0; i < PAGE_SIZE; ++i) {\n          var labelText = (skip + '-' + i) + '';\n          if (query) {\n            labelText = query + ' ' + labelText;\n          }\n          arr.push(labelText);\n        }\n        if (skip === 0) {\n          arr.unshift('Unexpected option at the beginning');\n        }\n      }\n      var defer = $q.defer();\n      // Timeout is needed to demonstrate loader in rg-select\n      $timeout(function () {\n        defer.resolve(arr);\n      }, 1000);\n      return defer.promise;\n    };\n    ctrl.selectedItem = null;\n  });\n  ",
          "showCode": true
        }
      ]
    },
    {
      "name": "Select-ng performance",
      "url": "examples/select-ng/select-ng-performance.html",
      "disableAutoSize": true,
      "files": [
        {
          "type": "html",
          "content": "\n<div ng-app=\"test\" ng-strict-di ng-controller=\"testCtrl as ctrl\">\n  <div style=\"padding: 8px\">\n    <button type=\"button\" ng-click=\"ctrl.renderSelects()\">Render</button>\n    <button type=\"button\" ng-click=\"ctrl.selects = []\">Remove</button>\n\n    <span style=\"color: gray;\">\n      Last render time: <span ng-bind=\"ctrl.renderTime\"></span>\n      | selects counts {{ctrl.selects.length || 0}}\n    </span>\n  </div>\n\n  <rg-select ng-repeat=\"selectId in ctrl.selects\"\n    ng-model=\"ctrl.selectedItem\"\n    size=\"M\"\n    options=\"item.text for item in ctrl.options track by item.id\"\n    label=\"Select item\" ng-disabled=\"ctrl.disabled\">\n  </rg-select>\n</div>\n  ",
          "showCode": true
        },
        {
          "type": "js",
          "content": "\nimport angular from 'angular';\nimport SelectNG from '@jetbrains/ring-ui/components/select-ng/select-ng';\n\nangular.module('test', [SelectNG]).\n  controller('testCtrl', function ($timeout) {\n    var ctrl = this;\n    ctrl.renderTime = null;\n\n    ctrl.options = [\n      {id: 1, text: '11111'},\n      {id: 2, text: '22222'},\n      {id: 3, text: '33333'}\n    ];\n\n    ctrl.renderSelects = function () {\n      var date = Date.now();\n      var selectsCount = 1000;\n\n      ctrl.selects = (new Array(selectsCount)).join('x').\n        split('x').\n        map(function (id) {\n          return {\n            id: id\n          };\n        });\n\n      $timeout(function () {\n        ctrl.renderTime = (Date.now() - date) / 1000 + ' s';\n      }, 16);\n    };\n  });\n  ",
          "showCode": true
        }
      ]
    }
  ],
  "description": "Provides an Angular wrapper for Select.\nOptions argument has one of the following forms:\n* `label` **`in`** `items`\n* `label` **`for`** `item` **`in`** `items`\n* `label` **`for`** `item` **`in`** `items` **`track by`** `trackexpr`\n* `label` **`select as`** `buttontext` **`describe as`** `description` **`for`** `item` **`in`** `items` **`track by`** `trackexpr`\n* `select` **`as`** `label` **`select as`** `buttontext` **`for`** `item` **`in`** `items`\n\nWhere:\n* `items` is an expression that evaluates to a datasource containing data to iterate over. Datasource can be an array or a function that accepts the `query` parameter and returns a promise of an array filtered by the query.\n* `item` is a local variable that will refer to each item in the items.\n* `label` – the result of this expression will be the label for &lt;option&gt; element. The expression will most likely refer to the value variable (e.g. item.name).\n* `select` – the result of this expression will be bound to the model of the parent &lt;select&gt; element. If not specified, select expression will default to item.\n* `trackexpr` is used when working with an array of objects. The result of this expression will be used to identify the objects in the array. The trackexpr will most likely refer to the item variable (e.g. item.id). Used to preserve selection even when the options are recreated (e.g. reloaded from the server).\n* `buttontext` – label for the selected item to be displayed on the button.\n* `description` – description of an item to display in the option list.\n\nExamples:\n* `item in items`\n* `item in dataSource(query)`\n* `item.text for item in items`\n* `item.text for item in items track by item.id`\n* `item.text select as item.fullText describe as item.fullDescription for item in items track by item.id`\n* `item as item.text select as makeFullText(item) for item in items`",
  "attrs": {
    "name": "Select Ng",
    "category": "Legacy Angular",
    "tags": "Ring UI Language",
    "description": "Provides an Angular wrapper for Select.\nOptions argument has one of the following forms:\n* `label` **`in`** `items`\n* `label` **`for`** `item` **`in`** `items`\n* `label` **`for`** `item` **`in`** `items` **`track by`** `trackexpr`\n* `label` **`select as`** `buttontext` **`describe as`** `description` **`for`** `item` **`in`** `items` **`track by`** `trackexpr`\n* `select` **`as`** `label` **`select as`** `buttontext` **`for`** `item` **`in`** `items`\n\nWhere:\n* `items` is an expression that evaluates to a datasource containing data to iterate over. Datasource can be an array or a function that accepts the `query` parameter and returns a promise of an array filtered by the query.\n* `item` is a local variable that will refer to each item in the items.\n* `label` – the result of this expression will be the label for &lt;option&gt; element. The expression will most likely refer to the value variable (e.g. item.name).\n* `select` – the result of this expression will be bound to the model of the parent &lt;select&gt; element. If not specified, select expression will default to item.\n* `trackexpr` is used when working with an array of objects. The result of this expression will be used to identify the objects in the array. The trackexpr will most likely refer to the item variable (e.g. item.id). Used to preserve selection even when the options are recreated (e.g. reloaded from the server).\n* `buttontext` – label for the selected item to be displayed on the button.\n* `description` – description of an item to display in the option list.\n\nExamples:\n* `item in items`\n* `item in dataSource(query)`\n* `item.text for item in items`\n* `item.text for item in items track by item.id`\n* `item.text select as item.fullText describe as item.fullDescription for item in items track by item.id`\n* `item as item.text select as makeFullText(item) for item in items`",
    "example-file": "./select-ng.examples.html"
  }
};