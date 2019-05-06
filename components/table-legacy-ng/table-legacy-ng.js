import angular from 'angular';

import 'dom4';
import debounce from 'just-debounce-it';

import {getRect, getStyles, getWindowHeight} from '../global/dom';
import PlaceUnder from '../place-under-ng/place-under-ng';
import Checkbox from '../checkbox-ng/checkbox-ng';

import Selection from './table-legacy-ng__selection';
import SelectionNavigateActions from './table-legacy-ng__selection-navigate-actions';
import TableToolbar from './table-legacy-ng__toolbar';
import TablePager from './table-legacy-ng__pager';

import '../table-legacy/table-legacy.scss';

/**
 * @name Table Legacy Ng
 */

const angularModule = angular.module(
  'Ring.table-legacy',
  [TableToolbar, TablePager, Checkbox, PlaceUnder]
);

angularModule.directive('rgLegacyTable', function rgLegacyTableDirective() {
  return {
    restrict: 'E',
    transclude: true,
    template: require('./table-legacy-ng.html'),
    controllerAs: 'ctrl',

    /**
     * {{
     *   items: array, items of table
     *   selection: {Selection}?, a selection object link can be provided to use it outside the table
     * }}
     */
    scope: {
      items: '=',
      selection: '=?',
      disableSelection: '@'
    },

    bindToController: true,

    controller: function controller($scope) {
      this.$onInit = () => {
        if (this.disableSelection) {
          return;
        }

        /**
         * Create Selection instance first to make sure it is always available
         * @type {Selection}
         */
        this.selection = new Selection(this.items, (name, item, index) => {
          $scope.$emit(name, item, index);
          $scope.$broadcast(name, item, index);
        });

        /**
         * Updating items when data is initiated or updated
         */
        $scope.$watch(() => this.items, newItems => {
          if (newItems) {
            this.selection.setItems(newItems);
          }
        });
      };
    }
  };
});

angularModule.directive('rgLegacyTableHeader',
  function rgLegacyTableHeaderDirective(getClosestElementWithCommonParent) {
    const HEADER_RESIZE_DEBOUNCE = 50;
    const HEADER_SCROLL_DEBOUNCE = 10;
    const TOOLBAR_FIXED_CLASSNAME = 'ring-table__toolbar-controls_fixed';

    return {
      restrict: 'E',
      template: require('./table-legacy-ng__header.html'),
      transclude: true,
      replace: true,
      link: function link(scope, iElement, iAttrs) {
        const element = iElement[0];
        let stickToElement = null;

        scope.stickToSelector = iAttrs.stickTo;

        //Shortcut for placing under table toolbar
        if (iAttrs.stickToToolbar !== undefined) {
          scope.stickToSelector = '.ring-table__toolbar';
        }

        const scrollableHeader = element.query('.ring-table__header:not(.ring-table__header_sticky)');
        const fixedHeader = element.query('.ring-table__header_sticky');

        const toolbarFixed = () => stickToElement.query(`.${TOOLBAR_FIXED_CLASSNAME}`) !== null;

        /**
         * Sync header columns width with real table
         */
        const resizeFixedHeader = debounce(() => {
          fixedHeader.style.width = `${scrollableHeader.offsetWidth}px`;
          const titles = fixedHeader.queryAll('.ring-table__title');

          titles.forEach((titleElement, index) => {
            const targetHeaderTitle = scrollableHeader.queryAll('.ring-table__title')[index];
            titleElement.style.width = getStyles(targetHeaderTitle).width;
          });

        }, HEADER_RESIZE_DEBOUNCE, true);

        /**
         * Toggle headers on scroll. Also resize header columns with some big interval
         */
        const scrollListener = debounce(() => {
          if (toolbarFixed()) {
            fixedHeader.style.display = 'block';
            scrollableHeader.style.visibility = 'hidden';
          } else {
            fixedHeader.style.display = 'none';
            scrollableHeader.style.visibility = 'visible';
          }

          resizeFixedHeader();
        }, HEADER_SCROLL_DEBOUNCE);

        function startSticking() {
          scope.$evalAsync(() => {
            window.addEventListener('resize', resizeFixedHeader);
            window.addEventListener('scroll', scrollListener);
            scope.$on('rgLegacyTable:itemsChanged', scrollListener);
          });
        }

        if (scope.stickToSelector) {
          stickToElement = getClosestElementWithCommonParent(element, scope.stickToSelector);
          startSticking();
        }
      }
    };
  }
);

