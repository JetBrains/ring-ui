import 'dom4';
import {getStyles} from '../dom/dom';
import shortcutsInstance from '../shortcuts/shortcuts';

/* global angular: false */
const module = angular.module('Ring.shortcuts', []);

module.provider('shortcuts', function () {
  const modes = {};
  const mainModes = {};
  const reference = [];

  this.mode = config => {
    modes[config.id] = config.shortcuts;
    mainModes[config.id] = !!config.main;

    if (config.title) {
      reference.push(config);
    }

    return this;
  };

  /*@ngInject*/
  this.$get = $rootScope => ({
    bind: (name, handlers, scope) => {
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

    triggerAction: (mode, action) => {
      const actions = modes[mode];

      for (let i = actions.length - 1; i >= 0; i--) {
        if (actions[i].action === action) {
          return shortcutsInstance.trigger(actions[i].key[0] || actions[i].key);
        }
      }
    },

    isMainMode: name => mainModes[name],
    getRegisteredShortcuts: () => reference,
    shortcuts: shortcutsInstance
  });
});

module.directive('rgShortcutsApp', () => ({
  restrict: 'A',

  controller($scope, $rootScope, $attrs, shortcuts) {
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
}));

module.directive('rgShortcuts', $parse => ({
  restrict: 'A',
  require: ['^rgShortcutsApp'],

  link($scope, iElement, iAttrs, shortcutsCtrl) {
    // Closest controller
    let active = false;
    const ctrl = shortcutsCtrl[shortcutsCtrl.length - 1];

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
      ctrl.setup(zone, $scope.$eval(iAttrs.shortcutsMap));
    });

    $scope.$watch(() => focusGetter($scope), focusState => {
      if (focusState) {
        active = true;
        ctrl.select(zone);
      } else if (!focusState && active) {
        const currentZone = ctrl.getCurrent();
        active = false;
        // go to prev shortcuts only if current zone is yours
        if (currentZone && currentZone.scope === zone.scope) {
          ctrl.route('prev');
        }
      }
    });

    $scope.$on('$destroy', () => {
      ctrl.destroy(zone);
    });
  }
}));

export default module.name;
