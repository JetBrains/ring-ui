import angular from 'angular';

import styles from '../island/island.css';

import compile from './island-ng-class-fixer';

const angularModule = angular.module('Ring.island-ng.content', []);

angularModule.directive('rgIslandHeader', function islandHeaderDirective() {
  return {
    transclude: true,
    replace: true,
    bindToController: {
      border: '=?'
    },
    compile,
    template: `
<div
  data-test="ring-island-header"
  class="${styles.header}"
  ng-class="{'${styles.withBottomBorder}': headerCtrl.border}" 
  ng-transclude
></div>
`,
    controllerAs: 'headerCtrl',
    controller: function controller() {
      this.$onInit = () => {
        this.wrapWithTitle = this.wrapWithTitle !== undefined ? this.wrapWithTitle : true;
      };
    }
  };
});

export default angularModule.name;
