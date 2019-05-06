import RingAngularComponent from '../ring-angular-component/ring-angular-component';

import styles from './<%= paramCaseNameSuffix %>.css';

/**
  * @name <%= titleCaseName %>
  */

import angular from 'angular';
const angularModule = angular.module('Ring.<%= paramCaseName %>', []);

class <%= ngComponentName %>Component extends RingAngularComponent {
  static $inject = ['$scope', '$element', '$attrs', '$compile'];

  static bindings = {
    name: '@'
  };

  static template = require('./<%= paramCaseNameSuffix %>.html');

  constructor(...args) {
    super(...args);
    const {$attrs, $compile, $element, $scope} = this.$inject;
    this.styles = styles;
  }
}

angularModule.component('<%= ngComponentName %>', <%= ngComponentName %>Component);

export default angularModule.name;
