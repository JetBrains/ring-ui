(function (angular) {
  'use strict';

  angular.module('Ring.shortcuts', [])
    .provider('shortcuts', [function () {
      var shortcuts = ring('shortcuts');
      var modes = {};
      var reference = [];

      this.mode = function(config) {
        modes[config.id] = config.shortcuts;

        if (config.title) {
          reference.push(config);
        }
        return this;
      };

      this.mode({
        id: 'shortcuts',
        shortcuts: [
          {
            key: 'down',
            action: 'route'
          }, {
            key: 'up',
            action: 'route'
          }, {
            key: 'esc',
            action: 'route'
          }
        ]
      });

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
          'getReference': function () {
            return angular.copy(reference);
          }
        };

      }];
    }])
    .directive('shortcutsApp', [function () {
      return {
        restrict: 'A',
        controller: ['$rootScope', '$scope', 'shortcuts', function ($scope, $rootScope, shortcuts) {
          $scope.zones = [];

          this.route = function(e, combo) {
            // There is nowhere to navigate
            if (!$scope.zones.length) {
              return false;
            }

            var up = (combo === 'up');
            var position = $scope.current && $.inArray($scope.current, $scope.zones);
            var next;

            if (position >= 0) {
              next = up ? $scope.zones[position - 1] : $scope.zones[position + 1];
            }

            if (!next) {
              next = up ? $scope.zones[$scope.zones.length - 1] : $scope.zones[0];
            }

            // The only zone
            if (next === $scope.current) {
              return false;
            }

            shortcuts.ring('popScope', $scope.current);
            shortcuts.ring('pushScope', next);

            shortcuts.ring('trigger', combo);

            $scope.current = next;
            return false;
          };

          shortcuts.bind('shortcuts', this);

          shortcuts.ring('pushScope', 'shortcuts');

          this.setup = function(name, keys) {
            shortcuts.bind(name, keys);
            $scope.zones.push(name);
          };

          this.destroy = function(name) {
            shortcuts.ring('unbindList', name);

            var position = $.inArray(name, $scope.zones);

            if (position !== -1) {
              $scope.zones.splice(position, 1);
            }
          };
        }]
      };
    }])
    .directive('shortcuts', [function () {
      return {
        restrict: 'A',
        scope: {
          'id': '@shortcuts',
          'keys': '='
        },
        require: ['^shortcutsApp'],
        link: function($scope, iElement, iAttrs, shortcutsCtrl) {
          // Closest controller
          var ctrl = shortcutsCtrl[shortcutsCtrl.length - 1];
          ctrl.setup($scope.id, $scope.keys);

          $scope.$on('$destroy', function() {
            ctrl.destroy($scope.id);
          });
        }
      };
    }]);

}(window.angular));