import angular from 'angular';

import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';

import getEventKey from '../global/get-event-key';
import Select, {RerenderableSelect} from '../select/select';
import MessageBundle from '../message-bundle-ng/message-bundle-ng';

import SelectNgOptions from './select-ng__options';
import SelectLazy from './select-ng__lazy';

const LOADER_DELAY = 150; // delay to show loader in ms
const INFINITE_SCROLL_PACK_SIZE = 50;
const DIALOG_NG_SELECTOR = '[data-anchor=dialog-container][data-in-sidebar=false]';
/**
 * @name Select Ng
 */

const angularModule = angular.module('Ring.select', [SelectNgOptions, MessageBundle]);

angularModule.directive('rgSelect', function rgSelectDirective() {
  const types = {
    input: Select.Type.INPUT,
    button: Select.Type.BUTTON,
    material: Select.Type.MATERIAL,
    dropdown: Select.Type.CUSTOM,
    suggest: Select.Type.INPUT
  };

  const sizes = {
    FULL: Select.Size.FULL,
    S: Select.Size.S,
    M: Select.Size.M,
    L: Select.Size.L
  };

  return {
    /**
     * @property {Object} scope
     * @property {Object} scope.ngModel
     * @property {String} scope.selectType - select type. Can be "button" (default), "input" or "dropdown"
     * @property {String} scope.lazy - Load options lazily. "true" by default.
     * @property {Boolean} scope.withInfiniteScroll - If true, rgSelect calls getOptions with skip parameter when the list is scrolled to the bottom
     * @property {String} scope.options - query for options
     * @property {Boolean} scope.externalFilter - whether or not to use the options function as a filter.
     * "filter" property should not be passed in that case.
     * @property {Boolean} scope.multiple - toggles multiple selection
     * @property {Function} scope.onSelect - callback to call on item selection
     * Receives "selected" property (<rg-select on-select='doSomethingWith(selected)'>)
     * @property {Function} scope.onDeselect - callback to call on item deselection
     * Receives "deselected" property (<rg-select on-deselect='doSomethingWith(deselected)'>)
     * @property {Function} scope.onOpen - callback to call on select popup opening
     * @property {Function} scope.onClose - callback to call on select popup closing
     * @property {Function} scope.onChange - callback to call on selection change
     * Receives "selected" property (<rg-select on-change='doSomethingWith(selected)'>)
     * @property {String} scope.label - Label to place on empty select button
     * @property {String} scope.selectedLabel - Label to replace any selected item/items with
     * @property {String} scope.notFoundMessage - message to display if no options found
     * @property {String} scope.loadingMessage - message to display while loading
     * @property {Object} scope.config - hash to pass to react select component
     * @property {Boolean} scope.configAutoUpdate - whether or not to watch for configuration updates
     * @property {String} scope.size - select size. Can be "S", "M" (default), or "L".
     */
    scope: {
      ngModel: '=',

      selectType: '@',
      lazy: '=?',
      withInfiniteScroll: '=?', // NB: Deprecated! Use infinite-scroll-pack-size="50" instead
      infiniteScrollPackSize: '@',

      options: '@',
      optionsScope: '=',
      label: '@',
      selectedLabel: '@',
      externalFilter: '=?',
      filter: '=?',
      tags: '=?',
      multiple: '=?',
      clear: '=?',
      onSelect: '&',
      onDeselect: '&',
      onOpen: '&',
      onClose: '&',
      onChange: '&',
      notFoundMessage: '@',
      loadingMessage: '@',
      config: '=?',
      configAutoUpdate: '=',
      selectInstance: '=?',
      size: '@',
      dir: '@'
    },
    bindToController: true,
    controllerAs: 'selectCtrl',
    require: ['?ngModel', 'rgSelect'],
    link: function link(scope, iElement, iAttrs, ctrls) {
      const ngModelCtrl = ctrls[0];
      const rgSelectCtrl = ctrls[1];

      rgSelectCtrl.setNgModelCtrl(ngModelCtrl);
    },
    // eslint-disable-next-line max-len
    controller: function controller($q, $scope, $element, $attrs, $timeout, SelectOptions, RingMessageBundle) {
      /*eslint-disable consistent-this*/
      const ctrl = this;
      /*eslint-enable consistent-this*/
      const element = $element[0];
      const container = document.createElement('span');
      const infiniteScrollPackSize =
        Number(ctrl.infiniteScrollPackSize) ||
        (ctrl.withInfiniteScroll ? INFINITE_SCROLL_PACK_SIZE : 0);

      /**
       * Properties
       */
      ctrl.selectInstance = null;
      ctrl.ngModelCtrl = null;
      ctrl.query = null;
      ctrl.dataReceived = false;

      ctrl.skipNextModelSync = false;

      const scope = ctrl.optionsScope ? ctrl.optionsScope : $scope.$parent;

      ctrl.setNgModelCtrl = ngModelCtrl => {
        ctrl.ngModelCtrl = ngModelCtrl;
      };

      /**
       * @param {Array} options
       */
      function memorizeOptions(options, skip) {
        if (ctrl.loadedOptions && skip > 0) {
          ctrl.loadedOptions = ctrl.loadedOptions.concat(options);
          ctrl.stopLoadingNewOptions = options.length === 0 && infiniteScrollPackSize;
        } else {
          ctrl.loadedOptions = options;
        }
        ctrl.lastSkip = skip;
        return ctrl.loadedOptions;
      }

      function resetMemorizedOptions() {
        ctrl.lastSkip = -1;
        ctrl.loadedOptions = [];
        ctrl.stopLoadingNewOptions = false;
      }

      function getType() {
        // $attrs.type as fallback, not recommended to use because of native "type" attribute
        return ctrl.selectType || $attrs.type;
      }

      function getCurrentSkipParameter(query, prevQuery) {
        if (!infiniteScrollPackSize || query !== prevQuery || !ctrl.loadedOptions) {
          return 0;
        }
        return ctrl.lastSkip < 0 ? 0 : ctrl.lastSkip + infiniteScrollPackSize;
      }

      function isInDialog() {
        const dialogContainer = document.querySelector(DIALOG_NG_SELECTOR);
        return dialogContainer && dialogContainer.contains(element);
      }


      ctrl.syncSelectToNgModel = selectedValue => {
        function valueOf(option) {
          if (option && option.originalModel) {
            return ctrl.optionsParser.getValue(option.originalModel);
          }

          return ctrl.optionsParser.getValue(option);
        }

        if (ctrl.ngModelCtrl) {
          ctrl.skipNextModelSync = true;
          if (getType() === 'suggest') {
            ctrl.ngModelCtrl.$setViewValue(selectedValue.label);
          } else if (Array.isArray(selectedValue)) {
            ctrl.ngModelCtrl.$setViewValue(selectedValue.map(valueOf));
          } else {
            ctrl.ngModelCtrl.$setViewValue(valueOf(selectedValue));
          }
        }
      };

      ctrl.convertNgModelToSelect = model => {
        function convertItem(modelValue) {
          let item = ctrl.optionsParser.getOptionByValue(modelValue, ctrl.loadedOptions || []);

          // could happen when lazily fetching the data
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

        return undefined;
      };

      let lastQuery = null;
      let inProcessQueries = 0;
      ctrl.getOptions = (query, skip) => $q.when(ctrl.optionsParser.getOptions(query, skip));

      let loaderDelayTimeout = null;
      ctrl.showLoader = () => {
        if (getType() !== 'suggest') {
          reRenderSelect({loading: true});
        }
      };

      ctrl.loadOptionsToSelect = query => {
        if (inProcessQueries > 0) {
          return $q.resolve();
        }
        if (ctrl.stopLoadingNewOptions && query === lastQuery) {
          return $q.resolve();
        }

        ctrl.stopLoadingNewOptions = false;
        const skip = getCurrentSkipParameter(query, lastQuery);
        lastQuery = query;

        $timeout.cancel(loaderDelayTimeout);

        // Delay loader only when there is some data
        // Otherwise, user can notice the "not found" message
        if (ctrl.dataReceived) {
          loaderDelayTimeout = $timeout(ctrl.showLoader, LOADER_DELAY);
        } else {
          ctrl.showLoader();
        }

        inProcessQueries++;
        return ctrl.getOptions(query, skip).then(results => {
          inProcessQueries--;
          if (query !== lastQuery) {
            return; // do not process the result if queries don't match
          }

          const items = memorizeOptions(results.data || results, skip).
            map(ctrl.convertNgModelToSelect);
          $timeout.cancel(loaderDelayTimeout);
          ctrl.dataReceived = true;
          reRenderSelect({
            data: items,
            loading: false
          });
        }).catch(error => {
          inProcessQueries--;
          $timeout.cancel(loaderDelayTimeout);
          reRenderSelect({
            loading: false
          });
          return $q.reject(error);
        });
      };

      function setSelectModel(newValue) {
        if (ctrl.skipNextModelSync) {
          ctrl.skipNextModelSync = false;
          return;
        }
        if (ctrl.ngModelCtrl) {
          reRenderSelect({
            selected: ctrl.convertNgModelToSelect(newValue)
          });
        }
      }

      function syncNgModelToSelect() {
        $scope.$watch(() => ctrl.ngModelCtrl && ctrl.ngModelCtrl.$modelValue, setSelectModel, true);
      }

      function syncDisabled() {
        $attrs.$observe('disabled', newValue => {
          reRenderSelect({disabled: newValue});
        });
      }

      function syncMultiple() {
        $scope.$watch(() => ctrl.multiple, () => {
          if (angular.isDefined(ctrl.multiple)) {
            reRenderSelect({multiple: ctrl.multiple});
          }
        });
      }

      function syncConfig() {
        $scope.$watchCollection(() => ctrl.config, (config, old) => {
          if (config !== old) {
            reRenderSelect(config);
          }
        });
      }

      function isSelectPopupOpen() {
        return ctrl.selectInstance._popup.isVisible();
      }

      function attachDropdownIfNeeded() {
        if (getType() === 'dropdown') {
          const handler = () => {
            ctrl.selectInstance._clickHandler();
          };
          element.addEventListener('click', handler);
          element.addEventListener('keydown', event => {
            const key = getEventKey(event);
            const modifier = event.ctrlKey || event.altKey || event.metaKey || event.shiftKey;

            if (
              (key === 'Enter' && !modifier || key === ' ')
            ) {
              if (!isSelectPopupOpen()) {
                handler();

                // XXX: preventDefault is needed because some controls (button, input, etc)
                // have an activation behaviour which fires a `click` event on `keypress`
                // @see https://www.w3.org/TR/2017/PR-html51-20170803/editing.html#activation
                event.preventDefault();

                // XXX: stopPropagation is needed because when a React component is rendered with
                // shortcuts, document-level handlers are added. For example, `enter` that leads
                // to this handler being called right after current function's call, which
                // leads to the popup being closed immediately after opening.
                // @see https://www.w3.org/TR/uievents/#Event_dispatch_and_DOM_event_flow
                event.stopPropagation();
              }
            }
          });
        }
      }

      function listenToRouteChanges() {
        $scope.$on('$locationChangeSuccess', () => {
          if (isSelectPopupOpen()) {
            ctrl.selectInstance._hidePopup();
          }
        });
      }

      function getSelectType() {
        return types[getType()] || types.material;
      }

      function getSelectSize() {
        return sizes[ctrl.size] || sizes.FULL;
      }

      function reRenderSelect(props) {
        if (ctrl.selectInstance.node) {
          ctrl.selectInstance.rerender(props);
        }
      }

      /**
       * @param {newValue} newValue New value of options
       * @param {value} value Previous value of options
       */
      function optionsWatcher(newValue, value) {
        memorizeOptions(newValue, 0);

        if (newValue === value) {
          return;
        }

        if (ctrl.ngModelCtrl) {
          setSelectModel(ctrl.ngModelCtrl.$modelValue);
        }
      }


      function createDefaultConfig() {
        const defaultConfig = {
          label: ctrl.label || RingMessageBundle.select_label(),
          selectedLabel: ctrl.selectedLabel,
          allowAny: getType() === 'suggest',
          hideArrow: getType() === 'suggest',
          filter: ctrl.filter,
          tags: ctrl.tags,
          dir: ctrl.dir,
          multiple: ctrl.multiple,
          popupClassName: $attrs.popupClass,
          clear: ctrl.clear,
          ringPopupTarget: isInDialog() ? 'dialog-ng-popup-container' : null,
          renderOptimization: getType() !== 'dropdown',
          type: getSelectType(),
          loadingMessage: ctrl.loadingMessage || RingMessageBundle.select_loading(),
          notFoundMessage: ctrl.notFoundMessage || RingMessageBundle.select_options_not_found(),
          targetElement: getType() === 'dropdown' ? element : null,
          size: getSelectSize(),
          onBeforeOpen: () => {
            resetMemorizedOptions();
            ctrl.loadOptionsToSelect(ctrl.query);
            $scope.$evalAsync(() => {});
          },
          onOpen: () => {
            $scope.$evalAsync(() => {
              ctrl.onOpen();
            });
          },
          onClose: () => {
            ctrl.query = null;
            $scope.$evalAsync(() => {
              ctrl.onClose();
            });
          },
          onSelect: (selected, event) => {
            $scope.$evalAsync(() => {
              ctrl.onSelect({selected, event});
            });
          },
          onDeselect: (deselected, event) => {
            $scope.$evalAsync(() => {
              ctrl.onDeselect({deselected, event});
            });
          },
          onChange: (selected, event) => {
            ctrl.syncSelectToNgModel(selected);

            $scope.$evalAsync(() => {
              ctrl.onChange({selected, event});
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
          },
          reloadOptions: query => {
            $scope.$evalAsync(() => {
              ctrl.loadOptionsToSelect(query || ctrl.query);
            });
          },
          getLoadedOptions: () => ctrl.loadedOptions
        };

        if (infiniteScrollPackSize) {
          defaultConfig.onLoadMore = () => {
            if (inProcessQueries === 0) {
              $scope.$evalAsync(() => {
                ctrl.loadOptionsToSelect(ctrl.query);
              });
            }
          };
        }

        return defaultConfig;
      }

      function removeDefaultConfigPropFromUserConfig() {
        if (!ctrl.defaultConfig || !ctrl.config) {
          return;
        }

        Object.keys(ctrl.defaultConfig).filter(propName =>
          ctrl.config[propName] === ctrl.defaultConfig[propName]
        ).forEach(propName => {
          delete ctrl.config[propName];
        });
      }

      ctrl.$onDestroy = () => {
        unmountComponentAtNode(container);
        removeDefaultConfigPropFromUserConfig();
      };

      ctrl.$onInit = () => {
        ctrl.optionsParser = new SelectOptions(scope, ctrl.options);

        ctrl.lazy = ctrl.hasOwnProperty('lazy') ? ctrl.lazy : true;

        /**
         * Provide specific filter function if externalFilter is enabled
         */
        if (ctrl.externalFilter) {
          ctrl.filter = ctrl.filter || {};
          ctrl.filter.fn = () => true;
        }

        ctrl.defaultConfig = createDefaultConfig();
        ctrl.config = angular.extend({}, ctrl.defaultConfig, ctrl.config || {});

        if (getType() === 'suggest' || getType() === 'input') {
          ctrl.selectInstance = render(<RerenderableSelect {...ctrl.config}/>, container);
        } else {
          ctrl.selectInstance = new SelectLazy(container, ctrl.config, ctrl, getType());
        }

        // Preserve existing contents of the directive
        element.appendChild(container);

        if (!ctrl.lazy) {
          if (!ctrl.optionsParser.datasourceIsFunction) {
            $scope.$watch(() => ctrl.optionsParser.getOptions(ctrl.query, 0), optionsWatcher, true);
          } else {
            ctrl.loadOptionsToSelect(ctrl.query);
          }
        }

        syncNgModelToSelect();
        syncDisabled();
        syncMultiple();
        if (ctrl.configAutoUpdate) {
          syncConfig();
        }
        attachDropdownIfNeeded();
        listenToRouteChanges();
      };
    }
  };
});

export default angularModule.name;
