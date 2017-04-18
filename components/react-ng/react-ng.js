/**
 * @name React Ng
 * @category Angular Components
 * @description An Angular directive for proxying React components.
 */

/* global angular: false */

import {createElement} from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import PropTypes from 'prop-types';

const reactModule = angular.module('Ring.react-ng', []);

/**
 * Ring components map
 * @type {{}}
 */
const ringComponents = {};

/**
 * React component getter
 * @param name
 * @return {*}
 */
function getComponent(name) {
  return ringComponents[name];
}

reactModule.service('ringComponents', () => getComponent);

function getComponentIfExist(name) {
  const ComponentClass = getComponent(name);

  if (!ComponentClass) {
    throw new Error(`Component ${name} is not registered`);
  }

  return ComponentClass;
}

function renderAndRemoveOnDestroy(ComponentClass, iElement, props) {
  const component = render(createElement(ComponentClass, props), iElement[0]);
  iElement.on('$destroy', () => {
    unmountComponentAtNode(iElement[0]);
  });
  return component;
}

const reactDirectiveName = 'react';
const staticDirectiveName = `${reactDirectiveName}Static`;
const attributeToPassPrefix = 'react';
const attributeToPassByValuePrefix = 'reactValue';
const specialDOMAttrs = {
  for: 'htmlFor',
  class: 'className'
};

/*@ngInject*/
function reactNgDirective($parse) {
  return {
    restrict: 'A',
    link(scope, iElement, iAttrs) {
      let component = null;
      const directiveName = iAttrs[reactDirectiveName];
      const instanceAttr = 'reactInstance';

      const ComponentClass = getComponentIfExist(directiveName);
      const directiveProps = {};

      function modifyProps(props, name, value) {
        if (name === 'ngModel' && ComponentClass.ngModelStateField) {
          if (typeof ComponentClass.ngModelStateField === 'object' && typeof value === 'object') {
            angular.forEach(ComponentClass.ngModelStateField, (flag, changedPropName) => {
              if (flag && value[changedPropName] !== undefined) {
                props[changedPropName] = value[changedPropName];
              }
            });
          } else {
            props[ComponentClass.ngModelStateField] = value;
          }
        } else {
          props[name] = value;
        }
      }

      function getUpdater(name) {
        return (value, oldValue) => {
          if (!component) {
            return;
          }

          // Don't pass undefined on init
          if (angular.isUndefined(value) && angular.isUndefined(oldValue)) {
            return;
          }

          const props = {};
          modifyProps(props, name, value);
          component.rerender(props);
        };
      }

      angular.forEach(iAttrs, (value, name) => {
        if (name.indexOf('ng') === 0 && name !== 'ngModel') {
          return;
        }

        if (iAttrs.hasOwnProperty(name) && name !== reactDirectiveName && name !== instanceAttr && typeof value !== 'object') {
          // Use React DOM attributes names
          const specialDOMAttrName = specialDOMAttrs[name];
          const propName = specialDOMAttrName || name;

          // Detect interpolation
          const interpolated = iElement[0].getAttribute(iAttrs.$attr[name]) !== value;

          // Check if component expects callback
          const expectsCallback = ComponentClass.propTypes &&
            (ComponentClass.propTypes[propName] === PropTypes.func ||
            ComponentClass.propTypes[propName] === PropTypes.func.isRequired);

          // Parse as expression
          const parsedExpression = !specialDOMAttrName && !interpolated && (typeof value === 'string') && $parse(value);

          if (interpolated) {
            iAttrs.$observe(name, getUpdater(propName));
          } else if (parsedExpression && expectsCallback) {
            directiveProps[propName] = (param, ...rest) => {
              const locals = typeof param === 'object' ? angular.copy(param) : {};
              locals.arguments = [param, ...rest];

              return parsedExpression(scope, locals);
            };
          } else if (parsedExpression) {
            scope.$watch(parsedExpression, getUpdater(propName), true);
            modifyProps(directiveProps, propName, parsedExpression(scope));
          } else {
            directiveProps[propName] = value;
          }
        }
      });

      if ('ngModel' in iAttrs) {
        const ngModel = iElement.controller('ngModel');
        directiveProps._onModelChange = value => {
          ngModel.$setViewValue(value);
        };
      }

      component = renderAndRemoveOnDestroy(ComponentClass, iElement, directiveProps);

      if (iAttrs[instanceAttr]) {
        const instanceProp = $parse(iAttrs[instanceAttr])(scope);

        if (typeof instanceProp === 'string') {
          scope.$eval(`${instanceProp} = component`, {component});
        }
      }
    }
  };
}

