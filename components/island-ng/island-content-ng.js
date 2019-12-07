import angular from 'angular';

import styles from '../island/island.css';
import scheduleRAF from '../global/schedule-raf';

import compile from './island-ng-class-fixer';

const scheduleScroll = scheduleRAF();

const angularModule = angular.module('Ring.island-ng.header', []);

angularModule.directive('rgIslandContent', function islandContentDirective() {
  return {
    transclude: true,
    replace: true,
    bindToController: {
      fade: '=?',
      onScroll: '&?'
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
    tabindex="0"
    class="${styles.scrollableWrapper} js-scrollable-wrapper"
    ng-transclude
  ></div>
</div>
`,
    controllerAs: 'contentCtrl',
    controller: function controller($scope, $element) {
      const el = $element[0];

      if (this.onScroll) {
        const scrollable = el.querySelector('.js-scrollable-wrapper');

        const scrollCallback = evt => {
          const $scrollTop = scrollable.scrollTop;
          this.onScroll({$event: evt, $scrollTop});
          $scope.$apply();
        };

        scrollable.addEventListener('scroll', () => scheduleScroll(scrollCallback));
      }
    }
  };
});

export default angularModule.name;
