/**
 * @name Island Ng
 */
import angular from 'angular';

import styles from '../island/island.css';

import IslandHeader from './island-header-ng';
import IslandContent from './island-content-ng';
import compile from './island-ng-class-fixer';

const angularModule = angular.module('Ring.island-ng', [IslandHeader, IslandContent]);

angularModule.directive('rgIsland', function islandDirective() {
  return {
    transclude: true,
    replace: true,
    bindToController: {
      narrow: '='
    },
    compile,
    template: `
<div 
  data-test="ring-island"
  class="${styles.island}" 
  ng-class="{'${styles.narrowIsland}': islandCtrl.narrow}" 
  ng-transclude
></div>
`,
    controllerAs: 'islandCtrl',
    controller: angular.noop
  };
});

export default angularModule.name;
