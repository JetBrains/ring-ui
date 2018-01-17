import angular from 'angular';
import 'dom4';
import classNames from 'classnames';
import 'core-js/modules/es7.array.includes';

import RingAngularComponent from '../global/ring-angular-component';
import IconNG from '../icon-ng/icon-ng';
import Theme from '../global/theme';
import styles from '../button/button.css';

import {ringIconVerticalAlignFix} from './button-ng.css';


const DEFAULT_ICON_SIZE = 16;

/**
 * @name Button Ng
 * @tags Ring UI Language
 * @category Legacy Angular
 * @description Provides an Angular wrapper for Button.
 * @example-file ./button-ng.examples.html
 */


const angularModule = angular.module('Ring.button', [IconNG]);
const ORDER_NOT_DEFINED = '-1';
const buttonClasses = classNames(
  styles.button,
  styles.buttonWithoutIcon,
  ringIconVerticalAlignFix,
  styles.light
);

class ButtonController extends RingAngularComponent {
  static $inject = ['$element', '$attrs', '$scope', '$compile'];

  constructor(...args) {
    super(...args);

    const {$element, $attrs, $scope} = this.$inject;
    $scope.styles = styles;
    this.element = $element[0];

    const modifiers = ['delayed', 'loader', 'danger', 'short', 'active', 'text'];
    const cl = this.element.classList;

    modifiers.forEach(mod => {
      $scope.$watch(() => $scope.$eval($attrs[mod]), val => {
        val ? cl.add(styles[mod]) : cl.remove(styles[mod]);
      });
    });

    const tabIndex = $attrs.tabindex || ORDER_NOT_DEFINED;
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
    const updateTheme = val => setTimeout(this.updateTheme.bind(this, val), 0);

    $attrs.$observe('mode', updateMode);
    $attrs.$observe('icon', updateIcon);
    $attrs.$observe('iconSize', updateIcon);
    $attrs.$observe('theme', updateTheme);
  }

  updateTheme(val) {
    const cl = this.element.classList;
    if (val === Theme.DARK) {
      cl.remove(styles.light);
      cl.add(styles.dark);
    }
    if (val === Theme.LIGHT) {
      cl.remove(styles.dark);
      cl.add(styles.light);
    }
  }

  updateMode(val) {
    const cl = this.element.classList;
    if (val === 'primary') {
      cl.add(styles.primary);
    } else {
      cl.remove(styles.primary);
    }
  }

  updateIcon() {
    const {$attrs, $compile, $scope} = this.$inject;
    const icon = this.element.query('.ring-icon');
    const glyph = $attrs.icon;
    const size = $attrs.iconSize || DEFAULT_ICON_SIZE;
    const cl = this.element.classList;

    if (glyph) {
      cl.remove(styles.buttonWithoutIcon);
      icon.setAttribute('glyph', glyph);
      icon.setAttribute('size', size);
    } else {
      cl.add(styles.buttonWithoutIcon);
      icon.removeAttribute('glyph');
      icon.removeAttribute('size');
    }

    $compile(icon)($scope);
  }
}

function rgButtonDirective() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: `
<button class="${buttonClasses}">
  <span class="${styles.content}"><span ng-transclude></span
  ><rg-icon class="${styles.icon}"></rg-icon
  ></span>
</button>
    `,
    controller: ButtonController
  };
}

function rgButtonLinkDirective() {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    template: `
<a class="${buttonClasses}">
  <span class="${styles.content}"><span ng-transclude></span
  ><rg-icon class="${styles.icon}"></rg-icon
  ></span>
</a>
    `,
    controller: ButtonController
  };
}

angularModule.directive('rgButton', rgButtonDirective);
angularModule.directive('rgButtonLink', rgButtonLinkDirective);

export default angularModule.name;
