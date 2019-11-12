import angular from 'angular';

import angularDecorator, {APP_NAME} from '../../.storybook/angular-decorator';

import InputNG from './input-ng';

export default {
  title: 'Legacy Angular|Input Ng',
  decorators: [angularDecorator()],

  parameters: {
    notes: 'Text input fields of varying size.'
  }
};

export const basic = () => {
  angular.module(APP_NAME, [InputNG]).controller('InputTestCtrl', function controller() {
    this.inputModel = 'Default value';
  });

  return `
      <div class="inputs" data-test="inputs">
        <rg-input
          size="M"
          label="Type something"
        ></rg-input>
  
        <rg-input
          name="login"
          size="M"
          label="Label and hint"
          placeholder="Hint"
        ></rg-input>
  
        <rg-input
          label="Label and value"
          size="M"
          ng-model="ctrl.inputModel"
        ></rg-input>
  
        <rg-input
          label="Clearable input"
          size="M"
          ng-model="ctrl.inputModel"
          clearable="true"
        ></rg-input>
  
        <rg-input
          placeholder="Hint"
          size="M"
          ng-model="ctrl.inputModel"
          borderless="true"
        ></rg-input>
  
        <rg-input
          label="Active input"
          active="true"
          size="M"
          ng-model="ctrl.inputModel"
        ></rg-input>
  
        <rg-input
          label="Disabled input"
          data-disabled="true"
          size="M"
          ng-model="ctrl.inputModel"
        ></rg-input>
  
        <rg-input
          label="Invalid input"
          size="M"
          error="Error description that wraps over lines because of being really long"
          ng-model="ctrl.inputModel"
        ></rg-input>
  
        <rg-input
          label="Short input"
          size="S"
        ></rg-input>
  
        <rg-input
          label="Long input"
          size="L"
        ></rg-input>
  
        <rg-input
          label="Autogrowing textarea"
          size="M"
          multiline="true"
        ></rg-input>
  
        <div class="dark">
          <rg-input
            label="Input on dark background"
            placeholder="Hint on dark background"
            theme="dark"
          ></rg-input>
        </div>
      </div>
    `;
};

basic.story = {
  name: 'basic',

  parameters: {
    storyStyles: `
  <style>
    .inputs {
      display: flex;
      flex-flow: column wrap;
      max-height: 100vh;
      margin-top: 8px;
    }
    
    .inputs rg-input {
      margin: 0 16px;
    }
    
    .dark {
      background: #000;
      margin-left: 0;
      padding-left: 16px;
    }
  </style>`
  }
};