angularModule.directive('rgLegacyTableBody', function rgLegacyTableBodyDirective() {
  return {
    restrict: 'E',
    template: '<tbody ng-transclude></tbody>',
    transclude: true,
    replace: true
  };
});

angularModule.directive('rgLegacyTableRow', function rgLegacyTableRowDirective() {
  return {
    template: require('./table-legacy-ng__row.html'),
    restrict: 'E',
    transclude: true,
    replace: true,
    require: ['^rgLegacyTable', 'rgLegacyTableRow'],

    scope: {
      rowItem: '='
    },

    link: function link(scope, iElement, iAttrs, ctrls) {
      const rgLegacyTableCtrl = ctrls[0];
      const rgLegacyTableRowCtrl = ctrls[1];
      rgLegacyTableRowCtrl.setSelection(rgLegacyTableCtrl.selection);
    },

    controllerAs: 'rowCtrl',
    bindToController: true,

    controller: function controller($scope, $element) {
      const element = $element[0];

      let watchRowCheckFlag;
      this.setSelection = selection => {
        if (!selection) {
          return;
        }

        this.selection = selection;

        if (!watchRowCheckFlag) {
          watchRowCheckFlag = $scope.$watch('rowCtrl.rowItem.checked', newValue => {
            if (newValue !== undefined) {
              this.selection.triggerSelectionChanged(this.rowItem);
            }
          });
        }
      };

      this.setActiveItem = item => {
        item && !item.unselectable && this.selection && this.selection.activateItem(item);
      };

      this.onMouseOver = item => {
        item && !item.unselectable && this.selection && this.selection.setSuggestedItem(item);
      };

      this.onMouseOut = item => {
        item &&
        this.selection &&
        item === this.selection.suggestedItem && this.selection.setSuggestedItem(null);
      };

      this.hasCheckedItems = () => {
        if (!this.selection) {
          return false;
        }
        //TODO: cache this operation if there are performance issues
        const checkedItems = this.selection.getCheckedItems();
        return checkedItems && checkedItems.length > 0;
      };

      function getRowOutOfViewInfo(el, offsetInRows) {
        const rect = getRect(el);
        const offset = rect.height * offsetInRows;

        const isGoneUp = rect.top < offset;
        const isGoneDown = rect.bottom > (getWindowHeight() - offset);

        return {
          offset,
          isOutOfView: isGoneDown || isGoneUp,
          isGoneUp,
          isGoneDown
        };
      }

      function addSpacingAfterScroll(offset) {
        if (window.scrollY) {
          window.scrollBy(0, offset);
        }
      }

      $scope.$on('rgLegacyTable:activateItem', (e, item) => {
        if (item === this.rowItem) {
          const scrollInfo = getRowOutOfViewInfo(element, 2);
          if (scrollInfo.isOutOfView) {
            element.scrollIntoView(scrollInfo.isGoneUp);
            addSpacingAfterScroll(scrollInfo.isGoneDown ? scrollInfo.offset : -scrollInfo.offset);
          }
        }
      });
    }
  };
});

