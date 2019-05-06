/**
 * @name Input Ng
 */
import angular from 'angular';

import classNames from 'classnames';
import closeIcon from '@jetbrains/icons/close.svg';

import RingAngularComponent from '../global/ring-angular-component';
import styles from '../input/input.css';
import Theme from '../global/theme';
import ButtonNg from '../button-ng/button-ng';

import styleOverrides from './input-ng.css';

const angularModule = angular.module('Ring.input', [ButtonNg]);

class RingInputComponent extends RingAngularComponent {
  static $inject = ['$element'];

  static require = {
    ngModelCtrl: '?ngModel'
  };

  static bindings = {
    name: '@',
    required: '@',
    ngMinlength: '@',
    ngMaxlength: '@',
    placeholder: '@',
    ngModel: '<',
    onChange: '&',
    label: '@',
    hint: '@',
    size: '@',
    theme: '@',
    disabled: '@',
    active: '<',
    error: '@',
    empty: '<',
    clearable: '<',
    borderless: '<',
    multiline: '<'
  };

  $onInit() {
    this.closeIcon = closeIcon;
    if (!this.ngModelCtrl) {
      return;
    }

    this.ngModelCtrl.$render = () => {
      this.value = this.ngModelCtrl.$viewValue;
    };
  }

  onInputChange() {
    if (!this.ngModelCtrl) {
      return;
    }
    this.ngModelCtrl.$setViewValue(this.value);
  }

  stretch(el) {
    if (!el) {
      return;
    }
    el.style.height = `${el.scrollHeight}px`;
  }

  onKeyUp() {
    if (!this.inputNode) {
      this.inputNode = this.$inject.$element[0].querySelector('[data-test="ring-input"]');
    }

    if (this.multiline && this.inputNode.scrollHeight > this.inputNode.clientHeight) {
      this.stretch(this.inputNode);
    }
  }

  onClear() {
    this.value = '';
  }

  getContainerClasses() {
    return classNames(
      styles.container,
      styles[this.theme || Theme.LIGHT],
      this.size ? [styles[`size${this.size}`]] : null,
      {
        [styles.active]: this.active,
        [styles.error]: this.error != null,
        [styles.empty]: !this.value,
        [styles.noLabel]: !this.label,
        [styles.clearable]: this.clearable,
        [styles.borderless]: this.borderless
      }
    );
  }

  static template = `
<div 
  data-test="ring-input-container"
  ng-class="$ctrl.getContainerClasses()"
>
  <input 
    type="text"
    data-test="ring-input"
    class="${styles.input}"
    name="{{$ctrl.name}}"
    ng-if="!$ctrl.multiline"
    placeholder="{{$ctrl.placeholder}}"
    ng-model="$ctrl.value"
    ng-required="$ctrl.required"
    ng-disabled="$ctrl.disabled"
    ng-minlength="$ctrl.ngMinlength"
    ng-maxlength="$ctrl.ngMaxlength"
    ng-change="$ctrl.onInputChange()"
    ng-keyup="$ctrl.onKeyUp()"
  />
  
  <textarea
    data-test="ring-input"
    ng-if="$ctrl.multiline"
    class="${styles.input}"
    rows="1"
    name="{{$ctrl.name}}"
    placeholder="{{$ctrl.placeholder}}"
    ng-model="$ctrl.value"
    ng-required="$ctrl.required"
    ng-disabled="$ctrl.disabled"
    ng-minlength="$ctrl.ngMinlength"
    ng-maxlength="$ctrl.ngMaxlength"
    ng-change="$ctrl.onInputChange()"
    ng-keyup="$ctrl.onKeyUp()"
  ></textarea>
  
  <rg-button
    ng-if="$ctrl.clearable"
    data-test="ring-input-clear"
    class="${styles.clear} ${styleOverrides.clear}"
    icon="{{:: $ctrl.closeIcon}}"
    ng-click="$ctrl.onClear()"
  ></rg-button>
  
  <label
    ng-if="!$ctrl.borderless"
    class="${styles.label}"
  >{{$ctrl.label}}</label>
  
  <div ng-if="!$ctrl.borderless" class="${styles.underline}"></div>
  <div ng-if="!$ctrl.borderless" class="${styles.focusUnderline}"></div>
  <div ng-if="!$ctrl.borderless" class="${styles.errorUnderline}"></div>
  <div ng-if="!$ctrl.borderless && $ctrl.error" class="${styles.errorText} ${styleOverrides.errorText}">{{$ctrl.error}}</div>
</div>
  `;
}

angularModule.component('rgInput', RingInputComponent);

export default angularModule.name;
