import 'dom4';
import 'core-js/modules/es7.array.includes';

import Icon from '../icon-ng/icon-ng';

import '../button/button.scss';

/**
 * @name Button Ng
 * @category Angular Components
 * @description Button directive
 * @example-file ./button-ng__examples.html
 */

/* global angular */

const angularModule = angular.module('Ring.button', [Icon]);
const ORDER_NOT_DEFINED = '-1';

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
        val ? cl.add(`ring-button_${mod}`) : cl.remove(`ring-button_${mod}`);
      });
    });

    const tabIndex = this.$attrs.tabindex || ORDER_NOT_DEFINED;
    if (tabIndex !== ORDER_NOT_DEFINED) {
      this.element.setAttribute('tabindex', tabIndex);
    }

    $scope.$watch(() => $scope.$eval($attrs.loader), val => {
      if (val) {
        this.element.setAttribute('tabindex', ORDER_NOT_DEFINED);
      } else if (tabIndex !== ORDER_NOT_DEFINED) {
        this.element.setAttribute('tabindex', tabIndex);
      } else {
        this.element.removeAttribute('tabindex');
      }
    });

    // A dirty workaround for IE9 :(
    const updateMode = val => setTimeout(this.updateMode.bind(this, val), 0);
    const updateIcon = val => setTimeout(this.updateIcon.bind(this, val), 0);

    $attrs.$observe('mode', updateMode);
    $attrs.$observe('icon', updateIcon);
    $attrs.$observe('iconSize', updateIcon);
  }

  updateMode(val) {
    const cl = this.element.classList;
    const mode = ['primary', 'blue'].includes(val) ? val : 'default';

    cl.remove('ring-button_default', 'ring-button_primary', 'ring-button_blue');
    cl.add(`ring-button_${mode}`);
  }

  updateIcon() {
    const icon = this.element.query('.ring-button__icon');
    const glyph = this.$attrs.icon;
    const size = this.$attrs.iconSize || 16;
    const cl = this.element.classList;

    if (glyph) {
      cl.add('ring-button_icon');
      icon.setAttribute('glyph', glyph);
      icon.setAttribute('size', size);
    } else {
      cl.remove('ring-button_icon');
      icon.removeAttribute('glyph');
      icon.removeAttribute('size');
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

function rgButtonLinkDirective() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: require('./button-link-ng.html'),
    controller: ButtonController
  };
}

angularModule.directive('rgButton', rgButtonDirective);
angularModule.directive('rgButtonLink', rgButtonLinkDirective);

export default angularModule.name;
