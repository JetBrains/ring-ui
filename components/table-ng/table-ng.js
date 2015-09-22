import 'dom4';
import debounce from 'mout/function/debounce';

import { getStyles, getRect } from 'dom/dom';

import TableSelection from './table-ng__selection';
import './table-ng__toolbar';
import 'place-under-ng/place-under-ng';

import ReactNg from 'react-ng/react-ng';
import Checkbox from 'checkbox/checkbox';

import 'table/table.scss';

ReactNg({Checkbox});

/*global angular*/

/** @name Table Ng
 * @description A table component.
 * @example
<example name="Table-ng">
  <file name="index.html">
    <div ng-app="test" ng-controller="tableExample as ctrl">
      <rg-table-toolbar stick>
        <div>Some toolbar content. Selected item: {{ctrl.selection.getActiveItem().name}}</div>
      </rg-table-toolbar>

      <rg-table items="ctrl.itemsArray" selection="ctrl.selection">
        <rg-table-header>
          <rg-table-title no-border>Avatar</rg-table-title>
          <rg-table-title>Check</rg-table-title>
          <rg-table-title active>Name</rg-table-title>
          <rg-table-title>Groups</rg-table-title>
        </rg-table-header>

        <rg-table-row row-item="item" ng-repeat="item in ctrl.itemsArray">
          <rg-table-column avatar>
            <img ng-if="::item.iconUrl" ng-src="{{ ::item.iconUrl }}" class="ring-table__avatar__img"/>
          </rg-table-column>
            <rg-table-checkbox-cell></rg-table-checkbox-cell>
            <rg-table-column limited>{{ ::item.name }}</rg-table-column>
             <rg-table-column wide limited>
                <span class="ring-table__column-list" ng-repeat="subItem in ::item.subList">{{ ::subItem.name }}</span>
             </rg-table-column>
          </rg-table-row>
        </rg-table>
      </div>
    </file>
    <file name="index.js" webpack="true">
      require('angular/angular.min.js');
      require('table-ng/table-ng');

      angular.module('test', ['Ring.table']).controller('tableExample', function ($scope) {
        var ctrl = this;

        ctrl.itemsArray = [{
          name: 'test1',
          subList: [{name: 'some group'}],
          iconUrl: 'https://d13yacurqjgara.cloudfront.net/users/317408/avatars/mini/Layout_Behance_Avatar_(1).jpg?1376382552'
        }];

        for (var i = 0; i < 20; i++) {
           ctrl.itemsArray.push({
              name: Math.random(),
              subList: [
                {name: Math.random()},
                {name: Math.random()},
                {name: Math.random()}
              ]
           });
        }

      });
    </file>
  </example>

<example name="Table-ng-no-selection">
  <file name="index.html">
    <div ng-app="Ring.table" ng-init="itemsArray = ['first', 'second', 'third', 'fourth']">
      <rg-table items="itemsArray" disable-selection="true">
        <rg-table-row row-item="item" ng-repeat="item in itemsArray">
          <rg-table-column>{{item}}</rg-table-column>
        </rg-table-row>
      </rg-table>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('angular/angular.min.js');
    require('table-ng/table-ng');
  </file>
</example>

<example name="Table-ng-with-sidebar">
  <file name="index.html">
    <h3>Scroll down to see the effect</h2>
    <div ng-app="test" ng-controller="tableExample as ctrl">
      <rg-sidebar show="ctrl.isShowSideBar" place-under-sibling=".some-toolbar"
                  top-offset="1">
        <div class="ring-sidebar__title">Here is sidebar content</div>
        <div class="ring-sidebar__section">{{ctrl.selection.getActiveItem().name}}</div>
        <rg-select options="item.name for item in ctrl.itemsArray track by item.name"></rg-select>

      </rg-sidebar>

      <rg-table-toolbar stick class="some-toolbar">
        <div>Some toolbar content. Selected
          item: {{ctrl.selection.getActiveItem().name}}
          <rg-sidebar-toggle-button model="ctrl.isShowSideBar">Toggle toolbar</hub-expand-table-sidebar>
        </div>
      </rg-table-toolbar>

      <rg-table items="ctrl.itemsArray" selection="ctrl.selection">
        <rg-table-header class="example__table-header" stick-to=".some-toolbar">
          <rg-table-title no-border>Avatar</rg-table-title>
          <rg-table-title>Check</rg-table-title>
          <rg-table-title active>Name</rg-table-title>
          <rg-table-title no-border></rg-table-title>
        </rg-table-header>

        <rg-table-row row-item="item" ng-repeat="item in ctrl.itemsArray">
          <rg-table-column avatar>
            <img ng-if="::item.iconUrl" ng-src="{{ ::item.iconUrl }}"
                 class="ring-table__avatar__img"/>
          </rg-table-column>
          <rg-table-checkbox-cell></rg-table-checkbox-cell>
          <rg-table-column limited>{{::item.name }}</rg-table-column>
          <rg-table-column>
            <rg-sidebar-toggle-button ng-show="item.active" model="ctrl.isShowSideBar"></hub-expand-table-sidebar>
          </rg-table-column>
        </rg-table-row>
      </rg-table>
    </div>
  </file>
  <file name="index.js" webpack="true">
    require('angular/angular.min.js');
    require('table-ng/table-ng');
    require('select-ng/select-ng');
    require('sidebar-ng/sidebar-ng');

    angular.module('test', ['Ring.table', 'Ring.sidebar', 'Ring.select']).controller('tableExample', function ($timeout, $scope) {
    var ctrl = this;

    ctrl.isShowSideBar = true;

    $timeout(function(){
      ctrl.itemsArray = [{
        name: 'test1',
        iconUrl: 'https://d13yacurqjgara.cloudfront.net/users/317408/avatars/mini/Layout_Behance_Avatar_(1).jpg?1376382552'
      }];
      for (var i = 0; i < 20; i++) {
        ctrl.itemsArray.push({name: Math.random()});
      }
    }, 500);


  });
  </file>
</example>
*/
let ringTableModule = angular.module('Ring.table', ['Ring.table.toolbar', 'Ring.react-ng', 'Ring.place-under']);

