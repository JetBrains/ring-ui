require('../table/table.scss');
var TableSelection = require('./table-ng__selection');
require('./table-ng__toolbar');
require('../place-under-ng/place-under-ng');
var debounce = require('mout/function/debounce');

require('../react-ng/react-ng')({
  Checkbox: require('../checkbox/checkbox.jsx')
});

require('message-bundle-ng/message-bundle-ng');

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
    require('sidebar-ng/sidebar-ng');

    angular.module('test', ['Ring.table', 'Ring.sidebar']).controller('tableExample', function ($timeout, $scope) {
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
angular.module('Ring.table', ['Ring.table.toolbar', 'Ring.react-ng', 'Ring.place-under'])
  .directive('rgTable', function () {
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
        var self = this;

        if (self.disableSelection) {
          return;
        }
        /**
         * Create Selection instance first to make sure it is always awailable
         * @type {TableSelection}
         */
        self.selection = new TableSelection(self.items, function emitEvent(name, item, index){
          $scope.$emit(name, item, index);
          $scope.$broadcast(name, item, index);
        });

        /**
         * Updating items when data is initiated or updated
         */
        var watchListener = function (result) {
          if (result){
            self.selection.setItems(self.items);
          }
        };

        $scope.$watch(function () {
          return self.items;
        }, watchListener);

        $scope.$watch(function () {
          return self.items && self.items.length;
        }, watchListener);

      }
    };
  })
  .directive('rgTableHeader', function ($window, getClosestElementWithCommonParent) {
    var HEADER_RESIZE_DEBOUNCE = 50;
    var HEADER_SCROLL_DEBOUNCE = 10;
    var TOOLBAR_FIXED_CLASSNAME = 'ring-table__toolbar-controls_fixed';

    return {
      restrict: 'E',
      template: require('./table-ng__header.html'),
      transclude: true,
      replace: true,
      link: function (scope, iElement, iAttrs) {
        var element = iElement[0];
        var stickToElement = null;

        scope.stickToSelector = iAttrs.stickTo;

        //Shortcut for placing under table toolbar
        if (iAttrs.stickToToolbar !== undefined) {
          scope.stickToSelector = '.ring-table__toolbar';
        }

        var scrollableHeader = element.querySelector('.ring-table__header:not(.ring-table__header_sticky)');
        var fixedHeader = element.querySelector('.ring-table__header_sticky');

        var toolbarFixed = function () {
          return stickToElement.querySelector('.' + TOOLBAR_FIXED_CLASSNAME) !== null;
        };

        /**
         * Sync header columns width with real table
         */
        var resizeFixedHeader = debounce(function() {
          fixedHeader.style.width = scrollableHeader.offsetWidth + 'px';
          var titles = fixedHeader.querySelectorAll('.ring-table__title');

          Array.prototype.forEach.call(titles, function(titleElement, index){
            var targetHeaderTitle = scrollableHeader.querySelectorAll('.ring-table__title')[index];
            titleElement.style.width = $window.getComputedStyle(targetHeaderTitle).width;
          });

        }, HEADER_RESIZE_DEBOUNCE, true);

        /**
         * Toggle headers on scroll. Also resize header columns with some big interval
         */
        var scrollListener = debounce(function() {
          if (toolbarFixed()) {
            fixedHeader.style.display = 'block';
            scrollableHeader.style.visibility = 'hidden';
          } else {
            fixedHeader.style.display = 'none';
            scrollableHeader.style.visibility = 'visible';
          }

          resizeFixedHeader();
        }, HEADER_SCROLL_DEBOUNCE);

        var startSticking = function () {
          scope.$evalAsync(function () {
            $window.addEventListener('resize', resizeFixedHeader);
            $window.addEventListener('scroll', scrollListener);
          });
        };

        if (scope.stickToSelector) {
          stickToElement = getClosestElementWithCommonParent(element, scope.stickToSelector);
          startSticking();
        }
      }
    };
  })
  .directive('rgTableBody', function () {
    return {
      restrict: 'E',
      template: '<tbody ng-transclude></tbody>',
      transclude: true,
      replace: true
    };
  })
  .directive('rgTableRow', function () {
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
        var rgTableCtrl = ctrls[0];
        var rgTableRowCtrl = ctrls[1];
        rgTableRowCtrl.setSelection(rgTableCtrl.selection);
      },
      controllerAs: 'rowCtrl',
      bindToController: true,
      controller: function ($window, $scope, $element) {
        var element = $element[0];
        var self = this;

        var watchRowCheckFlag;
        self.setSelection = function (selection) {
          if (!selection) {
            return;
          }
          self.selection = selection;
          if (!watchRowCheckFlag) {
            watchRowCheckFlag = $scope.$watch('rowCtrl.rowItem.checked', function (newValue) {
              if (newValue !== undefined) {
                self.selection.triggerSelectionChanged(self.rowItem);
              }
            });
          }
        };

        self.setActiveItem = function (item) {
          item && self.selection && self.selection.activateItem(item);
        };

        self.hasCheckedItems = function () {
          if (self.selection) {
            return false;
          }
          //TODO: cache this operation if perfomance issue exists
          var checkedItems = self.selection.getCheckedItems();
          return checkedItems && checkedItems.length > 0;
        };

        function getRowOutOfViewInfo(el, offsetInRows) {
          var rect = el.getBoundingClientRect();
          var offset = rect.height * offsetInRows;
          var windowHeight = window.innerHeight || document.documentElement.clientHeight;

          var isGoneUp = rect.top < offset;
          var isGoneDown = rect.bottom > (windowHeight - offset);

          return {
            offset: offset,
            isOutOfView: isGoneDown || isGoneUp,
            isGoneUp: isGoneUp,
            isGoneDown: isGoneDown
          };
        }

        function addSpacingAfterScroll(offset) {
          if (window.scrollY) {
            $window.scrollBy(0, offset);
          }
        }

        $scope.$on('rgTable:activateItem', function (e, item) {
          if (item === self.rowItem) {
            var scrollInfo = getRowOutOfViewInfo(element, 2);
            if (scrollInfo.isOutOfView) {
              element.scrollIntoView(scrollInfo.isGoneUp);
              addSpacingAfterScroll(scrollInfo.isGoneDown ? scrollInfo.offset : -scrollInfo.offset);
            }
          }
        });
      }
    };
  })
  .directive('rgTableHeaderCheckbox', function () {
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
  })
  /**
   * A checkbox cell for table. Uses rg-table-row parent directive as model hoster
   */
  .directive('rgTableCheckboxCell', function () {
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
        scope.getRowItem = function () {
          return rowCtrl.rowItem;
        };
        scope.isEmbedded = angular.isDefined(iAttrs.embedded);
      }
    };
  })
