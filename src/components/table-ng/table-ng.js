require('ng-infinite-scroll/build/ng-infinite-scroll');
require('../table/table.scss');
require('../sidebar/sidebar.scss');
require('../shortcuts-ng/shortcuts-ng');
require('../permissions-ng/permissions-ng');
var $ = require('jquery');
var debounce = require('mout/function/debounce');

/*global angular*/
angular.module('Ring.table', ['infinite-scroll', 'Ring.shortcuts', 'Ring.permissions'])
  //TODO: use ng-template loader
  .run(['$templateCache', function ($templateCache) {
    $templateCache.put('table-ng__sidebar-button.html', require('./table-ng__sidebar-button.html'));
    $templateCache.put('table-ng__toolbar.html', require('./table-ng__toolbar.html'));
  }])
  .directive('rgTable', ['$location', '$window', 'i18nPlural', 'storage', function ($location, $window, i18nPlural, storage) {
    return {
      template: require('./table-ng.html'),
      replace: true,
      transclude: true,
      restrict: 'E',
      scope: {
        sidebarEmpty: '@',
        sidebarEntity: '@',
        sidebarSrc: '&',
        toolbarSrc: '&',
        emptySrc: '&',
        source: '=',  //An source function, should return promise
        items: '=?',  //optional link to items array
        data: '=',
        itemHref: '@',
        titleFormat: '@'
      },
      controller: ['$scope', function ($scope) {
        var ctrl = this;
        $scope.title = $scope.titleFormat ? function (count) {
          return i18nPlural.format($scope.$eval($scope.titleFormat), count);
        } : null;

        /****************************************************************
         * Active item
         ****************************************************************/
        ctrl.getActiveItem = function () {
          if ($scope.data.items && 0 <= $scope.activeItemIndex && $scope.activeItemIndex < $scope.data.items.length) {
            return $scope.data.items[$scope.activeItemIndex];
          } else {
            return null;
          }
        };

        ctrl.getActiveItemIndex = function () {
          return $scope.activeItemIndex;
        };

        $scope.setActiveItemIndex = ctrl.setActiveItemIndex = function (index) {
          if ($scope.activeItemIndex === index) {
            return;
          }

          var activeItem = ctrl.getActiveItem();
          if (activeItem) {
            activeItem.active = false;
          }

          if (index !== undefined) {
            $scope.activeItemIndex = Number(index);

            activeItem = ctrl.getActiveItem();
            if (activeItem) {
              activeItem.active = true;
            }
          } else {
            $scope.activeItemIndex = undefined;
          }
          ctrl.fireSelectionChanged();
        };

        /****************************************************************
         * Checked items
         ****************************************************************/
        var CheckedItems = function () {
          this.items = {};
          this.size = 0;
        };
        $.extend(CheckedItems.prototype, {
          setItem: function (index, item, value) {
            if (value && !this.items[index]) {
              this.size++;
              this.items[index] = item;
              ctrl.fireSelectionChanged();
            } else if (!value && this.items[index]) {
              this.size--;
              delete this.items[index];
              ctrl.fireSelectionChanged();
            }
          },
          clear: function () {
            if (this.size === 0) {
              return;
            }
            this.each(function (index, item) {
              if (item && item.checked) {
                item.checked = false;
              }
            });
            this.items = {};
            this.size = 0;
            ctrl.fireSelectionChanged();
          },
          isEmpty: function () {
            return this.size === 0;
          },
          each: function (fn) {
            $.each(this.items, fn);
          },
          some: function (fn) {
            return this.getAll().some(fn);
          },
          getAll: function () {
            var allItems = [];
            this.each(function (index, item) {
              allItems.push(item);
            });
            return allItems;
          },
          first: function () {
            for (var index in this.items) {
              if (this.items.hasOwnProperty(index)) {
                return this.items[index];
              }
            }
          }
        });
        ctrl.checkedItems = new CheckedItems();

        /****************************************************************
         * Selected items
         ****************************************************************/
        ctrl.getSelection = function () {
          var activeItem = ctrl.getActiveItem();
          var selectionModel = !ctrl.checkedItems.isEmpty() ? ctrl.checkedItems : {
            size: activeItem ? 1 : 0,
            first: function () {
              return activeItem;
            },
            each: function (fn) {
              if (activeItem) {
                fn(0, activeItem);
              }
            },
            some: function (fn) {
              if (activeItem) {
                return fn(activeItem, 0, [activeItem]);
              } else {
                return false;
              }
            },
            getAll: function () {
              return activeItem ? [activeItem] : [];
            }
          };
          return selectionModel;
        };

        ctrl.fireSelectionChanged = function () {
          $scope.$emit('selection:changed', ctrl.getSelection());
        };

        ctrl.openItemPage = function (item, replace) {
          var href = $scope.itemHref.replace(':id', item.id);
          $location.url(href);
          if (replace) {
            $location.replace();
          }
        };

        /****************************************************************
         * Sidebar
         ****************************************************************/
        var SIDEBAR_STORAGE_KEY = 'sidebar';
        $scope.sidebar = {
          active: true
        };

        // Read sidebar settings
        storage.get(SIDEBAR_STORAGE_KEY).done(function (sidebar) {
          $scope.sidebar = sidebar || $scope.sidebar;
        });

        $scope.toggleSidebar = ctrl.toggleSidebar = function (enable) {
          if ($scope.sidebar.active === enable) {
            return;
          }

          if (!angular.isDefined(enable)) {
            enable = !$scope.sidebar.active;
          }

          $scope.sidebar.active = enable;

          // Show current item in sidebar
          var activeItem = ctrl.getActiveItem();
          if (activeItem && enable) {
            $scope.sidebarElement = activeItem;
          }

          // Save sidebar settings
          storage.set(SIDEBAR_STORAGE_KEY, $scope.sidebar);

          sidebarScrollListener();
        };

        $scope.$watch('activeItemIndex', function (value) {
          if (value !== null) {
            $scope.sidebarElement = ctrl.getActiveItem();
          }
        });

        $scope.toolbar = {
          // Should not be false to be changed after permission check
          visible: null,
          fixed: null
        };

        /****************************************************************
         * Stick sidebar and toolbar
         ****************************************************************/
        // Following zones are expected to be registered
        var zones = {
          sidebar: null,
          table: null,
          toolbar: null,
          toolbarPlaceholder: null
        };
        ctrl.registerZone = function (name, element) {
          zones[name] = element;
          sidebarScrollListener();
        };

        $window = $($window);

        var sidebarScrollListener = debounce(function sidebarScrollListenerHandler() {
          if (!zones.table || !zones.sidebar || !zones.toolbar || !zones.toolbarPlaceholder || !zones.table.is(':visible')) {
            return;
          }

          var tableTopOffset = zones.table.offset().top - Math.max($window.scrollTop(), 0);
          var toolbarHeight = $scope.toolbar.visible ? zones.toolbar.outerHeight() : 0;

          var fixToolbar = tableTopOffset < toolbarHeight;

          // We're adding class manually to be able use debounce
          if ($scope.sidebar.active) {
            zones.sidebar.
              css('margin-top', fixToolbar ? toolbarHeight : tableTopOffset + 1).
              addClass('sidebar-active');
          } else {
            zones.sidebar.removeClass('sidebar-active');
          }

          if ($scope.toolbar.visible && fixToolbar !== $scope.toolbar.fixed) {
            zones.toolbarPlaceholder.css('height', fixToolbar ? toolbarHeight : 0);
            $scope.toolbar.fixed = fixToolbar;

            if (!$scope.$root.$$phase) {
              $scope.$apply();
            }
          }
        });
        $window.on('scroll', sidebarScrollListener);
        $scope.$on('$destroy', function () {
          $window.off('scroll', sidebarScrollListener);
          if (zones.toolbar) {
            zones.toolbar.removeClass('fixed');
          }
        });
        // Detect sidebar visibilty change
        $scope.$watch(function () {
          return zones.sidebar && zones.sidebar.is(':visible');
        }, sidebarScrollListener);

        $scope.$watch('toolbar.visible', sidebarScrollListener);

        /****************************************************************
         * Keyboard support
         ****************************************************************/
        ctrl.moveUp = function () {
          if ($scope.activeItemIndex == null) {
            ctrl.setActiveItemIndex($scope.data.total - 1);
          } else if ($scope.activeItemIndex > 0) {
            ctrl.setActiveItemIndex($scope.activeItemIndex - 1);
          } else {
            ctrl.setActiveItemIndex();

            return true;
          }

          return false;
        };
        ctrl.moveDown = function () {
          if ($scope.activeItemIndex == null) {
            ctrl.setActiveItemIndex(0);
          } else if ($scope.activeItemIndex < $scope.data.total - 1) {
            ctrl.setActiveItemIndex($scope.activeItemIndex + 1);
          } else {
            ctrl.setActiveItemIndex();

            return true;
          }

          return false;
        };

        ctrl.bulkCheckState = null;
        ctrl.resetBulkCheckState = function () {
          ctrl.bulkCheckState = null;
        };
        ctrl.bulkCheck = function () {
          var activeItem = ctrl.getActiveItem();
          if (activeItem) {
            if (ctrl.bulkCheckState == null) {
              ctrl.bulkCheckState = !activeItem.checked;
            }
            activeItem.checked = ctrl.bulkCheckState;
          }
        };
        ctrl.toggleActiveItem = function () {
          var activeItem = ctrl.getActiveItem();

          if (activeItem && $scope.data.toggle) {
            $scope.data.toggle(activeItem);
          }
        };

        $scope.keys = {
          'moveUp': ctrl.moveUp,
          'moveDown': ctrl.moveDown,
          'reset': function () {
            ctrl.resetBulkCheckState();
          },
          'selectUp': function () {
            ctrl.bulkCheck();
            return ctrl.moveUp();
          },
          'selectDown': function () {
            ctrl.bulkCheck();
            return ctrl.moveDown();
          },
          'selectCurrent': function () {
            var activeItem = ctrl.getActiveItem();
            if (!activeItem) {
              return true;
            } else {
              activeItem.checked = !activeItem.checked;
              return false;
            }
          },
          'toggle': ctrl.toggleActiveItem,
          'go': function () {
            var activeItem = ctrl.getActiveItem();
            if (!activeItem || !$scope.itemHref) {
              return true;
            } else {
              ctrl.openItemPage(activeItem, false);
              return false;
            }
          },
          'showSidebar': function () {
            ctrl.toggleSidebar(true);
          },
          'hideSidebar': function () {
            ctrl.toggleSidebar(false);
          },
          'clearSelection': function () {
            var activeItem = ctrl.getActiveItem();

            if (activeItem && !ctrl.checkedItems.isEmpty()) {
              ctrl.checkedItems.clear();
              return false;
            }

            if (!activeItem) {
              ctrl.setActiveItemIndex(0);
              return false;
            } else {
              ctrl.setActiveItemIndex();
              return true;
            }
          },
          'delete': function () {
            if (ctrl.deleteItem) {
              ctrl.deleteItem();
              return false;
            } else {
              return true;
            }
          }
        };
      }],
      require: ['rgTable', '^hubResource'],
      link: function (scope, iElement, iAttrs, requiredCtrls) {
        if ('ignoreEmpty' in iAttrs) {
          scope.ignoreEmpty = true;
        }

        var rgTableCtrl = requiredCtrls[0];
        var hubResourceCtrl = requiredCtrls[1];

        /****************************************************************
         * Install openItemPage to rg-resource
         ****************************************************************/
        hubResourceCtrl.openItemPage = rgTableCtrl.openItemPage;

        /****************************************************************
         * Install getSelection to rg-resource
         ****************************************************************/
        hubResourceCtrl.getSelection = rgTableCtrl.getSelection;
        hubResourceCtrl.getActiveItemIndex = rgTableCtrl.getActiveItemIndex;
        hubResourceCtrl.setActiveItemIndex = rgTableCtrl.setActiveItemIndex;

        /****************************************************************
         * Install refresh to rg-resource
         ****************************************************************/
        hubResourceCtrl.refresh = function () {
          rgTableCtrl.setActiveItemIndex();
          rgTableCtrl.checkedItems.clear();
          if (hubResourceCtrl.search) {
            hubResourceCtrl.search();
          }
        };

        hubResourceCtrl.refreshSelection = rgTableCtrl.fireSelectionChanged;
      }
    };
  }])
  .directive('rgTableRow', [function () {
    return {
      require: '^rgTable',
      template: require('./table-ng__row.html'),
      restrict: 'E',
      transclude: true,
      replace: true,
      scope: {
        itemIndex: '@itemIndex',
        item: '=item'
      },
      link: function (scope, iElement, iAttrs, rgTable) {
        scope.setActiveItemIndex = rgTable.setActiveItemIndex;
        scope.checkedItems = rgTable.checkedItems;

        scope.$watch('item.active', function (value) {
          // Scroll to make active item visible
          if (value) {
            var windowTop = $(window).scrollTop();
            var windowBottom = windowTop + $(window).height();
            var elementTop = iElement.offset().top;
            var elementBottom = elementTop + iElement.height();
            var loadingOffset = 4;
            // TODO: calculate height of toolbar without magic numbers
            var toolbarHeight = 57;

            if (elementBottom > windowBottom) {
              $(window).scrollTop(windowTop + (elementBottom - windowBottom) + loadingOffset);
            } else if (elementTop - toolbarHeight < windowTop) {
              $(window).scrollTop(elementTop - toolbarHeight);
            }
          }
        });
      }
    };
  }])
  .directive('rgTableCell', [function () {
    return {
      require: '^rgTableRow',
      template: '<td ng-transclude></td>',
      restrict: 'E',
      transclude: true,
      replace: true
    };
  }])
  .directive('rgTitleRow', [function () {
    return {
      require: '^rgTable',
      template: '<tr ng-transclude></tr>',
      restrict: 'E',
      transclude: true,
      replace: true
    };
  }])
  .directive('rgTableExpandSidebarCell', [function () {
    return {
      template: require('./table-ng__expand-sidebar-cell.html'),
      replace: true,
      restrict: 'E',
      scope: {
        index: '@index'
      },
      require: '^rgTable',
      link: function (scope, iElement, iAttrs, rgTableCtrl) {
        scope.expandSidebar = function () {
          rgTableCtrl.setActiveItemIndex(scope.index);
          rgTableCtrl.toggleSidebar(true);
        };
      }
    };
  }])
  .directive('rgTableCheckboxCell', [function () {
    return {
      template: require('./table-ng__checkbox-cell.html'),
      replace: true,
      restrict: 'E',
      scope: {
        index: '@',
        item: '=',
        idSuffix: '@'
      },
      require: '^rgTable',
      link: function (scope, iElement, iAttrs, rgTableCtrl) {
        scope.embedded = 'embedded' in iAttrs;

        scope.$watch('item.checked', function (value) {
          rgTableCtrl.checkedItems.setItem(scope.index, scope.item, value);
        });
      }
    };
  }]).
  directive('rgTableZone', [function () {
    return {
      require: '^rgTable',
      link: function (scope, element, attrs, rgTableCtrl) {
        rgTableCtrl.registerZone(attrs.rgTableZone, element);
      }
    };
  }])
/**
 * @ngdoc directive
 * @name rgTableDeleteItem
 *
 */
  .directive('rgTableDeleteItem', [
    'hubResourceDelete',
    'userPermissions',
    function (hubResourceDelete, userPermissions) {
      return {
        require: ['rgTable', '^hubResource'],
        link: function (scope, element, attrs, ctrls) {
          var rgTableCtrl = ctrls[0];
          var hubResourceCtrl = ctrls[1];
          var getConfirmMessage = function () {
            return scope.$eval(attrs.rgTableDeleteItem);
          };

          userPermissions.check(attrs.deletePermission).
            then(function (canDelete) {
              if (canDelete) {
                rgTableCtrl.deleteItem = function () {
                  hubResourceDelete.trigger(hubResourceCtrl, getConfirmMessage());
                };
              }
            });
        }
      };
    }]);