angularModule.
  directive('rgLegacyTableHeaderCheckbox', function rgLegacyTableHeaderCheckboxDirective() {
    return {
      restrict: 'E',
      require: '^rgLegacyTable',
      replace: true,
      template: '<span class="ring-table__header-checkbox"><rg-checkbox ng-click="onClickChange()" ng-model="allChecked"/></span>',

      link: function link(scope, iElement, iAttrs, tableCtrl) {
        // TODO: reduce number of recheckSelection() calls
        scope.allChecked = false;

        function recheckSelection() {
          if (tableCtrl.items && tableCtrl.items.length) {
            scope.allChecked = tableCtrl.items.every(item => item.checked);
          } else {
            scope.allChecked = false;
          }
        }

        function markAllItemsAs(state) {
          tableCtrl.items.forEach(item => {
            item.checked = state;
          });
        }

        scope.$on('rgLegacyTable:itemsChanged', () => {
          if (scope.allChecked) {
            markAllItemsAs(true);
          }
          recheckSelection();
        });
        scope.$on('rgLegacyTable:selectionChanged', recheckSelection);

        scope.onClickChange = () => {
          markAllItemsAs(scope.allChecked);
        };
      }
    };
  });

/**
 * A checkbox cell for table. Uses rg-table-row parent directive as model host
 */
angularModule.directive('rgLegacyTableCheckboxCell', function rgLegacyTableCheckboxCellDirective() {
  return {
    restrict: 'E',
    transclude: true,
    require: '^rgLegacyTableRow',
    replace: true,
    template: '<td class="ring-table__selector ring-table__column_selector" ng-class="{\'ring-table__column\': !isEmbedded}"><rg-checkbox ng-model="getRowItem().checked"/></td>',

    link: function link(scope, iElement, iAttrs, rowCtrl) {
      /**
       * rowItem getter to use it as ng-model for checkbox
       */
      scope.getRowItem = () => rowCtrl.rowItem;
      scope.isEmbedded = angular.isDefined(iAttrs.embedded);
    }
  };
});

/**
 * Table title wrapper, receive next attributes:
 * {{
    border: whether or not title contain right border
    active: makes title more bolder
  }}
 */
angularModule.directive('rgLegacyTableTitle', function rgLegacyTableTitleDirective() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: true,
    template: require('./table-legacy-ng__title.html'),

    link: function link(scope, iElement, iAttrs) {
      /**
       * One time property assigning without watching through isolated scope helps to improve performance
       */
      scope.isBorder = angular.isDefined(iAttrs.border);
      scope.isActive = angular.isDefined(iAttrs.active);
      scope.isPullRight = angular.isDefined(iAttrs.pullRight);
      scope.isAlignRight = angular.isDefined(iAttrs.alignRight);
      scope.isPullLeft = angular.isDefined(iAttrs.pullLeft);
    }
  };
});

/**
 * Column wrapper, receive next attributes:
 * {{
    limited: is column width should be limited,
    wide: for wide columns
    avatar: for columns contains avatar
  }}
 */
angularModule.directive('rgLegacyTableColumn', function rgLegacyTableColumnDirective() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: true,
    template: require('./table-legacy-ng__column.html'),

    link: function link(scope, iElement, iAttrs) {
      const element = iElement[0];
      const FULL_WIDTH = 100;

      scope.isLimited = angular.isDefined(iAttrs.limited);
      scope.isUnlimited = angular.isDefined(iAttrs.unlimited);
      scope.isAvatar = angular.isDefined(iAttrs.avatar);
      scope.isWide = angular.isDefined(iAttrs.wide);
      scope.isAlignRight = angular.isDefined(iAttrs.alignRight);
      scope.isGray = angular.isDefined(iAttrs.gray);
      scope.isPullRight = angular.isDefined(iAttrs.pullRight);
      scope.isPullLeft = angular.isDefined(iAttrs.pullLeft);

      function adjustUnlimitedColumnWidths() {
        const unlimitedColumnsCount = element.parentNode.
          queryAll('.ring-table__column[unlimited]').length;
        if (unlimitedColumnsCount > 1) {
          element.style.width = `${(FULL_WIDTH / unlimitedColumnsCount).toFixed()}%`;
        }
      }

      if (scope.isUnlimited) {
        adjustUnlimitedColumnWidths();
      }
    }
  };
});

/**
 * Class with default hotkeys navigation actions (e.g. select, clear selection, move up/down)
 */
angularModule.constant('SelectionNavigateActions', SelectionNavigateActions);

export default angularModule.name;
