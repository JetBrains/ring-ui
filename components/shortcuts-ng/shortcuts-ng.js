import 'dom4';
import shortcutsInstance from 'shortcuts/shortcuts';

const css = window.getComputedStyle;

/* global angular: false */
let ringShortcutsModule = angular.module('Ring.shortcuts', []);

ringShortcutsModule.provider('shortcuts', function () {
  let modes = {};
  let mainModes = {};
  let reference = [];

  this.mode = config => {
    modes[config.id] = config.shortcuts;
    mainModes[config.id] = !!config.main;

    if (config.title) {
      reference.push(config);
    }

    return this;
  };

  /*@ngInject*/
  this['$get'] = function($rootScope) {
    return {
      bind: (name, handlers, scope) => {
        let mode = modes[name];

        // Nothing to bind
        if (typeof handlers !== 'object') {
          return;
        }

        // No declaration
        if (!mode) {
          throw new Error('Shortcut mode ' + name + ' is not declared');
        }

        mode.forEach(key => {
          let handler = handlers[key.action];

          if (!angular.isFunction(handler)) {
            return;
          }

          shortcutsInstance.bind({
            key: key.key,
            scope: scope || name,
            handler: () => {
              let ret = handler.apply(handlers, arguments);
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
      triggerAction: (mode, action) => {
        let actions = modes[mode];

        for (let i = actions.length - 1; i >= 0; i--) {
          if (actions[i].action === action) {
            return shortcutsInstance.trigger(actions[i].key[0] || actions[i].key);
          }
        }
      },
      isMainMode: name => {
        return mainModes[name];
      },
      getRegisteredShortcuts: () => {
        return reference;
      },

      shortcuts: shortcutsInstance
    };
  };
});

ringShortcutsModule.directive('rgShortcutsApp', function () {
  return {
    restrict: 'A',
    controller: function ($scope, $rootScope, $attrs, shortcuts) {
      $scope.zones = [];
      $scope.loop = 'shortcutsLoop' in $attrs;

      function getNext(current, back) {
        let position = current && $scope.zones.indexOf(current);
        let next;

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
        if (next && (!document.contains(next.element) || css(next.element).display === 'none')) {
          next = getNext(next, back);
        }

        return next;
      }

      this.deselect = () => {
        $scope.current.onBlur();
        $scope.current = null;
      };

      this.select = next => {
        if ($scope.current === next) {
          return;
        }

        if ($scope.current) {
          shortcutsInstance.spliceScope($scope.current.scope);
          this.deselect();
        }

        if (!next) {
          return;
        }

        shortcutsInstance.pushScope(next.scope);

        $scope.current = next;
      };

      this.route = (action, e, combo, mode) => {
        let next;

        // There is nowhere to navigate
        if (!$scope.zones.length) {
          return false;
        }

        // Reset current zone if is not equal current scope
        if ($scope.current && $scope.current.scope !== shortcutsInstance.getScope().pop()) {
          this.deselect();
        }

        if (action === 'main') {
          $scope.zones.forEach((zone, index) => {
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
          this.select(next);

          if (shortcutsInstance.hasKey(combo, next.scope)) {
            //TODO починить
            shortcutsInstance.trigger(combo);
          }
          // Otherwise go back
        } else {
          shortcuts.triggerAction(mode, action === 'next' ? 'prev' : 'next');
        }

        return false;
      };

      this.sort = () => {
        let orderedElements = document.queryAll('[rg-shortcuts]');

        $scope.zones.forEach(zone => {
          zone.order = orderedElements.indexOf(zone.element);
        });

        $scope.zones.sort((a, b) => {
          return a.order - b.order;
        });
      };

      this.setup = (zone, keys) => {
        shortcuts.bind(zone.name, keys, zone.scope);
        $scope.zones.push(zone);
        this.sort();
      };

      this.destroy = zone => {
        shortcutsInstance.spliceScope(zone.scope);
        shortcutsInstance.unbindScope(zone.scope);

        let position = $scope.zones.indexOf(zone);

        if (position !== -1) {
          $scope.zones.splice(position, 1);
        }
      };

      // Initial setup
      let keyMap = {
        next: this.route.bind(this, 'next'),
        prev: this.route.bind(this, 'prev'),
        main: this.route.bind(this, 'main')
      };

      shortcuts.bind('ring-shortcuts', keyMap);
      shortcutsInstance.pushScope('ring-shortcuts');
    }
  };
});

ringShortcutsModule.directive('rgShortcuts', function ($parse) {
  return {
    restrict: 'A',
    require: ['^rgShortcutsApp'],
    link: function($scope, iElement, iAttrs, shortcutsCtrl) {
      // Closest controller
      let ctrl = shortcutsCtrl[shortcutsCtrl.length - 1];

      let name = iAttrs.rgShortcuts;
      let map = $scope.$eval(iAttrs.shortcutsMap);
      let focusGetter = $parse(iAttrs.shortcutsFocus);
      let blurGetter = $parse(iAttrs.shortcutsBlur);

      let zone = {
        name: name,
        scope: name + '-' + $scope.$id,
        element: iElement[0],
        onBlur: blurGetter($scope) || angular.noop
      };

      $scope.$evalAsync(() => {
        ctrl.setup(zone, map);
      });

      $scope.$watch(() => {
        return focusGetter($scope);
      }, current => {
        if (current) {
          ctrl.select(zone);
        }
      });

      $scope.$on('$destroy', () => {
        ctrl.destroy(zone);
      });
    }
  };
});

export default ringShortcutsModule.name;
