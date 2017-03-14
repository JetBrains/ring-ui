/* global angular: false */

import React, {PropTypes} from 'react';
import {render} from 'react-dom';
import 'core-js/modules/es7.array.includes';
import RingAngularComponent from '../global/ring-angular-component';
import DomRenderer from './react-dom-renderer';

const funcTypes = [PropTypes.func, PropTypes.func.isRequired];
const stringTypes = [PropTypes.string, PropTypes.string.isRequired];

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
    Object.defineProperty(obj, key, { // eslint-disable-line prefer-reflect
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
  const propTypes = Component.propTypes;
  const propKeys = Object.keys(propTypes);

  const bindings = {};
  propKeys.forEach(key => {
    if (key === 'className') {
      bindings.className = '@className';
    } else if (stringTypes.includes(propTypes[key])) {
      bindings[key] = '@';
    } else {
      bindings[key] = '<';
    }
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

    render() {
      const {$scope, $element: {0: container}} = this.$inject;

      const props = {};
      propKeys.forEach(key => {
        if (this[key] !== undefined) {
          if (funcTypes.includes(propTypes[key])) {
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

      render(
        <Component {...props}>
          <DomRenderer nodes={this.innerNodes}/>
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
