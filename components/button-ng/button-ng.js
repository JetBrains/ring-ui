import angular from 'angular';

import 'dom4';
import classNames from 'classnames';

import RingAngularComponent from '../global/ring-angular-component';
import {addClasses, applyMethodToClasses, removeClasses} from '../global/dom';
import IconNG from '../icon-ng/icon-ng';
import Theme, {applyTheme} from '../global/theme';
import styles from '../button/button.css';
import {getButtonClasses} from '../button/button__classes';

import overrides from './button-ng.css';

const {ringIconDefaultColor, iconMarginFix, transcludeSpacer} = overrides;

/**
 * @name Button Ng
 */


const angularModule = angular.module('Ring.button', [IconNG]);
const ORDER_NOT_DEFINED = '-1';

const buttonClassesMap = Object.values({...styles, ...overrides}).
  reduce((acc, classes) => {
    classes.split(' ').forEach(value => (acc[value] = true));
    return acc;
  }, {});

export const LOADER_BACKGROUND_SELECTOR = '.js-button-loader';

class ButtonController extends RingAngularComponent {
  static $inject = ['$element', '$attrs', '$scope', '$compile', '$log'];

  constructor(...args) {
    super(...args);

    const {$element, $attrs, $scope} = this.$inject;
    $scope.styles = styles;
    this.element = $element[0];

    const modifiers = ['delayed', 'loader', 'danger', 'short', 'active', 'text', 'inline', 'narrowRight'];

    modifiers.forEach(mod => {
      $scope.$watch(() => $scope.$eval($attrs[mod]), val => {
        this.updateClasses();
        const attrName = `data-test-${mod}`;

        if (val) {
          this.element.setAttribute(attrName, true);
        } else {
          this.element.removeAttribute(attrName);
        }

        if (mod === 'loader') {
          const isText = this.getAttrValue($attrs.text);
          const withIcon = !!$attrs.icon;
          applyMethodToClasses((val && !isText && !withIcon) ? 'add' : 'remove')(
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
    this.updateClasses();

    const {$attrs} = this.$inject;
    $attrs.$observe('mode', this.updateClasses);
    $attrs.$observe('icon', () => {
      this.updateClasses();
      this.updateIcon();
    });
    $attrs.$observe('iconSize', () => {
      this.updateClasses();
      this.updateIcon();
    });
    $attrs.$observe('theme', this.updateClasses);
  }

  getAttrValue(attribute) {
    const {$scope} = this.$inject;
    return $scope.$eval(attribute);
  }

  updateClasses = () => {
    const {$attrs} = this.$inject;
    this.warnDeprecations($attrs);

    const theme = this.element.classList.contains(styles.light) ? Theme.LIGHT : Theme.DARK;

    const foreignClasses = [...this.element.classList].filter(name => !buttonClassesMap[name]);

    this.element.className = classNames(
      foreignClasses,
      getButtonClasses({
        className: styles.button,
        active: this.getAttrValue($attrs.active),
        disabled: this.getAttrValue($attrs.disabled),
        loader: this.getAttrValue($attrs.loader),
        primary: $attrs.mode === 'primary' || $attrs.mode === 'blue',
        short: this.getAttrValue($attrs.short),
        text: this.getAttrValue($attrs.text),
        inline: this.getAttrValue($attrs.inline),
        danger: this.getAttrValue($attrs.danger),
        delayed: this.getAttrValue($attrs.delayed),
        icon: $attrs.icon,
        theme
      }),
      {
        // Some overrides for angular buttons
        [overrides.buttonWithoutIcon]: !$attrs.icon,
        [overrides.narrowRight]: this.getAttrValue($attrs.narrowRight)
      },
    );

    if (!$attrs.hasOwnProperty('mode')) {
      addClasses(this.findTranscludeNode().classList, ringIconDefaultColor);
    } else {
      removeClasses(this.findTranscludeNode().classList, ringIconDefaultColor);
    }
  };

  findTranscludeNode = () => this.element.query('ng-transclude');

  warnDeprecations = $attrs => {
    // Deprecation fallback. Someone please remove this one day.
    if ($attrs.mode === 'blue') {
      this.$inject.$log.warn(
        'Ring UI ButtonNG doesn\'t have "blue" mode anymore. Use "primary" mode instead.',
        this.element
      );
    }
  };

  updateIcon = () => {
    const {$attrs, $compile, $scope} = this.$inject;
    const icon = this.element.query('rg-icon');
    const transcludeNode = this.findTranscludeNode();
    const glyph = $attrs.icon;
    const size = $attrs.iconSize;
    const isLoading = this.getAttrValue($attrs.loader);

    if (glyph && isLoading) {
      icon.setAttribute('loading', true);
    } else {
      icon.setAttribute('loading', false);
    }

    if (glyph) {
      addClasses(transcludeNode.classList, transcludeSpacer);
      icon.setAttribute('glyph', glyph);
      if (size) {
        icon.setAttribute('size', size);
      }
    } else {
      removeClasses(transcludeNode.classList, transcludeSpacer);
      icon.removeAttribute('glyph');
      icon.removeAttribute('size');
    }

    $compile(icon)($scope);
  }
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
  <${tagName} class="${styles.button} ${styles.light}">
  <span class="${styles.content}"
  ><rg-icon class="${classNames(styles.icon, overrides.iconNg, iconMarginFix)}"></rg-icon
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
