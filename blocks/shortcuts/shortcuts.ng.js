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
          'bind': function(name, handlers) {
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

            shortcuts('bindList', {scope: name}, keys);
          },
          'ring': shortcuts,
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

          ctrl.select = function(next) {
            if ($scope.current) {
              shortcuts.ring('popScope', $scope.current.name);
            }

            if (!next) {
              $scope.current = null;
              return;
            }

            shortcuts.ring('pushScope', next.name);

            $scope.current = next;
          };

          ctrl.route = function(action, e, combo, mode) {
            var next;

            // There is nowhere to navigate
            if (!$scope.zones.length) {
              return false;
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

              if (shortcuts.ring('hasKey', combo, next.name)) {
                shortcuts.ring('trigger', combo);
              }
            // Otherwise go back
            } else {
              shortcuts.triggerAction(mode, action === 'next' ? 'prev' : 'next');
            }

            return false;
          };

          ctrl.setup = function(zone, keys) {
            shortcuts.bind(zone.name, keys);
            $scope.zones.push(zone);
          };

          ctrl.destroy = function(zone) {
            shortcuts.ring('popScope', zone.name);
            shortcuts.ring('unbindList', zone.name);

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
          shortcuts.ring('pushScope', 'ring-shortcuts');
        }]
      };
    }])
    .directive('shortcuts', [function () {
      return {
        restrict: 'A',
        scope: {
          'id': '@shortcuts',
          'map': '=shortcutsMap',
          'focus': '=?shortcutsFocus'
        },
        require: ['^shortcutsApp'],
        link: function($scope, iElement, iAttrs, shortcutsCtrl) {
          // Closest controller
          var ctrl = shortcutsCtrl[shortcutsCtrl.length - 1];
          var zone = {
            name: $scope.id,
            element: iElement
          };

          ctrl.setup(zone, $scope.map);

          $scope.$watch('focus', function(current, prev) {
            if (angular.isDefined(current) && angular.isUndefined(prev)) {
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