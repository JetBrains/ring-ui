/**
 * @name Island Ng
 * @category Angular Components
 * @framework Angular
 * @description Provides an Angular wrapper for Island.
 * @example-file ./island-ng.examples.html
 */
/* global angular: false */
import styles from '../island/island.css';
import IslandHeader from './island-header-ng';
import IslandContent from './island-content-ng';
import compile from './island-ng-class-fixer';

const angularModule = angular.module('Ring.island-ng', [IslandHeader, IslandContent]);

const islandDirective = {
  transclude: true,
  replace: true,
  bindToController: {
    narrow: '='
  },
  compile,
  template: `
<div 
  class="${styles.island}" 
  ng-class="{'${styles.narrowIsland}': islandCtrl.narrow}" 
  ng-transclude
></div>
`,
  controllerAs: 'islandCtrl',
  controller: angular.noop
};

angularModule.
  directive('rgIsland', () => islandDirective);

export default angularModule.name;