ringTableModule.directive('rgTable', function () {
  return {
    restrict: 'E',
    transclude: true,
    template: require('./table-ng.html'),
    controllerAs: 'ctrl',
    /**
     *{{
     *   items: array, items of table
     *   selection: {TableSelection}?, a selection object link can be provided to use it outside the table
     * }}
     */
    scope: {
      items: '=',
      selection: '=?',
      disableSelection: '@'
    },
    bindToController: true,
    controller: function ($scope) {
      if (this.disableSelection) {
        return;
      }

      /**
       * Create Selection instance first to make sure it is always awailable
       * @type {TableSelection}
       */
      this.selection = new TableSelection(this.items, (name, item, index) => {
        $scope.$emit(name, item, index);
        $scope.$broadcast(name, item, index);
      });

      /**
       * Updating items when data is initiated or updated
       */
      $scope.$watch(() => {
        return this.items;
      }, newItems => {
        if (newItems){
          this.selection.setItems(newItems);
        }
      });
    }
  };
});

ringTableModule.directive('rgTableHeader', function (getClosestElementWithCommonParent) {
  const HEADER_RESIZE_DEBOUNCE = 50;
  const HEADER_SCROLL_DEBOUNCE = 10;
  const TOOLBAR_FIXED_CLASSNAME = 'ring-table__toolbar-controls_fixed';

  return {
    restrict: 'E',
    template: require('./table-ng__header.html'),
    transclude: true,
    replace: true,
    link: function (scope, iElement, iAttrs) {
      let element = iElement[0];
      let stickToElement = null;

      scope.stickToSelector = iAttrs.stickTo;

      //Shortcut for placing under table toolbar
      if (iAttrs.stickToToolbar !== undefined) {
        scope.stickToSelector = '.ring-table__toolbar';
      }

      let scrollableHeader = element.query('.ring-table__header:not(.ring-table__header_sticky)');
      let fixedHeader = element.query('.ring-table__header_sticky');

      let toolbarFixed = () => {
        return stickToElement.query('.' + TOOLBAR_FIXED_CLASSNAME) !== null;
      };

      /**
       * Sync header columns width with real table
       */
      let resizeFixedHeader = debounce(() => {
        fixedHeader.style.width = scrollableHeader.offsetWidth + 'px';
        let titles = fixedHeader.queryAll('.ring-table__title');

        Array.prototype.forEach.call(titles, (titleElement, index) => {
          let targetHeaderTitle = scrollableHeader.queryAll('.ring-table__title')[index];
          titleElement.style.width = getStyles(targetHeaderTitle).width;
        });

      }, HEADER_RESIZE_DEBOUNCE, true);

      /**
       * Toggle headers on scroll. Also resize header columns with some big interval
       */
      let scrollListener = debounce(() => {
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
        });
      }

      if (scope.stickToSelector) {
        stickToElement = getClosestElementWithCommonParent(element, scope.stickToSelector);
        startSticking();
      }
    }
  };
});

ringTableModule.directive('rgTableBody', function () {
  return {
    restrict: 'E',
    template: '<tbody ng-transclude></tbody>',
    transclude: true,
    replace: true
  };
});