/**
 * Table title wrapper, receive next attributes:
 * {{
    noBorder: whether or not title contain right border
    active: makes title more bolder
  }}
 */
  .directive('rgTableTitle', function () {
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
  })
/**
 * Column wrapper, receive next attributes:
 * {{
    limited: is column width should be limited,
    wide: for wide columns
    avatar: for columns contains avatar
  }}
 */
  .directive('rgTableColumn', function () {
    return {
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: true,
      template: require('./table-ng__column.html'),
      link: function (scope, iElement, iAttrs) {
        var element = iElement[0];

        scope.isLimited = angular.isDefined(iAttrs.limited);
        scope.isUnlimited = angular.isDefined(iAttrs.unlimited);
        scope.isAvatar = angular.isDefined(iAttrs.avatar);
        scope.isWide = angular.isDefined(iAttrs.wide);
        scope.isAlignRight = angular.isDefined(iAttrs.alignRight);
        scope.isGray = angular.isDefined(iAttrs.gray);
        scope.isPullRight = angular.isDefined(iAttrs.pullRight);
        scope.isPullLeft = angular.isDefined(iAttrs.pullLeft);

        var adjustUnlimitedColumnWidths = function () {
          var unlimitedColumnsCount = element.parentNode.querySelectorAll('.ring-table__column[unlimited]').length;
          if (unlimitedColumnsCount > 1) {
            element.style.width = (100 / unlimitedColumnsCount).toFixed() + '%';
          }
        };

        if (scope.isUnlimited) {
          adjustUnlimitedColumnWidths();
        }
      }
    };
  })
