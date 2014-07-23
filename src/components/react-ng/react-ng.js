/**
 * @author maxim.mazin
 * @fileoverview AngularJS directive that proxies React components.
 * Variable 'angular' is expected to exist in a global scope.
 */

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
        var ComponentClass = window[scope.react];
        React.renderComponent(new ComponentClass(scope.reactState()), element);
      }
    };
  }
]);