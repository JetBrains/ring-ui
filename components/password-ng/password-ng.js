/**
 * @name Password Ng
 * @category Legacy Angular Components
 * @framework Angular
 * @description Password input with strength display
 * @example-file ./password-ng.examples.html
 */

import angular from 'angular';

import '../password/password.scss';
import {isStringEmpty} from '../password/password';
import '../input/input.scss';

const angularModule = angular.module('Ring.password', []);

const onChange = (changes, key, fn) => {
  if (changes[key] && changes[key].currentValue !== undefined) {
    fn(changes[key].currentValue);
  }
};

angularModule.component('rgPassword', {
  template: require('./password-ng.html'), //eslint-disable-line
  transclude: {
    description: '?description',
    message: '?message'
  },
  bindings: {
    value: '=',
    requiredStrength: '<?',
    currentStrength: '<',
    valid: '<',

    message: '@',
    description: '@'
  },
  controller: function controller($scope) {
    this.required = 0;
    this.current = 0;
    this.valid = false;
    this.invalid = false;

    this.$onChanges = changes => {
      onChange(changes, 'requiredStrength', value => {
        this.required = +value;
      });

      onChange(changes, 'currentStrength', value => {
        this.current = +value;
      });

      onChange(changes, 'message', value => {
        this.message = value;
      });

      onChange(changes, 'description', value => {
        this.description = value;
      });

      onChange(changes, 'valid', value => {
        this.forceValid = value;
      });

      this.valid = this.required ? this.current > this.required : this.forceValid;
      this.invalid = this.required && !this.valid;

      this.getClasses = baseClass => ({
        [baseClass]: true,
        [`${baseClass}_valid`]: this.valid,
        [`${baseClass}_invalid`]: this.invalid
      });

      this.isMarkerValid = () => this.valid && this.current > this.required;
      this.isMarkerInvalid = () => this.invalid && this.current >= this.required;
    };

    $scope.$watch('$ctrl.value', value => {
      this.empty = isStringEmpty(value);
    });
  }
});

export default angularModule.name;
