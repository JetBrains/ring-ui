import angular from 'angular';

import 'dom4';
import classNames from 'classnames';

import RingAngularComponent from '../global/ring-angular-component';
import {addClasses, applyMethodToClasses, removeClasses} from '../global/dom';
import IconNG from '../icon-ng/icon-ng';
import Theme, {applyTheme} from '../global/theme';
import styles from '../button/button.css';

import overrides from './button-ng.css';

const {ringIconDefaultColor, iconMarginFix, transcludeSpacer} = overrides;

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
  styles.light
);

export const LOADER_BACKGROUND_SELECTOR = '.js-button-loader';

class ButtonController extends RingAngularComponent {
  static $inject = ['$element', '$attrs', '$scope', '$compile', '$log'];

  constructor(...args) {
    super(...args);

    const {$element, $attrs, $scope} = this.$inject;
    $scope.styles = styles;
    this.element = $element[0];

    const modifiers = ['delayed', 'loader', 'danger', 'short', 'active', 'text', 'inline', 'narrowRight'];
    const cl = this.element.classList;

    modifiers.forEach(mod => {
      $scope.$watch(() => $scope.$eval($attrs[mod]), val => {
        const attrName = `data-test-${mod}`;

        if (val) {
          addClasses(cl, styles[mod]);
          this.element.setAttribute(attrName, true);
        } else {
          removeClasses(cl, styles[mod]);
          this.element.removeAttribute(attrName);
        }

        if (mod === 'loader') {
          applyMethodToClasses(val ? 'add' : 'remove')(
            this.element.querySelector(LOADER_BACKGROUND_SELECTOR).classList,
            styles.loaderBackground
          );
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
    if (!$attrs.hasOwnProperty('mode')) {
      addClasses(this.findTranscludeNode().classList, ringIconDefaultColor);
    }
    $attrs.$observe('mode', this.updateMode);
    $attrs.$observe('icon', this.updateIcon);
    $attrs.$observe('iconSize', this.updateIcon);
    $attrs.$observe('theme', this.updateTheme);
  }

  updateTheme = themeName => {
    if (isValidTheme(themeName)) {
      changeTheme(this.element, {currentTheme: themeName});
    }
  };

  findTranscludeNode = () => this.element.query('ng-transclude');

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

      addClasses(cl, styles.primary);
    } else {
      removeClasses(cl, styles.primary);
    }
  };

  updateIcon = () => {
    const {$attrs, $compile, $scope} = this.$inject;
    const icon = this.element.query('rg-icon');
    const transcludeNode = this.findTranscludeNode();
    const glyph = $attrs.icon;
    const size = $attrs.iconSize;
    const cl = this.element.classList;

    if (glyph) {
      removeClasses(cl, styles.buttonWithoutIcon);
      addClasses(cl, styles.withIcon);
      addClasses(transcludeNode.classList, transcludeSpacer);
      icon.setAttribute('glyph', glyph);
      if (size) {
        icon.setAttribute('size', size);
      }
    } else {
      removeClasses(cl, styles.withIcon);
      addClasses(cl, styles.buttonWithoutIcon);
      removeClasses(transcludeNode.classList, transcludeSpacer);
      icon.removeAttribute('glyph');
      icon.removeAttribute('size');
    }

    if (glyph && !transcludeNode.textContent) {
      addClasses(cl, styles.onlyIcon);
    } else {
      removeClasses(cl, styles.onlyIcon);
    }

    $compile(icon)($scope);
  }
}


function isValidTheme(themeName) {
  return themeName && Object.values(Theme).some(theme => theme === themeName);
}

function changeTheme(element, data) {
  return applyTheme({
    element,
    prevTheme: data.prevTheme && styles[data.prevTheme] || styles.light,
    currentTheme: styles[data.currentTheme]
  });
}

function createButtonDirective(tagName) {
  return () => ({
    restrict: 'E',
    transclude: true,
    replace: true,
    require: {
      rgThemeCtrl: '?^^rgTheme'
    },
    template: `
  <${tagName} class="${buttonClasses}">
  <span class="${styles.content}"
  ><rg-icon class="${classNames(styles.icon, iconMarginFix)}"></rg-icon
  ><ng-transclude></ng-transclude
  ></span
  ><div class="js-button-loader"></div>
  </${tagName}>
    `,
    controller: ButtonController,
    link: (scope, element, attrs, {rgThemeCtrl}) => {
      if (rgThemeCtrl) {
        changeTheme(element[0], {currentTheme: rgThemeCtrl.theme});
        rgThemeCtrl.on('change', (event, data) => changeTheme(element[0], data));
      }
    }
  });
}


angularModule.directive('rgButton', createButtonDirective('button'));
angularModule.directive('rgButtonLink', createButtonDirective('a'));

export default angularModule.name;