/**
 * @name React Ng
 * @constructor
 * @description Directive to render React components once without updating and callbacks. Support ng-click, ng-class and other attributes manipulating.
 * <strong>Note: the attributes that should be passed to a React component should have a "react-" prefix!</strong>
 * <strong>This component is deprecated - most components like Icon, Loader are now implemented as pure angular components.</strong>
 * @extends {ReactComponent}
 * @example
   <example name="React-ng">
     <file name="index.html">
       <div ng-app="react-ng-test">
          <span ng-controller="testController" react-static="Icon" react-glyph="'#pencil'" size="64"></span>
      </div>
     </file>

     <file name="index.js" webpack="true">
       import 'angular';
       import registerComponents from 'ring-ui/components/react-ng/react-ng';
       import Icon from 'ring-ui/components/icon/icon';

       registerComponents({Icon});

       angular.module('react-ng-test', ['Ring.react-ng']).controller('testController', () => {});
       import 'jetbrains-icons/pencil.svg';
     </file>
   </example>

   <example name="React-ng performance">
     <file name="index.html">
       <div ng-app="react-ng-performance" ng-controller="testController" >
          <div react-static="Button" ng-click="run = true" react-children="'Run!'"></div>
          <span ng-if="run" ng-repeat="n in data" react-static="Icon" react-key="n" react-title="n" react-glyph="'#check'" size="16"></span>
       </div>
     </file>

     <file name="index.js" webpack="true">
       import 'angular';
       import registerComponents from 'ring-ui/components/react-ng/react-ng';
       import Icon from 'ring-ui/components/icon/icon';
       import Button from 'ring-ui/components/button/button';
       import 'jetbrains-icons/check.svg';

       registerComponents({Icon, Button});

       angular.module('react-ng-performance', ['Ring.react-ng']).controller('testController', ($scope) => {
         $scope.data = Array.from(Array(500).keys())
       });
     </file>
   </example>
 */

/*@ngInject*/
function reactStaticNgDirective($parse) {
  function getPropertyName(name, prefix) {
    //remove "react-" prefix and lowercase first letter
    const cleanAttrName = name.replace(prefix, '');
    const lowercaseAttrName = cleanAttrName.charAt(0).toLowerCase() + cleanAttrName.slice(1);
    // Use React DOM attributes names
    const specialDOMAttrName = specialDOMAttrs[lowercaseAttrName];
    const propName = specialDOMAttrName || lowercaseAttrName;
    return propName;
  }

  return {
    restrict: 'A',
    link(scope, iElement, iAttrs) {
      const name = iAttrs[staticDirectiveName];
      const ComponentClass = getComponentIfExist(name);
      const props = {};

      angular.forEach(iAttrs, (value, attrName) => {
        if (iAttrs.hasOwnProperty(attrName) && attrName !== staticDirectiveName) {
          if (attrName.indexOf(attributeToPassByValuePrefix) === 0) {
            props[getPropertyName(attrName, attributeToPassByValuePrefix)] = value;
          // Parse as expression
          } else if (attrName.indexOf(attributeToPassPrefix) === 0 && typeof value === 'string') {
            props[getPropertyName(attrName, attributeToPassPrefix)] = $parse(value)(scope);
          }
        }
      });

      renderAndRemoveOnDestroy(ComponentClass, iElement, props);
    }
  };
}


reactModule.directive(reactDirectiveName, reactNgDirective);
reactModule.directive(staticDirectiveName, reactStaticNgDirective);

/**
 * React component register
 * @param componentsMap
 */
export function registerComponents(componentsMap) {
  Object.assign(ringComponents, componentsMap);
}
export const reactNg = reactModule.name;

export default registerComponents;
