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

module.exports = registerComponents;

/**
 * Directive to render React components
 * <example>
 *   <div react="ProgressBar" value="searchProgress.percent"></div>
 * </example>
 */
var directiveName = 'react';
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
        var name = iAttrs[directiveName];
        var instanceAttr = 'reactInstance';

        var ComponentClass = ringComponents[name];
        if (!ComponentClass) {
          throw Error('Component ' + name + ' is not registered');
        } else if (!React.isValidClass(ComponentClass)) {
          throw Error('Property ' + name + ' is not valid component');
        }

        var props = {};

        function getUpdater(name) {
          return function updatePropsFromWatch(value, oldValue) {
            // Don't pass undefined on init
            if (angular.isUndefined(value) && angular.isUndefined(oldValue)) {
              return;
            }

            var props = {};
            props[name] = value;
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

              props[propName] = parsedExpression(scope);
            } else {
              props[propName] = value;
            }
          }
        });

        var component = React.renderComponent(new ComponentClass(props), iElement[0]);

        if (iAttrs[instanceAttr]) {
          var instanceProp = $parse(iAttrs[instanceAttr])(scope);

          if (typeof instanceProp === 'string') {
            scope[instanceProp] = component;
          }
        }

        iElement.on('$destroy', function () {
          React.unmountComponentAtNode(iElement[0]);
        });
      }
    };
  }
]);
