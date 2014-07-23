/**
 * @author maxim.mazin
 * @fileoverview AngularJS directive that proxies React components.
 */

/* global Ring: false */
/* global angular: false */

var React = require('react/addons');

var reactModule = angular.module('Ring.react-ng', []);

reactModule.directive('react', [
  function () {
    return {
      scope: {
        react: '@',
        reactState: '&'
      },
      link: function (scope, element) {
        if (!Ring) {
          throw Error('Ring is not defined');
        }
        var ComponentClass = Ring[scope.react];
        if (!ComponentClass){
          throw Error('Component Ring.' + scope.react + 'is not registered');
        }
        React.renderComponent(new ComponentClass(scope.reactState()), element);
      }
    };
  }
]);