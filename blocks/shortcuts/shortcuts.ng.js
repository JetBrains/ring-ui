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
                keys[key.key] = function(e, combo, scope) {
                  var ret = handler.call(handlers, e, combo, scope, name);
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
          'isMainMode': function(name) {
            return mainModes[name];
          }
        };

      }];
    }])
    .directive('shortcutsApp', [function () {
      return {
        restrict: 'A',
        controller: ['$rootScope', '$scope', 'shortcuts', function ($scope, $rootScope, shortcuts) {
          $scope.zones = [];

          var getNext = function(current, up) {
            var position = current && $.inArray(current, $scope.zones);
            var next;

            if (position >= 0) {
              next = up ? $scope.zones[position - 1] : $scope.zones[position + 1];
            }

            if (!next) {
              next = up ? $scope.zones[$scope.zones.length - 1] : $scope.zones[0];
            }

            // Skip invisible zones
            if (!next.element.is(':visible')) {
              next = getNext(next, up);
            }

            return next;
          };

          this.select = function(next) {
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

          this.route = function(action, e, combo) {
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

            if (next) {
              this.select(next);

              if (shortcuts.ring('hasKey', combo, next.name)) {
                shortcuts.ring('trigger', combo);
              }
            }

            return false;
          };


          this.next = this.route.bind(this, 'next');
          this.prev = this.route.bind(this, 'prev');
          this.main = this.route.bind(this, 'main');

          this.setup = function(zone, keys) {
            shortcuts.bind(zone.name, keys);
            $scope.zones.push(zone);
          };

          this.destroy = function(zone) {
            shortcuts.ring('popScope', zone.name);
            shortcuts.ring('unbindList', zone.name);

            var position = $.inArray(zone, $scope.zones);

            if (position !== -1) {
              $scope.zones.splice(position, 1);
            }
          };

          // Initial setup
          shortcuts.bind('ring-shortcuts', this);
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
            if (current && !prev) {
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