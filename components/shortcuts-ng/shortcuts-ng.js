require('babel/polyfill');
var shortcutsInstance = require('shortcuts/shortcuts');

  /* global angular: false */
angular.module('Ring.shortcuts', [])
  .provider('shortcuts', [function () {
    var modes = {};
    var mainModes = {};
    var reference = [];

    this.mode = function(config) {
      modes[config.id] = config.shortcuts;
      mainModes[config.id] = !!config.main;

      if (config.title) {
        reference.push(config);
      }
      return this;
    };

    this['$get'] = ['$rootScope', function($rootScope) {
      return {
        'bind': function(name, handlers, scope) {
          var mode = modes[name];

          // Nothing to bind
          if (typeof handlers !== 'object') {
            return;
          }

          // No declaration
          if (!mode) {
            throw new Error('Shortcut mode ' + name + ' is not declared');
          }

          mode.forEach(function(key) {
            var handler = handlers[key.action];

            if (!angular.isFunction(handler)) {
              return;
            }

            shortcutsInstance.bind({
              key: key.key,
              scope: scope || name,
              handler: function() {
                var ret = handler.apply(handlers, arguments);
                /*eslint-disable angular/ng_no_private_call*/
                if (!$rootScope.$$phase) {
                  $rootScope.$apply();
                }
                /*eslint-enable angular/ng_no_private_call */
                return ret;
              }
            });
          });
        },
        'triggerAction': function(mode, action) {
          var actions = modes[mode];

          for (var i = actions.length - 1; i >= 0; i--) {
            if (actions[i].action === action) {
              return shortcutsInstance.trigger(actions[i].key[0] || actions[i].key);
            }
          }
        },
        'isMainMode': function(name) {
          return mainModes[name];
        },
        shortcuts: shortcutsInstance
      };

    }];
  }])
  .directive('rgShortcutsApp', [function () {
    return {
      restrict: 'A',
      controller: ['$rootScope', '$scope', '$attrs', 'shortcuts', function ($scope, $rootScope, $attrs, shortcuts) {
        $scope.zones = [];
        $scope.loop = 'shortcutsLoop' in $attrs;
        var self = this;

        var getNext = function(current, back) {
          var position = current && $scope.zones.indexOf(current);
          var next;

          if (position >= 0) {
            next = back ? $scope.zones[position - 1] : $scope.zones[position + 1];
          }

          if (!next && ($scope.loop || !current)) {
            next = back ? $scope.zones[$scope.zones.length - 1] : $scope.zones[0];
          }

          if (!next) {
            next = $scope.zones[0];
          }

          // Skip invisible zones
          if (next && !next.element.is(':visible')) {
            next = getNext(next, back);
          }

          return next;
        };

        self.deselect = function() {
          $scope.current.onBlur();
          $scope.current = null;
        };

        self.select = function(next) {
          if ($scope.current === next) {
            return;
          }

          if ($scope.current) {
            shortcutsInstance.spliceScope($scope.current.scope);
            self.deselect();
          }

          if (!next) {
            return;
          }

          shortcutsInstance.pushScope(next.scope);

          $scope.current = next;
        };

        self.route = function(action, e, combo, mode) {
          var next;

          // There is nowhere to navigate
          if (!$scope.zones.length) {
            return false;
          }

          // Reset current zone if is not equal current scope
          if ($scope.current && $scope.current.scope !== shortcutsInstance.getScope().pop()) {
            self.deselect();
          }

          if (action === 'main') {
            $scope.zones.forEach(function(zone, index) {
              if (shortcuts.isMainMode(zone.name)) {
                next = $scope.zones[index];

                return false;
              }
            });
          } else {
            next = getNext($scope.current, action === 'prev');
          }

          // Select next zone and trigger same combo there
          if (next) {
            self.select(next);

            if (shortcutsInstance.hasKey(combo, next.scope)) {
              shortcutsInstance.trigger(combo);
            }
            // Otherwise go back
          } else {
            shortcuts.triggerAction(mode, action === 'next' ? 'prev' : 'next');
          }

          return false;
        };

        self.sort = function() {
          var orderedElements = document.querySelectorAll('[rg-shortcuts]');

          $scope.zones.forEach(function(zone) {
            zone.order = Array.from(orderedElements).indexOf(zone.element[0]);
          });

          $scope.zones.sort(function(a, b) {
            return a.order - b.order;
          });
        };

        self.setup = function(zone, keys) {
          shortcuts.bind(zone.name, keys, zone.scope);
          $scope.zones.push(zone);
          self.sort();
        };

        self.destroy = function(zone) {
          shortcutsInstance.spliceScope(zone.scope);
          shortcutsInstance.unbindScope(zone.scope);

          var position = $scope.zones.indexOf(zone);

          if (position !== -1) {
            $scope.zones.splice(position, 1);
          }
        };

        // Initial setup
        var keyMap = {
          next: self.route.bind(self, 'next'),
          prev: self.route.bind(self, 'prev'),
          main: self.route.bind(self, 'main')
        };

        shortcuts.bind('ring-shortcuts', keyMap);
        shortcutsInstance.pushScope('ring-shortcuts');
      }]
    };
  }])
  .directive('rgShortcuts', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      require: ['^rgShortcutsApp'],
      link: function($scope, iElement, iAttrs, shortcutsCtrl) {
        // Closest controller
        var ctrl = shortcutsCtrl[shortcutsCtrl.length - 1];

        var name = iAttrs.rgShortcuts;
        var map = $scope.$eval(iAttrs.shortcutsMap);
        var focusGetter = $parse(iAttrs.shortcutsFocus);
        var blurGetter = $parse(iAttrs.shortcutsBlur);

        var zone = {
          name: name,
          scope: name + '-' + $scope.$id,
          element: iElement,
          onBlur: blurGetter($scope) || angular.noop
        };

        $scope.$evalAsync(function () {
          ctrl.setup(zone, map);
        });

        $scope.$watch(function() {
          return focusGetter($scope);
        }, function(current) {
          if (current) {
            ctrl.select(zone);
          }
        });

        $scope.$on('$destroy', function() {
          ctrl.destroy(zone);
        });
      }
    };
  }]);
