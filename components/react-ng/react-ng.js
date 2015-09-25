/**
 * @author maxim.mazin
 * @fileoverview AngularJS directive that proxies React components.
 */

/* global angular: false */

var React = require('react/addons');
var mixIn = require('mout/object/mixIn');

var reactModule = angular.module('Ring.react-ng', []);

/**
 * Ring components map
 * @type {{}}
 */
var ringComponents = {};

/**
 * React component getter
 * @param name
 * @return {*}
 */
function getComponent(name) {
  return ringComponents[name];
}

reactModule.service('ringComponents', function () {
  return getComponent;
});

/**
 * React component register
 * @param componentsMap
 */
function registerComponents(componentsMap) {
  mixIn(ringComponents, componentsMap);
}

function getComponentIfExist(name){
  var ComponentClass = getComponent(name);

  if (!ComponentClass) {
    throw new Error('Component ' + name + ' is not registered');
  } else if (!React.isValidClass(ComponentClass)) {
    throw new Error('Property ' + name + ' is not valid component');
  }

  return ComponentClass;
}

function renderAndRemoveOnDestroy(ComponentClass, iElement, props){
  var component = React.renderComponent(new ComponentClass(props), iElement[0]);
  iElement.on('$destroy', function () {
    React.unmountComponentAtNode(iElement[0]);
  });
  return component;
}

module.exports = registerComponents;

var reactDirectiveName = 'react';
var staticDirectiveName = reactDirectiveName + 'Static';
var attributeToPassPrefix = 'react';
var specialDOMAttrs = {
  'for': 'htmlFor',
  'class': 'className'
};

reactModule.directive(reactDirectiveName, [
  '$parse',
  function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, iElement, iAttrs) {
        var component = null;
        var directiveName = iAttrs[reactDirectiveName];
        var instanceAttr = 'reactInstance';

        var ComponentClass = getComponentIfExist(directiveName);
        var directiveProps = {};

        function modifyProps(props, name, value) {
          if (name === 'ngModel' && ComponentClass.ngModelStateField) {
            if (typeof ComponentClass.ngModelStateField === 'object' && typeof value === 'object') {
              angular.forEach(ComponentClass.ngModelStateField, function (flag, changedPropName) {
                if (flag && value[changedPropName] !== undefined) {
                  props[changedPropName] = value[changedPropName];
                }
              });
            } else if (typeof ComponentClass.ngModelStateField === 'string') {
              props[ComponentClass.ngModelStateField] = value;
            } else {
              return;
            }
          } else {
            props[name] = value;
          }
        }

        function getUpdater(name) {
          return function updatePropsFromWatch(value, oldValue) {
            if (!component) {
              return;
            }

            // Don't pass undefined on init
            if (angular.isUndefined(value) && angular.isUndefined(oldValue)) {
              return;
            }

            var props = {};
            modifyProps(props, name, value);
            component.setProps(props);
          };
        }

        angular.forEach(iAttrs, function (value, name) {
          if (name.indexOf('ng') === 0 && name !== 'ngModel') {
            return;
          }

          if (iAttrs.hasOwnProperty(name) && name !== reactDirectiveName && name !== instanceAttr && typeof value === 'string') {
            // Use React DOM attributes names
            var specialDOMAttrName = specialDOMAttrs[name];
            var propName = specialDOMAttrName || name;

            // Detect interpolation
            var interpolated = iElement[0].getAttribute(iAttrs.$attr[name]) !== value;

            // Check if component expects callback
            var expectsCallback = ComponentClass.propTypes &&
              (ComponentClass.propTypes[propName] === React.PropTypes.func ||
              ComponentClass.propTypes[propName] === React.PropTypes.func.isRequired);

            // Parse as expression
            var parsedExpression = !specialDOMAttrName && !interpolated && $parse(value);

            if (interpolated) {
              iAttrs.$observe(name, getUpdater(propName));
            } else if (parsedExpression && expectsCallback) {
              directiveProps[propName] = function (param) {
                var locals = typeof param === 'object' ? angular.copy(param) : {};
                locals.arguments = Array.prototype.slice.call(arguments, 0);

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
          var ngModel = iElement.controller('ngModel');
          directiveProps['_onModelChange'] = function(value) {
            ngModel.$setViewValue(value);
          };
        }

        component = renderAndRemoveOnDestroy(ComponentClass, iElement, directiveProps);

        if (iAttrs[instanceAttr]) {
          var instanceProp = $parse(iAttrs[instanceAttr])(scope);

          if (typeof instanceProp === 'string') {
            scope[instanceProp] = component;
          }
        }
      }
    };
  }
])

/**
 * @name React-ng
 * @constructor
 * @description Directive to render React components once without updating and callbacks. Support ng-click, ng-class and other attributes manipulating.
 * <strong>Note: all attributes to pass to react component should have "react-" prefix!</strong>
 * @extends {ReactComponent}
 * @example
   <example name="React-ng">
     <file name="index.html">
       <div ng-app="Ring.react-ng">
         <span react="Icon" glyph="'pencil'" size="64"></span>
       </div>
     </file>

     <file name="index.js" webpack="true">
       require('angular/angular.min.js');
       require('icon/source/pencil.svg');
       require('react-ng/react-ng')({
         Icon: require('icon/icon')
       });
     </file>
   </example>
 */
  .directive(staticDirectiveName, [
    '$parse',
    function ($parse) {

      function getPropertyName(name) {
        //remove "react-" prefix and uncapitalize first letter
        var cleanAttrName = name.replace(attributeToPassPrefix, '');
        var uncapitalizedAttrName = cleanAttrName.charAt(0).toLowerCase() + cleanAttrName.slice(1);
        // Use React DOM attributes names
        var specialDOMAttrName = specialDOMAttrs[uncapitalizedAttrName];
        var propName = specialDOMAttrName || uncapitalizedAttrName;
        return propName;
      }

      return {
        restrict: 'A',
        link: function (scope, iElement, iAttrs) {
          var name = iAttrs[staticDirectiveName];

          var ComponentClass = getComponentIfExist(name);

          var props = {};

          angular.forEach(iAttrs, function (value, attrName) {
            if (iAttrs.hasOwnProperty(attrName) && attrName !== staticDirectiveName && attrName.indexOf(attributeToPassPrefix) === 0 && typeof value === 'string') {
              // Parse as expression
              var parsedExpression = $parse(value);
              props[getPropertyName(attrName)] = parsedExpression(scope);
            }
          });

          renderAndRemoveOnDestroy(ComponentClass, iElement, props);
        }
      };
    }
  ]);
