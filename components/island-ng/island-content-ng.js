/* global angular: false */
import styles from '../island/island.css';

import compile from './island-ng-class-fixer';

const angularModule = angular.module('Ring.island-ng.header', []);

angularModule.directive('rgIslandContent', function islandContentDirective() {
  return {
    transclude: true,
    replace: true,
    bindToController: {
      fade: '=?'
    },
    compile,
    template: `
<div
  data-test="ring-island-content"
  class=${styles.content}
  ng-class="{
    '${styles.contentWithTopFade}': contentCtrl.fade,
    '${styles.contentWithBottomFade}': contentCtrl.fade
  }"
>
  <div
    class="${styles.scrollableWrapper}"
    ng-transclude
  ></div>
</div>
`,
    controllerAs: 'contentCtrl',
    controller: angular.noop
  };
});

export default angularModule.name;
