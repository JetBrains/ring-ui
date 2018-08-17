import angular from 'angular';
import 'dom4';
import classNames from 'classnames';
import 'core-js/modules/es7.array.includes';

import RingAngularComponent from '../global/ring-angular-component';
import IconNG from '../icon-ng/icon-ng';
import Theme, {applyTheme} from '../global/theme';
import styles from '../button/button.css';

import overrides from './button-ng.css';

const {ringIconVerticalAlignFix, ringIconDefaultColor, iconMarginFix, transcludeSpacer} = overrides;
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

    const modifiers = ['delayed', 'loader', 'danger', 'short', 'active', 'text', 'inline', 'narrowRight'];
    const cl = this.element.classList;

    modifiers.forEach(mod => {
      $scope.$watch(() => $scope.$eval($attrs[mod]), val => {
        const attrName = `data-test-${mod}`;

        if (val) {
          cl.add(styles[mod]);
          this.element.setAttribute(attrName, true);
        } else {
          cl.remove(styles[mod]);
          this.element.removeAttribute(attrName);
        }

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
    if (!$attrs.hasOwnProperty('mode')) {
      this.findTranscludeNode().classList.add(ringIconDefaultColor);
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

      cl.add(styles.primary);
    } else {
      cl.remove(styles.primary);
    }
  };

  updateIcon = () => {
    const {$attrs, $compile, $scope} = this.$inject;
    const icon = this.element.query('rg-icon');
    const transcludeNode = this.findTranscludeNode();
    const glyph = $attrs.icon;
    const size = $attrs.iconSize || DEFAULT_ICON_SIZE;
    const cl = this.element.classList;

    if (glyph) {
      cl.remove(styles.buttonWithoutIcon);
      cl.add(styles.withIcon);
      transcludeNode.classList.add(transcludeSpacer);
      icon.setAttribute('glyph', glyph);
      icon.setAttribute('size', size);
    } else {
      cl.remove(styles.withIcon);
      cl.add(styles.buttonWithoutIcon);
      transcludeNode.classList.remove(transcludeSpacer);
      icon.removeAttribute('glyph');
      icon.removeAttribute('size');
    }

    if (glyph && !transcludeNode.textContent) {
      cl.add(styles.onlyIcon);
    } else {
      cl.remove(styles.onlyIcon);
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
  ><rg-icon class="${classNames(styles.icon, iconMarginFix)}" size="0"></rg-icon
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