ringTableModule.directive('rgTableRow', function () {
  return {
    template: require('./table-ng__row.html'),
    restrict: 'E',
    transclude: true,
    replace: true,
    require: ['^rgTable', 'rgTableRow'],
    scope: {
      rowItem: '='
    },
    link: function (scope, iElement, iAttrs, ctrls) {
      let rgTableCtrl = ctrls[0];
      let rgTableRowCtrl = ctrls[1];
      rgTableRowCtrl.setSelection(rgTableCtrl.selection);
    },
    controllerAs: 'rowCtrl',
    bindToController: true,
    controller: function ($scope, $element) {
      let element = $element[0];

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
        item && this.selection && this.selection.activateItem(item);
      };

      this.hasCheckedItems = () => {
        if (this.selection) {
          return false;
        }
        //TODO: cache this operation if perfomance issue exists
        let checkedItems = this.selection.getCheckedItems();
        return checkedItems && checkedItems.length > 0;
      };

      function getRowOutOfViewInfo(el, offsetInRows) {
        let rect = getRect(el);
        let offset = rect.height * offsetInRows;
        let windowHeight = window.innerHeight || document.documentElement.clientHeight;

        let isGoneUp = rect.top < offset;
        let isGoneDown = rect.bottom > (windowHeight - offset);

        return {
          offset: offset,
          isOutOfView: isGoneDown || isGoneUp,
          isGoneUp: isGoneUp,
          isGoneDown: isGoneDown
        };
      }

      function addSpacingAfterScroll(offset) {
        if (window.scrollY) {
          window.scrollBy(0, offset);
        }
      }

      $scope.$on('rgTable:activateItem', (e, item) => {
        if (item === this.rowItem) {
          let scrollInfo = getRowOutOfViewInfo(element, 2);
          if (scrollInfo.isOutOfView) {
            element.scrollIntoView(scrollInfo.isGoneUp);
            addSpacingAfterScroll(scrollInfo.isGoneDown ? scrollInfo.offset : -scrollInfo.offset);
          }
        }
      });
    }
  };
});

ringTableModule.directive('rgTableHeaderCheckbox', function () {
  return {
    restrict: 'E',
    require: '^rgTable',
    replace: true,
    template: '<div react="Checkbox" on-change="onClickChange" class="ring-table__header-checkbox" ng-model="allChecked"/>',
    link: function (scope, iElement, iAttrs, tableCtrl) {
      // todo: reduce number of recheckSelection() calls
      scope.allChecked = false;

      function recheckSelection() {
        if (tableCtrl.items && tableCtrl.items.length) {
          scope.allChecked = tableCtrl.items.every(function (item) {
            return item.checked;
          });
        } else {
          scope.allChecked = false;
        }
      }

      function markAllItemsAs(state) {
        tableCtrl.items.forEach(function (item) {
          item.checked = state;
        });
      }

      scope.$on('rgTable:itemsChanged', function() {
        if (scope.allChecked) {
          markAllItemsAs(true);
        }
        recheckSelection();
      });
      scope.$on('rgTable:selectionChanged', recheckSelection);

      scope.onClickChange = function(newValue) {
        scope.$evalAsync(function() {
          markAllItemsAs(newValue);
        });
      };
    }
  };
});

/**
 * A checkbox cell for table. Uses rg-table-row parent directive as model hoster
 */
ringTableModule.directive('rgTableCheckboxCell', function () {
  return {
    restrict: 'E',
    transclude: true,
    require: '^rgTableRow',
    replace: true,
    template: '<td class="ring-table__selector ring-table__column_selector" ng-class="{\'ring-table__column\': !isEmbedded}"><div react="Checkbox" ng-model="getRowItem().checked"/></td>',
    link: function (scope, iElement, iAttrs, rowCtrl) {
      /**
       * rowItem getter to use it as ng-model for checkbox
       */
      scope.getRowItem = () => {
        return rowCtrl.rowItem;
      };
      scope.isEmbedded = angular.isDefined(iAttrs.embedded);
    }
  };
});

/**
 * Table title wrapper, receive next attributes:
 * {{
    noBorder: whether or not title contain right border
    active: makes title more bolder
  }}
 */
ringTableModule.directive('rgTableTitle', function () {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: true,
    template: require('./table-ng__title.html'),
    link: function (scope, iElement, iAttrs) {
      /**
       * One time property assigning without watching through isolated scope helps to improve perfomanse
       */
      scope.isNoBorder = angular.isDefined(iAttrs.noBorder);
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
ringTableModule.directive('rgTableColumn', function () {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    scope: true,
    template: require('./table-ng__column.html'),
    link: function (scope, iElement, iAttrs) {
      let element = iElement[0];

      scope.isLimited = angular.isDefined(iAttrs.limited);
      scope.isUnlimited = angular.isDefined(iAttrs.unlimited);
      scope.isAvatar = angular.isDefined(iAttrs.avatar);
      scope.isWide = angular.isDefined(iAttrs.wide);
      scope.isAlignRight = angular.isDefined(iAttrs.alignRight);
      scope.isGray = angular.isDefined(iAttrs.gray);
      scope.isPullRight = angular.isDefined(iAttrs.pullRight);
      scope.isPullLeft = angular.isDefined(iAttrs.pullLeft);

      function adjustUnlimitedColumnWidths() {
        let unlimitedColumnsCount = element.parentNode.queryAll('.ring-table__column[unlimited]').length;
        if (unlimitedColumnsCount > 1) {
          element.style.width = (100 / unlimitedColumnsCount).toFixed() + '%';
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
ringTableModule.constant('SelectionNavigateActions', require('./table-ng__selection-navigate-actions'));
