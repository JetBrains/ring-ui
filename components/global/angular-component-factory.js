/* global angular: false */
/* global process: false */

import 'core-js/modules/es7.array.includes';
import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';

import RingAngularComponent from '../global/ring-angular-component';

import DomRenderer from './react-dom-renderer';

function iterateRecursive(obj, iterator) {
  if (!obj) {
    return;
  }

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      iterateRecursive(obj[key], iterator);
    } else {
      iterator(obj, key);
    }
  });
}

function addWarningOnPropertiesChange(object, name) {
  iterateRecursive(object, (obj, key) => {
    let value = obj[key];
    Object.defineProperty(obj, key, {
      get: () => value,
      set: val => {
        // eslint-disable-next-line no-console
        console.warn(`Warning! You have modified a "${key}" property of object, which is passed to Ring UI
          angular-component-factory. This change is not handled by "${name}" component.
          You should reassign object itself if you need this component to handle change.`, obj);
        value = val;
        return value;
      }
    });
  });
}

function getAngularComponentName(name) {
  return `rg${name}`;
}

function createAngularComponent(Component, name) {
  const propKeys = Object.keys(Component.propTypes);

  const bindings = {};
  propKeys.forEach(key => {
    bindings[key] = '<';
  });

  return class AngularComponent extends RingAngularComponent {
    static $inject = ['$scope', '$element', '$transclude'];

    static bindings = bindings;
    static transclude = true;

    $postLink() {
      const {$transclude} = this.$inject;

      $transclude(clone => {
        this.innerNodes = Array.from(clone);
        this.render();
      });
    }

    $onChanges() {
      if (!this.innerNodes) {
        return;
      }
      this.render();
    }

    $onDestroy() {
      unmountComponentAtNode(this.$inject.$element[0]);
    }

    render() {
      const {$scope, $element: {0: container}} = this.$inject;

      const props = {};
      propKeys.forEach(key => {
        if (this[key] !== undefined) {
          if (typeof this[key] === 'function') {
            props[key] = (...rest) => {
              const ret = this[key](...rest);
              $scope.$applyAsync();
              return ret;
            };
          } else {
            props[key] = this[key];
          }

          if (process.env.NODE_ENV === 'development' && typeof this[key] === 'object') {
            addWarningOnPropertiesChange(this[key], getAngularComponentName(name));
          }
        }
      });

      const hasInnerContent = this.innerNodes && this.innerNodes.length;

      render(
        <Component {...props}>
          {hasInnerContent ? <DomRenderer nodes={this.innerNodes}/> : null}
        </Component>,
        container
      );
    }
  };
}

function angularComponentFactory(Component, name) {
  const angularModuleName = `Ring.${name[0].toLowerCase() + name.slice(1)}`;

  return angular.
    module(angularModuleName, []).
    component(getAngularComponentName(name), createAngularComponent(Component, name));
}

export default angularComponentFactory;
export {createAngularComponent};
