import angular from 'angular';

import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';

import RingAngularComponent from './ring-angular-component';

import DomRenderer from './react-dom-renderer';

function getAngularComponentName(name) {
  return `rg${name}`;
}

function createAngularComponent(Component) {
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
    component(getAngularComponentName(name), createAngularComponent(Component));
}

export default angularComponentFactory;
export {createAngularComponent};
