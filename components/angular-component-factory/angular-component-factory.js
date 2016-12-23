/* global angular: false */

import React, {PropTypes} from 'react';
import {render} from 'react-dom';
import 'core-js/modules/es7.array.includes';
import RingAngularComponent from '../ring-angular-component/ring-angular-component';

const funcTypes = [PropTypes.func, PropTypes.func.isRequired];
const stringTypes = [PropTypes.string, PropTypes.string.isRequired];

function iterateRecursive(obj, iterator) {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      iterateRecursive(obj[key]);
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
        console.warn(`Warning! You have modified a "${key}" property of object, which is passed to RingUI
          angular-component-factory. This change is not handled by "${name}" component. 
          You should reassign object itself if you need this component to handle change.`, obj);
        value = val;
        return value;
      }
    });
  });
}

function angularComponentFactory(Component, name) {
  const angularModuleName = `Ring.${name[0].toLowerCase() + name.slice(1)}`;
  const angularComponentName = `rg${name}`;

  const propTypes = Component.propTypes;
  const propKeys = Object.keys(propTypes);

  const bindings = {};
  propKeys.forEach(key => {
    if (key === 'className') {
      bindings.className = '@className';
    } else if (funcTypes.includes(propTypes[key])) {
      bindings[key] = '&';
    } else if (stringTypes.includes(propTypes[key])) {
      bindings[key] = '@';
    } else {
      bindings[key] = '<';
    }
  });

  class AngularComponent extends RingAngularComponent {
    static $inject = ['$scope', '$element'];

    static bindings = bindings;

    $postLink() {
      this.render();
    }

    $onChanges() {
      this.render();
    }

    render() {
      const {$scope, $element: {0: container}} = this.$inject;

      const props = {};
      propKeys.forEach(key => {
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
          addWarningOnPropertiesChange(this[key], angularComponentName);
        }
      });

      render(<Component {...props}/>, container);
    }
  }

  return angular.
    module(angularModuleName, []).
    component(angularComponentName, AngularComponent);
}

export default angularComponentFactory;
