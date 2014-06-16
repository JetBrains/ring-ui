(function (angular) {
  'use strict';

  angular.module('Ring.shortcuts', [])
    .provider('shortcuts', [function () {
      var shortcuts = ring('shortcuts');
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
            var keys = {};

            // Nothing to bind
            if (typeof handlers !== 'object') {
              return;
            }

            // No declaration
            if (!mode) {
              throw new Error('Shortcut mode ' + name + ' is not declared');
            }

            $.each(mode, function(index, key) {
              var handler = handlers[key.action];

              if (angular.isFunction(handler)) {
                keys[key.key] = function() {
                  var ret = handler.apply(handlers, arguments);
                  if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                  }
                  return ret;
                };
              }
            });

            shortcuts('bindList', {scope: scope || name}, keys);
          },
          'getScope': ring('shortcuts', 'getScope'),
          'setScope': ring('shortcuts', 'setScope'),
          'popScope': ring('shortcuts', 'popScope'),
          'pushScope': ring('shortcuts', 'pushScope'),
          'spliceScope': ring('shortcuts', 'spliceScope'),
          'unbindList': ring('shortcuts', 'unbindList'),
          'trigger': ring('shortcuts', 'trigger'),
          'hasKey': ring('shortcuts', 'hasKey'),
          'getReference': function() {
            return angular.copy(reference);
          },
          'triggerAction': function(mode, action) {
            var actions = modes[mode];

            for (var i = actions.length - 1; i >= 0; i--) {
              if (actions[i].action === action) {
                return shortcuts('trigger', actions[i].key);
              }
            }
          },
          'isMainMode': function(name) {
            return mainModes[name];
          }
        };

      }];
    }])
    .directive('shortcutsApp', [function () {
      return {
        restrict: 'A',
        controller: ['$rootScope', '$scope', '$attrs', 'shortcuts', function ($scope, $rootScope, $attrs, shortcuts) {
          $scope.zones = [];
          $scope.loop = 'shortcutsLoop' in $attrs;
          var ctrl = this;

          var getNext = function(current, back) {
            var position = current && $.inArray(current, $scope.zones);
            var next;

            if (position >= 0) {
              next = back ? $scope.zones[position - 1] : $scope.zones[position + 1];
            }

            if (!next && ($scope.loop || !current)) {
              next = back ? $scope.zones[$scope.zones.length - 1] : $scope.zones[0];
            }

            // Skip invisible zones
            if (next && !next.element.is(':visible')) {
              next = getNext(next, back);
            }

            return next;
          };

          ctrl.deselect = function() {
            $scope.current.onBlur();
            $scope.current = null;
          };

          ctrl.select = function(next) {
            if ($scope.current === next) {
              return;
            }

            if ($scope.current) {
              shortcuts.spliceScope($scope.current.scope);
              ctrl.deselect();
            }

            if (!next) {
              return;
            }

            shortcuts.pushScope(next.scope);

            $scope.current = next;
          };

          ctrl.route = function(action, e, combo, mode) {
            var next;

            // There is nowhere to navigate
            if (!$scope.zones.length) {
              return false;
            }

            // Reset current zone if is not equal current scope
            if ($scope.current && $scope.current.scope !== shortcuts.getScope().pop()) {
              ctrl.deselect();
            }

            if (action === 'main') {
              $.each($scope.zones, function(index, zone) {
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
              ctrl.select(next);

              if (shortcuts.hasKey(combo, next.scope)) {
                shortcuts.trigger(combo);
              }
            // Otherwise go back
            } else {
              shortcuts.triggerAction(mode, action === 'next' ? 'prev' : 'next');
            }

            return false;
          };

          ctrl.sort = function() {
            var orderedElements = $('[shortcuts]');

            $.each($scope.zones, function(index, zone) {
              zone.order = $.inArray(zone.element[0], orderedElements);
            });

            $scope.zones.sort(function(a, b) {
              return a.order - b.order;
            });
          };

          ctrl.setup = function(zone, keys) {
            shortcuts.bind(zone.name, keys, zone.scope);
            $scope.zones.push(zone);
            ctrl.sort();
          };

          ctrl.destroy = function(zone) {
            shortcuts.spliceScope(zone.scope);
            shortcuts.unbindList(zone.scope);

            var position = $.inArray(zone, $scope.zones);

            if (position !== -1) {
              $scope.zones.splice(position, 1);
            }
          };

          // Initial setup
          var keyMap = {
            next: ctrl.route.bind(ctrl, 'next'),
            prev: ctrl.route.bind(ctrl, 'prev'),
            main: ctrl.route.bind(ctrl, 'main')
          };

          shortcuts.bind('ring-shortcuts', keyMap);
          shortcuts.pushScope('ring-shortcuts');
        }]
      };
    }])
    .directive('shortcuts', ['$timeout', function ($timeout) {
      return {
        restrict: 'A',
        scope: {
          'name': '@shortcuts',
          'map': '=shortcutsMap',
          'focus': '&shortcutsFocus',
          'onBlur': '&shortcutsOnBlur'
        },
        require: ['^shortcutsApp'],
        link: function($scope, iElement, iAttrs, shortcutsCtrl) {
          // Closest controller
          var ctrl = shortcutsCtrl[shortcutsCtrl.length - 1];
          var zone = {
            name: $scope.name,
            scope: $scope.name + '-' + $scope.$id,
            element: iElement,
            onBlur: $scope.onBlur
          };

          $timeout(function () {
            ctrl.setup(zone, $scope.map);
          }, 30);

          $scope.$watch('focus()', function(current) {
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

}(window.angular));