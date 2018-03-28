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

const LOADER_BACKGROUND_SELECTOR = '.js-button-loader';

class ButtonController extends RingAngularComponent {
  static $inject = ['$element', '$attrs', '$scope', '$compile', '$log'];

  constructor(...args) {
    super(...args);

    const {$element, $attrs, $scope} = this.$inject;
    $scope.styles = styles;
    this.element = $element[0];

    const modifiers = ['delayed', 'loader', 'danger', 'short', 'active', 'text', 'narrowRight'];
    const cl = this.element.classList;

    modifiers.forEach(mod => {
      $scope.$watch(() => $scope.$eval($attrs[mod]), val => {
        val ? cl.add(styles[mod]) : cl.remove(styles[mod]);

        if (mod === 'loader') {
          this.element.querySelector(LOADER_BACKGROUND_SELECTOR).
            classList[val ? 'add' : 'remove'](styles.loaderBackground);
        }
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
  }

  $postLink() {
    const {$attrs} = this.$inject;
    $attrs.$observe('mode', this.updateMode);
    $attrs.$observe('icon', this.updateIcon);
    $attrs.$observe('iconSize', this.updateIcon);
    $attrs.$observe('theme', this.updateTheme);
  }

  updateTheme = val => {
    const cl = this.element.classList;
    if (val === Theme.DARK) {
      cl.remove(styles.light);
      cl.add(styles.dark);
    }
    if (val === Theme.LIGHT) {
      cl.remove(styles.dark);
      cl.add(styles.light);
    }
  };

  updateMode = val => {
    const cl = this.element.classList;
    if (val === 'primary' || val === 'blue') {
      // Deprecation fallback. Someone please remove this one day.
      if (val === 'blue') {
        this.$inject.$log.warn(
          'Ring UI ButtonNG doesn\'t have "blue" mode anymore. Use "primary" mode instead.',
          this.element
        );
      }

      cl.add(styles.primary);
    } else {
      cl.remove(styles.primary);
    }
  };

  updateIcon = () => {
    const {$attrs, $compile, $scope} = this.$inject;
    const icon = this.element.query('rg-icon');
    const glyph = $attrs.icon;
    const size = $attrs.iconSize || DEFAULT_ICON_SIZE;
    const cl = this.element.classList;

    if (glyph) {
      cl.remove(styles.buttonWithoutIcon);
      cl.add(styles.withIcon);
      icon.setAttribute('glyph', glyph);
      icon.setAttribute('size', size);
    } else {
      cl.remove(styles.withIcon);
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
  <span class="${styles.content}"
  ><rg-icon class="${styles.icon}" size="0"></rg-icon
  ><span ng-transclude></span
  ></span><div class="js-button-loader"></div>
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
  <span class="${styles.content}"
  ><rg-icon class="${styles.icon}" size="0"></rg-icon
  ><span ng-transclude></span
  ></span
  ><div class="js-button-loader"></div>
</a>
    `,
    controller: ButtonController
  };
}

angularModule.directive('rgButton', rgButtonDirective);
angularModule.directive('rgButtonLink', rgButtonLinkDirective);

export default angularModule.name;
