import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import './palette.scss';

export default {
  title: 'Style-only|Pallete',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Defines the color palette used for tags and custom fields.',
    hermione: {skip: true},
    a11y: {options: {rules: {'color-contrast': {enabled: false}}}}
  }
};

export const basic = () => {
  angular.module(APP_NAME, []).controller('TestCtrl', function controller() {
    const xrange = num => [...Array(num)].map((val, index) => index);

    this.arr5 = xrange(5);
    this.arr7 = xrange(7);
  });

  return `
      <div ng-controller="TestCtrl as testCtrl">
        <h4>ColorId</h4>
        <div ng-repeat="i in testCtrl.arr5" class="example">
          <div ng-repeat="j in testCtrl.arr7"
            ng-init="colorId = i * 7 + j + 1"
            ng-attr-class="ring-palette_color-{{colorId}}">
            Color {{colorId}}
          </div>
        </div>
        <h4>ToneId and BrightnessId</h4>
        <div class="example" ng-repeat="toneId in testCtrl.arr7">
          <div><b>Tone {{toneId}}:</b></div>
          <div ng-repeat="brightnessId in testCtrl.arr5"
            ng-attr-class="ring-palette_tone-{{toneId}}-{{brightnessId}}">
            Brightness {{brightnessId}}
          </div>
        </div>
      </div>
    `;
};

basic.story = {
  name: 'basic',

  parameters: {
    storyStyles: `
  <style>
    .example {
      margin: 4px;
    }

    .example div {
      width: 90px;
      display: inline-block;
    }
  </style>
        `
  }
};
