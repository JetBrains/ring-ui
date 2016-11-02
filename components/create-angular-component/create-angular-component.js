/* global angular: false */

import {PropTypes} from 'react';
import {render} from 'react-dom';
import 'core-js/modules/es7.array.includes';
import RingAngularComponent from '../ring-angular-component/ring-angular-component';

const funcTypes = [PropTypes.func, PropTypes.func.isRequired];

function createAngularComponent(Component) {
  const componentName = Component.name;
  const angularModuleName = `Ring.${componentName[0].toLowerCase() + componentName.slice(1)}`;
  const angularComponentName = `rg${componentName}`;

  const propTypes = Component.propTypes;
  const propKeys = Object.keys(propTypes);

  const bindings = {};
  propKeys.forEach(key => {
    if (key === 'className') {
      bindings.className = '@class';
    } else if (funcTypes.includes(propTypes[key])) {
      bindings[key] = '&';
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
            $scope.$applyAsync(() => this[key](...rest));
          };
        } else {
          props[key] = this[key];
        }
      });

      render(Component.factory(props), container);
    }
  }

  return angular.
    module(angularModuleName, []).
    component(angularComponentName, AngularComponent);
}

export default createAngularComponent;
