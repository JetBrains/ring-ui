import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import RingProgressBar from './progress-bar-ng';

const disableAnimations = window.location.search.includes('block-animations');

export default {
  title: 'Legacy Angular/Progress Bar Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Provides an Angular wrapper for Progress Bar.'
  }
};

export const basic = () => {
  angular.
    module(APP_NAME, [RingProgressBar]).
    controller('ExampleCtrl', function controller($interval) {
      this.value = disableAnimations ? 0.5 : 0;

      if (!disableAnimations) {
        $interval(() => {
          const currentValue = this.value;
          this.value = currentValue >= 1 ? 0 : currentValue + 0.1;
        }, 500);
      }
    });
  return `
      <div ng-controller="ExampleCtrl as ctrl">
        <div style="height: 25px; padding-top: 25px;">
          <rg-progress-bar label="'Progress'" value="ctrl.value" class="example-progress"></rg-progress-bar>
        </div>
        <div style="height: 25px; background: #F0F0F0; padding-top: 25px;">
          <rg-progress-bar label="'Progress'" value="ctrl.value" class="example-progress"></rg-progress-bar>
        </div>
      </div>
    `;
};

basic.storyName = 'Progress Bar Ng';

basic.parameters = {
  storyStyles: `
<style>
  .example-progress > * {
    width: 288px;
  }
</style>`
};