/**
 * Pagination
 */
  .directive('rgTablePager', ['$location', 'RingMessageBundle', function($location, RingMessageBundle) {
    return {
      restrict: 'E',
      template: require('./table-ng__pager.html'),
      scope: {
        skip: '=',
        top: '=',
        total: '=',
        onPageChange: '&'
      },
      replace: true,
      link: function(scope, element, attrs) {
        scope.maxPages = attrs.maxPages || 7;
        scope.selectedPageNum = 1;

        if (scope.maxPages % 2 === 0) {
          scope.maxPages++;
        }

        scope.nextPageText = RingMessageBundle.next_page();
        scope.previousPageText = RingMessageBundle.previous_page();
        scope.firstPageText = RingMessageBundle.first_page();
        scope.lastPageText = RingMessageBundle.last_page();

        var openPageAfterInit = $location.search()['page'];

        scope.calculatePageClass = function(pageNum) {
          var condition = pageNum === scope.selectedPageNum;
          return {
            'ring-btn_light-blue': condition,
            'ring-btn_active': condition,
            'ring-btn_upper': condition
          };
        };

        scope.getTopOptionLabel = function(itemsPerPage) {
          return itemsPerPage + ' ' + RingMessageBundle.items_per_page();
        };

        scope.$watchGroup(['skip', 'total', 'top'], function() {
          scope.show = false;
          var top = $location.search()['top'] || scope.top;
          var total = scope.total;
          var skip = scope.skip;

          scope.top = top;
          scope.topOptions = [20, 50, 100];

          if (total !== undefined && skip !== undefined && top !== undefined) {
            if (total > 0 && total > top) {
              scope.totalPages = parseInt(total / top, 10);
              scope.show = true;
              scope.itemsPerPage = top;

              scope.startPage = 1;

              if (scope.maxPages < scope.totalPages) {
                scope.endPage = scope.maxPages;
                scope.sideBySidePages = (scope.maxPages - 1) / 2;
                var freeSpaceLeft = (scope.selectedPageNum - 1) - scope.sideBySidePages;
                var freeSpaceRight = scope.totalPages - (scope.selectedPageNum + scope.sideBySidePages);

                if (freeSpaceLeft > 0) {
                  scope.startPage = freeSpaceLeft + 1 + (freeSpaceRight < 0 ? freeSpaceRight : 0);
                  scope.endPage = scope.startPage + scope.maxPages - 1;
                } else {
                  scope.endPage = scope.selectedPageNum + scope.sideBySidePages + (freeSpaceLeft < 0 ? freeSpaceLeft * -1 : 0);
                }
              } else {
                scope.endPage = scope.totalPages;
              }

              scope.pages = [];
              for (var i = scope.startPage; i <= scope.endPage; i++) {
                scope.pages.push(i);
              }

              scope.loadPage = function(pageNum, firstLoad) {
                pageNum = parseInt(pageNum, 10);
                if (pageNum < 1) {
                  pageNum = 1;
                } else if (pageNum > scope.totalPages) {
                  pageNum = scope.totalPages;
                }

                scope.selectedPageNum = pageNum;

                scope.onPageChange({
                  pageNum: scope.selectedPageNum,
                  itemsPerPage: scope.top,
                  firstLoad: firstLoad
                });

                $location.search('page', pageNum);
              };

              scope.topChange = function(newItemsPerPage) {
                scope.top = newItemsPerPage;
                $location.search('top', newItemsPerPage);
                scope.loadPage(1);
              };

              if (openPageAfterInit) {
                scope.selectedPageNum = +openPageAfterInit;
                scope.loadPage(openPageAfterInit, true);
                openPageAfterInit = null;
              }
            }
          }
        });
      }
    };
  }])
/**
 * Class with default hotkeys navigation actions (e.g. select, clear selection, move up/down)
 */
  .constant('SelectionNavigateActions', require('./table-ng__selection-navigate-actions'));
