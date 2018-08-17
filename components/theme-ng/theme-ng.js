import angular from 'angular';

import RingAngularComponent from '../global/ring-angular-component';


const angularModule = angular.module('Ring.theme', []);

class RingThemeComponent extends RingAngularComponent {
  static $inject = ['$scope', '$element'];

  static bindings = {
    theme: '<'
  };

  constructor(...args) {
    super(...args);
  }

  on = this.$inject.$scope.$on.bind(this.$inject.$scope);

  $onInit() {
    const {$element} = this.$inject;
    $element[0].setAttribute('data-test', 'ring-theme');
  }

  $onChanges(changes) {
    if (changes.theme && changes.theme.currentValue) {
      const {$scope} = this.$inject;
      $scope.$emit('change', {
        prevTheme: typeof changes.theme.previousValue === 'string' && changes.theme.previousValue,
        currentTheme: changes.theme.currentValue
      });
    }
  }
}

angularModule.component('rgTheme', RingThemeComponent);


export default angularModule.name;
