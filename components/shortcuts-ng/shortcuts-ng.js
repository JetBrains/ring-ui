import 'dom4';
import {getStyles} from '../global/dom';
import shortcutsInstance from '../shortcuts/core';

/* global angular: false */
const angularModule = angular.module('Ring.shortcuts', []);

angularModule.provider('shortcuts', function () {
  const modes = {};
  const mainModes = {};
  const reference = [];

  function addMode(config) {
    modes[config.id] = config.shortcuts;
    mainModes[config.id] = !!config.main;

    if (config.hasOwnProperty('title')) {
      reference.push(config);
    }

    return this;
  }

  this.mode = addMode;

  this.$get = function ($rootScope) {
    return {
      addMode,

      bind(name, handlers, scope) {
        const mode = modes[name];

        // Nothing to bind
        if (typeof handlers !== 'object') {
          return;
        }

        // No declaration
        if (!mode) {
          throw new Error(`Shortcut mode ${name} is not declared`);
        }

        mode.forEach(key => {
          if (!angular.isFunction(handlers[key.action])) {
            return;
          }

          shortcutsInstance.bind({
            key: key.key,
            scope: scope || name,
            handler: (...args) => {
              // TODO Dirty hack ;(
              const ret = handlers[key.action](...args);
              if (!$rootScope.$$phase) { // eslint-disable-line angular/no-private-call
                $rootScope.$apply();
              }
              return ret;
            }
          });
        });
      },

      triggerAction(mode, action) {
        const actions = modes[mode];

        for (let i = actions.length - 1; i >= 0; i--) {
          if (actions[i].action === action) {
            return shortcutsInstance.trigger(actions[i].key[0] || actions[i].key);
          }
        }

        return undefined;
      },

      isMainMode: name => mainModes[name],
      getRegisteredShortcuts: () => reference,
      shortcuts: shortcutsInstance
    };
  };
});

angularModule.directive('rgShortcutsApp', function rgShortcutsAppDirective() {
  return {
    restrict: 'A',

    controller: function controller($scope, $rootScope, $attrs, shortcuts) {
      $scope.zones = [];
      $scope.loop = 'shortcutsLoop' in $attrs;

      function getNext(current, back) {
        const position = current && $scope.zones.indexOf(current);
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
        if (next && (!document.documentElement.contains(next.element) || getStyles(next.element).display === 'none')) {
          next = getNext(next, back);
        }

        return next;
      }

      this.deselect = () => {
        $scope.current.onBlur();
        $scope.current = null;
      };

      this.getCurrent = () => $scope.current;

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

        // Reset current zone if it's not equal to the current scope
        if ($scope.current && $scope.current.scope !== shortcutsInstance.getScope().
            pop().scopeId) {
          this.deselect();
        }

        if (action === 'main') {
          $scope.zones.forEach((zone, index) => {
            if (shortcuts.isMainMode(zone.name)) {
              next = $scope.zones[index];
            }
          });
        } else {
          next = getNext($scope.current, action === 'prev');
        }

        // Select next zone and trigger same combo there
        if (next) {
          this.select(next);

          if (shortcutsInstance.hasKey(combo, next.scope)) {
            shortcutsInstance.trigger(combo);
          }
          // Otherwise go back
        } else {
          shortcuts.triggerAction(mode, action === 'next' ? 'prev' : 'next');
        }

        return false;
      };

      this.sort = () => {
        const orderedElements = document.queryAll('[rg-shortcuts]');

        $scope.zones.forEach(zone => {
          zone.order = orderedElements.indexOf(zone.element);
        });

        $scope.zones.sort((a, b) => a.order - b.order);
      };

      this.setup = (zone, keys) => {
        shortcuts.bind(zone.name, keys, zone.scope);
        $scope.zones.push(zone);
        this.sort();
      };

      this.destroy = zone => {
        shortcutsInstance.spliceScope(zone.scope);
        shortcutsInstance.unbindScope(zone.scope);

        const position = $scope.zones.indexOf(zone);

        if (position !== -1) {
          $scope.zones.splice(position, 1);
        }
      };

      // Initial setup
      const keyMap = {
        next: this.route.bind(this, 'next'),
        prev: this.route.bind(this, 'prev'),
        main: this.route.bind(this, 'main')
      };

      shortcuts.bind('ring-shortcuts', keyMap);
      shortcutsInstance.pushScope('ring-shortcuts');
    }
  };
});

angularModule.directive('rgShortcuts', function rgShortcutsDirective($parse) {
  return {
    restrict: 'A',
    require: ['^rgShortcutsApp'],

    link: function link($scope, iElement, iAttrs, shortcutsCtrl) {
      // Closest controller
      const shortcutsApp = shortcutsCtrl[shortcutsCtrl.length - 1];

      const name = iAttrs.rgShortcuts;
      const focusGetter = $parse(iAttrs.shortcutsFocus);
      const blurGetter = $parse(iAttrs.shortcutsBlur);

      const zone = {
        name,
        scope: `${name}-${$scope.$id}`,
        element: iElement[0],
        onBlur: blurGetter($scope) || angular.noop
      };

      $scope.$evalAsync(() => {
        shortcutsApp.setup(zone, $scope.$eval(iAttrs.shortcutsMap));
      });

      $scope.$watch(() => focusGetter($scope), focusState => {
        if (focusState) {
          shortcutsApp.select(zone);
        }
      });

      $scope.$on('$destroy', () => {
        shortcutsApp.destroy(zone);
      });
    }
  };
});


angularModule.directive('rgShortcutsGlobal', function rgShortcutsGlobalDirective(shortcuts) {
  return {
    restrict: 'A',

    link: function link($scope, iElement, iAttrs) {
      const name = iAttrs.rgShortcutsGlobal;
      const scope = `${name}-${$scope.$id}`;

      $scope.$evalAsync(() => {
        shortcuts.bind(name, $scope.$eval(iAttrs.shortcutsMap), scope);
        shortcutsInstance.pushScope(scope);
      });

      $scope.$on('$destroy', () => {
        shortcutsInstance.spliceScope(scope);
        shortcutsInstance.unbindScope(scope);
      });
    }
  };
});

export default angularModule.name;
