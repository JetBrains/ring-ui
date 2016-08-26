import 'dom4';
import debounce from 'mout/function/debounce';

import {getStyles, getRect, getWindowHeight} from '../dom/dom';

import Selection from './table-ng__selection';
import SelectionNavigateActions from './table-ng__selection-navigate-actions';
import TableToolbar from './table-ng__toolbar';
import PlaceUnder from '../place-under-ng/place-under-ng';

import TablePager from './table-ng__pager';

import Checkbox from '../checkbox-ng/checkbox-ng';

import '../table/table.scss';

/**
 * @name Table Ng
 * @category Angular Components
 * @description Displays tabular data.
 * @example-file ./table-ng__examples.html
*/
/*global angular*/

const angularModule = angular.module('Ring.table', [TableToolbar, TablePager, Checkbox, PlaceUnder]);

angularModule.directive('rgTable', () => ({
  restrict: 'E',
  transclude: true,
  template: require('./table-ng.html'),
  controllerAs: 'ctrl',

  /**
   *{{
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

  controller($scope) {
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
  }
}));

angularModule.directive('rgTableHeader', getClosestElementWithCommonParent => {
  const HEADER_RESIZE_DEBOUNCE = 50;
  const HEADER_SCROLL_DEBOUNCE = 10;
  const TOOLBAR_FIXED_CLASSNAME = 'ring-table__toolbar-controls_fixed';

  return {
    restrict: 'E',
    template: require('./table-ng__header.html'),
    transclude: true,
    replace: true,
    link(scope, iElement, iAttrs) {
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
          scope.$on('rgTable:itemsChanged', scrollListener);
        });
      }

      if (scope.stickToSelector) {
        stickToElement = getClosestElementWithCommonParent(element, scope.stickToSelector);
        startSticking();
      }
    }
  };
});

angularModule.directive('rgTableBody', () => ({
  restrict: 'E',
  template: '<tbody ng-transclude></tbody>',
  transclude: true,
  replace: true
}));

angularModule.directive('rgTableRow', () => ({
  template: require('./table-ng__row.html'),
  restrict: 'E',
  transclude: true,
  replace: true,
  require: ['^rgTable', 'rgTableRow'],

  scope: {
    rowItem: '='
  },

  link(scope, iElement, iAttrs, ctrls) {
    const rgTableCtrl = ctrls[0];
    const rgTableRowCtrl = ctrls[1];
    rgTableRowCtrl.setSelection(rgTableCtrl.selection);
  },

  controllerAs: 'rowCtrl',
  bindToController: true,

  controller($scope, $element) {
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

    $scope.$on('rgTable:activateItem', (e, item) => {
      if (item === this.rowItem) {
        const scrollInfo = getRowOutOfViewInfo(element, 2);
        if (scrollInfo.isOutOfView) {
          element.scrollIntoView(scrollInfo.isGoneUp);
          addSpacingAfterScroll(scrollInfo.isGoneDown ? scrollInfo.offset : -scrollInfo.offset);
        }
      }
    });
  }
}));

angularModule.directive('rgTableHeaderCheckbox', () => ({
  restrict: 'E',
  require: '^rgTable',
  replace: true,
  template: '<span class="ring-table__header-checkbox"><rg-checkbox ng-click="onClickChange()" ng-model="allChecked"/></span>',

  link(scope, iElement, iAttrs, tableCtrl) {
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

    scope.$on('rgTable:itemsChanged', () => {
      if (scope.allChecked) {
        markAllItemsAs(true);
      }
      recheckSelection();
    });
    scope.$on('rgTable:selectionChanged', recheckSelection);

    scope.onClickChange = () => {
      markAllItemsAs(scope.allChecked);
    };
  }
}));

/**
 * A checkbox cell for table. Uses rg-table-row parent directive as model host
 */
angularModule.directive('rgTableCheckboxCell', () => ({
  restrict: 'E',
  transclude: true,
  require: '^rgTableRow',
  replace: true,
  template: '<td class="ring-table__selector ring-table__column_selector" ng-class="{\'ring-table__column\': !isEmbedded}"><rg-checkbox ng-model="getRowItem().checked"/></td>',

  link(scope, iElement, iAttrs, rowCtrl) {
    /**
     * rowItem getter to use it as ng-model for checkbox
     */
    scope.getRowItem = () => rowCtrl.rowItem;
    scope.isEmbedded = angular.isDefined(iAttrs.embedded);
  }
}));

/**
 * Table title wrapper, receive next attributes:
 * {{
    border: whether or not title contain right border
    active: makes title more bolder
  }}
 */
angularModule.directive('rgTableTitle', () => ({
  restrict: 'E',
  transclude: true,
  replace: true,
  scope: true,
  template: require('./table-ng__title.html'),

  link(scope, iElement, iAttrs) {
    /**
     * One time property assigning without watching through isolated scope helps to improve performance
     */
    scope.isBorder = angular.isDefined(iAttrs.border);
    scope.isActive = angular.isDefined(iAttrs.active);
    scope.isPullRight = angular.isDefined(iAttrs.pullRight);
    scope.isAlignRight = angular.isDefined(iAttrs.alignRight);
    scope.isPullLeft = angular.isDefined(iAttrs.pullLeft);
  }
}));

/**
 * Column wrapper, receive next attributes:
 * {{
    limited: is column width should be limited,
    wide: for wide columns
    avatar: for columns contains avatar
  }}
 */
angularModule.directive('rgTableColumn', () => ({
  restrict: 'E',
  transclude: true,
  replace: true,
  scope: true,
  template: require('./table-ng__column.html'),

  link(scope, iElement, iAttrs) {
    const element = iElement[0];

    scope.isLimited = angular.isDefined(iAttrs.limited);
    scope.isUnlimited = angular.isDefined(iAttrs.unlimited);
    scope.isAvatar = angular.isDefined(iAttrs.avatar);
    scope.isWide = angular.isDefined(iAttrs.wide);
    scope.isAlignRight = angular.isDefined(iAttrs.alignRight);
    scope.isGray = angular.isDefined(iAttrs.gray);
    scope.isPullRight = angular.isDefined(iAttrs.pullRight);
    scope.isPullLeft = angular.isDefined(iAttrs.pullLeft);

    function adjustUnlimitedColumnWidths() {
      const unlimitedColumnsCount = element.parentNode.queryAll('.ring-table__column[unlimited]').length;
      if (unlimitedColumnsCount > 1) {
        element.style.width = `${(100 / unlimitedColumnsCount).toFixed()}%`;
      }
    }

    if (scope.isUnlimited) {
      adjustUnlimitedColumnWidths();
    }
  }
}));

/**
 * Class with default hotkeys navigation actions (e.g. select, clear selection, move up/down)
 */
angularModule.constant('SelectionNavigateActions', SelectionNavigateActions);

export default angularModule.name;
