/* global angular */

import 'dom4';
import 'core-js/modules/es7.array.includes';

import {registerComponents, reactNg} from '../react-ng/react-ng';
import Icon from '../icon/icon';

import '../button/button.scss';

registerComponents({Icon});

const module = angular.module('Ring.button', [reactNg]);

class ButtonController {
  constructor($element, $attrs, $scope, $compile) {
    this.element = $element[0];
    this.$attrs = $attrs;
    this.$scope = $scope;
    this.$compile = $compile;

    const modifiers = ['delayed', 'loader', 'danger', 'short', 'active'];
    const cl = this.element.classList;
    modifiers.forEach(mod => {
      $scope.$watch(() => $scope.$eval($attrs[mod]), val => {
        val ? cl.add('ring-button_' + mod) : cl.remove('ring-button_' + mod);
      });
    });

    $scope.$watch(() => $scope.$eval($attrs.loader), val => {
      val ? this.element.setAttribute('tabindex', '-1') : this.element.removeAttribute('tabindex');
    });

    $attrs.$observe('mode', ::this.updateMode);
    $attrs.$observe('icon', ::this.updateIcon);
    $attrs.$observe('iconSize', ::this.updateIcon);
  }

  updateMode(val) {
    const cl = this.element.classList;
    const mode = ['primary', 'blue'].includes(val) ? val : 'default';

    cl.remove('ring-button_default', 'ring-button_primary', 'ring-button_blue');
    cl.add('ring-button_' + mode);
  }

  updateIcon() {
    const icon = this.element.query('.ring-button__icon');
    const glyph = this.$attrs.icon;
    const size = this.$attrs.iconSize || 16;
    const cl = this.element.classList;

    if (glyph) {
      cl.add('ring-button_icon');
      icon.setAttribute('react-static', 'Icon');
      icon.setAttribute('react-value-glyph', glyph);
      icon.setAttribute('react-size', size);
    } else {
      cl.remove('ring-button_icon');
      icon.removeAttribute('react-static');
      icon.removeAttribute('react-value-glyph');
      icon.removeAttribute('react-size');
    }

    this.$compile(icon)(this.$scope);
  }
}

function rgButtonDirective() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: require('./button-ng.html'),
    controller: ButtonController
  };
}

module.directive('rgButton', rgButtonDirective);

export default module.name;

/**
 * @name Button Ng
 * @description Button directive
 * @example
  <example name="Button Ng">
    <file name="index.html">
      <div ng-app="test" ng-controller="testCtrl">
        <p>
          <rg-button>Press me</rg-button>
          <rg-button>Press me Press me Press me Press me Press me Press me Press me</rg-button>
          <rg-button disabled="true">Press me</rg-button>
          <rg-button loader="true">Press me</rg-button>
          <rg-button delayed="true">Press me</rg-button>
        </p>

        <p>
          <rg-button mode="primary">Press me</rg-button>
          <rg-button mode="primary">Press me Press me Press me Press me Press me Press me Press me</rg-button>
          <rg-button mode="primary" disabled="true">Press me</rg-button>
          <rg-button mode="primary" loader="true">Press me</rg-button>
          <rg-button mode="primary" delayed="true">Press me</rg-button>
        </p>

        <p>
          <rg-button mode="blue">Press me</rg-button>
          <rg-button mode="blue">Press me Press me Press me Press me Press me Press me Press me</rg-button>
          <rg-button mode="blue" disabled="true">Press me</rg-button>
          <rg-button mode="blue" loader="true">Press me</rg-button>
          <rg-button mode="blue" delayed="true">Press me</rg-button>
        </p>

        <p>
          <rg-button>Press me</rg-button>
          <rg-button icon="{{caretDown}}">Press me</rg-button>
          <rg-button icon="{{trash}}"></rg-button>
          <rg-button icon="{{trash}}" mode="primary"></rg-button>
          <rg-button icon="{{trash}}" mode="blue"></rg-button>
          <rg-button icon="{{merge}}" disabled="true"></rg-button>
          <rg-button icon="{{pencil}}" loader="true"></rg-button>
          <rg-button>Press me</rg-button>
        </p>

        <p>
          <rg-button danger="true">Press me</rg-button>
          <rg-button danger="true" disabled="true">Press me</rg-button>
          <rg-button danger="true" loader="true">Press me</rg-button>
          <rg-button danger="true" icon="{{pencil}}"></rg-button>
        </p>
      </div>
    </file>

    <file name="index.js" webpack="true">
      require('angular');
      require('ring-ui/components/button-ng/button-ng');

      angular.module('test', ['Ring.button']).controller('testCtrl', function($scope) {
        $scope.pencil = require('jetbrains-icons/pencil.svg');
        $scope.caretDown = require('jetbrains-icons/caret-down.svg');
        $scope.trash = require('jetbrains-icons/trash.svg');
        $scope.merge = require('jetbrains-icons/merge.svg');
      });
    </file>
  </example>
*/
