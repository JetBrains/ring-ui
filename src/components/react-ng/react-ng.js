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
    throw Error('Component ' + name + ' is not registered');
  } else if (!React.isValidClass(ComponentClass)) {
    throw Error('Property ' + name + ' is not valid component');
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

/**
 * Directive to render React components
 * <example>
 *   <div react="ProgressBar" value="searchProgress.percent"></div>
 * </example>
 */
var directiveName = 'react';
var staticDirectiveName = directiveName + 'Static';
var attributeToPassPrefix = 'react';
var specialDOMAttrs = {
  'for': 'htmlFor',
  'class': 'className'
};

reactModule.directive(directiveName, [
  '$parse',
  function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, iElement, iAttrs) {
        var component = null;
        var name = iAttrs[directiveName];
        var instanceAttr = 'reactInstance';

        var ComponentClass = getComponentIfExist(name);
        var props = {};

        function getPropName(name) {
          if (name === 'ngModel' && ComponentClass.ngModelStateField) {
            return ComponentClass.ngModelStateField;
          }
          return name;
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
            props[getPropName(name)] = value;
            component.setProps(props);
          };
        }

        angular.forEach(iAttrs, function (value, name) {
          if (iAttrs.hasOwnProperty(name) && name !== directiveName && name !== instanceAttr && typeof value === 'string') {
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
              props[propName] = function (param) {
                var locals = typeof param === 'object' ? angular.copy(param) : {};
                locals.arguments = Array.prototype.slice.call(arguments, 0);

                return parsedExpression(scope, locals);
              };
            } else if (parsedExpression) {
              scope.$watch(parsedExpression, getUpdater(propName));
              props[getPropName(propName)] = parsedExpression(scope);
            } else {
              props[propName] = value;
            }
          }
        });

        if ('ngModel' in iAttrs) {
          props['_onModelChange'] = function(value) {
            var modelAccessor = $parse(iAttrs.ngModel);
            if(!scope.$$phase) {
              scope.$apply(function () {
                modelAccessor.assign(scope, value);
              });
            } else {
              modelAccessor.assign(scope, value);
            }
          };
        }

        component = renderAndRemoveOnDestroy(ComponentClass, iElement, props);

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
 * Directive to render React components once without updating and callbacks. Support ng-click, ng-class and other attributes manipulating.
 * Note: all attributes to pass to react component should have "react-" prefix!
 * <example>
 *   <div react-static="Icon" react-glyph="'pencil'" ng-click="toggleConfig()"></div>
 * </example>
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

          angular.forEach(iAttrs, function (value, name) {
            if (iAttrs.hasOwnProperty(name) && name !== staticDirectiveName && name.indexOf(attributeToPassPrefix) === 0 && typeof value === 'string') {
              // Parse as expression
              var parsedExpression = $parse(value);
              props[getPropertyName(name)] = parsedExpression(scope);
            }
          });

          renderAndRemoveOnDestroy(ComponentClass, iElement, props);
        }
      };
    }
  ]);
